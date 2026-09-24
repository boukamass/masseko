import React, { useState } from 'react';
import { supabaseFullSqlScript } from '../data/kobaSqlSchema';
import { Database, MapPin, Layers, Zap, Copy, Check } from 'lucide-react';

export const SqlSchemaView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(supabaseFullSqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-black text-[#0A3D62] flex items-center gap-2">
          <Database className="w-6 h-6 text-[#1BA9C5]" />
          C, D, E, F. Schéma SQL Supabase, PostGIS & Indexation
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Script SQL complet exécutable pour Supabase PostgreSQL. Comprend l'extension PostGIS, les types Enum, les 9 tables métier, les index spatiaux et la fonction de calcul du Priority Score.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A3D62] mb-1">
              <MapPin className="w-4 h-4 text-[#1BA9C5]" />
              PostGIS Spatial
            </div>
            <p className="text-xs text-slate-600">Spatial GIST Indexing on <code className="bg-blue-100 px-1 rounded text-blue-900 font-mono">geography(Point, 4326)</code></p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
              <Zap className="w-4 h-4 text-emerald-600" />
              Priority Score Engine
            </div>
            <p className="text-xs text-slate-600">Calcul automatique 0-100 (Volume + Proximité Littoral/Rivière)</p>
          </div>

          <div className="bg-purple-50 border border-purple-100 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 mb-1">
              <Layers className="w-4 h-4 text-purple-600" />
              Anti-Doublons
            </div>
            <p className="text-xs text-slate-600">Détection spatiale dans un rayon paramétrable (ex: 35m)</p>
          </div>

          <div className="bg-[#0A3D62]/5 border border-[#0A3D62]/10 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A3D62] mb-1">
              <Database className="w-4 h-4 text-[#1BA9C5]" />
              Calculateur KPIs
            </div>
            <p className="text-xs text-slate-600">Fonction PostgreSQL <code className="bg-slate-200 px-1 rounded font-mono text-slate-800">get_masseko_kpis()</code></p>
          </div>
        </div>
      </div>

      {/* Code Block with Copy Button */}
      <div className="bg-slate-900 rounded-2xl shadow-md overflow-hidden border border-slate-800">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
            <Database className="w-4 h-4 text-[#1BA9C5]" />
            supabase_masseko_schema.sql (Complet & Prêt à Exécuter)
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1BA9C5] text-[#0A3D62] hover:bg-[#1696af] font-bold text-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-[#0A3D62]" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copié !' : 'Copier tout le SQL'}
          </button>
        </div>

        <pre className="p-5 font-mono text-xs overflow-x-auto text-emerald-300 leading-relaxed max-h-[600px]">
          {supabaseFullSqlScript}
        </pre>
      </div>
    </div>
  );
};
