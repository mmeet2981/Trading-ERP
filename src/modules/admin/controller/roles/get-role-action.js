'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getRolesUseCase,
}) {
  return async function getRolesAction(req, res) {
    const logger = req.log;

    try {
      const result = await getRolesUseCase({
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in getRolesAction');
      return createErrorResponse(error, res);
    }
  };
};
