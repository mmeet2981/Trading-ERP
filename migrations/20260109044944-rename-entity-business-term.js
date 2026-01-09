'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.entity_business_terms
      RENAME TO payment_terms;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.payment_terms
      RENAME TO entity_business_terms;
    `);
  }
};
