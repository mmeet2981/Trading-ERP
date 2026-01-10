'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  createUserUseCase,
}) {
  return async function createUserAction(req, res) {
    const logger = req.log;

    try {
      const userData = req.body;

      const createdBy = req.user?.user_id || null;

      const result = await createUserUseCase({
        userData,
        createdBy,
        logger,
      });

      return createSuccessResponse(201, result, res);
    } catch (error) {
      logger.error(error);
      logger.error("Error in createUserAction");
      return createErrorResponse(error, res);
    }
  };
};
