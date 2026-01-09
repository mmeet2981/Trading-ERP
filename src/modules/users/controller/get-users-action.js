'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getUsersUseCase,
}) {
  return async function getUsersAction(req, res) {
    const logger = req.log;

    try {
      const {
        page = 1,
        limit = 10,
        search = null,
        role_id = null,
        department_id = null,
      } = req.query;

      const result = await getUsersUseCase({
        page: Number(page),
        limit: Number(limit),
        search,
        role_id,
        department_id,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in getUsersAction');
      return createErrorResponse(error, res);
    }
  };
};
