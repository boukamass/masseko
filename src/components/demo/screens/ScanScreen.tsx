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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-sm text-slate-950 dark:text-white flex items-center gap-1.5 leading-tight">
            <ScanLine className="w-4 h-4 text-sky-700 dark:text-sky-400 shrink-0" />
            <span>Scan & Diagnostic</span>
          </h3>
          <span className="text-[10.5px] text-slate-700 dark:text-slate-300 font-bold">
            Traçabilité des lots et guide des matières
          </span>
        </div>

        {/* Mode Switch Pills */}
        <div className="flex items-center p-0.5 bg-slate-200 dark:bg-slate-800 rounded-xl text-[10.5px] font-black shrink-0 border border-slate-300 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setScanScreenMode('qr_scanner')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              scanScreenMode === 'qr_scanner'
                ? 'bg-[#0A3D62] dark:bg-sky-600 text-white font-black shadow-2xs'
                : 'text-slate-800 dark:text-slate-200'
            }`}
          >
            Scanner QR
          </button>
          <button
            type="button"
            onClick={() => setScanScreenMode('type_recognition')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              scanScreenMode === 'type_recognition'
                ? 'bg-[#0A3D62] dark:bg-sky-600 text-white font-black shadow-2xs'
                : 'text-slate-800 dark:text-slate-200'
            }`}
          >
            Résines
          </button>
        </div>
      </div>

      {/* Mode 1: QR Scanner */}
      {scanScreenMode === 'qr_scanner' ? (
        <div className="space-y-3 animate-in fade-in">
          <div className="relative w-full h-64 bg-slate-950 rounded-3xl overflow-hidden border-2 border-sky-500/40 shadow-inner flex flex-col items-center justify-between p-3 text-white">
            {/* Real QR graphic */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MASSEKO-2026-000127"
                alt="QR Code"
                className="w-32 h-32 bg-white p-2 rounded-xl shadow-lg border-2 border-sky-400"
              />
            </div>

            {/* Viewfinder Corners */}
            <div className="relative z-10 m-auto w-40 h-40 border-2 border-sky-400 rounded-2xl flex items-center justify-center bg-sky-500/10">
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-sky-400 rounded-tl-md"></div>
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-sky-400 rounded-tr-md"></div>
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-sky-400 rounded-bl-md"></div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-sky-400 rounded-br-md"></div>
              <span className="text-[10px] font-black bg-[#0A3D62] text-white px-2.5 py-0.5 rounded-full shadow-md animate-pulse whitespace-nowrap">
                Détection MASSEKO-2026-000127
              </span>
            </div>

            {/* Bottom Scanned Result Overlay */}
            <div className="relative z-10 w-full bg-slate-950/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-700 text-xs flex items-center justify-between gap-2 shadow-md">
              <div className="min-w-0">
                <span className="font-black text-sky-400 block text-xs truncate">
                  Lot #MASSEKO-2026-000127
                </span>
                <span className="text-[10.5px] text-slate-200 font-bold block truncate">
                  183.5 kg PET • Songolo
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setScannedLotId('MASSEKO-2026-000127');
                  setMobileScreen('lot');
                }}
                className="bg-[#0284C7] hover:bg-[#0369A1] active:scale-95 text-white text-[11px] font-black px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1 shrink-0 cursor-pointer whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Ouvrir Fiche Lot</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Quick Resin Guide */
        <div className="space-y-3 animate-in fade-in">
          {/* 4 Quick Selector Chips */}
          <div className="grid grid-cols-2 gap-2">
            {POLYMER_GUIDES.map((poly) => {
              const isSelected = selectedPolymer.id === poly.id;
              return (
                <button
                  key={poly.id}
                  type="button"
                  onClick={() => setSelectedPolymer(poly)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-slate-800 border-sky-500 ring-2 ring-sky-500/20 shadow-xs'
                      : isFixora
                      ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900 shadow-2xs'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-slate-100 whitespace-nowrap border border-slate-300 dark:border-slate-700">
                      {poly.code}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#0284C7] dark:text-sky-400 shrink-0 font-black" />}
                  </div>
                  <span className="text-xs font-black mt-1 block truncate whitespace-nowrap text-slate-950 dark:text-white">
                    {poly.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Polymer Card Details */}
          <div
            className={`p-3.5 rounded-2xl border space-y-2.5 text-xs ${
              isFixora
                ? 'bg-white border-slate-300 text-slate-900 shadow-md'
                : 'bg-slate-900 border-slate-700 text-white shadow-md'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2 gap-2">
              <span className="font-black text-xs truncate text-slate-950 dark:text-white">
                {selectedPolymer.code} — {selectedPolymer.name}
              </span>
              <span className="text-[10.5px] font-black text-sky-950 dark:text-sky-100 bg-sky-200 dark:bg-sky-900/80 border border-sky-300 dark:border-sky-700 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 shadow-2xs">
                {selectedPolymer.price}
              </span>
            </div>

            <p className="text-[11.5px] text-slate-800 dark:text-slate-200 leading-relaxed">
              <strong className="text-slate-950 dark:text-white font-black">Exemples :</strong> {selectedPolymer.examples}
            </p>

            <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 text-[11px] text-red-950 dark:text-red-100 font-bold flex items-start gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <span>{selectedPolymer.impact}</span>
            </div>

            <button
              type="button"
              onClick={() => setMobileScreen('report')}
              className="w-full h-10 px-3 rounded-xl bg-[#0A3D62] dark:bg-sky-600 hover:bg-[#082F4D] active:scale-95 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
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
