'use strict';

module.exports = function ({ tokenService }) {
  return async function authMiddleware(req, res, next) {
    try {
      // Get token from cookie (preferred) or Authorization header
      let token = req.cookies.auth_token;
      
      if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }

      if (!token) {
        if (req.log) {
          req.log.warn("No authentication token found in cookie or Authorization header");
        }
        return res.status(401).json({
          success: false,
          error: {
            message: "No authentication token provided. Please login first or include token in Authorization header.",
            code: "UNAUTHORIZED"
          }
        });
      }

      // Verify token
      const decoded = tokenService.verifyToken(token);
      
      // Attach user info to request
      req.user = decoded;
      req.token = token;
      
      next();
    } catch (error) {
      // Log error for debugging
      if (req.log) {
        req.log.error({ error: error.message, stack: error.stack }, "Token verification failed");
      }
      
      // Clear invalid token cookie
      res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      return res.status(401).json({
        success: false,
        error: {
          message: error.message || "Invalid or expired token",
          code: "UNAUTHORIZED"
        }
      });
    }
  };
};