const express = require("express");
const router = express.Router();

const resetPasswordController = require("../../../controllers/auth/resetPasswordController");

router.post("/", resetPasswordController.handlePasswordResetRequest);
router.post("/confirm", resetPasswordController.handlePasswordReset);

module.exports = router;
