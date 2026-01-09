const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth-middleware');
const {
    createRoleAction,
    deleteRoleAction,
    getRoleByIdAction,
    getRolesAction,
    updateRoleAction,
    createPermissionAction,
    getPermissionsAction,
    getPermissionByIdAction,
    updatePermissionAction,
    deletePermissionAction,
    createDepartmentAction,
    getDepartmentsAction,
    getDepartmentByIdAction,
    updateDepartmentAction,
    deleteDepartmentAction,
} = require('../modules/admin/controller');

// Routes to use CRUD on Roles 
router.post('/roles', authMiddleware, createRoleAction);
router.get('/roles', authMiddleware, getRolesAction);
router.get('/roles/:role_id', authMiddleware, getRoleByIdAction);
router.put('/roles/:role_id', authMiddleware, updateRoleAction);
router.delete('/roles/:role_id', authMiddleware, deleteRoleAction);


// Routes to use CRUD on Permissions
router.post('/permissions', authMiddleware, createPermissionAction);
router.get('/permissions', authMiddleware, getPermissionsAction);
router.get('/permissions/:permission_id', authMiddleware, getPermissionByIdAction);
router.patch('/permissions/:permission_id', authMiddleware, updatePermissionAction);
router.delete('/permissions/:permission_id', authMiddleware, deletePermissionAction);

// Routes to use CRUD on Department
router.post('/departments', authMiddleware, createDepartmentAction);
router.get('/departments', authMiddleware, getDepartmentsAction);
router.get('/departments/:department_id', authMiddleware, getDepartmentByIdAction);
router.patch('/departments/:department_id', authMiddleware, updateDepartmentAction);
router.delete('/departments/:department_id', authMiddleware, deleteDepartmentAction);

module.exports = router;
