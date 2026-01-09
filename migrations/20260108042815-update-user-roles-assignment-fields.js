'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    /* remove createdAt and updatedAt */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_roles
        DROP COLUMN "createdAt",
        DROP COLUMN "updatedAt";
    `);

    /* add new columns */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_roles
        ADD COLUMN assign_by int8,
        ADD COLUMN assign_at timestamptz DEFAULT now() NOT NULL,
        ADD COLUMN is_active bool DEFAULT true NOT NULL;
    `);

    /* add foreign key */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_roles
        ADD CONSTRAINT user_roles_assign_by_fkey
          FOREIGN KEY (assign_by)
          REFERENCES public.users(user_id);
    `);
  },

  async down(queryInterface) {

    /* drop foreign key */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_roles
        DROP CONSTRAINT user_roles_assign_by_fkey;
    `);

    /* drop added columns */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_roles
        DROP COLUMN assign_by,
        DROP COLUMN assign_at,
        DROP COLUMN is_active;
    `);

    /* restore createdAt and updatedAt */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.user_roles
        ADD COLUMN "createdAt" timestamptz DEFAULT now() NOT NULL,
        ADD COLUMN "updatedAt" timestamptz DEFAULT now() NOT NULL;
    `);
  }
};
