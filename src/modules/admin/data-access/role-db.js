'use strict';

module.exports = function ({ sequelize }) {
  return {
    createRole,
    findRoleById,
    findRoleByName,
    getRoles,
    updateRole,
    deleteRole,
  };

  /* ---------------------------------------------------- */
  /* Create Role                                         */
  /* ---------------------------------------------------- */
  async function createRole({ role_name, logger }) {
    try {
      const [row] = await sequelize.query(
        `
        INSERT INTO roles (role_name)
        VALUES ($1)
        RETURNING role_id, role_name, "createdAt", "updatedAt"
        `,
        {
          bind: [role_name],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return row;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  /* ---------------------------------------------------- */
  /* Find Role By ID                                     */
  /* ---------------------------------------------------- */
  async function findRoleById({ role_id, logger }) {
    try {
      const [row] = await sequelize.query(
        `
        SELECT role_id, role_name, "createdAt", "updatedAt"
        FROM roles
        WHERE role_id = $1
        `,
        {
          bind: [role_id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  /* ---------------------------------------------------- */
  /* Find Role By Name                                   */
  /* ---------------------------------------------------- */
  async function findRoleByName({ role_name, logger }) {
    try {
      const [row] = await sequelize.query(
        `
        SELECT role_id
        FROM roles
        WHERE role_name = $1
        LIMIT 1
        `,
        {
          bind: [role_name],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  /* ---------------------------------------------------- */
  /* Get All Roles                                       */
  /* ---------------------------------------------------- */
  async function getRoles({ logger }) {
    try {
      return await sequelize.query(
        `
        SELECT role_id, role_name, "createdAt", "updatedAt"
        FROM roles
        ORDER BY role_name ASC
        `,
        { type: sequelize.QueryTypes.SELECT }
      );
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  /* ---------------------------------------------------- */
  /* Update Role                                        */
  /* ---------------------------------------------------- */
  async function updateRole({ role_id, role_name, logger }) {
    try {
      const [row] = await sequelize.query(
        `
        UPDATE roles
        SET role_name = $1,
            "updatedAt" = now()
        WHERE role_id = $2
        RETURNING role_id, role_name, "createdAt", "updatedAt"
        `,
        {
          bind: [role_name, role_id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  /* ---------------------------------------------------- */
  /* Delete Role                                        */
  /* ---------------------------------------------------- */
  async function deleteRole({ role_id, logger }) {
    try {
      const rows = await sequelize.query(
        `
      DELETE FROM roles
      WHERE role_id = $1
      RETURNING role_id
      `,
        {
          bind: [role_id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return rows.length > 0;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

};
