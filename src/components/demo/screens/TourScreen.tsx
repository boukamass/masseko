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

  return (
    <div className="space-y-3 pb-3">
      {/* 1. Sleek Compact Tour Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                Tournée de Collecte
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {currentTour.driverName} • {currentTour.vehicleType}
              </span>
            </div>
          </div>

          <span className="text-xs font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-xl">
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
      <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#0284C7] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsRouteOptimized(!isRouteOptimized)}
          className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            isRouteOptimized
              ? 'bg-[#0A3D62] dark:bg-sky-600 text-white shadow-2xs'
              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
          }`}
          title="Alterner l'ordre des arrêts"
        >
          <ArrowUpDown className="w-3 h-3" />
          <span>{isRouteOptimized ? 'Itinéraire Optimisé' : 'Ordre Urgence'}</span>
        </button>
      </div>

      {/* 3. Streamlined Stops List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Points d'Arrêt ({reports.length})
          </span>
          <span className="text-[10px] text-slate-400">
            {currentTour.distanceKm} km au total
          </span>
        </div>

        {reports.map((r, index) => {
          const isSelected = selectedReportToCollect?.id === r.id;
          const isCollected =
            r.status === 'collected' || r.status === 'validated' || r.status === 'valorized';

          return (
            <div
              key={r.id}
              className={`p-3 rounded-2xl border transition-all text-xs ${
                isSelected
                  ? 'bg-sky-50/80 dark:bg-slate-800/90 border-sky-400 dark:border-sky-500 shadow-sm ring-1 ring-sky-500/20'
                  : isCollected
                  ? 'bg-slate-50/90 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 opacity-75'
                  : isFixora
                  ? 'bg-white border-slate-200 text-slate-800 shadow-2xs hover:border-slate-300'
                  : 'bg-slate-900 border-slate-800 text-white shadow-2xs hover:border-slate-700'
              }`}
            >
              {/* Stop Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full font-black text-[11px] flex items-center justify-center shrink-0 ${
                      isCollected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isCollected ? '✓' : index + 1}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate block">
                        {r.locationName}
                      </span>
                      {r.isNestingZone && (
                        <TurtleIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                      {r.wasteType.replace('_', ' ')} • Est. {r.estimatedWeightKg} kg
                    </span>
                  </div>
                </div>

                {/* Right Badge / Action */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isCollected ? (
                    <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950 px-2 py-0.5 rounded-full whitespace-nowrap">
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
                      className="px-2.5 py-1 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Scale className="w-3 h-3 shrink-0" />
                      <span className="whitespace-nowrap">{isSelected ? 'Fermer' : 'Peser'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Simplified Inline Weighing Box */}
              {isSelected && !isCollected && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-700/60 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-[11px] gap-2">
                    <span className="font-bold text-slate-600 dark:text-slate-300 truncate">
                      Pesée connectée Bluetooth :
                    </span>
                    <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono whitespace-nowrap shrink-0">
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
                        className="w-full h-9 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-black text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Ex: 24.5"
                      />
                      <span className="absolute right-3 top-2 text-[11px] font-bold text-slate-400 pointer-events-none">
                        kg
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleValidateCollection(r.id)}
                      className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-black text-xs shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
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
