import React, { useState } from 'react';
import { flutterTreeStructure, pubspecYamlContent } from '../data/kobaArchitecture';
import { FolderTree, FileCode, Copy, Check, Info } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-black text-[#0A3D62] flex items-center gap-2">
          <FolderTree className="w-6 h-6 text-[#1BA9C5]" />
          A. Architecture Flutter Clean & Modulaire
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Structure propre séparant le Core, la Data et les Fonctionnalités (Features) pour garantir modularité et maintenabilité offline-first.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-[#0A3D62] block mb-1">core/</span>
            Thème Masseko (#0A3D62 & #1BA9C5), services isolés (GPS Geolocator, Appareil photo offline, PriorityEngine).
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-[#0A3D62] block mb-1">data/</span>
            Couche locale (SQLite + PowerSyncSchema), remote (Supabase Auth/Storage) et Repositories réactifs.
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-[#0A3D62] block mb-1">features/</span>
            Modularité par domaine : Onboarding, Auth, Map, Reports, Collections, Traceability, Impact, Demo.
          </div>
        </div>
      </div>

      {/* Directory Tree */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl shadow-md overflow-hidden border border-slate-800">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-[#1BA9C5]" />
            Arborescence des fichiers (lib/)
          </span>
          <button
            onClick={() => handleCopy(flutterTreeStructure, 'tree')}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
          >
            {copiedSection === 'tree' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedSection === 'tree' ? 'Copié !' : 'Copier l\'arborescence'}
          </button>
        </div>
        <pre className="p-5 font-mono text-xs overflow-x-auto text-emerald-300 leading-relaxed max-h-[500px]">
          {flutterTreeStructure}
        </pre>
      </div>

      {/* Pubspec.yaml section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-[#0A3D62] flex items-center gap-2">
              <FileCode className="w-6 h-6 text-[#1BA9C5]" />
              B. Configuration Pubspec.yaml complète
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Dépendances vérifiées pour Android/iOS (PowerSync, SQLite3, Supabase, Google Maps, Geolocator, QR Code).
            </p>
          </div>
          <button
            onClick={() => handleCopy(pubspecYamlContent, 'pubspec')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0A3D62] text-white text-xs font-semibold hover:bg-[#06263f] transition-colors"
          >
            {copiedSection === 'pubspec' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copiedSection === 'pubspec' ? 'Copié !' : 'Copier pubspec.yaml'}
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl text-xs flex items-start gap-2.5 mb-4">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">PowerSync & SQLite Requirements:</span> Seules les versions compatibles <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-950">powersync: ^1.7.1</code> et <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-950">powersync_flutter: ^1.10.0</code> sont configurées pour garantir l'exécution du pipeline offline SQLite bi-directionnel sans interruption.
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
          <pre className="p-5 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
            {pubspecYamlContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
