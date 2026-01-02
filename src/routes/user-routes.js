const express = require('express');
const router = express.Router();
const { createUserAction, updateUserAction } = require('../modules/users/controller');
const { authMiddleware } = require('../middleware/auth-middleware');
const uploadProfile = require('../modules/users/middlewares/profile-upload');

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
    uploadProfile,
    updateUserAction
);



module.exports = router;