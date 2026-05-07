const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tips: [{ type: String, required: true }],
    resources: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true }
      }
    ],
    quizTopic: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
