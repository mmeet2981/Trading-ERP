'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      BEGIN;

      -- 1. Drop foreign key from tax_details
      ALTER TABLE public.tax_details
      DROP CONSTRAINT IF EXISTS tax_details_transaction_type_id_fkey;

      -- 2. Drop old transaction_type_master
      DROP TABLE IF EXISTS public.transaction_type_master;

      -- 3. Recreate transaction_type_master with correct column order
      CREATE TABLE public.transaction_type_master (
        id BIGSERIAL PRIMARY KEY,
        module VARCHAR(20) NOT NULL,
        type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT transaction_type_module_type_unique UNIQUE (module, type),
        CONSTRAINT transaction_type_module_type_check CHECK (
          (module = 'purchase' AND type IN ('JK', 'OTHER', 'IMPORT')) OR
          (module = 'sales' AND type IN ('DIRECT', 'GODOWN'))
        )
      );

      -- 4. Re-add foreign key to tax_details
      ALTER TABLE public.tax_details
      ADD CONSTRAINT tax_details_transaction_type_id_fkey
      FOREIGN KEY (transaction_type_id)
      REFERENCES public.transaction_type_master(id);

      COMMIT;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      BEGIN;

      -- Remove FK
      ALTER TABLE public.tax_details
      DROP CONSTRAINT IF EXISTS tax_details_transaction_type_id_fkey;

      -- Drop new table
      DROP TABLE IF EXISTS public.transaction_type_master;

      -- Restore old structure
      CREATE TABLE public.transaction_type_master (
        id BIGSERIAL PRIMARY KEY,
        transaction_type VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Restore FK
      ALTER TABLE public.tax_details
      ADD CONSTRAINT tax_details_transaction_type_id_fkey
      FOREIGN KEY (transaction_type_id)
      REFERENCES public.transaction_type_master(id);

      COMMIT;
    `);
  }
};
