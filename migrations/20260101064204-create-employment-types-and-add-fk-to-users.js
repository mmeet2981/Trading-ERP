'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create employment_types master table
    await queryInterface.sequelize.query(`
      CREATE TABLE "employment_types" (
        "employment_type_id" BIGSERIAL PRIMARY KEY,
        "name" VARCHAR(50) UNIQUE NOT NULL,
        "description" TEXT,
        "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 2. Add FK column to users (nullable for now)
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      ADD COLUMN "employment_type_id" BIGINT
      REFERENCES "employment_types"("employment_type_id");
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "employment_type_id";
    `);

    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "employment_types";
    `);
  }
};
