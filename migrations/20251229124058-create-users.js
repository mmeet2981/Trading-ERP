'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "users" (
        "user_id"              BIGSERIAL PRIMARY KEY,
        "username"             VARCHAR(50) UNIQUE NOT NULL,
        "password"             TEXT NOT NULL,
        "email"                VARCHAR(100) UNIQUE NOT NULL,
        "user_role"            "user_role_enum" NOT NULL,
        "last_login_at"        TIMESTAMPTZ,

        "employee_code"        VARCHAR(30) UNIQUE NOT NULL,
        "first_name"           VARCHAR(50) NOT NULL,
        "middle_name"          VARCHAR(50),
        "last_name"            VARCHAR(50) NOT NULL,
        "full_name"            TEXT GENERATED ALWAYS AS (
                                 TRIM(
                                   "first_name" || ' ' ||
                                   CASE WHEN "middle_name" IS NULL OR "middle_name" = '' THEN '' ELSE "middle_name" || ' ' END ||
                                   "last_name"
                                 )
                               ) STORED,

        "gender"               "gender_enum",
        "date_of_birth"        DATE,
        "blood_group"          VARCHAR(5),
        "marital_status"       VARCHAR(20),

        "mobile_number"        VARCHAR(15) NOT NULL,
        "alternate_mobile"     VARCHAR(15),

        "address_line1"        VARCHAR(100),
        "address_line2"        VARCHAR(100),
        "city"                 VARCHAR(50),
        "taluka"               VARCHAR(50),
        "district"             VARCHAR(50),
        "state"                VARCHAR(50),
        "country"              VARCHAR(50) DEFAULT 'India',
        "pin_code"             VARCHAR(10),

        "aadhaar_number"       VARCHAR(12) UNIQUE,
        "pan_number"           VARCHAR(10) UNIQUE 
                               CHECK ("pan_number" ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
        "uan"                  VARCHAR(12) UNIQUE,
        "pf_number"            VARCHAR(50),
        "esi_number"           VARCHAR(50),

        "bank_name"            VARCHAR(100),
        "bank_account_number"  VARCHAR(30),
        "ifsc_code"            VARCHAR(11),

        "department_id"        BIGINT REFERENCES "departments"("department_id"),
        "designation_id"       BIGINT REFERENCES "designations"("designation_id"),
        "employment_type"      "employment_type_enum" DEFAULT 'full_time',
        "date_of_joining"      DATE NOT NULL,
        "employment_status"    "employment_status_enum" DEFAULT 'active',
        "reporting_manager_id" BIGINT REFERENCES "users"("user_id"),

        "emergency_contact_name"     VARCHAR(100),
        "emergency_contact_relation" VARCHAR(50),
        "emergency_contact_phone"    VARCHAR(15),

        "profile_photo_url"    TEXT,


        "created_by"           BIGINT REFERENCES "users"("user_id"),
        "updated_by"           BIGINT REFERENCES "users"("user_id"),

        "createdAt"            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt"            TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Indexes
      CREATE INDEX "idx_users_email" ON "users"("email");
      CREATE INDEX "idx_users_username" ON "users"("username");
      CREATE INDEX "idx_users_employee_code" ON "users"("employee_code");
      CREATE INDEX "idx_users_mobile_number" ON "users"("mobile_number");
      CREATE INDEX "idx_users_department_id" ON "users"("department_id");
      CREATE INDEX "idx_users_designation_id" ON "users"("designation_id");
      CREATE INDEX "idx_users_reporting_manager_id" ON "users"("reporting_manager_id");
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};