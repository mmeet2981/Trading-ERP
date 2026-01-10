const { createSuccessResponse, createErrorResponse } = require('../../../../utils/response');
const { createPermission, getPermissionById, getPermissions, updatePermission, deletePermission } = require('../../usecase/permissions');

const makeCreatePermissionAction = require('./create-permission-action');
const makeGetPermissionByIdAction = require('./get-permission-by-id-action');
const makeGetPermissionsAction = require('./get-permissions-action');
const makeUpdatePermissionAction = require('./update-permission-action');
const makeDeletePermissionAction = require('./delete-permission-action');

const createPermissionAction = makeCreatePermissionAction({
  createErrorResponse,
  createSuccessResponse,
  createPermissionUseCase: createPermission
});

const getPermissionByIdAction = makeGetPermissionByIdAction({
  createErrorResponse,
  createSuccessResponse,
  getPermissionByIdUseCase: getPermissionById
});

const getPermissionsAction = makeGetPermissionsAction({
  createErrorResponse,
  createSuccessResponse,
  getPermissionsUseCase: getPermissions
});

const updatePermissionAction = makeUpdatePermissionAction({
  createErrorResponse,
  createSuccessResponse,
  updatePermissionUseCase: updatePermission
});

const deletePermissionAction = makeDeletePermissionAction({
  createErrorResponse,
  createSuccessResponse,
  deletePermissionUseCase: deletePermission
});

module.exports = {
  createPermissionAction,
  getPermissionByIdAction,
  getPermissionsAction,
  updatePermissionAction,
  deletePermissionAction,
};
