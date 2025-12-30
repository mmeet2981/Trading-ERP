const db = require("../../../config/db");
const { UnknownError } = require("eva-utilities").errors;


const makeUserDb = require("./user-db");
const userDb = makeUserDb({
    db,
    UnknownError,
  });

module.exports = {
  userDb,
};
