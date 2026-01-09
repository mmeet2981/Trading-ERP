'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      -- drop foreign key constraint on address_id
      ALTER TABLE public.poc_details
        DROP CONSTRAINT poc_details_address_id_fkey;

      -- drop address_id column
      ALTER TABLE public.poc_details
        DROP COLUMN address_id;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      -- add address_id column back
      ALTER TABLE public.poc_details
        ADD COLUMN address_id INT8 NULL;

      -- restore foreign key constraint
      ALTER TABLE public.poc_details
        ADD CONSTRAINT poc_details_address_id_fkey
        FOREIGN KEY (address_id)
        REFERENCES public.address(id);
    `);
  }
};
