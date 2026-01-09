'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  createPermissionUseCase,
}) {
  return async function createPermissionAction(req, res) {
    const logger = req.log;

    try {
      const { 
        can_create, 
        can_view, 
        can_update, 
        can_delete, 
        can_authorize 
      } = req.body;

      const result = await createPermissionUseCase({
        can_create,
        can_view,
        can_update,
        can_delete,
        can_authorize,
        logger,
      });

      return createSuccessResponse(201, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in createPermissionAction');
      return createErrorResponse(error, res);
    }
  };
};