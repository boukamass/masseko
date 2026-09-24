import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Zap, 
  Layers, 
  Smartphone, 
  QrCode, 
  Scale, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Download, 
  FileText, 
  UserCheck, 
  Radio, 
  Flame, 
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import { WasteReport, MassekoRole } from '../../types/koba';
import { TurtleIcon } from './TurtleIcon';
import { DemoScreen } from './MobileBottomNav';

interface DesktopCompanionProps {
  reports: WasteReport[];
  selectedMapPoint: WasteReport | null;
  setSelectedMapPoint: (r: WasteReport | null) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  syncPendingReports: () => void;
  mobileScreen: DemoScreen;
  setMobileScreen: (screen: DemoScreen) => void;
  handleApproveReport: (id: string) => void;
  handleRejectReport: (id: string) => void;
  setShowDonorExportModal: (show: boolean) => void;
  handleDownloadDonorCSV: () => void;
  isRangerVerified: boolean;
  setIsRangerVerified: (verified: boolean) => void;
}

export const DesktopCompanion: React.FC<DesktopCompanionProps> = ({
  reports,
  selectedMapPoint,
  setSelectedMapPoint,
  isOnline,
  setIsOnline,
  syncPendingReports,
  mobileScreen,
  setMobileScreen,
  handleApproveReport,
  handleRejectReport,
  setShowDonorExportModal,
  handleDownloadDonorCSV,
  isRangerVerified,
  setIsRangerVerified,
}) => {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'moderation' | 'roles' | 'audit'>('telemetry');

  const pendingReports = reports.filter((r) => r.status === 'reported');
  const collectedReports = reports.filter(
    (r) => r.status === 'collected' || r.status === 'validated' || r.status === 'valorized'
  );
  const totalCertifiedWeight = collectedReports.reduce(
    (sum, r) => sum + (r.actualWeightKg || 0),
    0
  );

  const rolesList: { id: MassekoRole; label: string; targetScreen: DemoScreen; desc: string; icon: any }[] = [
    {
      id: 'citizen',
      label: 'Pass Écocitoyen (Connexion / Enregistrement)',
      targetScreen: 'auth',
      desc: 'Création de compte, login PIN & mode hors-ligne',
      icon: UserCheck,
    },
    {
      id: 'citizen',
      label: 'Citoyen / Pêcheur Artisanal (Signalement)',
      targetScreen: 'report',
      desc: 'Signalement photo & GPS hors-ligne',
      icon: UserCheck,
    },
    {
      id: 'school',
      label: 'Éducateur / Établissement Scolaire',
      targetScreen: 'education',
      desc: 'Académie Masseko, nids & quiz interactif (+40 pts)',
      icon: GraduationCap,
    },
    {
      id: 'admin',
      label: 'Éco-Garde Renatura',
      targetScreen: 'map',
      desc: 'Modération & zones de ponte sensibles',
      icon: ShieldCheck,
    },
    {
      id: 'collector',
      label: 'Chauffeur Collecteur',
      targetScreen: 'tour',
      desc: 'Tournée optimisée & pesée balance réelle',
      icon: Scale,
    },
    {
      id: 'recycler',
      label: 'Usine de Recyclage',
      targetScreen: 'lot',
      desc: 'Scan QR Code Lot & certificat de valorisation',
      icon: Building2,
    },
    {
      id: 'association',
      label: 'Bailleur de Fonds (UE / WWF)',
      targetScreen: 'impact',
      desc: 'Audit des tonnages réels certifiés',
      icon: FileText,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-5 space-y-4 flex flex-col h-full">
      {/* Companion Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#0A3D62] text-[#1BA9C5] flex items-center justify-center shadow-xs">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              Console de Supervision & Suivi Masseko
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Synchronisation automatique des données de terrain
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (!isOnline) syncPendingReports();
              else setIsOnline(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              isOnline
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{isOnline ? 'Réseau Connecté' : 'Mode Hors-Ligne'}</span>
          </button>
        </div>
      </div>

      {/* Companion Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`py-2 px-2 rounded-xl transition-all whitespace-nowrap shrink-0 text-center cursor-pointer ${
            activeTab === 'telemetry'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <span className="whitespace-nowrap">Suivi en Direct</span>
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`py-2 px-2 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'moderation'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <span className="whitespace-nowrap">Modération</span>
          {pendingReports.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center shrink-0">
              {pendingReports.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`py-2 px-2 rounded-xl transition-all whitespace-nowrap shrink-0 text-center cursor-pointer ${
            activeTab === 'roles'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <span className="whitespace-nowrap">Rôles</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-2 px-2 rounded-xl transition-all whitespace-nowrap shrink-0 text-center cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <span className="whitespace-nowrap">Audit Bailleurs</span>
        </button>
      </div>

      {/* Tab 1: Live Telemetry & PostGIS Payloads */}
      {activeTab === 'telemetry' && (
        <div className="space-y-3.5 text-xs">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Points Enregistrés</span>
              <span className="text-base font-black text-slate-900 dark:text-white">{reports.length}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold block uppercase">Pesée Réelle</span>
              <span className="text-base font-black text-emerald-700 dark:text-emerald-300">{totalCertifiedWeight.toFixed(1)} kg</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <span className="text-[10px] text-blue-800 dark:text-blue-300 font-bold block uppercase">Synchronisation</span>
              <span className="text-base font-black text-blue-700 dark:text-blue-300">{isOnline ? 'Synchronisé' : 'En attente locale'}</span>
            </div>
          </div>

          {/* Real-time PostGIS GeoJSON Inspector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#1BA9C5]" />
                <span>Fiche Détaillée du Secteur Sélectionné :</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Coordonnées GPS Standard</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto shadow-inner border border-slate-800 leading-relaxed max-h-48">
              <pre>
{JSON.stringify(
  {
    type: "Fiche_Terrain",
    geolocalisation: {
      latitude: selectedMapPoint?.latitude || -4.7920,
      longitude: selectedMapPoint?.longitude || 11.8310
    },
    details: {
      identifiant: selectedMapPoint?.id || "rep-pn-001",
      secteur: selectedMapPoint?.locationName || "Plage Côte Sauvage",
      type_dechet: selectedMapPoint?.wasteType || "bouteille_plastique",
      score_priorite: selectedMapPoint?.priorityScore || 85,
      zone_de_ponte_tortues: selectedMapPoint?.isNestingZone || true,
      poids_pesee_kg: selectedMapPoint?.actualWeightKg || null,
      statut_synchronisation: isOnline ? "SYNCHRONISÉ" : "ENREGISTRÉ_LOCALEMENT"
    }
  },
  null,
  2
)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Human Moderation Queue */}
      {activeTab === 'moderation' && (
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              File d'Attente de Validation Éco-Garde ({pendingReports.length})
            </span>
            <button
              onClick={() => setIsRangerVerified(!isRangerVerified)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isRangerVerified ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {isRangerVerified ? 'Mode Modérateur Activé' : 'Activer Mode Modérateur'}
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {pendingReports.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                <span>Tous les signalements ont été modérés et validés.</span>
              </div>
            ) : (
              pendingReports.map((report) => (
                <div
                  key={report.id}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-extrabold text-slate-900 dark:text-white block">
                        {report.locationName}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {report.wasteType} • Gabarit: {report.estimatedVolume}
                      </span>
                    </div>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {report.priorityScore} pts
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleRejectReport(report.id)}
                      className="flex-1 py-1.5 rounded-xl border border-red-300 text-red-700 font-bold text-xs hover:bg-red-50"
                    >
                      Rejeter
                    </button>
                    <button
                      onClick={() => handleApproveReport(report.id)}
                      className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Valider</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Role Switcher */}
      {activeTab === 'roles' && (
        <div className="space-y-2 text-xs">
          <span className="font-extrabold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider block">
            Tester l'application selon un profil d'acteur :
          </span>

          <div className="space-y-2">
            {rolesList.map((role) => {
              const Icon = role.icon;
              const isActive = mobileScreen === role.targetScreen;

              return (
                <button
                  key={`${role.id}-${role.targetScreen}`}
                  onClick={() => setMobileScreen(role.targetScreen)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#0A3D62] text-emerald-300 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                        {role.label}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                        {role.desc}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                    Ouvrir écran →
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Audit Bailleurs & Methodological Notes */}
      {activeTab === 'audit' && (
        <div className="space-y-3 text-xs">
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-3.5 rounded-2xl space-y-1.5">
            <span className="font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Méthodologie d'Audit & Certification</span>
            </span>
            <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
              Pour satisfaire aux exigences strictes des bailleurs (Union Européenne, FFEM, WWF), le système Masseko distingue strictement les <strong>estimations visuelles qualitatives</strong> (utilisées pour la logistique) des <strong>tonnages certifiés sur balance</strong> (utilisés pour les attestations et les crédits carbone).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setShowDonorExportModal(true)}
              className="py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Modal Bailleurs</span>
            </button>
            <button
              onClick={handleDownloadDonorCSV}
              className="py-2.5 px-3 rounded-2xl bg-[#0A3D62] hover:bg-[#072a44] text-white font-extrabold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4 text-[#1BA9C5]" />
              <span>Exporter CSV</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
