const express = require('express');
const { getUsers, getStats, getUserHistory } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

const router = express.Router();

router.use(auth, adminOnly);

router.get('/users', getUsers);
router.get('/users/:id/history', getUserHistory);
router.get('/stats', getStats);

module.exports = router;
