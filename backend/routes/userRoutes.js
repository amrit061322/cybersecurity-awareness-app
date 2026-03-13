const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile } = require('../controllers/userController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, getProfile);

router.put(
  '/update',
  auth,
  [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('profile_picture').optional({ nullable: true, checkFalsy: true }).isURL().withMessage('Profile picture must be a URL')
  ],
  validate,
  updateProfile
);

module.exports = router;
