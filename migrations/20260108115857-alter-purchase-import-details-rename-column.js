'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.purchase_import_details
      RENAME COLUMN cleaning_agent_name TO clearing_agent_name;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.purchase_import_details
      RENAME COLUMN clearing_agent_name TO cleaning_agent_name;
    `);
  }
};
