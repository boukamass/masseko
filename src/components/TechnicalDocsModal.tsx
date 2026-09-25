import React, { useState } from 'react';
import { X, Database, ShieldCheck, RefreshCw, Code2, CheckCircle2, Smartphone } from 'lucide-react';
import { ArchitectureView } from './ArchitectureView';
import { SqlSchemaView } from './SqlSchemaView';
import { RlsPoliciesView } from './RlsPoliciesView';
import { PowerSyncView } from './PowerSyncView';
import { DartModelsView } from './DartModelsView';
import { RoadmapView } from './RoadmapView';

interface TechnicalDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalDocsModal: React.FC<TechnicalDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('roadmap');

  if (!isOpen) return null;

  const tabs = [
    { id: 'roadmap', label: 'Plan & Modules', icon: CheckCircle2 },
    { id: 'architecture', label: 'Architecture Système', icon: Smartphone },
    { id: 'sql', label: 'Base de Données & Espace', icon: Database },
    { id: 'rls', label: 'Sécurité & Accès (RLS)', icon: ShieldCheck },
    { id: 'powersync', label: 'Synchronisation Terrain', icon: RefreshCw },
    { id: 'dart', label: 'Modèles de Données (Dart)', icon: Code2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-5xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-white">
                Dossier Technique & Architecture Système Masseko
              </h3>
              <p className="text-xs text-slate-400">
                Spécifications pour Développeurs & Bailleurs de Fonds (PostgreSQL, PostGIS, PowerSync)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto no-scrollbar shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/90 scrollbar-thin">
          {activeTab === 'roadmap' && <RoadmapView />}
          {activeTab === 'architecture' && <ArchitectureView />}
          {activeTab === 'sql' && <SqlSchemaView />}
          {activeTab === 'rls' && <RlsPoliciesView />}
          {activeTab === 'powersync' && <PowerSyncView />}
          {activeTab === 'dart' && <DartModelsView />}
        </div>
      </div>
    </div>
  );
};
