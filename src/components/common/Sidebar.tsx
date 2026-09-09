import React from 'react';
import { useApp } from '../../context/AppContext';
import { IScanLogo } from './IScanLogo';
import {
  LayoutDashboard,
  PlusCircle,
  Scan,
  Globe,
  FileCheck2,
  ScanEye,
  History,
  Boxes,
  AlertOctagon,
  TrendingUp,
  MapPin,
  ShieldAlert,
  Users,
  Scale,
  ScrollText,
  HelpCircle,
  Settings,
  X,
  Sparkles,
  ClipboardList,
  ScanLine
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, currentUser, startNewInspection } = useApp();

  const isInspector = currentUser?.role === 'inspector';
  const isSupervisor = currentUser?.role === 'supervisor';
  const isAdmin = currentUser?.role === 'admin';

  const handleNav = (tabKey: string) => {
    if (tabKey === 'new-inspection') {
      startNewInspection();
    } else {
      setActiveTab(tabKey);
    }
    onClose();
  };

  const navItem = (key: string, label: string, Icon: React.ElementType, badge?: string) => {
    const isActive = activeTab === key;
    return (
      <button
        key={key}
        onClick={() => handleNav(key)}
        className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
          isActive
            ? 'bg-slate-900 text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-600'}`} />
          <span>{label}</span>
        </div>
        {badge && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <div className="flex items-center gap-2.5">
            <IScanLogo size="sm" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 tracking-tight text-lg">i-Scan</span>
                <span className="rounded bg-emerald-50 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 border border-emerald-200">
                  AI-LM
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 tracking-wider">
                SCAN • VERIFY • DETECT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Main Dashboard */}
          <div className="space-y-1">
            {navItem('dashboard', 'Dashboard', LayoutDashboard)}
          </div>

          {/* INSPECTION */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Inspection
            </p>
            {navItem('new-inspection', 'New Inspection', PlusCircle)}
            {navItem('qr-scanner', 'QR Code Scanner', ScanLine, 'LIVE')}
            {navItem('scanner', 'Product Scanner', Scan)}
            {navItem('ecommerce', 'E-commerce Checker', Globe)}
          </div>

          {/* ANALYSIS */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Analysis & Review
            </p>
            {navItem('compliance', 'Compliance Analysis', FileCheck2)}
            {navItem('evidence', 'Evidence Review', ScanEye)}
            {navItem('report', 'Inspection Report', ClipboardList)}
          </div>

          {/* REPOSITORY */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Repository
            </p>
            {navItem('history', 'Inspection History', History)}
            {navItem('repository', 'Product Repository', Boxes)}
            {navItem('violations', 'Violation History', AlertOctagon)}
          </div>

          {/* ANALYTICS */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Analytics & Trends
            </p>
            {navItem('analytics', 'Compliance Trends', TrendingUp)}
            {navItem('regional', 'Regional Analysis', MapPin)}
            {navItem('repeat-offenders', 'Repeat Findings', ShieldAlert)}
            {navItem('workload', 'Inspection Workload', Users)}
          </div>

          {/* ADMIN (Supervisor & Admin Only) */}
          {(isAdmin || isSupervisor) && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between px-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Regulatory Admin
                </p>
                <span className="rounded bg-amber-50 px-1 py-0.5 text-[9px] font-bold text-amber-800 border border-amber-200">
                  Gov Access
                </span>
              </div>
              {navItem('rules', 'Rule Database', Scale)}
              {isAdmin && navItem('users', 'User Management', Users)}
              {navItem('audit-logs', 'Audit Logs', ScrollText)}
            </div>
          )}

          {/* Help & Settings */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            {navItem('help', 'Help & Metrology Guide', HelpCircle)}
            {navItem('settings', 'Settings & Calibration', Settings)}
          </div>
        </div>

        {/* Bottom Inspector Region Badge */}
        <div className="border-t border-slate-200 p-3 bg-slate-50/70">
          <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-[11px] truncate">
                {currentUser?.name || 'Inspector'}
              </span>
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            </div>
            <p className="text-[10px] text-slate-500 truncate mt-0.5">{currentUser?.region}</p>
            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-100 pt-1">
              <span>{currentUser?.badgeNumber}</span>
              <span className="text-emerald-700 font-semibold font-sans uppercase">Field Active</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
