const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const User = require('../models/User');

const getUploadedImageUrl = (file) => {
  if (!file) return '';
  if (file.buffer) {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }
  return `/uploads/${file.filename}`;
};

const normalizeScamType = (value) => {
  const normalized = String(value || '').toLowerCase().replace(/\s+/g, '_');
  const allowed = ['phishing', 'otp_fraud', 'fake_investment', 'other'];
  return allowed.includes(normalized) ? normalized : 'other';
};

const createPost = async (req, res, next) => {
  try {
    const { content, scamType } = req.body;
    if (!content || String(content).trim().length < 10) {
      return res.status(400).json({ message: 'Post content must be at least 10 characters' });
    }

    const post = await Post.create({
      author: req.user._id,
      content: String(content).trim(),
      scamType: normalizeScamType(scamType),
      imageUrl: getUploadedImageUrl(req.file)
    });
    const postTarget = `/community?post=${post._id}`;

    const recipients = await User.find({ _id: { $ne: req.user._id } }).select('_id');
    if (recipients.length > 0) {
      await Notification.insertMany(
        recipients.map((recipient) => ({
          userId: recipient._id,
          message: `${req.user.name} shared a new community post`,
          type: 'system',
          target: postTarget
        }))
      );
    }

    const populated = await post.populate('author', 'name profile_picture awareness_level badge_level average_score');

    return res.status(201).json({ post: populated });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('author', 'name profile_picture awareness_level badge_level average_score');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.json({
      post: {
        ...post.toObject(),
        likeCount: post.likes.length,
        likedByUser: post.likes.some((likeId) => likeId.toString() === req.user._id.toString())
      }
    });
  } catch (error) {
    next(error);
  }
};

const getFeed = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 8));
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name profile_picture awareness_level badge_level average_score'),
      Post.countDocuments()
    ]);

    const formatted = posts.map((post) => ({
      ...post.toObject(),
      likeCount: post.likes.length,
      likedByUser: post.likes.some((id) => id.toString() === req.user._id.toString())
    }));

    return res.json({
      posts: formatted,
      page,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('author', 'name profile_picture awareness_level badge_level average_score');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id.toString();
    const existingIndex = post.likes.findIndex((likeId) => likeId.toString() === userId);
    let liked = false;

    if (existingIndex >= 0) {
      post.likes.splice(existingIndex, 1);
    } else {
      post.likes.push(req.user._id);
      liked = true;
    }

    await post.save();

    if (liked && post.author._id.toString() !== userId) {
      await Notification.create({
        userId: post.author._id,
        message: `${req.user.name} liked your post`,
        type: 'like',
        target: `/community?post=${post._id}`
      });
    }

    return res.json({
      post: {
        ...post.toObject(),
        likeCount: post.likes.length,
        likedByUser: liked
      }
    });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content || String(content).trim().length < 2) {
      return res.status(400).json({ message: 'Comment is too short' });
    }

    const post = await Post.findById(id).populate('author', 'name profile_picture');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      content: String(content).trim()
    });

    await Post.findByIdAndUpdate(post._id, { $inc: { commentCount: 1 } });

    if (post.author._id.toString() !== req.user._id.toString()) {
      await Notification.create({
        userId: post.author._id,
        message: `${req.user.name} commented on your post`,
        type: 'comment',
        target: `/community?post=${post._id}`
      });
    }

    const populated = await comment.populate('author', 'name profile_picture badge_level awareness_level');

    return res.status(201).json({ comment: populated });
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ post: id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('author', 'name profile_picture badge_level awareness_level');

    return res.json({ comments });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    return res.json({ message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPost,
  getFeed,
  toggleLike,
  addComment,
  getComments,
  deletePost
};



