const express = require('express');
const { listNotifications, markRead, markAllRead } = require('../controllers/notificationController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, listNotifications);
router.patch('/read-all', auth, markAllRead);
router.patch('/:id/read', auth, markRead);

module.exports = router;

