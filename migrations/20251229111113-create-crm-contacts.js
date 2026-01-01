'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE crm_contacts (
        id BIGSERIAL PRIMARY KEY,

        name VARCHAR(150) NOT NULL,
        poc_name VARCHAR(150),

        phone_number VARCHAR(20),
        whatsapp_number VARCHAR(20),
        email VARCHAR(120),

        address TEXT,

        preferred_contact_method VARCHAR(20),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS crm_contacts;
    `);
  }
};
