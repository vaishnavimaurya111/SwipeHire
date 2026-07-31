const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, default: '' },
    text: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    fileType: { type: String, enum: ['image', 'document', 'none'], default: 'none' },
    isInterviewInvite: { type: Boolean, default: false },
    interviewDetails: {
      date: String,
      time: String,
      link: String,
      title: String,
      status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ChatSchema = new mongoose.Schema(
  {
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [MessageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', ChatSchema);
