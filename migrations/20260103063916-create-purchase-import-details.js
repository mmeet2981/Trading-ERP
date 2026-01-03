'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE purchase_import_details (
        id BIGSERIAL PRIMARY KEY,
        bl_number VARCHAR(50),
        awb_number VARCHAR(50),
        country_id BIGINT REFERENCES country(id),
        loading_port_id BIGINT REFERENCES port(id),
        discharge_port_id BIGINT REFERENCES port(id),
        shipment_mode VARCHAR(50),
        carrier_name VARCHAR(100),
        vessel_name VARCHAR(100),
        bl_date DATE,
        estimated_departure_time DATE,
        estimated_arrival_time DATE,
        actual_arrival_date DATE,
        container_number VARCHAR(50),
        container_size VARCHAR(20),
        net_weight NUMERIC(14,3),
        volume NUMERIC(14,3),
        iec_number VARCHAR(50),
        pims_registration_number VARCHAR(50),
        customers_duty_amount NUMERIC(14,2),
        customers_duty_rate NUMERIC(5,2),
        currency VARCHAR(10),
        amount_local_currency NUMERIC(14,2),
        exchange_rate NUMERIC(10,4),
        cleaning_agent_name VARCHAR(100),
        cha_charges NUMERIC(14,2),
        port_handling_charges NUMERIC(14,2),
        storage_charges NUMERIC(14,2),
        inspection_charges NUMERIC(14,2),
        documentation_charges NUMERIC(14,2),
        other_landing_cost NUMERIC(14,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS purchase_import_details;`);
  }
};
