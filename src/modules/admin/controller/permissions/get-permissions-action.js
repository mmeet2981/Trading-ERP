'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getPermissionsUseCase,
}) {
  return async function getPermissionsAction(req, res) {
    const logger = req.log;

    try {
      const result = await getPermissionsUseCase({
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in getPermissionsAction');
      return createErrorResponse(error, res);
    }
  };
};