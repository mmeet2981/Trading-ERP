'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
        ADD COLUMN "is_admin"   BOOLEAN NOT NULL DEFAULT FALSE,
        ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
        DROP COLUMN IF EXISTS "is_admin",
        DROP COLUMN IF EXISTS "is_deleted";
    `);
  }
};
