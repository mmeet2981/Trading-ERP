'use strict';

module.exports = function ({
  roleDb,
  Joi,
  ValidationError,
  ConflictError,
  UnknownError,
}) {
  return async function createRole({ role_name, logger }) {
    try {
      const schema = Joi.object({
        role_name: Joi.string().max(70).required(),
      });

      const { error, value } = schema.validate({ role_name }, { abortEarly: false });
      if (error) {
        const err = new ValidationError('Invalid role input');
        err.details = error.details.map(d => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      const existing = await roleDb.findRoleByName({
        role_name: value.role_name,
        logger,
      });

      if (existing) {
        throw new ConflictError('Role already exists');
      }

      const role = await roleDb.createRole({
        role_name: value.role_name,
        logger,
      });

      return {
        success: true,
        message: 'role created successfully',
        data: role,
      };
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) throw err;
      throw new UnknownError(err.message || 'Failed to create role');
    }
  };
};
