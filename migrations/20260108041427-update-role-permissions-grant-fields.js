'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    /* remove createdAt and updatedAt */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.role_permissions
        DROP COLUMN "createdAt",
        DROP COLUMN "updatedAt";
    `);

    /* add granted_at and granted_by */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.role_permissions
        ADD COLUMN granted_at timestamptz DEFAULT now() NOT NULL,
        ADD COLUMN granted_by int8;
    `);

    /* add foreign key for granted_by */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.role_permissions
        ADD CONSTRAINT role_permissions_granted_by_fkey
          FOREIGN KEY (granted_by)
          REFERENCES public.users(user_id);
    `);
  },

  async down(queryInterface) {

    /* drop foreign key */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.role_permissions
        DROP CONSTRAINT role_permissions_granted_by_fkey;
    `);

    /* drop added columns */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.role_permissions
        DROP COLUMN granted_at,
        DROP COLUMN granted_by;
    `);

    /* restore createdAt and updatedAt */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.role_permissions
        ADD COLUMN "createdAt" timestamptz DEFAULT now() NOT NULL,
        ADD COLUMN "updatedAt" timestamptz DEFAULT now() NOT NULL;
    `);
  }
};
