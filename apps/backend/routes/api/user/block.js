const express = require('express');
const removeBlock = require('../../../controllers/profile/blockController').removeBlock;
const addBlock = require('../../../controllers/profile/blockController').addBlock;
const getUserBlocks = require('../../../controllers/profile/blockController').getUserBlocks;


const router = express.Router();

router.post('/remove', (req, res) => removeBlock(req, res));
router.post('/add', (req, res) => addBlock(req, res));
router.get('/lists', (req, res) => getUserBlocks(req, res));


module.exports = router;

