const { createUser, updateUser,getUsers,getUserById } = require("../usecase");
const uploadProfilePicture = require('../utils/upload-profile-picture')
const {
  createErrorResponse,
  createSuccessResponse,
} = require("../../../utils/response")

const makeCreateUserAction = require("./create-user-action");
const createUserAction = makeCreateUserAction({
  createErrorResponse,
  createSuccessResponse,
  createUserUseCase: createUser,
});

const makeUpdateUserAction = require("./update-user-action");
const updateUserAction = makeUpdateUserAction({
  createErrorResponse,
  createSuccessResponse,
  uploadProfilePicture,
  updateUserUseCase: updateUser,
});

const makeGetUsersAction  = require("./get-users-action");
const getUsersAction = makeGetUsersAction({
  createErrorResponse,
  createSuccessResponse,
  getUsersUseCase: getUsers,
})

const makeGetUserByIdAction = require("./get-user-by-id-action");
const getUserByIdAction = makeGetUserByIdAction({
  createErrorResponse,
  createSuccessResponse,
  getUserByIdUseCase: getUserById,
})

module.exports = {
  createUserAction,
  updateUserAction,
  getUsersAction,
  getUserByIdAction,
};
