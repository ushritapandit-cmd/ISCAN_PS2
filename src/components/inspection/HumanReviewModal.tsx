import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, PenTool, UserCheck } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface HumanReviewModalProps {
  selectedRuleId?: string | null;
  onClose: () => void;
}

export const HumanReviewModal: React.FC<HumanReviewModalProps> = ({ selectedRuleId, onClose }) => {
  const { activeInspection, currentUser, confirmRuleFinding, finalizeInspection } = useApp();

  const [decision, setDecision] = useState<VerificationStatus>('CONFIRMED');
  const [remarks, setRemarks] = useState<string>('Evidence examined on physical container. Verified with statutory requirements.');
  const [isSignConfirmed, setIsSignConfirmed] = useState<boolean>(true);

  if (!activeInspection) return null;

  const handleSave = () => {
    if (selectedRuleId) {
      confirmRuleFinding(selectedRuleId, decision, remarks);
    } else {
      // Global finalize inspection
      finalizeInspection(remarks);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Human Inspector Determination</h3>
              <p className="text-xs text-slate-500">
                {selectedRuleId ? `Rule ${selectedRuleId}` : 'Final Inspection Sign-Off'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Commodity Info */}
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Inspection File:</span>
            <span className="font-mono font-bold text-slate-800">{activeInspection.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Packaged Commodity:</span>
            <span className="font-bold text-slate-900 truncate max-w-[240px]">{activeInspection.productName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Authorized Officer:</span>
            <span className="font-semibold text-slate-800">{currentUser?.name} ({currentUser?.badgeNumber})</span>
          </div>
        </div>

        {/* 4 Decision Options */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Official Decision</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDecision('CONFIRMED')}
              className={`rounded-xl border p-2.5 text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                decision === 'CONFIRMED'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Confirm Finding</span>
            </button>

            <button
              onClick={() => setDecision('REJECTED')}
              className={`rounded-xl border p-2.5 text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                decision === 'REJECTED'
                  ? 'border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-500/20'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>Reject / Dismiss</span>
            </button>

            <button
              onClick={() => setDecision('MODIFIED')}
              className={`rounded-xl border p-2.5 text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                decision === 'MODIFIED'
                  ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Modify Details</span>
            </button>

            <button
              onClick={() => setDecision('PENDING_SUPERVISOR')}
              className={`rounded-xl border p-2.5 text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                decision === 'PENDING_SUPERVISOR'
                  ? 'border-purple-500 bg-purple-50 text-purple-900 ring-2 ring-purple-500/20'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-purple-600 shrink-0" />
              <span>Escalate to Supervisor</span>
            </button>
          </div>
        </div>

        {/* Inspector Remarks */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Official Enforcement Remarks</label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-emerald-500"
            placeholder="Document legal reasoning or physical measurement observations..."
          />
        </div>

        {/* Signature Confirmation Checkbox */}
        <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
          <input
            type="checkbox"
            id="sigCheck"
            checked={isSignConfirmed}
            onChange={(e) => setIsSignConfirmed(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="sigCheck" className="cursor-pointer">
            Attach digital verification signature of <strong>{currentUser?.name}</strong> under Legal Metrology Act, 2009.
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isSignConfirmed}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs disabled:opacity-50 cursor-pointer"
          >
            Save Determination
          </button>
        </div>
      </div>
    </div>
  );
};
