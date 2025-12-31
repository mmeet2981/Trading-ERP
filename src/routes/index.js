const express = require('express');
const router = express.Router();

const inquiryRoutes = require('./inquiry-routes');

router.use('/api/inquiries', inquiryRoutes);

module.exports = router;