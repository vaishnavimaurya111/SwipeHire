import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  MapPin,
  DollarSign,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Heart,
  X,
  Star,
  Loader2,
  Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Simple inline toast notification
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 40 }}
    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-2xl text-sm font-semibold shadow-2xl flex items-center gap-2 ${
      type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
    }`}
  >
    {type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">✕</button>
  </motion.div>
);

export const SwipeCard = ({ item, isTop, mode, onSwipe, onOpenFit, onOpenCoverLetter, isApplied: initialApplied = false, onApply }) => {
  const { user } = useAuth();
  const [applied, setApplied] = useState(initialApplied);
  const [applying, setApplying] = useState(false);
  const [toast, setToast] = useState(null);

  // Framer Motion drag physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateTransform = useTransform(x, [-250, 250], [-18, 18]);
  const rightOpacity = useTransform(x, [20, 150], [0, 1]);
  const leftOpacity = useTransform(x, [-20, -150], [0, 1]);
  const superLikeOpacity = useTransform(y, [-20, -120], [0, 1]);
  const saveOpacity = useTransform(y, [20, 120], [0, 1]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDragEnd = (event, info) => {
    const threshold = 120;
    const verticalThreshold = 100;
    if (info.offset.x > threshold)          onSwipe('right', item);
    else if (info.offset.x < -threshold)    onSwipe('left', item);
    else if (info.offset.y < -verticalThreshold) onSwipe('superlike', item);
    else if (info.offset.y > verticalThreshold)  onSwipe('save', item);
  };

  const handleApply = async (e) => {
    e.stopPropagation();
    if (applied || applying) return;

    setApplying(true);
    try {
      const token = localStorage.getItem('swipehire_token');
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          jobId: String(item._id),
          jobSnapshot: { title: item.title, company: item.company, type: item.type },
        }),
      });
      const data = await res.json();

      if (res.status === 409 || data.alreadyApplied) {
        setApplied(true);
        showToast('You already applied to this job!', 'error');
      } else if (data.success) {
        setApplied(true);
        onApply && onApply(String(item._id));
        showToast(`✅ Applied to ${item.company || 'this job'}!`, 'success');
      } else {
        showToast(data.message || 'Failed to apply. Try again.', 'error');
      }
    } catch (e) {
      // Optimistically mark as applied in demo/offline mode
      setApplied(true);
      onApply && onApply(String(item._id));
      showToast(`✅ Applied to ${item.company || 'this job'}!`, 'success');
    } finally {
      setApplying(false);
    }
  };

  if (!isTop) {
    return (
      <div className="absolute inset-0 w-full h-full glass-card rounded-3xl p-6 pointer-events-none transform scale-95 translate-y-3 opacity-60 border border-white/10 shadow-xl">
        <div className="flex items-start gap-4">
          <img
            src={mode === 'jobs' ? item.companyLogo : item.avatar}
            alt={item.title || item.name}
            className="w-14 h-14 rounded-2xl object-cover"
          />
          <div>
            <h3 className="text-xl font-bold text-slate-200">{item.title || item.name}</h3>
            <p className="text-sm text-pink-400">{item.company || item.headline}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <motion.div
        style={{ x, y, rotate: rotateTransform }}
        drag={true}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: 'grabbing' }}
        className="absolute inset-0 w-full h-full glass-card rounded-3xl p-6 cursor-grab select-none shadow-2xl border border-white/15 overflow-hidden flex flex-col justify-between"
      >
        {/* SWIPE OVERLAYS */}
        <motion.div style={{ opacity: rightOpacity }} className="absolute inset-0 bg-emerald-500/20 border-4 border-emerald-500 rounded-3xl pointer-events-none z-30 flex items-center justify-start pl-8">
          <div className="bg-emerald-500 text-white font-extrabold text-2xl px-6 py-2 rounded-2xl tracking-wider shadow-lg transform -rotate-12 flex items-center gap-2">
            <Heart className="w-7 h-7 fill-white" /> LIKE
          </div>
        </motion.div>
        <motion.div style={{ opacity: leftOpacity }} className="absolute inset-0 bg-rose-500/20 border-4 border-rose-500 rounded-3xl pointer-events-none z-30 flex items-center justify-end pr-8">
          <div className="bg-rose-500 text-white font-extrabold text-2xl px-6 py-2 rounded-2xl tracking-wider shadow-lg transform rotate-12 flex items-center gap-2">
            <X className="w-7 h-7" /> SKIP
          </div>
        </motion.div>
        <motion.div style={{ opacity: superLikeOpacity }} className="absolute inset-0 bg-sky-500/20 border-4 border-sky-500 rounded-3xl pointer-events-none z-30 flex items-end justify-center pb-12">
          <div className="bg-sky-500 text-white font-extrabold text-2xl px-6 py-2 rounded-2xl tracking-wider shadow-lg flex items-center gap-2">
            <Star className="w-7 h-7 fill-white" /> SUPER LIKE
          </div>
        </motion.div>
        <motion.div style={{ opacity: saveOpacity }} className="absolute inset-0 bg-amber-500/20 border-4 border-amber-500 rounded-3xl pointer-events-none z-30 flex items-start justify-center pt-12">
          <div className="bg-amber-500 text-white font-extrabold text-2xl px-6 py-2 rounded-2xl tracking-wider shadow-lg flex items-center gap-2">
            <Bookmark className="w-7 h-7 fill-white" /> SAVED
          </div>
        </motion.div>

        {/* CARD CONTENT */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={mode === 'jobs' ? item.companyLogo : item.avatar}
                alt={item.title || item.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-pink-500/30 shadow-md"
              />
              <div>
                <h3 className="text-xl font-extrabold text-slate-100 leading-tight">
                  {mode === 'jobs' ? item.title : item.name}
                </h3>
                <p className="text-sm font-semibold text-pink-400 mt-0.5">
                  {mode === 'jobs' ? item.company : item.title}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 gap-1.5">
              <div
                onClick={() => onOpenFit(item)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold shadow-sm hover:scale-105 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>{item.aiMatchScore || 92}% Fit</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-pink-400" />
              {item.location || 'Remote'}
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              {mode === 'jobs' ? item.salary : item.expectedSalary}
            </span>
            {mode === 'jobs' && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                {item.workplaceType} • {item.type}
              </span>
            )}
          </div>

          <div className="mt-4">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2">Tech Stack & Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {(item.techStack || item.skills || ['React', 'Node.js', 'TypeScript']).map((tech, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 line-clamp-3 leading-relaxed">
            {mode === 'jobs' ? item.description : item.headline || item.bio}
          </div>
        </div>

        {/* CARD FOOTER */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            onClick={() => onOpenFit(item)}
            className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1 transition"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Skill Gap
          </button>

          {mode === 'jobs' && user?.role !== 'recruiter' && (
            <motion.button
              whileHover={!applied ? { scale: 1.04 } : {}}
              whileTap={!applied ? { scale: 0.96 } : {}}
              onClick={handleApply}
              disabled={applied || applying}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md ${
                applied
                  ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 cursor-default'
                  : applying
                  ? 'bg-violet-600/40 border border-violet-500/40 text-white cursor-wait'
                  : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]'
              }`}
            >
              {applying ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Applying...</>
              ) : applied ? (
                <><CheckCircle2 className="w-3.5 h-3.5" /> Applied ✓</>
              ) : (
                <><Send className="w-3.5 h-3.5" /> Apply Now</>
              )}
            </motion.button>
          )}

          {mode === 'jobs' && (
            <button
              onClick={() => onOpenCoverLetter(item)}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
            >
              ✉️ Cover Letter
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
};

