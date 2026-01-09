'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * 1. Backfill existing bank data into user_bank_accounts
     * Only where bank_account_number exists
     */
    await queryInterface.sequelize.query(`
      INSERT INTO "user_bank_accounts"
        ("user_id", "bank_name", "account_number", "ifsc_code", "is_primary")
      SELECT
        "user_id",
        "bank_name",
        "bank_account_number",
        "ifsc_code",
        TRUE
      FROM "users"
      WHERE "bank_account_number" IS NOT NULL;
    `);

    /**
     * 2. Remove bank columns from users table
     */
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
        DROP COLUMN IF EXISTS "bank_name",
        DROP COLUMN IF EXISTS "bank_account_number",
        DROP COLUMN IF EXISTS "ifsc_code";
    `);
  },

  async down(queryInterface, Sequelize) {
    /**
     * 1. Restore columns on users
     */
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
        ADD COLUMN "bank_name" VARCHAR(100),
        ADD COLUMN "bank_account_number" VARCHAR(30),
        ADD COLUMN "ifsc_code" VARCHAR(11);
    `);

    /**
     * 2. Restore data from primary bank account
     */
    await queryInterface.sequelize.query(`
      UPDATE "users" u
      SET
        "bank_name" = uba."bank_name",
        "bank_account_number" = uba."account_number",
        "ifsc_code" = uba."ifsc_code"
      FROM "user_bank_accounts" uba
      WHERE uba."user_id" = u."user_id"
        AND uba."is_primary" = TRUE;
    `);
  }
};
