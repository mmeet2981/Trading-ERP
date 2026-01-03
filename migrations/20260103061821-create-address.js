'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE address (
        id BIGSERIAL PRIMARY KEY,
        entity_id BIGINT NOT NULL REFERENCES entity_master(id),
        address_type_id BIGINT NOT NULL REFERENCES address_type_master(id),
        address_line VARCHAR(100),
        pincode VARCHAR(10),
        city_id BIGINT REFERENCES city(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS address;`);
  }
};
