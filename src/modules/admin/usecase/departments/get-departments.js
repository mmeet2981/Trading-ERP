'use strict';

module.exports = function ({
  departmentDb,
  UnknownError,
}) {
  return async function getDepartments({ logger }) {
    try {
      const departments = await departmentDb.getDepartments({ logger });

      return {
        success: true,
        message: 'Departments retrieved successfully',
        data: departments,
      };
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) throw err;
      throw new UnknownError(err.message || 'Failed to retrieve departments');
    }
  };
};