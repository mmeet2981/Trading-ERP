'use strict';

module.exports = function ({
  permissionDb,
  UnknownError,
}) {
  return async function getPermissions({ logger }) {
    try {
      const permissions = await permissionDb.getPermissions({ logger });

      return {
        success: true,
        message: 'Permissions retrieved successfully',
        data: permissions,
      };
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) throw err;
      throw new UnknownError(err.message || 'Failed to retrieve permissions');
    }
  };
};