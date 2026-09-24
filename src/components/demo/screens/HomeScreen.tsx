import React from 'react';
import { 
  Camera, 
  Map, 
  ScanLine, 
  Truck, 
  ChevronRight, 
  Award, 
  GraduationCap, 
  MapPin,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { WasteReport, UserProfile } from '../../../types/koba';
import { TurtleIcon } from '../TurtleIcon';
import { DemoScreen } from '../MobileBottomNav';

interface HomeScreenProps {
  reports: WasteReport[];
  setMobileScreen: (screen: DemoScreen) => void;
  setSelectedMapPoint: (report: WasteReport) => void;
  themeMode: 'forest' | 'fixora';
  isOnline: boolean;
  currentUser?: UserProfile | null;
  onOpenProfile?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  reports,
  setMobileScreen,
  setSelectedMapPoint,
  themeMode,
  isOnline,
  currentUser,
  onOpenProfile,
}) => {
  const isFixora = themeMode === 'fixora';

  const collectedReports = reports.filter(
    (r) => r.status === 'collected' || r.status === 'validated' || r.status === 'valorized'
  );
  const totalRealKg = collectedReports.reduce((sum, r) => sum + (r.actualWeightKg || 0), 0);
  const criticalReports = reports.filter((r) => r.priorityLevel === 'CRITIQUE');
  const latestAlert = criticalReports[0] || reports[0];

  const displayName = currentUser ? currentUser.fullName.split(' ')[0] : 'Sentinelle';
  const displayPoints = currentUser ? currentUser.points : 0;

  return (
    <div className="space-y-4 pb-3">
      {/* 1. Sleek Minimalist Header */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <div className="min-w-0">
          <span className="text-[10px] text-slate-400 dark:text-emerald-400 font-extrabold uppercase tracking-wider block truncate">
            Littoral Pointe-Noire
          </span>
          <h2 className="font-black text-lg text-slate-900 dark:text-white leading-tight truncate">
            Bonjour, {displayName} 👋
          </h2>
        </div>

        {/* Points Pill */}
        <button
          type="button"
          onClick={() => (onOpenProfile ? onOpenProfile() : setMobileScreen('auth'))}
          className="px-2.5 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
          title="Mon profil & points"
        >
          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-xs font-black whitespace-nowrap">{displayPoints} pts</span>
        </button>
      </div>

      {/* 2. Hero Primary Action: Signaler un Déchet (Clear & High-Impact) */}
      <div
        className={`p-4 rounded-3xl transition-all shadow-md relative overflow-hidden group ${
          isFixora
            ? 'bg-gradient-to-br from-[#0A3D62] via-[#0E5180] to-[#125B8D] text-white'
            : 'bg-gradient-to-br from-[#0F2942] via-[#0D2137] to-[#0A192C] text-white border border-cyan-500/30'
        }`}
      >
        {/* Subtle oceanic glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[9.5px] font-black uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 text-cyan-200 whitespace-nowrap shrink-0">
              <TurtleIcon className="w-3 h-3 text-cyan-300 shrink-0" />
              <span>Protection Côtière & Nids</span>
            </span>

            <span className="text-[10px] font-bold text-cyan-200 whitespace-nowrap shrink-0">
              {isOnline ? 'GPS Actif' : 'Mode Hors-Ligne'}
            </span>
          </div>

          <div>
            <h3 className="text-base font-black leading-snug truncate">
              Signaler un Déchet sur la Plage
            </h3>
            <p className="text-xs text-cyan-100/80 mt-0.5 leading-relaxed">
              Prenez une photo géolocalisée. Même sans connexion, vos données sont sécurisées.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMobileScreen('report')}
            className="w-full py-2.5 px-3 rounded-2xl bg-white text-[#0A3D62] font-black text-xs shadow-lg flex items-center justify-center gap-2 hover:bg-slate-100 active:scale-98 transition-all cursor-pointer whitespace-nowrap"
          >
            <Camera className="w-4 h-4 text-[#0284C7] shrink-0" />
            <span className="whitespace-nowrap">Prendre Photo & Signaler</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
          </button>
        </div>
      </div>

      {/* 3. Essential Modules Hub (Sleek 2x2 Grid) */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-[10.5px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider">
            Services & Outils
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Module 1: Carte Leaflet */}
          <button
            type="button"
            onClick={() => setMobileScreen('map')}
            className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between gap-2 group cursor-pointer ${
              isFixora
                ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Map className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-slate-900 dark:text-white block truncate whitespace-nowrap">
                Carte des Nids
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate whitespace-nowrap">
                {reports.length} points géolocalisés
              </span>
            </div>
          </button>

          {/* Module 2: Académie Masseko */}
          <button
            type="button"
            onClick={() => setMobileScreen('education')}
            className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between gap-2 group cursor-pointer ${
              isFixora
                ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded-md whitespace-nowrap">
                +40 pts
              </span>
            </div>
            <div>
              <span className="font-extrabold text-xs text-slate-900 dark:text-white block truncate whitespace-nowrap">
                Académie Masseko
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate whitespace-nowrap">
                Guide tortues & Quiz
              </span>
            </div>
          </button>

          {/* Module 3: Tournées & Pesée */}
          <button
            type="button"
            onClick={() => setMobileScreen('tour')}
            className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between gap-2 group cursor-pointer ${
              isFixora
                ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-slate-900 dark:text-white block truncate whitespace-nowrap">
                Tournée & Pesée
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate whitespace-nowrap">
                {totalRealKg.toFixed(0)} kg collectés
              </span>
            </div>
          </button>

          {/* Module 4: Scan Diagnostic */}
          <button
            type="button"
            onClick={() => setMobileScreen('scan')}
            className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between gap-2 group cursor-pointer ${
              isFixora
                ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <ScanLine className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-slate-900 dark:text-white block truncate whitespace-nowrap">
                Scanner & Résines
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate whitespace-nowrap">
                Diagnostic & QR Lots
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Priorité Côtière En Direct (Single Sleek Hotspot Card) */}
      {latestAlert && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10.5px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
              <ShieldAlert className="w-3 h-3 text-red-500 shrink-0" />
              <span>Alerte Littorale Récente</span>
            </span>
            <button
              type="button"
              onClick={() => setMobileScreen('map')}
              className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              Voir la carte
            </button>
          </div>

          <div
            onClick={() => {
              setSelectedMapPoint(latestAlert);
              setMobileScreen('map');
            }}
            className={`p-3 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between gap-3 ${
              isFixora
                ? 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                : 'bg-slate-900 border-slate-800 text-white shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 dark:border-slate-700">
                <img
                  src={latestAlert.photoUrl}
                  alt={latestAlert.locationName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-xs truncate block text-slate-900 dark:text-white">
                  {latestAlert.locationName}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block mt-0.5">
                  {latestAlert.isNestingZone ? 'Zone de ponte tortue active' : 'Déchets plastiques'}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1.5">
              <span
                className={`text-[9.5px] font-black px-2 py-0.5 rounded-full whitespace-nowrap ${
                  latestAlert.priorityLevel === 'CRITIQUE'
                    ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {latestAlert.priorityLevel}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
