import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  RecentScanItem,
  getRecentScans,
  deleteRecentScan,
  clearRecentScans,
  resetToDefaultScans,
  subscribeToRecentScans,
  formatRelativeTime
} from '../../services/recentScansService';
import { createInspectionFromLookup } from '../../services/qrService';
import { ProductResultCard } from '../inspection/ProductResultCard';
import {
  QrCode,
  Clock,
  Trash2,
  Copy,
  Check,
  Camera,
  ArrowRight,
  Eye,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  X,
  Barcode,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface RecentQrScansSectionProps {
  onScanItemSelect?: (scan: RecentScanItem) => void;
}

export const RecentQrScansSection: React.FC<RecentQrScansSectionProps> = ({ onScanItemSelect }) => {
  const { currentUser, inspections, setActiveInspection, setActiveTab, addAuditLog } = useApp();
  const [scans, setScans] = useState<RecentScanItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'compliant' | 'violations' | 'unregistered'>('all');
  const [selectedScanForModal, setSelectedScanForModal] = useState<RecentScanItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  useEffect(() => {
    // Initial load
    setScans(getRecentScans());

    // Subscribe to live scan events
    const unsubscribe = subscribeToRecentScans((updated) => {
      setScans(updated);
    });

    return () => unsubscribe();
  }, []);

  const handleCopyBarcode = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteRecentScan(id);
  };

  const handleClearAll = () => {
    clearRecentScans();
    setShowClearConfirm(false);
  };

  const handleResetDemo = () => {
    resetToDefaultScans();
  };

  const handleRevisitScan = (scan: RecentScanItem) => {
    if (onScanItemSelect) {
      onScanItemSelect(scan);
    }
    setSelectedScanForModal(scan);
  };

  const handleRunInspection = (scan: RecentScanItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const inspectorName = currentUser?.name || 'Authorized Field Inspector';
    const inspectorId = currentUser?.id || 'usr-insp-1';

    const synthesized = createInspectionFromLookup(
      scan.lookupResult,
      inspectorName,
      inspectorId,
      inspections.length
    );

    setActiveInspection(synthesized);
    addAuditLog(
      'Inspection Initiated',
      'Recent QR Scans',
      synthesized.id,
      `Revisited recent scan ${scan.productName} (${scan.barcode}) and initialized inspection.`
    );

    setSelectedScanForModal(null);
    setActiveTab('scanner');
  };

  const handleGenerateReportFromModal = (scan: RecentScanItem) => {
    const inspectorName = currentUser?.name || 'Authorized Field Inspector';
    const inspectorId = currentUser?.id || 'usr-insp-1';

    const synthesized = createInspectionFromLookup(
      scan.lookupResult,
      inspectorName,
      inspectorId,
      inspections.length
    );

    setActiveInspection(synthesized);
    setSelectedScanForModal(null);
    setActiveTab('compliance');
  };

  // Filtered items
  const filteredScans = scans.filter((s) => {
    if (filter === 'compliant') return s.complianceStatus === 'COMPLIANT';
    if (filter === 'violations') return s.complianceStatus === 'NON-COMPLIANT';
    if (filter === 'unregistered') return !s.productFound || s.complianceStatus === 'PARTIALLY_VERIFIED';
    return true;
  });

  const compliantCount = scans.filter((s) => s.complianceStatus === 'COMPLIANT').length;
  const violationsCount = scans.filter((s) => s.complianceStatus === 'NON-COMPLIANT').length;
  const unregisteredCount = scans.filter((s) => !s.productFound || s.complianceStatus === 'PARTIALLY_VERIFIED').length;

  return (
    <div id="recent-qr-scans-section" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Recent QR Scans
              </h2>
              <span className="rounded-full bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 font-bold border border-slate-200">
                {scans.length} {scans.length === 1 ? 'item' : 'items'} logged
              </span>
              {scans.length > 0 && (
                <span className="text-[11px] text-slate-500 hidden md:inline">
                  • Last scan: {formatRelativeTime(scans[0].scannedAt)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Commodity packages scanned and decoded during field inspection sessions. Click any card to revisit full statutory findings.
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          {scans.length > 0 && (
            <>
              {showClearConfirm ? (
                <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 rounded-xl p-1">
                  <span className="text-[11px] font-bold text-rose-700 px-1.5">Clear all?</span>
                  <button
                    onClick={handleClearAll}
                    className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-2.5 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Clear recent scans history"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </>
          )}

          <button
            onClick={() => setActiveTab('qr-scanner')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Scan QR Code</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs (when scans exist) */}
      {scans.length > 0 && (
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Scans ({scans.length})
            </button>
            <button
              onClick={() => setFilter('compliant')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filter === 'compliant'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Compliant ({compliantCount})
            </button>
            <button
              onClick={() => setFilter('violations')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filter === 'violations'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Violations ({violationsCount})
            </button>
            <button
              onClick={() => setFilter('unregistered')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filter === 'unregistered'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Unregistered / Partial ({unregisteredCount})
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-medium shrink-0 hidden sm:block">
            Showing {filteredScans.length} of {scans.length} recent records
          </div>
        </div>
      )}

      {/* Scans Cards Grid */}
      {filteredScans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScans.map((scan) => {
            const isCompliant = scan.complianceStatus === 'COMPLIANT';
            const isViolation = scan.complianceStatus === 'NON-COMPLIANT';
            const isUnregistered = !scan.productFound || scan.complianceStatus === 'PARTIALLY_VERIFIED';

            return (
              <div
                key={scan.id}
                onClick={() => handleRevisitScan(scan)}
                className={`rounded-2xl border p-4 shadow-2xs transition-all flex flex-col justify-between group cursor-pointer hover:shadow-md ${
                  isCompliant
                    ? 'border-emerald-200/80 bg-linear-to-b from-white to-emerald-50/20 hover:border-emerald-400'
                    : isViolation
                    ? 'border-rose-200/80 bg-linear-to-b from-white to-rose-50/20 hover:border-rose-400'
                    : 'border-amber-200/80 bg-linear-to-b from-white to-amber-50/20 hover:border-amber-400'
                }`}
              >
                {/* Top Row: Format & Time */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="rounded-md bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 border border-slate-200">
                        {scan.format}
                      </span>
                      {scan.productFound ? (
                        <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[120px]">
                          {scan.category}
                        </span>
                      ) : (
                        <span className="rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5">
                          Unregistered
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {formatRelativeTime(scan.scannedAt)}
                      </span>
                      <button
                        onClick={(e) => handleDelete(scan.id, e)}
                        className="p-1 text-slate-300 hover:text-rose-500 rounded-md hover:bg-white/80 transition-colors ml-1 cursor-pointer"
                        title="Remove scan record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Product Title & Brand */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                      {scan.productName}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {scan.brand} • {scan.manufacturer}
                    </p>
                  </div>

                  {/* Status Banner */}
                  <div
                    className={`rounded-xl px-3 py-2 border flex items-center justify-between text-xs font-bold ${
                      isCompliant
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                        : isViolation
                        ? 'bg-rose-50/80 border-rose-200 text-rose-800'
                        : 'bg-amber-50/80 border-amber-200 text-amber-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {isCompliant && <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />}
                      {isViolation && <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />}
                      {isUnregistered && <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />}
                      <span className="truncate">
                        {isCompliant
                          ? 'Compliant'
                          : isViolation
                          ? `${scan.violationsCount} Rule Defect${scan.violationsCount > 1 ? 's' : ''}`
                          : 'Review Required'}
                      </span>
                    </div>
                    <span className="font-black font-mono text-xs">
                      {scan.screeningScore}%
                    </span>
                  </div>

                  {/* Key Metadata Badges */}
                  <div className="rounded-xl bg-slate-50/90 border border-slate-100 p-2.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                        <Barcode className="h-3.5 w-3.5 text-slate-400" /> Identifier:
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-slate-800 text-[11px] truncate max-w-[130px]">
                          {scan.barcode}
                        </span>
                        <button
                          onClick={(e) => handleCopyBarcode(scan.id, scan.barcode, e)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title="Copy barcode/GTIN"
                        >
                          {copiedId === scan.id ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {(scan.mrp || scan.netQuantity) && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                        <span className="text-slate-500">
                          {scan.netQuantity ? `Net: ${scan.netQuantity}` : 'Packaging Info'}
                        </span>
                        {scan.mrp && (
                          <span className="font-bold text-slate-800">
                            MRP: {scan.mrp}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRevisitScan(scan);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors py-1 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    <span>Revisit Scan</span>
                  </button>

                  <button
                    onClick={(e) => handleRunInspection(scan, e)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 mx-auto flex items-center justify-center">
            <QrCode className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {scans.length === 0 ? 'No Recent QR Scans' : 'No Scans Match Filter'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              {scans.length === 0
                ? 'Packages identified using the live camera or image scanner will automatically appear here for rapid revisit during field audits.'
                : `There are currently no items under the "${filter}" filter. Switch filters or scan a new package.`}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('qr-scanner')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="h-4 w-4" />
              <span>Scan QR Code</span>
            </button>
            {scans.length === 0 && (
              <button
                onClick={handleResetDemo}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Load Sample Scans</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal Dialog: Revisit Decoded Product Details */}
      {selectedScanForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                      {selectedScanForModal.productName}
                    </h3>
                    <span className="rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5">
                      {selectedScanForModal.format}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Scanned {selectedScanForModal.timestampDisplay} ({formatRelativeTime(selectedScanForModal.scannedAt)})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunInspection(selectedScanForModal)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Launch Inspection</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setSelectedScanForModal(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-6">
              <ProductResultCard
                result={selectedScanForModal.lookupResult}
                onScanAgain={() => {
                  setSelectedScanForModal(null);
                  setActiveTab('qr-scanner');
                }}
                onScanPackageLabel={() => handleRunInspection(selectedScanForModal)}
                onGenerateReport={() => handleGenerateReportFromModal(selectedScanForModal)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
