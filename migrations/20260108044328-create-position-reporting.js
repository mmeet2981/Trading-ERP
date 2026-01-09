'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    /* create enum type */
    await queryInterface.sequelize.query(`
      CREATE TYPE position_relation_type_enum AS ENUM ('Solid', 'Dotted');
    `);

    /* create table */
    await queryInterface.sequelize.query(`
      CREATE TABLE public.position_reporting (
        reporting_id SERIAL PRIMARY KEY,
        subordinate_position_id INT NOT NULL,
        manager_position_id INT NOT NULL,
        relation_type position_relation_type_enum DEFAULT 'Solid',
        CONSTRAINT fk_subordinate_position
          FOREIGN KEY (subordinate_position_id)
          REFERENCES public.position_master(position_id),
        CONSTRAINT fk_manager_position
          FOREIGN KEY (manager_position_id)
          REFERENCES public.position_master(position_id),
        CONSTRAINT chk_no_self_reporting
          CHECK (subordinate_position_id <> manager_position_id)
      );
    `);
  },

  async down(queryInterface) {

    /* drop table first */
    await queryInterface.sequelize.query(`
      DROP TABLE public.position_reporting;
    `);

    /* drop enum type */
    await queryInterface.sequelize.query(`
      DROP TYPE position_relation_type_enum;
    `);
  }
};
