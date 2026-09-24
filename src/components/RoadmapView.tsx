import React from 'react';
import { kobaImplementationRoadmap } from '../data/kobaRoadmap';
import { CheckCircle2, Clock, ShieldAlert, ArrowRight, Layers, Award } from 'lucide-react';

export const RoadmapView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#0A3D62] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#1BA9C5]" />
              Plan d'Implémentation Masseko — Préservation des Tortues Marines de Pointe-Noire
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              <strong>Masseko</strong> est le plan d'action pour la protection des sites de ponte et le nettoyage des plages de Pointe-Noire (Côte Sauvage, Djeno, Mvassa).
            </p>
          </div>
          <span className="bg-emerald-500/20 text-emerald-900 border border-emerald-500/40 text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            8/8 Modules Validés
          </span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-xs mt-4 flex items-start gap-3">
          <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-950 block text-sm mb-0.5">Étape 8 Livrée — Projet Masseko 100% Opérationnel !</span>
            Toutes les 8 étapes du plan d'implémentation (Architecture, Auth/Invité, PowerSync Offline, Cartographie & Hotspots, Tournée Collecteur, Traçabilité Lots QR Code, Dashboard d'Impact & Écoles, et Mode Démo Hackathon) sont finalisées et validées.
          </div>
        </div>
      </div>

      {/* Steps list */}
      <div className="space-y-4">
        {kobaImplementationRoadmap.map((step) => {
          const isCurrent = step.status === 'in_progress';
          const isCompleted = step.status === 'completed';

          return (
            <div
              key={step.step}
              className={`p-6 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-white border-[#1BA9C5] shadow-lg ring-2 ring-[#1BA9C5]/30'
                  : isCompleted
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-white border-slate-200 opacity-90'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black ${
                      isCurrent
                        ? 'bg-[#1BA9C5] text-[#0A3D62]'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {step.step}
                  </span>
                  <div>
                    <h3 className="font-bold text-[#0A3D62] text-base">{step.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{step.description}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs px-3 py-1 rounded-full font-bold">
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                      En attente de validation
                    </span>
                  )}
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Validé
                    </span>
                  )}
                  {!isCurrent && !isCompleted && (
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
                      Planifié
                    </span>
                  )}
                </div>
              </div>

              {/* Deliverables */}
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-800 block mb-1.5">Livrables associés:</span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                  {step.deliverables.map((del, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700">
                      <ArrowRight className="w-3.5 h-3.5 text-[#1BA9C5] shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Validation Criteria */}
              <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-700 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#0A3D62] shrink-0" />
                <span>
                  <strong>Critère de validation :</strong> {step.validationCriteria}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
