const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const jobController = require('../controllers/jobController');
const swipeController = require('../controllers/swipeController');
const aiController = require('../controllers/aiController');
const chatController = require('../controllers/chatController');
const analyticsController = require('../controllers/analyticsController');

// Simple JWT Auth middleware check (soft middleware for demo flexibility)
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'swipehire_secret_key');
      req.user = decoded;
    } catch (e) {
      // Soft fail for demo simplicity
    }
  }
  next();
};

// -----------------------------------------------------------
// AUTH ROUTES
// -----------------------------------------------------------
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.getMe);
router.put('/auth/profile', authMiddleware, authController.updateProfile);

// -----------------------------------------------------------
// JOB & SWIPE FEED ROUTES
// -----------------------------------------------------------
router.get('/jobs/feed', authMiddleware, jobController.getSwipeFeed);
router.post('/jobs', authMiddleware, jobController.createJob);
router.get('/jobs/:id', jobController.getJobById);

// -----------------------------------------------------------
// SWIPE & MATCH ROUTES
// -----------------------------------------------------------
router.post('/swipes', authMiddleware, swipeController.handleSwipe);
router.get('/matches', authMiddleware, swipeController.getMatches);

// -----------------------------------------------------------
// AI FEATURES ROUTES
// -----------------------------------------------------------
router.post('/ai/score-resume', aiController.scoreResume);
router.post('/ai/cover-letter', aiController.createCoverLetter);
router.post('/ai/job-fit', aiController.getJobFit);

// -----------------------------------------------------------
// CHAT ROUTES
// -----------------------------------------------------------
router.get('/chats/:matchId/messages', authMiddleware, chatController.getMessages);
router.post('/chats/:matchId/messages', authMiddleware, chatController.sendMessage);

// -----------------------------------------------------------
// ANALYTICS ROUTES
// -----------------------------------------------------------
router.get('/analytics', authMiddleware, analyticsController.getAnalytics);

module.exports = router;
