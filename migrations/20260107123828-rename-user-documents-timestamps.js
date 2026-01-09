'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_documents
        RENAME COLUMN "createdAt" TO created_at;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_documents
        RENAME COLUMN "updatedAt" TO updated_at;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_documents
        RENAME COLUMN created_at TO "createdAt";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_documents
        RENAME COLUMN updated_at TO "updatedAt";
    `);
  }
};
