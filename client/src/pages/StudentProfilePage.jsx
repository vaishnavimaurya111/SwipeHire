import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AiResumeAnalyzer } from '../components/AiResumeAnalyzer';
import {
  User, Upload, Sparkles, Save, CheckCircle2,
  MapPin, DollarSign, Globe, Github, Linkedin, Edit3, Camera
} from 'lucide-react';

export const StudentProfilePage = () => {
  const { user, setUser, token } = useAuth();
  const [profileTab, setProfileTab] = useState('details');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Keep form in sync with user from context
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [location, setLocation] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Sync form fields whenever user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setTitle(user.title || '');
      setHeadline(user.headline || '');
      setBio(user.bio || '');
      setSkillsText((user.skills || []).join(', '));
      setLocation(user.location || '');
      setExpectedSalary(user.expectedSalary || '');
      setPortfolioUrl(user.portfolioUrl || '');
      setGithubUrl(user.githubUrl || '');
      setLinkedinUrl(user.linkedinUrl || '');
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    const updatedUser = {
      ...user,
      name,
      title,
      headline,
      bio,
      location,
      expectedSalary,
      portfolioUrl,
      githubUrl,
      linkedinUrl,
      skills: skillsText.split(',').map((s) => s.trim()).filter(Boolean),
    };

    // Try saving to backend
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(updatedUser);
      }
    } catch {
      setUser(updatedUser);
    }

    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
        {/* Banner gradient */}
        <div className="h-28 bg-gradient-to-r from-violet-900 via-fuchsia-900 to-pink-900" />
        <div className="absolute top-0 left-0 right-0 h-28 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.4),transparent)]" />

        <div className="px-6 pb-6 bg-[#0c0919]">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6d28d9&color=fff&size=128`}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-[#0c0919] shadow-xl"
              />
              <button className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition shadow-lg">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 pb-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-white">{user.name}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 border border-violet-500/40 text-violet-300 capitalize">
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-fuchsia-400 font-semibold mt-0.5 truncate">{user.title || 'Add your title...'}</p>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{user.headline || 'Add a headline...'}</p>
            </div>

            {/* Resume Score */}
            {user.resumeScore && (
              <div className="shrink-0 text-center px-5 py-3 rounded-2xl bg-gradient-to-br from-violet-600/20 to-pink-600/20 border border-white/10">
                <div className="text-3xl font-black text-white">{user.resumeScore}</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Resume Score</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'details', icon: User, label: 'Edit Profile' },
          { id: 'resume-ai', icon: Sparkles, label: 'AI Resume Score' },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setProfileTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              profileTab === id
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/8'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {profileTab === 'details' ? (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-[#0c0919] border border-white/8 rounded-3xl p-6 lg:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-violet-400" /> Profile Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:bg-white/[0.07] transition"
                />
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full-Stack Engineer"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:bg-white/[0.07] transition"
                />
              </div>

              {/* Headline */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. CS Senior @ Stanford | Building AI Apps"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:bg-white/[0.07] transition"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:bg-white/[0.07] transition"
                />
              </div>

              {/* Salary */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> Expected Salary
                </label>
                <input
                  type="text"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  placeholder="e.g. $120,000 - $150,000 / yr"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:bg-white/[0.07] transition"
                />
              </div>

              {/* Portfolio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Portfolio URL
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:bg-white/[0.07] transition"
                />
              </div>

              {/* GitHub */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Github className="w-3.5 h-3.5" /> GitHub URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/yourusername"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:bg-white/[0.07] transition"
                />
              </div>

              {/* LinkedIn */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourusername"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:bg-white/[0.07] transition"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skills & Tech Stack <span className="normal-case text-slate-500">(comma separated)</span></label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="React, Node.js, TypeScript, Python, MongoDB..."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:bg-white/[0.07] transition"
              />
              {skillsText && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {skillsText.split(',').map((s) => s.trim()).filter(Boolean).map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-violet-500/15 border border-violet-500/25 text-violet-300 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bio / About Me</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell recruiters about yourself, your passion, and what you're looking for..."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:bg-white/[0.07] transition resize-none"
              />
            </div>

            {/* Save Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/8">
              {savedSuccess && (
                <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" /> Profile saved!
                </span>
              )}
              {!savedSuccess && <span />}

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm shadow-lg shadow-violet-500/25 hover:scale-[1.02] hover:shadow-violet-500/40 transition-all disabled:opacity-60 disabled:scale-100"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </form>
      ) : (
        <AiResumeAnalyzer />
      )}
    </div>
  );
};
