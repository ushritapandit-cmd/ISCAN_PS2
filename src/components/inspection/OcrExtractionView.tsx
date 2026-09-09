import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  RefreshCw,
  Edit2,
  Check,
  Plus,
  ArrowRight,
  ZoomIn,
  AlertCircle,
  Eye,
  Sparkles,
  HelpCircle,
  Layers
} from 'lucide-react';
import { ExtractedDeclaration } from '../../types';

export const OcrExtractionView: React.FC = () => {
  const { activeInspection, updateActiveInspection, setActiveTab } = useApp();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);

  const declarations = activeInspection?.extractedDeclarations || [];
  const boundingBoxes = activeInspection?.boundingBoxes || [];
  const currentImage = activeInspection?.images[0];

  const handleStartEdit = (decl: ExtractedDeclaration) => {
    setEditingId(decl.id);
    setEditValue(decl.value);
  };

  const handleSaveEdit = (declId: string) => {
    const updated = declarations.map((d) => {
      if (d.id === declId) {
        return {
          ...d,
          value: editValue,
          status: editValue.toLowerCase().includes('not') || editValue.trim() === '' ? ('fail' as const) : ('pass' as const),
          confidence: 99 // Inspector manual override has high confidence
        };
      }
      return d;
    });

    updateActiveInspection({ extractedDeclarations: updated });
    setEditingId(null);
  };

  const handleAddField = () => {
    const newField: ExtractedDeclaration = {
      id: `decl-${Date.now()}`,
      field: 'additionalDeclaration',
      label: 'Additional Declaration',
      value: 'Inspector Added Statement',
      confidence: 100,
      status: 'pass',
      legalRequirement: 'Rule 6(1) General'
    };
    updateActiveInspection({ extractedDeclarations: [...declarations, newField] });
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 85) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>{confidence}% High</span>
        </span>
      );
    } else if (confidence >= 60) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <span>{confidence}% Medium</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-200">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          <span>{confidence}% Low</span>
        </span>
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              OCR & Declaration Extraction
            </h1>
            <span className="rounded bg-slate-100 text-slate-700 text-xs px-2 py-0.5 font-bold border border-slate-200">
              Stage 2: Parsing
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Commodity: <span className="font-bold text-slate-800">{activeInspection?.productName}</span> — Verify extracted Legal Metrology mandatory declarations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('scanner')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Re-run OCR</span>
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
          >
            <span>Validate Declarations</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Side by Side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Interactive Image with Bounding Boxes (5 cols) */}
        <div className="lg:col-span-5 space-y-3 sticky top-20">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-emerald-600" />
                <span>Detected Label Regions</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    showBoundingBoxes ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {showBoundingBoxes ? 'Boxes ON' : 'Boxes OFF'}
                </button>
              </div>
            </div>

            {/* Image Container with SVG / coordinate bounding boxes */}
            <div className="relative rounded-xl border border-slate-200 bg-slate-900 overflow-hidden min-h-[360px] flex items-center justify-center">
              {currentImage ? (
                <div className="relative w-full">
                  <img
                    src={currentImage.url}
                    alt="Packaging label"
                    className="w-full h-auto max-h-[460px] object-contain mx-auto"
                  />

                  {/* SVG Overlay for Optical Bounding Boxes */}
                  {showBoundingBoxes && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {boundingBoxes.map((box) => {
                        const isSelected = selectedBoxId === box.id;
                        let strokeColor = '#10b981'; // green
                        if (box.status === 'violation') strokeColor = '#f43f5e'; // red
                        if (box.status === 'warning') strokeColor = '#f59e0b'; // amber

                        return (
                          <g key={box.id} className="pointer-events-auto cursor-pointer" onClick={() => setSelectedBoxId(box.id)}>
                            <rect
                              x={`${box.x}%`}
                              y={`${box.y}%`}
                              width={`${box.width}%`}
                              height={`${box.height}%`}
                              fill={isSelected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0, 0, 0, 0.08)'}
                              stroke={strokeColor}
                              strokeWidth={isSelected ? '2.5' : '1.5'}
                              strokeDasharray={box.status === 'violation' ? '4 2' : undefined}
                              rx="3"
                            />
                          </g>
                        );
                      })}
                    </svg>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">No image loaded</div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Valid
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Review
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Violation / Absent
              </span>
              <span className="font-mono text-slate-400">{boundingBoxes.length} regions</span>
            </div>
          </div>
        </div>

        {/* Right Side: Extracted Declarations Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Mandatory Statutory Declarations</h3>
                <p className="text-xs text-slate-500">Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6</p>
              </div>
              <button
                onClick={handleAddField}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Missing Field</span>
              </button>
            </div>

            {/* Declarations List */}
            <div className="space-y-3">
              {declarations.map((decl) => {
                const isEditing = editingId === decl.id;

                return (
                  <div
                    key={decl.id}
                    className={`rounded-xl border p-3.5 transition-all ${
                      decl.status === 'fail'
                        ? 'border-rose-200 bg-rose-50/40'
                        : decl.status === 'review'
                        ? 'border-amber-200 bg-amber-50/40'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div>
                        <span className="text-xs font-bold text-slate-900">{decl.label}</span>
                        <span className="ml-2 text-[10px] font-mono text-slate-400">{decl.legalRequirement}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {getConfidenceBadge(decl.confidence)}
                        {!isEditing && (
                          <button
                            onClick={() => handleStartEdit(decl)}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            title="Edit / correct OCR value"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Value Field / Input */}
                    {isEditing ? (
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(decl.id)}
                          className="rounded-lg bg-emerald-600 p-1.5 text-white hover:bg-emerald-700"
                          title="Save correction"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs font-semibold text-slate-800 bg-slate-50/80 rounded-md p-2 border border-slate-100 font-mono select-all">
                        {decl.value}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                OCR verified by Inspector with legal audit log tracking.
              </span>
              <button
                onClick={() => setActiveTab('validation')}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <span>Proceed to Rule Validation</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
