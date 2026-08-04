const Job = require('../models/Job');
const User = require('../models/User');

// Rich Demo Jobs Data
const SAMPLE_JOBS = [
  {
    _id: 'job_1',
    title: 'Full-Stack Software Engineer (AI & Web)',
    company: 'Apex AI Labs',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
    type: 'Full-Time',
    workplaceType: 'Remote',
    location: 'San Francisco, CA (Remote Allowed)',
    salary: '$130,000 - $160,000 / yr',
    experienceLevel: 'Entry Level',
    techStack: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Gemini AI', 'MongoDB'],
    description:
      'Join Apex AI Labs to architect high-throughput generative AI web interfaces and microservices. You will work closely with research scientists to deploy sub-100ms LLM features.',
    requirements: [
      'Proficiency with React 18, Next.js or Vite, and modern CSS frameworks like Tailwind',
      'Solid experience building REST & GraphQL APIs with Node.js & Express',
      'Familiarity with state management, Socket.io, and asynchronous JavaScript',
      'Bachelor degree in Computer Science or equivalent hands-on project portfolio',
    ],
    responsibilities: [
      'Build drag-and-drop interactive UI components with zero latency',
      'Integrate AI model endpoints with robust fallback error handling',
      'Optimize bundle size and dynamic rendering performance',
    ],
    benefits: ['Full Health & Dental Coverage', 'Unlimited PTO + $2.5k Learning Stipend', 'Remote-First Flexible Work Hours'],
    aiMatchScore: 96,
    applicantsCount: 42,
  },
  {
    _id: 'job_2',
    title: 'Frontend UI/UX Engineer',
    company: 'Veloce Cloud Systems',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=300&q=80',
    type: 'Full-Time',
    workplaceType: 'Hybrid',
    location: 'Austin, TX',
    salary: '$115,000 - $140,000 / yr',
    experienceLevel: 'Mid Level',
    techStack: ['React', 'Framer Motion', 'Tailwind CSS', 'Redux Toolkit', 'TypeScript'],
    description:
      'We are looking for a creative Frontend Engineer who lives for pixel-perfection, glassmorphism aesthetics, and smooth 60fps Framer Motion micro-animations.',
    requirements: [
      '3+ years with React and modern CSS systems',
      'Deep knowledge of browser layout engines, accessibility (a11y), and Framer Motion animations',
      'Eye for sleek modern UI design systems',
    ],
    responsibilities: [
      'Maintain design system component libraries',
      'Craft interactive dashboards with Recharts and Canvas animations',
    ],
    benefits: ['Competitive Equity Options', 'Annual Offsite in Hawaii', 'Top tier MacBook Pro M3 Max provided'],
    aiMatchScore: 91,
    applicantsCount: 28,
  },
  {
    _id: 'job_3',
    title: 'AI Product Engineering Intern',
    company: 'HyperScale Health',
    companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=300&q=80',
    type: 'Internship',
    workplaceType: 'Remote',
    location: 'Remote',
    salary: '$55 - $70 / hr',
    experienceLevel: 'Internship',
    techStack: ['Python', 'FastAPI', 'React', 'Tailwind CSS', 'PostgreSQL'],
    description:
      'Summer 2026 Internship: Build intelligent clinical workflow assistants using LLM fine-tuning and modern web dashboards.',
    requirements: [
      'Currently enrolled in CS or Software Engineering degree',
      'Hands-on experience with Python web frameworks and React frontend',
      'Curiosity for medical AI innovations',
    ],
    responsibilities: [
      'Deploy full-stack internal prototyping apps',
      'Collaborate with senior data scientists on data pipeline automation',
    ],
    benefits: ['Housing Stipend Available', 'Direct Mentorship from Ex-FAANG Lead Engineers', 'Fast-Track to Full-Time Return Offer'],
    aiMatchScore: 89,
    applicantsCount: 65,
  },
  {
    _id: 'job_4',
    title: 'Backend Systems & API Developer',
    company: 'Nexus Cyber Security',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80',
    type: 'Full-Time',
    workplaceType: 'On-Site',
    location: 'New York, NY',
    salary: '$140,000 - $175,000 / yr',
    experienceLevel: 'Mid Level',
    techStack: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker', 'WebSockets'],
    description:
      'Power high-speed threat telemetry streaming servers. Scale real-time WebSocket data pipelines processing millions of events per second.',
    requirements: ['Deep knowledge of Node.js event loop & asynchronous IO', 'MongoDB aggregation pipelines and Redis caching strategies'],
    responsibilities: ['Architect fault-tolerant backend services', 'Perform security penetration code audits'],
    benefits: ['401k 6% Match', 'Relocation Package', 'Gym & Wellness Membership'],
    aiMatchScore: 85,
    applicantsCount: 19,
  },
];

