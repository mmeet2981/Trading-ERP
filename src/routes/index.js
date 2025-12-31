const express = require('express');
const router = express.Router();

const inquiryRoutes = require('./inquiry-routes');
const inquiryInteractionRoutes = require('./inquiry-interaction-routes');

router.use('/api/inquiries', inquiryRoutes);
router.use('/api/inquiry-interactions', inquiryInteractionRoutes);

module.exports = router;