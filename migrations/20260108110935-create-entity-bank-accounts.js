'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE public.entity_bank_accounts (
        bank_account_id BIGSERIAL PRIMARY KEY,
        entity_id BIGINT NOT NULL,
        bank_name VARCHAR(100) NOT NULL,
        account_number VARCHAR(35) NOT NULL,
        ifsc_code VARCHAR(15) NULL,
        is_primary BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        branch_name VARCHAR(255) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        account_type_id BIGINT NULL,
        micr_code VARCHAR(15) NULL,
        swift_code VARCHAR(20) NULL,
        holder_name VARCHAR(255) NOT NULL,
        cancelled_cheque VARCHAR(500) NULL,
        CONSTRAINT entity_bank_accounts_entity_id_fkey
          FOREIGN KEY (entity_id)
          REFERENCES public.entity_master(id),
        CONSTRAINT entity_bank_accounts_account_type_id_fkey
          FOREIGN KEY (account_type_id)
          REFERENCES public.bank_account_type_master(id)
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE public.entity_bank_accounts;
    `);
  }
};
