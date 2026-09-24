import React, { useState } from 'react';
import { rlsPoliciesSqlScript } from '../data/kobaRlsPolicies';
import { ShieldCheck, Lock, Users, Copy, Check, Info } from 'lucide-react';

export const RlsPoliciesView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rlsPoliciesSqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-black text-[#0A3D62] flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#1BA9C5]" />
          G. Politiques de Sécurité Row Level Security (RLS)
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Règles d'isolation des données sur Supabase PostgreSQL garantissant que chaque rôle (Citoyen, Pêcheur, École, Collecteur, Recycleur, Admin, Invité) ne lit et n'écrit que ce qui lui est strictement autorisé.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="font-bold text-[#0A3D62] flex items-center gap-1.5 mb-1">
              <Users className="w-4 h-4 text-[#1BA9C5]" />
              Mode Invité & Citoyen
            </span>
            Signalement public immédiat possible sans auth préalable. Modification uniquement de ses propres signalements non encore validés.
          </div>

          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-300 text-emerald-950">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Protection Anti-Braconnage GPS
            </span>
            Anonymisation PostGIS obligatoire des coordonnées GPS des nids (floutage ~800m). Les points exacts ne sont visibles que par Renatura ONG & Rangers.
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="font-bold text-[#0A3D62] flex items-center gap-1.5 mb-1">
              <Lock className="w-4 h-4 text-amber-600" />
              Collecteurs & Tournées
            </span>
            Accès en lecture/écriture strictement restreint aux tournées attribuées. Modification autorisée pour le statut et la pesée réelle.
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="font-bold text-[#0A3D62] flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Recycleurs & Lots
            </span>
            Accès aux lots attribués pour mise à jour de la réception et du type de valorisation (Broyage, Extrusion, Réutilisation).
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Sécurité Maximale:</span> Aucun <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-950">service_role</code> secret n'est exposé dans le code mobile. Les rôles sont vérifiés côté serveur Supabase via la fonction <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-950">public.current_user_role()</code>.
        </div>
      </div>

      {/* SQL View */}
      <div className="bg-slate-900 rounded-2xl shadow-md overflow-hidden border border-slate-800">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1BA9C5]" />
            supabase_masseko_rls_policies.sql
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1BA9C5] text-[#0A3D62] hover:bg-[#1696af] font-bold text-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-[#0A3D62]" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copié !' : 'Copier les politiques RLS'}
          </button>
        </div>

        <pre className="p-5 font-mono text-xs overflow-x-auto text-emerald-300 leading-relaxed max-h-[550px]">
          {rlsPoliciesSqlScript}
        </pre>
      </div>
    </div>
  );
};
