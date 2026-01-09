'use strict';
const { userDb } = require("../data-access");
const { UnknownError,ValidationError,ConflictError,NotFoundError } = require("../../../utils/errors");
const Joi = require("joi");
const bcrypt = require("bcrypt"); // or your own hash utility


const makeCreateUser = require("./create-user");
const createUser = makeCreateUser({
  userDb,
  Joi,
  bcrypt,
  UnknownError,
  ValidationError,
  ConflictError,
});

const makeUpdateUser = require("./update-user");
const updateUser = makeUpdateUser({
  userDb,
  Joi,
  UnknownError,
  ValidationError,
  ConflictError,

});

const makeGetUsers = require('./get-users');
const getUsers = makeGetUsers({
  userDb,
  Joi,
  UnknownError,
  ValidationError,
  ConflictError,
})

const makeGetUserById = require("./get-user-by-id");
const getUserById = makeGetUserById({
  userDb,
  Joi,
  UnknownError,
  ValidationError,
  NotFoundError,
})

module.exports = {
  createUser,
  updateUser,
  getUsers,
  getUserById,
};
