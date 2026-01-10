'use strict';

module.exports = function ({
  departmentDb,
  Joi,
  ValidationError,
  NotFoundError,
  UnknownError,
}) {
  return async function deleteDepartment({ department_id, logger }) {
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

      // Check if department exists
      const existingDepartment = await departmentDb.findDepartmentById({
        department_id,
        logger,
      });

      if (!existingDepartment) {
        throw new NotFoundError('Department not found');
      }

      const isDeleted = await departmentDb.deleteDepartment({
        department_id,
        logger,
      });

      if (!isDeleted) {
        throw new NotFoundError('Department not found');
      }

      return {
        success: true,
        message: 'Department deleted successfully',
        data: { department_id },
      };
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) throw err;
      throw new UnknownError(err.message || 'Failed to delete department');
    }
  };
};