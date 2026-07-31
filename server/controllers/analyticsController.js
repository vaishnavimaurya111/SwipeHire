// Fetch Analytics for Student or Recruiter
exports.getAnalytics = async (req, res) => {
  try {
    const role = req.query.role || 'student';

    if (role === 'recruiter') {
      return res.json({
        success: true,
        analytics: {
          totalApplicants: 148,
          matchRate: '38.4%',
          interviewsScheduled: 24,
          offersExtended: 6,
          mostViewedJob: 'Full-Stack Software Engineer (AI & Web)',
          funnel: [
            { stage: 'Total Swipes', count: 420 },
            { stage: 'Matches', count: 148 },
            { stage: 'Interviews', count: 24 },
            { stage: 'Offers', count: 6 },
          ],
          weeklyEngagement: [
            { day: 'Mon', applicants: 18, matches: 6 },
            { day: 'Tue', applicants: 24, matches: 10 },
            { day: 'Wed', applicants: 32, matches: 14 },
            { day: 'Thu', applicants: 28, matches: 9 },
            { day: 'Fri', applicants: 35, matches: 12 },
            { day: 'Sat', applicants: 7, matches: 2 },
            { day: 'Sun', applicants: 4, matches: 1 },
          ],
        },
      });
    }

    // Student Analytics
    res.json({
      success: true,
      analytics: {
        applicationsSent: 42,
        matches: 18,
        interviews: 5,
        offerRate: '12%',
        profileViews: 215,
        resumeScore: 92,
        weeklyActivity: [
          { day: 'Mon', swipes: 12, matches: 3 },
          { day: 'Tue', swipes: 18, matches: 5 },
          { day: 'Wed', swipes: 15, matches: 4 },
          { day: 'Thu', swipes: 22, matches: 4 },
          { day: 'Fri', swipes: 10, matches: 2 },
          { day: 'Sat', swipes: 5, matches: 0 },
          { day: 'Sun', swipes: 8, matches: 0 },
        ],
        skillMatchBreakdown: [
          { skill: 'React', demand: 95 },
          { skill: 'Node.js', demand: 88 },
          { skill: 'TypeScript', demand: 90 },
          { skill: 'Tailwind CSS', demand: 84 },
          { skill: 'Gemini AI', demand: 78 },
        ],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
