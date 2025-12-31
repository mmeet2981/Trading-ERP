'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE inquiries (
        id BIGSERIAL PRIMARY KEY,

        inquiry_code VARCHAR(30) UNIQUE NOT NULL,

        inquiry_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        source VARCHAR(30) NOT NULL,
        source_reference VARCHAR(100),

        linked_order_id BIGINT NULL,

        status VARCHAR(20) NOT NULL DEFAULT 'OPEN',

        customer_id BIGINT NULL REFERENCES crm_contacts(id),

        product_requested VARCHAR(150),

        expected_price NUMERIC(12,2),
        expected_delivery_date DATE,

        special_instructions TEXT,
        transcript TEXT,

        assigned_sales_person BIGINT REFERENCES users(user_id),

        is_within_working_hours BOOLEAN,

        interaction_due_time TIMESTAMP,

        sla_status VARCHAR(20),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS inquiries;
    `);
  }
};
