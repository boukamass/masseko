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
          <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5 leading-tight">
            <ScanLine className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>Scan & Diagnostic</span>
          </h3>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Traçabilité des lots et guide des matières
          </span>
        </div>

        {/* Mode Switch Pills */}
        <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-bold shrink-0">
          <button
            type="button"
            onClick={() => setScanScreenMode('qr_scanner')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              scanScreenMode === 'qr_scanner'
                ? 'bg-[#0A3D62] dark:bg-sky-600 text-white font-black shadow-2xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Scanner QR
          </button>
          <button
            type="button"
            onClick={() => setScanScreenMode('type_recognition')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              scanScreenMode === 'type_recognition'
                ? 'bg-[#0A3D62] dark:bg-sky-600 text-white font-black shadow-2xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Résines
          </button>
        </div>
      </div>

      {/* Mode 1: QR Scanner */}
      {scanScreenMode === 'qr_scanner' ? (
        <div className="space-y-3 animate-in fade-in">
          <div className="relative w-full h-64 bg-slate-950 rounded-3xl overflow-hidden border border-sky-500/30 shadow-inner flex flex-col items-center justify-between p-3 text-white">
            {/* Real QR graphic */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MASSEKO-2026-000127"
                alt="QR Code"
                className="w-32 h-32 bg-white p-2 rounded-xl shadow-lg border-2 border-sky-400"
              />
            </div>

            {/* Viewfinder Corners */}
            <div className="relative z-10 m-auto w-40 h-40 border-2 border-sky-400/80 rounded-2xl flex items-center justify-center bg-sky-500/10">
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-sky-400 rounded-tl-md"></div>
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-sky-400 rounded-tr-md"></div>
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-sky-400 rounded-bl-md"></div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-sky-400 rounded-br-md"></div>
              <span className="text-[9.5px] font-black bg-[#0A3D62] dark:bg-sky-600 text-white px-2 py-0.5 rounded-full shadow-md animate-pulse whitespace-nowrap">
                Détection MASSEKO-2026-000127
              </span>
            </div>

            {/* Bottom Scanned Result Overlay */}
            <div className="relative z-10 w-full bg-slate-950/85 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800 text-xs flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="font-black text-sky-400 block text-xs truncate">
                  Lot #MASSEKO-2026-000127
                </span>
                <span className="text-[10px] text-slate-300 block truncate">
                  183.5 kg PET • Songolo
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setScannedLotId('MASSEKO-2026-000127');
                  setMobileScreen('lot');
                }}
                className="bg-[#0284C7] hover:bg-[#0369A1] text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 shrink-0 cursor-pointer whitespace-nowrap"
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
                      ? 'bg-sky-50 dark:bg-slate-800 border-[#0284C7] ring-2 ring-sky-500/20'
                      : isFixora
                      ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {poly.code}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#0284C7] dark:text-sky-400 shrink-0" />}
                  </div>
                  <span className="text-xs font-bold mt-1 block truncate whitespace-nowrap">
                    {poly.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Polymer Card Details */}
          <div
            className={`p-3 rounded-2xl border space-y-2 text-xs ${
              isFixora
                ? 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                : 'bg-slate-900 border-slate-800 text-white shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 gap-2">
              <span className="font-extrabold text-xs truncate">
                {selectedPolymer.code} — {selectedPolymer.name}
              </span>
              <span className="text-[10px] font-black text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                {selectedPolymer.price}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-800 dark:text-white">Exemples :</strong> {selectedPolymer.examples}
            </p>

            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-[10.5px] text-red-900 dark:text-red-200 flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
              <span>{selectedPolymer.impact}</span>
            </div>

            <button
              type="button"
              onClick={() => setMobileScreen('report')}
              className="w-full h-9 px-3 rounded-xl bg-[#0A3D62] dark:bg-sky-600 hover:bg-[#082F4D] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <span className="whitespace-nowrap">Signaler ce type de plastique</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
