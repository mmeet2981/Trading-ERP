'use strict';

const makeAuthMiddleware = require('./make-auth-middleware');
const jwtConfig = require('../config/jwt-config');
const makeTokenService = require('../utils/token-service');

const tokenService = makeTokenService(jwtConfig);

const authMiddleware = makeAuthMiddleware({ tokenService });

module.exports = {
  authMiddleware,
};