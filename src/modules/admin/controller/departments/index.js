const { createSuccessResponse, createErrorResponse } = require('../../../../utils/response');
const { createDepartment, getDepartmentById, getDepartments, updateDepartment, deleteDepartment } = require('../../usecase/departments');

const makeCreateDepartmentAction = require('./create-department-action');
const makeGetDepartmentByIdAction = require('./get-department-by-id-action');
const makeGetDepartmentsAction = require('./get-departments-action');
const makeUpdateDepartmentAction = require('./update-department-action');
const makeDeleteDepartmentAction = require('./delete-department-action');

const createDepartmentAction = makeCreateDepartmentAction({
  createErrorResponse,
  createSuccessResponse,
  createDepartmentUseCase: createDepartment
});

const getDepartmentByIdAction = makeGetDepartmentByIdAction({
  createErrorResponse,
  createSuccessResponse,
  getDepartmentByIdUseCase: getDepartmentById
});

const getDepartmentsAction = makeGetDepartmentsAction({
  createErrorResponse,
  createSuccessResponse,
  getDepartmentsUseCase: getDepartments
});

const updateDepartmentAction = makeUpdateDepartmentAction({
  createErrorResponse,
  createSuccessResponse,
  updateDepartmentUseCase: updateDepartment
});

const deleteDepartmentAction = makeDeleteDepartmentAction({
  createErrorResponse,
  createSuccessResponse,
  deleteDepartmentUseCase: deleteDepartment
});

module.exports = {
  createDepartmentAction,
  getDepartmentByIdAction,
  getDepartmentsAction,
  updateDepartmentAction,
  deleteDepartmentAction,
};
