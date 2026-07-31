import React, { useState } from 'react';
import { SwipeDeck } from '../components/SwipeDeck';
import { Briefcase, Clock, ChevronRight, Bookmark, Layers, Inbox } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StudentDashboard = ({ onTriggerMatch, onOpenFit, onOpenCoverLetter, setActiveTab }) => {
  const { user } = useAuth();
  const [dashboardTab, setDashboardTab] = useState('swipe');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">
            Hey, <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {user?.headline || 'Find your next opportunity — one swipe at a time.'}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.07] rounded-2xl">
          {[
            { id: 'swipe', label: '🔥 Swipe Feed' },
            { id: 'tracker', label: '📋 Applications' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setDashboardTab(id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                dashboardTab === id
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {dashboardTab === 'swipe' ? (
        <SwipeDeck
          onTriggerMatch={onTriggerMatch}
          onOpenFit={onOpenFit}
          onOpenCoverLetter={onOpenCoverLetter}
        />
      ) : (
        /* Empty State for Applications — real data requires MongoDB */
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <Inbox className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-300">No Applications Yet</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Start swiping on job cards to send applications. Your matches and application statuses will appear here.
          </p>
          <button
            onClick={() => setDashboardTab('swipe')}
            className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold shadow-lg hover:scale-[1.02] transition"
          >
            Start Swiping Jobs
          </button>
        </div>
      )}
    </div>
  );
};
