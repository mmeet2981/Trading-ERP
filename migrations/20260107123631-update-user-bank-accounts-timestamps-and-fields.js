'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_bank_accounts
        RENAME COLUMN "createdAt" TO created_at;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_bank_accounts
        RENAME COLUMN "updatedAt" TO updated_at;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_bank_accounts
        ADD COLUMN branch_name VARCHAR(255) NOT NULL,
        ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_bank_accounts
        DROP COLUMN branch_name,
        DROP COLUMN is_active;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_bank_accounts
        RENAME COLUMN created_at TO "createdAt";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_bank_accounts
        RENAME COLUMN updated_at TO "updatedAt";
    `);
  }
};
