'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE public.product_list (
        id BIGSERIAL PRIMARY KEY,

        attributes JSONB NULL,
        sku_code VARCHAR(100) NOT NULL,
        product_name VARCHAR(150) NOT NULL,
        hsn_code VARCHAR(20) NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS public.product_list;
    `);
  }
};
