import React from 'react';
import { InspectionStatus, VerificationStatus } from '../../types';
import { CheckCircle, AlertTriangle, XCircle, Clock, ShieldCheck, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: InspectionStatus | VerificationStatus | 'PASS' | 'POTENTIAL_VIOLATION' | 'NEEDS_REVIEW' | 'NOT_APPLICABLE' | 'pass' | 'fail' | 'review' | 'valid' | 'violation';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const norm = String(status).toUpperCase();

  let bg = 'bg-slate-100 text-slate-700 border-slate-300';
  let label = 'Unknown';
  let Icon = HelpCircle;

  if (norm === 'COMPLIANT' || norm === 'PASS' || norm === 'VALID' || norm === 'CONFIRMED') {
    bg = 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-500/20';
    label = norm === 'CONFIRMED' ? 'Confirmed' : 'Compliant';
    Icon = CheckCircle;
  } else if (norm === 'NEEDS_REVIEW' || norm === 'REVIEW' || norm === 'MODIFIED' || norm === 'PENDING_SUPERVISOR') {
    bg = 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-500/20';
    label = 'Needs Review';
    Icon = AlertTriangle;
  } else if (norm === 'POTENTIAL_VIOLATION' || norm === 'FAIL' || norm === 'VIOLATION' || norm === 'REJECTED') {
    bg = 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-500/20';
    label = norm === 'REJECTED' ? 'Rejected' : 'Potential Non-Compliance';
    Icon = XCircle;
  } else if (norm === 'UNVERIFIED') {
    bg = 'bg-blue-50 text-blue-800 border-blue-300 ring-1 ring-blue-500/20';
    label = 'Pending Review';
    Icon = Clock;
  } else if (norm === 'NOT_APPLICABLE') {
    bg = 'bg-slate-100 text-slate-600 border-slate-300';
    label = 'Not Applicable';
    Icon = ShieldCheck;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm sm:text-base font-bold px-3.5 py-1.5 gap-2'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium whitespace-nowrap shadow-xs ${bg} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5 shrink-0'} />}
      <span>{label}</span>
    </span>
  );
};
