'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  updateRoleUseCase,
}) {
  return async function updateRoleAction(req, res) {
    const logger = req.log;

    try {
      const { role_id } = req.params;
      const { role_name } = req.body;

      const result = await updateRoleUseCase({
        role_id,
        role_name,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in updateRoleAction');
      return createErrorResponse(error, res);
    }
  };
};
