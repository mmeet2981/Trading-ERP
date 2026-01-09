'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.item_master
      ADD COLUMN rate NUMERIC(14, 4) NULL,
      ADD COLUMN amount NUMERIC(14, 2) NULL;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.item_master
      DROP COLUMN IF EXISTS amount,
      DROP COLUMN IF EXISTS rate;
    `);
  }
};
