const makeCreateUser = require("./create-user");

const { userDb } = require("../data-access");

const {
  UnknownError,
} = require("eva-utilities").errors;



const createUser = makeCreateUser({
  userDb,
  joi,
  hash,
  createUserWisePermissionCall:
    adminService.createUserWisePermissionCall,
  config,
  UnknownError,
});

module.exports = {
  createUser,
};
