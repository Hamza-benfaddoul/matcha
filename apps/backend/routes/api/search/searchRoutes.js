const express = require("express");
const router = express.Router();
const searchController = require("../../../controllers/search/searchController");

router.post("/:userId", searchController.advancedSearch);

module.exports = router;
