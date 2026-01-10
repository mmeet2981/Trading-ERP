'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  loginUserUseCase,
}) {
  return async function loginUserAction(req, res) {
    const logger = req.log;

    try {
      const credentials = req.body;

      const result = await loginUserUseCase({
        credentials,
        logger,
      });

      // Set JWT token in HTTP-only cookie
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      });

      // Never expose token in production
      if (process.env.NODE_ENV === 'production') {
        delete result.token;
      }


      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      return createErrorResponse(error, res);
    }
  };
};
