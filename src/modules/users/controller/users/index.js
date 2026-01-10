const { createSuccessResponse, createErrorResponse } = require('../../../../utils/response');
const { createUser, updateUser, getUsers, getUserById } = require('../../usecase/users');
const uploadProfilePicture = require('../../utils/upload-profile-picture');

const makeCreateUserAction = require('./create-user-action');
const makeUpdateUserAction = require('./update-user-action');
const makeGetUsersAction = require('./get-users-action');
const makeGetUserByIdAction = require('./get-user-by-id-action');

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

const getUsersAction = makeGetUsersAction({
  createErrorResponse,
  createSuccessResponse,
  getUsersUseCase: getUsers,
});

const getUserByIdAction = makeGetUserByIdAction({
  createErrorResponse,
  createSuccessResponse,
  getUserByIdUseCase: getUserById,
});

module.exports = {
  createUserAction,
  updateUserAction,
  getUsersAction,
  getUserByIdAction,
};
