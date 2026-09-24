import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Fast progress bar over ~1.4 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 35);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          onFinish();
        }, 400); // match exit fade
      }, 250);
      return () => clearTimeout(timeout);
    }
  }, [progress, onFinish]);

  const handleTapToSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onFinish();
    }, 250);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleTapToSkip}
          className="absolute inset-0 z-50 flex flex-col justify-between p-7 bg-[#061B29] text-white rounded-[40px] overflow-hidden select-none cursor-pointer"
        >
          {/* Subtle Ambient Background Halo */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          {/* Top Location Pill */}
          <div className="pt-2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-[10px] font-medium tracking-wider text-emerald-300 uppercase flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Pointe-Noire • Congo</span>
            </motion.div>
          </div>

          {/* Center Minimalist Emblem & Brand */}
          <div className="my-auto flex flex-col items-center text-center space-y-4">
            {/* Minimal Turtle Emblem */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm text-emerald-300"
            >
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 0-4 4v1a7 7 0 0 0-7 7v1a2 2 0 0 0 2 2h1a7 7 0 0 0 14 0h1a2 2 0 0 0 2-2v-1a7 7 0 0 0-7-7V6a4 4 0 0 0-4-4z" fill="currentColor" fillOpacity="0.2" />
                <circle cx="12" cy="11" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M12 6v10M7 11h10M8.5 7.5l7 7M15.5 7.5l-7 7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 11c-1.5-2-2.5-3-2-5s2.5-1 4 1" stroke="currentColor" strokeWidth="2" />
                <path d="M20 11c1.5-2 2.5-3 2-5s-2.5-1-4 1" stroke="currentColor" strokeWidth="2" />
                <path d="M6 17c-1 2-2 3.5-3 4s-2-1-1-3" stroke="currentColor" strokeWidth="2" />
                <path d="M18 17c1 2 2 3.5 3 4s2-1 1-3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-1"
            >
              <h1 className="text-2xl font-black tracking-[0.2em] text-white">
                MASSEKO
              </h1>
              <p className="text-[11px] font-medium text-slate-300 tracking-wide">
                Sauvegarde du Littoral & Tortues
              </p>
            </motion.div>
          </div>

          {/* Bottom Sleek Progress Line */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="pb-3 flex flex-col items-center space-y-2.5 w-full"
          >
            {/* Ultra-thin progress line */}
            <div className="w-28 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1BA9C5] to-emerald-400 rounded-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between w-full text-[9px] font-mono text-slate-400 px-2 opacity-70">
              <span>Mode Hors-Ligne</span>
              <span>{progress}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
