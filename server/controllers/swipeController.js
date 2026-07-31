const Swipe = require('../models/Swipe');
const Match = require('../models/Match');
const Job = require('../models/Job');
const User = require('../models/User');

// Process Swipe Action (Right, Left, Superlike, Save)
exports.handleSwipe = async (req, res) => {
  try {
    const { targetId, action, role } = req.body;
    const swiperId = req.user ? req.user.id : 'usr_student_demo_123';

    let isMatch = false;
    let matchData = null;

    // Simulate Match check: Right swipe or Superlike triggers instant match preview on demo!
    if (action === 'right' || action === 'superlike') {
      // 80% chance of instantaneous match for demo experience, or if superlike 100%
      if (action === 'superlike' || Math.random() > 0.15) {
        isMatch = true;
        matchData = {
          _id: 'match_' + Date.now(),
          student: role === 'student' ? swiperId : targetId,
          recruiter: role === 'recruiter' ? swiperId : 'usr_recruiter_demo_456',
          jobId: targetId || 'job_1',
          company: 'Apex AI Labs',
          jobTitle: 'Full-Stack Software Engineer (AI & Web)',
          recruiterName: 'Sarah Jenkins',
          recruiterAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
          studentName: 'Alex Chen',
          studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
          matchedAt: new Date().toISOString(),
        };

        try {
          await Match.create({
            student: matchData.student,
            recruiter: matchData.recruiter,
            job: targetId || '60d0fe4f5311236168a109ca',
            company: 'Apex AI Labs',
          });
        } catch (e) {}
      }
    }

    res.json({
      success: true,
      action,
      isMatch,
      match: matchData,
      message: isMatch ? "🎉 It's a Match!" : `Swiped ${action} successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User's Matches
exports.getMatches = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'usr_student_demo_123';
    let matches = [];

    try {
      matches = await Match.find({
        $or: [{ student: userId }, { recruiter: userId }],
      })
        .populate('student recruiter job')
        .sort({ updatedAt: -1 });
    } catch (e) {}

    if (!matches || matches.length === 0) {
      matches = [
        {
          _id: 'match_demo_1',
          company: 'Apex AI Labs',
          jobTitle: 'Full-Stack Software Engineer',
          studentName: 'Alex Chen',
          studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
          recruiterName: 'Sarah Jenkins',
          recruiterAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
          lastMessage: 'Hey Alex! We loved your resume score and full-stack projects. Free for a quick tech chat tomorrow?',
          lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
          status: 'matched',
        },
        {
          _id: 'match_demo_2',
          company: 'Veloce Cloud Systems',
          jobTitle: 'Frontend UI/UX Engineer',
          studentName: 'Alex Chen',
          studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
          recruiterName: 'Marcus Vance',
          recruiterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          lastMessage: "Interview Scheduled for Friday 2:00 PM PST. Here is the calendar invitation link!",
          lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
          status: 'interview_scheduled',
        },
      ];
    }

    res.json({ success: true, matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
