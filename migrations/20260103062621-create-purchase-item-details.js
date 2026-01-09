'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE purchase_item_details (
        id BIGSERIAL PRIMARY KEY,
        purchase_id BIGINT NOT NULL REFERENCES purchase_details(id) ON DELETE CASCADE,
        item_id BIGINT NOT NULL REFERENCES item_master(item_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (purchase_id, item_id)
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS purchase_item_details;`);
  }
};
