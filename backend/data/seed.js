const bcrypt = require('bcryptjs');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { quizBank } = require('./quizzes');

const seedQuizzes = async () => {
  const count = await Quiz.countDocuments();
  if (count === 0) {
    await Quiz.insertMany(quizBank);
    console.log('Seeded quizzes');
  }
};

const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cyberaware.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await User.create({
      name: 'CyberAware Admin',
      email: adminEmail,
      password: hashed,
      role: 'admin',
      awareness_level: 'Cyber Smart'
    });
    console.log('Admin user created');
  }
};

const seedDefaultData = async () => {
  await seedQuizzes();
  await ensureAdminUser();
};

if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('../config/db');

  connectDB()
    .then(async () => {
      await seedDefaultData();
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedDefaultData };
