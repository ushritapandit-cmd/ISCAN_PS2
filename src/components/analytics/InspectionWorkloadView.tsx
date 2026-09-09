import React from 'react';
import { Users, Clock, CheckCircle2, TrendingUp, Award, Calendar } from 'lucide-react';
import { INITIAL_USERS } from '../../data/mockDatabase';

export const InspectionWorkloadView: React.FC = () => {
  const inspectors = [
    { name: 'Inspector Rajesh Sharma', badge: 'LM-INS-2024-089', region: 'Assam / Kamrup Metro', today: 14, monthly: 168, avgTime: '4.2 min', accuracy: '98.5%' },
    { name: 'Inspector Priyadarshini Das', badge: 'LM-INS-2024-092', region: 'Meghalaya / East Khasi Hills', today: 11, monthly: 142, avgTime: '5.1 min', accuracy: '97.8%' },
    { name: 'Inspector Tenzing Norbu', badge: 'LM-INS-2024-104', region: 'Arunachal Pradesh / Papum Pare', today: 9, monthly: 120, avgTime: '4.8 min', accuracy: '99.1%' },
    { name: 'Inspector Nongthombam Singh', badge: 'LM-INS-2024-118', region: 'Manipur / Imphal West', today: 8, monthly: 110, avgTime: '5.4 min', accuracy: '96.9%' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Inspection Workload & Field Performance
            </h1>
            <span className="rounded bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 font-bold">
              Team Throughput
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time inspection turnaround time, monthly field quotas, and AI verification accuracy metrics
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Inspection Turnaround</span>
          <p className="text-2xl font-black text-slate-900 mt-1">4.8 min</p>
          <span className="text-[11px] font-medium text-emerald-600">65% faster with i-Scan AI</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Inspections This Month</span>
          <p className="text-2xl font-black text-slate-900 mt-1">540</p>
          <span className="text-[11px] font-medium text-slate-500">Across 8 NE Districts</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">AI OCR Acceptance Rate</span>
          <p className="text-2xl font-black text-slate-900 mt-1">94.2%</p>
          <span className="text-[11px] font-medium text-emerald-600">High officer concordance</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Field Officers</span>
          <p className="text-2xl font-black text-slate-900 mt-1">18 Officers</p>
          <span className="text-[11px] font-medium text-blue-600">100% on-duty</span>
        </div>
      </div>

      {/* Inspectors Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-900">Field Officer Roster & Daily Targets</h2>
          <span className="text-xs text-slate-400">Target: 10 scans / officer / day</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Officer Name & Badge</th>
                <th className="py-3 px-4">Field District</th>
                <th className="py-3 px-4">Today's Scans</th>
                <th className="py-3 px-4">Monthly Total</th>
                <th className="py-3 px-4">Avg Processing Time</th>
                <th className="py-3 px-4">Audit Agreement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inspectors.map((insp, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{insp.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{insp.badge}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{insp.region}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{insp.today}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{insp.monthly}</td>
                  <td className="py-3 px-4 text-slate-600">{insp.avgTime}</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">{insp.accuracy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
