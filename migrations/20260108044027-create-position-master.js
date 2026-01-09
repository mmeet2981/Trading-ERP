'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    await queryInterface.sequelize.query(`
      CREATE TABLE public.position_master (
        position_id SERIAL PRIMARY KEY,
        position_title VARCHAR(100) NOT NULL,
        org_unit_id INT NOT NULL,
        grade_level INT NOT NULL,
        is_vacant BOOLEAN DEFAULT TRUE,
        CONSTRAINT fk_position_org_unit
          FOREIGN KEY (org_unit_id)
          REFERENCES public.org_unit_master(org_unit_id)
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE public.position_master;
    `);
  }
};
