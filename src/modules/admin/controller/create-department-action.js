'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  createDepartmentUseCase,
}) {
  return async function createDepartmentAction(req, res) {
    const logger = req.log;

    try {
      const { department_name } = req.body;

      const result = await createDepartmentUseCase({
        department_name,
        logger,
      });

      return createSuccessResponse(201, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in createDepartmentAction');
      return createErrorResponse(error, res);
    }
  };
};