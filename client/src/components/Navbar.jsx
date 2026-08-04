import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Layers, MessageSquare, Sparkles, BarChart3, User, Bell,
  LogOut, RefreshCw, Zap,
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: 'swipe', label: 'Swipe', icon: Layers },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'ai-hub', label: 'AI Suite', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand */}
      <button
        onClick={() => setActiveTab('swipe')}
        className="flex items-center gap-3 group"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_28px_rgba(139,92,246,0.7)] transition-shadow">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
          SwipeHire
        </span>
      </button>

      {/* Nav Tabs — only show if logged in */}
      {user && (
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-1.5">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </nav>
      )}

      {/* Right side */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* Role badge */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              user.role === 'recruiter'
                ? 'bg-pink-500/10 border-pink-500/30 text-pink-300'
                : 'bg-violet-500/10 border-violet-500/30 text-violet-300'
            }`}>
              {user.role === 'recruiter' ? '🏢' : '🎓'} {user.role}
            </span>

            {/* Avatar / menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/[0.06] transition"
              >
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6d28d9&color=fff&size=80`}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover border-2 border-violet-500/40"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-slate-200 leading-none">{user.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-none truncate max-w-[120px]">{user.email}</div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0e0b1e] border border-white/10 rounded-2xl p-2 shadow-2xl z-50">
                  <button
                    onClick={() => { setActiveTab('profile'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/[0.06] transition"
                  >
                    <User className="w-4 h-4 text-violet-400" /> Edit Profile
                  </button>
                  <div className="my-1 border-t border-white/8" />
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/10 transition"
            >
              Sign In
            </button>
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all"
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (Screens < md) */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a071b]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around shadow-2xl">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                  active
                    ? 'text-pink-400 font-extrabold scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-pink-400' : 'text-slate-400'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};


