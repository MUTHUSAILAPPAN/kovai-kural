const express = require('express');
const { listNotifications, markRead } = require('../controllers/notificationController');
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();

router.get('/', verifyToken, listNotifications);
router.post('/mark-read', verifyToken, markRead);

module.exports = router;
