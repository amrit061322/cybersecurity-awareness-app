const mongoose = require('mongoose');

const detectionResultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    inputType: { type: String, enum: ['image', 'email', 'url'], required: true },
    contentSnippet: { type: String, default: '' },
    resultStatus: { type: String, enum: ['safe', 'suspicious', 'phishing'], required: true },
    confidenceScore: { type: Number, min: 0, max: 100, required: true },
    riskFactors: [{ type: String }],
    explanations: [{ type: String }]
  },
  { timestamps: true }
);

detectionResultSchema.index({ userId: 1, createdAt: -1 });
detectionResultSchema.index({ resultStatus: 1, createdAt: -1 });

module.exports = mongoose.model('DetectionResult', detectionResultSchema);

