import React from 'react';
import { HelpCircle, Scale, BookOpen, AlertOctagon, CheckCircle2, Shield } from 'lucide-react';

export const HelpGuideView: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Legal Metrology (Packaged Commodities) Reference Manual
          </h1>
          <span className="rounded bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 font-bold">
            PCR 2011 & 2021 Amendments
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Statutory standards, minimum numeral heights, and enforcement guidelines for field inspection officers
        </p>
      </div>

      {/* 8 Mandatory Declarations Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Scale className="h-5 w-5 text-emerald-600" />
          <span>Rule 6: Mandatory Declarations Required on Every Pre-Packaged Commodity</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900">1. Manufacturer / Packer / Importer</span>
            <p className="text-slate-600">
              Rule 6(1)(a): Complete registered name and geographic address. Merely city without street/pin code is inadequate unless registered trademark with complete public registry.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900">2. Generic or Common Commodity Name</span>
            <p className="text-slate-600">
              Rule 6(1)(b): Generic name in clear proximity to trade name/brand on the Principal Display Panel (PDP).
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900">3. Net Quantity (Metric Units)</span>
            <p className="text-slate-600">
              Rule 6(1)(c) & Rule 12: Strict SI units (g, kg, ml, l). Non-standard abbreviations like "gms", "kgs", "ml." violate Rule 12.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900">4. Maximum Retail Price (MRP)</span>
            <p className="text-slate-600">
              Rule 6(1)(d): Clear numeral price in INR with compulsory wording: "Inclusive of all taxes" or "incl. of all taxes".
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900">5. Month & Year of Mfg / Packing</span>
            <p className="text-slate-600">
              Rule 6(1)(e): Month and year must be stated (MM/YYYY). Year alone without month is non-compliant.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900">6. Country of Origin</span>
            <p className="text-slate-600">
              Rule 6(1)(f) (2020 Amendment): Mandatory on both physical packages and e-commerce listings prior to purchase.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900">7. Consumer Care Cell Details</span>
            <p className="text-slate-600">
              Rule 6(1)(g): Name, address, telephone number, and email address of grievance person/cell.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900">8. Unit Sale Price (USP)</span>
            <p className="text-slate-600">
              Rule 6(11) (2021 Amendment): Mandatory when package exceeds 100g or 100ml. Displayed as ₹ per g/kg or ₹ per ml/L.
            </p>
          </div>
        </div>
      </div>

      {/* Second Schedule: Minimum Numeral Height Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Schedule II: Minimum Height of Numerals & Letters for Net Quantity & MRP
        </h2>
        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Net Quantity Range</th>
                <th className="py-2.5 px-3">Normal Packaging Min Height</th>
                <th className="py-2.5 px-3">Blown / Formed / Perforated Min Height</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr>
                <td className="py-2.5 px-3 font-medium">Up to 50 g / ml</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">1.0 mm</td>
                <td className="py-2.5 px-3 font-mono">2.0 mm</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Above 50 g / ml up to 200 g / ml</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">2.0 mm</td>
                <td className="py-2.5 px-3 font-mono">4.0 mm</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Above 200 g / ml up to 1 kg / litre</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">4.0 mm</td>
                <td className="py-2.5 px-3 font-mono">6.0 mm</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Above 1 kg / litre</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">6.0 mm</td>
                <td className="py-2.5 px-3 font-mono">8.0 mm</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Penalties under Legal Metrology Act, 2009 */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
          <AlertOctagon className="h-5 w-5 text-rose-600" />
          <span>Statutory Penalties & Offenses (Section 36)</span>
        </h3>
        <p className="text-xs text-rose-800 leading-relaxed">
          <strong>Section 36(1):</strong> Whoever manufactures, packs, imports, sells, distributes, or exposes for sale any pre-packaged commodity which does not conform to the declarations on the package shall be punished with a fine which may extend to twenty-five thousand rupees; for the second offense, to fifty thousand rupees; and for the subsequent offense, with a fine which may extend to one lakh rupees or with imprisonment for a term which may extend to one year, or with both.
        </p>
      </div>
    </div>
  );
};
