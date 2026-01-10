'use strict';

module.exports = function ({
  departmentDb,
  Joi,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnknownError,
}) {
  return async function updateDepartment({ 
    department_id,
    department_name, 
    logger 
  }) {
    try {
      // Schema for PATCH - department_name is optional for partial updates
      const schema = Joi.object({
        department_id: Joi.number().integer().positive().required(),
        department_name: Joi.string().max(50).trim().optional(),
      }).or('department_name').message('At least one field must be provided for update');

      const { error, value } = schema.validate({ 
        department_id,
        department_name
      }, { 
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const err = new ValidationError('Invalid department input');
        err.details = error.details.map(d => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      // Check if department exists
      const existingDepartment = await departmentDb.findDepartmentById({
        department_id: value.department_id,
        logger,
      });

      if (!existingDepartment) {
        throw new NotFoundError('Department not found');
      }

      // If department_name is being updated, check for duplicates
      let finalDepartmentName = existingDepartment.department_name;
      
      if (value.department_name !== undefined) {
        // Check if new department name already exists (excluding current)
        const duplicateDepartment = await departmentDb.findDepartmentByName({
          department_name: value.department_name,
          exclude_id: value.department_id,
          logger,
        });

        if (duplicateDepartment) {
          throw new ConflictError('Department name already exists');
        }
        
        finalDepartmentName = value.department_name;
      }

      const department = await departmentDb.updateDepartment({
        department_id: value.department_id,
        department_name: finalDepartmentName,
        logger,
      });

      return {
        success: true,
        message: 'Department updated successfully',
        data: department,
      };
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) throw err;
      throw new UnknownError(err.message || 'Failed to update department');
    }
  };
};