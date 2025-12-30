const makeCreateUserAction = require("./create-user-action");
const { createUser } = require("../usecase");

const {
  createErrorResponse,
  createSuccessResponse,
} = require("../../../utils/response")

const createUserAction = makeCreateUserAction({
  createErrorResponse,
  createSuccessResponse,
  createUserUseCase: createUser,
});

module.exports = {
  createUserAction,
};
