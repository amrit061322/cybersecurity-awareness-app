const User = require('../models/User');
const DetectionResult = require('../models/DetectionResult');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { getBadgeLevel } = require('../services/badgeService');

const calculateCommunityScore = ({ posts = 0, comments = 0, likesReceived = 0 }) => {
  const raw = posts * 8 + comments * 3 + likesReceived * 2;
  return Math.min(100, raw);
};

const getLeaderboard = async (req, res, next) => {
  try {
    const limit = Math.min(50, Math.max(5, parseInt(req.query.limit, 10) || 20));

    const users = await User.find({ role: 'user' }).select('name profile_picture average_score badge_level awareness_level');

    const detectionAgg = await DetectionResult.aggregate([
      { $group: { _id: '$userId', avgConfidence: { $avg: '$confidenceScore' }, scans: { $sum: 1 } } }
    ]);
    const detectionMap = detectionAgg.reduce((acc, item) => {
      acc[item._id.toString()] = {
        avgConfidence: Math.round(item.avgConfidence || 0),
        scans: item.scans
      };
      return acc;
    }, {});

    const postAgg = await Post.aggregate([
      {
        $group: {
          _id: '$author',
          postCount: { $sum: 1 },
          likesReceived: { $sum: { $size: '$likes' } }
        }
      }
    ]);
    const postMap = postAgg.reduce((acc, item) => {
      acc[item._id.toString()] = {
        postCount: item.postCount,
        likesReceived: item.likesReceived
      };
      return acc;
    }, {});

    const commentAgg = await Comment.aggregate([
      { $group: { _id: '$author', commentCount: { $sum: 1 } } }
    ]);
    const commentMap = commentAgg.reduce((acc, item) => {
      acc[item._id.toString()] = item.commentCount;
      return acc;
    }, {});

    const rows = users.map((user) => {
      const userId = user._id.toString();
      const detection = detectionMap[userId]?.avgConfidence || 0;
      const posts = postMap[userId]?.postCount || 0;
      const likesReceived = postMap[userId]?.likesReceived || 0;
      const comments = commentMap[userId] || 0;
      const communityScore = calculateCommunityScore({ posts, comments, likesReceived });
      const awarenessScore = Math.round(user.average_score * 0.5 + detection * 0.3 + communityScore * 0.2);
      const badgeLevel = getBadgeLevel(user.average_score, detection);

      return {
        userId,
        name: user.name,
        profile_picture: user.profile_picture,
        awareness_level: user.awareness_level,
        badge_level: badgeLevel,
        awarenessScore,
        metrics: {
          quizScore: user.average_score,
          detectionAccuracy: detection,
          communityScore,
          posts,
          comments,
          likesReceived
        }
      };
    });

    rows.sort((a, b) => b.awarenessScore - a.awarenessScore);

    return res.json({
      leaderboard: rows.slice(0, limit).map((item, index) => ({
        ...item,
        rank: index + 1
      }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeaderboard };

