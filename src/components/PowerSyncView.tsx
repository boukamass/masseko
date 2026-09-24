import React, { useState } from 'react';
import { powerSyncYamlRules, dartPowerSyncSchemaCode, offlinePhotoStrategyExplanation } from '../data/kobaPowerSync';
import { Cpu, WifiOff, RefreshCw, Copy, Check, HardDrive } from 'lucide-react';

export const PowerSyncView: React.FC = () => {
  const [copiedYaml, setCopiedYaml] = useState(false);
  const [copiedDart, setCopiedDart] = useState(false);

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(powerSyncYamlRules);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2000);
  };

  const handleCopyDart = () => {
    navigator.clipboard.writeText(dartPowerSyncSchemaCode);
    setCopiedDart(true);
    setTimeout(() => setCopiedDart(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-black text-[#0A3D62] flex items-center gap-2">
          <Cpu className="w-6 h-6 text-[#1BA9C5]" />
          H. Moteur Offline-First PowerSync + SQLite
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          PowerSync est le cœur d'architecture non-négociable de Masseko. Il assure la réplication temps-réel bi-directionnelle entre la base PostgreSQL Supabase et la base SQLite locale sur le téléphone Android/iOS.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
            <WifiOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#0A3D62] block">Zero Latency Local Write</span>
              Toutes les requêtes UI s'écrivent immédiatement en SQLite locale sans bloquer sur l'état du réseau.
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
            <RefreshCw className="w-5 h-5 text-[#1BA9C5] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#0A3D62] block">Auto Background Sync</span>
              Dès qu'une connexion Internet est détectée, PowerSync vide la file d'attente locale vers PostgreSQL.
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
            <HardDrive className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#0A3D62] block">Photos Offline Storage</span>
              Photos sauvegardées dans l'App-Doc Dir, puis téléversées en tâche de fond sur Supabase Storage.
            </div>
          </div>
        </div>
      </div>

      {/* Offline Photo Strategy Explanation */}
      <div className="bg-[#0A3D62] text-white p-6 rounded-2xl shadow-md border border-[#1BA9C5]/30">
        <h3 className="text-lg font-bold text-[#1BA9C5] flex items-center gap-2 mb-2">
          <WifiOff className="w-5 h-5 text-amber-400" />
          Pipeline de Gestion des Photos & Résolution des Conflits
        </h3>
        <div className="text-xs leading-relaxed text-slate-200 space-y-2">
          <p>
            • <strong>Prise de photo hors-ligne:</strong> Enregistrée immédiatement dans <code className="bg-white/10 px-1 py-0.5 rounded text-amber-300">app_doc_dir/photos/&lt;uuid&gt;.jpg</code>. L'interface affiche l'indicateur <span className="bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded font-semibold">Enregistré hors connexion</span>.
          </p>
          <p>
            • <strong>Synchronisation réactive:</strong> Le <code className="bg-white/10 px-1 py-0.5 rounded text-emerald-300">OfflinePhotoQueueService</code> surveille la connectivité et téléverse automatiquement l'image sur Supabase Storage dès le retour du réseau.
          </p>
          <p>
            • <strong>Résolution des conflits:</strong> Stratégie Last Write Wins (LWW) pour les signalements et immuabilité stricte des pesées réelles collecteurs (<code className="bg-white/10 px-1 py-0.5 rounded">actual_weight_kg</code>).
          </p>
        </div>
      </div>

      {/* PowerSync YAML Rules */}
      <div className="bg-slate-900 rounded-2xl shadow-md overflow-hidden border border-slate-800">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#1BA9C5]" />
            powersync.yaml (Règles de synchronisation Buckets)
          </span>
          <button
            onClick={handleCopyYaml}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
          >
            {copiedYaml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedYaml ? 'Copié !' : 'Copier powersync.yaml'}
          </button>
        </div>

        <pre className="p-5 font-mono text-xs overflow-x-auto text-emerald-300 leading-relaxed">
          {powerSyncYamlRules}
        </pre>
      </div>

      {/* Dart SQLite Schema */}
      <div className="bg-slate-900 rounded-2xl shadow-md overflow-hidden border border-slate-800">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#1BA9C5]" />
            lib/data/local/powersync_schema.dart (Schéma SQLite local Flutter)
          </span>
          <button
            onClick={handleCopyDart}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
          >
            {copiedDart ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedDart ? 'Copié !' : 'Copier schéma Dart'}
          </button>
        </div>

        <pre className="p-5 font-mono text-xs overflow-x-auto text-cyan-300 leading-relaxed max-h-[450px]">
          {dartPowerSyncSchemaCode}
        </pre>
      </div>
    </div>
  );
};
