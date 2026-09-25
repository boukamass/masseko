import React from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Trophy, 
  ShieldCheck, 
  Waves,
  Users,
  PieChart
} from 'lucide-react';
import { 
  REAL_IMPACT_CAMPAIGNS, 
  USER_CATEGORIES_DEFINITIONS
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

  const currentCampaign =
    REAL_IMPACT_CAMPAIGNS.find((c) => c.id === selectedCampaignId) || REAL_IMPACT_CAMPAIGNS[0];

  const totalCertifiedKg = (currentCampaign.actualAchievedKg || 0) + reports.reduce((acc, r) => acc + (r.actualWeightKg || 0), 0);
  const totalCo2SavedKg = (totalCertifiedKg * 2.5).toFixed(1);
  const totalNestsProtected = 18 + reports.filter((r) => r.isNestingZone).length * 4;
  const campaignProgress = Math.min(100, Math.round((totalCertifiedKg / (currentCampaign.targetObjectiveKg || 1000)) * 100));

  return (
    <div className="space-y-3 pb-3">
      {/* 1. Header with Campaign Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">
                Impact & Bailleurs
              </h3>
              <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal">
                Pointe-Noire • {currentCampaign.season}
              </span>
            </div>
          </div>

          <span className="text-xs font-medium text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-2xs">
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

        {/* Campaign Progress Gauge */}
        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[10.5px]">
            <span className="text-slate-500 dark:text-slate-400 font-normal">
              Objectif {currentCampaign.partner} : {currentCampaign.targetObjectiveKg} kg
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {campaignProgress}% atteint
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${campaignProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Compact 4 KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`p-3 rounded-2xl border text-center ${
          isFixora ? 'bg-white border-slate-200 text-slate-900 shadow-2xs' : 'bg-[#161618] border-slate-800 text-white shadow-2xs'
        }`}>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
            Poids Pesé Certifié
          </span>
          <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 block mt-0.5">
            {totalCertifiedKg.toFixed(1)} kg
          </span>
          <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-normal">Pesée certifiée</span>
        </div>

        <div className={`p-3 rounded-2xl border text-center ${
          isFixora ? 'bg-white border-slate-200 text-slate-900 shadow-2xs' : 'bg-[#161618] border-slate-800 text-white shadow-2xs'
        }`}>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
            CO2 Évité
          </span>
          <span className="text-base font-bold text-blue-700 dark:text-blue-400 block mt-0.5">
            {totalCo2SavedKg} kg
          </span>
          <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-normal">Facteur 2.5</span>
        </div>

        <div className={`p-3 rounded-2xl border text-center ${
          isFixora ? 'bg-white border-slate-200 text-slate-900 shadow-2xs' : 'bg-[#161618] border-slate-800 text-white shadow-2xs'
        }`}>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
            Nids Protégés
          </span>
          <span className="text-base font-bold text-amber-700 dark:text-amber-400 block mt-0.5">
            {totalNestsProtected} nids
          </span>
          <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-normal">Songolo & Côte Sauvage</span>
        </div>

        <div className={`p-3 rounded-2xl border text-center ${
          isFixora ? 'bg-white border-slate-200 text-slate-900 shadow-2xs' : 'bg-[#161618] border-slate-800 text-white shadow-2xs'
        }`}>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
            Taux Valorisation
          </span>
          <span className="text-base font-bold text-purple-700 dark:text-purple-400 block mt-0.5">
            94.2%
          </span>
          <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-normal">Filières locales</span>
        </div>
      </div>

      {/* 3. Streamlined Export Bar */}
      <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 ${
        isFixora ? 'bg-white border-slate-200 text-slate-900 shadow-2xs' : 'bg-[#1C1C1E] border-slate-800 text-white shadow-2xs'
      }`}>
        <div className="min-w-0">
          <span className="font-semibold text-xs block text-slate-900 dark:text-white truncate">
            Export Bailleurs & Partenaires
          </span>
          <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal truncate block">
            Rapport de traçabilité certifié
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowDonorExportModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-medium text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 border border-slate-200 dark:border-slate-700"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="whitespace-nowrap">Aperçu</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadDonorCSV}
            className="px-2.5 py-1.5 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white font-medium text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">CSV</span>
          </button>
        </div>
      </div>

      {/* 4. Challenge Inter-Écoles (Compact Podium) */}
      <div className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
        isFixora ? 'bg-white border-slate-200 text-slate-900 shadow-2xs' : 'bg-[#1C1C1E] border-slate-800 text-white shadow-2xs'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-xs flex items-center gap-1.5 truncate text-slate-900 dark:text-white">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="truncate">Défi Écoles Pointe-Noire</span>
          </span>
          <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap shrink-0">Classement</span>
        </div>

        <div className="space-y-1">
          {[
            { rank: 1, name: 'Lycée Victor Augagneur', kg: '420 kg', color: 'text-amber-800 dark:text-amber-300 font-semibold' },
            { rank: 2, name: 'Collège Fraternité (Tié-Tié)', kg: '315 kg', color: 'text-slate-700 dark:text-slate-200 font-semibold' },
            { rank: 3, name: 'Lycée Poaty-Bernard', kg: '280 kg', color: 'text-amber-900 dark:text-amber-400 font-semibold' },
          ].map((item) => (
            <div key={item.rank} className="flex items-center justify-between py-1.5 border-b last:border-0 border-slate-100 dark:border-slate-800/80 text-[11px] gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 font-medium text-[10px] flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-300">
                  {item.rank}
                </span>
                <span className="font-normal truncate text-slate-800 dark:text-slate-200">{item.name}</span>
              </div>
              <span className={`whitespace-nowrap shrink-0 ${item.color}`}>{item.kg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Répartition Analytique par Profil d'Utilisateur */}
      <div className={`p-3.5 rounded-2xl border space-y-3 text-xs ${
        isFixora ? 'bg-white border-slate-200 text-slate-900 shadow-2xs' : 'bg-[#1C1C1E] border-slate-800 text-white shadow-2xs'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-xs flex items-center gap-1.5 truncate text-slate-900 dark:text-white">
            <Users className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate">Analyses par Profils d'Utilisateurs</span>
          </span>
          <span className="text-[10px] text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded-full font-semibold shrink-0">
            8 Catégories
          </span>
        </div>

        {/* Progress distribution bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
            <div style={{ width: '38%' }} className="bg-emerald-500 h-full" title="Étudiants & Écoles : 38%" />
            <div style={{ width: '24%' }} className="bg-sky-500 h-full" title="Pêcheurs Artisanaux : 24%" />
            <div style={{ width: '18%' }} className="bg-amber-500 h-full" title="Professionnels du Littoral : 18%" />
            <div style={{ width: '12%' }} className="bg-teal-600 h-full" title="Citoyens Sentinelles : 12%" />
            <div style={{ width: '8%' }} className="bg-purple-500 h-full" title="ONG & Scientifiques : 8%" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">🎓 Élèves / Étudiants</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">38%</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                <span className="truncate">⚓ Pêcheurs Artisans</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">24%</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span className="truncate">💼 Professionnels Littoral</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">18%</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                <span className="truncate">👤 Citoyens Sentinelles</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">12%</span>
            </div>
          </div>
        </div>

        {/* Analytical Insight Note */}
        <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-[10.5px] leading-relaxed text-teal-900 dark:text-teal-200">
          <strong>Constat d'Analyse :</strong> Le binôme <em>Étudiants (38%)</em> et <em>Pêcheurs (24%)</em> génère plus de 60% des détections critiques (filets dérivants et plastiques en bordure de marée haute), permettant une intervention avant que les tortues Luth ne s'y enchevêtrent.
        </div>
      </div>

      {/* 6. Minimalist Sentinelle Badges */}
      <div className="flex items-center justify-between gap-1.5 text-[10px] text-center">
        {[
          { label: 'Protecteur Masseko', icon: TurtleIcon, color: 'text-teal-600 dark:text-teal-400' },
          { label: 'Sentinelle Nids', icon: ShieldCheck, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Gardien Sauvage', icon: Waves, color: 'text-blue-600 dark:text-blue-400' },
        ].map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className={`flex-1 p-2.5 rounded-xl border flex flex-col items-center gap-1 min-w-0 ${
                isFixora ? 'bg-white border-slate-200 text-slate-800 shadow-2xs font-medium' : 'bg-[#1C1C1E] border-slate-800 text-slate-200 shadow-2xs font-medium'
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
