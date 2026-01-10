// Import usecases from auth sub-folder
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("./auth");

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};