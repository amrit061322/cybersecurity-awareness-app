const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const User = require('../models/User');
const { getAwarenessLevel } = require('../utils/awareness');

const normalizeTopic = (topic) => topic.toLowerCase().trim();

const getQuizByTopic = async (req, res, next) => {
  try {
    const topic = normalizeTopic(req.params.topic);
    const quiz = await Quiz.findOne({ topic });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const safeQuestions = quiz.questions.map((q) => ({
      question: q.question,
      options: q.options
    }));

    return res.json({ topic: quiz.topic, questions: safeQuestions });
  } catch (error) {
    next(error);
  }
};

const submitQuiz = async (req, res, next) => {
  try {
    const { topic, answers } = req.body;
    if (!topic || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Topic and answers are required' });
    }

    const quiz = await Quiz.findOne({ topic: normalizeTopic(topic) });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    quiz.questions.forEach((q, index) => {
      const answer = answers[index];
      const byIndex = Number.isInteger(answer) ? q.options[answer] : null;
      if (answer === q.correctAnswer || byIndex === q.correctAnswer) {
        score += 1;
      }
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);
    const result = await Result.create({
      user_id: req.user._id,
      topic: quiz.topic,
      score,
      percentage
    });

    const user = await User.findById(req.user._id);
    const attempts = user.quiz_attempts + 1;
    const newAverage = Math.round(((user.average_score * user.quiz_attempts) + percentage) / attempts);

    user.quiz_attempts = attempts;
    user.average_score = newAverage;
    user.awareness_level = getAwarenessLevel(newAverage);
    user.quiz_history.push(result._id);
    await user.save();

    return res.status(201).json({
      result,
      awareness_level: user.awareness_level,
      average_score: user.average_score
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const results = await Result.find({ user_id: req.user._id }).sort({ date_attempted: -1 });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuizByTopic, submitQuiz, getHistory };
