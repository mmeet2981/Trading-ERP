'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * 1. Seed employment_types from enum values
     * Using explicit inserts to keep mapping predictable
     */
    await queryInterface.sequelize.query(`
      INSERT INTO "employment_types" ("name")
      VALUES
        ('full_time'),
        ('part_time'),
        ('contract'),
        ('intern')
      ON CONFLICT ("name") DO NOTHING;
    `);

    /**
     * 2. Backfill users.employment_type_id
     * Cast enum to text for safe comparison
     */
    await queryInterface.sequelize.query(`
      UPDATE "users" u
      SET "employment_type_id" = et."employment_type_id"
      FROM "employment_types" et
      WHERE u."employment_type"::text = et."name";
    `);


    /**
     * 3. Enforce NOT NULL (optional but recommended)
     * Only safe because old column had default + data
     */
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      ALTER COLUMN "employment_type_id" SET NOT NULL;
    `);

    /**
     * 4. Drop old enum-based column
     */
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      DROP COLUMN "employment_type";
    `);

    /**
     * 5. Drop enum type
     */
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "employment_type_enum";
    `);
  },

  async down(queryInterface, Sequelize) {
    /**
     * 1. Recreate enum
     */
    await queryInterface.sequelize.query(`
      CREATE TYPE "employment_type_enum" AS ENUM (
        'full_time',
        'part_time',
        'contract',
        'intern'
      );
    `);

    /**
     * 2. Restore column
     */
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      ADD COLUMN "employment_type" "employment_type_enum";
    `);

    /**
     * 3. Backfill enum column from FK
     */
    await queryInterface.sequelize.query(`
      UPDATE "users" u
      SET "employment_type" = et."name"::employment_type_enum
      FROM "employment_types" et
      WHERE u."employment_type_id" = et."employment_type_id";
    `);

    /**
     * 4. Restore default + constraint
     */
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      ALTER COLUMN "employment_type" SET DEFAULT 'full_time',
      ALTER COLUMN "employment_type" SET NOT NULL;
    `);

    /**
     * 5. Remove FK column
     */
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      DROP COLUMN "employment_type_id";
    `);
  }
};
