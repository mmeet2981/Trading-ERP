'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Aadhaar
     */
    await queryInterface.sequelize.query(`
      INSERT INTO "user_documents" ("user_id", "document_type", "document_number")
      SELECT "user_id", 'AADHAAR', "aadhaar_number"
      FROM "users"
      WHERE "aadhaar_number" IS NOT NULL;
    `);

    /**
     * PAN
     */
    await queryInterface.sequelize.query(`
      INSERT INTO "user_documents" ("user_id", "document_type", "document_number")
      SELECT "user_id", 'PAN', "pan_number"
      FROM "users"
      WHERE "pan_number" IS NOT NULL;
    `);

    /**
     * UAN
     */
    await queryInterface.sequelize.query(`
      INSERT INTO "user_documents" ("user_id", "document_type", "document_number")
      SELECT "user_id", 'UAN', "uan"
      FROM "users"
      WHERE "uan" IS NOT NULL;
    `);

    /**
     * PF
     */
    await queryInterface.sequelize.query(`
      INSERT INTO "user_documents" ("user_id", "document_type", "document_number")
      SELECT "user_id", 'PF', "pf_number"
      FROM "users"
      WHERE "pf_number" IS NOT NULL;
    `);

    /**
     * ESI
     */
    await queryInterface.sequelize.query(`
      INSERT INTO "user_documents" ("user_id", "document_type", "document_number")
      SELECT "user_id", 'ESI', "esi_number"
      FROM "users"
      WHERE "esi_number" IS NOT NULL;
    `);

    /**
     * Remove document columns from users
     */
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
        DROP COLUMN IF EXISTS "aadhaar_number",
        DROP COLUMN IF EXISTS "pan_number",
        DROP COLUMN IF EXISTS "uan",
        DROP COLUMN IF EXISTS "pf_number",
        DROP COLUMN IF EXISTS "esi_number";
    `);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Restore columns
     */
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
        ADD COLUMN "aadhaar_number" VARCHAR(12),
        ADD COLUMN "pan_number" VARCHAR(10),
        ADD COLUMN "uan" VARCHAR(12),
        ADD COLUMN "pf_number" VARCHAR(50),
        ADD COLUMN "esi_number" VARCHAR(50);
    `);

    /**
     * Restore data
     */
    await queryInterface.sequelize.query(`
      UPDATE "users" u
      SET
        "aadhaar_number" = d."document_number"
      FROM "user_documents" d
      WHERE d."user_id" = u."user_id"
        AND d."document_type" = 'AADHAAR';
    `);

    await queryInterface.sequelize.query(`
      UPDATE "users" u
      SET
        "pan_number" = d."document_number"
      FROM "user_documents" d
      WHERE d."user_id" = u."user_id"
        AND d."document_type" = 'PAN';
    `);

    await queryInterface.sequelize.query(`
      UPDATE "users" u
      SET
        "uan" = d."document_number"
      FROM "user_documents" d
      WHERE d."user_id" = u."user_id"
        AND d."document_type" = 'UAN';
    `);

    await queryInterface.sequelize.query(`
      UPDATE "users" u
      SET
        "pf_number" = d."document_number"
      FROM "user_documents" d
      WHERE d."user_id" = u."user_id"
        AND d."document_type" = 'PF';
    `);

    await queryInterface.sequelize.query(`
      UPDATE "users" u
      SET
        "esi_number" = d."document_number"
      FROM "user_documents" d
      WHERE d."user_id" = u."user_id"
        AND d."document_type" = 'ESI';
    `);
  }
};
