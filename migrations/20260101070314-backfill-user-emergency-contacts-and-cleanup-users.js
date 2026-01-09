'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * 1. Backfill existing emergency contact into new table
     */
    await queryInterface.sequelize.query(`
      INSERT INTO "user_emergency_contacts"
        ("user_id", "name", "relation", "phone", "is_primary")
      SELECT
        "user_id",
        "emergency_contact_name",
        "emergency_contact_relation",
        "emergency_contact_phone",
        TRUE
      FROM "users"
      WHERE "emergency_contact_phone" IS NOT NULL;
    `);

    /**
     * 2. Remove emergency columns from users table
     */
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
        DROP COLUMN IF EXISTS "emergency_contact_name",
        DROP COLUMN IF EXISTS "emergency_contact_relation",
        DROP COLUMN IF EXISTS "emergency_contact_phone";
    `);
  },

  async down(queryInterface, Sequelize) {
    /**
     * 1. Restore columns on users
     */
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
        ADD COLUMN "emergency_contact_name" VARCHAR(100),
        ADD COLUMN "emergency_contact_relation" VARCHAR(50),
        ADD COLUMN "emergency_contact_phone" VARCHAR(15);
    `);

    /**
     * 2. Restore data from primary emergency contact
     */
    await queryInterface.sequelize.query(`
      UPDATE "users" u
      SET
        "emergency_contact_name" = uec."name",
        "emergency_contact_relation" = uec."relation",
        "emergency_contact_phone" = uec."phone"
      FROM "user_emergency_contacts" uec
      WHERE uec."user_id" = u."user_id"
        AND uec."is_primary" = TRUE;
    `);
  }
};
