const mongoose = require('mongoose');

const app = require('../backend/server');
const connectDB = require('../backend/config/db');
const { seedDefaultData } = require('../backend/data/seed');

let readyPromise;

const ensureReady = async () => {
  if (!process.env.MONGODB_URI) {
    const error = new Error('Database is not configured');
    error.statusCode = 503;
    throw error;
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!readyPromise) {
    readyPromise = connectDB()
      .then(seedDefaultData)
      .catch((error) => {
        readyPromise = null;
        throw error;
      });
  }

  await readyPromise;
};

module.exports = async (req, res) => {
  if (req.url === '/api/health' || req.url === '/health') {
    return app(req, res);
  }

  try {
    await ensureReady();
    return app(req, res);
  } catch (error) {
    console.error('API startup failed', error);
    const isAtlasNetworkError =
      error.name === 'MongooseServerSelectionError' ||
      /IP.*whitelist|Could not connect to any servers/i.test(error.message || '');

    return res.status(error.statusCode || 500).json({
      message: error.statusCode === 503
        ? 'Database is not configured. Add MONGODB_URI in Vercel environment variables.'
        : isAtlasNetworkError
          ? 'MongoDB Atlas is blocking Vercel. In Atlas Network Access, add 0.0.0.0/0 and try again.'
          : 'API startup failed'
    });
  }
};
