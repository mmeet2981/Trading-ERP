'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE public.uom_conversion (
        id BIGSERIAL PRIMARY KEY,

        uom1 BIGINT NOT NULL,
        uom2 BIGINT NOT NULL,
        conversion_formula TEXT NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,

        CONSTRAINT uom_conversion_uom1_fkey
        FOREIGN KEY (uom1) REFERENCES public.uom_master(id),

        CONSTRAINT uom_conversion_uom2_fkey
        FOREIGN KEY (uom2) REFERENCES public.uom_master(id),

        CONSTRAINT uom_conversion_unique UNIQUE (uom1, uom2)
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS public.uom_conversion;
    `);
  }
};
