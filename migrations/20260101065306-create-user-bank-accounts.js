'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "user_bank_accounts" (
        "bank_account_id" BIGSERIAL PRIMARY KEY,

        "user_id" BIGINT NOT NULL
          REFERENCES "users"("user_id") ON DELETE CASCADE,

        "bank_name" VARCHAR(100) NOT NULL,
        "account_number" VARCHAR(30) NOT NULL,
        "ifsc_code" VARCHAR(11) NOT NULL,
        "account_type" VARCHAR(30),
        "is_primary" BOOLEAN NOT NULL DEFAULT FALSE,

        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        UNIQUE ("user_id", "account_number")
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "user_bank_accounts";
    `);
  }
};
