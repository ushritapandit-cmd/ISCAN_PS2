import React, { useState } from 'react';
import {
  ProductLookupResult,
  MandatoryDeclarationCheck,
  DetectedViolation
} from '../../services/productLookupService';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  ExternalLink,
  Camera,
  FileCheck2,
  RefreshCw,
  Search,
  Building2,
  PackageCheck,
  Info,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  Barcode,
  Layers,
  Eye,
  ArrowRight,
  Tag,
  WifiOff,
  FileText,
  Sparkles,
  HelpCircle,
  Clock
} from 'lucide-react';

interface ProductResultCardProps {
  result: ProductLookupResult;
  onScanAgain: () => void;
  onScanPackageLabel: () => void;
  onGenerateReport: () => void;
}

export const ProductResultCard: React.FC<ProductResultCardProps> = ({
  result,
  onScanAgain,
  onScanPackageLabel,
  onGenerateReport
}) => {
  const [copiedRaw, setCopiedRaw] = useState<boolean>(false);
  const [activeEvidenceTab, setActiveEvidenceTab] = useState<'qr' | 'database' | 'label'>('qr');
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);

  const {
    productFound,
    lookupStatus,
    statusMessage,
    qr,
    product,
    packageInfo,
    complianceStatus,
    complianceExplanation,
    screeningScore,
    mandatoryChecks,
    violations,
    dataSources,
    matchedPreset,
    isHackathonDemo,
    hackathonDemoNotice,
    demoLabel
  } = result;

  const handleCopyRaw = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(qr.rawValue);
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    }
  };

  // Status styling helpers
  const getStatusBadge = () => {
    if (complianceStatus === 'COMPLIANT') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-black tracking-wide border border-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>🟢 COMPLIANT</span>
        </span>
      );
    }
    if (complianceStatus === 'NON-COMPLIANT') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-800 px-3 py-1 text-xs font-black tracking-wide border border-rose-300">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span>🔴 NON-COMPLIANT</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-black tracking-wide border border-amber-300">
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        <span>🟡 PARTIALLY VERIFIED</span>
      </span>
    );
  };

  const renderValueOrUnavailable = (val: string | null | undefined, suffix?: string) => {
    if (!val || val.trim() === '' || val.toLowerCase().includes('not detected') || val.toLowerCase().includes('not available')) {
      return <span className="text-slate-400 italic font-normal">Not available</span>;
    }
    return (
      <span className="font-semibold text-slate-800">
        {val} {suffix || ''}
      </span>
    );
  };

  return (
    <div id="iscan-product-result-container" className="space-y-6">
      {/* 0. HACKATHON DEMO MODE BANNER (When scanning demo QR codes) */}
      {isHackathonDemo && (
        <div className="rounded-2xl border-2 border-emerald-500 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-4 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-1 tracking-wider uppercase shrink-0 shadow-xs">
              HACKATHON DEMO MODE
            </span>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
                <span>Real Device Camera Scan • i-Scan Demo Product Database</span>
              </p>
              <p className="text-[11px] text-emerald-200/80">
                {hackathonDemoNotice || 'Decoded from physical QR code via device camera • Validated against local hackathon dataset'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-emerald-900/90 text-emerald-300 px-3 py-1 rounded-full border border-emerald-600/60 shrink-0">
            {demoLabel || 'Demo Product — Hackathon'}
          </span>
        </div>
      )}

      {/* 1. TOP RESULT HERO HEADER */}
      <div
        className={`rounded-2xl border p-5 sm:p-6 shadow-sm transition-all ${
          productFound
            ? 'bg-gradient-to-br from-white via-emerald-50/25 to-slate-50 border-emerald-200'
            : 'bg-gradient-to-br from-white via-amber-50/30 to-slate-50 border-amber-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            {productFound ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100">
                <CheckCircle2 className="h-7 w-7" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md ring-4 ring-amber-100">
                <AlertTriangle className="h-7 w-7" />
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {productFound ? '✓ PRODUCT FOUND' : 'QR CODE DETECTED'}
                </h2>
                {getStatusBadge()}
                {isHackathonDemo && (
                  <span className="rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 border border-emerald-300">
                    Demo Product — Hackathon
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {productFound
                  ? (isHackathonDemo ? 'Identified from i-Scan Demo Product Database' : 'Commodity identified from QR code & Legal Metrology repository')
                  : statusMessage || 'This QR code is not available in the i-Scan demo database.'}
              </p>
            </div>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={onScanAgain}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
              <span>{isHackathonDemo ? 'Scan Another Product' : 'Scan Again'}</span>
            </button>
            <button
              onClick={onScanPackageLabel}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm cursor-pointer transition-colors"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Scan Package Label</span>
            </button>
          </div>
        </div>

        {/* Network / Offline Alert if detected */}
        {lookupStatus === 'OFFLINE' && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 flex items-center gap-2">
            <WifiOff className="h-4 w-4 text-amber-700 shrink-0" />
            <span>
              <strong>Offline Mode:</strong> QR detected, but product information requires an internet connection. Showing raw decoded data.
            </span>
          </div>
        )}

        {/* Product Identity Banner (Image + Title + Identifiers) */}
        {productFound && product ? (
          <div className="pt-5 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            {/* Product Image preview */}
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden shadow-xs flex items-center justify-center group">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.productName || 'Product'}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <PackageCheck className="h-10 w-10 text-slate-400" />
              )}
              <span className="absolute bottom-1 right-1 rounded-md bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                {qr.dataType}
              </span>
            </div>

            {/* Product Details Header */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5">
                  {product.brand || 'Verified Brand'}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-600 font-medium">
                  {product.category || 'Packaged Commodity'}
                </span>
              </div>

              <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {product.productName || 'Packaged Commodity'}
              </h1>

              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                {product.manufacturer || 'Manufacturer name not declared in registry.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                {product.gtin && (
                  <div className="flex items-center gap-1 font-mono">
                    <Barcode className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">GTIN:</span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-bold text-slate-800">
                      {product.gtin}
                    </span>
                  </div>
                )}
                {product.productId && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">Product ID:</span>
                    <span className="font-mono text-slate-800">{product.productId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* UNKNOWN QR CODE STATE - REQUIREMENT 11 */
          <div className="pt-5 space-y-4">
            <div className="rounded-2xl border-2 border-amber-300 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full bg-rose-100 text-rose-800 text-[11px] font-black uppercase px-2.5 py-0.5 border border-rose-300">
                      PRODUCT NOT FOUND
                    </span>
                    <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {qr.dataType}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    QR CODE DETECTED
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                    "This QR code is not available in the i-Scan demo database."
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={onScanAgain}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                    <span>Scan Again</span>
                  </button>
                  <button
                    onClick={onScanPackageLabel}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm cursor-pointer transition-colors"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Scan Package Label</span>
                  </button>
                </div>
              </div>

              {/* Decoded Value Container */}
              <div className="rounded-xl bg-slate-950 p-4 text-emerald-400 font-mono text-xs break-all relative group shadow-inner">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Decoded value:
                  </span>
                  <button
                    onClick={handleCopyRaw}
                    className="rounded-md bg-slate-800 px-2.5 py-1 text-[10px] text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedRaw ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedRaw ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="select-all text-sm font-bold tracking-wide">{qr.rawValue}</p>
              </div>

              {/* Integrity Notice */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-600 flex items-start gap-2">
                <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Strict Integrity Policy:</strong> i-Scan does NOT invent product information or fabricate values. Since this payload is not in the demo database, statutory compliance cannot be verified from QR alone. Use <strong>"Scan Package Label"</strong> to run physical optical character recognition.
                </p>
              </div>
            </div>

            {/* Prompt to continue with Physical Label Scan */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-700" />
                  <span>Scan Product Label Instead</span>
                </h4>
                <p className="text-xs text-emerald-800/90 leading-relaxed">
                  Use i-Scan multi-angle camera OCR to capture front, back, and side packaging panels. The Legal Metrology rule engine will extract printed declarations directly from the physical packaging.
                </p>
              </div>
              <button
                onClick={onScanPackageLabel}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Launch Label Scanner</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. MAIN 6-CARD INFORMATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* CARD 1: PRODUCT INFORMATION */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Product Information</h3>
              {isHackathonDemo && (
                <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 border border-emerald-300">
                  Demo Product — Hackathon
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Identity & Origin
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start justify-between py-1.5 border-b border-slate-100/70">
              <span className="text-slate-500 font-medium">Product Name</span>
              <span className="text-right max-w-[60%]">
                {renderValueOrUnavailable(product?.productName)}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-slate-100/70">
              <span className="text-slate-500 font-medium">Brand</span>
              <span className="text-right">
                {renderValueOrUnavailable(product?.brand)}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-slate-100/70">
              <span className="text-slate-500 font-medium">Product Category</span>
              <span className="text-right">
                {renderValueOrUnavailable(product?.category)}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-slate-100/70">
              <span className="text-slate-500 font-medium">Manufacturer / Packer</span>
              <span className="text-right max-w-[65%]">
                {renderValueOrUnavailable(product?.manufacturer)}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-slate-100/70">
              <span className="text-slate-500 font-medium">Product ID</span>
              <span className="text-right font-mono">
                {renderValueOrUnavailable(product?.productId)}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-slate-100/70">
              <span className="text-slate-500 font-medium">GTIN / Barcode</span>
              <span className="text-right font-mono">
                {renderValueOrUnavailable(product?.gtin || product?.barcode)}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-slate-100/70">
              <span className="text-slate-500 font-medium">Country of Origin</span>
              <span className="text-right">
                {renderValueOrUnavailable(packageInfo?.countryOfOrigin || 'India')}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5">
              <span className="text-slate-500 font-medium">Demo Database Record</span>
              <span className="text-right font-mono text-emerald-700 font-bold">
                {isHackathonDemo ? 'Verified Hackathon Record' : 'Standard Catalog'}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: PACKAGE INFORMATION */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-600" />
              <span>Package Information</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Statutory Declarables
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start justify-between py-1.5 border-b border-slate-100/70">
              <span className="text-slate-500 font-medium">Net Quantity</span>
              <span className="text-right font-bold text-slate-800">
                {renderValueOrUnavailable(packageInfo?.netQuantity)}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-slate-100/70">
              <span className="text-slate-500 font-medium">Maximum Retail Price (MRP)</span>
              <span className="text-right font-bold text-slate-800">
                {renderValueOrUnavailable(packageInfo?.mrp)}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-slate-100/70">
              <span className="text-slate-500 font-medium">Manufacturing Date / Date Info</span>
              <span className="text-right">
                {renderValueOrUnavailable(packageInfo?.mfgDate)}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-slate-100/70">
              <span className="text-slate-500 font-medium">Expiry / Best Before</span>
              <span className="text-right">
                {renderValueOrUnavailable(packageInfo?.expiryDate)}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-slate-100/70">
              <span className="text-slate-500 font-medium">Batch / Lot Number</span>
              <span className="text-right font-mono font-bold text-slate-800">
                {renderValueOrUnavailable(packageInfo?.batchNumber)}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-slate-100/70">
              <span className="text-slate-500 font-medium">Country of Origin</span>
              <span className="text-right font-semibold text-slate-800">
                {renderValueOrUnavailable(packageInfo?.countryOfOrigin)}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-slate-100/70">
              <span className="text-slate-500 font-medium">Manufacturer / Packer</span>
              <span className="text-right max-w-[65%] font-semibold text-slate-800">
                {renderValueOrUnavailable(packageInfo?.manufacturerAddress)}
              </span>
            </div>

            <div className="flex items-start justify-between py-1.5">
              <span className="text-slate-500 font-medium">Consumer Care Information</span>
              <span className="text-right max-w-[65%]">
                {packageInfo?.customerCare ? (
                  <span className="font-semibold text-slate-800">{packageInfo.customerCare}</span>
                ) : (
                  <span className="rounded bg-rose-100 text-rose-800 px-2 py-0.5 text-xs font-black border border-rose-200">
                    Not found
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 3: QR DATA */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Barcode className="h-4 w-4 text-indigo-600" />
              <span>QR Data</span>
            </h3>
            <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              Source: QR Code
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-600 font-bold">Decoded value:</span>
                <button
                  onClick={handleCopyRaw}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedRaw ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedRaw ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-950 p-3 text-emerald-400 font-mono text-xs break-all leading-relaxed max-h-24 overflow-y-auto select-all font-bold">
                {qr.rawValue}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>This confirms that the QR code was read directly from the camera.</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Source</span>
                <span className="font-semibold text-slate-800">QR Code</span>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Data Type</span>
                <span className="font-semibold text-slate-800">{qr.dataType}</span>
              </div>
            </div>

            {qr.url && (
              <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-2.5">
                <span className="text-slate-500 block text-[10px] uppercase font-bold mb-0.5">
                  Web Resource URL
                </span>
                <a
                  href={qr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline break-all font-mono text-[11px] inline-flex items-center gap-1"
                >
                  <span>{qr.url}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* CARD 4: COMPLIANCE STATUS & ANALYSIS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Compliance Status</span>
            </h3>
            {getStatusBadge()}
          </div>

          <div className="space-y-3 text-xs">
            {/* Demo compliance scenario note for Kurkure or Non-compliant products */}
            {isHackathonDemo && complianceStatus === 'NON-COMPLIANT' && (
              <div className="rounded-xl border border-rose-300 bg-rose-50/80 p-3 text-rose-950 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-xs text-rose-900">
                  <AlertCircle className="h-4 w-4 text-rose-700" />
                  <span>Demo compliance scenario</span>
                </div>
                <p className="text-[11px] leading-relaxed text-rose-800">
                  This demonstration shows how i-Scan flags missing declarations and does not represent the real legal compliance of commercial products.
                </p>
              </div>
            )}

            {isHackathonDemo && complianceStatus === 'COMPLIANT' && (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-3 text-emerald-950 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-xs text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  <span>All required declarations available in the demo dataset</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-800">
                  Statutory Rule 6(1) automated checks passed for all 7 required declarations.
                </p>
              </div>
            )}

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Rule Engine Verdict
              </span>
              <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                {complianceExplanation}
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                <span>
                  Screening Confidence: <strong>{screeningScore}%</strong>
                </span>
                <span>•</span>
                <span>
                  Passed Rules: <strong>{mandatoryChecks.filter((c) => c.status === 'pass').length} / {mandatoryChecks.length}</strong>
                </span>
              </div>
            </div>

            {/* Statutory Checklist */}
            <div className="space-y-1.5 pt-1">
              <span className="text-slate-700 font-bold block text-[11px]">
                Statutory Mandatory Checks (Rule 6(1))
              </span>
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                {mandatoryChecks.map((check) => (
                  <div
                    key={check.id}
                    className={`flex items-start justify-between p-2 rounded-lg border text-[11px] ${
                      check.status === 'pass'
                        ? 'border-emerald-100 bg-emerald-50/40 text-emerald-950'
                        : check.status === 'fail'
                        ? 'border-rose-100 bg-rose-50/40 text-rose-950'
                        : 'border-amber-100 bg-amber-50/40 text-amber-950'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        {check.status === 'pass' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        ) : check.status === 'fail' ? (
                          <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        )}
                        <span className="font-bold truncate">{check.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        {check.explanation}
                      </p>
                    </div>

                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold shrink-0 uppercase tracking-wider ${
                        check.status === 'pass'
                          ? 'bg-emerald-100 text-emerald-800'
                          : check.status === 'fail'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {check.status === 'pass' ? 'PASS' : check.status === 'fail' ? 'MISSING' : 'CHECK'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 5: DETECTED VIOLATIONS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              <span>Detected Violations</span>
            </h3>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              violations.length === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {violations.length} Issue{violations.length === 1 ? '' : 's'}
            </span>
          </div>

          {violations.length === 0 ? (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-center text-xs space-y-1">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
              <p className="font-bold text-emerald-900">No Violations Detected</p>
              <p className="text-emerald-700 text-[11px]">
                All verified mandatory declarations comply with configured Legal Metrology rules.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {violations.map((violation, idx) => (
                <div
                  key={violation.id}
                  className="rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 text-xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-rose-700 tracking-wider">
                        Issue {idx + 1}: {violation.field}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs mt-0.5">
                        {violation.status}
                      </h4>
                    </div>
                    <span className="rounded-md bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-wide shrink-0">
                      {violation.severity} Severity
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/70 rounded-lg p-2 border border-rose-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Status:</span>
                      <span className="font-bold text-rose-700">{violation.status}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Statutory Rule:</span>
                      <span className="font-semibold text-slate-800 truncate block">{violation.legalRule}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Explanation:</strong> {violation.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CARD 6: EVIDENCE & DATA SOURCE SEPARATION */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600" />
              <span>Evidence & Data Sources</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Source Separation
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Prominent Data Source Callout */}
            <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/60 p-3 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block">
                DATA SOURCE:
              </span>
              <p className="text-xs font-black text-emerald-950">
                {isHackathonDemo ? 'i-Scan Demo Product Database' : 'Legal Metrology Registry & Real-Time Decoders'}
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {isHackathonDemo
                  ? 'Product information loaded from the local hackathon demo database. i-Scan does NOT falsely claim that the information came from the manufacturer or a live external API.'
                  : 'Product information retrieved from the registered repository. Values are verified against package declarations.'}
              </p>
            </div>

            {/* Source Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 text-[11px]">
              <button
                onClick={() => setActiveEvidenceTab('qr')}
                className={`py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                  activeEvidenceTab === 'qr'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                1. QR Data
              </button>
              <button
                onClick={() => setActiveEvidenceTab('database')}
                className={`py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                  activeEvidenceTab === 'database'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Database
              </button>
              <button
                onClick={() => setActiveEvidenceTab('label')}
                className={`py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                  activeEvidenceTab === 'label'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Label OCR
              </button>
            </div>

            {/* Tab 1: QR Data Source */}
            {activeEvidenceTab === 'qr' && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">Data Contained Inside QR</span>
                  <span className="rounded bg-indigo-100 text-indigo-800 text-[9px] font-extrabold px-1.5 py-0.5">
                    Live Decoded
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Direct attributes extracted without querying any external source:
                </p>
                <div className="space-y-1 font-mono text-[10px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/70">
                  <p>Raw: {qr.rawValue}</p>
                  <p>Type: {qr.dataType}</p>
                  {qr.extractedIdentifier && <p>Identifier: {qr.extractedIdentifier}</p>}
                </div>
              </div>
            )}

            {/* Tab 2: Database Source */}
            {activeEvidenceTab === 'database' && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">Data Retrieved from Database / API</span>
                  <span className="rounded bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5">
                    {productFound ? 'Matched' : 'Not Found'}
                  </span>
                </div>
                {productFound ? (
                  <div className="space-y-1 text-[11px] bg-white p-2.5 rounded-lg border border-slate-200/70">
                    <p className="font-bold text-slate-800">{product?.productName}</p>
                    <p className="text-slate-500">{product?.manufacturer}</p>
                    <p className="text-slate-400 font-mono text-[10px]">Barcode: {product?.gtin}</p>
                    <p className="text-[10px] text-emerald-700 font-bold mt-1">
                      Source: {isHackathonDemo ? 'i-Scan Demo Product Database' : 'Commodity Registry'}
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">
                    No database match found for this identifier.
                  </p>
                )}
              </div>
            )}

            {/* Tab 3: Packaging Label OCR Evidence */}
            {activeEvidenceTab === 'label' && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">Data Detected from Physical Package (OCR)</span>
                  <span className="rounded bg-blue-100 text-blue-800 text-[9px] font-extrabold px-1.5 py-0.5">
                    Physical Proof
                  </span>
                </div>

                {matchedPreset?.images && matchedPreset.images.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-600">
                      Physical package proofs on file for this commodity. Click to view high-resolution label inspection overlay:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {matchedPreset.images.slice(0, 2).map((img) => (
                        <div
                          key={img.id}
                          onClick={() => setSelectedImageModal(img.url)}
                          className="group relative rounded-lg border border-slate-200 bg-white overflow-hidden cursor-pointer hover:border-emerald-500 shadow-2xs"
                        >
                          <img
                            src={img.url}
                            alt={img.name}
                            className="h-20 w-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                            <Eye className="h-3.5 w-3.5 mr-1" /> View Proof
                          </div>
                          <span className="absolute bottom-1 left-1 rounded bg-slate-900/80 px-1 py-0.2 text-[8px] text-white uppercase font-bold">
                            {img.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-3 space-y-2">
                    <p className="text-[11px] text-slate-500">
                      Physical package label not yet photographed with OCR camera.
                    </p>
                    <button
                      onClick={onScanPackageLabel}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                    >
                      <Camera className="h-3 w-3" />
                      <span>Capture Packaging Proof</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ACTION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onScanAgain}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-slate-500" />
            <span>{isHackathonDemo ? 'Scan Another Product' : 'Scan Again'}</span>
          </button>

          <button
            onClick={onScanPackageLabel}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-xs cursor-pointer flex items-center gap-2 transition-colors"
          >
            <Camera className="h-4 w-4 text-emerald-400" />
            <span>Scan Package Label</span>
          </button>
        </div>

        <button
          onClick={onGenerateReport}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-md cursor-pointer flex items-center gap-2 transition-colors"
        >
          <FileCheck2 className="h-4 w-4" />
          <span>Generate Statutory Report</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* High-resolution Image Modal if proof clicked */}
      {selectedImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-xl w-full bg-white rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="text-sm font-bold text-slate-900">Physical Packaging Proof & Declarations</h4>
              <button
                onClick={() => setSelectedImageModal(null)}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto rounded-xl border bg-slate-100 flex items-center justify-center">
              <img src={selectedImageModal} alt="Packaging Proof" className="w-full h-auto object-contain" />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedImageModal(null)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white cursor-pointer"
              >
                Close Proof
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
