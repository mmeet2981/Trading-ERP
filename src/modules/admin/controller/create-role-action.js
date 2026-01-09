'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  createRoleUseCase,
}) {
  return async function createRoleAction(req, res) {
    const logger = req.log;

    try {
      const { role_name } = req.body;

      const result = await createRoleUseCase({
        role_name,
        logger,
      });

      return createSuccessResponse(201, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in createRoleAction');
      return createErrorResponse(error, res);
    }
  };
};
