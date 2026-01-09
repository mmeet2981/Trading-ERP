'use strict';
const { roleDb,permissionDb,departmentDb } = require("../data-access");
const { UnknownError,ValidationError,ConflictError,NotFoundError } = require("../../../utils/errors");
const Joi = require("joi");

// Role Usecase 
const makeCreateRole = require("./create-role");
const createRole = makeCreateRole({
    roleDb,
    Joi,
    UnknownError,
    ValidationError,
    ConflictError,
});

const makeDeleteRole = require("./delete-role");
const deleteRole = makeDeleteRole({
    roleDb,
    Joi,
    UnknownError,
    ValidationError,
    ConflictError,
    NotFoundError,
});

const makeUpdateRole = require("./update-role");
const updateRole = makeUpdateRole({
    roleDb,
    Joi,
    UnknownError,
    ValidationError,
    ConflictError,
});

const makeGetRoleById = require("./get-role-by-id");
const getRoleById = makeGetRoleById({
    roleDb,
    Joi,
    UnknownError,
    ValidationError,
    ConflictError,
    NotFoundError,
});

const makeGetRole = require("./get-roles");
const getRole = makeGetRole({
    roleDb,
    Joi,
    UnknownError,
    ValidationError,
    ConflictError,
});

// Permission Usecase

const makeCreatePermission = require("./create-permission");
const createPermission = makeCreatePermission({
    permissionDb,
    Joi,
    UnknownError,
    ValidationError,
    ConflictError,
});
const makeGetPermission = require("./get-permissions");
const getPermissions =makeGetPermission({
    permissionDb,
    Joi,
    UnknownError,
    ValidationError,
    ConflictError,
});

const makeGetPermissionById = require("./get-permission-by-id");
const getPermissionById = makeGetPermissionById({
    permissionDb,
    Joi,
    ValidationError,
    ConflictError,
    UnknownError,
    NotFoundError,
});

const makeUpdatePermission = require("./update-permission");
const updatePermission = makeUpdatePermission({
    permissionDb,
    Joi,
    UnknownError,
    ValidationError,
    NotFoundError,
    ConflictError,
});

const makeDeletePermission = require("./delete-permission");
const deletePermission = makeDeletePermission({
    permissionDb,
    Joi,
    UnknownError,
    ValidationError,
    ConflictError,
    NotFoundError,
});

// Department Usecase
const makeCreateDepartment = require("./create-department");
const createDepartment = makeCreateDepartment({
    departmentDb,
    Joi,
    ValidationError,
    ConflictError,
});

const makeGetDepartment = require("./get-departments");
const getDepartments = makeGetDepartment({
    departmentDb,
    Joi,
    UnknownError,
});

const makeGetDepartmentById = require("./get-department-by-id");
const getDepartmentById = makeGetDepartmentById({
    departmentDb,
    Joi,
    ValidationError,
    NotFoundError,
    UnknownError,
});

const makeUpdateDepartment = require("./update-department");
const updateDepartment = makeUpdateDepartment({
    departmentDb,
    Joi,
    ValidationError,
    NotFoundError,
    ConflictError,
    UnknownError,
});

const makeDeleteDepartment = require("./delete-department");
const deleteDepartment = makeDeleteDepartment({
    departmentDb,
    Joi,
    ValidationError,
    NotFoundError,
    UnknownError,
});


module.exports = {
//  Role Usecases
    createRole,
    deleteRole,
    getRoleById,
    getRole,
    updateRole,
    deleteRole,
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
