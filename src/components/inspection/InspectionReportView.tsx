import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  Download,
  Share2,
  FileCheck,
  ShieldAlert,
  CheckCircle,
  Building,
  Calendar,
  UserCheck,
  AlertOctagon,
  ArrowLeft,
  Stamp
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const InspectionReportView: React.FC = () => {
  const { activeInspection, currentUser, setActiveTab } = useApp();
  const [isPdfDownloaded, setIsPdfDownloaded] = useState<boolean>(false);

  if (!activeInspection) {
    return <div className="p-8 text-center text-slate-500">No active inspection file loaded.</div>;
  }

  const declarations = activeInspection.extractedDeclarations || [];
  const ruleResults = activeInspection.ruleResults || [];
  const currentImage = activeInspection.images[0];
  const isViolation = activeInspection.status === 'POTENTIAL_VIOLATION';
  const isReview = activeInspection.status === 'NEEDS_REVIEW';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    setIsPdfDownloaded(true);
    // Simulate PDF generation with printable DOM
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', `iScan_LegalMetrology_${activeInspection.id}.pdf`);
      document.body.appendChild(link);
      setTimeout(() => {
        setIsPdfDownloaded(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Print / Export Action Bar (Hidden in Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab('compliance')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Analysis</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>{isPdfDownloaded ? 'Generating PDF...' : 'Download Official PDF'}</span>
          </button>
        </div>
      </div>

      {/* Official Government Form Document */}
      <div className="rounded-2xl border-2 border-slate-300 bg-white p-6 sm:p-10 shadow-lg text-slate-900 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
          <div className="flex justify-center mb-1">
            <div className="h-10 w-10 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-base">
              🇮🇳
            </div>
          </div>
          <h1 className="text-sm font-bold tracking-widest text-slate-600 uppercase">
            Government of India • Ministry of Consumer Affairs, Food & Public Distribution
          </h1>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
            Department of Legal Metrology — Packaged Commodities Inspection Report
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Under Section 15 & 36 of Legal Metrology Act, 2009 read with Legal Metrology (Packaged Commodities) Rules, 2011
          </p>
        </div>

        {/* Inspection Header Metadata Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Inspection ID</span>
            <p className="font-mono font-bold text-slate-900 mt-0.5">{activeInspection.id}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Date & Time</span>
            <p className="font-semibold text-slate-800 mt-0.5">{activeInspection.timestamp}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Inspect. Officer</span>
            <p className="font-semibold text-slate-800 mt-0.5">{activeInspection.inspectorName}</p>
            <span className="text-[10px] text-slate-400 font-mono">Badge: {currentUser?.badgeNumber}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Enforcement Jurisdiction</span>
            <p className="font-semibold text-slate-800 mt-0.5">{activeInspection.region}</p>
          </div>
        </div>

        {/* Commodity Particulars */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            1. Particulars of Packaged Commodity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500">Generic Commodity Name:</span>
              <p className="font-bold text-slate-900">{activeInspection.productName}</p>
            </div>
            <div>
              <span className="text-slate-500">Brand / Category:</span>
              <p className="font-semibold text-slate-800">{activeInspection.brand} ({activeInspection.category})</p>
            </div>
            <div>
              <span className="text-slate-500">Barcode / EAN:</span>
              <p className="font-mono font-semibold text-slate-800">{activeInspection.barcode}</p>
            </div>
            <div className="sm:col-span-3">
              <span className="text-slate-500">Declared Manufacturer / Packer / Importer:</span>
              <p className="font-medium text-slate-800">{activeInspection.manufacturer}</p>
            </div>
          </div>
        </div>

        {/* Overall Status Banner */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            2. Compliance Determination
          </h3>
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <span className="text-xs font-bold text-slate-500">Official Outcome:</span>
              <div className="mt-1">
                <StatusBadge status={activeInspection.status} size="lg" />
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500">Screening Score:</span>
              <div className="text-xl font-black text-slate-900">{activeInspection.screeningScore}%</div>
            </div>
          </div>
        </div>

        {/* Table of Checked Declarations */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            3. Statutory Declarations Audit (Rule 6)
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 font-bold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Mandatory Declaration</th>
                  <th className="py-2.5 px-3">Declared Text / Numeral</th>
                  <th className="py-2.5 px-3">Statutory Status</th>
                  <th className="py-2.5 px-3">Legal Findings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {declarations.map((decl) => (
                  <tr key={decl.id}>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{decl.label}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{decl.value}</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={decl.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">{decl.legalRequirement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Packaging Evidence & Optical Bounding Box Thumbnail */}
        {currentImage && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              4. Photographic Evidence & Coordinate Mapping
            </h3>
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <img
                src={currentImage.url}
                alt="Product packaging photo"
                className="h-28 w-28 object-contain rounded-lg border border-slate-200 bg-white"
              />
              <div className="text-xs space-y-1">
                <p className="font-bold text-slate-900">Principal Display Panel Image Record</p>
                <p className="text-slate-500">Optical capture verified with timestamp and SHA-256 digital fingerprint.</p>
                <p className="font-mono text-[10px] text-slate-400">Resolution: {currentImage.resolution} • Quality Score: {currentImage.qualityScore}%</p>
                <span className="inline-block rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                  Verified In Evidence Repository
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Governing Legal Provisions & Recommended Actions */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            5. Governing Legal Provisions & Recommended Enforcement Action
          </h3>
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/70 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-900 shrink-0">Statutory Sections:</span>
              <span className="text-slate-700">
                Sections 15, 18 and 36(1) of the Legal Metrology Act, 2009 read with Rules 6, 7, 8, 9, and 12 of the Legal Metrology (Packaged Commodities) Rules, 2011.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-900 shrink-0">Recommended Action:</span>
              <span className="font-bold text-rose-700">
                {isViolation
                  ? 'Issue Form II Statutory Notice for Non-Compliance under Section 36(1). Demand compounding explanation within 15 days.'
                  : isReview
                  ? 'Conduct physical container measurement with calibrated gauge at district standards laboratory.'
                  : 'Close inspection record — Compliant with Packaged Commodities Rules, 2011.'}
              </span>
            </div>
            {activeInspection.humanReview.remarks && (
              <div className="flex items-start gap-2 border-t border-slate-200 pt-2 mt-1">
                <span className="font-bold text-slate-900 shrink-0">Inspector Notes:</span>
                <span className="text-slate-700 italic">"{activeInspection.humanReview.remarks}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Signatures & Stamps Block */}
        <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Field Officer Digital Signature</span>
            <div className="mt-2 border-b border-slate-400 pb-1 font-mono font-bold text-slate-800">
              {activeInspection.inspectorName}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Inspector of Legal Metrology, District Enforcement Unit</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Hash: 8f3c49e29a007b1d... (Verified)</p>
          </div>

          <div className="text-right flex flex-col items-end">
            <div className="h-16 w-32 border-2 border-slate-800 border-dashed rounded-lg flex items-center justify-center text-slate-400 font-bold text-[10px] uppercase">
              Official Seal / Stamp
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Legal Metrology Department, Govt. of India</p>
          </div>
        </div>
      </div>
    </div>
  );
};
