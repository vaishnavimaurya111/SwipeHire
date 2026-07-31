const Chat = require('../models/Chat');

// Fetch Chat Messages for a Match
exports.getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;

    let chat = null;
    try {
      chat = await Chat.findOne({ match: matchId }).populate('messages.sender', 'name avatar');
    } catch (e) {}

    if (!chat || !chat.messages || chat.messages.length === 0) {
      // Mock initial conversation for demo
      const mockMessages = [
        {
          _id: 'msg_1',
          sender: 'usr_recruiter_demo_456',
          senderName: 'Sarah Jenkins (Apex AI Labs)',
          text: "🎉 Congratulations on matching! We loved your resume score (92%) and your portfolio project on AI matching.",
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        },
        {
          _id: 'msg_2',
          sender: 'usr_student_demo_123',
          senderName: 'Alex Chen',
          text: "Hi Sarah! Thanks so much for connecting. I'm really excited about Apex AI Labs' sub-100ms LLM interfaces!",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          _id: 'msg_3',
          sender: 'usr_recruiter_demo_456',
          senderName: 'Sarah Jenkins (Apex AI Labs)',
          text: "Fantastic! Would you be free for a 30-minute introductory technical screen this Friday at 2:00 PM PST?",
          isInterviewInvite: true,
          interviewDetails: {
            date: '2026-08-07',
            time: '02:00 PM PST',
            title: 'Technical Intro & System Architecture',
            link: 'https://meet.google.com/swipehire-interview-demo',
            status: 'pending',
          },
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      return res.json({ success: true, messages: mockMessages });
    }

    res.json({ success: true, messages: chat.messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send Message (HTTP Fallback if socket unavailable)
exports.sendMessage = async (req, res) => {
  try {
    const { matchId, text, fileUrl, fileType, isInterviewInvite, interviewDetails } = req.body;
    const senderId = req.user ? req.user.id : 'usr_student_demo_123';

    const newMessage = {
      _id: 'msg_' + Date.now(),
      sender: senderId,
      senderName: req.user ? req.user.name : 'You',
      text: text || '',
      fileUrl: fileUrl || '',
      fileType: fileType || 'none',
      isInterviewInvite: !!isInterviewInvite,
      interviewDetails: interviewDetails || null,
      createdAt: new Date().toISOString(),
    };

    try {
      await Chat.findOneAndUpdate(
        { match: matchId },
        { $push: { messages: newMessage } },
        { upsert: true, new: true }
      );
    } catch (e) {}

    res.json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
