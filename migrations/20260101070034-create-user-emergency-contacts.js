'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "user_emergency_contacts" (
        "contact_id" BIGSERIAL PRIMARY KEY,

        "user_id" BIGINT NOT NULL
          REFERENCES "users"("user_id") ON DELETE CASCADE,

        "name" VARCHAR(100) NOT NULL,
        "relation" VARCHAR(50),
        "phone" VARCHAR(15) NOT NULL,
        "is_primary" BOOLEAN NOT NULL DEFAULT FALSE,

        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "user_emergency_contacts";
    `);
  }
};
