import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  X,
  Smartphone,
  Laptop,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { HACKATHON_DEMO_PRODUCTS } from '../../data/hackathonDemoDatabase';

interface DemoQrGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCodeForTest?: (code: string) => void;
}

export const DemoQrGeneratorModal: React.FC<DemoQrGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSelectCodeForTest
}) => {
  const [laysQrDataUrl, setLaysQrDataUrl] = useState<string>('');
  const [kurkureQrDataUrl, setKurkureQrDataUrl] = useState<string>('');
  const [unknownQrDataUrl, setUnknownQrDataUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cards' | 'script'>('cards');

  useEffect(() => {
    // Generate actual high-resolution QR codes using html5-qrcode / qrcode library
    QRCode.toDataURL('ISCAN-LAYS-001', {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    }).then(setLaysQrDataUrl).catch(console.error);

    QRCode.toDataURL('ISCAN-KURKURE-001', {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    }).then(setKurkureQrDataUrl).catch(console.error);

    QRCode.toDataURL('ISCAN-UNREGISTERED-999', {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    }).then(setUnknownQrDataUrl).catch(console.error);
  }, []);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleDownload = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
              <QrCode className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  i-Scan Hackathon Demo QR Generator
                </h3>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 border border-emerald-300">
                  REAL CAMERA READY
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Point your phone camera directly at these codes on your laptop screen to demonstrate real decoding.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-200 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('cards')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                QR Codes
              </button>
              <button
                onClick={() => setActiveTab('script')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === 'script' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Demo Script Guide
              </button>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'cards' ? (
            <>
              {/* Top Instructional Banner */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-blue-950">
                  <Laptop className="h-4 w-4 text-blue-700" />
                  <span>How to conduct the Hackathon Demo:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1 text-blue-800/90">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                    <strong className="block text-blue-950 font-bold mb-0.5">1. Display on Laptop</strong>
                    Keep this modal open on your laptop screen. The camera decodes the actual black-and-white matrix pattern.
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                    <strong className="block text-blue-950 font-bold mb-0.5">2. Scan on Phone</strong>
                    Open i-Scan in your phone browser, click "Scan QR", allow camera, and aim at the QR code below.
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                    <strong className="block text-blue-950 font-bold mb-0.5">3. Live Decoding</strong>
                    i-Scan reads the real QR text via <code className="font-mono bg-blue-100 px-1 py-0.2 rounded">html5-qrcode</code>, looks it up in the demo database, and renders compliance.
                  </div>
                </div>
              </div>

              {/* Side-by-side 2 Demo QR Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Lay's Card */}
                <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50/50 p-5 shadow-sm space-y-4 relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-emerald-300">
                        Demo Product 1
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-1">Lay's Classic Salted</h4>
                      <p className="text-xs text-slate-500 font-medium">Brand: Lay's • Category: Potato Chips</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-1 text-[11px] font-extrabold border border-emerald-300">
                      <span>🟢 COMPLIANT</span>
                    </span>
                  </div>

                  {/* QR Image Frame */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col items-center justify-center">
                    {laysQrDataUrl ? (
                      <img
                        src={laysQrDataUrl}
                        alt="Lay's QR Code"
                        className="h-48 w-48 object-contain rounded-lg border border-slate-100"
                      />
                    ) : (
                      <div className="h-48 w-48 flex items-center justify-center bg-slate-100 rounded-lg text-xs text-slate-400">
                        Generating QR...
                      </div>
                    )}
                    <div className="mt-3 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">QR Decoded Payload</span>
                      <code className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        ISCAN-LAYS-001
                      </code>
                    </div>
                  </div>

                  {/* Expected Verification Outcome */}
                  <div className="rounded-xl border border-emerald-100 bg-white p-3 text-xs space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                      Expected Demo Scenario:
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      All 7 Legal Metrology statutory checks PASS (Manufacturer address, Net quantity 50g, MRP ₹20, Consumer care 1800 22 4020, Mfg date, Country of Origin, Unit price ₹0.40/g).
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => handleCopy('ISCAN-LAYS-001')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                    >
                      {copiedCode === 'ISCAN-LAYS-001' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                      <span>{copiedCode === 'ISCAN-LAYS-001' ? 'Copied' : 'Copy Code'}</span>
                    </button>
                    <button
                      onClick={() => handleDownload(laysQrDataUrl, 'ISCAN-LAYS-001-QR')}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                      title="Download PNG image"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-500" />
                      <span>PNG</span>
                    </button>
                    {onSelectCodeForTest && (
                      <button
                        onClick={() => {
                          onSelectCodeForTest('ISCAN-LAYS-001');
                          onClose();
                        }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 px-3.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
                      >
                        <span>Test Now</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Kurkure Card */}
                <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-b from-rose-50/40 via-white to-slate-50/50 p-5 shadow-sm space-y-4 relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-md bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-rose-300">
                        Demo Product 2
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-1">Kurkure Masala Munch</h4>
                      <p className="text-xs text-slate-500 font-medium">Brand: Kurkure • Category: Namkeen / Snack</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-800 px-2.5 py-1 text-[11px] font-extrabold border border-rose-300">
                      <span>🔴 NON-COMPLIANT</span>
                    </span>
                  </div>

                  {/* QR Image Frame */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col items-center justify-center">
                    {kurkureQrDataUrl ? (
                      <img
                        src={kurkureQrDataUrl}
                        alt="Kurkure QR Code"
                        className="h-48 w-48 object-contain rounded-lg border border-slate-100"
                      />
                    ) : (
                      <div className="h-48 w-48 flex items-center justify-center bg-slate-100 rounded-lg text-xs text-slate-400">
                        Generating QR...
                      </div>
                    )}
                    <div className="mt-3 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">QR Decoded Payload</span>
                      <code className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        ISCAN-KURKURE-001
                      </code>
                    </div>
                  </div>

                  {/* Expected Verification Outcome */}
                  <div className="rounded-xl border border-rose-100 bg-white p-3 text-xs space-y-1.5">
                    <span className="text-[10px] font-bold text-rose-900 uppercase tracking-wider block">
                      Expected Demo Scenario (Violations):
                    </span>
                    <ul className="text-[11px] text-slate-600 space-y-1">
                      <li className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold">•</span>
                        <span><strong>Issue 1:</strong> Consumer care information — Not found (Rule 6(1)(g))</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold">•</span>
                        <span><strong>Issue 2:</strong> Required declaration — Best before duration unverified (Rule 6(1)(d))</span>
                      </li>
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => handleCopy('ISCAN-KURKURE-001')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                    >
                      {copiedCode === 'ISCAN-KURKURE-001' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                      <span>{copiedCode === 'ISCAN-KURKURE-001' ? 'Copied' : 'Copy Code'}</span>
                    </button>
                    <button
                      onClick={() => handleDownload(kurkureQrDataUrl, 'ISCAN-KURKURE-001-QR')}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                      title="Download PNG image"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-500" />
                      <span>PNG</span>
                    </button>
                    {onSelectCodeForTest && (
                      <button
                        onClick={() => {
                          onSelectCodeForTest('ISCAN-KURKURE-001');
                          onClose();
                        }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2 px-3.5 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer shadow-xs"
                      >
                        <span>Test Now</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Unregistered QR Test Section */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="rounded bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 uppercase">
                      Test Case 3: Unknown / Unregistered QR
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm mt-0.5">
                      Verify "Product Not Found" Fallback Flow
                    </h5>
                  </div>
                  {onSelectCodeForTest && (
                    <button
                      onClick={() => {
                        onSelectCodeForTest('ISCAN-UNREGISTERED-999');
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
                    >
                      <span>Simulate Unknown Scan</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Scanning any other QR code accurately returns: <strong>"QR CODE DETECTED"</strong>, the actual decoded value, and <strong>"PRODUCT NOT FOUND: This QR code is not available in the i-Scan demo database."</strong> with immediate options to <strong>"Scan Again"</strong> or <strong>"Scan Package Label"</strong>.
                </p>
              </div>
            </>
          ) : (
            /* Tab 2: Hackathon Demo Step-by-Step Script Guide */
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-1">
                <h4 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-700" />
                  <span>Recommended Hackathon Presentation Script (60-90 Seconds)</span>
                </h4>
                <p className="text-xs text-emerald-900/90">
                  Follow this structured sequence to demonstrate real-time device camera scanning, statutory database lookup, and automated violation flagging for the judges:
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: 'Step 1',
                    title: 'Introduce i-Scan Problem & Solution',
                    desc: '"Inspectors currently take 45+ minutes manually reading small 1mm print on packages. i-Scan reads the commodity QR code with the device camera to identify the product and run Legal Metrology compliance checks instantly."'
                  },
                  {
                    step: 'Step 2',
                    title: 'Open Camera & Point at Lay\'s QR',
                    desc: 'Click "Scan QR" on your phone or laptop. Point the real camera at the Lay\'s QR code (ISCAN-LAYS-001). Demonstrate that the camera lens immediately detects the square reticle.'
                  },
                  {
                    step: 'Step 3',
                    title: 'Show Lay\'s COMPLIANT Result',
                    desc: 'Point out the ✓ PRODUCT FOUND banner, product details (Lay\'s Classic Salted, 50g, MRP ₹20, PepsiCo Gurugram, verified customer care helpline), and the 🟢 COMPLIANT status verdict.'
                  },
                  {
                    step: 'Step 4',
                    title: 'Highlight Source Transparency',
                    desc: 'Show the judges that i-Scan clearly separates raw QR data (Decoded value: ISCAN-LAYS-001) from the data source (i-Scan Demo Product Database), without fabricating external connections.'
                  },
                  {
                    step: 'Step 5',
                    title: 'Click "Scan Another Product"',
                    desc: 'Tap "Scan Another Product" to return to the live camera scanner without refreshing the web application.'
                  },
                  {
                    step: 'Step 6',
                    title: 'Point Camera at Kurkure QR',
                    desc: 'Aim the camera at the Kurkure QR code (ISCAN-KURKURE-001). The camera immediately decodes the new payload.'
                  },
                  {
                    step: 'Step 7',
                    title: 'Demonstrate Automated Violation Flagging',
                    desc: 'Show the 🔴 NON-COMPLIANT verdict! Point out how i-Scan flagged Issue 1 (Consumer care helpline not found under Rule 6(1)(g)) and Issue 2 (Required declaration unverified). Notice the clear disclosure: "Demo compliance scenario".'
                  },
                  {
                    step: 'Step 8',
                    title: 'Show Unknown QR Fallback & OCR Transition',
                    desc: 'Explain that if an unregistered QR code is scanned, i-Scan shows "Product Not Found in Registry" and allows the inspector to click "Scan Package Label" to run multi-angle camera OCR on physical packaging.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
                    <span className="rounded-lg bg-slate-900 text-white text-[10px] font-black px-2 py-1 shrink-0">
                      {item.step}
                    </span>
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-slate-900 text-xs">{item.title}</h5>
                      <p className="text-[11px] text-slate-600 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50">
          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Hackathon Demo Mode Active • Local Database Synchronized</span>
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
