'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getRoleByIdUseCase,
}) {
  return async function getRoleByIdAction(req, res) {
    const logger = req.log;

    try {
      const { role_id } = req.params;

      const result = await getRoleByIdUseCase({
        role_id,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      return createErrorResponse(error, res);
    }
  };
};
