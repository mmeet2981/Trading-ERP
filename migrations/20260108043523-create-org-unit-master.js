'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    /* create enum type */
    await queryInterface.sequelize.query(`
      CREATE TYPE org_unit_type_enum AS ENUM (
        'Company',
        'Country',
        'Location',
        'Department'
      );
    `);

    /* create table */
    await queryInterface.sequelize.query(`
      CREATE TABLE public.org_unit_master (
        org_unit_id SERIAL PRIMARY KEY,
        org_unit_name VARCHAR(100) NOT NULL,
        org_unit_type org_unit_type_enum,
        parent_org_unit_id INT NULL,
        CONSTRAINT fk_parent_org_unit
          FOREIGN KEY (parent_org_unit_id)
          REFERENCES public.org_unit_master(org_unit_id)
      );
    `);
  },

  async down(queryInterface) {

    /* drop table first (because of FK dependency) */
    await queryInterface.sequelize.query(`
      DROP TABLE public.org_unit_master;
    `);

    /* drop enum type */
    await queryInterface.sequelize.query(`
      DROP TYPE org_unit_type_enum;
    `);
  }
};
