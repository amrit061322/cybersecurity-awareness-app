const express = require('express');
const { body } = require('express-validator');
const { submitFeedback, getFeedback } = require('../controllers/feedbackController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5')
  ],
  validate,
  submitFeedback
);

router.get('/', auth, adminOnly, getFeedback);

module.exports = router;
