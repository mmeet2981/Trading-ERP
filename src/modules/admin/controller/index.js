// Import actions from sub-folders
const {
  createRoleAction,
  deleteRoleAction,
  getRoleByIdAction,
  getRolesAction,
  updateRoleAction,
} = require("./roles");

const {
  createPermissionAction,
  getPermissionsAction,
  getPermissionByIdAction,
  updatePermissionAction,
  deletePermissionAction,
} = require("./permissions");

const {
  createDepartmentAction,
  getDepartmentsAction,
  getDepartmentByIdAction,
  updateDepartmentAction,
  deleteDepartmentAction,
} = require("./departments");






module.exports = {
// Role Actions
  createRoleAction,
  deleteRoleAction,
  getRoleByIdAction,
  getRolesAction,
  updateRoleAction,
//  Permission Actions
  createPermissionAction,
  getPermissionsAction,
  getPermissionByIdAction,
  updatePermissionAction,
  deletePermissionAction,
//  Department Action
  createDepartmentAction,
  getDepartmentsAction,
  getDepartmentByIdAction,
  updateDepartmentAction,
  deleteDepartmentAction,
  
};
