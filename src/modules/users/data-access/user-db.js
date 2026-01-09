'use strict';

module.exports = function ({ sequelize }) {
  return {
    findExistingUser,
    createUser,
    findUserById,
    updateUser,
    findByUsernameOrEmail,
    updateLastLogin,
    getUsers,
    findByEmailOrUsernameOrCode,
  };

  /* ---------------------------------------------------- */
  /* Helpers                                              */
  /* ---------------------------------------------------- */

  async function getDefaultEmploymentTypeId() {
    const [row] = await sequelize.query(
      `
      SELECT employment_type_id
      FROM employment_types
      WHERE name = 'full_time'
      LIMIT 1
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    if (!row) {
      // CHANGED: throw plain Error
      throw new Error("Default employment type 'full_time' not found");
    }

    return row.employment_type_id;
  }

  /* ---------------------------------------------------- */
  /* Get Users                                            */
  /* ---------------------------------------------------- */

  async function getUsers({ page, limit, search, role_id, department_id, logger }) {
    try {
      const offset = (page - 1) * limit;
      const conditions = ['u.is_deleted = false'];
      const params = [];
      let pc = 1;

      if (search) {
        conditions.push(`
          (
            u.username ILIKE $${pc}
            OR u.email ILIKE $${pc}
            OR u.full_name ILIKE $${pc}
            OR u.employee_code ILIKE $${pc}
          )
        `);
        params.push(`%${search}%`);
        pc++;
      }

      if (department_id) {
        conditions.push(`u.department_id = $${pc}`);
        params.push(department_id);
        pc++;
      }

      if (role_id) {
        conditions.push(`EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = u.user_id AND ur.role_id = $${pc})`);
        params.push(role_id);
        pc++;
      }

      const whereClause = `WHERE ${conditions.join(' AND ')}`;

      const sql = `
        SELECT
          u.user_id,
          u.username,
          u.email,
          u.employee_code,
          u.full_name,
          u.mobile_number,
          u.employment_status,
          u.date_of_joining,
          u.is_admin,
          u.last_login_at,
          et.name AS employment_type,
          d.department_name,
          desg.designation_name,
          rm.full_name AS reporting_manager_name
        FROM users u
        LEFT JOIN employment_types et ON et.employment_type_id = u.employment_type_id
        LEFT JOIN departments d ON d.department_id = u.department_id
        LEFT JOIN designations desg ON desg.designation_id = u.designation_id
        LEFT JOIN users rm ON rm.user_id = u.reporting_manager_id
        ${whereClause}
        ORDER BY u."createdAt" DESC
        LIMIT $${pc} OFFSET $${pc + 1}
      `;

      params.push(limit, offset);

      const rows = await sequelize.query(sql, {
        bind: params,
        type: sequelize.QueryTypes.SELECT,
      });

      const countSql = `
        SELECT COUNT(DISTINCT u.user_id) AS total_count
        FROM users u
        ${whereClause}
      `;

      const countParams = params.slice(0, params.length - 2);
      const countResult = await sequelize.query(countSql, {
        bind: countParams,
        type: sequelize.QueryTypes.SELECT,
      });

      return {
        rows,
        totalCount: Number(countResult[0].total_count),
      };
    } catch (err) {
      logger?.error(err);
      // CHANGED: rethrow original error
      throw err;
    }
  }

  /* ---------------------------------------------------- */
  /* Auth / Lookup                                        */
  /* ---------------------------------------------------- */

  async function findByUsernameOrEmail({ username_or_email, logger }) {
    try {
      const sql = `
        SELECT
          user_id, username, email, password,
          is_admin, is_deleted, employee_code
        FROM users
        WHERE (username = $1 OR email = $1)
          AND is_deleted = false
        LIMIT 1
      `;

      const result = await sequelize.query(sql, {
        bind: [username_or_email],
        type: sequelize.QueryTypes.SELECT,
      });

      return result[0] || null;
    } catch (err) {
      logger?.error(err);
      throw err; // CHANGED
    }
  }

  async function findExistingUser({ email, username, mobile_number, logger }) {
    try {
      const sql = `
        SELECT user_id, email, username, mobile_number
        FROM users
        WHERE email = $1
          OR username = $2
          OR mobile_number = $3
        LIMIT 1
      `;

      const result = await sequelize.query(sql, {
        bind: [email, username, mobile_number],
        type: sequelize.QueryTypes.SELECT,
      });

      return result[0] || null;
    } catch (err) {
      logger?.error(err);
      throw err; // CHANGED
    }
  }

  async function findByEmailOrUsernameOrCode({ email, username, employee_code, logger }) {
    try {
      const conditions = [];
      const params = [];
      let pc = 1;

      if (email) {
        conditions.push(`email = $${pc}`);
        params.push(email);
        pc++;
      }
      if (username) {
        conditions.push(`username = $${pc}`);
        params.push(username);
        pc++;
      }
      if (employee_code) {
        conditions.push(`employee_code = $${pc}`);
        params.push(employee_code);
        pc++;
      }

      const whereClause = conditions.length
        ? `WHERE (${conditions.join(' OR ')}) AND is_deleted = false`
        : `WHERE is_deleted = false`;

      const sql = `
        SELECT user_id, email, username, employee_code
        FROM users
        ${whereClause}
        LIMIT 1
      `;

      const result = await sequelize.query(sql, {
        bind: params,
        type: sequelize.QueryTypes.SELECT,
      });

      return result[0] || null;
    } catch (err) {
      logger?.error(err);
      throw err; // CHANGED
    }
  }

  /* ---------------------------------------------------- */
  /* Create User                                          */
  /* ---------------------------------------------------- */

  async function createUser({ userData, logger }) {
    try {
      const employmentTypeId =
        userData.employment_type_id || (await getDefaultEmploymentTypeId());

      const fields = [];
      const values = [];

      const add = (k, v) => {
        if (v !== undefined && v !== null && v !== '') {
          fields.push(k);
          values.push(v);
        }
      };

      add('username', userData.username);
      add('password', userData.password);
      add('email', userData.email);
      add('employee_code', userData.employee_code);
      add('first_name', userData.first_name);
      add('middle_name', userData.middle_name);
      add('last_name', userData.last_name);
      add('gender', userData.gender);
      add('date_of_birth', userData.date_of_birth);
      add('blood_group', userData.blood_group);
      add('marital_status', userData.marital_status);
      add('mobile_number', userData.mobile_number);
      add('alternate_mobile', userData.alternate_mobile);
      add('address_line1', userData.address_line1);
      add('address_line2', userData.address_line2);
      add('city', userData.city);
      add('taluka', userData.taluka);
      add('district', userData.district);
      add('state', userData.state);
      add('country', userData.country || 'India');
      add('pin_code', userData.pin_code);
      add('department_id', userData.department_id);
      add('designation_id', userData.designation_id);
      add('date_of_joining', userData.date_of_joining);
      add('employment_status', userData.employment_status || 'active');
      add('reporting_manager_id', userData.reporting_manager_id);
      add('profile_photo_url', userData.profile_photo_url);
      add('is_admin', userData.is_admin || false);
      add('employment_type_id', employmentTypeId);
      add('created_by', userData.created_by);
      add('updated_by', userData.updated_by);

      const sql = `
        INSERT INTO users (${fields.join(', ')})
        VALUES (${fields.map((_, i) => `$${i + 1}`).join(', ')})
        RETURNING user_id, username, email, employee_code, full_name,
                  first_name, last_name, mobile_number, department_id,
                  designation_id, employment_status, date_of_joining
      `;

      const result = await sequelize.query(sql, {
        bind: values,
        type: sequelize.QueryTypes.INSERT,
      });

      return result[0][0];
    } catch (err) {
      logger?.error(err);
      // CHANGED: do NOT wrap, just rethrow
      throw err;
    }
  }

  /* ---------------------------------------------------- */
  /* Find / Update                                        */
  /* ---------------------------------------------------- */

  async function findUserById({ user_id, logger }) {
    try {
      const sql = `
      SELECT
        u.user_id,
        u.username,
        u.email,
        u.employee_code,
        u.first_name,
        u.middle_name,
        u.last_name,
        u.full_name,
        u.gender,
        u.date_of_birth,
        u.blood_group,
        u.marital_status,
        u.mobile_number,
        u.alternate_mobile,
        u.address_line1,
        u.address_line2,
        u.city,
        u.taluka,
        u.district,
        u.state,
        u.country,
        u.pin_code,
        u.department_id,
        d.department_name,
        u.designation_id,
        desg.designation_name,
        u.date_of_joining,
        u.employment_status,
        u.employment_type_id,
        et.name AS employment_type,
        u.reporting_manager_id,
        rm.full_name AS reporting_manager_name,
        u.profile_photo_url,
        u.is_admin,
        u.last_login_at,
        u."createdAt",
        u."updatedAt"
      FROM users u
      LEFT JOIN departments d ON d.department_id = u.department_id
      LEFT JOIN designations desg ON desg.designation_id = u.designation_id
      LEFT JOIN employment_types et ON et.employment_type_id = u.employment_type_id
      LEFT JOIN users rm ON rm.user_id = u.reporting_manager_id
      WHERE u.user_id = $1
        AND u.is_deleted = false
      LIMIT 1
    `;

      const [user] = await sequelize.query(sql, {
        bind: [user_id],
        type: sequelize.QueryTypes.SELECT,
      });

      return user || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }


  async function updateUser({ user_id, userData, updatedBy, logger }) {
    try {
      const fields = [];
      const values = [];
      let pc = 1;

      const add = (k, v) => {
        if (v !== undefined) {
          fields.push(`${k} = $${pc}`);
          values.push(v);
          pc++;
        }
      };

      add('username', userData.username);
      add('email', userData.email);
      add('employee_code', userData.employee_code);
      add('first_name', userData.first_name);
      add('middle_name', userData.middle_name);
      add('last_name', userData.last_name);
      add('gender', userData.gender);
      add('date_of_birth', userData.date_of_birth);
      add('blood_group', userData.blood_group);
      add('marital_status', userData.marital_status);
      add('mobile_number', userData.mobile_number);
      add('alternate_mobile', userData.alternate_mobile);
      add('address_line1', userData.address_line1);
      add('address_line2', userData.address_line2);
      add('city', userData.city);
      add('taluka', userData.taluka);
      add('district', userData.district);
      add('state', userData.state);
      add('country', userData.country);
      add('pin_code', userData.pin_code);
      add('department_id', userData.department_id);
      add('designation_id', userData.designation_id);
      add('employment_type_id', userData.employment_type_id);
      add('employment_status', userData.employment_status);
      add('date_of_joining', userData.date_of_joining);
      add('reporting_manager_id', userData.reporting_manager_id);
      add('profile_photo_url', userData.profile_photo_url);
      add('is_admin', userData.is_admin);

      add('updated_by', updatedBy);


      if (!fields.length) {
        throw new Error('No fields to update');
      }

      const sql = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE user_id = $${pc}
        AND is_deleted = false
      RETURNING
        user_id, username, email, employee_code,
        first_name, last_name, mobile_number,
        department_id, designation_id,
        employment_status, "updatedAt"
    `;

      values.push(user_id);

      const result = await sequelize.query(sql, {
        bind: values,
        type: sequelize.QueryTypes.UPDATE,
      });

      return result[0][0] || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }


  async function updateLastLogin({ user_id, logger }) {
    try {
      const sql = `
        UPDATE users
        SET last_login_at = NOW()
        WHERE user_id = $1
        RETURNING user_id, last_login_at
      `;

      const result = await sequelize.query(sql, {
        bind: [user_id],
        type: sequelize.QueryTypes.UPDATE,
      });

      return result[0][0] || null;
    } catch (err) {
      logger?.error(err);
      throw err; // CHANGED
    }
  }
};
