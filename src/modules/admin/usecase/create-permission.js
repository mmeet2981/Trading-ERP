'use strict';

module.exports = function ({
  permissionDb,
  Joi,
  ValidationError,
  ConflictError,
  UnknownError,
}) {
  return async function createPermission({ 
    can_create, 
    can_view, 
    can_update, 
    can_delete, 
    can_authorize, 
    logger 
  }) {
    try {
      const schema = Joi.object({
        can_create: Joi.boolean().required(),
        can_view: Joi.boolean().required(),
        can_update: Joi.boolean().required(),
        can_delete: Joi.boolean().required(),
        can_authorize: Joi.boolean().required(),
      });

      const { error, value } = schema.validate({ 
        can_create, 
        can_view, 
        can_update, 
        can_delete, 
        can_authorize 
      }, { abortEarly: false });

      if (error) {
        const err = new ValidationError('Invalid permission input');
        err.details = error.details.map(d => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      // Check if permission combination already exists
      const existing = await permissionDb.findExistingPermission({
        can_create: value.can_create,
        can_view: value.can_view,
        can_update: value.can_update,
        can_delete: value.can_delete,
        can_authorize: value.can_authorize,
        logger,
      });

      if (existing) {
        throw new ConflictError('Permission combination already exists');
      }

      const permission = await permissionDb.createPermission({
        can_create: value.can_create,
        can_view: value.can_view,
        can_update: value.can_update,
        can_delete: value.can_delete,
        can_authorize: value.can_authorize,
        logger,
      });

      return {
        success: true,
        message: 'Permission created successfully',
        data: permission,
      };
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) throw err;
      throw new UnknownError(err.message || 'Failed to create permission');
    }
  };
};