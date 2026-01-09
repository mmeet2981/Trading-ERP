'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE sku_master (
        id BIGSERIAL PRIMARY KEY,
        attribute_id BIGINT NOT NULL REFERENCES sku_attribute_master(id),
        value VARCHAR(100) NOT NULL,
        product_id BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS sku_master;`);
  }
};
