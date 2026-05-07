const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String, default: '' }
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, unique: true, trim: true },
    questions: [questionSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
