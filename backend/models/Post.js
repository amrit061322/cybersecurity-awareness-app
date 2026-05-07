const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    scamType: {
      type: String,
      enum: ['phishing', 'otp_fraud', 'fake_investment', 'other'],
      default: 'phishing'
    },
    imageUrl: { type: String, default: '' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    commentCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ scamType: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);

