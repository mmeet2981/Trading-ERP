'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getUserByIdUseCase,
}) {
  return async function getUserByIdAction(req, res) {
    const logger = req.log;

    try {
      const { user_id } = req.params;

      const result = await getUserByIdUseCase({
        user_id,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in getUserByIdAction');
      return createErrorResponse(error, res);
    }
  };
};
