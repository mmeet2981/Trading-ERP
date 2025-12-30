'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "user_roles" (
        "user_id" BIGINT REFERENCES "users"("user_id") ON DELETE CASCADE,
        "role_id" BIGINT REFERENCES "roles"("role_id") ON DELETE CASCADE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY ("user_id", "role_id")
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_roles');
  }
};