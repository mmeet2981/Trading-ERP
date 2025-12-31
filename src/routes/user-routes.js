const express = require('express');
const router = express.Router();
const { createUserAction, updateUserAction } = require('../modules/users/controller');
const { authMiddleware } = require('../middleware/auth-middleware');

//create user
router.post(
    '/users',
    authMiddleware,
    createUserAction
);

//update user
router.put(
    '/users/:user_id',
    authMiddleware,
    updateUserAction
);



module.exports = router;