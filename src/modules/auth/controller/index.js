// Import actions from auth sub-folder
const {
  registerUserAction,
  loginUserAction,
  logoutUserAction,
} = require("./auth");


module.exports = {
  registerUserAction,
  loginUserAction,
  logoutUserAction,
};