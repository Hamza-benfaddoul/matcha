// routes/api/dates/index.js
const express = require("express");
const router = express.Router();

const {
  proposeDate,
  respondToDate,
  getUserDateProposals,
  setDateReminder,
} = require("../../../controllers/dates/dateController");

router.post("/propose", proposeDate);
router.post("/respond", respondToDate);
router.get("/my-dates", getUserDateProposals);
router.post("/reminders", setDateReminder);

module.exports = router;
