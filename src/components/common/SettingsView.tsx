import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Sliders, Shield, Save, Check, RefreshCw } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser } = useApp();

  const [ocrConfidenceThreshold, setOcrConfidenceThreshold] = useState<number>(85);
  const [numeralToleranceMm, setNumeralToleranceMm] = useState<number>(0.2);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [multilingualOcr, setMultilingualOcr] = useState<boolean>(true);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            System Calibration & Officer Settings
          </h1>
          <span className="rounded bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 font-bold border border-slate-200">
            Field Unit v3.4
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Calibrate optical extraction tolerances, multilingual OCR engines, and field reporting preferences
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="h-4 w-4 text-emerald-600" />
          <span>Computer Vision & OCR Optical Thresholds</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>High Confidence Minimum Threshold:</span>
              <span className="text-emerald-700">{ocrConfidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="95"
              value={ocrConfidenceThreshold}
              onChange={(e) => setOcrConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <span className="text-[11px] text-slate-400">
              Extractions below this threshold are automatically flagged as "NEEDS REVIEW" for human verification.
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>Numeral Height Estimation Measurement Tolerance:</span>
              <span className="text-slate-900">± {numeralToleranceMm} mm</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.05"
              value={numeralToleranceMm}
              onChange={(e) => setNumeralToleranceMm(Number(e.target.value))}
              className="w-full accent-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Perspective Auto-Correction</span>
                <span className="text-slate-500 text-[11px]">Deskews skewed labels and compensates for cylindrical package curvatures</span>
              </div>
              <input
                type="checkbox"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
                className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="font-bold text-slate-800 block">Multilingual OCR Models (Eighth Schedule)</span>
                <span className="text-slate-500 text-[11px]">Enables English, Hindi, and Assamese/Bengali script OCR engines</span>
              </div>
              <input
                type="checkbox"
                checked={multilingualOcr}
                onChange={(e) => setMultilingualOcr(e.target.checked)}
                className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Current Profile: <strong>{currentUser?.name}</strong> ({currentUser?.badgeNumber})
          </span>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Preferences Saved</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Calibration</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
