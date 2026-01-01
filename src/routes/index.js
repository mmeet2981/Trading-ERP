console.log('ROUTES INDEX LOADED');

const express = require('express');
const router = express.Router();
const userRoutes = require("./user-routes");
const authRoutes = require("./auth-routes");
const inquiryRoutes = require('./inquiry-routes');
const inquiryInteractionRoutes = require('./inquiry-interaction-routes');

router.use('/v1/user-service',userRoutes)
router.use('/v1/auth', authRoutes);
router.use('/api/inquiries', inquiryRoutes);
router.use('/api/inquiry-interactions', inquiryInteractionRoutes);

module.exports = router;