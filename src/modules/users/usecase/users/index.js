const { userDb } = require('../../data-access');
const { UnknownError, ValidationError, ConflictError, NotFoundError } = require('../../../../utils/errors');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const makeCreateUser = require('./create-user');
const makeUpdateUser = require('./update-user');
const makeGetUsers = require('./get-users');
const makeGetUserById = require('./get-user-by-id');

const createUser = makeCreateUser({
  userDb,
  Joi,
  bcrypt,
  UnknownError,
  ValidationError,
  ConflictError,
});

const updateUser = makeUpdateUser({
  userDb,
  Joi,
  UnknownError,
  ValidationError,
  ConflictError,
});

const getUsers = makeGetUsers({
  userDb,
  Joi,
  UnknownError,
  ValidationError,
  ConflictError,
});

const getUserById = makeGetUserById({
  userDb,
  Joi,
  UnknownError,
  ValidationError,
  NotFoundError,
});

module.exports = {
  createUser,
  updateUser,
  getUsers,
  getUserById,
};
