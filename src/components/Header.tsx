import React from 'react';
import { Waves, Database, Smartphone, ShieldCheck, RefreshCw, Code2, MapPin, CheckCircle2, Play } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onReplaySplash?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onReplaySplash }) => {
  const tabs = [
    { id: 'demo', label: 'Application Mobile', icon: Smartphone },
    { id: 'roadmap', label: 'Plan & Modules', icon: CheckCircle2 },
    { id: 'architecture', label: 'Architecture Système', icon: Smartphone },
    { id: 'sql', label: 'Base de Données & Espace', icon: Database },
    { id: 'rls', label: 'Sécurité & Accès', icon: ShieldCheck },
    { id: 'powersync', label: 'Synchronisation Terrain', icon: RefreshCw },
    { id: 'dart', label: 'Modèles de Données', icon: Code2 },
  ];

  return (
    <header className="bg-[#0A3D62] text-white shadow-lg border-b border-[#1BA9C5]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1BA9C5] to-emerald-400 flex items-center justify-center text-[#0A3D62] font-black shadow-md border border-emerald-300/40">
              {/* Custom Sea Turtle Icon */}
              <svg className="w-8 h-8 text-[#0A3D62]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 0-4 4v1a7 7 0 0 0-7 7v1a2 2 0 0 0 2 2h1a7 7 0 0 0 14 0h1a2 2 0 0 0 2-2v-1a7 7 0 0 0-7-7V6a4 4 0 0 0-4-4z" fill="currentColor" fillOpacity="0.15" />
                <circle cx="12" cy="11" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M12 6v10M7 11h10M8.5 7.5l7 7M15.5 7.5l-7 7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 11c-1.5-2-2.5-3-2-5s2.5-1 4 1" stroke="currentColor" strokeWidth="2" />
                <path d="M20 11c1.5-2 2.5-3 2-5s-2.5-1-4 1" stroke="currentColor" strokeWidth="2" />
                <path d="M6 17c-1 2-2 3.5-3 4s-2-1-1-3" stroke="currentColor" strokeWidth="2" />
                <path d="M18 17c1 2 2 3.5 3 4s2-1 1-3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  Masseko <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 whitespace-nowrap">Littoral Pointe-Noire</span>
                </h1>
                <span className="text-xs text-slate-300 font-medium">
                  Sauvegarde des tortues marines & valorisation des plastiques
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton />
            {onReplaySplash && (
              <button
                onClick={onReplaySplash}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/15 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                title="Revoir la page d'animation d'ouverture"
              >
                <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                <span>Intro Masseko</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1BA9C5] text-[#0A3D62] font-bold shadow-md'
                    : 'bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0A3D62]' : 'text-[#1BA9C5]'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
