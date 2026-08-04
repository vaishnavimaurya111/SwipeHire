import React, { useState } from 'react';
import { SwipeDeck } from '../components/SwipeDeck';
import { PlusCircle, Briefcase, Users, X, Inbox, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RecruiterDashboard = ({ onTriggerMatch, onOpenFit, setActiveTab }) => {
  const { user, logout } = useAuth();

  const [recruiterTab, setRecruiterTab] = useState('swipe-candidates');
  const [showPostModal, setShowPostModal] = useState(false);
  const [activeJobs, setActiveJobs] = useState([]);

  // Job Form state
  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState('Full-Time');
  const [workplaceType, setWorkplaceType] = useState('Remote');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [techStack, setTechStack] = useState('');
  const [description, setDescription] = useState('');
  const [postError, setPostError] = useState('');
  const [posting, setPosting] = useState(false);

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPosting(true);
    setPostError('');

    const payload = {
      title: jobTitle,
      company: user?.companyName || '',
      type: jobType,
      workplaceType,
      location,
      salary,
      techStack: techStack.split(',').map((s) => s.trim()).filter(Boolean),
      description,
    };

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('swipehire_token')}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.job) {
        setActiveJobs((prev) => [data.job, ...prev]);
        setShowPostModal(false);
        resetForm();
      } else {
        setPostError(data.message || 'Failed to post job');
      }
    } catch (err) {
      setPostError('Cannot connect to server.');
    } finally {
      setPosting(false);
    }
  };

  const resetForm = () => {
    setJobTitle(''); setTechStack(''); setDescription('');
    setLocation(''); setSalary('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">
            Recruiter Dashboard{' '}
            <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              {user?.companyName ? `— ${user.companyName}` : ''}
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Discover top candidates and manage your open roles.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition shadow-md"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Log Out</span>
          </button>

          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:scale-[1.02] transition"
          >
            <PlusCircle className="w-4 h-4" /> Post New Job
          </button>

          <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.07] rounded-2xl">
            {[
              { id: 'swipe-candidates', label: '🔥 Candidates' },
              { id: 'listings', label: '🏢 My Listings' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setRecruiterTab(id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  recruiterTab === id
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {recruiterTab === 'swipe-candidates' ? (
        <SwipeDeck onTriggerMatch={onTriggerMatch} onOpenFit={onOpenFit} />
      ) : (
        <div>
          {activeJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-300">No Active Job Postings</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Post your first job opening to start matching with qualified candidates.
              </p>
              <button
                onClick={() => setShowPostModal(true)}
                className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                Post a Job Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeJobs.map((job) => (
                <div key={job._id} className="bg-[#0c0919] border border-white/8 rounded-2xl p-5 space-y-3">
                  <h4 className="text-base font-bold text-white">{job.title}</h4>
                  <p className="text-sm text-fuchsia-400">{job.company}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{job.workplaceType}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                    {job.location && <><span>•</span><span>{job.location}</span></>}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                    <span className="text-xs text-slate-500">{job.applicantsCount || 0} applicants</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">Active</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0e0b1e] border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white">Post New Job Opening</h3>
              <button onClick={() => setShowPostModal(false)} className="p-2 rounded-xl hover:bg-white/[0.06] text-slate-400 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostJob} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Title *</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Full-Stack Software Engineer"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500 transition"
                  >
                    {['Full-Time', 'Internship', 'Part-Time', 'Contract'].map((t) => (
                      <option key={t} value={t} className="bg-[#0e0b1e]">{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workplace</label>
                  <select
                    value={workplaceType}
                    onChange={(e) => setWorkplaceType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500 transition"
                  >
                    {['Remote', 'Hybrid', 'On-Site'].map((t) => (
                      <option key={t} value={t} className="bg-[#0e0b1e]">{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Required Skills / Tech Stack</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="React, Node.js, TypeScript, AWS..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Salary Range</label>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. $120,000 - $150,000 / yr"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Description *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition resize-none"
                />
              </div>

              {postError && (
                <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {postError}
                </div>
              )}

              <button
                type="submit"
                disabled={posting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm shadow-lg hover:scale-[1.01] transition disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {posting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                Publish Job Posting
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