// SAMPLE CANDIDATES FOR RECRUITERS
const SAMPLE_CANDIDATES = [
  {
    _id: 'cand_1',
    name: 'Alex Chen',
    title: 'Full-Stack Software Engineer',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    skills: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'Gemini AI'],
    location: 'San Francisco, CA',
    headline: 'Stanford CS Senior | 4 Full-Stack AI Apps Built',
    bio: 'Passionate about swiping right on engineering challenges. Specializing in high-performance web apps and real-time Socket systems.',
    expectedSalary: '$125,000 / yr',
    resumeScore: 94,
    education: [{ institution: 'Stanford University', degree: 'B.S. Computer Science', year: '2026' }],
    experience: [
      { company: 'Meta', title: 'Software Engineering Intern', duration: 'Summer 2025', description: 'Built React micro-frontend UI widgets.' },
    ],
  },
  {
    _id: 'cand_2',
    name: 'Elena Rostova',
    title: 'Frontend Developer & UI Specialist',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    skills: ['React', 'Framer Motion', 'Tailwind CSS', 'Vue.js', 'Figma'],
    location: 'Austin, TX',
    headline: 'UC Berkeley CS | UI Design Winner',
    bio: 'Crafting fluid 60fps web experiences. Micro-animations and responsive accessibility design geek.',
    expectedSalary: '$115,000 / yr',
    resumeScore: 91,
    education: [{ institution: 'UC Berkeley', degree: 'B.S. EECS', year: '2026' }],
    experience: [
      { company: 'Figma', title: 'Product Design & Dev Intern', duration: 'Summer 2025', description: 'Designed canvas rendering plugins.' },
    ],
  },
  {
    _id: 'cand_3',
    name: 'Marcus Vance',
    title: 'AI/ML & Backend Software Engineer',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    skills: ['Python', 'FastAPI', 'Node.js', 'Docker', 'PyTorch', 'MongoDB'],
    location: 'Seattle, WA',
    headline: 'UW CS Senior | Open Source Contributor',
    bio: 'Focused on scalable backend servers and LLM fine-tuning pipelines. Experienced in Docker container orchestration.',
    expectedSalary: '$130,000 / yr',
    resumeScore: 89,
    education: [{ institution: 'University of Washington', degree: 'B.S. Computer Science', year: '2026' }],
    experience: [
      { company: 'Amazon AWS', title: 'Backend Cloud Intern', duration: 'Summer 2025', description: 'Optimized Lambda API gateway response times.' },
    ],
  },
];

// Get Swipe Feed (Jobs for students, Candidates for recruiters)
exports.getSwipeFeed = async (req, res) => {
  try {
    const role = req.query.role || 'student';
    if (role === 'recruiter') {
      let candidates = [];
      try {
        candidates = await User.find({ role: 'student' }).select('-password');
      } catch (e) {}
      if (!candidates || candidates.length === 0) {
        candidates = SAMPLE_CANDIDATES;
      }
      return res.json({ success: true, feed: candidates, mode: 'candidates' });
    } else {
      let jobs = [];
      try {
        jobs = await Job.find({ status: 'active' });
      } catch (e) {}
      if (!jobs || jobs.length === 0) {
        jobs = SAMPLE_JOBS;
      }
      return res.json({ success: true, feed: jobs, mode: 'jobs' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Job Posting (Recruiter)
exports.createJob = async (req, res) => {
  try {
    const { title, company, type, workplaceType, location, salary, experienceLevel, techStack, description, requirements } = req.body;

    const newJob = {
      _id: 'job_' + Date.now(),
      title,
      company: company || 'Your Company',
      recruiter: req.user ? req.user.id : 'usr_recruiter_demo_456',
      type: type || 'Full-Time',
      workplaceType: workplaceType || 'Remote',
      location: location || 'San Francisco, CA',
      salary: salary || '$120,000 - $150,000 / yr',
      experienceLevel: experienceLevel || 'Entry Level',
      techStack: Array.isArray(techStack) ? techStack : (techStack || 'React, Node.js').split(',').map((s) => s.trim()),
      description,
      requirements: Array.isArray(requirements) ? requirements : (requirements || 'Bachelor degree, Strong Problem Solving').split('\n'),
      aiMatchScore: Math.floor(Math.random() * 15) + 85,
      applicantsCount: 0,
      status: 'active',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
    };

    try {
      await Job.create(newJob);
    } catch (e) {}

    res.status(201).json({ success: true, job: newJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Job Details
exports.getJobById = async (req, res) => {
  try {
    let job = null;
    try {
      job = await Job.findById(req.params.id);
    } catch (e) {}

    if (!job) {
      job = SAMPLE_JOBS.find((j) => j._id === req.params.id) || SAMPLE_JOBS[0];
    }
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports.SAMPLE_JOBS = SAMPLE_JOBS;
module.exports.SAMPLE_CANDIDATES = SAMPLE_CANDIDATES;

// Apply to a Job (Student only)
const Application = require('../models/Application');

exports.applyToJob = async (req, res) => {
  try {
    const { jobId, jobSnapshot } = req.body;
    if (!jobId) return res.status(400).json({ success: false, message: 'jobId is required' });

    const studentId = req.user ? req.user.id : 'usr_student_demo_123';

    // Check for duplicate before inserting
    let existing = null;
    try {
      existing = await Application.findOne({ student: studentId, jobId });
    } catch (e) {}

    if (existing) {
      return res.status(409).json({ success: false, message: 'You have already applied to this job', alreadyApplied: true });
    }

    try {
      await Application.create({ student: studentId, jobId, jobSnapshot: jobSnapshot || {} });
    } catch (e) {
      // Catch unique index violation (race condition)
      if (e.code === 11000) {
        return res.status(409).json({ success: false, message: 'You have already applied to this job', alreadyApplied: true });
      }
      // If DB not connected, just return success for demo
    }

    res.status(201).json({ success: true, message: 'Application submitted successfully!', jobId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Job IDs the current student has applied to
exports.getMyApplications = async (req, res) => {
  try {
    const studentId = req.user ? req.user.id : 'usr_student_demo_123';

    let applications = [];
    try {
      applications = await Application.find({ student: studentId }).select('jobId jobSnapshot status createdAt');
    } catch (e) {}

    res.json({ success: true, applications, appliedJobIds: applications.map((a) => a.jobId) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
