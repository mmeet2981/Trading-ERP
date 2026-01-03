'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE purchase_jk_details (
        id BIGSERIAL PRIMARY KEY,
        partner_account VARCHAR(50),
        unit VARCHAR(50),
        division VARCHAR(50),
        supply_from VARCHAR(100),
        distribution_channel VARCHAR(50),
        order_type VARCHAR(50),
        delivery_to_address_id BIGINT REFERENCES address(id),
        route_code VARCHAR(50),
        requested_delivery_date DATE,
        approver_id BIGINT,
        combination_order BOOLEAN DEFAULT false,
        internal_customer_po_no VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS purchase_jk_details;`);
  }
};
