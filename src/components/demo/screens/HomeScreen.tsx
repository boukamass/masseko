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
          <h2 className="font-black text-xl text-slate-950 dark:text-white leading-tight truncate">
            Bonjour, {displayName} 👋
          </h2>
        </div>

        {/* Points Pill */}
        <button
          type="button"
          onClick={() => (onOpenProfile ? onOpenProfile() : setMobileScreen('auth'))}
          className="px-3 py-1.5 rounded-2xl bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0 whitespace-nowrap min-h-[36px]"
          title="Mon profil & points"
        >
          <Award className="w-4 h-4 text-slate-950 shrink-0" />
          <span className="text-xs font-black whitespace-nowrap">{displayPoints} pts</span>
        </button>
      </div>

      {/* 2. Hero Primary Action: Signaler un Déchet (Apple iOS High-Contrast Banner) */}
      <div
        className={`p-4 rounded-3xl transition-all shadow-md relative overflow-hidden group ${
          isFixora
            ? 'bg-gradient-to-br from-[#0052CC] to-[#00388A] text-white border border-[#00388A]'
            : 'bg-[#161618] text-white border border-slate-700 shadow-lg'
        }`}
      >
        <div className="relative z-10 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-black uppercase tracking-wider bg-white/25 px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5 text-white whitespace-nowrap shrink-0 shadow-2xs">
              <TurtleIcon className="w-4 h-4 text-white shrink-0" />
              <span>Protection Côtière & Nids</span>
            </span>

            <span className="text-[11px] font-black text-white bg-black/50 px-3 py-0.5 rounded-full whitespace-nowrap shrink-0 border border-white/30">
              {isOnline ? 'GPS Actif' : 'Mode Hors-Ligne'}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black leading-snug text-white">
              Signaler un Déchet sur la Plage
            </h3>
            <p className="text-xs sm:text-sm text-white font-bold mt-1 leading-relaxed">
              Prenez une photo géolocalisée. Même sans connexion, vos données sont sécurisées.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMobileScreen('report')}
            className={`w-full h-12 rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer whitespace-nowrap ${
              isFixora
                ? 'bg-white text-[#00388A] hover:bg-slate-100'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            <Camera className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap">Prendre Photo & Signaler</span>
            <ArrowRight className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </div>

      {/* 3. Essential Modules Hub (Sleek 2x2 Grid) */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">
            Services & Outils
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Module 1: Carte Leaflet */}
          <button
            type="button"
            onClick={() => setMobileScreen('map')}
            className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between gap-2.5 group cursor-pointer ${
              isFixora
                ? 'bg-white border-slate-300 hover:border-slate-500 shadow-sm'
                : 'bg-[#161618] border-slate-700 hover:border-slate-500 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Map className="w-4.5 h-4.5 text-white" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-800 dark:text-slate-200 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="font-black text-sm text-slate-950 dark:text-white block truncate whitespace-nowrap">
                Carte des Nids
              </span>
              <span className="text-xs text-slate-800 dark:text-slate-200 font-bold block truncate whitespace-nowrap mt-0.5">
                {reports.length} points géolocalisés
              </span>
            </div>
          </button>

          {/* Module 2: Académie Masseko */}
          <button
            type="button"
            onClick={() => setMobileScreen('education')}
            className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between gap-2.5 group cursor-pointer ${
              isFixora
                ? 'bg-white border-slate-300 hover:border-slate-500 shadow-sm'
                : 'bg-[#161618] border-slate-700 hover:border-slate-500 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                <GraduationCap className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-[11px] font-black text-slate-950 bg-amber-400 px-2 py-0.5 rounded-md whitespace-nowrap shadow-2xs border border-amber-500">
                +40 pts
              </span>
            </div>
            <div>
              <span className="font-black text-sm text-slate-950 dark:text-white block truncate whitespace-nowrap">
                Académie Masseko
              </span>
              <span className="text-xs text-slate-800 dark:text-slate-200 font-bold block truncate whitespace-nowrap mt-0.5">
                Guide tortues & Quiz
              </span>
            </div>
          </button>

          {/* Module 3: Tournées & Pesée */}
          <button
            type="button"
            onClick={() => setMobileScreen('tour')}
            className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between gap-2.5 group cursor-pointer ${
              isFixora
                ? 'bg-white border-slate-300 hover:border-slate-500 shadow-sm'
                : 'bg-[#161618] border-slate-700 hover:border-slate-500 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Truck className="w-4.5 h-4.5 text-white" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-800 dark:text-slate-200 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="font-black text-sm text-slate-950 dark:text-white block truncate whitespace-nowrap">
                Tournée & Pesée
              </span>
              <span className="text-xs text-slate-800 dark:text-slate-200 font-bold block truncate whitespace-nowrap mt-0.5">
                {totalRealKg.toFixed(0)} kg collectés
              </span>
            </div>
          </button>

          {/* Module 4: Scan Diagnostic */}
          <button
            type="button"
            onClick={() => setMobileScreen('scan')}
            className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between gap-2.5 group cursor-pointer ${
              isFixora
                ? 'bg-white border-slate-300 hover:border-slate-500 shadow-sm'
                : 'bg-[#161618] border-slate-700 hover:border-slate-500 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
                <ScanLine className="w-4.5 h-4.5 text-white" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-800 dark:text-slate-200 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="font-black text-sm text-slate-950 dark:text-white block truncate whitespace-nowrap">
                Scanner & Résines
              </span>
              <span className="text-xs text-slate-800 dark:text-slate-200 font-bold block truncate whitespace-nowrap mt-0.5">
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
            <span className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>Alerte Littorale Récente</span>
            </span>
            <button
              type="button"
              onClick={() => setMobileScreen('map')}
              className="text-xs font-black text-blue-700 dark:text-blue-400 hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              Voir la carte
            </button>
          </div>

          <div
            onClick={() => {
              setSelectedMapPoint(latestAlert);
              setMobileScreen('map');
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between gap-3 ${
              isFixora
                ? 'bg-white border-slate-300 text-slate-950 shadow-sm'
                : 'bg-[#161618] border-slate-700 text-white shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 dark:border-slate-700 shadow-xs">
                <img
                  src={latestAlert.photoUrl}
                  alt={latestAlert.locationName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="font-black text-sm truncate block text-slate-950 dark:text-white">
                  {latestAlert.locationName}
                </span>
                <span className="text-xs text-slate-800 dark:text-slate-200 font-bold truncate block mt-0.5">
                  {latestAlert.isNestingZone ? 'Zone de ponte tortue active' : 'Déchets plastiques'}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span
                className={`text-[11px] font-black px-3 py-1 rounded-full whitespace-nowrap shadow-xs ${
                  latestAlert.priorityLevel === 'CRITIQUE'
                    ? 'bg-red-600 text-white'
                    : 'bg-amber-400 text-slate-950 border border-amber-500 font-black'
                }`}
              >
                {latestAlert.priorityLevel}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-800 dark:text-slate-200 shrink-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
