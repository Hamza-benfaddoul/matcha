const express = require("express");
const router = express.Router();

const browsingController = require("../../../controllers/browsing/browsingController");

router.post("/", browsingController.matchingProfiles);

module.exports = router;
