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
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center justify-center font-bold shrink-0 border border-blue-200 dark:border-blue-900 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-950 dark:text-white leading-tight">
                Tournée de Collecte
              </h3>
              <span className="text-xs text-slate-900 dark:text-slate-100 font-black">
                {currentTour.driverName} • {currentTour.vehicleType}
              </span>
            </div>
          </div>

          <span className="text-xs font-black text-slate-950 dark:text-white bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-xl shadow-xs">
            {collectedCount}/{reports.length} ({progressPercent}%)
          </span>
        </div>

        {/* Route Selector Dropdown */}
        <ModernSelect
          value={selectedTourId}
          onChange={(val) => setSelectedTourId(val)}
          themeMode={themeMode}
          icon={<Truck className="w-4 h-4 text-blue-600" />}
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
      <div className="p-3 rounded-2xl bg-white dark:bg-[#161618] border border-slate-300 dark:border-slate-700 flex items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsRouteOptimized(!isRouteOptimized)}
          className={`h-9 px-3.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-xs ${
            isRouteOptimized
              ? 'bg-[#0052CC] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white border border-slate-300 dark:border-slate-600'
          }`}
          title="Alterner l'ordre des arrêts"
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>{isRouteOptimized ? 'Itinéraire Optimisé' : 'Ordre Urgence'}</span>
        </button>
      </div>

      {/* 3. Streamlined Stops List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white">
            Points d'Arrêt ({displayedReports.length})
          </span>
          <span className="text-xs font-black text-slate-800 dark:text-slate-200">
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
              className={`p-3.5 rounded-2xl border transition-all text-xs ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                  : isCollected
                  ? 'bg-slate-100 dark:bg-slate-900/60 border-slate-300 dark:border-slate-800'
                  : isFixora
                  ? 'bg-white border-slate-300 text-slate-950 shadow-sm hover:border-slate-500'
                  : 'bg-[#161618] border-slate-700 text-white shadow-sm hover:border-slate-500'
              }`}
            >
              {/* Stop Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-full font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${
                      isCollected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white font-black'
                    }`}
                  >
                    {isCollected ? '✓' : index + 1}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs sm:text-sm text-slate-950 dark:text-white truncate block">
                        {r.locationName}
                      </span>
                      {r.isNestingZone && (
                        <TurtleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-slate-800 dark:text-slate-200 font-bold block truncate mt-0.5">
                      {r.wasteType.replace('_', ' ')} • Est. {r.estimatedWeightKg} kg
                    </span>
                  </div>
                </div>

                {/* Right Badge / Action */}
                <div className="flex items-center gap-2 shrink-0">
                  {isCollected ? (
                    <span className="text-xs font-black text-white bg-emerald-600 px-3 py-1 rounded-full whitespace-nowrap shadow-xs">
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
                      className="h-10 px-3.5 rounded-xl bg-[#0052CC] hover:bg-[#00388A] text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-xs active:scale-95"
                    >
                      <Scale className="w-4 h-4 shrink-0" />
                      <span className="whitespace-nowrap">{isSelected ? 'Fermer' : 'Peser'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Simplified Inline Weighing Box */}
              {isSelected && !isCollected && (
                <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-700 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-black text-slate-950 dark:text-white truncate">
                      Pesée connectée Bluetooth :
                    </span>
                    <span className="text-xs text-blue-700 dark:text-blue-300 font-mono font-bold whitespace-nowrap shrink-0">
                      Balance #MASSEKO-BT1
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        step="0.5"
                        value={weighInput}
                        onChange={(e) => setWeighInput(parseFloat(e.target.value) || 0)}
                        className="w-full h-12 px-3.5 rounded-xl bg-white dark:bg-black border-2 border-slate-300 dark:border-slate-600 font-black text-base text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                        placeholder="Ex: 24.5"
                      />
                      <span className="absolute right-3.5 top-3 text-xs font-black text-slate-800 dark:text-slate-200 pointer-events-none">
                        kg
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleValidateCollection(r.id)}
                      className="h-12 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
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
