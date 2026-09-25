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
      className={`px-3 py-2 border-t-2 flex items-center justify-around z-30 transition-colors ${
        isFixora
          ? 'bg-white border-slate-300 text-slate-950 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]'
          : 'bg-[#1C1C1E] border-slate-700 text-white shadow-[0_-4px_16px_rgba(0,0,0,0.5)]'
      }`}
    >
      {navItems.map((item) => {
        const Icon = item.icon;

        if (item.isFab) {
          return (
            <button
              key={item.id}
              onClick={() => setMobileScreen('report')}
              className="relative -top-3.5 flex flex-col items-center justify-center group focus:outline-none"
              aria-label="Signaler un déchet"
            >
              <div
                className={`w-13 h-13 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 transform group-hover:scale-105 active:scale-95 ${
                  item.active
                    ? 'bg-[#0052CC] text-white ring-4 ring-blue-500/30'
                    : 'bg-[#007AFF] hover:bg-[#0052CC] text-white ring-2 ring-blue-400/40'
                }`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-[11px] font-black mt-1 text-slate-950 dark:text-white whitespace-nowrap">
                Signaler
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setMobileScreen(item.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-150 min-w-[56px] ${
              item.active
                ? isFixora
                  ? 'text-[#0052CC] font-black bg-blue-50 scale-105 border border-blue-300'
                  : 'text-[#0A84FF] font-black bg-[#2C2C2E] scale-105 border border-slate-600'
                : isFixora
                ? 'text-slate-800 hover:text-slate-950 font-bold hover:bg-slate-100'
                : 'text-slate-200 hover:text-white font-bold hover:bg-slate-800/80'
            }`}
          >
            <Icon className={`w-4.5 h-4.5 transition-transform ${item.active ? 'scale-110' : ''}`} />
            <span className="whitespace-nowrap leading-none tracking-tight text-[11px] font-black">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
