const express = require('express');
const { scan, history } = require('../controllers/phishingController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/scan', auth, upload.single('image'), scan);
router.get('/history', auth, history);

module.exports = router;

