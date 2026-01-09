// const { createRole,getRoleById,getRole,updateRole,deleteRole,} = require("../usecase");
const {
//  Role Usecases
    createRole,
    getRole,
    getRoleById,
    updateRole,
    deleteRole,
//  Permission Usecases
    createPermission,
    getPermissionById,
    getPermissions,
    updatePermission,
    deletePermission,
// Department Usecase
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
} = require("../usecase");

const {
  createErrorResponse,
  createSuccessResponse,
} = require("../../../utils/response")


const makeCreateRoleAction = require("./create-role-action");
const createRoleAction = makeCreateRoleAction({
    createErrorResponse,
    createSuccessResponse,
    createRoleUseCase: createRole,
});

const makeGetRoleAction = require("./get-role-action");
const getRolesAction = makeGetRoleAction({
    createErrorResponse,
    createSuccessResponse,
    getRolesUseCase: getRole,
});

const makeGetRoleByIdAction = require("./get-role-by-id-action");
const getRoleByIdAction = makeGetRoleByIdAction({
    createErrorResponse,
    createSuccessResponse,
    getRoleByIdUseCase: getRoleById,
});
const makeUpdateRoleAction = require("./update-role-action");
const updateRoleAction = makeUpdateRoleAction({
    createErrorResponse,
    createSuccessResponse,
    updateRoleUseCase: updateRole,
});
const makeDeleteRoleAction = require("./delete-role-action");
const deleteRoleAction = makeDeleteRoleAction({
    createErrorResponse,
    createSuccessResponse,
    deleteRoleUseCase: deleteRole,
});

// Permission Action controller 

const makeCreatePermissionAction = require("./create-permission-action");
const createPermissionAction = makeCreatePermissionAction({
    createErrorResponse,
    createSuccessResponse,
    createPermissionUseCase: createPermission,
});


const makeGetPermissionByIdAction = require("./get-permission-by-id-action");
const getPermissionByIdAction = makeGetPermissionByIdAction({
    createErrorResponse,
    createSuccessResponse,
    getPermissionByIdUseCase:getPermissionById,
});

const makeGetPermissionAction = require("./get-permissions-action");
const getPermissionsAction = makeGetPermissionAction({
    createErrorResponse,
    createSuccessResponse,
    getPermissionsUseCase: getPermissions,
});

const makeDeletePermissionAction = require("./delete-permission-action");
const deletePermissionAction = makeDeletePermissionAction({
    createErrorResponse,
    createSuccessResponse,
    deletePermissionUseCase: deletePermission,
});

const makeUpdatePermissionAction = require("./update-permission-action");
const updatePermissionAction = makeUpdatePermissionAction({
    createErrorResponse,
    createSuccessResponse,
    updatePermissionUseCase: updatePermission,
});

// Department Action Controller
const makeCreateDepartmentAction = require("./create-department-action");
const createDepartmentAction = makeCreateDepartmentAction({
    createErrorResponse,
    createSuccessResponse,
    createDepartmentUseCase: createDepartment,
});

const makeGetDepartmentAction = require("./get-departments-action");
const getDepartmentsAction = makeGetDepartmentAction({
    createErrorResponse,
    createSuccessResponse,
    getDepartmentsUseCase: getDepartments,
});

const makeGetDepartmentByIdAction = require("./get-department-by-id-action");
const getDepartmentByIdAction = makeGetDepartmentByIdAction({
    createErrorResponse,
    createSuccessResponse,
    getDepartmentByIdUseCase: getDepartmentById,
});

const makeUpdateDepartmentAction = require("./update-department-action");
const updateDepartmentAction = makeUpdateDepartmentAction({
    createErrorResponse,
    createSuccessResponse,
    updateDepartmentUseCase:updateDepartment,
});

const makeDeleteDepartmentAction = require("./delete-department-action");
const deleteDepartmentAction = makeDeleteDepartmentAction({
    createErrorResponse,
    createSuccessResponse,
    deleteDepartmentUseCase:deleteDepartment,
});






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
