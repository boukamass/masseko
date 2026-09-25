import React from 'react';
import { 
  Truck, 
  ArrowUpDown, 
  Scale, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  ChevronDown,
  Navigation
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
  setSelectedMapPoint?: (report: WasteReport | null) => void;
  weighInput: number;
  setWeighInput: (val: number) => void;
  handleValidateCollection: (reportId: string) => void;
  weighSuccess: boolean;
  isRouteOptimized: boolean;
  setIsRouteOptimized: (opt: boolean) => void;
  themeMode?: 'forest' | 'fixora';
  setMobileScreen: (screen: DemoScreen) => void;
}

export const TourScreen: React.FC<TourScreenProps> = ({
  selectedTourId,
  setSelectedTourId,
  reports,
  selectedReportToCollect,
  setSelectedReportToCollect,
  setSelectedMapPoint,
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
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900 shadow-xs">
              <Truck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                Tournée de Collecte
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                {currentTour.driverName} • {currentTour.vehicleType}
              </span>
            </div>
          </div>

          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-xl shadow-xs">
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

      {/* 2. Fast Route Bar */}
      <div className="p-3 rounded-2xl bg-white dark:bg-[#161618] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsRouteOptimized(!isRouteOptimized)}
          className={`h-8 px-3 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-xs ${
            isRouteOptimized
              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
          title="Alterner l'ordre des arrêts"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>{isRouteOptimized ? 'Itinéraire Optimisé' : 'Ordre Urgence'}</span>
        </button>
      </div>

      {/* 3. Streamlined Stops List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Points d'Arrêt ({displayedReports.length})
          </span>
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
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
                  ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                  : isCollected
                  ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
                  : isFixora
                  ? 'bg-white border-slate-200 text-slate-900 shadow-sm hover:border-slate-300'
                  : 'bg-[#161618] border-slate-800 text-white shadow-sm hover:border-slate-700'
              }`}
            >
              {/* Stop Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-full font-medium text-xs flex items-center justify-center shrink-0 shadow-xs ${
                      isCollected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isCollected ? '✓' : index + 1}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate block">
                        {r.locationName}
                      </span>
                      {r.isNestingZone && (
                        <TurtleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-normal block truncate mt-0.5">
                      {r.wasteType.replace('_', ' ')} • Est. {r.estimatedWeightKg} kg
                    </span>
                  </div>
                </div>

                {/* Right Badge / Action */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {!isCollected && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMapPoint?.(r);
                        setMobileScreen('map');
                      }}
                      className="h-9 px-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-medium transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 shadow-2xs active:scale-95"
                      title="Tracer la route GPS jusqu'au déchet"
                    >
                      <Navigation className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>Itinéraire</span>
                    </button>
                  )}

                  {isCollected ? (
                    <span className="text-xs font-medium text-white bg-emerald-600 px-2.5 py-1 rounded-full whitespace-nowrap shadow-xs">
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
                      className="h-9 px-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-xs active:scale-95"
                    >
                      <Scale className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">{isSelected ? 'Fermer' : 'Peser'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Simplified Inline Weighing Box */}
              {isSelected && !isCollected && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                      Pesée de la collecte :
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-medium whitespace-nowrap shrink-0">
                      Balance #01
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        step="0.5"
                        value={weighInput}
                        onChange={(e) => setWeighInput(parseFloat(e.target.value) || 0)}
                        className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-black border border-slate-300 dark:border-slate-700 font-semibold text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                        placeholder="Ex: 24.5"
                      />
                      <span className="absolute right-3.5 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">
                        kg
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleValidateCollection(r.id)}
                      className="h-11 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
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
