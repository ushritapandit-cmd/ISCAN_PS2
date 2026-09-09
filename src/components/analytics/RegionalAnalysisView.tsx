import React, { useState } from 'react';
import { REGIONAL_DATA } from '../../data/mockDatabase';
import { MapPin, Search, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const RegionalAnalysisView: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('Assam');

  const activeRegion = REGIONAL_DATA.find((r) => r.state === selectedState) || REGIONAL_DATA[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Regional Compliance Intelligence
            </h1>
            <span className="rounded bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 font-bold">
              North East Focus Zone
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Jurisdictional inspection coverage, regional non-compliance heatmaps, and enforcement unit quotas
          </p>
        </div>
      </div>

      {/* States Grid & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: State Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            North Eastern States & Territories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REGIONAL_DATA.map((reg) => {
              const isSelected = reg.state === selectedState;
              const passRate = Math.round((reg.compliant / reg.inspections) * 100);

              return (
                <button
                  key={reg.state}
                  onClick={() => setSelectedState(reg.state)}
                  className={`text-left rounded-2xl border p-4 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      {reg.state}
                    </span>
                    <span className="text-xs font-black text-slate-900">{passRate}% Pass</span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Inspections:</span>
                      <span className="font-semibold text-slate-800">{reg.inspections}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Violations:</span>
                      <span className="font-bold text-rose-600">{reg.violations}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-100">
                      <span>Top Issue:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[140px]">{reg.topViolation}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected State Deep Dive (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
              Jurisdiction Profile
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-0.5">{activeRegion.state}</h2>
            <p className="text-xs text-slate-500">Regional Legal Metrology Directorate Field Division</p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Total Scans</span>
                <p className="text-xl font-black text-slate-900 mt-0.5">{activeRegion.inspections}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Flagged Notices</span>
                <p className="text-xl font-black text-rose-600 mt-0.5">{activeRegion.violations}</p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 space-y-1 text-xs">
              <span className="font-bold text-amber-900">Primary Compliance Vulnerability</span>
              <p className="text-amber-800 font-medium">{activeRegion.topViolation}</p>
              <p className="text-[11px] text-amber-700 mt-1">
                District enforcement teams have been issued targeted directives to inspect this specific declaration in retail markets.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-3.5 space-y-2 text-xs">
              <span className="font-bold text-slate-800">Operational Enforcement Units</span>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>District Headquarters:</span>
                  <span className="font-semibold text-slate-900">Active (4 teams)</span>
                </div>
                <div className="flex justify-between">
                  <span>Border & Checkpost Mobile Units:</span>
                  <span className="font-semibold text-slate-900">Active (2 teams)</span>
                </div>
                <div className="flex justify-between">
                  <span>Field Officer Coverage:</span>
                  <span className="font-semibold text-emerald-700">100% Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
