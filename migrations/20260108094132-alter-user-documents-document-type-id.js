'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_documents
      DROP COLUMN document_type;

      ALTER TABLE public.user_documents
      ADD COLUMN document_type_id BIGINT;

      ALTER TABLE public.user_documents
      ADD CONSTRAINT user_documents_document_type_id_fkey
      FOREIGN KEY (document_type_id)
      REFERENCES public.document_type_master(id);
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_documents
      DROP CONSTRAINT user_documents_document_type_id_fkey;

      ALTER TABLE public.user_documents
      DROP COLUMN document_type_id;

      ALTER TABLE public.user_documents
      ADD COLUMN document_type VARCHAR(50) NOT NULL;
    `);
  }
};
