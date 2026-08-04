import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SwipeCard } from './SwipeCard';
import {
  X,
  Heart,
  Star,
  Bookmark,
  RefreshCcw,
  Search,
  Filter,
  MapPin,
  Briefcase,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';

export const SwipeDeck = ({ onTriggerMatch, onOpenFit, onOpenCoverLetter }) => {
  const { user } = useAuth();
  const [feedItems, setFeedItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false); // 0ms instant load
  const [appliedJobIds, setAppliedJobIds] = useState(new Set()); // tracks applied jobs

  // Filters State
  const [locationFilter, setLocationFilter] = useState('All');
  const [workplaceFilter, setWorkplaceFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const mode = user?.role === 'recruiter' ? 'candidates' : 'jobs';

  useEffect(() => {
    fetchFeed();
    if (user?.role !== 'recruiter') fetchMyApplications();
  }, [user?.role]);

  const fetchFeed = async () => {
    try {
      const res = await fetch(getApiUrl(`/api/jobs/feed?role=${user?.role || 'student'}`));
      const data = await res.json();
      if (data.success && data.feed && data.feed.length > 0) {
        setFeedItems(data.feed);
      }
    } catch (e) {
      console.warn('API error, using demo cards feed.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const token = localStorage.getItem('swipehire_token');
      const res = await fetch(getApiUrl('/api/my-applications'), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success && data.appliedJobIds) {
        setAppliedJobIds(new Set(data.appliedJobIds));
      }
    } catch (e) {
      // Not critical — page still works without it
    }
  };

  const handleApply = (jobId) => {
    setAppliedJobIds((prev) => new Set([...prev, jobId]));
  };

  const handleSwipeAction = async (action, item) => {
    // Advance Card Stack Index
    setCurrentIndex((prev) => prev + 1);

    // Call API swipe endpoint
    try {
      const res = await fetch(getApiUrl('/api/swipes'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId: item._id,
          action,
          role: user?.role || 'student',
        }),
      });
      const data = await res.json();
      if (data.isMatch) {
        onTriggerMatch(data.match || {
          studentName: user?.role === 'student' ? user.name : item.name,
          company: item.company || 'Apex AI Labs',
          recruiterAvatar: item.companyLogo || item.avatar,
          studentAvatar: user?.avatar,
          jobTitle: item.title || 'Full-Stack Engineer',
        });
      }
    } catch (e) {
      // Trigger match fallback for rich interactive experience
      if (action === 'right' || action === 'superlike') {
        onTriggerMatch({
          studentName: user?.role === 'student' ? user.name : item.name,
          company: item.company || 'Apex AI Labs',
          recruiterAvatar: item.companyLogo || item.avatar,
          studentAvatar: user?.avatar,
          jobTitle: item.title || 'Full-Stack Engineer',
        });
      }
    }
  };

  const handleResetFeed = () => {
    setCurrentIndex(0);
  };

  // Apply Search & Filters
  const filteredItems = feedItems.filter((item) => {
    const titleMatch = (item.title || item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const companyMatch = (item.company || item.headline || '').toLowerCase().includes(searchTerm.toLowerCase());
    const locationMatch = locationFilter === 'All' || (item.location || '').includes(locationFilter);
    const workplaceMatch = workplaceFilter === 'All' || item.workplaceType === workplaceFilter;

    return (titleMatch || companyMatch) && locationMatch && workplaceMatch;
  });

  const currentCard = filteredItems[currentIndex];
  const nextCard = filteredItems[currentIndex + 1];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-140px)] py-4 px-4">
      {/* ------------------------------------------------------------- */}
      {/* SEARCH & FILTERS BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={mode === 'jobs' ? 'Search jobs, companies...' : 'Search student candidates...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-pink-500/50 transition"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-2xl border transition ${
              showFilters ? 'bg-pink-500 text-white border-pink-500' : 'bg-white/5 border-white/10 text-slate-300'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Expanded Filters Drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4 glass-panel rounded-2xl border border-white/15 space-y-3 overflow-hidden text-xs"
            >
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Workplace Type</label>
                <div className="flex gap-2">
                  {['All', 'Remote', 'Hybrid', 'On-Site'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setWorkplaceFilter(type)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                        workplaceFilter === type
                          ? 'bg-purple-600 text-white shadow-glow'
                          : 'bg-white/5 border border-white/10 text-slate-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SWIPE DECK CONTAINER */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full h-[520px] max-w-sm">
        {loading ? (
          <div className="w-full h-full glass-card rounded-3xl p-6 flex flex-col justify-between animate-pulse">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10" />
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-white/10 rounded-lg w-3/4" />
                <div className="h-4 bg-white/10 rounded-lg w-1/2" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-10 bg-white/10 rounded-xl" />
              <div className="h-16 bg-white/10 rounded-xl" />
            </div>
          </div>
        ) : currentCard ? (
          <>
            {nextCard && (
              <SwipeCard key={nextCard._id} item={nextCard} isTop={false} mode={mode} />
            )}
            <SwipeCard
              key={currentCard._id}
              item={currentCard}
              isTop={true}
              mode={mode}
              onSwipe={handleSwipeAction}
              onOpenFit={onOpenFit}
              onOpenCoverLetter={onOpenCoverLetter}
              isApplied={appliedJobIds.has(String(currentCard._id))}
              onApply={handleApply}
            />
          </>
        ) : (
          <div className="w-full h-full glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-pink-400 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">You've Swiped All Cards!</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
              Check back soon for newly posted jobs and candidate profiles matched by our AI engine.
            </p>
            <button
              onClick={handleResetFeed}
              className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-glow hover:scale-105 transition"
            >
              <RefreshCcw className="w-4 h-4" /> Start Over Stack
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ACTION CONTROL BUTTONS */}
      {/* ------------------------------------------------------------- */}
      {currentCard && (
        <div className="flex items-center justify-center gap-4 mt-6">
          {/* SKIP (LEFT) */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipeAction('left', currentCard)}
            className="w-14 h-14 rounded-full bg-[#1e1530] border-2 border-rose-500/40 text-rose-400 flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition"
            title="Skip (Left Swipe)"
          >
            <X className="w-7 h-7" />
          </motion.button>

          {/* SAVE (DOWN) */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipeAction('save', currentCard)}
            className="w-12 h-12 rounded-full bg-[#1e1530] border-2 border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg hover:bg-amber-500 hover:text-white transition"
            title="Save for Later"
          >
            <Bookmark className="w-5 h-5" />
          </motion.button>

          {/* SUPER LIKE (UP) */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipeAction('superlike', currentCard)}
            className="w-12 h-12 rounded-full bg-[#1e1530] border-2 border-sky-500/40 text-sky-400 flex items-center justify-center shadow-lg hover:bg-sky-500 hover:text-white transition"
            title="Super Like"
          >
            <Star className="w-5 h-5 fill-current" />
          </motion.button>

          {/* INTERESTED (RIGHT) */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipeAction('right', currentCard)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-glow hover:scale-110 transition"
            title="Interested (Right Swipe)"
          >
            <Heart className="w-7 h-7 fill-white" />
          </motion.button>
        </div>
      )}
    </div>
  );
};
