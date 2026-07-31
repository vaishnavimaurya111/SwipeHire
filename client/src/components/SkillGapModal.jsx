import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, AlertCircle, BookOpen, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SkillGapModal = ({ item, onClose }) => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (item) {
      fetchAnalysis();
    }
  }, [item]);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/job-fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentSkills: user?.skills || ['React', 'Node.js', 'JavaScript', 'Tailwind CSS'],
          jobRequirements: item?.techStack || item?.requirements || ['React', 'TypeScript', 'Docker', 'GraphQL'],
        }),
      });
      const data = await res.json();
      if (data.success && data.fit) {
        setAnalysis(data.fit);
      }
    } catch (e) {
      console.warn('API error, using fallback fit analysis');
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-xl glass-panel rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-glow">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">AI Job Fit & Skill Gap Analysis</h3>
                <p className="text-xs text-pink-400 font-semibold">{item.title || item.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Calculating AI skill gap percentage...
            </div>
          ) : (
            <div className="space-y-5">
              {/* Match Score Badge */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-orange-900/40 border border-pink-500/30">
                <div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Compatibility Score</span>
                  <p className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {analysis?.fitPercentage || 92}% Match
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/40 flex items-center justify-center font-extrabold text-pink-300 text-xl shadow-glow">
                  {analysis?.fitPercentage || 92}%
                </div>
              </div>

              {/* Matched Skills */}
              <div>
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4" /> Skills You Already Possess
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis?.matchedSkills || ['React', 'Node.js', 'JavaScript']).map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-4 h-4" /> Required Skill Gaps to Bridge
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis?.missingSkills || ['TypeScript', 'Docker', 'GraphQL']).map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold"
                    >
                      ! {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Learning Recommendations */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-4 h-4" /> AI Learning Recommendations
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {(analysis?.recommendations || [
                    'Take a quick crash course on TypeScript interfaces.',
                    'Build a mini containerized project with Docker.',
                    'Highlight state management (Redux/Zustand) in your resume.',
                  ]).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
