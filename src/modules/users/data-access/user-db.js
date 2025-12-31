'use strict';

const TABLE_NAME = "users";

module.exports = function ({ db, UnknownError }) {
  return {
    findByEmailOrUsernameOrCode,
    findExistingUser,
    createUser,
    findUserById,
    updateUser,
    findByUsernameOrEmail,
    updateLastLogin,
    getUsers,
  };
  async function getUsers({ page, limit, search, role, department_id, logger }) {
    try {
      // Calculate offset
      const offset = (page - 1) * limit;
      
      // Build WHERE conditions
      const conditions = ['u.is_deleted = false'];
      const params = [];
      let paramCount = 1;
  
      // Add search condition
      if (search) {
        conditions.push(`(
          u.username ILIKE $${paramCount} OR 
          u.email ILIKE $${paramCount} OR 
          u.full_name ILIKE $${paramCount} OR 
          u.employee_code ILIKE $${paramCount} OR
          u.first_name ILIKE $${paramCount} OR
          u.last_name ILIKE $${paramCount}
        )`);
        params.push(`%${search}%`);
        paramCount++;
      }
  
      // Add role filter
      if (role) {
        conditions.push(`u.user_role = $${paramCount}`);
        params.push(role);
        paramCount++;
      }
  
      // Add department filter
      if (department_id) {
        conditions.push(`u.department_id = $${paramCount}`);
        params.push(department_id);
        paramCount++;
      }
  
      // Build WHERE clause
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
      // Query for users with pagination
      const sql = `
        SELECT 
          u.user_id,
          u.username,
          u.email,
          u.employee_code,
          u.full_name,
          u.first_name,
          u.middle_name,
          u.last_name,
          u.gender,
          u.date_of_birth,
          u.mobile_number,
          u.user_role,
          u.is_admin,
          u.employment_status,
          u.employment_type,
          u.date_of_joining,
          u.country,
          u.marital_status,
          u.created_by,
          u.updated_by,
          u."createdAt",
          u."updatedAt",
          u.last_login_at,
          d.name as department_name,
          desg.name as designation_name,
          rm.full_name as reporting_manager_name
        FROM "users" u
        LEFT JOIN "departments" d ON u.department_id = d.department_id
        LEFT JOIN "designations" desg ON u.designation_id = desg.designation_id
        LEFT JOIN "users" rm ON u.reporting_manager_id = rm.user_id
        ${whereClause}
        ORDER BY u."createdAt" DESC
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;
  
      params.push(limit, offset);
      
      const { rows: users } = await db.query(sql, params);
  
      // Query for total count
      const countSql = `
        SELECT COUNT(*) as total_count
        FROM "users" u
        ${whereClause}
      `;
  
      // Remove limit/offset params for count query
      const countParams = params.slice(0, params.length - 2);
      const { rows: countResult } = await db.query(countSql, countParams);
      const totalCount = parseInt(countResult[0].total_count);
  
      return {
        rows: users,
        totalCount
      };
    } catch (err) {
      logger?.error(err, "Error in getUsers");
      throw new UnknownError("Database error while fetching users");
    }
  }

  async function findByEmailOrUsernameOrCode({ email, username, employee_code, logger }) {
    try {
      // Handle null employee_code properly
      let sql = `
        SELECT user_id, email, username, employee_code 
        FROM "users" 
        WHERE email = $1 OR username = $2
      `;
      const params = [email, username];
      
      // Only check employee_code if it's provided (not null)
      if (employee_code !== null && employee_code !== undefined && employee_code !== '') {
        sql += ` OR employee_code = $3`;
        params.push(employee_code);
      }

      sql += ` LIMIT 1`;

      const { rows } = await db.query(sql, params);

      return rows[0] || null;
    } catch (err) {
      logger?.error(err, "Error in findByEmailOrUsernameOrCode");
      throw new UnknownError("Database error while checking user existence");
    }
  }

  async function findExistingUser({ email, username, mobile_number, logger }) {
    try {
      const sql = `
        SELECT user_id, email, username, mobile_number 
        FROM "users" 
        WHERE email = $1 OR username = $2 OR mobile_number = $3
        LIMIT 1
      `;

      const { rows } = await db.query(sql, [email, username, mobile_number]);

      return rows[0] || null;
    } catch (err) {
      logger?.error(err, "Error in findExistingUser");
      throw new UnknownError("Database error while checking user existence");
    }
  }

  async function createUser({ userData, logger }) {
    try {
      // Build dynamic INSERT based on provided fields
      const fields = [];
      const values = [];
      let paramCount = 1;

      // Helper function to add field if it exists in userData
      const addField = (fieldName, fieldValue, defaultValue = null) => {
        if (fieldValue !== undefined && fieldValue !== null) {
          fields.push(fieldName);
          values.push(fieldValue);
          return `$${paramCount++}`;
        } else if (defaultValue !== undefined) {
          fields.push(fieldName);
          values.push(defaultValue);
          return `$${paramCount++}`;
        }
        return null;
      };

      // Required fields (should always be present)
      addField('username', userData.username);
      addField('password', userData.password);
      addField('email', userData.email);
      addField('first_name', userData.first_name);
      addField('last_name', userData.last_name);
      addField('mobile_number', userData.mobile_number);
      
      // Optional fields with defaults
      addField('user_role', userData.user_role, 'worker');
      addField('employee_code', userData.employee_code);
      addField('middle_name', userData.middle_name);
      addField('gender', userData.gender);
      addField('date_of_birth', userData.date_of_birth);
      addField('employment_type', userData.employment_type, 'full_time');
      addField('date_of_joining', userData.date_of_joining, new Date().toISOString().split('T')[0]);
      addField('employment_status', userData.employment_status, 'active');
      addField('marital_status', userData.marital_status, 'single');
      addField('country', userData.country, 'India');
      addField('created_by', userData.created_by);
      addField('updated_by', userData.updated_by);
      addField('is_admin', userData.is_admin, false);
      addField('is_deleted', userData.is_deleted, false);

      // Build SQL
      const placeholders = Array.from({ length: values.length }, (_, i) => `$${i + 1}`).join(', ');
      const sql = `
        INSERT INTO "users" (${fields.join(', ')})
        VALUES (${placeholders})
        RETURNING 
          user_id, username, email, employee_code, full_name, user_role,
          first_name, last_name, gender, date_of_birth, mobile_number,
          employment_status, date_of_joining, "createdAt"
      `;

      const { rows } = await db.query(sql, values);

      if (!rows || rows.length === 0) {
        throw new Error("Insert failed - no row returned");
      }

      return rows[0];
    } catch (err) {
      logger?.error(err, "Error creating user in DB");
      
      if (err.code === '23505') {
        const detail = err.detail || '';
        if (detail.includes('email')) throw new UnknownError("Email already exists");
        if (detail.includes('username')) throw new UnknownError("Username already exists");
        if (detail.includes('employee_code')) throw new UnknownError("Employee code already exists");
        if (detail.includes('mobile_number')) throw new UnknownError("Mobile number already exists");
      }
      
      throw new UnknownError("Failed to create user in database: " + (err.message || "Unknown error"));
    }
  }

  async function findUserById({ user_id, logger }) {
    try {
      const sql = `
        SELECT user_id, username, email, employee_code, full_name, user_role,
          first_name, last_name, middle_name, gender, date_of_birth, mobile_number,
          department_id, designation_id, employment_status, employment_type,
          date_of_joining, reporting_manager_id, country, marital_status,
          is_admin, is_deleted, "createdAt", "updatedAt"
        FROM "users" 
        WHERE user_id = $1 AND is_deleted = false
        LIMIT 1
      `;

      const { rows } = await db.query(sql, [user_id]);

      return rows[0] || null;
    } catch (err) {
      logger?.error(err, "Error in findUserById");
      throw new UnknownError("Database error while fetching user");
    }
  }

  async function updateUser({ user_id, userData, updatedBy, logger }) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      // Helper function to add field if it exists in userData
      const addField = (fieldName, fieldValue) => {
        if (fieldValue !== undefined && fieldValue !== null) {
          fields.push(`${fieldName} = $${paramCount++}`);
          values.push(fieldValue);
        }
      };

      // Add updatable fields
      addField('username', userData.username);
      addField('email', userData.email);
      addField('first_name', userData.first_name);
      addField('middle_name', userData.middle_name);
      addField('last_name', userData.last_name);
      addField('gender', userData.gender);
      addField('date_of_birth', userData.date_of_birth);
      addField('mobile_number', userData.mobile_number);
      addField('employee_code', userData.employee_code);
      addField('department_id', userData.department_id);
      addField('designation_id', userData.designation_id);
      addField('employment_type', userData.employment_type);
      addField('employment_status', userData.employment_status);
      addField('date_of_joining', userData.date_of_joining);
      addField('reporting_manager_id', userData.reporting_manager_id);
      addField('user_role', userData.user_role);
      addField('country', userData.country);
      addField('marital_status', userData.marital_status);
      addField('is_admin', userData.is_admin);

      // If password is provided, hash it
      if (userData.password) {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        addField('password', hashedPassword);
      }

      // Always update updated_by and updatedAt
      addField('updated_by', updatedBy);
      addField('updatedAt', new Date());

      if (fields.length === 0) {
        throw new UnknownError("No fields to update");
      }

      // Add user_id to values for WHERE clause
      values.push(user_id);

      const sql = `
        UPDATE "users" 
        SET ${fields.join(', ')}
        WHERE user_id = $${paramCount} AND is_deleted = false
        RETURNING 
          user_id, username, email, employee_code, full_name, user_role,
          first_name, last_name, middle_name, gender, date_of_birth, mobile_number,
          department_id, designation_id, employment_status, employment_type,
          date_of_joining, reporting_manager_id, country, marital_status,
          is_admin, "createdAt", "updatedAt"
      `;

      const { rows } = await db.query(sql, values);

      if (!rows || rows.length === 0) {
        throw new UnknownError("User not found or already deleted");
      }

      return rows[0];
    } catch (err) {
      logger?.error(err, "Error updating user in DB");
      
      if (err.code === '23505') {
        const detail = err.detail || '';
        if (detail.includes('email')) throw new UnknownError("Email already exists");
        if (detail.includes('username')) throw new UnknownError("Username already exists");
        if (detail.includes('employee_code')) throw new UnknownError("Employee code already exists");
        if (detail.includes('mobile_number')) throw new UnknownError("Mobile number already exists");
      }
      
      if (err.message && err.message.includes("User not found")) {
        throw err;
      }
      
      throw new UnknownError("Failed to update user in database: " + (err.message || "Unknown error"));
    }
  }

  async function findByUsernameOrEmail({ username_or_email, logger }) {
    try {
      const sql = `
        SELECT 
          user_id, username, email, password, full_name, first_name, last_name,
          user_role, is_admin, is_deleted, profile_photo_url, employee_code
        FROM "users" 
        WHERE (username = $1 OR email = $1) AND is_deleted = false
        LIMIT 1
      `;

      const { rows } = await db.query(sql, [username_or_email.toLowerCase()]);

      return rows[0] || null;
    } catch (err) {
      logger?.error(err, "Error in findByUsernameOrEmail");
      throw new UnknownError("Database error while fetching user");
    }
  }

  async function updateLastLogin({ user_id, logger }) {
    try {
      const sql = `
        UPDATE "users" 
        SET last_login_at = NOW()
        WHERE user_id = $1
        RETURNING user_id, last_login_at
      `;

      const { rows } = await db.query(sql, [user_id]);

      return rows[0] || null;
    } catch (err) {
      logger?.error(err, "Error in updateLastLogin");
      throw new UnknownError("Database error while updating last login");
    }
  }
};