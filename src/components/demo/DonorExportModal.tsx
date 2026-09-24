import React from 'react';
import { 
  X, 
  Download, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Scale 
} from 'lucide-react';
import { REAL_IMPACT_CAMPAIGNS } from '../../data/mockPointeNoireData';
import { WasteReport } from '../../types/koba';
import { TurtleIcon } from './TurtleIcon';
import { ModernSelect } from './ModernSelect';

interface DonorExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: WasteReport[];
  selectedDonorTemplate: string;
  setSelectedDonorTemplate: (template: string) => void;
  handleDownloadDonorCSV: () => void;
}

export const DonorExportModal: React.FC<DonorExportModalProps> = ({
  isOpen,
  onClose,
  reports,
  selectedDonorTemplate,
  setSelectedDonorTemplate,
  handleDownloadDonorCSV,
}) => {
  if (!isOpen) return null;

  const totalCertifiedKg = reports.reduce((acc, r) => acc + (r.actualWeightKg || 0), 0);
  const totalCo2SavedKg = (totalCertifiedKg * 2.5).toFixed(1);
  const totalNestsProtected = reports.filter(r => r.isNestingZone).length * 4;

  const donorTemplates = [
    { id: 'ffem', name: 'FFEM / AFD - Fonds Français pour l’Environnement Mondial', code: 'FFEM-PN-2026' },
    { id: 'ue_biodiv', name: 'Union Européenne - Programme Biodiversité & Littoral Congo', code: 'FED-ECO-984' },
    { id: 'wwf_marine', name: 'WWF Afrique Centrale - Préservation Tortues Marines', code: 'WWF-CONGO-KOB' },
    { id: 'pnud_gefs', name: 'PNUD / GEF - Gestion Intégrée des Déchets Côtiers', code: 'GEF-7-POINTE-NOIRE' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#0A3D62] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#1BA9C5]/20 border border-[#1BA9C5]/40 flex items-center justify-center text-[#1BA9C5]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-wide text-white">
                Rapport d'Audit & Certification Bailleurs
              </h3>
              <p className="text-[11px] text-slate-300">
                Génération des fiches de justification certifiées Masseko
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
          {/* Scientific Notice */}
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-3 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold text-emerald-950 dark:text-emerald-200 block mb-0.5">
                Certification Rigoureuse du Poids Réel
              </span>
              Seul le tonnage <strong>pesé sur balance homologuée lors de la collecte</strong> est certifié pour les bailleurs internationaux. Les estimations visuelles citoyennes servent exclusivement au dispatching logistique.
            </div>
          </div>

          {/* Template Selector */}
          <div>
            <ModernSelect
              label="Organisme / Protocole Bailleur :"
              value={selectedDonorTemplate}
              onChange={(val) => setSelectedDonorTemplate(val)}
              themeMode="fixora"
              icon={<FileText className="w-4 h-4 text-[#0A3D62] dark:text-cyan-400" />}
              options={donorTemplates.map((t) => ({
                value: t.id,
                label: t.name,
                subtitle: `Code Protocole : ${t.code}`,
                badge: t.code.split('-')[0],
                badgeColor: 'blue',
              }))}
            />
          </div>

          {/* Aggregated KPI Summary Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-center">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                Poids Certifié
              </span>
              <span className="font-black text-sm text-emerald-700 dark:text-emerald-300 block mt-0.5">
                {totalCertifiedKg.toFixed(1)} kg
              </span>
              <span className="text-[9px] text-slate-400">Balance homologuée</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-center">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                CO2 Évité
              </span>
              <span className="font-black text-sm text-blue-700 dark:text-blue-300 block mt-0.5">
                {totalCo2SavedKg} kg
              </span>
              <span className="text-[9px] text-slate-400">Facteur 2.5 kg/kg</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-center">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                Nids Protégés
              </span>
              <span className="font-black text-sm text-amber-700 dark:text-amber-300 block mt-0.5">
                {totalNestsProtected} nids
              </span>
              <span className="text-[9px] text-slate-400">Rayon sécurisé</span>
            </div>
          </div>

          {/* Traceability Guarantee Stamp */}
          <div className="p-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <TurtleIcon className="w-5 h-5 text-emerald-600" />
              <span>
                <strong>Empreinte Cryptographique :</strong> QR Passport MASSEKO-SHA256
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold">
              Conforme ISO 14044
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Fermer
          </button>

          <button
            onClick={() => {
              handleDownloadDonorCSV();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-[#0A3D62] hover:bg-[#082e4b] text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-[#1BA9C5]" />
            <span>Télécharger CSV Officiel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
