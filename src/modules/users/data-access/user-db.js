'use strict';

module.exports = function ({ sequelize, UnknownError }) {
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
      throw new UnknownError("Default employment type 'full_time' not found");
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
      throw new UnknownError("Failed to fetch users");
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
      throw new UnknownError("Login lookup failed");
    }
  }

  async function findExistingUser({ email, username, mobile_number, logger }) {
    try {
      const sql = `
        SELECT user_id
        FROM users
        WHERE email = $1 OR username = $2 OR mobile_number = $3
        LIMIT 1
      `;

      const result = await sequelize.query(sql, {
        bind: [email, username, mobile_number],
        type: sequelize.QueryTypes.SELECT,
      });

      return result[0] || null;
    } catch (err) {
      logger?.error(err);
      throw new UnknownError("Database error while checking user existence");
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

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' OR ')}` : '';

      const sql = `
        SELECT user_id, email, username, employee_code
        FROM users
        ${whereClause}
          AND is_deleted = false
        LIMIT 1
      `;

      const result = await sequelize.query(sql, {
        bind: params,
        type: sequelize.QueryTypes.SELECT,
      });

      return result[0] || null;
    } catch (err) {
      logger?.error(err);
      throw new UnknownError("Database error while checking user existence");
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
        RETURNING user_id, username, email, employee_code, full_name, first_name, last_name,
                  mobile_number, department_id, designation_id, employment_status, date_of_joining
      `;
  
      const result = await sequelize.query(sql, {
        bind: values,
        type: sequelize.QueryTypes.INSERT,
      });
  
      return result[0][0];
    } catch (err) {
      logger?.error(err);
  
      /**
       * Handle PostgreSQL unique constraint violations (23505)
       * This MUST be handled here, not in controller
       */
      if (err.name === 'SequelizeUniqueConstraintError' || err.parent?.code === '23505') {
        const detail = err.parent?.detail || '';
  
        if (detail.includes('(username)')) {
          throw new UnknownError('Username already exists');
        }
        if (detail.includes('(email)')) {
          throw new UnknownError('Email already exists');
        }
        if (detail.includes('(mobile_number)')) {
          throw new UnknownError('Mobile number already exists');
        }
        if (detail.includes('(employee_code)')) {
          throw new UnknownError('Employee code already exists');
        }
  
        throw new UnknownError('Duplicate value violates unique constraint');
      }
  
      throw new UnknownError('User creation failed');
    }
  }
  

  /* ---------------------------------------------------- */
  /* Find / Update                                        */
  /* ---------------------------------------------------- */

  async function findUserById({ user_id, logger }) {
    try {
      const sql = `
        SELECT u.*, et.name AS employment_type
        FROM users u
        LEFT JOIN employment_types et
          ON et.employment_type_id = u.employment_type_id
        WHERE u.user_id = $1 AND u.is_deleted = false
      `;

      const result = await sequelize.query(sql, {
        bind: [user_id],
        type: sequelize.QueryTypes.SELECT,
      });

      return result[0] || null;
    } catch (err) {
      logger?.error(err);
      throw new UnknownError("Failed to fetch user");
    }
  }

  async function updateUser({ user_id, userData, updatedBy, logger }) {
    try {
      const fields = [];
      const values = [];
      let pc = 1;

      const add = (k, v) => {
        if (v !== undefined && v !== null && v !== '') {
          fields.push(`${k} = $${pc++}`);
          values.push(v);
        }
      };

      add('username', userData.username);
      add('email', userData.email);
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
      add('employee_code', userData.employee_code);
      add('department_id', userData.department_id);
      add('designation_id', userData.designation_id);
      add('employment_type_id', userData.employment_type_id);
      add('employment_status', userData.employment_status);
      add('date_of_joining', userData.date_of_joining);
      add('reporting_manager_id', userData.reporting_manager_id);
      add('profile_photo_url', userData.profile_photo_url);
      add('is_admin', userData.is_admin);

      if (userData.password) {
        const bcrypt = require('bcrypt');
        add('password', await bcrypt.hash(userData.password, 10));
      }

      add('updated_by', updatedBy);
      add('updatedAt', new Date());

      if (!fields.length) {
        throw new UnknownError("No fields to update");
      }

      values.push(user_id);

      const sql = `
        UPDATE users
        SET ${fields.join(', ')}
        WHERE user_id = $${pc} AND is_deleted = false
        RETURNING user_id, username, email, employee_code, full_name
      `;

      const result = await sequelize.query(sql, {
        bind: values,
        type: sequelize.QueryTypes.UPDATE,
      });

      if (!result[0]?.length) {
        throw new UnknownError("User not found or deleted");
      }

      return result[0][0];
    } catch (err) {
      logger?.error(err);
      throw new UnknownError("User update failed");
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
      throw new UnknownError("Failed to update last login");
    }
  }
};