import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Camera,
  Plus,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Globe,
  ArrowRight,
  Clock,
  Building2,
  CheckCircle2,
  ScanLine
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { DEMO_PRESETS } from '../../data/demoProducts';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    startNewInspection,
    setActiveTab,
    setActiveInspection,
    inspections
  } = useApp();

  // Dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const officerName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Officer';

  // 3 most recent inspections for clean display without overcrowding
  const recentRecords = inspections.slice(0, 3);

  return (
    <div className="min-h-full bg-slate-50/50 pb-20 lg:pb-10">
      <div className="max-w-xl mx-auto px-4 py-5 sm:px-6 sm:py-6 space-y-6">

        {/* 1. Welcome Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Department of Legal Metrology
            </span>
            <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Field Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            {getGreeting()}, {officerName}
          </h1>
          <p className="text-sm text-slate-600 font-normal">
            Start a package compliance inspection.
          </p>
        </div>

        {/* 2. PRIMARY ACTIONS: New Inspection & Real QR Scanner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => startNewInspection(DEMO_PRESETS[1])}
            className="group text-left rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-5 sm:p-6 text-white shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-emerald-800 active:scale-[0.99] transition-all cursor-pointer border border-emerald-500/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs border border-white/20 text-white shadow-xs">
                  <Camera className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight">
                      + New Inspection
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                    Scan packaging multi-angle photos
                  </p>
                  <p className="text-[11px] text-emerald-200/90 pt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 inline text-emerald-300 shrink-0" />
                    Auto-checks Rules 6, 7 & Schedule II
                  </p>
                </div>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white group-hover:translate-x-0.5 transition-transform">
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('qr-scanner')}
            className="group text-left rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 sm:p-6 text-white shadow-md hover:shadow-lg hover:from-slate-800 hover:to-slate-700 active:scale-[0.99] transition-all cursor-pointer border border-slate-700"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-xs">
                  <ScanLine className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight">
                      Scan QR Code
                    </span>
                    <span className="rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.2 border border-emerald-400/30">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                    Real camera QR & GS1 digital link
                  </p>
                  <p className="text-[11px] text-emerald-400/90 pt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 inline text-emerald-400 shrink-0" />
                    Instant commodity declaration match
                  </p>
                </div>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white group-hover:translate-x-0.5 transition-transform">
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </button>
        </div>

        {/* 3. Quick Stats (Clean 3-column row) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Inspection Overview
            </h2>
            <span className="text-[11px] font-semibold text-slate-500">
              Today: 37 scans
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {/* Total Inspections */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-2xs">
              <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                1,248
              </div>
              <div className="text-[11px] font-bold text-slate-600 mt-0.5 truncate">
                Inspections
              </div>
            </div>

            {/* Violations Found */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-center shadow-2xs">
              <div className="text-lg sm:text-xl font-black text-rose-700 tracking-tight">
                342
              </div>
              <div className="text-[11px] font-bold text-rose-800 mt-0.5 truncate">
                Violations
              </div>
            </div>

            {/* Compliant */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-center shadow-2xs">
              <div className="text-lg sm:text-xl font-black text-emerald-700 tracking-tight">
                706
              </div>
              <div className="text-[11px] font-bold text-emerald-800 mt-0.5 truncate">
                Compliant
              </div>
            </div>
          </div>
        </div>

        {/* 4. Secondary Action: E-Commerce Rule 6(10) Checker */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">
                E-Commerce Rule 6(10) Audit
              </span>
              <span className="text-[11px] text-slate-500">
                Verify Amazon, Blinkit, Flipkart listings
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('ecommerce')}
            className="shrink-0 text-xs font-bold text-blue-700 hover:text-blue-800 px-2.5 py-1.5 rounded-lg bg-blue-50/70 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            Check URL
          </button>
        </div>

        {/* 5. Recent Inspections (2–3 records) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Recent Inspections
            </h2>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-2">
            {recentRecords.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setActiveInspection(item);
                  setActiveTab('compliance');
                }}
                className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-600">
                      {item.id}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-500 truncate">
                      {item.timestamp.split(',')[0]}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {item.productName}
                  </h3>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="truncate max-w-[140px] sm:max-w-[200px]">
                      {item.manufacturer}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={item.status} size="sm" />
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Help / Reference Tip */}
        <div className="rounded-xl bg-slate-100/80 p-3 text-center border border-slate-200/60">
          <p className="text-[11px] text-slate-500">
            Legal Metrology Act, 2009 • Packaged Commodities Rules, 2011
          </p>
        </div>

      </div>
    </div>
  );
};
