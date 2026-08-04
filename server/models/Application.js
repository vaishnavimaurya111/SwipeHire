const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    student:   { type: mongoose.Schema.Types.Mixed, required: true }, // ObjectId or demo string
    jobId:     { type: String, required: true },                      // string ID for both real & demo jobs
    recruiter: { type: mongoose.Schema.Types.Mixed },
    status:    { type: String, enum: ['Applied', 'Reviewing', 'Interviewing', 'Offered', 'Rejected'], default: 'Applied' },
    aiMatchScore: { type: Number, default: 0 },
    coverLetter:  { type: String, default: '' },
    jobSnapshot:  { type: mongoose.Schema.Types.Mixed, default: {} }, // cache job title/company at apply time
  },
  { timestamps: true }
);

// Prevent same student from applying to same job twice
ApplicationSchema.index({ student: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
