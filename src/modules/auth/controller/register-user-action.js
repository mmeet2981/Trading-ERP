'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  registerUserUseCase,
}) {
  return async function registerUserAction(req, res) {
    const logger = req.log;

    try {
      const userData = req.body;
      // No createdBy for registration as it's self-registration
      // created_by will be null or set to default

      const result = await registerUserUseCase({
        userData,
        logger,
      });

      return createSuccessResponse(201, result, res);
    } catch (error) {
      logger.error(error);
      logger.error("Error in registerUserAction");
      return createErrorResponse(error, res);
    }
  };
};