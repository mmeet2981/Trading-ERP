'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE public.entity_documents (
        document_id BIGSERIAL NOT NULL,
        entity_id BIGINT NOT NULL,
        document_number VARCHAR(50) NULL,
        document_url TEXT NULL,
        issued_by VARCHAR(100) NULL,
        expiry_date DATE NULL,
        is_verified BOOLEAN NOT NULL DEFAULT false,
        verified_at TIMESTAMPTZ NULL,
        verified_by BIGINT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        document_type_id BIGINT NOT NULL,
        CONSTRAINT entity_documents_pkey PRIMARY KEY (document_id),
        CONSTRAINT entity_documents_entity_id_fkey
          FOREIGN KEY (entity_id)
          REFERENCES public.entity_master(id),
        CONSTRAINT entity_documents_document_type_id_fkey
          FOREIGN KEY (document_type_id)
          REFERENCES public.document_type_master(id)
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE public.entity_documents;
    `);
  }
};
