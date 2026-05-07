const express = require('express');
const { body } = require('express-validator');
const { register, login, googleLogin, me } = require('../controllers/authController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  validate,
  login
);

router.post('/google', [body('credential').notEmpty().withMessage('Credential required')], validate, googleLogin);

router.get('/me', auth, me);

module.exports = router;
