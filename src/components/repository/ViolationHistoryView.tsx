import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, Search, Filter, ArrowRight, ShieldAlert, FileText, Send } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const ViolationHistoryView: React.FC = () => {
  const { inspections, setActiveInspection, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Extract all violations across past inspections
  const violations = inspections.filter((i) => i.status === 'POTENTIAL_VIOLATION' || i.status === 'NEEDS_REVIEW');

  const filtered = violations.filter(
    (v) =>
      v.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Violation & Enforcement History
            </h1>
            <span className="rounded bg-rose-100 text-rose-800 text-xs px-2.5 py-0.5 font-bold">
              {violations.length} Flagged Cases
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log of packaging commodities flagged for non-compliance under Legal Metrology Rules, 2011 and Section 36(1)
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search flagged cases by product, firm name, or notice ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-rose-500"
          />
        </div>
      </div>

      {/* Violation Cards Grid */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const brokenRules = item.ruleResults.filter((r) => r.result === 'POTENTIAL_VIOLATION' || r.result === 'NEEDS_REVIEW');

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-rose-200 bg-white p-5 shadow-2xs hover:border-rose-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {item.id}
                  </span>
                  <StatusBadge status={item.status} size="sm" />
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{item.timestamp}</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{item.productName}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Manufacturer / Offending Entity: <strong className="text-slate-800">{item.manufacturer}</strong>
                  </p>
                </div>

                {/* Specific Broken Rules */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {brokenRules.map((r) => (
                    <span
                      key={r.ruleId}
                      className="inline-flex items-center gap-1 rounded-md bg-rose-50 text-rose-800 text-[11px] font-semibold px-2 py-0.5 border border-rose-200"
                    >
                      <AlertOctagon className="h-3 w-3" />
                      <span>{r.ruleId}: {r.ruleName}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <button
                  onClick={() => {
                    setActiveInspection(item);
                    setActiveTab('compliance');
                  }}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  View Case
                </button>
                <button
                  onClick={() => {
                    setActiveInspection(item);
                    setActiveTab('report');
                  }}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Enforcement Notice</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
