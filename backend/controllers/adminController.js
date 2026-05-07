const User = require('../models/User');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const Resource = require('../models/Resource');
const { getAwarenessLevel } = require('../utils/awareness');

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
      .select('name email role average_score awareness_level badge_level quiz_attempts joined_date');

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

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const normalizeQuestions = (questions) =>
  questions.map((q) => ({
    question: String(q.question || '').trim(),
    options: Array.isArray(q.options) ? q.options.map((opt) => String(opt).trim()) : [],
    correctAnswer: String(q.correctAnswer || '').trim(),
    explanation: String(q.explanation || '').trim()
  }));

const validateQuestions = (questions) => {
  if (!Array.isArray(questions) || questions.length === 0) return 'Questions are required';
  const normalized = normalizeQuestions(questions);
  const invalid = normalized.some((q) => !q.question || q.options.length < 2 || !q.correctAnswer);
  if (invalid) return 'Each question must have text, 2+ options, and a correct answer';
  return null;
};

const createQuiz = async (req, res, next) => {
  try {
    const { topic, questions } = req.body;
    const questionError = validateQuestions(questions);
    if (!topic || questionError) {
      return res.status(400).json({ message: questionError || 'Topic is required' });
    }

    const existing = await Quiz.findOne({ topic: topic.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'Quiz topic already exists' });
    }

    const quiz = await Quiz.create({
      topic: topic.toLowerCase().trim(),
      questions: normalizeQuestions(questions)
    });

    return res.status(201).json({ quiz });
  } catch (error) {
    next(error);
  }
};

const listQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    return res.json({ quizzes });
  } catch (error) {
    next(error);
  }
};

const updateQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { topic, questions } = req.body;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (topic) {
      const normalizedTopic = String(topic).toLowerCase().trim();
      if (normalizedTopic !== quiz.topic) {
        const existing = await Quiz.findOne({ topic: normalizedTopic });
        if (existing) {
          return res.status(409).json({ message: 'Quiz topic already exists' });
        }
        quiz.topic = normalizedTopic;
      }
    }

    if (questions) {
      const questionError = validateQuestions(questions);
      if (questionError) {
        return res.status(400).json({ message: questionError });
      }
      quiz.questions = normalizeQuestions(questions);
    }

    await quiz.save();
    return res.json({ quiz });
  } catch (error) {
    next(error);
  }
};

const deleteQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    return res.json({ message: 'Quiz deleted' });
  } catch (error) {
    next(error);
  }
};

const createResource = async (req, res, next) => {
  try {
    const { title, description, tips, resources, quizTopic, slug } = req.body;
    if (!title || !description || !Array.isArray(tips) || tips.length === 0) {
      return res.status(400).json({ message: 'Title, description, and tips are required' });
    }

    const finalSlug = slug ? slugify(slug) : slugify(title);
    if (!finalSlug) {
      return res.status(400).json({ message: 'Invalid slug' });
    }

    const existing = await Resource.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(409).json({ message: 'Resource slug already exists' });
    }

    const normalizedResources = Array.isArray(resources)
      ? resources
          .filter((item) => item && item.label && item.url)
          .map((item) => ({ label: String(item.label).trim(), url: String(item.url).trim() }))
      : [];

    const resource = await Resource.create({
      slug: finalSlug,
      title: String(title).trim(),
      description: String(description).trim(),
      tips: tips.map((tip) => String(tip).trim()).filter(Boolean),
      resources: normalizedResources,
      quizTopic: quizTopic ? String(quizTopic).trim() : ''
    });

    return res.status(201).json({ resource });
  } catch (error) {
    next(error);
  }
};

const listResources = async (req, res, next) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    return res.json({ resources });
  } catch (error) {
    next(error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, tips, resources, quizTopic, slug } = req.body;

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (slug || title) {
      const finalSlug = slug ? slugify(slug) : slugify(title || resource.title);
      if (!finalSlug) {
        return res.status(400).json({ message: 'Invalid slug' });
      }
      if (finalSlug !== resource.slug) {
        const existing = await Resource.findOne({ slug: finalSlug });
        if (existing) {
          return res.status(409).json({ message: 'Resource slug already exists' });
        }
        resource.slug = finalSlug;
      }
    }

    if (title) resource.title = String(title).trim();
    if (description) resource.description = String(description).trim();
    if (Array.isArray(tips)) {
      resource.tips = tips.map((tip) => String(tip).trim()).filter(Boolean);
    }
    if (Array.isArray(resources)) {
      resource.resources = resources
        .filter((item) => item && item.label && item.url)
        .map((item) => ({ label: String(item.label).trim(), url: String(item.url).trim() }));
    }
    if (quizTopic !== undefined) {
      resource.quizTopic = quizTopic ? String(quizTopic).trim() : '';
    }

    await resource.save();
    return res.json({ resource });
  } catch (error) {
    next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByIdAndDelete(id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    return res.json({ message: 'Resource deleted' });
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

module.exports = {
  getUsers,
  getStats,
  getUserHistory,
  createQuiz,
  listQuizzes,
  updateQuiz,
  deleteQuiz,
  createResource,
  listResources,
  updateResource,
  deleteResource
};
