'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE purchase_details (
        id BIGSERIAL PRIMARY KEY,
        po_number VARCHAR(50) UNIQUE NOT NULL,
        po_doc_url TEXT,
        document_date DATE NOT NULL,
        buyer_id BIGINT NOT NULL REFERENCES entity_master(id),
        user_id BIGINT NOT NULL REFERENCES users(user_id),
        supplier_entity_id BIGINT NOT NULL REFERENCES entity_master(id),
        poc_id BIGINT REFERENCES poc_details(id),
        inco_terms_id BIGINT REFERENCES inco_terms_master(id),
        bill_to_address_id BIGINT REFERENCES address(id),
        ship_to_address_id BIGINT REFERENCES address(id),
        payment_terms TEXT,
        insurance_id BIGINT REFERENCES insurance(id),
        tax_type_id BIGINT REFERENCES tax_type_master(id),
        linked_sales_order VARCHAR(50),
        purchase_type VARCHAR(20) NOT NULL,
        external_reference_id VARCHAR(50),
        is_deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT chk_purchase_type
          CHECK (purchase_type IN ('JK', 'OTHER', 'IMPORT'))
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS purchase_details;`);
  }
};
