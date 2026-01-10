// Import actions from users sub-folder
const {
  createUserAction,
  updateUserAction,
  getUsersAction,
  getUserByIdAction,
} = require("./users");

module.exports = {
  createUserAction,
  updateUserAction,
  getUsersAction,
  getUserByIdAction,
};
