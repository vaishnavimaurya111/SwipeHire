const { analyzeResume, generateCoverLetter, analyzeJobFit } = require('../services/aiService');
const pdfParse = require('pdf-parse');

// Analyze Resume
exports.scoreResume = async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    const result = await analyzeResume(
      resumeText || 'Alex Chen CS Senior Stanford React Node.js JavaScript MongoDB Python Gemini AI build Web Applications',
      targetRole || 'Full-Stack Software Engineer'
    );
    res.json({ success: true, analysis: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Analyze Resume from File Upload
exports.scoreResumeUpload = async (req, res) => {
  try {
    const { targetRole } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    const result = await analyzeResume(
      resumeText || 'Alex Chen CS Senior Stanford React Node.js JavaScript MongoDB Python Gemini AI build Web Applications',
      targetRole || 'Full-Stack Software Engineer'
    );
    res.json({ success: true, analysis: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate Cover Letter
exports.createCoverLetter = async (req, res) => {
  try {
    const { studentProfile, jobDetails } = req.body;
    const letter = await generateCoverLetter(
      studentProfile || { name: 'Alex Chen', skills: ['React', 'Node.js', 'Tailwind CSS'] },
      jobDetails || { title: 'Full-Stack Software Engineer', company: 'Apex AI Labs' }
    );
    res.json({ success: true, coverLetter: letter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Analyze Job Fit & Skill Gap
exports.getJobFit = async (req, res) => {
  try {
    const { studentSkills, jobRequirements } = req.body;
    const fitData = await analyzeJobFit(studentSkills, jobRequirements);
    res.json({ success: true, fit: fitData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
