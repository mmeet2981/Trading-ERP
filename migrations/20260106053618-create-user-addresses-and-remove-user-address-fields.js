'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /* 1️⃣ Create user_addresses table */
    await queryInterface.sequelize.query(`
      CREATE TABLE public.user_addresses (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL,
        address_type_id BIGINT NOT NULL,
        address_line TEXT NOT NULL,
        pincode VARCHAR(10),
        city_id BIGINT NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT user_addresses_user_id_fkey
          FOREIGN KEY (user_id)
          REFERENCES public.users(user_id)
          ON DELETE CASCADE,

        CONSTRAINT user_addresses_address_type_id_fkey
          FOREIGN KEY (address_type_id)
          REFERENCES public.address_type_master(id),

        CONSTRAINT user_addresses_city_id_fkey
          FOREIGN KEY (city_id)
          REFERENCES public.city(id),

        CONSTRAINT user_addresses_user_address_type_unique
          UNIQUE (user_id, address_type_id)
      );
    `);

    /* 2️⃣ Indexes for performance */
    await queryInterface.sequelize.query(`
      CREATE INDEX idx_user_addresses_user_id
        ON public.user_addresses(user_id);

      CREATE INDEX idx_user_addresses_city_id
        ON public.user_addresses(city_id);

      CREATE INDEX idx_user_addresses_address_type_id
        ON public.user_addresses(address_type_id);
    `);

    /* 3️⃣ Remove address columns from users table */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.users
        DROP COLUMN IF EXISTS address_line1,
        DROP COLUMN IF EXISTS address_line2,
        DROP COLUMN IF EXISTS city,
        DROP COLUMN IF EXISTS taluka,
        DROP COLUMN IF EXISTS district,
        DROP COLUMN IF EXISTS state,
        DROP COLUMN IF EXISTS country,
        DROP COLUMN IF EXISTS pin_code;
    `);
  },

  async down(queryInterface, Sequelize) {
    /* 1️⃣ Restore address columns in users table */
    await queryInterface.sequelize.query(`
      ALTER TABLE public.users
        ADD COLUMN address_line1 VARCHAR(100),
        ADD COLUMN address_line2 VARCHAR(100),
        ADD COLUMN city VARCHAR(50),
        ADD COLUMN taluka VARCHAR(50),
        ADD COLUMN district VARCHAR(50),
        ADD COLUMN state VARCHAR(50),
        ADD COLUMN country VARCHAR(50) DEFAULT 'India',
        ADD COLUMN pin_code VARCHAR(10);
    `);

    /* 2️⃣ Drop user_addresses table */
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS public.user_addresses;
    `);
  }
};
