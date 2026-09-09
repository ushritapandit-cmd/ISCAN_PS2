import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, Calendar, Download, Filter, FileSpreadsheet } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('quarter');

  const monthlyTrendData = [
    { month: 'Apr 2026', total: 310, compliant: 190, violations: 75, review: 45 },
    { month: 'May 2026', total: 360, compliant: 220, violations: 90, review: 50 },
    { month: 'Jun 2026', total: 390, compliant: 245, violations: 95, review: 50 },
    { month: 'Jul 2026', total: 420, compliant: 260, violations: 105, review: 55 },
    { month: 'Aug 2026', total: 450, compliant: 285, violations: 110, review: 55 },
    { month: 'Sep 2026', total: 37, compliant: 23, violations: 9, review: 5 }
  ];

  const categoryComplianceData = [
    { category: 'Packaged Tea', complianceRate: 64, total: 240 },
    { category: 'Edible Oils', complianceRate: 78, total: 190 },
    { category: 'Spices & Condiments', complianceRate: 52, total: 165 },
    { category: 'Dairy & Ghee', complianceRate: 88, total: 140 },
    { category: 'Electronics & Audio', complianceRate: 45, total: 180 },
    { category: 'Bakery & Biscuits', complianceRate: 72, total: 160 },
    { category: 'Cosmetics & Personal', complianceRate: 58, total: 173 }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Compliance Intelligence & Trends
            </h1>
            <span className="rounded bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 font-bold">
              Quarterly Insights
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Statistical breakdown of Legal Metrology inspection outcomes, enforcement actions, and sector adherence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-md font-semibold ${
                timeRange === 'month' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('quarter')}
              className={`px-3 py-1.5 rounded-md font-semibold ${
                timeRange === 'quarter' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Quarter
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1.5 rounded-md font-semibold ${
                timeRange === 'year' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inspection Volume Trend (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Enforcement Volume & Outcomes</h2>
              <p className="text-xs text-slate-500">Monthly inspection trajectories</p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="compliant" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Compliant" />
                <Area type="monotone" dataKey="review" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Needs Review" />
                <Area type="monotone" dataKey="violations" stackId="1" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.6} name="Violations" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Compliance Rates (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Compliance Rate by Commodity Category</h2>
            <p className="text-xs text-slate-500 mt-0.5">Percentage passing all Rule 6 declarations</p>
          </div>

          <div className="h-72 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={categoryComplianceData} margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} unit="%" />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 10, fill: '#475569' }} width={100} />
                <Tooltip
                  formatter={(value: any) => [`${value}% Compliant`, 'Compliance Rate']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="complianceRate" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-100 pt-3 flex justify-between">
            <span>Lowest compliance: Electronics (45%)</span>
            <span>Highest: Dairy & Ghee (88%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
