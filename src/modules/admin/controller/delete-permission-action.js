'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  deletePermissionUseCase,
}) {
  return async function deletePermissionAction(req, res) {
    const logger = req.log;

    try {
      const { permission_id } = req.params;

      const result = await deletePermissionUseCase({
        permission_id: parseInt(permission_id),
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in deletePermissionAction');
      return createErrorResponse(error, res);
    }
  };
};