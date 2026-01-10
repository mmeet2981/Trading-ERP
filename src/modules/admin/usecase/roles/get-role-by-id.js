'use strict';

module.exports = function ({
  roleDb,
  Joi,
  ValidationError,
  NotFoundError,
  UnknownError,
}) {
  return async function getRoleById({ role_id, logger }) {
    try {
      const schema = Joi.object({
        role_id: Joi.number().integer().required(),
      });

      const { error, value } = schema.validate({ role_id });
      if (error) {
        throw new ValidationError('Invalid role id');
      }

      const role = await roleDb.findRoleById({
        role_id: value.role_id,
        logger,
      });

      if (!role) {
        throw new NotFoundError('Role not found');
      }

      return {
        success: true,
        message: 'role fetched successfully',
        data: role,
      };
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) throw err;
      throw new UnknownError(err.message || 'Failed to fetch role');
    }
  };
};
