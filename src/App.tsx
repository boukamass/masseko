import React, { useState } from 'react';
import { Header } from './components/Header';
import { ArchitectureView } from './components/ArchitectureView';
import { SqlSchemaView } from './components/SqlSchemaView';
import { RlsPoliciesView } from './components/RlsPoliciesView';
import { PowerSyncView } from './components/PowerSyncView';
import { DartModelsView } from './components/DartModelsView';
import { RoadmapView } from './components/RoadmapView';
import { InteractiveDemoView } from './components/InteractiveDemoView';
import { SplashScreen } from './components/SplashScreen';
import { Waves } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('demo');
  const [replayMobileSplashTrigger, setReplayMobileSplashTrigger] = useState<number>(0);

  const handleReplaySplash = () => {
    setActiveTab('demo');
    setReplayMobileSplashTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-16">
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReplaySplash={handleReplaySplash}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Tab Switcher Content */}
        {activeTab === 'roadmap' && <RoadmapView />}
        {activeTab === 'architecture' && <ArchitectureView />}
        {activeTab === 'sql' && <SqlSchemaView />}
        {activeTab === 'rls' && <RlsPoliciesView />}
        {activeTab === 'powersync' && <PowerSyncView />}
        {activeTab === 'dart' && <DartModelsView />}
        {activeTab === 'demo' && <InteractiveDemoView />}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-medium">
          <Waves className="w-4 h-4 text-[#1BA9C5]" />
          <span>Masseko — Plateforme Intelligente de Lutte Contre la Pollution Plastique (Pointe-Noire)</span>
        </div>
        <div>
          <span>Solution de Protection Côtière & Valorisation des Déchets Plastiques</span>
        </div>
      </footer>
    </div>
  );
}
