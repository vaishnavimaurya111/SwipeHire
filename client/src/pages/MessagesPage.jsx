import React, { useState, useEffect } from 'react';
import { ChatWindow } from '../components/ChatWindow';
import { MessageSquare, Sparkles, Search, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MessagesPage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [activeMatch, setActiveMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/matches');
      const data = await res.json();
      if (data.success && data.matches) {
        setMatches(data.matches);
        if (data.matches.length > 0) {
          setActiveMatch(data.matches[0]);
        }
      }
    } catch (e) {
      console.warn('API error, using demo matches list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            Matches & Live Chat <Sparkles className="w-5 h-5 text-pink-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Connect directly with recruiters and candidates who matched with you.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Matches List */}
        <div className="glass-panel rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col h-[620px]">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-pink-400" /> Active Connections ({matches.length})
          </h3>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {matches.map((match) => {
              const isSelected = activeMatch?._id === match._id;
              return (
                <div
                  key={match._id}
                  onClick={() => setActiveMatch(match)}
                  className={`p-4 rounded-2xl cursor-pointer border transition ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-pink-500/50 shadow-glow'
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={match.recruiterAvatar || match.studentAvatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'}
                      alt={match.company || match.studentName}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-pink-500/30 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-100 truncate">{match.company || match.studentName}</h4>
                        <span className="text-[10px] text-pink-400 font-semibold shrink-0">Matched</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{match.jobTitle}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-1">{match.lastMessage}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Socket.io Chat Window */}
        <div className="lg:col-span-2">
          <ChatWindow activeMatch={activeMatch} />
        </div>
      </div>
    </div>
  );
};
