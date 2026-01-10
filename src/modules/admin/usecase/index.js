// Import usecases from sub-folders
const {
  createRole,
  getRoleById,
  getRoles: getRole,
  updateRole,
  deleteRole,
} = require("./roles");

const {
  createPermission,
  getPermissionById,
  getPermissions,
  updatePermission,
  deletePermission,
} = require("./permissions");

const {
  createDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} = require("./departments");

module.exports = {
//  Role Usecases
    createRole,
    deleteRole,
    getRoleById,
    getRole,
    updateRole,
//  Permission Usecases
    createPermission,
    updatePermission,
    getPermissions,
    getPermissionById,
    deletePermission,
// Department Usecase
    createDepartment,
    updateDepartment,
    getDepartments,
    getDepartmentById,
    deleteDepartment,
};