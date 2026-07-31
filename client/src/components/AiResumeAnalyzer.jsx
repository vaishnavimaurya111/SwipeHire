import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle2, AlertTriangle, Key, RefreshCw, Upload } from 'lucide-react';

export const AiResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState(
    `Alex Chen | Full-Stack Software Engineer
Stanford CS Senior. Proficient in React, Node.js, TypeScript, Tailwind CSS, Python, MongoDB. Built 4 real-time Web & AI applications.`
  );
  const [targetRole, setTargetRole] = useState('Full-Stack Software Engineer');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState({
    score: 92,
    strengths: [
      'Strong proficiency in modern JavaScript, React 18, and Node.js REST APIs',
      'Demonstrated experience building real-time socket applications',
      'Clean project architecture with clear separation of frontend & backend',
    ],
    improvements: [
      'Quantify impact metrics in bullet points (e.g. "Reduced API latencies by 40%")',
      'Add Docker containerization and CI/CD deployment pipeline experience',
      'Include links to live deployed demo applications on Vercel/Render',
    ],
    missingKeywords: ['TypeScript Interfaces', 'GraphQL', 'Docker / Kubernetes', 'Jest Testing'],
    summary:
      'Excellent engineering profile. Adding explicit cloud deployment links and quantified performance metrics will boost resume score to 98%+',
  });

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/ai/score-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetRole }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setResult(data.analysis);
      }
    } catch (e) {
      console.warn('API error, using fallback analysis data');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 lg:p-8 border border-white/15 shadow-2xl">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-glow">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-100">AI Resume Analyzer & Score</h2>
            <p className="text-xs text-slate-400">Powered by Gemini 2.5 Flash AI Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-pink-400">{result.score}/100</span>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Top 5% Resume
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">Target Job Title</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">
              Resume Text or Highlights
            </label>
            <textarea
              rows={6}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-pink-500 leading-relaxed"
            />
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-extrabold text-xs shadow-glow hover:scale-[1.01] transition flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> AI Analyzing Resume...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Re-Analyze Resume Score
              </>
            )}
          </button>
        </div>

        {/* Right Output Feedback */}
        <div className="space-y-4">
          {/* Strengths */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4" /> Key Resume Strengths
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {result.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Improvements */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4" /> Recommended Improvements
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {result.improvements.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Keywords */}
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5 mb-2">
              <Key className="w-4 h-4" /> Suggested Industry Keywords to Add
            </h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {result.missingKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-purple-600/30 border border-purple-400/40 text-purple-200 text-xs font-semibold"
                >
                  + {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
