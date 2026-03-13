const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
    date_attempted: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

module.exports = mongoose.model('Result', resultSchema);
