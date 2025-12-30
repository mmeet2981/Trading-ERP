'use strict';

const TABLE_NAME = "users";

module.exports = function ({ db, UnknownError }) {
  return {
    findByEmailOrUsernameOrCode,
    createUser,
  };

  async function findByEmailOrUsernameOrCode({ email, username, employee_code, logger }) {
    try {
      const sql = `
        SELECT user_id, email, username, employee_code 
        FROM "users" 
        WHERE email = $1 OR username = $2 OR employee_code = $3
        LIMIT 1
      `;

      const { rows } = await db.query(sql, [email, username, employee_code]);

      return rows[0] || null;
    } catch (err) {
      logger?.error(err, "Error in findByEmailOrUsernameOrCode");
      throw new UnknownError("Database error while checking user existence");
    }
  }

  async function createUser({ userData, logger }) {
    try {
      const {
        username, password, email, user_role, employee_code,
        first_name, middle_name, last_name, gender, date_of_birth,
        blood_group, marital_status, mobile_number, alternate_mobile,
        address_line1, address_line2, city, taluka, district, state,
        country = "India", pin_code,
        aadhaar_number, pan_number, uan, pf_number, esi_number,
        bank_name, bank_account_number, ifsc_code,
        department_id, designation_id, employment_type,
        date_of_joining, employment_status = "active",
        reporting_manager_id,
        emergency_contact_name, emergency_contact_relation, emergency_contact_phone,
        profile_photo_url,
        created_by, updated_by,
      } = userData;

      const sql = `
        INSERT INTO "users" (
          username, password, email, user_role, employee_code,
          first_name, middle_name, last_name, gender, date_of_birth,
          blood_group, marital_status, mobile_number, alternate_mobile,
          address_line1, address_line2, city, taluka, district, state,
          country, pin_code, aadhaar_number, pan_number, uan,
          pf_number, esi_number, bank_name, bank_account_number, ifsc_code,
          department_id, designation_id, employment_type, date_of_joining,
          employment_status, reporting_manager_id,
          emergency_contact_name, emergency_contact_relation, emergency_contact_phone,
          profile_photo_url, created_by, updated_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
          $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42
        )
        RETURNING 
          user_id, username, email, employee_code, full_name, user_role,
          department_id, designation_id, employment_status, date_of_joining, "createdAt"
      `;

      const values = [
        username, password, email, user_role, employee_code,
        first_name, middle_name ?? null, last_name, gender ?? null, date_of_birth ?? null,
        blood_group ?? null, marital_status ?? null, mobile_number, alternate_mobile ?? null,
        address_line1 ?? null, address_line2 ?? null, city ?? null, taluka ?? null,
        district ?? null, state ?? null, country, pin_code ?? null,
        aadhaar_number ?? null, pan_number ?? null, uan ?? null,
        pf_number ?? null, esi_number ?? null, bank_name ?? null,
        bank_account_number ?? null, ifsc_code ?? null,
        department_id ?? null, designation_id ?? null, employment_type,
        date_of_joining, employment_status, reporting_manager_id ?? null,
        emergency_contact_name ?? null, emergency_contact_relation ?? null,
        emergency_contact_phone ?? null, profile_photo_url ?? null,
        created_by, updated_by
      ];

      const { rows } = await db.query(sql, values);

      if (!rows || rows.length === 0) {
        throw new Error("Insert failed - no row returned");
      }

      return rows[0];
    } catch (err) {
      logger?.error(err, "Error creating user in DB");
      throw new UnknownError("Failed to create user in database");
    }
  }
};