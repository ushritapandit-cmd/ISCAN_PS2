import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { IScanLogo } from './IScanLogo';
import {
  Bell,
  Search,
  Shield,
  UserCheck,
  ChevronDown,
  Sparkles,
  PlusCircle,
  Menu,
  FileText,
  LogOut,
  SlidersHorizontal,
  QrCode
} from 'lucide-react';
import { DEMO_PRESETS } from '../../data/demoProducts';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    loginAs,
    logout,
    startNewInspection,
    notifications,
    setIsSearchOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    setIsDemoQrModalOpen,
    demoMode,
    setDemoMode,
    setActiveTab
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-3.5 sm:px-6 backdrop-blur-xs">
      {/* Left side: Logo shifted cleanly to the left with even spacing */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 transition-colors lg:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <IScanLogo size="sm" />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold tracking-tight text-slate-900 text-base sm:text-lg">
                i-Scan
              </span>
              <span className="hidden xs:inline-block rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                Gov. of India
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDemoQrModalOpen(true);
                }}
                title="Hackathon Demo Mode: Click to open test QR codes"
                className="inline-flex items-center gap-1 rounded-full bg-slate-900 text-emerald-300 px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>HACKATHON DEMO MODE</span>
              </button>
            </div>
            <p className="hidden sm:block text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
              Legal Metrology Compliance
            </p>
          </div>
        </div>
      </div>

      {/* Right side actions: Clean, evenly spaced icons and small profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-2 sm:px-2.5 sm:py-1.5 text-xs text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Search products, inspections, rules (Ctrl+K)"
        >
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden md:inline-block rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-200">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Demo QR Codes Modal trigger */}
        <button
          onClick={() => setIsDemoQrModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 shadow-2xs transition-colors cursor-pointer"
          title="Open Hackathon Demo QR codes"
        >
          <QrCode className="h-3.5 w-3.5 text-emerald-600" />
          <span>Demo QRs</span>
        </button>

        {/* Primary Action: New Inspection (Desktop shortcut) */}
        <button
          onClick={() => startNewInspection()}
          className="hidden md:flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>New Inspection</span>
        </button>

        {/* Role Switcher / Small User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            aria-label="Account and role menu"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 sm:px-2 sm:py-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-xs">
              {currentUser?.name.charAt(0) || 'O'}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                {currentUser?.name}
              </p>
              <p className="text-[10px] font-bold uppercase text-emerald-700">
                {currentUser?.role === 'inspector' ? 'Field Officer' : currentUser?.role}
              </p>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400 hidden sm:block" />
          </button>

          {/* Role Dropdown */}
          {showRoleMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
              <div className="border-b border-slate-100 p-2">
                <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500">{currentUser?.email}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{currentUser?.badgeNumber}</p>
              </div>

              <div className="py-2">
                <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Role
                </p>
                <button
                  onClick={() => {
                    loginAs('inspector');
                    setShowRoleMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-left cursor-pointer ${
                    currentUser?.role === 'inspector' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Inspector (Rajesh Sharma)</span>
                  </div>
                  {currentUser?.role === 'inspector' && <span className="text-emerald-600">✓</span>}
                </button>
                <button
                  onClick={() => {
                    loginAs('supervisor');
                    setShowRoleMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-left cursor-pointer ${
                    currentUser?.role === 'supervisor' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-amber-600" />
                    <span>Supervisor (Dr. Ananya Roy)</span>
                  </div>
                  {currentUser?.role === 'supervisor' && <span className="text-emerald-600">✓</span>}
                </button>
                <button
                  onClick={() => {
                    loginAs('admin');
                    setShowRoleMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-left cursor-pointer ${
                    currentUser?.role === 'admin' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-purple-600" />
                    <span>Admin (Vikram Sengupta)</span>
                  </div>
                  {currentUser?.role === 'admin' && <span className="text-emerald-600">✓</span>}
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    setActiveTab('settings');
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Settings & Calibration</span>
                </button>
                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 cursor-pointer font-medium"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
