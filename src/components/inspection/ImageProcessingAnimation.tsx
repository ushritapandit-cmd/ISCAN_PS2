import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { PROCESSING_STEPS_TEMPLATE } from '../../services/ocrEngine';

interface ImageProcessingAnimationProps {
  onComplete: () => void;
}

export const ImageProcessingAnimation: React.FC<ImageProcessingAnimationProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    const totalSteps = PROCESSING_STEPS_TEMPLATE.length;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < totalSteps - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsFinished(true);
          return prev;
        }
      });
    }, 550);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / PROCESSING_STEPS_TEMPLATE.length) * 100));

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto my-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-1">
            <Sparkles className="h-6 w-6 animate-spin" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {isFinished ? 'Analysis Complete' : 'AI Metrology Processing Pipeline'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {isFinished
              ? 'Multi-angle text extraction, measurements, and Legal Metrology rules evaluated.'
              : 'Executing computer vision preprocessing, OCR, and Legal Metrology Rule Engine.'}
          </p>
        </div>

        {/* Linear Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Overall Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 6 Step Interactive Checklist */}
        <div className="space-y-2.5 pt-2">
          {PROCESSING_STEPS_TEMPLATE.map((step, idx) => {
            const isDone = idx < currentStepIndex || isFinished;
            const isCurrent = idx === currentStepIndex && !isFinished;

            return (
              <div
                key={step.stepNumber}
                className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950'
                    : isCurrent
                    ? 'border-blue-400 bg-blue-50/40 text-blue-950 shadow-xs ring-1 ring-blue-400/30'
                    : 'border-slate-100 bg-slate-50/50 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold font-mono">
                    {step.stepNumber}.
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{step.name}</h4>
                    <p className="text-[11px] text-slate-500">{step.description}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isDone ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Complete</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">Waiting</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button once Complete */}
        {isFinished && (
          <div className="pt-2 animate-in fade-in zoom-in-95">
            <button
              onClick={onComplete}
              className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-extrabold text-white shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Extracted Declarations</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
