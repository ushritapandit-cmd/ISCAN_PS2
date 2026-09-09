import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Search,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  IndianRupee,
  FileWarning,
  Eye,
  Send
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { createPackageSvg } from '../../data/demoProducts';

interface EcomPreset {
  id: string;
  name: string;
  platform: 'Amazon India' | 'Flipkart' | 'Blinkit' | 'Zepto';
  url: string;
  scenario: string;
  listingTitle: string;
  listingPrice: string;
  listingMrp: string;
  imageMrp: string;
  countryOfOrigin: string;
  unitSalePrice: string;
  declarationsPresent: boolean;
  status: 'COMPLIANT' | 'POTENTIAL_VIOLATION' | 'NEEDS_REVIEW';
  violations: string[];
}

const ECOM_PRESETS: EcomPreset[] = [
  {
    id: 'ecom-1',
    name: 'Tea Pack - MRP Mismatch (Overcharging Above Printed MRP)',
    platform: 'Amazon India',
    url: 'https://www.amazon.in/dp/B08XYZ1234',
    scenario: 'Online price is ₹349, but printed package label shows MRP ₹299. Violation of Rule 6(10) / Sec 36(1).',
    listingTitle: 'Premium Assam Valley CTC Black Tea, 500g Fresh Pouch',
    listingPrice: '₹349.00',
    listingMrp: '₹349.00',
    imageMrp: '₹299.00',
    countryOfOrigin: 'India',
    unitSalePrice: '₹0.70 / g',
    declarationsPresent: true,
    status: 'POTENTIAL_VIOLATION',
    violations: [
      'Listing price (₹349) exceeds printed packaging MRP (₹299) by ₹50. Overcharging offense under Section 36(1).',
      'Rule 6(10) Violation: Marketplace e-commerce entity failed to display actual package MRP.'
    ]
  },
  {
    id: 'ecom-2',
    name: 'Imported Bluetooth Speaker - Missing Country of Origin',
    platform: 'Flipkart',
    url: 'https://www.flipkart.com/sound-boom-speaker/p/itm12345',
    scenario: 'Mandatory country of origin omitted on product specification table. Rule 6(10) requires origin prior to purchase.',
    listingTitle: 'SoundPulse Ultra Portable Wireless Bluetooth Speaker',
    listingPrice: '₹1,499.00',
    listingMrp: '₹2,499.00',
    imageMrp: '₹2,499.00',
    countryOfOrigin: 'Not Disclosed on Webpage',
    unitSalePrice: '₹1,499.00 / piece',
    declarationsPresent: false,
    status: 'POTENTIAL_VIOLATION',
    violations: [
      'Country of origin not declared on principal product detail page before consumer purchase (2020 Amendment).',
      'Packer / Importer full registered address omitted.'
    ]
  },
  {
    id: 'ecom-3',
    name: 'Basmati Rice 5kg - Compliant Marketplace Listing',
    platform: 'Blinkit',
    url: 'https://www.blinkit.com/prn/classic-basmati-rice-5kg/prid/98765',
    scenario: 'All Rule 6(10) digital declarations, Unit Sale Price, Expiry date, and MRP parity verified.',
    listingTitle: 'Royal Heritage Extra Long Grain Basmati Rice, 5 kg',
    listingPrice: '₹625.00',
    listingMrp: '₹680.00',
    imageMrp: '₹680.00',
    countryOfOrigin: 'India',
    unitSalePrice: '₹125.00 / kg',
    declarationsPresent: true,
    status: 'COMPLIANT',
    violations: []
  },
  {
    id: 'ecom-4',
    name: 'Liquid Detergent 1L - Missing Unit Sale Price',
    platform: 'Zepto',
    url: 'https://www.zeptonow.com/pn/clean-fresh-matic-1l/p/445566',
    scenario: 'Package exceeds 100ml but Unit Sale Price per ml/L is not displayed on consumer listing.',
    listingTitle: 'SparkleClean Front Load Liquid Detergent, 1 Litre',
    listingPrice: '₹220.00',
    listingMrp: '₹260.00',
    imageMrp: '₹260.00',
    countryOfOrigin: 'India',
    unitSalePrice: 'Missing',
    declarationsPresent: true,
    status: 'NEEDS_REVIEW',
    violations: [
      'Unit Sale Price (per ml/L) is absent on digital product card. Mandatory under Rule 6(11).'
    ]
  }
];

