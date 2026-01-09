'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  updatePermissionUseCase,
}) {
  return async function updatePermissionAction(req, res) {
    const logger = req.log;

    try {
      const { permission_id } = req.params;
      const { 
        can_create, 
        can_view, 
        can_update, 
        can_delete, 
        can_authorize 
      } = req.body;

      const result = await updatePermissionUseCase({
        permission_id: parseInt(permission_id),
        can_create,
        can_view,
        can_update,
        can_delete,
        can_authorize,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in updatePermissionAction');
      return createErrorResponse(error, res);
    }
  };
};