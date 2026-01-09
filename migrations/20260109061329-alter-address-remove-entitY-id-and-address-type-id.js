'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      -- 1. Drop foreign key constraints
      ALTER TABLE public.address
      DROP CONSTRAINT IF EXISTS address_entity_id_fkey;

      ALTER TABLE public.address
      DROP CONSTRAINT IF EXISTS address_address_type_id_fkey;

      -- 2. Drop columns
      ALTER TABLE public.address
      DROP COLUMN IF EXISTS entity_id,
      DROP COLUMN IF EXISTS address_type_id;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      -- 1. Re-add columns
      ALTER TABLE public.address
      ADD COLUMN entity_id BIGINT NOT NULL,
      ADD COLUMN address_type_id BIGINT NOT NULL;

      -- 2. Restore foreign key constraints
      ALTER TABLE public.address
      ADD CONSTRAINT address_entity_id_fkey
      FOREIGN KEY (entity_id)
      REFERENCES public.entity_master(id);

      ALTER TABLE public.address
      ADD CONSTRAINT address_address_type_id_fkey
      FOREIGN KEY (address_type_id)
      REFERENCES public.address_type_master(id);
    `);
  }
};
