'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "role_permissions" (
        "role_id"       BIGINT REFERENCES "roles"("role_id") ON DELETE CASCADE,
        "permission_id" BIGINT REFERENCES "permissions"("permission_id") ON DELETE CASCADE,
        "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY ("role_id", "permission_id")
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('role_permissions');
  }
};