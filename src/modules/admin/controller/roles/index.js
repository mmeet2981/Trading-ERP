const { createSuccessResponse, createErrorResponse } = require('../../../../utils/response');
const { createRole, getRoleById, getRoles, updateRole, deleteRole } = require('../../usecase/roles');

const makeCreateRoleAction = require('./create-role-action');
const makeGetRoleByIdAction = require('./get-role-by-id-action');
const makeGetRolesAction = require('./get-role-action');
const makeUpdateRoleAction = require('./update-role-action');
const makeDeleteRoleAction = require('./delete-role-action');

const createRoleAction = makeCreateRoleAction({
  createErrorResponse,
  createSuccessResponse,
  createRoleUseCase: createRole
});

const getRoleByIdAction = makeGetRoleByIdAction({
  createErrorResponse,
  createSuccessResponse,
  getRoleByIdUseCase: getRoleById
});

const getRolesAction = makeGetRolesAction({
  createErrorResponse,
  createSuccessResponse,
  getRolesUseCase: getRoles
});

const updateRoleAction = makeUpdateRoleAction({
  createErrorResponse,
  createSuccessResponse,
  updateRoleUseCase: updateRole
});

const deleteRoleAction = makeDeleteRoleAction({
  createErrorResponse,
  createSuccessResponse,
  deleteRoleUseCase: deleteRole
});

module.exports = {
  createRoleAction,
  getRoleByIdAction,
  getRolesAction,
  updateRoleAction,
  deleteRoleAction,
};
