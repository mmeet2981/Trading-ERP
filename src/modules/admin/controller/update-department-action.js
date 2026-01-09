'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  updateDepartmentUseCase,
}) {
  return async function updateDepartmentAction(req, res) {
    const logger = req.log;

    try {
      const { department_id } = req.params;
      const { department_name } = req.body;

      const result = await updateDepartmentUseCase({
        department_id: parseInt(department_id),
        department_name,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in updateDepartmentAction');
      return createErrorResponse(error, res);
    }
  };
};