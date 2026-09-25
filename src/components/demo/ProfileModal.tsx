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
  onOpenTechnicalDocs?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onLogout,
  onSwitchUser,
  setMobileScreen,
  themeMode,
  onOpenTechnicalDocs,
}) => {
  if (!isOpen) return null;

  const isFixora = themeMode === 'fixora';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div
        className={`w-full max-w-sm rounded-3xl border shadow-2xl p-4 space-y-3.5 transition-all animate-in zoom-in-95 ${
          isFixora
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black text-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white leading-none">
                Profil & Passeport Écocitoyen
              </h3>
              <span className="text-[10px] text-slate-400">Masseko Pointe-Noire</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current User Card */}
        {currentUser ? (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0A3D62] to-[#0F2338] text-white space-y-2.5 shadow-md border border-cyan-500/25">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-black text-sm">
                  {currentUser.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-black text-sm leading-tight">{currentUser.fullName}</h4>
                  <span className="text-[10px] text-cyan-200 block font-bold">
                    {currentUser.levelName}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[9px] text-cyan-200 block">Solde Éco-Points</span>
                <span className="text-sm font-black text-amber-300">{currentUser.points} pts</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-cyan-700/50 text-[10px]">
              <div className="flex items-center gap-1 text-cyan-100 truncate">
                <MapPin className="w-3 h-3 text-cyan-300 shrink-0" />
                <span className="truncate">{currentUser.neighborhood}</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-100 truncate">
                <Phone className="w-3 h-3 text-cyan-300 shrink-0" />
                <span className="truncate">{currentUser.phone || 'Non renseigné'}</span>
              </div>
            </div>

            {currentUser.schoolName && (
              <div className="flex items-center gap-1.5 pt-1 text-[10.5px] text-amber-200 font-bold">
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Établissement : {currentUser.schoolName}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
            <span className="font-bold">Vous êtes actuellement en Mode Invité.</span>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1">
              Connectez-vous pour accumuler des Éco-Points et enregistrer vos signalements officiels.
            </p>
          </div>
        )}

        {/* Switch Persona / Demo Account */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Changer d'utilisateur (Personas Démo)
            </span>
            <Award className="w-3.5 h-3.5 text-amber-500" />
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
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 ring-1 ring-sky-500/40'
                      : isFixora
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {u.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs block truncate">{u.fullName}</span>
                      <span className="text-[9px] text-slate-400 truncate block">{u.levelName}</span>
                    </div>
                  </div>

                  {isActive && <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />}
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
            className="w-full py-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 border border-amber-500/40 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Académie Masseko & Quiz (+40 Pts)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              setMobileScreen('auth');
            }}
            className="w-full py-2.5 rounded-2xl bg-[#0A3D62] dark:bg-sky-600 hover:bg-[#082F4D] text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Page Connexion / Inscription</span>
          </button>

          {currentUser && (
            <button
              onClick={() => {
                onLogout();
                onClose();
                setMobileScreen('auth');
              }}
              className="w-full py-2 rounded-2xl bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950 text-slate-700 hover:text-red-700 dark:text-slate-300 dark:hover:text-red-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Se Déconnecter</span>
            </button>
          )}

          {onOpenTechnicalDocs && (
            <button
              onClick={() => {
                onClose();
                onOpenTechnicalDocs();
              }}
              className="w-full py-1.5 text-center text-[10.5px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors pt-1 cursor-pointer"
            >
              ⚙️ Spécifications Techniques & Schéma SQL (Pour Développeurs)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
