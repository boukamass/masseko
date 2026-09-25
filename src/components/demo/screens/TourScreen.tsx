import React from 'react';
import { 
  Truck, 
  ArrowUpDown, 
  Scale, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { REAL_COLLECTION_ROUTES } from '../../../data/mockPointeNoireData';
import { WasteReport } from '../../../types/koba';
import { TurtleIcon } from '../TurtleIcon';
import { DemoScreen } from '../MobileBottomNav';
import { ModernSelect } from '../ModernSelect';

interface TourScreenProps {
  selectedTourId: string;
  setSelectedTourId: (id: string) => void;
  reports: WasteReport[];
  selectedReportToCollect: WasteReport | null;
  setSelectedReportToCollect: (report: WasteReport | null) => void;
  weighInput: number;
  setWeighInput: (val: number) => void;
  handleValidateCollection: (reportId: string) => void;
  weighSuccess: boolean;
  isRouteOptimized: boolean;
  setIsRouteOptimized: (opt: boolean) => void;
  themeMode: 'forest' | 'fixora';
  setMobileScreen: (screen: DemoScreen) => void;
}

export const TourScreen: React.FC<TourScreenProps> = ({
  selectedTourId,
  setSelectedTourId,
  reports,
  selectedReportToCollect,
  setSelectedReportToCollect,
  weighInput,
  setWeighInput,
  handleValidateCollection,
  weighSuccess,
  isRouteOptimized,
  setIsRouteOptimized,
  themeMode,
  setMobileScreen,
}) => {
  const isFixora = themeMode === 'fixora';
  const currentTour =
    REAL_COLLECTION_ROUTES.find((t) => t.id === selectedTourId) || REAL_COLLECTION_ROUTES[0];

  const collectedReports = reports.filter(
    (r) => r.status === 'collected' || r.status === 'validated' || r.status === 'valorized'
  );
  const collectedCount = collectedReports.length;
  const progressPercent = Math.round((collectedCount / (reports.length || 1)) * 100);

  // Visually sort stops based on active route optimization filter
  const displayedReports = [...reports].sort((a, b) => {
    if (!isRouteOptimized) {
      // Emergency / Urgency order: Highest priority score first
      return (b.priorityScore || 0) - (a.priorityScore || 0);
    }
    // Route Optimized: Order by proximity/coastal corridor (latitude)
    return a.latitude - b.latitude;
  });

  return (
    <div className="space-y-3 pb-3">
      {/* 1. Sleek Compact Tour Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 flex items-center justify-center font-bold shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-950 dark:text-white leading-tight">
                Tournée de Collecte
              </h3>
              <span className="text-[10.5px] text-slate-700 dark:text-slate-300 font-bold">
                {currentTour.driverName} • {currentTour.vehicleType}
              </span>
            </div>
          </div>

          <span className="text-xs font-black text-slate-900 dark:text-slate-100 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2.5 py-1 rounded-xl shadow-2xs">
            {collectedCount}/{reports.length} faits ({progressPercent}%)
          </span>
        </div>

        {/* Route Selector Dropdown */}
        <ModernSelect
          value={selectedTourId}
          onChange={(val) => setSelectedTourId(val)}
          themeMode={themeMode}
          icon={<Truck className="w-3.5 h-3.5 text-sky-500" />}
          size="sm"
          options={REAL_COLLECTION_ROUTES.map((route) => ({
            value: route.id,
            label: `${route.code} — ${route.name}`,
            subtitle: `${route.zone} • ${route.distanceKm} km`,
            badge: `${route.distanceKm} km`,
            badgeColor: 'blue',
          }))}
        />
      </div>

      {/* 2. Fast Route Bar (Progress & 1-Click Optimization) */}
      <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-full bg-slate-300 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-sky-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsRouteOptimized(!isRouteOptimized)}
          className={`px-3 py-1.5 rounded-xl text-[10.5px] font-black flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-2xs ${
            isRouteOptimized
              ? 'bg-[#0A3D62] dark:bg-sky-600 text-white shadow-2xs'
              : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600'
          }`}
          title="Alterner l'ordre des arrêts"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>{isRouteOptimized ? 'Itinéraire Optimisé' : 'Ordre Urgence'}</span>
        </button>
      </div>

      {/* 3. Streamlined Stops List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Points d'Arrêt ({displayedReports.length})
          </span>
          <span className="text-[11px] font-black text-slate-800 dark:text-slate-200">
            {currentTour.distanceKm} km au total
          </span>
        </div>

        {displayedReports.map((r, index) => {
          const isSelected = selectedReportToCollect?.id === r.id;
          const isCollected =
            r.status === 'collected' || r.status === 'validated' || r.status === 'valorized';

          return (
            <div
              key={r.id}
              className={`p-3 rounded-2xl border transition-all text-xs ${
                isSelected
                  ? 'bg-sky-50 dark:bg-slate-800 border-sky-500 shadow-md ring-2 ring-sky-500/20'
                  : isCollected
                  ? 'bg-slate-100 dark:bg-slate-900/60 border-slate-300 dark:border-slate-800'
                  : isFixora
                  ? 'bg-white border-slate-300 text-slate-900 shadow-2xs hover:border-slate-400'
                  : 'bg-slate-900 border-slate-700 text-white shadow-2xs hover:border-slate-600'
              }`}
            >
              {/* Stop Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full font-black text-[11px] flex items-center justify-center shrink-0 shadow-2xs ${
                      isCollected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black'
                    }`}
                  >
                    {isCollected ? '✓' : index + 1}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs text-slate-950 dark:text-white truncate block">
                        {r.locationName}
                      </span>
                      {r.isNestingZone && (
                        <TurtleIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10.5px] text-slate-700 dark:text-slate-300 font-bold block truncate">
                      {r.wasteType.replace('_', ' ')} • Est. {r.estimatedWeightKg} kg
                    </span>
                  </div>
                </div>

                {/* Right Badge / Action */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isCollected ? (
                    <span className="text-[10.5px] font-black text-emerald-900 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full whitespace-nowrap shadow-2xs border border-emerald-300 dark:border-emerald-800">
                      {r.actualWeightKg || r.estimatedWeightKg} kg réels
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReportToCollect(isSelected ? null : r);
                        if (!isSelected) {
                          setWeighInput(r.estimatedWeightKg);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 shadow-2xs active:scale-95"
                    >
                      <Scale className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">{isSelected ? 'Fermer' : 'Peser'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Simplified Inline Weighing Box */}
              {isSelected && !isCollected && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-300 dark:border-slate-700 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-[11px] gap-2">
                    <span className="font-black text-slate-800 dark:text-slate-200 truncate">
                      Pesée connectée Bluetooth :
                    </span>
                    <span className="text-[10.5px] text-sky-700 dark:text-sky-300 font-mono font-bold whitespace-nowrap shrink-0">
                      Balance #MASSEKO-BT1
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        step="0.5"
                        value={weighInput}
                        onChange={(e) => setWeighInput(parseFloat(e.target.value) || 0)}
                        className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 font-black text-xs text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Ex: 24.5"
                      />
                      <span className="absolute right-3 top-2.5 text-[11px] font-black text-slate-600 dark:text-slate-400 pointer-events-none">
                        kg
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleValidateCollection(r.id)}
                      className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-black text-xs shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="whitespace-nowrap">{weighSuccess ? 'Validé !' : 'Valider Lot QR'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
