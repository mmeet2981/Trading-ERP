'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getDepartmentsUseCase,
}) {
  return async function getDepartmentsAction(req, res) {
    const logger = req.log;

    try {
      const result = await getDepartmentsUseCase({
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in getDepartmentsAction');
      return createErrorResponse(error, res);
    }
  };
};