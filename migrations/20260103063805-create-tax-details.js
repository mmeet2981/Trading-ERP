'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE tax_details (
        id BIGSERIAL PRIMARY KEY,
        transaction_type VARCHAR(30) NOT NULL,
        tax_type_id BIGINT NOT NULL REFERENCES tax_type_master(id),
        tax_rate NUMERIC(5,2) NOT NULL CHECK (tax_rate >= 0),
        tax_liable_amount NUMERIC(14,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS tax_details;`);
  }
};
