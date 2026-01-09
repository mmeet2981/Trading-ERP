'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      -- drop unique constraint first
      ALTER TABLE public.user_addresses
        DROP CONSTRAINT user_addresses_user_address_type_unique;

      -- create enum type
      CREATE TYPE person_type_enum AS ENUM ('U','P');

      -- drop foreign key constraint on user_id
      ALTER TABLE public.user_addresses
        DROP CONSTRAINT user_addresses_user_id_fkey;

      -- drop column user_id
      ALTER TABLE public.user_addresses
        DROP COLUMN user_id;

      -- add new columns
      ALTER TABLE public.user_addresses
        ADD COLUMN person_id BIGINT NOT NULL,
        ADD COLUMN person_type person_type_enum NOT NULL;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      -- remove new columns
      ALTER TABLE public.user_addresses
        DROP COLUMN person_id,
        DROP COLUMN person_type;

      -- add back user_id
      ALTER TABLE public.user_addresses
        ADD COLUMN user_id INT8 NOT NULL;

      -- restore foreign key constraint
      ALTER TABLE public.user_addresses
        ADD CONSTRAINT user_addresses_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE;

      -- restore unique constraint
      ALTER TABLE public.user_addresses
        ADD CONSTRAINT user_addresses_user_address_type_unique
        UNIQUE (user_id, address_type_id);

      -- drop enum type
      DROP TYPE person_type_enum;
    `);
  }
};
