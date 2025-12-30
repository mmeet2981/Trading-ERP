'use strict';
const makeCreateUser = require("./create-user");
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

module.exports = {
  createUser,
};
