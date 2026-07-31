require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const Company = require('./models/Company');
const Match = require('./models/Match');
const Chat = require('./models/Chat');
const { SAMPLE_JOBS, SAMPLE_CANDIDATES } = require('./controllers/jobController');

async function seedData() {
  try {
    const connUri = process.env.MONGODB_URI;
    if (!connUri) {
      console.log('⚠️ MONGODB_URI not provided in .env. Skipping MongoDB seed script.');
      process.exit(0);
    }

    await mongoose.connect(connUri);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing
    await User.deleteMany({});
    await Job.deleteMany({});
    await Company.deleteMany({});
    await Match.deleteMany({});
    await Chat.deleteMany({});

    console.log('🧹 Existing collections cleared.');

    // Seed Demo Student
    const studentUser = await User.create({
      name: 'Alex Chen',
      email: 'student@swipehire.com',
      password: '$2a$10$abcdefghijklmnopqrstuu', // mock hash
      role: 'student',
      title: 'Full-Stack Software Engineer',
      skills: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'Gemini AI'],
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      headline: 'CS Senior @ Stanford | Built 4 AI Apps',
      bio: 'Passionate software developer looking for full-stack engineer roles.',
      resumeScore: 92,
      location: 'San Francisco, CA',
    });

    // Seed Demo Recruiter
    const recruiterUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@swipehire.com',
      password: '$2a$10$abcdefghijklmnopqrstuu',
      role: 'recruiter',
      companyName: 'Apex AI Labs',
      title: 'Head of Talent Acquisition',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      headline: 'Hiring Principal Engineers & AI Interns',
    });

    // Seed Jobs
    for (const j of SAMPLE_JOBS) {
      await Job.create({
        ...j,
        recruiter: recruiterUser._id,
      });
    }

    console.log('✅ Seed Data successfully loaded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
}

seedData();
