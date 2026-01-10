'use strict';

module.exports = function ({
  roleDb,
  Joi,
  ValidationError,
  NotFoundError,
  UnknownError,
}) {
  return async function updateRole({ role_id, role_name, logger }) {
    try {
      const schema = Joi.object({
        role_id: Joi.number().integer().required(),
        role_name: Joi.string().max(70).required(),
      });

      const { error, value } = schema.validate({ role_id, role_name });
      if (error) {
        throw new ValidationError('Invalid update input');
      }

      const updated = await roleDb.updateRole({
        role_id: value.role_id,
        role_name: value.role_name,
        logger,
      });

      if (!updated) {
        throw new NotFoundError('Role not found');
      }

      return {
        success: true,
        message: 'role updated successfully',
        data: updated,
      };
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) throw err;
      throw new UnknownError(err.message || 'Failed to update role');
    }
  };
};
