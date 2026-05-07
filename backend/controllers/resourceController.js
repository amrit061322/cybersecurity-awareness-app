const Resource = require('../models/Resource');

const getResources = async (req, res, next) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    return res.json({ resources });
  } catch (error) {
    next(error);
  }
};

module.exports = { getResources };
