'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      -- 1. Drop CHECK constraint on purchase_type
      ALTER TABLE public.purchase_details
      DROP CONSTRAINT IF EXISTS chk_purchase_type;

      -- 2. Drop old purchase_type column
      ALTER TABLE public.purchase_details
      DROP COLUMN IF EXISTS purchase_type;

      -- 3. Add new purchase_type_id column
      ALTER TABLE public.purchase_details
      ADD COLUMN purchase_type_id BIGINT NULL;

      -- 4. Add foreign key constraint
      ALTER TABLE public.purchase_details
      ADD CONSTRAINT purchase_details_purchase_type_id_fkey
      FOREIGN KEY (purchase_type_id)
      REFERENCES public.transaction_type_master(id);
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      -- 1. Drop foreign key constraint
      ALTER TABLE public.purchase_details
      DROP CONSTRAINT IF EXISTS purchase_details_purchase_type_id_fkey;

      -- 2. Drop purchase_type_id column
      ALTER TABLE public.purchase_details
      DROP COLUMN IF EXISTS purchase_type_id;

      -- 3. Re-add purchase_type column
      ALTER TABLE public.purchase_details
      ADD COLUMN purchase_type VARCHAR(20) NOT NULL;

      -- 4. Restore CHECK constraint
      ALTER TABLE public.purchase_details
      ADD CONSTRAINT chk_purchase_type
      CHECK (
        purchase_type::text = ANY (
          ARRAY['JK', 'OTHER', 'IMPORT']::text[]
        )
      );
    `);
  }
};
