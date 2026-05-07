const DetectionResult = require('../models/DetectionResult');

const clampScore = (value) => {
  const num = Number(value || 0);
  if (Number.isNaN(num)) return 0;
  return Math.max(0, Math.min(100, num));
};

const getBadgeLevel = (averageScore, detectionAccuracy) => {
  const quizScore = clampScore(averageScore);
  const detectScore = clampScore(detectionAccuracy);

  if (quizScore < 40 || detectScore < 40) return 'Beginner';
  if (quizScore < 65 || detectScore < 65) return 'Aware';
  if (quizScore < 85 || detectScore < 85) return 'Defender';
  return 'Cyber Guardian';
};

const getDetectionAccuracy = async (userId) => {
  if (!userId) return 0;
  const agg = await DetectionResult.aggregate([
    { $match: { userId } },
    { $group: { _id: '$userId', avgConfidence: { $avg: '$confidenceScore' } } }
  ]);
  return agg[0]?.avgConfidence ? Math.round(agg[0].avgConfidence) : 0;
};

const updateUserBadgeIfNeeded = async (user) => {
  const detectionAccuracy = await getDetectionAccuracy(user._id);
  const nextBadge = getBadgeLevel(user.average_score, detectionAccuracy);
  const changed = nextBadge !== user.badge_level;
  if (changed) {
    user.badge_level = nextBadge;
    await user.save();
  }
  return { badgeLevel: nextBadge, detectionAccuracy, changed };
};

module.exports = {
  getBadgeLevel,
  getDetectionAccuracy,
  updateUserBadgeIfNeeded
};

