'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.tax_type_master
      ADD COLUMN tax_rate NUMERIC(5, 2) NULL;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.tax_type_master
      DROP COLUMN IF EXISTS tax_rate;
    `);
  }
};
