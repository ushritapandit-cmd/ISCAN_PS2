import React from 'react';
import { useApp } from '../../context/AppContext';
import { Camera, UploadCloud, Globe, Sparkles, ArrowRight, ShieldAlert, CheckCircle2, ScanLine, QrCode } from 'lucide-react';
import { DEMO_PRESETS } from '../../data/demoProducts';

export const NewInspectionView: React.FC = () => {
  const { startNewInspection, setActiveTab } = useApp();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">New Inspection</h1>
          <span className="rounded bg-slate-100 text-slate-700 text-xs px-2 py-0.5 font-bold border border-slate-200">
            Form I-A
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select an inspection modality to initiate Legal Metrology compliance verification under Packaged Commodities Rules, 2011.
        </p>
      </div>

      {/* 4 Modality Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* OPTION 1: 📱 QR Code & Barcode Scanner */}
        <div
          onClick={() => {
            setActiveTab('qr-scanner');
          }}
          className="group rounded-2xl border-2 border-emerald-300 bg-gradient-to-b from-emerald-50/50 to-white p-5 hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-2.5 right-2.5">
            <span className="rounded-full bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 shadow-2xs">
              REAL SCANNER
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs group-hover:scale-105 transition-transform">
              <ScanLine className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                Option 1 • Live Camera
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">Scan QR / Barcode</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Scan GS1 Digital Link, E-Label QR, or GTIN barcode directly with real device camera.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
              Start QR Scanner <ArrowRight className="h-3 w-3" />
            </span>
            <span className="rounded-full bg-emerald-100/80 px-2 py-0.5 text-[9px] font-semibold text-emerald-800">
              Live Camera
            </span>
          </div>
        </div>

        {/* OPTION 2: 📷 Scan Physical Product */}
        <div
          onClick={() => {
            startNewInspection(DEMO_PRESETS[1]);
            setActiveTab('scanner');
          }}
          className="group rounded-2xl border-2 border-slate-200 bg-white p-5 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Camera className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                Option 2 • Field Camera
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">Scan Packaging Photos</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Capture live front, back, and side labeling panels on retail shelves.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
              Multi-Angle <ArrowRight className="h-3 w-3" />
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
              PDP & Info
            </span>
          </div>
        </div>

        {/* OPTION 3: 🖼 Upload Product Images */}
        <div
          onClick={() => {
            startNewInspection(DEMO_PRESETS[0]);
            setActiveTab('scanner');
          }}
          className="group rounded-2xl border-2 border-slate-200 bg-white p-5 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
                Option 3 • Evidence
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">Upload Packaging</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Upload high-resolution inspection photos or artwork proofs from disk.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
              Upload Files <ArrowRight className="h-3 w-3" />
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
              PNG / JPG
            </span>
          </div>
        </div>

        {/* OPTION 4: 🌐 Check E-commerce Listing */}
        <div
          onClick={() => setActiveTab('ecommerce')}
          className="group rounded-2xl border-2 border-slate-200 bg-white p-5 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">
                Option 4 • E-Comm
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">E-commerce Check</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Audit online marketplace listings (Amazon, Flipkart) for Rule 6(10) parity.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
              Audit E-comm <ArrowRight className="h-3 w-3" />
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
              URL Audit
            </span>
          </div>
        </div>
      </div>

      {/* Preset Demo Library for Hackathon Evaluation */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Demonstration Presets (SIH26034 Case Studies)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any prepared scenario to load pre-annotated packaging and test the end-to-end Legal Metrology rule engine.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700">8 Presets Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEMO_PRESETS.map((preset) => {
            const isCompliant = preset.expectedStatus === 'COMPLIANT';
            const isReview = preset.expectedStatus === 'NEEDS_REVIEW';

            return (
              <button
                key={preset.id}
                onClick={() => {
                  startNewInspection(preset);
                  setActiveTab('scanner');
                }}
                className="text-left rounded-xl border border-slate-200 p-3 hover:border-slate-400 hover:bg-slate-50/70 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      {preset.category.split(' ')[0]}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        isCompliant
                          ? 'bg-emerald-100 text-emerald-800'
                          : isReview
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {preset.badgeTag}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700">
                    {preset.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {preset.scenario}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Score: {preset.screeningScore}%</span>
                  <span className="text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Select <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
