import React, { useState } from 'react';
import { 
  ScanLine, 
  QrCode, 
  BookOpen, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Check
} from 'lucide-react';
import { DemoScreen } from '../MobileBottomNav';

interface ScanScreenProps {
  scanScreenMode: 'qr_scanner' | 'type_recognition';
  setScanScreenMode: (mode: 'qr_scanner' | 'type_recognition') => void;
  setMobileScreen: (screen: DemoScreen) => void;
  setScannedLotId: (id: string) => void;
  themeMode: 'forest' | 'fixora';
}

const POLYMER_GUIDES = [
  {
    id: 'pet_01',
    code: 'PET 01',
    name: 'Polyéthylène Téréphtalate',
    examples: 'Bouteilles d\'eau, sodas, barquettes transparentes',
    impact: 'Confusion létale avec les méduses chez les tortues marines.',
    price: '250 FCFA / kg',
    color: 'emerald'
  },
  {
    id: 'pehd_02',
    code: 'PEHD 02',
    name: 'Polyéthylène Haute Densité',
    examples: 'Bidons d\'huile, bouchons, bouteilles de détergent',
    impact: 'Fragmentation en micro-plastiques toxiques sur l\'estran.',
    price: '220 FCFA / kg',
    color: 'blue'
  },
  {
    id: 'nets_07',
    code: 'FILETS 07',
    name: 'Filets Fantômes & Cordages',
    examples: 'Engins de pêche abandonnés, tresses de chalutier',
    impact: 'Strangulation et noyade sous-marine des tortues femelles.',
    price: '180 FCFA / kg',
    color: 'red'
  },
  {
    id: 'pp_05',
    code: 'PP 05',
    name: 'Polypropylène Rigide',
    examples: 'Casiers, seaux, bouchons épais, bâches',
    impact: 'Obstacle physique bloquant les nouveau-nés vers la mer.',
    price: '200 FCFA / kg',
    color: 'amber'
  }
];

export const ScanScreen: React.FC<ScanScreenProps> = ({
  scanScreenMode,
  setScanScreenMode,
  setMobileScreen,
  setScannedLotId,
  themeMode,
}) => {
  const isFixora = themeMode === 'fixora';
  const [selectedPolymer, setSelectedPolymer] = useState(POLYMER_GUIDES[0]);

  return (
    <div className="space-y-3 pb-3">
      {/* 1. Header with Compact Mode Toggle */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-black text-base text-slate-950 dark:text-white flex items-center gap-2 leading-tight">
            <ScanLine className="w-5 h-5 text-blue-600 dark:text-sky-400 shrink-0" />
            <span>Scan & Diagnostic</span>
          </h3>
          <span className="text-xs text-slate-800 dark:text-slate-200 font-bold">
            Traçabilité des lots et guide des matières
          </span>
        </div>

        {/* Mode Switch Pills */}
        <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-2xl text-xs font-black shrink-0 border border-slate-300 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setScanScreenMode('qr_scanner')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] ${
              scanScreenMode === 'qr_scanner'
                ? 'bg-[#0052CC] text-white font-black shadow-xs'
                : 'text-slate-950 dark:text-slate-100 font-bold'
            }`}
          >
            Scanner QR
          </button>
          <button
            type="button"
            onClick={() => setScanScreenMode('type_recognition')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] ${
              scanScreenMode === 'type_recognition'
                ? 'bg-[#0052CC] text-white font-black shadow-xs'
                : 'text-slate-950 dark:text-slate-100 font-bold'
            }`}
          >
            Résines
          </button>
        </div>
      </div>

      {/* Mode 1: QR Scanner */}
      {scanScreenMode === 'qr_scanner' ? (
        <div className="space-y-3 animate-in fade-in">
          <div className="relative w-full h-72 bg-black rounded-3xl overflow-hidden border-2 border-blue-500/50 shadow-inner flex flex-col items-center justify-between p-3.5 text-white">
            {/* Real QR graphic */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MASSEKO-2026-000127"
                alt="QR Code"
                className="w-36 h-36 bg-white p-2.5 rounded-2xl shadow-xl border-2 border-blue-400"
              />
            </div>

            {/* Viewfinder Corners */}
            <div className="relative z-10 m-auto w-44 h-44 border-2 border-blue-400 rounded-2xl flex items-center justify-center bg-blue-500/10">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400 rounded-tl-md"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400 rounded-tr-md"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400 rounded-bl-md"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400 rounded-br-md"></div>
              <span className="text-[11px] font-black bg-[#0052CC] text-white px-3 py-1 rounded-full shadow-md animate-pulse whitespace-nowrap">
                Détection MASSEKO-2026-000127
              </span>
            </div>

            {/* Bottom Scanned Result Overlay */}
            <div className="relative z-10 w-full bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 text-xs flex items-center justify-between gap-2 shadow-lg">
              <div className="min-w-0">
                <span className="font-black text-sky-400 block text-xs sm:text-sm truncate">
                  Lot #MASSEKO-2026-000127
                </span>
                <span className="text-xs text-white font-bold block truncate mt-0.5">
                  183.5 kg PET • Songolo
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setScannedLotId('MASSEKO-2026-000127');
                  setMobileScreen('lot');
                }}
                className="h-11 bg-[#0052CC] hover:bg-[#00388A] active:scale-95 text-white text-xs font-black px-4 rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Ouvrir Fiche Lot</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Quick Resin Guide */
        <div className="space-y-3 animate-in fade-in">
          {/* 4 Quick Selector Chips */}
          <div className="grid grid-cols-2 gap-2.5">
            {POLYMER_GUIDES.map((poly) => {
              const isSelected = selectedPolymer.id === poly.id;
              return (
                <button
                  key={poly.id}
                  type="button"
                  onClick={() => setSelectedPolymer(poly)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[88px] ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 ring-2 ring-blue-500/30 shadow-xs'
                      : isFixora
                      ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-950 shadow-xs'
                      : 'bg-[#161618] hover:bg-slate-800 border-slate-700 text-white shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-slate-100 whitespace-nowrap border border-slate-300 dark:border-slate-700">
                      {poly.code}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0 font-black" />}
                  </div>
                  <span className="text-xs sm:text-sm font-black mt-1.5 block truncate whitespace-nowrap text-slate-950 dark:text-white">
                    {poly.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Polymer Card Details */}
          <div
            className={`p-4 rounded-2xl border space-y-3 text-xs shadow-md ${
              isFixora
                ? 'bg-white border-slate-300 text-slate-950'
                : 'bg-[#161618] border-slate-700 text-white'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-700 pb-2.5 gap-2">
              <span className="font-black text-sm truncate text-slate-950 dark:text-white">
                {selectedPolymer.code} — {selectedPolymer.name}
              </span>
              <span className="text-xs font-black text-white bg-blue-600 px-3 py-1 rounded-full whitespace-nowrap shrink-0 shadow-xs">
                {selectedPolymer.price}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              <strong className="text-slate-950 dark:text-white font-black">Exemples :</strong> {selectedPolymer.examples}
            </p>

            <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-700 text-xs text-rose-950 dark:text-rose-100 font-bold flex items-start gap-2 shadow-xs">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-700 dark:text-rose-300 shrink-0 mt-0.5" />
              <span>{selectedPolymer.impact}</span>
            </div>

            <button
              type="button"
              onClick={() => setMobileScreen('report')}
              className="w-full h-12 px-4 rounded-xl bg-[#0052CC] hover:bg-[#00388A] active:scale-95 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-md"
            >
              <span className="whitespace-nowrap">Signaler ce type de plastique</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
