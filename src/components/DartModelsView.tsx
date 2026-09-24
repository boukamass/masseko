import React, { useState } from 'react';
import { dartReportModelCode, dartWasteLotModelCode } from '../data/kobaDartModels';
import { Code2, Copy, Check, FileCode, CheckCircle } from 'lucide-react';

export const DartModelsView: React.FC = () => {
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedLot, setCopiedLot] = useState(false);

  const handleCopyReport = () => {
    navigator.clipboard.writeText(dartReportModelCode);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleCopyLot = () => {
    navigator.clipboard.writeText(dartWasteLotModelCode);
    setCopiedLot(true);
    setTimeout(() => setCopiedLot(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-black text-[#0A3D62] flex items-center gap-2">
          <Code2 className="w-6 h-6 text-[#1BA9C5]" />
          I. Modèles de Données Dart fortement typés
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Modèles Dart de production avec sérialisation/désérialisation bidirectionnelle vers SQLite (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">fromSqliteMap</code> / <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">toSqliteMap</code>), parsing robuste des Enums et gestion du priority score.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
          <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-emerald-950 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Model 1: ReportModel</span>
              Encapsule la géolocalisation GPS, le volume estimé, la photo offline, le Priority Score et le statut de traitement.
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-xl text-blue-950 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Model 2: WasteLotModel</span>
              Régit la traçabilité du lot avec identifiant MASSEKO-2026-XXXXXX, QR Code, poids réel mesuré par le collecteur et statut chez le recycleur.
            </div>
          </div>
        </div>
      </div>

      {/* Report Model */}
      <div className="bg-slate-900 rounded-2xl shadow-md overflow-hidden border border-slate-800">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#1BA9C5]" />
            lib/data/models/report_model.dart
          </span>
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
          >
            {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedReport ? 'Copié !' : 'Copier ReportModel'}
          </button>
        </div>

        <pre className="p-5 font-mono text-xs overflow-x-auto text-amber-300 leading-relaxed max-h-[500px]">
          {dartReportModelCode}
        </pre>
      </div>

      {/* Waste Lot Model */}
      <div className="bg-slate-900 rounded-2xl shadow-md overflow-hidden border border-slate-800">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#1BA9C5]" />
            lib/data/models/waste_lot_model.dart
          </span>
          <button
            onClick={handleCopyLot}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
          >
            {copiedLot ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLot ? 'Copié !' : 'Copier WasteLotModel'}
          </button>
        </div>

        <pre className="p-5 font-mono text-xs overflow-x-auto text-cyan-300 leading-relaxed max-h-[450px]">
          {dartWasteLotModelCode}
        </pre>
      </div>
    </div>
  );
};
