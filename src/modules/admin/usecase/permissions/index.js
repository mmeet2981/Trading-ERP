const { UnknownError, ValidationError, NotFoundError } = require('../../../../utils/errors');
const { adminDb } = require('../../data-access');
const Joi = require('joi');

const makeCreatePermission = require('./create-permission');
const makeGetPermissionById = require('./get-permission-by-id');
const makeGetPermissions = require('./get-permissions');
const makeUpdatePermission = require('./update-permission');
const makeDeletePermission = require('./delete-permission');

const createPermission = makeCreatePermission({
  permissionDb: adminDb,
  Joi,
  ValidationError,
  ConflictError: ValidationError, // Using ValidationError as ConflictError
  UnknownError
});

const getPermissionById = makeGetPermissionById({
  permissionDb: adminDb,
  Joi,
  ValidationError,
  NotFoundError,
  UnknownError
});

const getPermissions = makeGetPermissions({
  permissionDb: adminDb,
  Joi,
  ValidationError,
  UnknownError
});

const updatePermission = makeUpdatePermission({
  permissionDb: adminDb,
  Joi,
  ValidationError,
  NotFoundError,
  UnknownError
});

const deletePermission = makeDeletePermission({
  permissionDb: adminDb,
  Joi,
  ValidationError,
  NotFoundError,
  UnknownError
});

module.exports = {
  createPermission,
  getPermissionById,
  getPermissions,
  updatePermission,
  deletePermission,
};
