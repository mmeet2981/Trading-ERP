'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      -- Add columns
      ALTER TABLE public.entity_master
      ADD COLUMN entity_code VARCHAR(50) NULL,
      ADD COLUMN entity_gst_reg_name VARCHAR(150) NULL,
      ADD COLUMN date_of_contact DATE NULL,
      ADD COLUMN entity_status_id BIGINT NULL,
      ADD COLUMN entity_bank_details_id BIGINT NULL,
      ADD COLUMN entity_business_term_id BIGINT NULL,
      ADD COLUMN reputation_score NUMERIC(3, 2) NULL,
      ADD COLUMN website VARCHAR(255) NULL,
      ADD COLUMN preferred_communication_mode VARCHAR(50) NULL,
      ADD COLUMN cin VARCHAR(50) NULL,
      ADD COLUMN iec_code VARCHAR(50) NULL,
      ADD COLUMN msme_number VARCHAR(50) NULL,
      ADD COLUMN msme_certificate TEXT NULL;

      -- FK: entity status
      ALTER TABLE public.entity_master
      ADD CONSTRAINT entity_master_entity_status_id_fkey
      FOREIGN KEY (entity_status_id)
      REFERENCES public.entity_status_master(id);

      -- FK: entity bank details
      ALTER TABLE public.entity_master
      ADD CONSTRAINT entity_master_entity_bank_details_id_fkey
      FOREIGN KEY (entity_bank_details_id)
      REFERENCES public.entity_bank_accounts(bank_account_id);

      -- FK: entity business terms
      ALTER TABLE public.entity_master
      ADD CONSTRAINT entity_master_entity_business_term_id_fkey
      FOREIGN KEY (entity_business_term_id)
      REFERENCES public.entity_business_terms(id);
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      -- Drop foreign keys
      ALTER TABLE public.entity_master
      DROP CONSTRAINT IF EXISTS entity_master_entity_business_term_id_fkey;

      ALTER TABLE public.entity_master
      DROP CONSTRAINT IF EXISTS entity_master_entity_bank_details_id_fkey;

      ALTER TABLE public.entity_master
      DROP CONSTRAINT IF EXISTS entity_master_entity_status_id_fkey;

      -- Drop added columns
      ALTER TABLE public.entity_master
      DROP COLUMN IF EXISTS entity_code,
      DROP COLUMN IF EXISTS entity_gst_reg_name,
      DROP COLUMN IF EXISTS date_of_contact,
      DROP COLUMN IF EXISTS entity_status_id,
      DROP COLUMN IF EXISTS entity_bank_details_id,
      DROP COLUMN IF EXISTS entity_business_term_id,
      DROP COLUMN IF EXISTS reputation_score,
      DROP COLUMN IF EXISTS website,
      DROP COLUMN IF EXISTS preferred_communication_mode,
      DROP COLUMN IF EXISTS cin,
      DROP COLUMN IF EXISTS iec_code,
      DROP COLUMN IF EXISTS msme_number,
      DROP COLUMN IF EXISTS msme_certificate;
    `);
  }
};
