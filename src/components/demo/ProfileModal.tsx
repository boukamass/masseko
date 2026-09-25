import React from 'react';
import { 
  X, 
  User, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  LogOut, 
  GraduationCap, 
  Truck, 
  Fish, 
  RotateCcw,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../../types/koba';
import { MOCK_USERS } from '../../data/mockPointeNoireData';
import { TurtleIcon } from './TurtleIcon';
import { DemoScreen } from './MobileBottomNav';

interface ProfileModalProps {
  currentUser: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onSwitchUser: (user: UserProfile) => void;
  setMobileScreen: (screen: DemoScreen) => void;
  themeMode: 'forest' | 'fixora';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onLogout,
  onSwitchUser,
  setMobileScreen,
  themeMode,
}) => {
  if (!isOpen) return null;

  const isFixora = themeMode === 'fixora';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div
        className={`w-full max-w-sm rounded-3xl border-2 shadow-2xl p-4 space-y-3.5 transition-all animate-in zoom-in-95 ${
          isFixora
            ? 'bg-white border-slate-300 text-slate-950'
            : 'bg-[#1C1C1E] border-slate-700 text-white'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-300 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-950 dark:text-white leading-none">
                Profil & Passeport Écocitoyen
              </h3>
              <span className="text-[11px] text-slate-800 dark:text-slate-200 font-bold">Masseko Pointe-Noire</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current User Card */}
        {currentUser ? (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-800 text-white space-y-2.5 shadow-md border border-blue-600">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/40 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  {currentUser.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-black text-sm leading-tight text-white">{currentUser.fullName}</h4>
                  <span className="text-[10.5px] text-blue-100 block font-bold">
                    {currentUser.levelName}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[9.5px] text-blue-100 block font-bold">Solde Éco-Points</span>
                <span className="text-xs font-black text-slate-950 bg-amber-400 border border-amber-300 px-2 py-0.5 rounded-lg shadow-2xs inline-block">
                  {currentUser.points} pts
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-blue-600/70 text-[10.5px]">
              <div className="flex items-center gap-1 text-white truncate font-bold">
                <MapPin className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                <span className="truncate">{currentUser.neighborhood}</span>
              </div>
              <div className="flex items-center gap-1 text-white truncate font-bold">
                <Phone className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                <span className="truncate">{currentUser.phone || 'Non renseigné'}</span>
              </div>
            </div>

            {currentUser.schoolName && (
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-amber-200 font-black">
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Établissement : {currentUser.schoolName}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100 text-xs">
            <span className="font-black">Vous êtes actuellement en Mode Invité.</span>
            <p className="text-[10.5px] text-amber-900 dark:text-amber-200 font-semibold mt-1">
              Connectez-vous pour accumuler des Éco-Points et enregistrer vos signalements officiels.
            </p>
          </div>
        )}

        {/* Switch Persona / Demo Account */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Changer d'utilisateur (Personas Démo)
            </span>
            <Award className="w-3.5 h-3.5 text-amber-600" />
          </div>

          <div className="space-y-1 max-h-36 overflow-y-auto pr-0.5 scrollbar-thin">
            {MOCK_USERS.map((u) => {
              const isActive = currentUser?.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    onSwitchUser(u);
                    onClose();
                  }}
                  className={`w-full p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/70 ring-1 ring-blue-500 text-slate-950 dark:text-white'
                      : isFixora
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-950 font-bold'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                      {u.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="font-black text-xs block truncate text-slate-950 dark:text-white">{u.fullName}</span>
                      <span className="text-[11px] text-slate-800 dark:text-slate-200 font-bold truncate block">{u.levelName}</span>
                    </div>
                  </div>

                  {isActive && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 font-black" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              onClose();
              setMobileScreen('education');
            }}
            className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <GraduationCap className="w-4.5 h-4.5 text-slate-950 shrink-0" />
            <span className="whitespace-nowrap">Académie Masseko & Quiz (+40 Pts)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              setMobileScreen('auth');
            }}
            className="w-full py-2.5 rounded-2xl bg-[#0052CC] hover:bg-[#00388A] text-white font-black text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Page Connexion / Inscription</span>
          </button>

          {currentUser && (
            <button
              onClick={() => {
                onLogout();
                onClose();
                setMobileScreen('auth');
              }}
              className="w-full py-2.5 rounded-2xl bg-red-100 hover:bg-red-200 dark:bg-red-950 dark:hover:bg-red-900 text-red-950 dark:text-red-100 border border-red-300 dark:border-red-800 font-black text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Se Déconnecter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
