// Import usecases from users sub-folder
const {
  createUser,
  updateUser,
  getUsers,
  getUserById,
} = require("./users");

module.exports = {
  createUser,
  updateUser,
  getUsers,
  getUserById,
};
