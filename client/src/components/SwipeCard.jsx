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
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

export const SwipeCard = ({ item, isTop, mode, onSwipe, onOpenFit, onOpenCoverLetter }) => {
  const [flipped, setFlipped] = useState(false);

  // Framer Motion drag physics setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Card Rotation / Tilt based on drag offset X
  const rotate = useMotionValue(0);
  const rotateTransform = useTransform(x, [-250, 250], [-18, 18]);

  // Color Overlay Opacities
  const rightOpacity = useTransform(x, [20, 150], [0, 1]);
  const leftOpacity = useTransform(x, [-20, -150], [0, 1]);
  const superLikeOpacity = useTransform(y, [-20, -120], [0, 1]);
  const saveOpacity = useTransform(y, [20, 120], [0, 1]);

  const handleDragEnd = (event, info) => {
    const threshold = 120;
    const verticalThreshold = 100;

    if (info.offset.x > threshold) {
      onSwipe('right', item);
    } else if (info.offset.x < -threshold) {
      onSwipe('left', item);
    } else if (info.offset.y < -verticalThreshold) {
      onSwipe('superlike', item);
    } else if (info.offset.y > verticalThreshold) {
      onSwipe('save', item);
    }
  };

  if (!isTop) {
    // Stacked Cards underneath
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
    <motion.div
      style={{ x, y, rotate: rotateTransform }}
      drag={true}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className="absolute inset-0 w-full h-full glass-card rounded-3xl p-6 cursor-grab select-none shadow-2xl border border-white/15 overflow-hidden flex flex-col justify-between"
    >
      {/* ------------------------------------------------------------- */}
      {/* COLOR OVERLAYS FOR SWIPE FEEDBACK */}
      {/* ------------------------------------------------------------- */}

      {/* GREEN OVERLAY (RIGHT / INTERESTED) */}
      <motion.div
        style={{ opacity: rightOpacity }}
        className="absolute inset-0 bg-emerald-500/20 border-4 border-emerald-500 rounded-3xl pointer-events-none z-30 flex items-center justify-start pl-8"
      >
        <div className="bg-emerald-500 text-white font-extrabold text-2xl px-6 py-2 rounded-2xl tracking-wider shadow-lg transform -rotate-12 flex items-center gap-2">
          <Heart className="w-7 h-7 fill-white" /> LIKE
        </div>
      </motion.div>

      {/* RED OVERLAY (LEFT / SKIP) */}
      <motion.div
        style={{ opacity: leftOpacity }}
        className="absolute inset-0 bg-rose-500/20 border-4 border-rose-500 rounded-3xl pointer-events-none z-30 flex items-center justify-end pr-8"
      >
        <div className="bg-rose-500 text-white font-extrabold text-2xl px-6 py-2 rounded-2xl tracking-wider shadow-lg transform rotate-12 flex items-center gap-2">
          <X className="w-7 h-7" /> SKIP
        </div>
      </motion.div>

      {/* BLUE OVERLAY (UP / SUPER LIKE) */}
      <motion.div
        style={{ opacity: superLikeOpacity }}
        className="absolute inset-0 bg-sky-500/20 border-4 border-sky-500 rounded-3xl pointer-events-none z-30 flex items-end justify-center pb-12"
      >
        <div className="bg-sky-500 text-white font-extrabold text-2xl px-6 py-2 rounded-2xl tracking-wider shadow-lg flex items-center gap-2">
          <Star className="w-7 h-7 fill-white" /> SUPER LIKE
        </div>
      </motion.div>

      {/* YELLOW OVERLAY (DOWN / SAVE) */}
      <motion.div
        style={{ opacity: saveOpacity }}
        className="absolute inset-0 bg-amber-500/20 border-4 border-amber-500 rounded-3xl pointer-events-none z-30 flex items-start justify-center pt-12"
      >
        <div className="bg-amber-500 text-white font-extrabold text-2xl px-6 py-2 rounded-2xl tracking-wider shadow-lg flex items-center gap-2">
          <Bookmark className="w-7 h-7 fill-white" /> SAVED
        </div>
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/* CARD CONTENT */}
      {/* ------------------------------------------------------------- */}
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={mode === 'jobs' ? item.companyLogo : item.avatar}
              alt={item.title || item.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-pink-500/30 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-100 leading-tight">
                  {mode === 'jobs' ? item.title : item.name}
                </h3>
              </div>
              <p className="text-sm font-semibold text-pink-400 mt-0.5">
                {mode === 'jobs' ? item.company : item.title}
              </p>
            </div>
          </div>

          {/* AI Match Badge */}
          <div className="flex flex-col items-end shrink-0">
            <div
              onClick={() => onOpenFit(item)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold shadow-sm hover:scale-105 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{item.aiMatchScore || 92}% Fit</span>
            </div>
          </div>
        </div>

        {/* Key Attributes Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-pink-400" />
            {item.location || 'San Francisco, CA'}
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

        {/* Tech Stack Badges */}
        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2">Tech Stack & Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {(item.techStack || item.skills || ['React', 'Node.js', 'TypeScript', 'Tailwind CSS']).map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Description / Summary */}
        <div className="mt-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 line-clamp-3 leading-relaxed">
          {mode === 'jobs' ? item.description : item.headline || item.bio}
        </div>
      </div>

      {/* Card Actions & Flip Details Footer */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
        <button
          onClick={() => onOpenFit(item)}
          className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1 transition"
        >
          <Sparkles className="w-3.5 h-3.5" /> AI Skill Gap Analysis
        </button>

        {mode === 'jobs' && (
          <button
            onClick={() => onOpenCoverLetter(item)}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
          >
            <Info className="w-3.5 h-3.5" /> AI Cover Letter
          </button>
        )}
      </div>
    </motion.div>
  );
};
