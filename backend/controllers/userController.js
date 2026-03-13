const User = require('../models/User');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({ path: 'quiz_history', options: { sort: { date_attempted: -1 }, limit: 10 } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user: user.toSafeObject(), quiz_history: user.quiz_history });
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

module.exports = { getProfile, updateProfile };
