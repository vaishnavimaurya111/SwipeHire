const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    company: { type: String, default: 'TechCorp' },
    status: { type: String, enum: ['matched', 'interview_scheduled', 'offered', 'archived'], default: 'matched' },
    lastMessage: { type: String, default: "It's a Match! Start the conversation." },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Match', MatchSchema);
