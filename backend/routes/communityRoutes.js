const express = require('express');
const {
  createPost,
  getPost,
  getFeed,
  toggleLike,
  addComment,
  getComments,
  deletePost
} = require('../controllers/communityController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/feed', auth, getFeed);
router.post('/posts', auth, upload.single('image'), createPost);
router.get('/posts/:id', auth, getPost);
router.post('/posts/:id/like', auth, toggleLike);
router.post('/posts/:id/comments', auth, addComment);
router.get('/posts/:id/comments', auth, getComments);
router.delete('/posts/:id', auth, deletePost);

module.exports = router;

