'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      -- 1. Drop old payment_terms column
      ALTER TABLE public.purchase_details
      DROP COLUMN IF EXISTS payment_terms;

      -- 2. Add new payment_terms_id column
      ALTER TABLE public.purchase_details
      ADD COLUMN payment_terms_id BIGINT NULL;

      -- 3. Add foreign key constraint
      ALTER TABLE public.purchase_details
      ADD CONSTRAINT purchase_details_payment_terms_id_fkey
      FOREIGN KEY (payment_terms_id)
      REFERENCES public.payment_terms(id);
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      -- 1. Drop foreign key constraint
      ALTER TABLE public.purchase_details
      DROP CONSTRAINT IF EXISTS purchase_details_payment_terms_id_fkey;

      -- 2. Drop payment_terms_id column
      ALTER TABLE public.purchase_details
      DROP COLUMN IF EXISTS payment_terms_id;

      -- 3. Restore payment_terms column
      ALTER TABLE public.purchase_details
      ADD COLUMN payment_terms TEXT NULL;
    `);
  }
};
