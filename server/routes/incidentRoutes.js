const express = require("express");
const router = express.Router();
const incidentController = require("../controllers/incidentController");
const authToken = require("../middleware/authToken");

router
  .route("/")
  .post(authToken, incidentController.createIncident)
  .get(incidentController.getAllIncidents);

router
  .route("/activity/:incId")
  .post(authToken, incidentController.createIncidentComment);
router
  .route("/:incId")
  .get(incidentController.getIncidentById)
  .delete(incidentController.deleteIncident)
  .patch(authToken, incidentController.updateIncident);

module.exports = router;