export const EcommerceCheckerView: React.FC = () => {
  const { addAuditLog } = useApp();

  const [selectedPreset, setSelectedPreset] = useState<EcomPreset>(ECOM_PRESETS[0]);
  const [urlInput, setUrlInput] = useState<string>(ECOM_PRESETS[0].url);
  const [platform, setPlatform] = useState<string>('Amazon India');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<EcomPreset | null>(ECOM_PRESETS[0]);
  const [noticeSent, setNoticeSent] = useState<boolean>(false);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setNoticeSent(false);

    setTimeout(() => {
      setIsAuditing(false);
      setAuditResult(selectedPreset);
      addAuditLog(
        'E-Commerce Audit',
        'Marketplace Verification',
        selectedPreset.id,
        `Audited ${selectedPreset.platform} URL for Rule 6(10) compliance. Status: ${selectedPreset.status}`
      );
    }, 700);
  };

  const handleLoadPreset = (preset: EcomPreset) => {
    setSelectedPreset(preset);
    setUrlInput(preset.url);
    setPlatform(preset.platform);
    setAuditResult(preset);
    setNoticeSent(false);
  };

  const handleIssueNotice = () => {
    setNoticeSent(true);
    addAuditLog(
      'Notice Issued',
      'Marketplace Rule 6(10)',
      selectedPreset.id,
      `Issued statutory non-compliance notice to ${selectedPreset.platform} seller for ${selectedPreset.violations[0] || 'Rule 6 violation'}`
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              E-Commerce Marketplace Compliance Checker
            </h1>
            <span className="rounded bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 font-bold">
              Rule 6(10) Audit
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit online e-commerce platforms (Amazon, Flipkart, Quick-Commerce) for digital declarations, overcharging above MRP, and origin transparency.
          </p>
        </div>
      </div>

      {/* URL Input & Platform Selector Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-48 shrink-0">
            <label className="text-xs font-bold text-slate-700 block mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-800"
            >
              <option>Amazon India</option>
              <option>Flipkart</option>
              <option>Blinkit</option>
              <option>Zepto</option>
              <option>BigBasket</option>
              <option>Custom Marketplace</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="text-xs font-bold text-slate-700 block mb-1">Product Page URL</label>
            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste listing URL: e.g. https://www.amazon.in/dp/..."
                className="w-full rounded-xl border border-slate-300 p-2.5 pr-10 text-xs font-mono text-slate-800 focus:outline-emerald-500"
              />
              <Globe className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="sm:self-end">
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="w-full sm:w-auto rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAuditing ? (
                <span>Auditing Marketplace...</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>Check Compliance</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Demo Presets Row */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>SIH Hackathon E-Commerce Scenarios:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {ECOM_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset)}
                className={`text-left rounded-xl border p-2.5 transition-all text-xs cursor-pointer ${
                  selectedPreset.id === preset.id
                    ? 'border-purple-500 bg-purple-50/50 ring-2 ring-purple-500/20 font-bold'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-slate-900 truncate max-w-[140px]">
                    {preset.platform}
                  </span>
                  <StatusBadge status={preset.status} size="sm" showIcon={false} />
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-medium">{preset.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dual Panel Display: Simulated Listing vs Rule 6(10) Compliance Results */}
      {auditResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Simulated E-Commerce Product Card (6 cols) */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-900">{auditResult.platform} Product View</span>
              </div>
              <a
                href={auditResult.url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1"
              >
                <span>External Link</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {auditResult.listingTitle}
              </h3>

              {/* Price comparison box */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Marketplace Online Price:</span>
                  <span className="text-xl font-black text-slate-900">{auditResult.listingPrice}</span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-500">Marketplace Listed MRP:</span>
                  <span className="font-semibold text-slate-700 line-through">{auditResult.listingMrp}</span>
                </div>
                <div className="flex items-baseline justify-between text-xs border-t border-slate-200 pt-2">
                  <span className="font-bold text-slate-700">Actual Printed Physical Label MRP:</span>
                  <span className="font-black text-rose-700 text-sm">{auditResult.imageMrp}</span>
                </div>
              </div>

              {/* Product Specifications Table as rendered on web */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-700">
                  Marketplace Specifications Table
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="flex justify-between px-3 py-2">
                    <span className="text-slate-500">Country of Origin:</span>
                    <span className={`font-semibold ${auditResult.countryOfOrigin.includes('Not') ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                      {auditResult.countryOfOrigin}
                    </span>
                  </div>
                  <div className="flex justify-between px-3 py-2">
                    <span className="text-slate-500">Unit Sale Price (USP):</span>
                    <span className={`font-semibold ${auditResult.unitSalePrice === 'Missing' ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                      {auditResult.unitSalePrice}
                    </span>
                  </div>
                  <div className="flex justify-between px-3 py-2">
                    <span className="text-slate-500">Digital Declarations Tab:</span>
                    <span className="font-medium text-slate-800">
                      {auditResult.declarationsPresent ? '✓ Mandatory panel present' : '✗ Incomplete'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Compliance Results & Enforcement Actions (6 cols) */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Regulatory Audit Outcome
                </span>
                <div className="mt-1">
                  <StatusBadge status={auditResult.status} size="md" />
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                Rule 6(10) Check
              </span>
            </div>

            {/* Specific Violations List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Audited Legal Metrology Provisions
              </h4>

              {auditResult.violations.length > 0 ? (
                <div className="space-y-2">
                  {auditResult.violations.map((violation, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-900 flex items-start gap-2.5"
                    >
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                      <div className="leading-relaxed">{violation}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-900 flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <span className="font-bold">Fully Compliant:</span> All mandatory declarations under Rule 6(10) of the Legal Metrology (Packaged Commodities) Rules, 2011 are properly displayed. Online selling price complies with the physical packaging MRP.
                  </div>
                </div>
              )}
            </div>

            {/* Checklist of Rule 6(10) Mandatory Disclosures */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Rule 6(10) Verification Checklist
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span>1. MRP parity (Listing price ≤ Physical MRP)</span>
                  <span className={auditResult.listingPrice > auditResult.imageMrp ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                    {auditResult.listingPrice > auditResult.imageMrp ? '✗ Overcharging' : '✓ Verified'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span>2. Country of origin visible before purchase</span>
                  <span className={auditResult.countryOfOrigin.includes('Not') ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                    {auditResult.countryOfOrigin.includes('Not') ? '✗ Missing' : '✓ Stated'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span>3. Unit Sale Price displayed prominently</span>
                  <span className={auditResult.unitSalePrice === 'Missing' ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                    {auditResult.unitSalePrice === 'Missing' ? '✗ Missing' : '✓ Displayed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Issue Notice Action Button */}
            {auditResult.status !== 'COMPLIANT' && (
              <div className="pt-2">
                {noticeSent ? (
                  <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Statutory Form II Notice dispatched to marketplace entity.</span>
                  </div>
                ) : (
                  <button
                    onClick={handleIssueNotice}
                    className="w-full rounded-xl bg-rose-600 py-3 text-xs font-bold text-white hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>Issue Notice to Marketplace Entity (Rule 6(10) / Sec 36)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
