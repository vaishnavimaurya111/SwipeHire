import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, User, Briefcase, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';

export const AuthPage = ({ onClose }) => {
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, companyName }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        login(data.user, data.token);
        if (onClose) onClose();
      } else {
        setError(data.message || 'Authentication failed. Check your credentials.');
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="relative w-full max-w-md overflow-hidden"
      >
        {/* Glow background blobs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative bg-[#0f0b1e]/95 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500 mb-4 shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              <Layers className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {isSignUp ? 'Join SwipeHire' : 'Welcome back'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {isSignUp ? 'Create your account to start swiping' : 'Sign in to your account'}
            </p>
          </div>

          {/* Role Selector */}
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/8 mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                role === 'student'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" /> Student
            </button>
            <button
              type="button"
              onClick={() => setRole('recruiter')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                role === 'recruiter'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" /> Recruiter
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:bg-white/[0.08] transition"
                />
              </div>
            )}

            {isSignUp && role === 'recruiter' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:bg-white/[0.08] transition"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:bg-white/[0.08] transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:bg-white/[0.08] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:scale-100"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-violet-400 font-semibold hover:text-violet-300 transition ml-1"
            >
              {isSignUp ? 'Sign in' : 'Sign up free'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
