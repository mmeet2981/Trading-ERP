'use strict';
const makeCreateUser = require("./create-user");
const makeUpdateUser = require("./update-user");
const { userDb } = require("../data-access");
const { UnknownError,ValidationError,ConflictError } = require("../../../utils/errors");
const Joi = require("joi");
const bcrypt = require("bcrypt"); // or your own hash utility


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

module.exports = {
  createUser,
  updateUser,
};
