import React from 'react';
import { Wifi, WifiOff, Sun, Moon, ShieldCheck, User, UserCheck, GraduationCap } from 'lucide-react';
import { UserProfile } from '../../types/koba';

interface MobileTopBarProps {
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  syncPendingReports: () => void;
  themeMode: 'forest' | 'fixora';
  setThemeMode: (mode: 'forest' | 'fixora') => void;
  pendingSyncCount: number;
  currentUser?: UserProfile | null;
  onOpenProfile?: () => void;
  onOpenAuth?: () => void;
  onOpenEducation?: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  isOnline,
  setIsOnline,
  syncPendingReports,
  themeMode,
  setThemeMode,
  pendingSyncCount,
  currentUser,
  onOpenProfile,
  onOpenAuth,
  onOpenEducation,
}) => {
  const isFixora = themeMode === 'fixora';

  return (
    <div
      className={`px-3.5 pt-2 pb-1.5 border-b flex items-center justify-between text-xs z-30 select-none transition-colors ${
        isFixora
          ? 'bg-white/95 backdrop-blur-md border-slate-200/90 text-slate-800'
          : 'bg-[#0B131F]/95 backdrop-blur-md border-slate-800/90 text-white'
      }`}
    >
      {/* Brand & User Status */}
      <div className="flex items-center gap-2 font-bold text-[11px] tracking-tight">
        <span className="font-black text-xs tracking-wider text-emerald-500">MASSEKO</span>
        <span className="text-[10px] opacity-40 font-mono">09:41</span>
      </div>

      {/* Dynamic Notch Center */}
      <div className="w-14 h-3 rounded-full bg-slate-900/90 shadow-inner flex items-center justify-center gap-1 px-1.5 shrink-0">
        <div className="w-1 h-1 rounded-full bg-slate-700"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-800 border border-slate-600"></div>
      </div>

      {/* Controls & Status */}
      <div className="flex items-center gap-1.5">
        {/* Offline / Online Network Indicator */}
        <button
          onClick={() => {
            if (!isOnline) {
              syncPendingReports();
            } else {
              setIsOnline(false);
            }
          }}
          className={`px-2 py-0.5 rounded-full text-[9.5px] font-extrabold flex items-center gap-1 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            isOnline
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40'
          }`}
          title={isOnline ? 'Réseau 4G actif' : 'Mode Hors-ligne'}
        >
          {isOnline ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>4G</span>
            </>
          ) : (
            <>
              <WifiOff className="w-2.5 h-2.5 text-amber-500 shrink-0" />
              <span>Hors-ligne</span>
            </>
          )}
        </button>

        {/* Theme mode toggle */}
        <button
          onClick={() => setThemeMode(isFixora ? 'forest' : 'fixora')}
          className={`p-1 rounded-full transition-colors shrink-0 cursor-pointer ${
            isFixora ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
          title="Basculer le thème clair / sombre"
        >
          {isFixora ? <Moon className="w-3 h-3 shrink-0" /> : <Sun className="w-3 h-3 shrink-0" />}
        </button>

        {/* User Avatar */}
        {currentUser ? (
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-5 h-5 rounded-full bg-teal-600 text-white text-[9px] font-black flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer"
            title={currentUser.fullName}
          >
            {currentUser.fullName.charAt(0)}
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer"
            title="Connexion"
          >
            <User className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
