const express = require('express');
const {
  getUsers,
  getStats,
  getUserHistory,
  createQuiz,
  listQuizzes,
  updateQuiz,
  deleteQuiz,
  createResource,
  listResources,
  updateResource,
  deleteResource
} = require('../controllers/adminController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

const router = express.Router();

router.use(auth, adminOnly);

router.get('/users', getUsers);
router.get('/users/:id/history', getUserHistory);
router.get('/stats', getStats);
router.get('/quizzes', listQuizzes);
router.get('/resources', listResources);
router.post(
  '/quizzes',
  [
    body('topic').notEmpty().withMessage('Topic is required'),
    body('questions').isArray({ min: 1 }).withMessage('Questions are required')
  ],
  validate,
  createQuiz
);
router.put(
  '/quizzes/:id',
  [
    body('topic').optional().notEmpty().withMessage('Topic cannot be empty'),
    body('questions').optional().isArray({ min: 1 }).withMessage('Questions must be an array')
  ],
  validate,
  updateQuiz
);
router.delete('/quizzes/:id', deleteQuiz);
router.post(
  '/resources',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('tips').isArray({ min: 1 }).withMessage('Tips are required')
  ],
  validate,
  createResource
);
router.put(
  '/resources/:id',
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('tips').optional().isArray({ min: 1 }).withMessage('Tips must be an array'),
    body('resources').optional().isArray().withMessage('Resources must be an array')
  ],
  validate,
  updateResource
);
router.delete('/resources/:id', deleteResource);

module.exports = router;
