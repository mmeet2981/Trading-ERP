'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  logoutUserUseCase,
}) {
  return async function logoutUserAction(req, res) {
    const logger = req.log;

    try {
      const result = await logoutUserUseCase({
        logger,
      });

      // Clear the auth cookie
      res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error("Error in logoutUserAction");
      return createErrorResponse(error, res);
    }
  };
};