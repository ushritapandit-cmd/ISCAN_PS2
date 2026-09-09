import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Scale,
  IndianRupee,
  Type,
  HelpCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const DataValidationView: React.FC = () => {
  const { activeInspection, setActiveTab } = useApp();

  const measurements = activeInspection?.measurements;
  const declarations = activeInspection?.extractedDeclarations || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Data & Measurement Validation
            </h1>
            <span className="rounded bg-slate-100 text-slate-700 text-xs px-2 py-0.5 font-bold border border-slate-200">
              Stage 3: Statutory Check
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Validation of metric standards, tax clauses, and numeral dimensions under Legal Metrology Rules, 2011
          </p>
        </div>

        <button
          onClick={() => setActiveTab('compliance')}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
        >
          <span>Run Compliance Analysis</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Validation Modules Grid: MRP, Net Quantity, Font/Readability */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Module 1: MRP & Tax Inclusive Validation */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">MRP Verification</h3>
              </div>
              <StatusBadge status={measurements?.mrp.status || 'pass'} size="sm" />
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Detected Value</span>
                <span className="font-bold text-slate-900">{measurements?.mrp.value}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Currency Symbol</span>
                <span className="font-semibold text-slate-800">{measurements?.mrp.detectedCurrency}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tax Clause</span>
                <span className={`font-bold ${measurements?.mrp.taxInclusiveClause ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {measurements?.mrp.taxInclusiveClause ? '✓ Declared' : '✗ Missing'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Unit Sale Price</span>
                <span className="font-medium text-slate-800">{measurements?.mrp.unitPriceText || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] bg-slate-50 p-2.5 rounded-lg text-slate-500 border border-slate-100">
            Rule 6(1)(d) mandates unambiguous retail price with "inclusive of all taxes".
          </div>
        </div>

        {/* Module 2: Net Quantity & Metric Standards */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                  <Scale className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Net Quantity</h3>
              </div>
              <StatusBadge status={measurements?.netQuantity.status || 'pass'} size="sm" />
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Quantity</span>
                <span className="font-bold text-slate-900">{measurements?.netQuantity.quantity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Metric Unit</span>
                <span className="font-mono font-bold text-slate-800">{measurements?.netQuantity.unit}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Standard SI Symbol</span>
                <span className={`font-bold ${measurements?.netQuantity.standardSymbolUsed ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {measurements?.netQuantity.standardSymbolUsed ? '✓ Standard (SI)' : '✗ Non-Conforming'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Rule Reference</span>
                <span className="font-medium text-slate-800">Rule 12 / Second Schedule</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] bg-slate-50 p-2.5 rounded-lg text-slate-500 border border-slate-100">
            Standard symbols: g, kg, ml, l. Units like "gms", "kgs", "ml." violate Rule 12.
          </div>
        </div>

        {/* Module 3: Font Size & Readability */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                  <Type className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Font & Numeral Size</h3>
              </div>
              <StatusBadge status={measurements?.fontAnalysis.status || 'review'} size="sm" />
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Estimated Height</span>
                <span className="font-bold text-slate-900">
                  {measurements?.fontAnalysis.estimatedNumeralHeightMm} mm
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Statutory Minimum</span>
                <span className="font-semibold text-slate-800">
                  {measurements?.fontAnalysis.minimumRequiredMm} mm
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Contrast Ratio</span>
                <span className="font-semibold text-slate-800">
                  {measurements?.fontAnalysis.contrastRatio} : 1
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Optical Clarity</span>
                <span className="font-bold text-emerald-700">
                  {measurements?.fontAnalysis.readabilityScore}%
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] bg-amber-50 p-2.5 rounded-lg text-amber-900 border border-amber-200 flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0 text-amber-700 mt-0.5" />
            <span>AI font height is advisory. Physical calibrated gauge measurement is legally required for prosecution.</span>
          </div>
        </div>
      </div>

      {/* Visual Checklist of 8 Mandatory Declarations */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Mandatory Declarations Checklist (Rule 6 Compliance)
            </h3>
            <p className="text-xs text-slate-500">
              Complete inventory of statutory disclosures required on every pre-packaged commodity
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {declarations.filter((d) => d.status === 'pass').length} / {declarations.length} Detected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {declarations.map((decl) => {
            const isPass = decl.status === 'pass';
            const isReview = decl.status === 'review';

            return (
              <div
                key={decl.id}
                className={`flex items-start justify-between p-3 rounded-xl border transition-all ${
                  isPass
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : isReview
                    ? 'border-amber-200 bg-amber-50/40'
                    : 'border-rose-200 bg-rose-50/40'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {isPass ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : isReview ? (
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">{decl.label}</span>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{decl.value}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{decl.legalRequirement}</span>
                  </div>
                </div>

                <StatusBadge status={decl.status} size="sm" />
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setActiveTab('compliance')}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Proceed to Compliance Engine Analysis</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
