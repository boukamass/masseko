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
      className={`px-4 py-2 border-b flex items-center justify-between text-xs z-30 select-none transition-colors ${
        isFixora
          ? 'bg-white/95 backdrop-blur-md border-slate-300 text-slate-950'
          : 'bg-[#1C1C1E]/95 backdrop-blur-md border-slate-800 text-white'
      }`}
    >
      {/* Brand & City */}
      <div className="flex items-center gap-2">
        <span className="font-black text-sm tracking-wider text-emerald-700 dark:text-emerald-400">MASSEKO</span>
        <span className="text-xs font-black text-slate-800 dark:text-slate-200">Pointe-Noire</span>
      </div>

      {/* Controls & Status */}
      <div className="flex items-center gap-2">
        {/* Offline / Online Network Indicator */}
        <button
          type="button"
          onClick={() => {
            if (!isOnline) {
              syncPendingReports();
            } else {
              setIsOnline(false);
            }
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer shadow-xs min-h-[36px] ${
            isOnline
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black border border-amber-500'
          }`}
          title={
            isOnline
              ? 'Réseau 4G actif (Cliquer pour basculer en mode Hors-ligne terrain)'
              : 'Mode Hors-ligne terrain (Cliquer pour synchroniser en 4G)'
          }
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-white shrink-0" />
              <span>4G En Ligne</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span>Hors-ligne{pendingSyncCount > 0 ? ` (${pendingSyncCount})` : ''}</span>
            </>
          )}
        </button>

        {/* Theme mode toggle */}
        <button
          onClick={() => setThemeMode(isFixora ? 'forest' : 'fixora')}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
            isFixora ? 'bg-slate-100 text-slate-950 hover:bg-slate-200 border-2 border-slate-300' : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-600'
          }`}
          title="Basculer le thème clair / sombre"
          aria-label="Changer de thème"
        >
          {isFixora ? <Moon className="w-4 h-4 shrink-0" /> : <Sun className="w-4 h-4 shrink-0" />}
        </button>

        {/* User Avatar */}
        {currentUser ? (
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-teal-600 text-white text-xs font-black flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-xs"
            title={currentUser.fullName}
            aria-label="Mon profil"
          >
            {currentUser.fullName.charAt(0)}
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-slate-300 dark:border-slate-700"
            title="Connexion"
            aria-label="Connexion"
          >
            <User className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
