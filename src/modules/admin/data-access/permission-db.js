'use strict';

module.exports = function ({ sequelize }) {
  return {
    createPermission,
    findPermissionById,
    findExistingPermission,
    getPermissions,
    updatePermission,
    deletePermission,
  };

  // Create permissions
  async function createPermission({ 
    can_create, 
    can_view, 
    can_update, 
    can_delete, 
    can_authorize, 
    logger 
  }) {
    try {
      const [row] = await sequelize.query(
        `
        INSERT INTO permissions (
          can_create, 
          can_view, 
          can_update, 
          can_delete, 
          can_authorize
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING 
          permission_id, 
          can_create, 
          can_view, 
          can_update, 
          can_delete, 
          can_authorize,
          "createdAt", 
          "updatedAt"
        `,
        {
          bind: [can_create, can_view, can_update, can_delete, can_authorize],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return row;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  // Find Permission By Id
  async function findPermissionById({ permission_id, logger }) {
    try {
      const [row] = await sequelize.query(
        `
        SELECT 
          permission_id, 
          can_create, 
          can_view, 
          can_update, 
          can_delete, 
          can_authorize,
          "createdAt", 
          "updatedAt"
        FROM permissions
        WHERE permission_id = $1
        `,
        {
          bind: [permission_id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  // Find Existing Permissions 
  async function findExistingPermission({ 
    can_create, 
    can_view, 
    can_update, 
    can_delete, 
    can_authorize, 
    exclude_id = null,
    logger 
  }) {
    try {
      let query = `
        SELECT permission_id
        FROM permissions
        WHERE can_create = $1 
          AND can_view = $2 
          AND can_update = $3 
          AND can_delete = $4 
          AND can_authorize = $5
      `;
      
      const bindParams = [can_create, can_view, can_update, can_delete, can_authorize];
      
      if (exclude_id) {
        query += ` AND permission_id != $${bindParams.length + 1}`;
        bindParams.push(exclude_id);
      }
      
      query += ` LIMIT 1`;

      const [row] = await sequelize.query(
        query,
        {
          bind: bindParams,
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  // Get All Permissions 
  async function getPermissions({ logger }) {
    try {
      return await sequelize.query(
        `
        SELECT 
          permission_id, 
          can_create, 
          can_view, 
          can_update, 
          can_delete, 
          can_authorize,
          "createdAt", 
          "updatedAt"
        FROM permissions
        ORDER BY permission_id ASC
        `,
        { type: sequelize.QueryTypes.SELECT }
      );
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  // Update Permissions 
  async function updatePermission({ 
    permission_id,
    can_create, 
    can_view, 
    can_update, 
    can_delete, 
    can_authorize, 
    logger 
  }) {
    try {
      const [row] = await sequelize.query(
        `
        UPDATE permissions
        SET 
          can_create = $1,
          can_view = $2,
          can_update = $3,
          can_delete = $4,
          can_authorize = $5,
          "updatedAt" = now()
        WHERE permission_id = $6
        RETURNING 
          permission_id, 
          can_create, 
          can_view, 
          can_update, 
          can_delete, 
          can_authorize,
          "createdAt", 
          "updatedAt"
        `,
        {
          bind: [can_create, can_view, can_update, can_delete, can_authorize, permission_id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  // Delete Permission By Id 
  async function deletePermission({ permission_id, logger }) {
    try {
      const rows = await sequelize.query(
        `
        DELETE FROM permissions
        WHERE permission_id = $1
        RETURNING permission_id
        `,
        {
          bind: [permission_id],
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