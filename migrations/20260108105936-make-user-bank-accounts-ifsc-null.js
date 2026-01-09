'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_bank_accounts
      ALTER COLUMN ifsc_code DROP NOT NULL;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_bank_accounts
      ALTER COLUMN ifsc_code SET NOT NULL;
    `);
  }
};
