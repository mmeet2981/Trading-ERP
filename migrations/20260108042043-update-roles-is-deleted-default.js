'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    /* set default and NOT NULL */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.roles
        ALTER COLUMN is_deleted SET DEFAULT false,
        ALTER COLUMN is_deleted SET NOT NULL;
    `);
  },

  async down(queryInterface) {

    /* revert to nullable without default */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.roles
        ALTER COLUMN is_deleted DROP DEFAULT,
        ALTER COLUMN is_deleted DROP NOT NULL;
    `);
  }
};
