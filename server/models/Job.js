const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    companyLogo: { type: String, default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80' },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract'], default: 'Full-Time' },
    workplaceType: { type: String, enum: ['Remote', 'Hybrid', 'On-Site'], default: 'Remote' },
    location: { type: String, default: 'Remote / San Francisco' },
    salary: { type: String, default: '$120,000 - $150,000 / yr' },
    experienceLevel: { type: String, enum: ['Entry Level', 'Mid Level', 'Senior', 'Internship'], default: 'Entry Level' },
    techStack: [{ type: String }],
    description: { type: String, required: true },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    benefits: [{ type: String }],
    aiMatchScore: { type: Number, default: 92 },
    applicantsCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
