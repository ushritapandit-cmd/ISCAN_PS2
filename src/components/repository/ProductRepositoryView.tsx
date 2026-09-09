import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Boxes, Search, Filter, Barcode, ArrowRight, ShieldCheck, AlertTriangle, Camera, Sparkles, Database } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { DEMO_PRESETS } from '../../data/demoProducts';
import { RecentQrScansSection } from './RecentQrScansSection';

export const ProductRepositoryView: React.FC = () => {
  const { startNewInspection, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(DEMO_PRESETS.map((p) => p.category)))];

  const filtered = DEMO_PRESETS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm);

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Commodity Master Repository
            </h1>
            <span className="rounded bg-slate-100 text-slate-700 text-xs px-2 py-0.5 font-bold border border-slate-200">
              Barcodes & Catalog
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Indexed packaged commodities with manufacturer registrations, barcode verification, and historical compliance records.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('qr-scanner')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
        >
          <Camera className="h-4 w-4" />
          <span>Launch QR Scanner</span>
        </button>
      </div>

      {/* 1. Recent QR Scans Section */}
      <RecentQrScansSection />

      {/* 2. Registered Catalog Header & Filters */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Registered Commodity Catalog
              </h2>
              <p className="text-xs text-slate-500">
                Official benchmark packaged goods database under Legal Metrology enforcement.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {filtered.length} of {DEMO_PRESETS.length} registered commodities
          </span>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search catalog by commodity name, brand, registered manufacturer or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-emerald-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      {product.category}
                    </span>
                    <StatusBadge status={product.expectedStatus} size="sm" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{product.manufacturer}</p>
                  </div>

                  {/* Barcode & Packaging details */}
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Barcode className="h-3.5 w-3.5" /> Barcode:
                      </span>
                      <span className="font-mono font-bold text-slate-800">{product.barcode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Benchmark Score:</span>
                      <span className="font-bold text-slate-900">{product.screeningScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Preset Scenario:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[150px]">{product.badgeTag}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">ID: {product.id}</span>
                  <button
                    onClick={() => {
                      startNewInspection(product);
                      setActiveTab('scanner');
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>Run Inspection</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center space-y-2">
            <p className="text-xs font-bold text-slate-700">No registered commodities match your search query</p>
            <p className="text-xs text-slate-500">Try searching for generic terms like &quot;Biscuits&quot;, &quot;Tea&quot;, &quot;Mustard Oil&quot;, or clear the filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-2 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Reset search filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
