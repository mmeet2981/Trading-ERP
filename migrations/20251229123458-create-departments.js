'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "departments" (
        "department_id"   BIGSERIAL PRIMARY KEY,
        "department_name" VARCHAR(50) UNIQUE NOT NULL,
        "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('departments');
  }
};