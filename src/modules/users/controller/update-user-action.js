'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  updateUserUseCase,
}) {
  return async function updateUserAction(req, res) {
    const logger = req.log;

    try {
      const user_id = req.params.user_id || req.body.user_id;
      const userData = req.body;
      const updatedBy = req.user?.user_id || 1;

      if (!user_id) {
        return createErrorResponse(
          { message: "User ID is required" },
          res,
          400
        );
      }

      const result = await updateUserUseCase({
        user_id: parseInt(user_id),
        userData,
        updatedBy,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error("Error in updateUserAction");
      return createErrorResponse(error, res);
    }
  };
};

