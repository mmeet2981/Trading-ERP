'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      -- Add foreign key constraint for product_id
      ALTER TABLE public.item_master
      ADD CONSTRAINT item_master_product_id_fkey
      FOREIGN KEY (product_id)
      REFERENCES public.product_list(id);
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      -- Drop foreign key constraint
      ALTER TABLE public.item_master
      DROP CONSTRAINT IF EXISTS item_master_product_id_fkey;
    `);
  }
};
