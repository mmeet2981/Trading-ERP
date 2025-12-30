const { Router } = require("express");

const userRoutes = require("./users");
const inquiryRoutes = require("./inquiry");
const customerRoutes = require("./customer");

const router = Router({ mergeParams: true });

router.use(userRoutes);
router.use(inquiryRoutes);
router.use(customerRoutes);

module.exports = router;
