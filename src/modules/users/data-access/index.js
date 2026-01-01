const sequelize = require("../../../config/db");
const { UnknownError } = require("../../../utils/errors");


const makeUserDb = require("./user-db");
const userDb = makeUserDb({
    sequelize,
    UnknownError,
  });

module.exports = {
  userDb,
};
