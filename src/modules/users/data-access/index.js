const db = require("../../../config/db");
const { UnknownError } = require("../../../utils/errors");


const makeUserDb = require("./user-db");
const userDb = makeUserDb({
    db,
    UnknownError,
  });

module.exports = {
  userDb,
};
