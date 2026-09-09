import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, AlertTriangle, Building2, Search, ArrowRight, FileWarning, Eye } from 'lucide-react';

export const RepeatOffendersView: React.FC = () => {
  const { repeatOffenders, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = repeatOffenders.filter(
    (item) =>
      item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Repeat Findings & Watchlist
            </h1>
            <span className="rounded bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 font-bold">
              48 Firms Monitored
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated intelligence identifying manufacturers and packers with recurring non-compliance across multiple inspections
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search watchlist by company name, brand, or district jurisdiction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-purple-500"
          />
        </div>
      </div>

      {/* Watchlist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((firm) => {
          const isHigh = firm.riskLevel === 'HIGH';
          const isCritical = firm.riskLevel === 'CRITICAL';

          return (
            <div
              key={firm.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{firm.companyName}</h3>
                    <p className="text-xs text-slate-500">Brand: <strong>{firm.brand}</strong> • {firm.jurisdiction}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    isCritical
                      ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-300'
                      : isHigh
                      ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {firm.riskLevel} Risk
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Violations</span>
                  <p className="text-sm font-black text-rose-700 mt-0.5">{firm.violationCount} notices</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Total Scanned</span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{firm.totalInspections}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Failure Rate</span>
                  <p className="text-sm font-black text-purple-700 mt-0.5">
                    {Math.round((firm.violationCount / firm.totalInspections) * 100)}%
                  </p>
                </div>
              </div>

              {/* Common Violations */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Recurring Infractions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {firm.commonViolations.map((v, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Last Inspection: {firm.lastInspectionDate}</span>
                <button
                  onClick={() => setActiveTab('history')}
                  className="font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Filter Inspections</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
