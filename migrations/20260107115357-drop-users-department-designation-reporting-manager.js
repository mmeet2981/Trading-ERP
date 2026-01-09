'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.users
        DROP COLUMN department_id,
        DROP COLUMN designation_id,
        DROP COLUMN reporting_manager_id;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.users
        ADD COLUMN department_id int8 NULL,
        ADD COLUMN designation_id int8 NULL,
        ADD COLUMN reporting_manager_id int8 NULL;
    `);
  }
};
