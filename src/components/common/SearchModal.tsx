import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, FileText, ArrowRight, ShieldAlert, Boxes } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, inspections, setActiveInspection, setActiveTab } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = inspections.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.id.toLowerCase().includes(q) ||
      item.productName.toLowerCase().includes(q) ||
      item.manufacturer.toLowerCase().includes(q) ||
      item.barcode.includes(q) ||
      item.region.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search Input */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by Inspection ID (LM-...), Product, Manufacturer, Barcode..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent px-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="rounded p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="ml-2 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No matching inspections or products found for "{query}".
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveInspection(item);
                  setActiveTab('compliance');
                  setIsSearchOpen(false);
                }}
                className="w-full rounded-xl border border-slate-100 p-3 text-left hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{item.productName}</span>
                      <span className="font-mono text-xs text-slate-400">{item.id}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{item.manufacturer}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-medium text-slate-400">{item.region}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-medium text-slate-400">{item.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={item.status} size="sm" />
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-700 transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2 text-xs text-slate-500 flex items-center justify-between">
          <span>Tip: Type <kbd className="rounded bg-white px-1 border border-slate-200">LM-</kbd> to find inspection cases</span>
          <span>{filtered.length} results</span>
        </div>
      </div>
    </div>
  );
};
