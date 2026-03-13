const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: function () { return !this.googleId; }, select: false },
    googleId: { type: String, default: null },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profile_picture: { type: String, default: '' },
    quiz_attempts: { type: Number, default: 0 },
    average_score: { type: Number, default: 0 },
    awareness_level: { type: String, default: 'Vulnerable' },
    quiz_history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Result' }]
  },
  { timestamps: { createdAt: 'joined_date', updatedAt: 'updated_at' } }
);

userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    profile_picture: this.profile_picture,
    quiz_attempts: this.quiz_attempts,
    average_score: this.average_score,
    awareness_level: this.awareness_level,
    joined_date: this.joined_date
  };
};

module.exports = mongoose.model('User', userSchema);
