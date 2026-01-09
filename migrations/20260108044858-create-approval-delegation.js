'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    await queryInterface.sequelize.query(`
      CREATE TABLE public.approval_delegation (
        delegation_id SERIAL PRIMARY KEY,
        from_employee_id INT NOT NULL,
        to_employee_id INT NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        CONSTRAINT fk_delegation_from_employee
          FOREIGN KEY (from_employee_id)
          REFERENCES public.users(user_id),
        CONSTRAINT fk_delegation_to_employee
          FOREIGN KEY (to_employee_id)
          REFERENCES public.users(user_id)
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE public.approval_delegation;
    `);
  }
};
