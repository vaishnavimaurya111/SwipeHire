import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Layers, Heart, Briefcase, Zap } from 'lucide-react';

export const SplashScreen = ({ onComplete }) => {
  const [showTagline, setShowTagline] = useState(false);
  const [exitSplash, setExitSplash] = useState(false);

  const brandTitle = "SwipeHire".split("");

  useEffect(() => {
    // Show tagline after logo animation completes (~1.2s)
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 1100);

    // Trigger smooth fade out & unmount after 2.8s
    const exitTimer = setTimeout(() => {
      setExitSplash(true);
    }, 2700);

    const finishTimer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exitSplash && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#0c081e] via-[#1a0f35] to-[#2c0e29] overflow-hidden selection:bg-none"
        >
          {/* Animated Background Mesh & Light Orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [-20, 20, -20],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.7, 0.4],
                y: [-30, 30, -30],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-600/30 rounded-full blur-[120px]"
            />
          </div>

          {/* Flying Swipe Card Graphic Animation */}
          <motion.div
            initial={{ x: -300, y: -100, rotate: -25, opacity: 0, scale: 0.5 }}
            animate={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 180,
              damping: 15,
              delay: 0.2,
            }}
            className="relative mb-6"
          >
            {/* Pulsing Card Stack Icon */}
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                boxShadow: [
                  '0 0 20px rgba(236,72,153,0.3)',
                  '0 0 45px rgba(236,72,153,0.7)',
                  '0 0 20px rgba(236,72,153,0.3)',
                ],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center p-0.5"
            >
              <div className="w-full h-full bg-[#120c24] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <Layers className="w-9 h-9 text-pink-400 absolute" />
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Zap className="w-6 h-6 text-amber-400 relative z-10 fill-amber-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* Subtle Pulse Rings */}
            <motion.span
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-2xl border-2 border-pink-500/60 pointer-events-none"
            />
          </motion.div>

          {/* Letter-by-Letter Title Animation */}
          <div className="flex items-center justify-center gap-0.5 overflow-hidden py-2">
            {brandTitle.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ y: 60, opacity: 0, rotate: index % 2 === 0 ? -12 : 12 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + index * 0.08,
                  ease: [0.215, 0.61, 0.355, 1.0],
                }}
                className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent drop-shadow-md"
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Tagline Fade-In & Slide-Up */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: showTagline ? 1 : 0, y: showTagline ? 0 : 15 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mt-3 flex items-center gap-2 text-center"
          >
            <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
            <p className="text-lg md:text-xl text-slate-300 font-medium tracking-wide">
              Swipe Right on Your <span className="text-pink-400 font-semibold underline decoration-pink-500/40 underline-offset-4">Dream Career</span>.
            </p>
            <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
          </motion.div>

          {/* Loading Shimmer Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '180px' }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
            className="h-1 mt-10 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 shadow-glow"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
