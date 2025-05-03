const express = require("express");
const router = express.Router();
const verificationTokenController = require("../../../controllers/auth/newVerificationTokenController");

router.post("/", verificationTokenController.handleNewVerificationToken);

module.exports = router;
