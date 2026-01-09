'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_documents
      ALTER COLUMN document_type_id SET NOT NULL;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_documents
      ALTER COLUMN document_type_id DROP NOT NULL;
    `);
  }
};
