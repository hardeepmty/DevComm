const express = require('express');
const { getChat, sendMessage } = require('../controllers/chatController');
const isAuthenticated = require('../middlewares/auth');
const router = express.Router();

router.get('/chat/:userId', isAuthenticated, getChat);
router.post('/chat/:userId', isAuthenticated, sendMessage);

module.exports = router;
