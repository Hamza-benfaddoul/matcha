const express = require("express");
const router = express.Router();

const browsingController = require("../../../controllers/browsing/browsingController");

router.get("/", browsingController.matchingProfiles);

module.exports = router;
