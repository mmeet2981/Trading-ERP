const express = require('express');
const router = express.Router();
const userRoutes = require("./user-routes");


router.use('/v1/user-service',userRoutes)


module.exports = router;