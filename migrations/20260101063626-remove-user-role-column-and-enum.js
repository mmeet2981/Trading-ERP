'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "user_role";
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "user_role_enum";
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TYPE "user_role_enum" AS ENUM (
        'manager',
        'sales',
        'account',
        'worker',
        'admin_manager'
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      ADD COLUMN "user_role" "user_role_enum" NOT NULL DEFAULT 'worker';
    `);
  }
};
