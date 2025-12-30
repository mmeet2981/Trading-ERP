const express = require('express');
const router = express.Router();
const { createUserAction } = require('../modules/users/controller');

//create user
router.post(
    '/users',
    createUserAction
);



module.exports = router;