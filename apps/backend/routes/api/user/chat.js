
const express = require('express');
const getContacts = require('../../../controllers/chat/chatController').getContacts;
const getMessages = require('../../../controllers/chat/chatController').getMessages;

const router = express.Router();

router.post('/remove', (req, res) => removeBlock(req, res));
router.get('/get-contact', (req, res) => getContacts(req, res));
router.get('/get-messages', (req, res) => getMessages(req, res));

module.exports = router;

