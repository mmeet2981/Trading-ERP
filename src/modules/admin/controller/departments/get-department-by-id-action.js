'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getDepartmentByIdUseCase,
}) {
  return async function getDepartmentByIdAction(req, res) {
    const logger = req.log;

    try {
      const { department_id } = req.params;

      const result = await getDepartmentByIdUseCase({
        department_id: parseInt(department_id),
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in getDepartmentByIdAction');
      return createErrorResponse(error, res);
    }
  };
};