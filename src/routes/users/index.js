const { Router } = require("express");
const userRoutes = require("./user-routes");

const router = Router({ mergeParams: true });

router.use("/v1/user-service", userRoutes);

module.exports = router;
