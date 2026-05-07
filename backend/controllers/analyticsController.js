const DetectionResult = require('../models/DetectionResult');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const buildAnalytics = async (filter = {}) => {
  const scanAgg = await DetectionResult.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$resultStatus',
        count: { $sum: 1 },
        avgConfidence: { $avg: '$confidenceScore' }
      }
    }
  ]);

  const scanTotals = scanAgg.reduce(
    (acc, item) => {
      acc.total += item.count;
      acc.byStatus[item._id] = item.count;
      return acc;
    },
    { total: 0, byStatus: {} }
  );

  const phishingCount = scanTotals.byStatus.phishing || 0;
  const suspiciousCount = scanTotals.byStatus.suspicious || 0;
  const safeCount = scanTotals.byStatus.safe || 0;
  const fakeDetectionRate = scanTotals.total
    ? Math.round((phishingCount / scanTotals.total) * 100)
    : 0;

  const scamTypeAgg = await Post.aggregate([
    { $match: filter.userId ? { author: filter.userId } : {} },
    { $group: { _id: '$scamType', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const postsFilter = filter.userId ? { author: filter.userId } : {};
  const commentsFilter = filter.userId ? { author: filter.userId } : {};

  const [postCount, commentCount, likesAgg] = await Promise.all([
    Post.countDocuments(postsFilter),
    Comment.countDocuments(commentsFilter),
    Post.aggregate([
      { $match: postsFilter },
      { $project: { likesCount: { $size: '$likes' } } },
      { $group: { _id: null, totalLikes: { $sum: '$likesCount' } } }
    ])
  ]);

  const totalLikes = likesAgg[0]?.totalLikes || 0;

  return {
    scans: {
      total: scanTotals.total,
      phishing: phishingCount,
      suspicious: suspiciousCount,
      safe: safeCount,
      fakeDetectionRate
    },
    scamTypes: scamTypeAgg.map((item) => ({ type: item._id, count: item.count })),
    community: {
      posts: postCount,
      comments: commentCount,
      likes: totalLikes
    }
  };
};

const getUserAnalytics = async (req, res, next) => {
  try {
    const data = await buildAnalytics({ userId: req.user._id });
    return res.json({ analytics: data });
  } catch (error) {
    next(error);
  }
};

const getAdminAnalytics = async (req, res, next) => {
  try {
    const data = await buildAnalytics({});
    return res.json({ analytics: data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserAnalytics, getAdminAnalytics };

