'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      -- 1. Drop existing foreign key constraint on tax_type_id
      ALTER TABLE public.purchase_details
      DROP CONSTRAINT IF EXISTS purchase_details_tax_type_id_fkey;

      -- 2. Rename column from tax_type_id to tax_detail_id
      ALTER TABLE public.purchase_details
      RENAME COLUMN tax_type_id TO tax_detail_id;

      -- 3. Add new foreign key constraint referencing tax_details
      ALTER TABLE public.purchase_details
      ADD CONSTRAINT purchase_details_tax_detail_id_fkey
      FOREIGN KEY (tax_detail_id)
      REFERENCES public.tax_details(id);
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      -- 1. Drop foreign key constraint on tax_detail_id
      ALTER TABLE public.purchase_details
      DROP CONSTRAINT IF EXISTS purchase_details_tax_detail_id_fkey;

      -- 2. Rename column back to tax_type_id
      ALTER TABLE public.purchase_details
      RENAME COLUMN tax_detail_id TO tax_type_id;

      -- 3. Restore original foreign key constraint
      ALTER TABLE public.purchase_details
      ADD CONSTRAINT purchase_details_tax_type_id_fkey
      FOREIGN KEY (tax_type_id)
      REFERENCES public.tax_type_master(id);
    `);
  }
};
