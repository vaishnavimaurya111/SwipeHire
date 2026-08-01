import React from 'react';
import { Zap, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0a0618] pt-12 pb-8 mt-auto z-10 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Swipe<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Hire</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-pink-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-pink-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-pink-400 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-pink-400 hover:scale-110 transition-all text-slate-400">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-pink-400 hover:scale-110 transition-all text-slate-400">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-pink-400 hover:scale-110 transition-all text-slate-400">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-slate-500 font-medium tracking-wide">
          © {new Date().getFullYear()} SwipeHire. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
