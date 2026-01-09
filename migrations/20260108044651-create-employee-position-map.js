'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    await queryInterface.sequelize.query(`
      CREATE TABLE public.employee_position_map (
        emp_map_id SERIAL PRIMARY KEY,
        employee_id INT NOT NULL,
        position_id INT NOT NULL,
        is_primary BOOLEAN DEFAULT TRUE,
        effective_from DATE NOT NULL,
        effective_to DATE DEFAULT DATE '9999-12-31',
        CONSTRAINT fk_emp_position
          FOREIGN KEY (position_id)
          REFERENCES public.position_master(position_id),
        CONSTRAINT fk_emp_user
          FOREIGN KEY (employee_id)
          REFERENCES public.users(user_id)
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE public.employee_position_map;
    `);
  }
};
