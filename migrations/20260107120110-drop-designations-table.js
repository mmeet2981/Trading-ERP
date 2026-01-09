'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE public.designations;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE public.designations (
        designation_id bigserial NOT NULL,
        designation_name varchar(70) NOT NULL,
        department_id int8 NULL,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT designations_pkey PRIMARY KEY (designation_id),
        CONSTRAINT designations_department_id_fkey 
          FOREIGN KEY (department_id) 
          REFERENCES public.departments(department_id) 
          ON DELETE SET NULL
      );
    `);
  }
};
