'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE public.departments;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE public.departments (
        department_id bigserial NOT NULL,
        department_name varchar(50) NOT NULL,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT departments_department_name_key UNIQUE (department_name),
        CONSTRAINT departments_pkey PRIMARY KEY (department_id)
      );
    `);
  }
};
