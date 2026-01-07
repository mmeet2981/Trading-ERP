'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.purchase_details
      ADD COLUMN gross_amount NUMERIC(14, 2) NULL;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.purchase_details
      DROP COLUMN IF EXISTS gross_amount;
    `);
  }
};
