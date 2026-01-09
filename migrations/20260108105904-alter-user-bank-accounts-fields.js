'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_bank_accounts
      ALTER COLUMN account_number TYPE VARCHAR(35);

      ALTER TABLE public.user_bank_accounts
      ALTER COLUMN ifsc_code TYPE VARCHAR(15);

      ALTER TABLE public.user_bank_accounts
      DROP COLUMN account_type;

      ALTER TABLE public.user_bank_accounts
      ADD COLUMN account_type_id BIGINT,
      ADD COLUMN micr_code VARCHAR(15),
      ADD COLUMN swift_code VARCHAR(20),
      ADD COLUMN holder_name VARCHAR(255) NOT NULL,
      ADD COLUMN cancelled_cheque VARCHAR(500);

      ALTER TABLE public.user_bank_accounts
      ADD CONSTRAINT user_bank_accounts_account_type_id_fkey
      FOREIGN KEY (account_type_id)
      REFERENCES public.bank_account_type_master(id);
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_bank_accounts
      DROP CONSTRAINT user_bank_accounts_account_type_id_fkey;

      ALTER TABLE public.user_bank_accounts
      DROP COLUMN account_type_id,
      DROP COLUMN micr_code,
      DROP COLUMN swift_code,
      DROP COLUMN holder_name,
      DROP COLUMN cancelled_cheque;

      ALTER TABLE public.user_bank_accounts
      ADD COLUMN account_type VARCHAR(30);

      ALTER TABLE public.user_bank_accounts
      ALTER COLUMN account_number TYPE VARCHAR(30);

      ALTER TABLE public.user_bank_accounts
      ALTER COLUMN ifsc_code TYPE VARCHAR(11);
    `);
  }
};
