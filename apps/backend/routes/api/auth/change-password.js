const express = require("express");
const router = express.Router();

const resetPasswordController = require("../../../controllers/auth/changePasswordController");

router.post("/", resetPasswordController.handleResetPassword);

module.exports = router;
