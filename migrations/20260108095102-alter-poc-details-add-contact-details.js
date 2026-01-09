'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      -- 1. Rename phone to mobile_number
      ALTER TABLE public.poc_details
      RENAME COLUMN phone TO mobile_number;

      -- 2. Add new columns
      ALTER TABLE public.poc_details
      ADD COLUMN contact_type VARCHAR(50) NULL,
      ADD COLUMN designation VARCHAR(100) NULL,
      ADD COLUMN secondary_number VARCHAR(15) NULL,
      ADD COLUMN secondary_email VARCHAR(120) NULL,
      ADD COLUMN whatsapp_number VARCHAR(15) NULL,
      ADD COLUMN is_primary BOOLEAN DEFAULT false,
      ADD COLUMN is_decision_maker BOOLEAN DEFAULT false,
      ADD COLUMN department VARCHAR(100) NULL,
      ADD COLUMN entity_id BIGINT NULL;

      -- 3. Add foreign key for entity_id
      ALTER TABLE public.poc_details
      ADD CONSTRAINT poc_details_entity_id_fkey
      FOREIGN KEY (entity_id)
      REFERENCES public.entity_master(id);
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      -- 1. Drop foreign key
      ALTER TABLE public.poc_details
      DROP CONSTRAINT IF EXISTS poc_details_entity_id_fkey;

      -- 2. Drop added columns
      ALTER TABLE public.poc_details
      DROP COLUMN IF EXISTS contact_type,
      DROP COLUMN IF EXISTS designation,
      DROP COLUMN IF EXISTS secondary_number,
      DROP COLUMN IF EXISTS secondary_email,
      DROP COLUMN IF EXISTS whatsapp_number,
      DROP COLUMN IF EXISTS is_primary,
      DROP COLUMN IF EXISTS is_decision_maker,
      DROP COLUMN IF EXISTS department,
      DROP COLUMN IF EXISTS entity_id;

      -- 3. Rename mobile_number back to phone
      ALTER TABLE public.poc_details
      RENAME COLUMN mobile_number TO phone;
    `);
  }
};
