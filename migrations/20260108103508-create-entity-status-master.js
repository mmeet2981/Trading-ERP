'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE public.entity_status_master (
        id BIGSERIAL PRIMARY KEY,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
        CONSTRAINT entity_status_master_status_check
        CHECK (status::text = ANY (ARRAY['ACTIVE', 'INACTIVE']::text[])),
        CONSTRAINT entity_status_master_status_unique UNIQUE (status)
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS public.entity_status_master;
    `);
  }
};
