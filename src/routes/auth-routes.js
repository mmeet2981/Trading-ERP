const express = require('express');
const router = express.Router();
const { 
    registerUserAction,
    loginUserAction, 
    logoutUserAction 
} = require('../modules/auth/controller');


router.post(
    '/register',
    registerUserAction
);

router.post('/login', loginUserAction);
router.post('/logout', logoutUserAction);

module.exports = router;