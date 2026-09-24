import React from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Trophy, 
  ShieldCheck, 
  Waves
} from 'lucide-react';
import { 
  REAL_IMPACT_CAMPAIGNS, 
} from '../../../data/mockPointeNoireData';
import { WasteReport } from '../../../types/koba';
import { TurtleIcon } from '../TurtleIcon';
import { DemoScreen } from '../MobileBottomNav';
import { ModernSelect } from '../ModernSelect';

interface ImpactScreenProps {
  selectedCampaignId: string;
  setSelectedCampaignId: (id: string) => void;
  reports: WasteReport[];
  themeMode: 'forest' | 'fixora';
  setShowDonorExportModal: (show: boolean) => void;
  handleDownloadDonorCSV: () => void;
  setMobileScreen: (screen: DemoScreen) => void;
}

export const ImpactScreen: React.FC<ImpactScreenProps> = ({
  selectedCampaignId,
  setSelectedCampaignId,
  reports,
  themeMode,
  setShowDonorExportModal,
  handleDownloadDonorCSV,
  setMobileScreen,
}) => {
  const isFixora = themeMode === 'fixora';

  const totalCertifiedKg = reports.reduce((acc, r) => acc + (r.actualWeightKg || 0), 0);
  const totalCo2SavedKg = (totalCertifiedKg * 2.5).toFixed(1);
  const totalNestsProtected = reports.filter((r) => r.isNestingZone).length * 4;

  const currentCampaign =
    REAL_IMPACT_CAMPAIGNS.find((c) => c.id === selectedCampaignId) || REAL_IMPACT_CAMPAIGNS[0];

  return (
    <div className="space-y-3 pb-3">
      {/* 1. Header with Campaign Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                Impact & Bailleurs
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Pointe-Noire • {currentCampaign.season}
              </span>
            </div>
          </div>

          <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
            {currentCampaign.partner}
          </span>
        </div>

        <ModernSelect
          value={selectedCampaignId}
          onChange={(val) => setSelectedCampaignId(val)}
          themeMode={themeMode}
          icon={<BarChart3 className="w-3.5 h-3.5 text-emerald-500" />}
          size="sm"
          options={REAL_IMPACT_CAMPAIGNS.map((camp) => ({
            value: camp.id,
            label: camp.title,
            subtitle: `${camp.partner} • Objectif : ${camp.targetObjectiveKg} kg`,
            badge: `${camp.actualAchievedKg} kg`,
            badgeColor: 'emerald',
          }))}
        />
      </div>

      {/* 2. Compact 4 KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`p-3 rounded-2xl border text-center ${
          isFixora ? 'bg-white border-slate-200 text-slate-800 shadow-2xs' : 'bg-slate-900 border-slate-800 text-white shadow-2xs'
        }`}>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">
            Poids Pesé Certifié
          </span>
          <span className="text-base font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">
            {totalCertifiedKg.toFixed(1)} kg
          </span>
          <span className="text-[9px] text-slate-400">Pesée certifiée</span>
        </div>

        <div className={`p-3 rounded-2xl border text-center ${
          isFixora ? 'bg-white border-slate-200 text-slate-800 shadow-2xs' : 'bg-slate-900 border-slate-800 text-white shadow-2xs'
        }`}>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">
            CO2 Évité
          </span>
          <span className="text-base font-black text-blue-600 dark:text-blue-400 block mt-0.5">
            {totalCo2SavedKg} kg
          </span>
          <span className="text-[9px] text-slate-400">Facteur 2.5</span>
        </div>

        <div className={`p-3 rounded-2xl border text-center ${
          isFixora ? 'bg-white border-slate-200 text-slate-800 shadow-2xs' : 'bg-slate-900 border-slate-800 text-white shadow-2xs'
        }`}>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">
            Nids Protégés
          </span>
          <span className="text-base font-black text-amber-600 dark:text-amber-400 block mt-0.5">
            {totalNestsProtected} nids
          </span>
          <span className="text-[9px] text-slate-400">Songolo & Côte Sauvage</span>
        </div>

        <div className={`p-3 rounded-2xl border text-center ${
          isFixora ? 'bg-white border-slate-200 text-slate-800 shadow-2xs' : 'bg-slate-900 border-slate-800 text-white shadow-2xs'
        }`}>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">
            Taux Valorisation
          </span>
          <span className="text-base font-black text-purple-600 dark:text-purple-400 block mt-0.5">
            94.2%
          </span>
          <span className="text-[9px] text-slate-400">Filières locales</span>
        </div>
      </div>

      {/* 3. Streamlined Export Bar */}
      <div className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
        isFixora ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-900 border-slate-800 text-white shadow-2xs'
      }`}>
        <div className="min-w-0">
          <span className="font-extrabold text-xs block text-slate-900 dark:text-white truncate">
            Export Bailleurs (UE / WWF)
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
            Rapport de traçabilité certifié
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowDonorExportModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="whitespace-nowrap">Aperçu</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadDonorCSV}
            className="px-2.5 py-1.5 rounded-xl bg-[#0A3D62] dark:bg-sky-600 hover:bg-[#082F4D] text-white font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">CSV</span>
          </button>
        </div>
      </div>

      {/* 4. Challenge Inter-Écoles (Compact Podium) */}
      <div className={`p-3 rounded-2xl border space-y-2 text-xs ${
        isFixora ? 'bg-white border-slate-200 text-slate-800 shadow-2xs' : 'bg-slate-900 border-slate-800 text-white shadow-2xs'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <span className="font-extrabold text-xs flex items-center gap-1.5 truncate">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="truncate">Défi Écoles Pointe-Noire</span>
          </span>
          <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap shrink-0">Classement</span>
        </div>

        <div className="space-y-1">
          {[
            { rank: 1, name: 'Lycée Victor Augagneur', kg: '420 kg', color: 'text-amber-600 dark:text-amber-400' },
            { rank: 2, name: 'Collège Fraternité (Tié-Tié)', kg: '315 kg', color: 'text-slate-600 dark:text-slate-300' },
            { rank: 3, name: 'Lycée Poaty-Bernard', kg: '280 kg', color: 'text-amber-700 dark:text-amber-500' },
          ].map((item) => (
            <div key={item.rank} className="flex items-center justify-between py-1 border-b last:border-0 border-slate-100 dark:border-slate-800 text-[11px] gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 font-black text-[9px] flex items-center justify-center shrink-0">
                  {item.rank}
                </span>
                <span className="font-bold truncate">{item.name}</span>
              </div>
              <span className={`font-black whitespace-nowrap shrink-0 ${item.color}`}>{item.kg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Minimalist Sentinelle Badges */}
      <div className="flex items-center justify-between gap-1 text-[10px] text-center font-bold">
        {[
          { label: 'Protecteur Masseko', icon: TurtleIcon, color: 'text-teal-500' },
          { label: 'Sentinelle Nids', icon: ShieldCheck, color: 'text-amber-500' },
          { label: 'Gardien Sauvage', icon: Waves, color: 'text-sky-500' },
        ].map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className={`flex-1 p-2 rounded-xl border flex flex-col items-center gap-1 min-w-0 ${
                isFixora ? 'bg-white border-slate-200 text-slate-700 shadow-2xs' : 'bg-slate-900 border-slate-800 text-slate-200 shadow-2xs'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${badge.color}`} />
              <span className="truncate w-full block whitespace-nowrap">{badge.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
