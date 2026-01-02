const makeCreateUserAction = require("./create-user-action");
const makeUpdateUserAction = require("./update-user-action");
const { createUser, updateUser } = require("../usecase");
const uploadProfilePicture = require('../utils/upload-profile-picture')
const {
  createErrorResponse,
  createSuccessResponse,
} = require("../../../utils/response")

const createUserAction = makeCreateUserAction({
  createErrorResponse,
  createSuccessResponse,
  createUserUseCase: createUser,
});

const updateUserAction = makeUpdateUserAction({
  createErrorResponse,
  createSuccessResponse,
  uploadProfilePicture,
  updateUserUseCase: updateUser,
});


module.exports = {
  createUserAction,
  updateUserAction,
};
