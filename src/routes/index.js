const express = require('express');

const router = express.Router();
const adminRoutes = require("./admin-routes");
const userRoutes = require("./user-routes");
const authRoutes = require("./auth-routes");
const inquiryRoutes = require('./inquiry-routes');
const inquiryInteractionRoutes = require('./inquiry-interaction-routes');

router.use('/v1/admin-service',adminRoutes);
router.use('/v1/user-service',userRoutes);
router.use('/v1/auth-service', authRoutes);
router.use('/v1/inquiries-service', inquiryRoutes);
router.use('/v1/inquiry-interactions-service', inquiryInteractionRoutes);

module.exports = router;