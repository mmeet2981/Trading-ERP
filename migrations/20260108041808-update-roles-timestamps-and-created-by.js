'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    /* rename timestamps */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.roles
        RENAME COLUMN "createdAt" TO created_at;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE public.roles
        RENAME COLUMN "updatedAt" TO updated_at;
    `);

    /* add new columns */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.roles
        ADD COLUMN created_by int8,
        ADD COLUMN is_deleted boolean;
    `);

    /* add foreign key */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.roles
        ADD CONSTRAINT roles_created_by_fkey
          FOREIGN KEY (created_by)
          REFERENCES public.users(user_id);
    `);
  },

  async down(queryInterface) {

    /* drop foreign key */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.roles
        DROP CONSTRAINT roles_created_by_fkey;
    `);

    /* drop added columns */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.roles
        DROP COLUMN created_by,
        DROP COLUMN is_deleted;
    `);

    /* rename timestamps back */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.roles
        RENAME COLUMN created_at TO "createdAt";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE public.roles
        RENAME COLUMN updated_at TO "updatedAt";
    `);
  }
};
