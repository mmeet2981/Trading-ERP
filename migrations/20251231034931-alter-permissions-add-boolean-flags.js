'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "permissions"
        DROP COLUMN IF EXISTS "action",

        ADD COLUMN "can_create"    BOOLEAN NOT NULL DEFAULT FALSE,
        ADD COLUMN "can_view"      BOOLEAN NOT NULL DEFAULT FALSE,
        ADD COLUMN "can_update"    BOOLEAN NOT NULL DEFAULT FALSE,
        ADD COLUMN "can_delete"    BOOLEAN NOT NULL DEFAULT FALSE,
        ADD COLUMN "can_authorize" BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "permissions"
        DROP COLUMN IF EXISTS "can_create",
        DROP COLUMN IF EXISTS "can_view",
        DROP COLUMN IF EXISTS "can_update",
        DROP COLUMN IF EXISTS "can_delete",
        DROP COLUMN IF EXISTS "can_authorize",

        ADD COLUMN "action" VARCHAR(50) UNIQUE NOT NULL;
    `);
  }
};
