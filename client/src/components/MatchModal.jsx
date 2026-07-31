import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MessageSquare, Calendar, Sparkles, X, Heart } from 'lucide-react';

export const MatchModal = ({ match, onClose, onStartChat }) => {
  useEffect(() => {
    if (match) {
      // Fire confetti explosion
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ec4899', '#a855f7', '#3b82f6', '#f97316'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ec4899', '#a855f7', '#3b82f6', '#f97316'],
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [match]);

  if (!match) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 250 }}
          className="relative w-full max-w-md glass-panel rounded-3xl p-8 border border-white/20 text-center overflow-hidden shadow-2xl"
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close X */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 font-extrabold text-sm mb-4 animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>MUTUAL CONNECTION</span>
          </div>

          <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
            It's a Match! 🎉
          </h2>
          <p className="text-xs text-slate-300 mt-2">
            You and <span className="font-bold text-pink-300">{match.company || match.studentName}</span> swiped right on each other.
          </p>

          {/* Connected Avatars */}
          <div className="flex items-center justify-center gap-4 my-8 relative">
            {/* Student Avatar */}
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <img
                src={match.studentAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'}
                alt="Student"
                className="w-24 h-24 rounded-3xl object-cover border-4 border-purple-500 shadow-glow"
              />
              <span className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Student
              </span>
            </motion.div>

            {/* Heart Badge */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-white shadow-lg z-10"
            >
              <Heart className="w-6 h-6 fill-white" />
            </motion.div>

            {/* Recruiter Avatar */}
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <img
                src={match.recruiterAvatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'}
                alt="Recruiter"
                className="w-24 h-24 rounded-3xl object-cover border-4 border-pink-500 shadow-glow"
              />
              <span className="absolute -bottom-2 -right-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Company
              </span>
            </motion.div>
          </div>

          <p className="text-xs text-slate-400 font-semibold mb-6">
            Position: <span className="text-slate-200">{match.jobTitle || 'Full-Stack Software Engineer'}</span>
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onStartChat(match);
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-extrabold text-sm shadow-glow hover:scale-[1.02] transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Send Direct Message Now
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition"
            >
              Keep Swiping Deck
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
