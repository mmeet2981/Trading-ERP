'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      -- 1. Drop foreign key constraint
      ALTER TABLE public.purchase_import_details
      DROP CONSTRAINT IF EXISTS purchase_import_details_country_id_fkey;

      -- 2. Drop column
      ALTER TABLE public.purchase_import_details
      DROP COLUMN IF EXISTS country_id;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      -- 1. Re-add column
      ALTER TABLE public.purchase_import_details
      ADD COLUMN country_id BIGINT;

      -- 2. Restore foreign key constraint
      ALTER TABLE public.purchase_import_details
      ADD CONSTRAINT purchase_import_details_country_id_fkey
      FOREIGN KEY (country_id)
      REFERENCES public.country(id);
    `);
  }
};
