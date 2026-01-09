'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getPermissionByIdUseCase,
}) {
  return async function getPermissionByIdAction(req, res) {
    const logger = req.log;

    try {
      const { permission_id } = req.params;

      const result = await getPermissionByIdUseCase({
        permission_id: parseInt(permission_id),
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in getPermissionByIdAction');
      return createErrorResponse(error, res);
    }
  };
};