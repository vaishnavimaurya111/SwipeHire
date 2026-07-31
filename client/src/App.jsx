import React, { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { MatchModal } from './components/MatchModal';
import { AiCoverLetterModal } from './components/AiCoverLetterModal';
import { SkillGapModal } from './components/SkillGapModal';
import { NotificationToast } from './components/NotificationToast';

import { StudentDashboard } from './pages/StudentDashboard';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { MessagesPage } from './pages/MessagesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { AiHubPage } from './pages/AiHubPage';
import { AuthPage } from './pages/AuthPage';

import { useAuth } from './context/AuthContext';
import { useSocket } from './context/SocketContext';
import { Layers, Zap, Sparkles } from 'lucide-react';

export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('swipe');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Modals state
  const [activeMatch, setActiveMatch] = useState(null);
  const [fitJob, setFitJob] = useState(null);
  const [coverLetterJob, setCoverLetterJob] = useState(null);

  const { user, loading } = useAuth();
  const { notification, clearNotification } = useSocket();

  const handleStartChatFromMatch = () => {
    setActiveTab('messages');
  };

  if (loading && !showSplash) return null;

  return (
    <div className="min-h-screen bg-[#070412] text-slate-100 font-sans relative overflow-x-hidden selection:bg-violet-500 selection:text-white">
      {/* Opening Splash Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {!showSplash && (
        <div className="flex flex-col min-h-screen">
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenAuth={() => setShowAuthModal(true)}
          />

          <main className="flex-1">
            {!user ? (
              /* ---------- LANDING / NOT LOGGED IN ---------- */
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-16 text-center relative overflow-hidden">
                {/* Background orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-2xl mx-auto space-y-8">
                  {/* Logo */}
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500 shadow-[0_0_50px_rgba(139,92,246,0.5)] mb-2">
                    <Zap className="w-10 h-10 text-white fill-white" />
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-6xl md:text-7xl font-black tracking-tight">
                      <span className="text-white">Swipe</span>{' '}
                      <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                        Right
                      </span>{' '}
                      <span className="text-white">on Your</span>
                      <br />
                      <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                        Dream Career.
                      </span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
                      AI-powered job matching that feels like swiping on a dating app.
                      Connect with your next role or top talent — instantly.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:shadow-[0_0_45px_rgba(139,92,246,0.7)] hover:scale-[1.03] transition-all"
                    >
                      Get Started Free
                    </button>
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="px-8 py-4 rounded-2xl bg-white/[0.05] border border-white/10 text-white font-semibold text-lg hover:bg-white/[0.08] transition"
                    >
                      Sign In
                    </button>
                  </div>

                  {/* Feature pills */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    {['⚡ AI Resume Scoring', '❤️ Smart Job Matching', '💬 Real-Time Chat', '📊 Career Analytics'].map((f) => (
                      <span key={f} className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-slate-400">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ---------- LOGGED IN ---------- */
              <>
                {activeTab === 'swipe' &&
                  (user.role === 'recruiter' ? (
                    <RecruiterDashboard
                      onTriggerMatch={setActiveMatch}
                      onOpenFit={setFitJob}
                      setActiveTab={setActiveTab}
                    />
                  ) : (
                    <StudentDashboard
                      onTriggerMatch={setActiveMatch}
                      onOpenFit={setFitJob}
                      onOpenCoverLetter={setCoverLetterJob}
                      setActiveTab={setActiveTab}
                    />
                  ))}
                {activeTab === 'messages' && <MessagesPage />}
                {activeTab === 'ai-hub' && <AiHubPage />}
                {activeTab === 'analytics' && <AnalyticsPage />}
                {activeTab === 'profile' && <StudentProfilePage />}
              </>
            )}
          </main>

          <footer className="w-full py-5 border-t border-white/[0.06] text-center text-xs text-slate-600">
            SwipeHire – AI-Powered Job & Internship Matching Platform © 2026
          </footer>

          {/* Modals */}
          {activeMatch && (
            <MatchModal
              match={activeMatch}
              onClose={() => setActiveMatch(null)}
              onStartChat={() => { handleStartChatFromMatch(); setActiveMatch(null); }}
            />
          )}
          {fitJob && <SkillGapModal item={fitJob} onClose={() => setFitJob(null)} />}
          {coverLetterJob && <AiCoverLetterModal job={coverLetterJob} onClose={() => setCoverLetterJob(null)} />}

          {showAuthModal && <AuthPage onClose={() => setShowAuthModal(false)} />}

          <NotificationToast notification={notification} onClose={clearNotification} />
        </div>
      )}
    </div>
  );
}

export default App;
