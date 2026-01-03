'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE insurance (
        id BIGSERIAL PRIMARY KEY,
        insurer_name VARCHAR(150),
        insurance_terms TEXT,
        policy_number VARCHAR(50) UNIQUE,
        policy_exp_date DATE,
        insurance_amount NUMERIC(14,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS insurance;`);
  }
};
