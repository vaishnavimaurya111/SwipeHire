const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Applied', 'Reviewing', 'Interviewing', 'Offered', 'Rejected'], default: 'Applied' },
    aiMatchScore: { type: Number, default: 88 },
    coverLetter: { type: String, default: '' },
    interviewDate: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);
