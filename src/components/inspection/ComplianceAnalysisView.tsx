import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  ScanEye,
  ClipboardList,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Info,
  UserCheck,
  Building2,
  Printer
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { HumanReviewModal } from './HumanReviewModal';

export const ComplianceAnalysisView: React.FC = () => {
  const { activeInspection, setActiveTab, confirmRuleFinding } = useApp();
  const [selectedRuleIdForReview, setSelectedRuleIdForReview] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  if (!activeInspection) {
    return (
      <div className="p-8 text-center text-slate-500">
        No active inspection loaded. Please start a new inspection or select one from history.
      </div>
    );
  }

  const ruleResults = activeInspection.ruleResults || [];
  const violations = ruleResults.filter((r) => r.result === 'POTENTIAL_VIOLATION');
  const reviews = ruleResults.filter((r) => r.result === 'NEEDS_REVIEW');
  const passes = ruleResults.filter((r) => r.result === 'PASS');

  const handleOpenReview = (ruleId?: string) => {
    setSelectedRuleIdForReview(ruleId || null);
    setShowReviewModal(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Compliance Engine Analysis
            </h1>
            <span className="rounded bg-slate-100 text-slate-700 text-xs px-2 py-0.5 font-bold border border-slate-200">
              Deterministic Rules
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Inspection ID: <span className="font-mono font-bold text-slate-800">{activeInspection.id}</span> • {activeInspection.productName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('evidence')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer"
          >
            <ScanEye className="h-4 w-4 text-slate-500" />
            <span>Evidence Viewer</span>
          </button>
          <button
            onClick={() => handleOpenReview()}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
          >
            <UserCheck className="h-4 w-4" />
            <span>Inspector Verification</span>
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-xs cursor-pointer"
          >
            <ClipboardList className="h-4 w-4 text-emerald-400" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Primary Status Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Overall Compliance Finding
              </span>
              <StatusBadge status={activeInspection.status} size="lg" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {activeInspection.status === 'COMPLIANT'
                ? 'Product packaging conforms to all statutory provisions of Legal Metrology Rules, 2011.'
                : activeInspection.status === 'NEEDS_REVIEW'
                ? 'Manual inspection and measurement required before confirming statutory compliance.'
                : 'Potential violations detected. Review evidence below before issuing Form II notice.'}
            </p>
          </div>

          {/* Screening Score Dial / Metric */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-3.5 shrink-0">
            <div className="text-center">
              <div className="text-2xl font-black text-slate-900">
                {activeInspection.screeningScore}%
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Screening Score
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-xs space-y-0.5">
              <div className="text-emerald-700 font-bold">{passes.length} Compliant</div>
              <div className="text-rose-700 font-bold">{violations.length} Potential Violations</div>
              <div className="text-amber-700 font-bold">{reviews.length} Needs Review</div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 text-blue-700 mt-0.5" />
          <span>
            <strong>Statutory Notice:</strong> The automated screening score assists operational prioritization.
            Legal determination under the Legal Metrology Act, 2009 rests solely with the authorized Legal Metrology Officer following human evidence verification.
          </span>
        </div>
      </div>

      {/* Detailed Rule Results Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Statutory Rule Evaluation Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Direct mapping to Legal Metrology (Packaged Commodities) Rules, 2011
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {ruleResults.length} Rule Checks Evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rule & Section</th>
                <th className="py-3 px-4">Statutory Requirement</th>
                <th className="py-3 px-4">Engine Finding & Evidence</th>
                <th className="py-3 px-4">AI Result</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Inspector Review</th>
                <th className="py-3 px-4 text-right">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ruleResults.map((rule) => {
                return (
                  <tr key={rule.ruleId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {rule.ruleId}
                    </td>
                    <td className="py-3.5 px-4 max-w-[180px]">
                      <div className="font-bold text-slate-900">{rule.ruleName}</div>
                      <div className="text-[11px] text-slate-400">{rule.requirement}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <p className="text-slate-700 leading-snug">{rule.evidenceNotes}</p>
                      {rule.recommendation && (
                        <p className="text-[11px] text-slate-400 mt-0.5 italic">
                          Action: {rule.recommendation}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={rule.result} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-700">
                      {rule.confidence}%
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenReview(rule.ruleId)}
                        className={`text-xs font-semibold px-2 py-1 rounded border transition-colors ${
                          rule.verifiedStatus === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : rule.verifiedStatus === 'REJECTED'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {rule.verifiedStatus === 'CONFIRMED'
                          ? '✓ Confirmed'
                          : rule.verifiedStatus === 'REJECTED'
                          ? '✗ Dismissed'
                          : 'Pending Review'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setActiveTab('evidence')}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Human Review Modal */}
      {showReviewModal && (
        <HumanReviewModal
          selectedRuleId={selectedRuleIdForReview}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
};
