const { UnknownError, ValidationError, NotFoundError } = require('../../../../utils/errors');
const { adminDb } = require('../../data-access');
const Joi = require('joi');

const makeCreateRole = require('./create-role');
const makeGetRoleById = require('./get-role-by-id');
const makeGetRoles = require('./get-roles');
const makeUpdateRole = require('./update-role');
const makeDeleteRole = require('./delete-role');

const createRole = makeCreateRole({
  roleDb: adminDb,
  Joi,
  ValidationError,
  ConflictError: ValidationError, // Using ValidationError as ConflictError
  UnknownError
});

const getRoleById = makeGetRoleById({
  roleDb: adminDb,
  Joi,
  ValidationError,
  NotFoundError,
  UnknownError
});

const getRoles = makeGetRoles({
  roleDb: adminDb,
  Joi,
  ValidationError,
  UnknownError
});

const updateRole = makeUpdateRole({
  roleDb: adminDb,
  Joi,
  ValidationError,
  NotFoundError,
  UnknownError
});

const deleteRole = makeDeleteRole({
  roleDb: adminDb,
  Joi,
  ValidationError,
  NotFoundError,
  UnknownError
});

module.exports = {
  createRole,
  getRoleById,
  getRoles,
  updateRole,
  deleteRole,
};
