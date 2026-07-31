const mongoose = require('mongoose');

const SwipeSchema = new mongoose.Schema(
  {
    swiper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    swiperRole: { type: String, enum: ['student', 'recruiter'], required: true },
    targetJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }, // Present if swiper is student
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Present if swiper is recruiter
    action: { type: String, enum: ['right', 'left', 'superlike', 'save'], required: true },
  },
  { timestamps: true }
);

SwipeSchema.index({ swiper: 1, targetJob: 1, targetUser: 1 }, { unique: true });

module.exports = mongoose.model('Swipe', SwipeSchema);
