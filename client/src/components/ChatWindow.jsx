import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Paperclip,
  Calendar,
  Image,
  CheckCheck,
  Sparkles,
  X,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const ChatWindow = ({ activeMatch, onClose }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Interview Invite Form State
  const [interviewDate, setInterviewDate] = useState('2026-08-07');
  const [interviewTime, setInterviewTime] = useState('02:00 PM PST');
  const [interviewTitle, setInterviewTitle] = useState('Technical System Architecture Screen');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeMatch) {
      fetchMessages();

      if (socket) {
        const room = `match_${activeMatch._id}`;
        socket.emit('join_room', room);

        socket.on('receive_message', (msg) => {
          setMessages((prev) => [...prev, msg]);
          scrollToBottom();
        });

        return () => {
          socket.off('receive_message');
        };
      }
    }
  }, [activeMatch, socket]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chats/${activeMatch._id}/messages`);
      const data = await res.json();
      if (data.success && data.messages) {
        setMessages(data.messages);
        scrollToBottom();
      }
    } catch (e) {
      console.warn('API error fetching chat messages');
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      _id: 'msg_' + Date.now(),
      sender: user?._id || 'usr_student_demo_123',
      senderName: user?.name || 'Alex Chen',
      text: inputText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    scrollToBottom();

    // Socket broadcast
    if (socket) {
      socket.emit('send_message', {
        room: `match_${activeMatch._id}`,
        message: newMsg,
      });
    }

    try {
      await fetch(`/api/chats/${activeMatch._id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMsg.text }),
      });
    } catch (e) {}
  };

  const handleSendInterviewInvite = async () => {
    const inviteMsg = {
      _id: 'msg_' + Date.now(),
      sender: user?._id || 'usr_recruiter_demo_456',
      senderName: user?.name || 'Sarah Jenkins (Apex AI Labs)',
      text: `📅 Interview Invitation: ${interviewTitle}`,
      isInterviewInvite: true,
      interviewDetails: {
        date: interviewDate,
        time: interviewTime,
        title: interviewTitle,
        link: 'https://meet.google.com/swipehire-interview-demo',
        status: 'pending',
      },
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, inviteMsg]);
    setShowInviteModal(false);
    scrollToBottom();

    if (socket) {
      socket.emit('send_message', {
        room: `match_${activeMatch._id}`,
        message: inviteMsg,
      });
    }
  };

  if (!activeMatch) {
    return (
      <div className="w-full h-full glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4 text-purple-400">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-200">Select a Match to Start Chatting</h3>
        <p className="text-xs text-slate-400 mt-2">
          Real-time messaging powered by Socket.io with file sharing & interview scheduling.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[620px] glass-panel rounded-3xl border border-white/15 flex flex-col overflow-hidden shadow-2xl">
      {/* ------------------------------------------------------------- */}
      {/* CHAT HEADER */}
      {/* ------------------------------------------------------------- */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <img
            src={activeMatch.recruiterAvatar || activeMatch.studentAvatar}
            alt={activeMatch.company || activeMatch.studentName}
            className="w-11 h-11 rounded-2xl object-cover border-2 border-pink-500/30"
          />
          <div>
            <h4 className="text-base font-extrabold text-slate-100">
              {activeMatch.company || activeMatch.studentName}
            </h4>
            <p className="text-xs text-pink-400 font-semibold">
              {activeMatch.jobTitle || 'Full-Stack Software Engineer'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user?.role === 'recruiter' && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600/30 border border-purple-400/40 text-purple-200 text-xs font-bold shadow-sm hover:bg-purple-600/50 transition"
            >
              <Calendar className="w-3.5 h-3.5 text-purple-300" /> Schedule Interview
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MESSAGES LIST */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, i) => {
          const isMe = msg.sender === (user?._id || 'usr_student_demo_123');
          return (
            <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-slate-400 font-medium mb-1 px-1">
                {msg.senderName || (isMe ? 'You' : 'Match Partner')}
              </span>
              <div
                className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-none shadow-glow'
                    : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/10'
                }`}
              >
                {msg.text}

                {/* Interview Invite Card */}
                {msg.isInterviewInvite && msg.interviewDetails && (
                  <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/20 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Calendar className="w-4 h-4" /> {msg.interviewDetails.title}
                    </div>
                    <p className="text-slate-300">
                      Date: <span className="font-semibold text-white">{msg.interviewDetails.date}</span> at{' '}
                      <span className="font-semibold text-white">{msg.interviewDetails.time}</span>
                    </p>
                    <a
                      href={msg.interviewDetails.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-pink-400 font-bold hover:underline mt-1"
                    >
                      Join Meeting Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {isMe && <CheckCheck className="w-3.5 h-3.5 text-pink-400" />}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* INPUT FORM */}
      {/* ------------------------------------------------------------- */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
        />
        <button
          type="submit"
          className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow hover:scale-105 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* ------------------------------------------------------------- */}
      {/* INTERVIEW SCHEDULER MODAL */}
      {/* ------------------------------------------------------------- */}
      {showInviteModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-white/20 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="text-base font-bold text-slate-100">Schedule Interview</h4>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Interview Title</label>
              <input
                type="text"
                value={interviewTitle}
                onChange={(e) => setInterviewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Date</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Time</label>
                <input
                  type="text"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200"
                />
              </div>
            </div>

            <button
              onClick={handleSendInterviewInvite}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-glow hover:scale-105 transition"
            >
              Send Interview Invitation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
