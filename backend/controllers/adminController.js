const User = require('../models/User');
const Result = require('../models/Result');

const getUsers = async (req, res, next) => {
  try {
    const minAvg = Number(req.query.minAvg);
    const maxAvg = Number(req.query.maxAvg);

    const filter = {};
    if (!Number.isNaN(minAvg)) {
      filter.average_score = { ...(filter.average_score || {}), $gte: minAvg };
    }
    if (!Number.isNaN(maxAvg)) {
      filter.average_score = { ...(filter.average_score || {}), $lte: maxAvg };
    }

    const users = await User.find(filter)
      .sort({ average_score: -1 })
      .select('name email role average_score awareness_level quiz_attempts joined_date');

    return res.json({ users });
  } catch (error) {
    next(error);
  }
};

const getUserHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await Result.find({ user_id: id }).sort({ date_attempted: -1 });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuizAttempts = await Result.countDocuments();

    const averageAwarenessScoreAgg = await User.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$average_score' } } }
    ]);
    const averageAwarenessScore = averageAwarenessScoreAgg[0]?.avgScore ? Math.round(averageAwarenessScoreAgg[0].avgScore) : 0;

    const leaderboard = await User.find({ role: 'user' })
      .sort({ average_score: -1 })
      .limit(10)
      .select('name average_score awareness_level');

    const lowestScores = await User.find({ role: 'user' })
      .sort({ average_score: 1 })
      .limit(5)
      .select('name average_score awareness_level');

    const highestScores = await Result.find()
      .sort({ percentage: -1 })
      .limit(5)
      .select('user_id topic percentage date_attempted');

    const scoreBands = await User.aggregate([
      {
        $bucket: {
          groupBy: '$average_score',
          boundaries: [0, 20, 30, 40, 60, 80, 101],
          default: 'unknown',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    return res.json({
      totalUsers,
      totalQuizAttempts,
      averageAwarenessScore,
      leaderboard,
      lowestScores,
      highestScores,
      scoreBands
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getStats, getUserHistory };
