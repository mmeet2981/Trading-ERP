'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.inquiries
      ADD COLUMN quantity NUMERIC(12, 2) NULL,
      ADD COLUMN uom VARCHAR(20) NULL;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.inquiries
      DROP COLUMN IF EXISTS quantity,
      DROP COLUMN IF EXISTS uom;
    `);
  }
};
