'use strict';

module.exports = function ({
  departmentDb,
  Joi,
  ValidationError,
  NotFoundError,
  UnknownError,
}) {
  return async function getDepartmentById({ department_id, logger }) {
    try {
      const schema = Joi.object({
        department_id: Joi.number().integer().positive().required(),
      });

      const { error } = schema.validate({ department_id }, { abortEarly: false });

      if (error) {
        const err = new ValidationError('Invalid department ID');
        err.details = error.details.map(d => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      const department = await departmentDb.findDepartmentById({
        department_id,
        logger,
      });

      if (!department) {
        throw new NotFoundError('Department not found');
      }

      return {
        success: true,
        message: 'Department retrieved successfully',
        data: department,
      };
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) throw err;
      throw new UnknownError(err.message || 'Failed to retrieve department');
    }
  };
};