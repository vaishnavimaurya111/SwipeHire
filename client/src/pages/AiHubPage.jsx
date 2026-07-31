import React, { useState } from 'react';
import { AiResumeAnalyzer } from '../components/AiResumeAnalyzer';
import { AiCoverLetterModal } from '../components/AiCoverLetterModal';
import { SkillGapModal } from '../components/SkillGapModal';
import { Sparkles, FileText, Target, BookOpen } from 'lucide-react';

export const AiHubPage = () => {
  const [activeTool, setActiveTool] = useState('resume');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [showSkillGapModal, setShowSkillGapModal] = useState(false);

  const sampleJob = {
    _id: 'job_1',
    title: 'Full-Stack Software Engineer (AI & Web)',
    company: 'Apex AI Labs',
    techStack: ['React', 'Node.js', 'TypeScript', 'Gemini AI', 'MongoDB'],
    description: 'Join Apex AI Labs to build real-time generative AI interfaces.',
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            SwipeHire AI Features Suite <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supercharge your career search with Gemini 2.5 Flash powered tools.
          </p>
        </div>

        {/* Tools Selector */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10">
          <button
            onClick={() => setActiveTool('resume')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTool === 'resume'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📄 Resume Score
          </button>
          <button
            onClick={() => {
              setSelectedJob(sampleJob);
              setShowCoverLetterModal(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            ✉️ Cover Letter
          </button>
          <button
            onClick={() => {
              setSelectedJob(sampleJob);
              setShowSkillGapModal(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            🎯 Skill Gap Radar
          </button>
        </div>
      </div>

      {/* Main Active AI Tool Display */}
      <AiResumeAnalyzer />

      {/* Modals */}
      {showCoverLetterModal && (
        <AiCoverLetterModal job={selectedJob} onClose={() => setShowCoverLetterModal(false)} />
      )}
      {showSkillGapModal && (
        <SkillGapModal item={selectedJob} onClose={() => setShowSkillGapModal(false)} />
      )}
    </div>
  );
};
