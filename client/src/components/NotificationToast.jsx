import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, X } from 'lucide-react';

export const NotificationToast = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        className="fixed top-20 right-6 z-50 max-w-sm glass-panel rounded-2xl p-4 border border-pink-500/40 shadow-glow flex items-start gap-3"
      >
        <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 shrink-0">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-slate-100">{notification.title}</h4>
          <p className="text-xs text-slate-300 mt-0.5">{notification.message}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
