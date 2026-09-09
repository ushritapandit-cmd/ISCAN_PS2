import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Camera,
  History,
  Globe,
  Menu,
  ScanLine
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const { activeTab, setActiveTab, startNewInspection } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'qr-scanner', label: 'Scan QR', icon: ScanLine },
    { id: 'scan', label: 'New Scan', icon: Camera, isPrimary: true },
    { id: 'history', label: 'History', icon: History },
    { id: 'menu', label: 'Menu', icon: Menu, isMenu: true }
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 lg:hidden safe-area-inset-bottom shadow-lg"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'scan' && (activeTab === 'scanner' || activeTab === 'new-inspection' || activeTab === 'qr-scanner'));

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => {
                  startNewInspection();
                }}
                className="flex flex-col items-center -mt-5 group focus:outline-none"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md group-active:scale-95 transition-transform border-2 border-white">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold text-emerald-800 mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isMenu) {
                  onOpenMenu();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
