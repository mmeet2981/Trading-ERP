module.exports = function ({
    createErrorResponse,
    createSuccessResponse,
    createUserUseCase,
  }) {
    return async function createUserAction(req, res) {
      const logger = req.log;
  
      try {
        const userData = req.body;
        const createdBy = req.user.id;
  
        const result = await createUserUseCase({
          userData,
          createdBy,
          logger,
        });
  
        return createSuccessResponse(201, result, res);
      } catch (error) {
        logger.error(error);
        logger.error("Error in createUserController");
        return createErrorResponse(error, res);
      }
    };
  };
  