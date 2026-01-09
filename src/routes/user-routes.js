const express = require('express');
const router = express.Router();
const { createUserAction, updateUserAction,getUsersAction,getUserByIdAction } = require('../modules/users/controller');
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

// getAll User
router.get(
  '/users', // post add filters
  authMiddleware,
  getUsersAction
);

router.get(
  '/users/:user_id',
  authMiddleware,
  getUserByIdAction
)







module.exports = router;