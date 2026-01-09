'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "user_documents" (
        "document_id" BIGSERIAL PRIMARY KEY,

        "user_id" BIGINT NOT NULL
          REFERENCES "users"("user_id") ON DELETE CASCADE,

        "document_type" VARCHAR(50) NOT NULL,
        "document_number" VARCHAR(50),
        "document_url" TEXT,
        "issued_by" VARCHAR(100),
        "expiry_date" DATE,

        "is_verified" BOOLEAN NOT NULL DEFAULT FALSE,
        "verified_at" TIMESTAMPTZ,
        "verified_by" BIGINT REFERENCES "users"("user_id"),

        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        UNIQUE ("user_id", "document_type")
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "user_documents";
    `);
  }
};
