import React, { useState } from 'react';
import { RealQrScanner } from './RealQrScanner';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  ShieldCheck,
  FileCheck2,
  Camera,
  Layers,
  History,
  Info,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { QrVerificationResult } from '../../services/qrService';

export const QrScannerView: React.FC = () => {
  const { setActiveTab, inspections } = useApp();
  const [recentScans, setRecentScans] = useState<QrVerificationResult[]>([]);

  const handleScanSuccess = (result: QrVerificationResult) => {
    setRecentScans((prev) => [result, ...prev.filter((r) => r.parsed.rawValue !== result.parsed.rawValue)].slice(0, 5));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Real Camera Scanner */}
      <RealQrScanner onScanSuccess={handleScanSuccess} />

      {/* Statutory Guidance / Legal Metrology Notes */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Legal Metrology QR & E-Label Compliance Framework</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">
              Rule 6(10) & 2021 Amendments
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
              <span className="font-bold text-slate-800 block text-xs">Mandatory QR Data</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                QR codes on packaged commodities must provide verifiable access to manufacturer name, registered address, consumer care cell, and net quantity.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
              <span className="font-bold text-slate-800 block text-xs">GS1 Digital Link</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Connects packaging barcode numbers (GTIN) directly to structured electronic certificates, batch dates, and statutory declarables.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
              <span className="font-bold text-slate-800 block text-xs">MRP & Tax Inclusivity</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Electronic price declarations accessed via QR code must match physical packaging and state "Inclusive of all taxes" without surcharges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
