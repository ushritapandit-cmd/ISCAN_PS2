import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send,
  ClipboardList
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { BoundingBox } from '../../types';

export const EvidenceViewer: React.FC = () => {
  const { activeInspection, confirmRuleFinding, setActiveTab } = useApp();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeBoxFilter, setActiveBoxFilter] = useState<'all' | 'valid' | 'warning' | 'violation'>('all');
  const [selectedBox, setSelectedBox] = useState<BoundingBox | null>(null);
  const [inspectorNotes, setInspectorNotes] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!activeInspection) {
    return <div className="p-8 text-center text-slate-500">No active inspection loaded.</div>;
  }

  const currentImage = activeInspection.images[0];
  const boundingBoxes = activeInspection.boundingBoxes || [];

  // Filter boxes
  const filteredBoxes = boundingBoxes.filter((box) => {
    if (activeBoxFilter === 'all') return true;
    return box.status === activeBoxFilter;
  });

  const handleSelectBox = (box: BoundingBox) => {
    setSelectedBox(box);
    setInspectorNotes('');
    setFeedbackMessage(null);
  };

  const handleAction = (status: 'CONFIRMED' | 'REJECTED' | 'MODIFIED') => {
    // Map box to related rule
    let targetRuleId = 'LM-004'; // Default to MRP rule
    if (selectedBox?.field.toLowerCase().includes('quantity') || selectedBox?.field.toLowerCase().includes('net')) {
      targetRuleId = 'LM-003';
    } else if (selectedBox?.field.toLowerCase().includes('mfg') || selectedBox?.field.toLowerCase().includes('date')) {
      targetRuleId = 'LM-005';
    } else if (selectedBox?.field.toLowerCase().includes('manufacturer') || selectedBox?.field.toLowerCase().includes('packer')) {
      targetRuleId = 'LM-001';
    }

    confirmRuleFinding(targetRuleId, status, inspectorNotes || `Action ${status} applied from Evidence Viewer`);
    setFeedbackMessage(`Finding updated to ${status}. Recorded in legal audit trail.`);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Optical Evidence Review
            </h1>
            <span className="rounded bg-slate-100 text-slate-700 text-xs px-2 py-0.5 font-bold border border-slate-200">
              Interactive Bounding Box Explorer
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Examine high-resolution packaging image, verify optical coordinates, and record legal determinations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('compliance')}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Back to Compliance
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
          >
            <ClipboardList className="h-4 w-4" />
            <span>Official Report</span>
          </button>
        </div>
      </div>

      {/* Main Evidence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Interactive Canvas & Zoom Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Zoom and Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs">
            {/* Box Type Filters */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveBoxFilter('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                  activeBoxFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All ({boundingBoxes.length})
              </button>
              <button
                onClick={() => setActiveBoxFilter('violation')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${
                  activeBoxFilter === 'violation' ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Violations
              </button>
              <button
                onClick={() => setActiveBoxFilter('warning')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${
                  activeBoxFilter === 'warning' ? 'bg-amber-500 text-white' : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Review
              </button>
              <button
                onClick={() => setActiveBoxFilter('valid')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${
                  activeBoxFilter === 'valid' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Valid
              </button>
            </div>

            {/* Zoom Buttons */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
                className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
                title="Reset Zoom"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <span className="text-[11px] font-mono font-bold text-slate-500 px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>
          </div>

          {/* Interactive Viewer Frame */}
          <div className="relative rounded-2xl border-2 border-slate-300 bg-slate-950 overflow-hidden min-h-[460px] flex items-center justify-center shadow-inner">
            <div
              className="relative transition-transform duration-200 ease-out"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            >
              <img
                src={currentImage?.url}
                alt="Product Evidence"
                className="max-h-[500px] w-auto object-contain rounded"
              />

              {/* SVG Bounding Boxes Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {filteredBoxes.map((box) => {
                  const isSelected = selectedBox?.id === box.id;
                  let stroke = '#10b981';
                  let fill = 'rgba(16, 185, 129, 0.15)';
                  if (box.status === 'violation') {
                    stroke = '#f43f5e';
                    fill = 'rgba(244, 63, 94, 0.25)';
                  } else if (box.status === 'warning') {
                    stroke = '#f59e0b';
                    fill = 'rgba(245, 158, 11, 0.25)';
                  }

                  return (
                    <g key={box.id} className="pointer-events-auto cursor-pointer" onClick={() => handleSelectBox(box)}>
                      <rect
                        x={`${box.x}%`}
                        y={`${box.y}%`}
                        width={`${box.width}%`}
                        height={`${box.height}%`}
                        fill={isSelected ? fill.replace('0.25', '0.45').replace('0.15', '0.35') : fill}
                        stroke={stroke}
                        strokeWidth={isSelected ? '3' : '2'}
                        strokeDasharray={box.status === 'violation' ? '4 2' : undefined}
                        rx="4"
                      />
                      {/* Box Label Tag */}
                      <text
                        x={`${box.x}%`}
                        y={`${Math.max(4, box.y - 2)}%`}
                        fill={stroke}
                        fontSize="10"
                        fontWeight="bold"
                        className="select-none"
                      >
                        {box.field} ({box.confidence}%)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center">
            Click on any colored bounding box to open statutory findings and record inspector decision.
          </p>
        </div>

        {/* Right Side: Selected Finding Panel & Inspector Action (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Evidence Inspector
                </span>
                {selectedBox && <StatusBadge status={selectedBox.status} size="sm" />}
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {selectedBox ? selectedBox.field : 'Select a Region on the Left'}
              </h3>
            </div>

            {selectedBox ? (
              <div className="space-y-4">
                {/* Extracted Text */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Detected Text / Numeral
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-900 mt-1">
                    "{selectedBox.text}"
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-1.5">
                    <span>Optical Confidence: {selectedBox.confidence}%</span>
                    <span>Coordinates: x={selectedBox.x}%, y={selectedBox.y}%</span>
                  </div>
                </div>

                {/* Statutory Reference */}
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                    Governing Legal Provision
                  </span>
                  <p className="text-xs font-bold text-blue-950">
                    Legal Metrology (Packaged Commodities) Rules, 2011
                  </p>
                  <p className="text-xs text-blue-800">
                    Rule 6: Declarations to be made on every package. Omission or non-standard metric declaration constitutes an offense under Section 36(1) of the Act.
                  </p>
                </div>

                {/* Inspector Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Inspector Observations & Legal Notes
                  </label>
                  <textarea
                    rows={2}
                    value={inspectorNotes}
                    onChange={(e) => setInspectorNotes(e.target.value)}
                    placeholder="Enter observation (e.g. verified on PDP, tax clause absent on rear panel)..."
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-emerald-500"
                  />
                </div>

                {/* 3 Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => handleAction('CONFIRMED')}
                    className="w-full rounded-xl bg-emerald-600 py-2.5 px-3 text-xs font-bold text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>1. Confirm Finding (Agree with AI)</span>
                  </button>

                  <button
                    onClick={() => handleAction('REJECTED')}
                    className="w-full rounded-xl border border-rose-300 bg-rose-50/80 py-2.5 px-3 text-xs font-bold text-rose-800 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>2. Reject Finding (Mark Compliant)</span>
                  </button>

                  <button
                    onClick={() => handleAction('MODIFIED')}
                    className="w-full rounded-xl border border-amber-300 bg-amber-50/80 py-2.5 px-3 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>3. Needs Further Review (Escalate to Supervisor)</span>
                  </button>
                </div>

                {/* Feedback Toast */}
                {feedbackMessage && (
                  <div className="rounded-lg bg-slate-900 p-2.5 text-center text-xs font-semibold text-emerald-400 animate-in fade-in">
                    {feedbackMessage}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Layers className="h-10 w-10 mx-auto text-slate-300" />
                <p className="text-xs">Click any bounding box rectangle on the packaging preview to inspect.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
