import React, { useState, useEffect } from 'react';
import { StatCounter } from '../components/StatCounter';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  Heart,
  Eye,
  CheckCircle2,
  Award,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AnalyticsPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const role = user?.role || 'student';

  useEffect(() => {
    fetchAnalytics();
  }, [role]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/analytics?role=${role}`);
      const json = await res.json();
      if (json.success && json.analytics) {
        setData(json.analytics);
      }
    } catch (e) {
      console.warn('API analytics fallback');
    }
  };

  const studentWeekly = [
    { day: 'Mon', swipes: 14, matches: 4 },
    { day: 'Tue', swipes: 22, matches: 6 },
    { day: 'Wed', swipes: 18, matches: 5 },
    { day: 'Thu', swipes: 28, matches: 7 },
    { day: 'Fri', swipes: 12, matches: 3 },
    { day: 'Sat', swipes: 8, matches: 1 },
    { day: 'Sun', swipes: 10, matches: 2 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            Analytics & Performance Insights <BarChart3 className="w-6 h-6 text-pink-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time hiring funnel metrics, profile views, and swipe conversion rates.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ANIMATED STAT COUNTERS GRID */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-3xl p-5 border border-white/15 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/20 text-purple-400 shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              {role === 'student' ? 'Applications Sent' : 'Total Applicants'}
            </span>
            <span className="text-2xl font-black text-slate-100">
              <StatCounter endValue={role === 'student' ? 42 : 148} />
            </span>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-white/15 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-pink-500/20 text-pink-400 shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Matches</span>
            <span className="text-2xl font-black text-slate-100">
              <StatCounter endValue={role === 'student' ? 18 : 38} />
            </span>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-white/15 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              {role === 'student' ? 'Offer Rate' : 'Match Conversion'}
            </span>
            <span className="text-2xl font-black text-slate-100">
              <StatCounter endValue={role === 'student' ? 12 : 38.4} suffix="%" />
            </span>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-white/15 shadow-xl flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              {role === 'student' ? 'Profile Views' : 'Interviews Scheduled'}
            </span>
            <span className="text-2xl font-black text-slate-100">
              <StatCounter endValue={role === 'student' ? 215 : 24} />
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RECHARTS GRAPHS */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Area Chart */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-white/15 shadow-xl space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-pink-400" /> Weekly Activity & Matches Trajectory
          </h3>

          <div className="w-full h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studentWeekly}>
                <defs>
                  <linearGradient id="colorSwipes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#282250" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181432',
                    borderColor: '#3b2d6b',
                    borderRadius: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Area type="monotone" dataKey="swipes" stroke="#ec4899" fillOpacity={1} fill="url(#colorSwipes)" strokeWidth={3} />
                <Area type="monotone" dataKey="matches" stroke="#6366f1" fillOpacity={1} fill="url(#colorMatches)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel Breakdown */}
        <div className="glass-panel rounded-3xl p-6 border border-white/15 shadow-xl space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Conversion Funnel
          </h3>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Swipes Sent</span>
                <span className="text-pink-400 font-bold">100% (420)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Matches Formed</span>
                <span className="text-purple-400 font-bold">35.2% (148)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[35%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Interviews Scheduled</span>
                <span className="text-sky-400 font-bold">16.2% (24)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full w-[16%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Offers Extended</span>
                <span className="text-emerald-400 font-bold">4.0% (6)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[8%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
