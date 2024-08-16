const authToken = require("../middleware/authToken");
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router
  .route("/")
  .post(userController.createUser)
  .get(authToken, userController.getUser);

router.route("/auth").post(authController.authUser).get(authController.getUser);
module.exports = router;
