'use strict';
const makeCreateUser = require("./create-user");
const makeUpdateUser = require("./update-user");
const { userDb } = require("../data-access");
const { UnknownError } = require("../../../utils/errors");
const Joi = require("joi");
const bcrypt = require("bcrypt"); // or your own hash utility


const createUser = makeCreateUser({
  userDb,
  Joi,
  bcrypt,
  UnknownError,
});

const updateUser = makeUpdateUser({
  userDb,
  Joi,
  UnknownError,
});

module.exports = {
  createUser,
  updateUser,
};
