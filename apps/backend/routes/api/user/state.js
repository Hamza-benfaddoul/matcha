// routes/api/dates/index.js
const express = require("express");
const router = express.Router();

const { getUserState } = require("../../../controllers/user/stateController");

router.get("/", getUserState);

module.exports = router;
