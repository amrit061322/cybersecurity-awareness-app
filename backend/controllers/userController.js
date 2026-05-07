const User = require('../models/User');
const { getDetectionAccuracy, getBadgeLevel } = require('../services/badgeService');

const getUploadedImageUrl = (file) => {
  if (!file) return '';
  if (file.buffer) {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }
  return `/uploads/${file.filename}`;
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({ path: 'quiz_history', options: { sort: { date_attempted: -1 }, limit: 10 } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const detectionAccuracy = await getDetectionAccuracy(req.user._id);
    const badgeLevel = getBadgeLevel(user.average_score, detectionAccuracy);
    if (badgeLevel !== user.badge_level) {
      user.badge_level = badgeLevel;
      await user.save();
    }
    return res.json({ user: user.toSafeObject(), quiz_history: user.quiz_history, detectionAccuracy });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, profile_picture } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (profile_picture !== undefined) user.profile_picture = profile_picture;

    await user.save();
    return res.json({ user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profile_picture = getUploadedImageUrl(req.file);
    await user.save();

    return res.json({ user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, uploadProfilePicture };
