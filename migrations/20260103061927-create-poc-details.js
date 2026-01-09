'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE poc_details (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        phone VARCHAR(15),
        email VARCHAR(120),
        address_id BIGINT REFERENCES address(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS poc_details;`);
  }
};
