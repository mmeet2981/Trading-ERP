'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE purchase_import_details
      RENAME COLUMN customers_duty_amount TO customs_duty_amount;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE purchase_import_details
      RENAME COLUMN customers_duty_rate TO customs_duty_rate;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE purchase_import_details
      RENAME COLUMN customs_duty_amount TO customers_duty_amount;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE purchase_import_details
      RENAME COLUMN customs_duty_rate TO customers_duty_rate;
    `);
  }
};
