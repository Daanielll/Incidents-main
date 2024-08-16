const express = require("express");
const router = express.Router();
const appController = require("../controllers/appController");
const authToken = require("../middleware/authToken");

router
  .route("/")
  .get(appController.getAllApps)
  .post(authToken, appController.createApp);

router
  .route("/:appId")
  .patch(authToken, appController.updateApp)
  .delete(authToken, appController.deleteApp);

module.exports = router;
