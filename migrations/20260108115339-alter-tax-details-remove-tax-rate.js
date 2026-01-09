'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      -- Drop CHECK constraint related to tax_rate
      ALTER TABLE public.tax_details
      DROP CONSTRAINT IF EXISTS tax_details_tax_rate_check;

      -- Drop tax_rate column
      ALTER TABLE public.tax_details
      DROP COLUMN IF EXISTS tax_rate;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      -- Re-add tax_rate column
      ALTER TABLE public.tax_details
      ADD COLUMN tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 0;

      -- Restore CHECK constraint
      ALTER TABLE public.tax_details
      ADD CONSTRAINT tax_details_tax_rate_check
      CHECK (tax_rate >= 0);
    `);
  }
};
