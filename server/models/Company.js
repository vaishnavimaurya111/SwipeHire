const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=200&q=80' },
    website: { type: String, default: '' },
    location: { type: String, default: 'San Francisco, CA' },
    industry: { type: String, default: 'Technology & AI Software' },
    size: { type: String, default: '50-200 Employees' },
    description: { type: String, default: 'Building next-generation platforms powered by cutting edge AI and scalable Web architectures.' },
    culture: [{ type: String }],
    perks: [{ type: String }],
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', CompanySchema);
