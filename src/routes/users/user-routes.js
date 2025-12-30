const { Router } = require("express");
const httpCallback = require("../http-callback");
const { users } = require("../../modules");

const router = Router({ mergeParams: true });

router.post(
  "/user",
  httpCallback({ authenticate: true }),
  users.controller.createUserAction
);

module.exports = router;
