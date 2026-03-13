const express = require('express');
const { body } = require('express-validator');
const { getQuizByTopic, submitQuiz, getHistory } = require('../controllers/quizController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
  '/submit',
  auth,
  [
    body('topic').notEmpty().withMessage('Topic required'),
    body('answers').isArray({ min: 1 }).withMessage('Answers must be an array')
  ],
  validate,
  submitQuiz
);

router.get('/history', auth, getHistory);
router.get('/history/me', auth, getHistory);
router.get('/:topic', auth, getQuizByTopic);

module.exports = router;
