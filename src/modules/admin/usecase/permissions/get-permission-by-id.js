'use strict';

module.exports = function ({
  permissionDb,
  Joi,
  ValidationError,
  NotFoundError,
  UnknownError,
}) {
  return async function getPermissionById({ permission_id, logger }) {
    try {
      const schema = Joi.object({
        permission_id: Joi.number().integer().positive().required(),
      });

      const { error } = schema.validate({ permission_id }, { abortEarly: false });

      if (error) {
        const err = new ValidationError('Invalid permission ID');
        err.details = error.details.map(d => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      const permission = await permissionDb.findPermissionById({
        permission_id,
        logger,
      });

      if (!permission) {
        throw new NotFoundError('Permission not found');
      }

      return {
        success: true,
        message: 'Permission retrieved successfully',
        data: permission,
      };
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) throw err;
      throw new UnknownError(err.message || 'Failed to retrieve permission');
    }
  };
};