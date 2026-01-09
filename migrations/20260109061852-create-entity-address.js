'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE public.entity_address (
        id BIGSERIAL PRIMARY KEY,

        entity_id BIGINT NOT NULL,
        address_type_id BIGINT NOT NULL,
        address_id BIGINT NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,

        CONSTRAINT entity_address_entity_id_fkey
        FOREIGN KEY (entity_id)
        REFERENCES public.entity_master(id),

        CONSTRAINT entity_address_address_type_id_fkey
        FOREIGN KEY (address_type_id)
        REFERENCES public.address_type_master(id),

        CONSTRAINT entity_address_address_id_fkey
        FOREIGN KEY (address_id)
        REFERENCES public.address(id),

        -- Prevent duplicate mappings
        CONSTRAINT entity_address_unique
        UNIQUE (entity_id, address_type_id, address_id)
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS public.entity_address;
    `);
  }
};
