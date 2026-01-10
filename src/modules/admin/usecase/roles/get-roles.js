'use strict';

module.exports = function ({ roleDb, UnknownError }) {
  return async function getRoles({ logger }) {
    try {
      const roles = await roleDb.getRoles({ logger });

      return {
        success: true,
        message: 'roles fetched successfully',
        data: roles,
      };
    } catch (err) {
      logger?.error(err);
      throw new UnknownError(err.message || 'Failed to fetch roles');
    }
  };
};
