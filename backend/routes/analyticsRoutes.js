const express = require('express');
const { getUserAnalytics, getAdminAnalytics } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

const router = express.Router();

router.get('/user', auth, getUserAnalytics);
router.get('/admin', auth, adminOnly, getAdminAnalytics);

module.exports = router;

