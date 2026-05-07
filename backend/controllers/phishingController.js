const DetectionResult = require('../models/DetectionResult');
const Notification = require('../models/Notification');
const { scanPhishing } = require('../services/phishingScanner');
const { updateUserBadgeIfNeeded, getDetectionAccuracy, getBadgeLevel } = require('../services/badgeService');

const buildSnippet = (value, fallback = '') => {
  if (!value) return fallback;
  return String(value).replace(/\s+/g, ' ').trim().slice(0, 160);
};

const scan = async (req, res, next) => {
  try {
    const { inputType, text, url } = req.body;
    const normalizedType = String(inputType || '').toLowerCase();

    if (!['image', 'email', 'url'].includes(normalizedType)) {
      return res.status(400).json({ message: 'Invalid input type' });
    }

    if (normalizedType === 'image' && !req.file) {
      return res.status(400).json({ message: 'Screenshot image is required' });
    }
    if (normalizedType === 'email' && !text) {
      return res.status(400).json({ message: 'Email text is required' });
    }
    if (normalizedType === 'url' && !url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const { confidenceScore, resultStatus, riskFactors, explanations } = scanPhishing({
      inputType: normalizedType,
      content: text,
      url,
      fileName: req.file?.originalname
    });

    const contentSnippet = normalizedType === 'image'
      ? buildSnippet(req.file?.originalname, 'Screenshot uploaded')
      : buildSnippet(text || url, '');

    const detection = await DetectionResult.create({
      userId: req.user._id,
      inputType: normalizedType,
      contentSnippet,
      resultStatus,
      confidenceScore,
      riskFactors,
      explanations
    });

    const badgeUpdate = await updateUserBadgeIfNeeded(req.user);

    await Notification.create({
      userId: req.user._id,
      message: `Phishing scan completed: ${resultStatus} (${confidenceScore}% confidence)`,
      type: 'scan',
      target: '/detect-phishing'
    });

    if (badgeUpdate.changed) {
      await Notification.create({
        userId: req.user._id,
        message: `New badge unlocked: ${badgeUpdate.badgeLevel}`,
        type: 'badge',
        target: '/profile'
      });
    }

    return res.status(201).json({
      detection,
      badgeLevel: badgeUpdate.badgeLevel,
      detectionAccuracy: badgeUpdate.detectionAccuracy
    });
  } catch (error) {
    next(error);
  }
};

const history = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 8));
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      DetectionResult.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      DetectionResult.countDocuments({ userId: req.user._id })
    ]);

    const detectionAccuracy = await getDetectionAccuracy(req.user._id);
    const badgeLevel = getBadgeLevel(req.user.average_score, detectionAccuracy);

    return res.json({
      results,
      page,
      total,
      totalPages: Math.ceil(total / limit),
      detectionAccuracy,
      badgeLevel
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { scan, history };

