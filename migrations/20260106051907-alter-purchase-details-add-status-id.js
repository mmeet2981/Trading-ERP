'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.purchase_details
      ADD COLUMN status_id BIGINT NULL;

      ALTER TABLE public.purchase_details
      ADD CONSTRAINT purchase_details_status_id_fkey
      FOREIGN KEY (status_id)
      REFERENCES public.status_type_master(id);
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE public.purchase_details
      DROP CONSTRAINT IF EXISTS purchase_details_status_id_fkey;

      ALTER TABLE public.purchase_details
      DROP COLUMN IF EXISTS status_id;
    `);
  }
};
