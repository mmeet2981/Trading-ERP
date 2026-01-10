'use strict';

module.exports = function ({
  departmentDb,
  Joi,
  ValidationError,
  ConflictError,
  UnknownError,
}) {
  return async function createDepartment({ department_name, logger }) {
    try {
      const schema = Joi.object({
        department_name: Joi.string().max(50).trim().required(),
      });

      const { error, value } = schema.validate({ department_name }, { abortEarly: false });

      if (error) {
        const err = new ValidationError('Invalid department input');
        err.details = error.details.map(d => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      // Check if department name already exists
      const existing = await departmentDb.findDepartmentByName({
        department_name: value.department_name,
        logger,
      });

      if (existing) {
        throw new ConflictError('Department name already exists');
      }

      const department = await departmentDb.createDepartment({
        department_name: value.department_name,
        logger,
      });

      return {
        success: true,
        message: 'Department created successfully',
        data: department,
      };
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) throw err;
      throw new UnknownError(err.message || 'Failed to create department');
    }
  };
};