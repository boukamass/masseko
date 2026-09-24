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
      <div className="p-3.5 bg-[#0A3D62] text-white rounded-2xl flex items-center justify-between text-xs shadow-xs border border-cyan-500/20">
        <div>
          <span className="font-mono text-xs font-black text-cyan-300 block">
            LOT #{scannedLotId || 'MASSEKO-2026-000127'}
          </span>
          <span className="text-[10px] text-cyan-100 flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Passeport Numérique Certifié MASSEKO</span>
          </span>
        </div>
        <span className="bg-cyan-500/20 text-cyan-200 text-[9px] font-extrabold px-2.5 py-1 rounded-full border border-cyan-400/30">
          OFFLINE-READY
        </span>
      </div>

      {/* QR Code Container */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center space-y-2">
        <div className="relative p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <img
            src={lot.qrCodeUrl}
            alt="QR Code Passport"
            className="w-32 h-32 bg-white p-1.5 rounded-xl shadow-inner border border-slate-100"
          />
          <div className="absolute -bottom-1 -right-1 bg-[#0284C7] text-white p-1 rounded-full shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-bold">
          Scannez pour vérifier la chaîne de traçabilité
        </span>
      </div>

      {/* Lot Technical Details Card */}
      <div
        className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
          isFixora
            ? 'bg-white border-slate-200 text-slate-800 shadow-2xs'
            : 'bg-slate-900 border-slate-800 text-white shadow-2xs'
        }`}
      >
        <span className="font-extrabold text-xs text-sky-700 dark:text-sky-400 block border-b border-slate-100 dark:border-slate-800 pb-1.5">
          Spécifications Techniques du Lot
        </span>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Poids Réel Certifié :</span>
            <span className="font-black text-sky-600 dark:text-sky-400 text-xs">
              {lot.actualWeightKg} kg
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Matière Polymère :</span>
            <span className="font-bold">PET 01 (Bouteilles)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Origine Littorale :</span>
            <span className="font-bold text-right text-[10px]">Côte Sauvage & Songolo</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Collecteur Agréé :</span>
            <span className="font-bold">Jean-Baptiste Mabiala</span>
          </div>

          {/* Recycler Destination Dropdown */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <ModernSelect
              label="Recycleur Destinataire :"
              value={selectedRecyclerId}
              onChange={(val) => setSelectedRecyclerId(val)}
              themeMode={themeMode}
              icon={<Building2 className="w-3.5 h-3.5 text-sky-500" />}
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

          <div className="flex justify-between items-center pt-1.5 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">Valeur Économique :</span>
            <span className="font-extrabold text-xs text-amber-600 dark:text-amber-400">
              45 875 FCFA (250 FCFA/kg)
            </span>
          </div>
        </div>
      </div>

      {/* Traceability Timeline */}
      <div
        className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
          isFixora
            ? 'bg-white border-slate-200 text-slate-800 shadow-2xs'
            : 'bg-slate-900 border-slate-800 text-white shadow-2xs'
        }`}
      >
        <span className="font-extrabold text-xs block text-slate-900 dark:text-white uppercase tracking-wider">
          Chronologie Immuable de Traçabilité
        </span>

        <div className="space-y-3 relative pl-4 border-l-2 border-sky-500/40 text-[10px] pt-1">
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-sky-500"></div>
            <span className="text-slate-400 block font-mono">14 Sept 2026, 08:30 GMT</span>
            <span className="font-bold text-xs block text-slate-800 dark:text-sky-200">
              1. Signalement & GPS Citoyen
            </span>
            <span className="text-slate-500 dark:text-slate-400 block">
              Plage Côte Sauvage • Zone de Ponte Nids Luth
            </span>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-sky-500"></div>
            <span className="text-slate-400 block font-mono">14 Sept 2026, 14:15 GMT</span>
            <span className="font-bold text-xs block text-slate-800 dark:text-sky-200">
              2. Collecte & Pesée Réelle (183.5 kg)
            </span>
            <span className="text-slate-500 dark:text-slate-400 block">
              Agent Jean-Baptiste Mabiala • Balance Certifiée
            </span>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
            <span className="text-slate-400 block font-mono">14 Sept 2026, 17:30 GMT</span>
            <span className="font-bold text-xs block text-slate-800 dark:text-sky-200">
              3. Scan QR Code & Réception Usine
            </span>
            <span className="text-slate-500 dark:text-slate-400 block">
              Congo Plastic Eco-Recycling (Loandjili)
            </span>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-teal-500 ring-2 ring-teal-300"></div>
            <span className="text-slate-400 block font-mono">15 Sept 2026, 08:00 GMT</span>
            <span className="font-bold text-xs block text-teal-600 dark:text-teal-300">
              4. Valorisation & Broyage PET Validé
            </span>
            <span className="text-slate-500 dark:text-slate-400 block">
              Transformation en granulés recyclés de haute qualité
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
