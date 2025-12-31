'use strict';
const makeRegisterUser = require("./register-user");
const makeLoginUser = require("./login-user");
const makeLogoutUser = require("./logout-user");
const { userDb } = require("../../users/data-access");
const { UnknownError } = require("../../../utils/errors");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwtConfig = require("../../../config/jwt-config");
const makeTokenService = require("../../../utils/token-service");

const tokenService = makeTokenService(jwtConfig);

const registerUser = makeRegisterUser({
  userDb,
  Joi,
  bcrypt,
  UnknownError,
});

const loginUser = makeLoginUser({
  userDb,
  Joi,
  bcrypt,
  UnknownError,
  tokenService,
});

const logoutUser = makeLogoutUser({
  tokenService,
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};