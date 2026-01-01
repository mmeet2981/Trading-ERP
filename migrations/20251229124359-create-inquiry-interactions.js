'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE inquiry_interactions (
        id BIGSERIAL PRIMARY KEY,

        inquiry_id BIGINT NOT NULL
          REFERENCES inquiries(id)
          ON DELETE CASCADE,

        interaction_type VARCHAR(30) NOT NULL,

        interaction_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        outcome VARCHAR(50),

        summary TEXT,

        follow_up_required BOOLEAN DEFAULT FALSE,

        follow_up_datetime TIMESTAMP,

        follow_up_status VARCHAR(20),

        created_by BIGINT REFERENCES users(user_id),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS inquiry_interactions;
    `);
  }
};
