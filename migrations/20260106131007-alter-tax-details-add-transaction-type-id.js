'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      -- 1. Add new column transaction_type_id
      ALTER TABLE public.tax_details
      ADD COLUMN transaction_type_id BIGINT NULL;

      -- 2. Add foreign key constraint
      ALTER TABLE public.tax_details
      ADD CONSTRAINT tax_details_transaction_type_id_fkey
      FOREIGN KEY (transaction_type_id)
      REFERENCES public.transaction_type_master(id);

      -- 3. Drop old column transaction_type
      ALTER TABLE public.tax_details
      DROP COLUMN transaction_type;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      -- 1. Add old column back
      ALTER TABLE public.tax_details
      ADD COLUMN transaction_type VARCHAR(30);

      -- 2. Drop new foreign key constraint
      ALTER TABLE public.tax_details
      DROP CONSTRAINT IF EXISTS tax_details_transaction_type_id_fkey;

      -- 3. Drop new column
      ALTER TABLE public.tax_details
      DROP COLUMN IF EXISTS transaction_type_id;
    `);
  }
};
