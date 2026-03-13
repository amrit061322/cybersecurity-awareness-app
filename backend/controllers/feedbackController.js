const Feedback = require('../models/Feedback');

const submitFeedback = async (req, res, next) => {
  try {
    const { name, email, message, rating } = req.body;
    const feedback = await Feedback.create({ name, email, message, rating });
    return res.status(201).json({ feedback });
  } catch (error) {
    next(error);
  }
};

const getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find().sort({ date: -1 });
    return res.json({ feedback });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitFeedback, getFeedback };
