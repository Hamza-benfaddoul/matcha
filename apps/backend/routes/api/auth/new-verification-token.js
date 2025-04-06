const express = require("express");
const router = express.Router();
const verificationTokenController = require("../../../controllers/newVerificationTokenController");

router.post("/", verificationTokenController.handleNewVerificationToken);

module.exports = router;
