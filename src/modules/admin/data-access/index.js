const sequelize = require("../../../config/db");
const { UnknownError } = require("../../../utils/errors");

const makeRoleDb = require("./role-db");
const roleDb = makeRoleDb({
    sequelize,
    UnknownError
});

const makePermissionDb = require("./permission-db");
const permissionDb = makePermissionDb({
  sequelize,
  UnknownError
});

const makeDepartmentDb = require("./department-db");
const departmentDb = makeDepartmentDb({
  sequelize,
  UnknownError,
})

module.exports = {
  roleDb,
  permissionDb,
  departmentDb,
};
