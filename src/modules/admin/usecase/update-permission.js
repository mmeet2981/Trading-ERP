'use strict';

module.exports = function ({
  permissionDb,
  Joi,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnknownError,
}) {
  return async function updatePermission({ 
    permission_id,
    can_create, 
    can_view, 
    can_update, 
    can_delete, 
    can_authorize, 
    logger 
  }) {
    try {
      // Schema for PATCH - all fields are optional
      const schema = Joi.object({
        permission_id: Joi.number().integer().positive().required(),
        can_create: Joi.boolean().optional(),
        can_view: Joi.boolean().optional(),
        can_update: Joi.boolean().optional(),
        can_delete: Joi.boolean().optional(),
        can_authorize: Joi.boolean().optional(),
      });

      // Validate only the provided fields
      const { error, value } = schema.validate({ 
        permission_id,
        can_create, 
        can_view, 
        can_update, 
        can_delete, 
        can_authorize 
      }, { 
        abortEarly: false,
        stripUnknown: true // Remove any undefined values
      });

      if (error) {
        const err = new ValidationError('Invalid permission input');
        err.details = error.details.map(d => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      // Check if permission exists and get current values
      const existingPermission = await permissionDb.findPermissionById({
        permission_id: value.permission_id,
        logger,
      });

      if (!existingPermission) {
        throw new NotFoundError('Permission not found');
      }

      // Merge existing values with new values for PATCH
      const updatedValues = {
        can_create: value.can_create !== undefined ? value.can_create : existingPermission.can_create,
        can_view: value.can_view !== undefined ? value.can_view : existingPermission.can_view,
        can_update: value.can_update !== undefined ? value.can_update : existingPermission.can_update,
        can_delete: value.can_delete !== undefined ? value.can_delete : existingPermission.can_delete,
        can_authorize: value.can_authorize !== undefined ? value.can_authorize : existingPermission.can_authorize,
      };

      // Check if updated permission combination already exists (excluding current)
      const duplicatePermission = await permissionDb.findExistingPermission({
        can_create: updatedValues.can_create,
        can_view: updatedValues.can_view,
        can_update: updatedValues.can_update,
        can_delete: updatedValues.can_delete,
        can_authorize: updatedValues.can_authorize,
        exclude_id: value.permission_id,
        logger,
      });

      if (duplicatePermission) {
        throw new ConflictError('Permission combination already exists');
      }

      const permission = await permissionDb.updatePermission({
        permission_id: value.permission_id,
        can_create: updatedValues.can_create,
        can_view: updatedValues.can_view,
        can_update: updatedValues.can_update,
        can_delete: updatedValues.can_delete,
        can_authorize: updatedValues.can_authorize,
        logger,
      });

      return {
        success: true,
        message: 'Permission updated successfully',
        data: permission,
      };
    } catch (err) {
      logger?.error(err);
      if (err.statusCode) throw err;
      throw new UnknownError(err.message || 'Failed to update permission');
    }
  };
};