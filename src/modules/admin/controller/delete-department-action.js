'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  deleteDepartmentUseCase,
}) {
  return async function deleteDepartmentAction(req, res) {
    const logger = req.log;

    try {
      const { department_id } = req.params;

      const result = await deleteDepartmentUseCase({
        department_id: parseInt(department_id),
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in deleteDepartmentAction');
      return createErrorResponse(error, res);
    }
  };
};