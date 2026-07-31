const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'recruiter'], default: 'student', required: true },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    headline: { type: String, default: 'Passionate Developer & Innovator' },
    bio: { type: String, default: 'Looking for exciting frontend and full-stack software roles!' },
    location: { type: String, default: 'San Francisco, CA' },

    // Student Specific Fields
    title: { type: String, default: 'Full Stack Software Engineer' },
    skills: [{ type: String }],
    experience: [
      {
        company: String,
        title: String,
        duration: String,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        year: String,
      },
    ],
    portfolioUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    preferredRoles: [{ type: String }],
    preferredLocations: [{ type: String }],
    expectedSalary: { type: String, default: '$110,000 - $140,000' },
    resumeScore: { type: Number, default: 85 },

    // Recruiter Specific Fields
    companyName: { type: String, default: '' },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    recruiterTitle: { type: String, default: 'Technical Talent Acquisition' },

    // Metrics & Preferences
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    savedCandidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
