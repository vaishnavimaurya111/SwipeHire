import React, { useState } from 'react';
import {
  Sparkles, CheckCircle2, AlertTriangle, Key, RefreshCw, Upload,
  Target, BookOpen, Award, Lightbulb, TrendingUp, User, Star, ChevronDown, ChevronUp
} from 'lucide-react';

// Animated circular score ring
const ScoreRing = ({ score, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (pct / 100) * circumference;

  const color = pct >= 70 ? '#10b981' : pct >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black" style={{ color }}>{pct}</span>
        <span className="text-[10px] text-slate-400 font-semibold">/ 100</span>
      </div>
    </div>
  );
};

// Category progress bar
const CategoryBar = ({ label, score, max, color }) => {
  const pct = Math.round((score / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-300 font-semibold">{label}</span>
        <span className="font-bold" style={{ color }}>{score}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

// Collapsible section
const Section = ({ icon: Icon, title, color, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-2xl border ${color} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

const ListItems = ({ items, bullet = '•', color = 'text-slate-300' }) => (
  <ul className="space-y-1.5">
    {(items || []).map((item, i) => (
      <li key={i} className={`flex items-start gap-2 text-xs ${color}`}>
        <span className="shrink-0 font-bold mt-0.5">{bullet}</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const EMPTY_RESULT = {
  overallScore: null,
  contactScore: 0, skillsScore: 0, projectsScore: 0,
  experienceScore: 0, educationScore: 0, keywordsScore: 0,
  summary: '', strengths: [], weaknesses: [], missingKeywords: [],
  suggestions: [], strongSections: [], weakSections: [],
  recruiterFeedback: '', suggestedProjects: [],
  suggestedCertifications: [], learningRoadmap: [],
};

export const AiResumeAnalyzer = () => {
  const [inputMode, setInputMode] = useState('pdf'); // 'pdf' or 'text'
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Full-Stack Software Engineer');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleRunAnalysis = async () => {
    if (inputMode === 'pdf' && !resumeFile) {
      setError('Please upload a PDF resume first!');
      return;
    }
    if (inputMode === 'text' && (!resumeText || resumeText.trim().length < 15)) {
      setError('Please paste your resume text (at least 15 characters)!');
      return;
    }

    setError('');
    setAnalyzing(true);
    try {
      let res, data;
      if (inputMode === 'pdf') {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('targetRole', targetRole);

        res = await fetch('/api/ai/score-resume-upload', {
          method: 'POST',
          body: formData,
        });
      } else {
        res = await fetch('/api/ai/score-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText, targetRole }),
        });
      }
      data = await res.json();
      if (data.success && data.analysis) {
        setResult(data.analysis);
      } else {
        setError(data.message || 'Analysis failed. Please try again.');
      }
    } catch (e) {
      setError('Could not connect to the server. Please check backend connection.');
    } finally {
      setAnalyzing(false);
    }
  };

  const score = result?.overallScore ?? null;
  const scoreColor = score === null ? '#6366f1' : score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444';
  const scoreLabel = score === null ? '' : score >= 70 ? '✨ Strong Resume' : score >= 45 ? '⚠️ Needs Work' : '🔴 Weak Resume';

  const CATEGORIES = [
    { label: 'Contact Info',  key: 'contactScore',    max: 10, color: '#6366f1' },
    { label: 'Skills Match',  key: 'skillsScore',     max: 20, color: '#8b5cf6' },
    { label: 'Projects',      key: 'projectsScore',   max: 20, color: '#ec4899' },
    { label: 'Experience',    key: 'experienceScore',  max: 20, color: '#f59e0b' },
    { label: 'Education',     key: 'educationScore',   max: 10, color: '#10b981' },
    { label: 'ATS Keywords',  key: 'keywordsScore',   max: 20, color: '#06b6d4' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header + Upload Panel */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/15 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
          {/* Score Ring (Center on Mobile) */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <ScoreRing score={score ?? 0} size={130} strokeWidth={11} />
            {result && (
              <span className="text-xs font-bold px-3 py-1 rounded-full border" style={{ color: scoreColor, borderColor: scoreColor + '50', background: scoreColor + '15' }}>
                {scoreLabel}
              </span>
            )}
            {!result && (
              <span className="text-xs text-slate-500 font-semibold">Upload or paste to score</span>
            )}
          </div>

          {/* Middle: Inputs */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 text-white shadow-glow shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-100">AI Resume Analyzer</h2>
                <p className="text-[11px] text-slate-400">Powered by Gemini AI · Dynamic ATS rubric</p>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full-Stack Software Engineer"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            {/* Input Mode Selector: PDF vs Text */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resume Source</label>
                <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/5 border border-white/10 text-[11px]">
                  <button
                    onClick={() => { setInputMode('pdf'); setError(''); }}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${inputMode === 'pdf' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    📄 PDF Upload
                  </button>
                  <button
                    onClick={() => { setInputMode('text'); setError(''); }}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${inputMode === 'text' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    ✍️ Paste Text
                  </button>
                </div>
              </div>

              {inputMode === 'pdf' ? (
                <div className="relative group w-full h-28 rounded-2xl bg-white/5 border-2 border-dashed border-white/20 hover:border-violet-500/60 hover:bg-white/8 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => { setResumeFile(e.target.files[0]); setResult(null); setError(''); }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {resumeFile ? (
                    <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                      <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-300 px-4 text-center truncate max-w-xs">{resumeFile.name}</span>
                      <span className="text-[10px] text-slate-500">Click to change file</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-slate-400 group-hover:text-violet-300 transition-colors pointer-events-none">
                      <Upload className="w-7 h-7" />
                      <span className="text-xs font-semibold">Click or drag PDF here</span>
                      <span className="text-[10px] text-slate-500">Max 5MB · PDF format</span>
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  rows={4}
                  value={resumeText}
                  onChange={(e) => { setResumeText(e.target.value); setResult(null); setError(''); }}
                  placeholder="Paste your resume content here (Skills, Projects, Education, Work Experience)..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-violet-500 transition leading-relaxed resize-none"
                />
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleRunAnalysis}
              disabled={analyzing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-extrabold text-xs sm:text-sm shadow-glow hover:scale-[1.01] transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
            >
              {analyzing ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Content...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> {result ? 'Re-Analyze Resume' : 'Analyze Resume Score'}</>
              )}
            </button>
          </div>

          {/* Right: Category Breakdown */}
          {result && (
            <div className="w-full lg:w-60 space-y-2.5 shrink-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Score Breakdown</p>
              {CATEGORIES.map((cat) => (
                <CategoryBar
                  key={cat.key}
                  label={cat.label}
                  score={result[cat.key] || 0}
                  max={cat.max}
                  color={cat.color}
                />
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Detailed Results */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recruiter Summary */}
          {result.recruiterFeedback && (
            <div className="lg:col-span-2 p-4 rounded-2xl bg-violet-500/10 border border-violet-500/25">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-violet-300" />
                <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">Recruiter's Perspective</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">{result.recruiterFeedback}</p>
            </div>
          )}

          {/* Strengths */}
          <Section icon={CheckCircle2} title="Key Strengths" color="bg-emerald-500/10 border-emerald-500/25 text-emerald-400" defaultOpen={true}>
            <ListItems items={result.strengths} bullet="✓" color="text-slate-300" />
          </Section>

          {/* Weaknesses */}
          <Section icon={AlertTriangle} title="Weak Points" color="bg-amber-500/10 border-amber-500/25 text-amber-400" defaultOpen={true}>
            <ListItems items={result.weaknesses} bullet="⚠" color="text-slate-300" />
          </Section>

          {/* Missing Keywords */}
          {result.missingKeywords?.length > 0 && (
            <Section icon={Key} title="Missing ATS Keywords" color="bg-purple-500/10 border-purple-500/25 text-purple-300" defaultOpen={true}>
              <div className="flex flex-wrap gap-2 pt-1">
                {result.missingKeywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-600/25 border border-purple-400/30 text-purple-200 text-xs font-semibold">
                    + {kw}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Suggestions */}
          <Section icon={Lightbulb} title="Actionable Suggestions" color="bg-sky-500/10 border-sky-500/25 text-sky-300">
            <ListItems items={result.suggestions} bullet="→" color="text-slate-300" />
          </Section>

          {/* Suggested Projects */}
          {result.suggestedProjects?.length > 0 && (
            <Section icon={Target} title="Suggested Portfolio Projects" color="bg-rose-500/10 border-rose-500/25 text-rose-300">
              <ListItems items={result.suggestedProjects} bullet="🚀" color="text-slate-300" />
            </Section>
          )}

          {/* Certifications */}
          {result.suggestedCertifications?.length > 0 && (
            <Section icon={Award} title="Suggested Certifications" color="bg-amber-500/10 border-amber-500/25 text-amber-300">
              <ListItems items={result.suggestedCertifications} bullet="🏆" color="text-slate-300" />
            </Section>
          )}

          {/* Learning Roadmap */}
          {result.learningRoadmap?.length > 0 && (
            <div className="lg:col-span-2">
              <Section icon={TrendingUp} title="Personalized Learning Roadmap" color="bg-indigo-500/10 border-indigo-500/25 text-indigo-300">
                <ol className="space-y-2 mt-1">
                  {result.learningRoadmap.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-slate-300">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500/30 border border-indigo-500/50 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </Section>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!result && !analyzing && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/25 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-violet-400" />
          </div>
          <p className="text-slate-400 font-semibold">Upload your resume above to get your personalized ATS score and AI feedback</p>
          <p className="text-slate-600 text-xs mt-1">Different resumes produce different scores based on content quality</p>
        </div>
      )}
    </div>
  );
};
