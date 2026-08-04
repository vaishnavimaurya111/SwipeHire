import React, { useState } from 'react';
import { AiResumeAnalyzer } from '../components/AiResumeAnalyzer';
import { Sparkles, FileText, Target, Copy, Check, RefreshCw, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AiHubPage = () => {
  const { user } = useAuth();
  const [activeTool, setActiveTool] = useState('resume');

  // Cover Letter Tool State
  const [clCompany, setClCompany] = useState('Google');
  const [clTitle, setClTitle] = useState('Full-Stack Engineer');
  const [clDesc, setClDesc] = useState('Building high scale cloud applications and APIs.');
  const [coverLetter, setCoverLetter] = useState('');
  const [clGenerating, setClGenerating] = useState(false);
  const [clCopied, setClCopied] = useState(false);

  // Skill Gap Tool State
  const [sgRole, setSgRole] = useState('Full-Stack Software Engineer');
  const [sgCandidateSkills, setSgCandidateSkills] = useState(
    user?.skills?.join(', ') || 'React, Node.js, JavaScript, Tailwind CSS'
  );
  const [sgJobReqs, setSgJobReqs] = useState('React, TypeScript, Node.js, MongoDB, AWS, Docker');
  const [skillGapResult, setSkillGapResult] = useState(null);
  const [sgAnalyzing, setSgAnalyzing] = useState(false);

  const handleGenerateCoverLetter = async () => {
    setClGenerating(true);
    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: { name: user?.name || 'Candidate', skills: (user?.skills || ['React', 'Node.js']) },
          jobDetails: { company: clCompany, title: clTitle, description: clDesc },
        }),
      });
      const data = await res.json();
      if (data.success && data.coverLetter) {
        setCoverLetter(data.coverLetter);
      }
    } catch (e) {
      console.warn('Fallback cover letter');
    } finally {
      setClGenerating(false);
    }
  };

  const handleAnalyzeSkillGap = async () => {
    setSgAnalyzing(true);
    try {
      const studentSkills = sgCandidateSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const jobRequirements = sgJobReqs.split(',').map((s) => s.trim()).filter(Boolean);

      const res = await fetch('/api/ai/job-fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentSkills, jobRequirements }),
      });
      const data = await res.json();
      if (data.success && data.fit) {
        setSkillGapResult(data.fit);
      }
    } catch (e) {
      console.warn('Fallback skill gap');
    } finally {
      setSgAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
            SwipeHire AI Features Suite <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 animate-pulse" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supercharge your job search with standalone Gemini AI powered tools.
          </p>
        </div>

        {/* Tools Selector */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveTool('resume')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              activeTool === 'resume'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📄 Resume Score
          </button>
          <button
            onClick={() => setActiveTool('cover-letter')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              activeTool === 'cover-letter'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✉️ Cover Letter Generator
          </button>
          <button
            onClick={() => setActiveTool('skill-gap')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              activeTool === 'skill-gap'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 Skill Gap Radar
          </button>
        </div>
      </div>

      {/* TOOL 1: Resume Analyzer */}
      {activeTool === 'resume' && <AiResumeAnalyzer />}

      {/* TOOL 2: Standalone Cover Letter Generator */}
      {activeTool === 'cover-letter' && (
        <div className="glass-panel rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/15 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-glow">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100">AI Cover Letter Generator</h2>
              <p className="text-xs text-slate-400">Generate a custom cover letter tailored for any target company & role.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Target Company Name</label>
              <input
                type="text"
                value={clCompany}
                onChange={(e) => setClCompany(e.target.value)}
                placeholder="e.g. Google, Microsoft, Startup"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Job Title</label>
              <input
                type="text"
                value={clTitle}
                onChange={(e) => setClTitle(e.target.value)}
                placeholder="e.g. Full-Stack Software Engineer"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Job Summary / Description (Optional)</label>
              <textarea
                rows={2}
                value={clDesc}
                onChange={(e) => setClDesc(e.target.value)}
                placeholder="Key requirements or mission statement..."
                className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-violet-500 resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateCoverLetter}
            disabled={clGenerating}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-extrabold text-xs sm:text-sm shadow-glow hover:scale-[1.01] transition flex items-center justify-center gap-2"
          >
            {clGenerating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating Cover Letter...</> : <><Sparkles className="w-4 h-4" /> Generate Custom Cover Letter</>}
          </button>

          {coverLetter && (
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-h-96 overflow-y-auto text-xs text-slate-200 leading-relaxed whitespace-pre-line shadow-inner">
                {coverLetter}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(coverLetter);
                  setClCopied(true);
                  setTimeout(() => setClCopied(false), 2000);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-glow hover:scale-105 transition"
              >
                {clCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{clCopied ? 'Copied to Clipboard!' : 'Copy Cover Letter'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TOOL 3: Standalone Skill Gap Radar */}
      {activeTool === 'skill-gap' && (
        <div className="glass-panel rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/15 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-glow">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100">AI Skill Gap Radar</h2>
              <p className="text-xs text-slate-400">Compare your skills against ANY job requirements to get a match percentage & recommendations.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Target Position Title</label>
              <input
                type="text"
                value={sgRole}
                onChange={(e) => setSgRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Your Current Skills (Comma Separated)</label>
              <input
                type="text"
                value={sgCandidateSkills}
                onChange={(e) => setSgCandidateSkills(e.target.value)}
                placeholder="e.g. React, Node.js, JavaScript, HTML, CSS"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Job Required Skills (Comma Separated)</label>
              <input
                type="text"
                value={sgJobReqs}
                onChange={(e) => setSgJobReqs(e.target.value)}
                placeholder="e.g. React, TypeScript, Docker, Kubernetes, AWS"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <button
            onClick={handleAnalyzeSkillGap}
            disabled={sgAnalyzing}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-extrabold text-xs sm:text-sm shadow-glow hover:scale-[1.01] transition flex items-center justify-center gap-2"
          >
            {sgAnalyzing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Calculating Match Percentage...</> : <><Sparkles className="w-4 h-4" /> Calculate Skill Gap & Match</>}
          </button>

          {skillGapResult && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-orange-900/40 border border-pink-500/30">
                <div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Target Role Match</span>
                  <p className="text-2xl font-black text-pink-400">{skillGapResult.fitPercentage}% Match</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/40 flex items-center justify-center font-extrabold text-pink-300 text-lg shadow-glow">
                  {skillGapResult.fitPercentage}%
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <h4 className="text-xs font-bold text-emerald-400 mb-2">✓ Matched Skills ({skillGapResult.matchedSkills?.length || 0})</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(skillGapResult.matchedSkills || []).map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <h4 className="text-xs font-bold text-amber-400 mb-2">! Missing Skill Gaps ({skillGapResult.missingSkills?.length || 0})</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(skillGapResult.missingSkills || []).map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-semibold">
                        ! {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

