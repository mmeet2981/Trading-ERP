'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('manager', 'sales', 'account', 'worker', 'admin_manager');
      CREATE TYPE "employment_status_enum" AS ENUM ('active', 'suspended', 'resigned', 'terminated');
      CREATE TYPE "employment_type_enum" AS ENUM ('full_time', 'part_time', 'contract', 'intern');
      CREATE TYPE "gender_enum" AS ENUM ('male', 'female', 'other');
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "user_role_enum";
      DROP TYPE IF EXISTS "employment_status_enum";
      DROP TYPE IF EXISTS "employment_type_enum";
      DROP TYPE IF EXISTS "gender_enum";
    `);
  }
};