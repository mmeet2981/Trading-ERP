'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    /* remove can_* columns */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.permissions
        DROP COLUMN can_create,
        DROP COLUMN can_view,
        DROP COLUMN can_update,
        DROP COLUMN can_delete,
        DROP COLUMN can_authorize;
    `);

    /* add new columns */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.permissions
        ADD COLUMN module_id int8,
        ADD COLUMN action_id int8,
        ADD COLUMN description text,
        ADD COLUMN permission_code varchar(100) NOT NULL UNIQUE,
        ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
    `);

    /* add foreign keys */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.permissions
        ADD CONSTRAINT permissions_module_id_fkey
          FOREIGN KEY (module_id)
          REFERENCES public.permission_modules(module_id);
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE public.permissions
        ADD CONSTRAINT permissions_action_id_fkey
          FOREIGN KEY (action_id)
          REFERENCES public.permission_actions(action_id);
    `);
  },

  async down(queryInterface) {

    /* drop foreign keys */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.permissions
        DROP CONSTRAINT permissions_module_id_fkey;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE public.permissions
        DROP CONSTRAINT permissions_action_id_fkey;
    `);

    /* drop added columns */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.permissions
        DROP COLUMN module_id,
        DROP COLUMN action_id,
        DROP COLUMN description,
        DROP COLUMN permission_code,
        DROP COLUMN is_deleted;
    `);

    /* restore can_* columns */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.permissions
        ADD COLUMN can_create bool DEFAULT false NOT NULL,
        ADD COLUMN can_view bool DEFAULT false NOT NULL,
        ADD COLUMN can_update bool DEFAULT false NOT NULL,
        ADD COLUMN can_delete bool DEFAULT false NOT NULL,
        ADD COLUMN can_authorize bool DEFAULT false NOT NULL;
    `);
  }
};
