'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS public.sku_master;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE public.sku_master (
        id BIGSERIAL NOT NULL,
        attribute_id INT8 NOT NULL,
        value VARCHAR(100) NOT NULL,
        product_id INT8 NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
        CONSTRAINT sku_master_pkey PRIMARY KEY (id),
        CONSTRAINT sku_master_attribute_id_fkey
        FOREIGN KEY (attribute_id)
        REFERENCES public.sku_attribute_master(id)
      );
    `);
  }
};
