'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE public.permission_modules (
        module_id bigserial PRIMARY KEY,
        module_name varchar(50) NOT NULL,
        module_code varchar(50) NOT NULL UNIQUE,
        description text,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz DEFAULT now() NOT NULL,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE public.permission_modules;
    `);
  }
};
