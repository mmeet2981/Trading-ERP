const makeRegisterUserAction = require("./register-user-action");
const makeLoginUserAction = require("./login-user-action");
const makeLogoutUserAction = require("./logout-user-action");
const { registerUser,  loginUser, logoutUser } = require("../usecase");

const {
  createErrorResponse,
  createSuccessResponse,
} = require("../../../utils/response")

const registerUserAction = makeRegisterUserAction({
  createErrorResponse,
  createSuccessResponse,
  registerUserUseCase: registerUser,
});

const loginUserAction = makeLoginUserAction({
  createErrorResponse,
  createSuccessResponse,
  loginUserUseCase: loginUser,
});

const logoutUserAction = makeLogoutUserAction({
  createErrorResponse,
  createSuccessResponse,
  logoutUserUseCase: logoutUser,
});


module.exports = {
  registerUserAction,
  loginUserAction,
  logoutUserAction,
};