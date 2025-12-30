'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "designations" (
        "designation_id"   BIGSERIAL PRIMARY KEY,
        "designation_name" VARCHAR(70) NOT NULL,
        "department_id"    BIGINT REFERENCES "departments"("department_id") ON DELETE SET NULL,
        "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('designations');
  }
};