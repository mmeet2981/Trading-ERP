'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE item_master (
        item_id BIGSERIAL PRIMARY KEY,
        product_id BIGINT,
        brand VARCHAR(100),
        description TEXT,
        packaging_mode VARCHAR(50),
        item_group VARCHAR(50),
        quantity NUMERIC(14,3),
        quality VARCHAR(50),
        po_no VARCHAR(50),
        remarks TEXT,
        po_line_no INT,
        item_name VARCHAR(150),
        number_of_packages INT,
        size_1 NUMERIC(8,2),
        size_2 NUMERIC(8,2),
        size_type VARCHAR(20) NOT NULL,
        gsm NUMERIC(6,2),
        number_of_sheets INT,
        ream_weight NUMERIC(10,3),
        tare_weight NUMERIC(10,3),
        uom_id BIGINT REFERENCES uom_master(id),
        package_net_weight NUMERIC(14,3),
        package_gross_weight NUMERIC(14,3),
        item_net_weight NUMERIC(14,3),
        item_gross_weight NUMERIC(14,3),
        fsc_type VARCHAR(50),
        variant_key VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS item_master;`);
  }
};
