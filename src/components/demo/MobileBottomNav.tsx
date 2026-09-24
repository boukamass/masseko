import React from 'react';
import { Leaf, Map, Camera, Truck, BarChart3 } from 'lucide-react';

export type DemoScreen = 'onboarding' | 'auth' | 'profile' | 'home' | 'map' | 'report' | 'scan' | 'tour' | 'lot' | 'impact' | 'education';

interface MobileBottomNavProps {
  mobileScreen: DemoScreen;
  setMobileScreen: (screen: DemoScreen) => void;
  themeMode: 'forest' | 'fixora';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  mobileScreen,
  setMobileScreen,
  themeMode,
}) => {
  const isFixora = themeMode === 'fixora';

  const navItems = [
    {
      id: 'home' as DemoScreen,
      label: 'Accueil',
      icon: Leaf,
      active: mobileScreen === 'home',
    },
    {
      id: 'map' as DemoScreen,
      label: 'Carte',
      icon: Map,
      active: mobileScreen === 'map',
    },
    {
      id: 'report' as DemoScreen,
      label: 'Signaler',
      icon: Camera,
      isFab: true,
      active: mobileScreen === 'report',
    },
    {
      id: 'tour' as DemoScreen,
      label: 'Tournée',
      icon: Truck,
      active: mobileScreen === 'tour',
    },
    {
      id: 'impact' as DemoScreen,
      label: 'Impact',
      icon: BarChart3,
      active: mobileScreen === 'impact',
    },
  ];

  return (
    <div
      className={`px-3 py-2 border-t flex items-center justify-around text-[10px] font-bold z-30 transition-colors ${
        isFixora
          ? 'bg-white/95 backdrop-blur-md border-slate-200/90 text-slate-600 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]'
          : 'bg-[#0B131F]/95 backdrop-blur-md border-slate-800 text-slate-300 shadow-[0_-4px_16px_rgba(0,0,0,0.4)]'
      }`}
    >
      {navItems.map((item) => {
        const Icon = item.icon;

        if (item.isFab) {
          return (
            <button
              key={item.id}
              onClick={() => setMobileScreen('report')}
              className="relative -top-3 flex flex-col items-center justify-center group focus:outline-none"
              aria-label="Signaler un déchet"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform group-hover:scale-105 active:scale-95 ${
                  item.active
                    ? 'bg-gradient-to-tr from-[#0284C7] to-teal-500 text-white ring-4 ring-teal-500/30'
                    : 'bg-gradient-to-tr from-[#0369A1] to-teal-600 text-white hover:brightness-110 ring-2 ring-teal-400/30'
                }`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[9px] font-black mt-0.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                Signaler
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setMobileScreen(item.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[52px] ${
              item.active
                ? isFixora
                  ? 'text-[#0284C7] font-black bg-sky-50 scale-102'
                  : 'text-teal-300 font-black bg-slate-800/80 scale-102'
                : isFixora
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Icon className={`w-4 h-4 transition-transform ${item.active ? 'scale-110' : ''}`} />
            <span className="whitespace-nowrap leading-none tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
