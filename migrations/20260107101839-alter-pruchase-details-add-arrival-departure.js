'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.purchase_details
      ADD COLUMN estimated_departure_time DATE NULL,
      ADD COLUMN estimated_arrival_time DATE NULL,
      ADD COLUMN actual_arrival_date DATE NULL;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.purchase_details
      DROP COLUMN IF EXISTS actual_arrival_date,
      DROP COLUMN IF EXISTS estimated_arrival_time,
      DROP COLUMN IF EXISTS estimated_departure_time;
    `);
  }
};
