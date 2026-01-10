'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  deleteRoleUseCase,
}) {
  return async function deleteRoleAction(req, res) {
    const logger = req.log;

    try {
      const { role_id } = req.params;

      const result = await deleteRoleUseCase({
        role_id,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in deleteRoleAction');
      return createErrorResponse(error, res);
    }
  };
};
