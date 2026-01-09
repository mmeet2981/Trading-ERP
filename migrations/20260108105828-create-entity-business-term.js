'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE public.entity_business_terms (
        id BIGSERIAL PRIMARY KEY,

        default_payment_term VARCHAR(100) NULL,
        credit_limit NUMERIC(14, 2) NULL,
        credit_period INT NULL,
        price_list_applicable BOOLEAN DEFAULT false,
        discount_allowed BOOLEAN DEFAULT false,

        tds_applicable BOOLEAN DEFAULT false,
        tds_rate NUMERIC(5, 2) NULL,

        tcs_applicable BOOLEAN DEFAULT false,

        delivery_terms_days INT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS public.entity_business_terms;
    `);
  }
};
