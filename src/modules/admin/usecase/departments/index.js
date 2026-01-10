const { UnknownError, ValidationError, NotFoundError } = require('../../../../utils/errors');
const { adminDb } = require('../../data-access');
const Joi = require('joi');

const makeCreateDepartment = require('./create-department');
const makeGetDepartmentById = require('./get-department-by-id');
const makeGetDepartments = require('./get-departments');
const makeUpdateDepartment = require('./update-department');
const makeDeleteDepartment = require('./delete-department');

const createDepartment = makeCreateDepartment({
  departmentDb: adminDb,
  Joi,
  ValidationError,
  ConflictError: ValidationError, // Using ValidationError as ConflictError
  UnknownError
});

const getDepartmentById = makeGetDepartmentById({
  departmentDb: adminDb,
  Joi,
  ValidationError,
  NotFoundError,
  UnknownError
});

const getDepartments = makeGetDepartments({
  departmentDb: adminDb,
  Joi,
  ValidationError,
  UnknownError
});

const updateDepartment = makeUpdateDepartment({
  departmentDb: adminDb,
  Joi,
  ValidationError,
  NotFoundError,
  UnknownError
});

const deleteDepartment = makeDeleteDepartment({
  departmentDb: adminDb,
  Joi,
  ValidationError,
  NotFoundError,
  UnknownError
});

module.exports = {
  createDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
  deleteDepartment,
};
