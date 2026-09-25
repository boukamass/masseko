import React from 'react';
import { 
  QrCode, 
  CheckCircle2, 
  Scale, 
  Building2, 
  Calendar 
} from 'lucide-react';
import { mockLots, mockRecyclers } from '../../../data/mockPointeNoireData';
import { DemoScreen } from '../MobileBottomNav';
import { ModernSelect } from '../ModernSelect';

interface LotScreenProps {
  scannedLotId: string;
  selectedRecyclerId: string;
  setSelectedRecyclerId: (id: string) => void;
  themeMode: 'forest' | 'fixora';
  setMobileScreen: (screen: DemoScreen) => void;
}

export const LotScreen: React.FC<LotScreenProps> = ({
  scannedLotId,
  selectedRecyclerId,
  setSelectedRecyclerId,
  themeMode,
  setMobileScreen,
}) => {
  const isFixora = themeMode === 'fixora';
  const lot = mockLots[0];

  return (
    <div className="space-y-3 pb-2">
      {/* Passport Badge Header */}
      <div className="p-3.5 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-2xl flex items-center justify-between text-xs shadow-sm border border-blue-600">
        <div>
          <span className="font-mono text-xs font-black text-white block tracking-wider">
            LOT #{scannedLotId || 'MASSEKO-2026-000127'}
          </span>
          <span className="text-[10.5px] text-blue-100 flex items-center gap-1 mt-0.5 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span>Passeport Numérique Certifié MASSEKO</span>
          </span>
        </div>
        <span className="bg-white text-blue-900 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
          Vérifié & Conforme
        </span>
      </div>

      {/* QR Code Container */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-300 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center space-y-2">
        <div className="relative p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-xs">
          <img
            src={lot.qrCodeUrl}
            alt="QR Code Passport"
            className="w-32 h-32 bg-white p-1.5 rounded-xl shadow-inner border border-slate-200"
          />
          <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <span className="text-xs text-slate-800 dark:text-slate-200 font-black">
          Scannez pour vérifier la traçabilité
        </span>
      </div>

      {/* Lot Details Card */}
      <div
        className={`p-3.5 rounded-2xl border text-xs space-y-2.5 ${
          isFixora
            ? 'bg-white border-slate-300 text-slate-950 shadow-sm'
            : 'bg-slate-900 border-slate-700 text-white shadow-sm'
        }`}
      >
        <span className="font-black text-xs text-slate-950 dark:text-white block border-b border-slate-200 dark:border-slate-800 pb-1.5 uppercase tracking-wide">
          Détails du Lot Certifié
        </span>

        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between items-center">
            <span className="text-slate-800 dark:text-slate-200 font-bold">Poids Réel Certifié :</span>
            <span className="font-black text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800 text-xs">
              {lot.actualWeightKg} kg
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-800 dark:text-slate-200 font-bold">Matière Polymère :</span>
            <span className="font-black text-slate-950 dark:text-white">PET 01 (Bouteilles)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-800 dark:text-slate-200 font-bold">Origine Littorale :</span>
            <span className="font-black text-right text-[10.5px] text-slate-950 dark:text-white">Côte Sauvage & Songolo</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-800 dark:text-slate-200 font-bold">Collecteur Agréé :</span>
            <span className="font-black text-slate-950 dark:text-white">Jean-Baptiste Mabiala</span>
          </div>

          {/* Recycler Destination Dropdown */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <ModernSelect
              label="Recycleur Destinataire :"
              value={selectedRecyclerId}
              onChange={(val) => setSelectedRecyclerId(val)}
              themeMode={themeMode}
              icon={<Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
              size="sm"
              options={mockRecyclers.map((rec) => ({
                value: rec.id,
                label: rec.name,
                subtitle: `${rec.locationName} • Filières: ${rec.valorizationTypes.join(', ')}`,
                badge: `${rec.capacityTonPerMonth} t/m`,
                badgeColor: 'blue',
              }))}
            />
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-slate-800 dark:text-slate-200 font-bold">Valeur Économique :</span>
            <span className="font-black text-xs text-amber-950 dark:text-amber-100 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-700 shadow-2xs">
              45 875 FCFA (250 FCFA/kg)
            </span>
          </div>
        </div>
      </div>

      {/* Traceability Timeline */}
      <div
        className={`p-3.5 rounded-2xl border space-y-2.5 text-xs ${
          isFixora
            ? 'bg-white border-slate-300 text-slate-950 shadow-sm'
            : 'bg-slate-900 border-slate-700 text-white shadow-sm'
        }`}
      >
        <span className="font-black text-xs block text-slate-950 dark:text-white uppercase tracking-wider">
          Chronologie Immuable de Traçabilité
        </span>

        <div className="space-y-3 relative pl-4 border-l-2 border-blue-500 text-[10.5px] pt-1">
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-blue-600"></div>
            <span className="text-slate-700 dark:text-slate-300 block font-mono font-bold">14 Sept 2026, 08:30 GMT</span>
            <span className="font-black text-xs block text-slate-950 dark:text-blue-200">
              1. Signalement & GPS Citoyen
            </span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold block">
              Plage Côte Sauvage • Zone de Ponte Nids Luth
            </span>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-blue-600"></div>
            <span className="text-slate-700 dark:text-slate-300 block font-mono font-bold">14 Sept 2026, 14:15 GMT</span>
            <span className="font-black text-xs block text-slate-950 dark:text-blue-200">
              2. Collecte & Pesée Réelle (183.5 kg)
            </span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold block">
              Agent Jean-Baptiste Mabiala • Balance Certifiée
            </span>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-blue-600"></div>
            <span className="text-slate-700 dark:text-slate-300 block font-mono font-bold">14 Sept 2026, 17:30 GMT</span>
            <span className="font-black text-xs block text-slate-950 dark:text-blue-200">
              3. Scan QR Code & Réception Usine
            </span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold block">
              Congo Plastic Eco-Recycling (Loandjili)
            </span>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-300"></div>
            <span className="text-slate-700 dark:text-slate-300 block font-mono font-bold">15 Sept 2026, 08:00 GMT</span>
            <span className="font-black text-xs block text-emerald-700 dark:text-emerald-300">
              4. Valorisation & Broyage PET Validé
            </span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold block">
              Transformation en granulés recyclés de haute qualité
            </span>
          </div>
        </div>
      </div>

      {/* Navigation & Follow-up Actions */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={() => setMobileScreen('tour')}
          className="h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
        >
          <span>← Tournée</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileScreen('impact')}
          className="h-11 px-3 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
        >
          <span>Voir l'Impact →</span>
        </button>
      </div>
    </div>
  );
};
