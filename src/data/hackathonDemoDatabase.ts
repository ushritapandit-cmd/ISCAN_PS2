/**
 * i-Scan Hackathon Demo Product Database
 * 
 * INTERNAL CLASSIFICATION: DEMO DATA
 * 
 * NOTICE:
 * This is a local mock database specifically prepared for the i-Scan Hackathon demonstration.
 * The products and compliance checks here are simulated demonstration scenarios to illustrate
 * fast QR product identification, statutory rule validation, and violation detection.
 * This information is NOT retrieved from an external manufacturer API or commercial registry.
 */

export interface HackathonDemoProduct {
  id: string; // e.g. "DEMO-LAYS-001"
  qrCode: string; // e.g. "ISCAN-LAYS-001"
  name: string;
  brand: string;
  category: string;
  netQuantity: string;
  mrp: string;
  unitSalePrice?: string;
  manufacturer: string;
  batchNumber: string;
  dateInformation: string; // Mfg and Best Before
  mfgDate: string;
  expiryDate?: string;
  countryOfOrigin: string;
  consumerCare: string | null;
  unitOfMeasurement: string;
  imageUrl?: string;
  
  // Compliance verification setup
  complianceStatus: 'COMPLIANT' | 'NON-COMPLIANT';
  complianceExplanation: string;
  screeningScore: number;
  
  // Mandatory Legal Metrology declarations breakdown
  mandatoryDeclarations: {
    id: string;
    field: string;
    label: string;
    rule: string;
    status: 'pass' | 'fail';
    declaredValue: string | null;
    explanation: string;
  }[];
  
  // Simulated violations for demonstration
  violations: {
    id: string;
    field: string;
    label: string;
    status: 'Not Found' | 'Missing' | 'Unverified';
    severity: 'CRITICAL' | 'MAJOR' | 'MODERATE';
    legalRule: string;
    explanation: string;
  }[];
  
  // Visual presentation helpers
  labelTag: string; // "Demo Product — Hackathon"
  isDemoData: true;
}

function createLaysSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="600" viewBox="0 0 500 600">
    <defs>
      <radialGradient id="laysBg" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="70%" stop-color="#eab308"/>
        <stop offset="100%" stop-color="#ca8a04"/>
      </radialGradient>
      <filter id="packShadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity="0.25"/>
      </filter>
    </defs>
    <!-- Packaging bag body -->
    <rect x="35" y="25" width="430" height="550" rx="24" fill="url(#laysBg)" stroke="#a16207" stroke-width="2" filter="url(#packShadow)"/>
    
    <!-- Top Crimped Edge -->
    <path d="M 35 35 L 465 35" stroke="#854d0e" stroke-width="4" stroke-dasharray="6 4"/>
    
    <!-- Lay's Iconic Sun/Ball Logo -->
    <circle cx="250" cy="170" r="68" fill="#ef4444" stroke="#ffffff" stroke-width="4"/>
    <circle cx="250" cy="170" r="58" fill="#dc2626"/>
    <ellipse cx="250" cy="170" rx="85" ry="32" fill="#facc15" stroke="#ffffff" stroke-width="3"/>
    <text x="250" y="179" font-family="system-ui, sans-serif" font-size="34" font-weight="900" font-style="italic" fill="#dc2626" text-anchor="middle" letter-spacing="1">Lay's</text>
    
    <!-- Title & Sub -->
    <text x="250" y="250" font-family="system-ui, sans-serif" font-size="24" font-weight="900" fill="#1e293b" text-anchor="middle">CLASSIC SALTED</text>
    <text x="250" y="272" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#475569" text-anchor="middle">POTATO CHIPS • 100% QUALITY POTATOES</text>

    <!-- Hackathon Demo Tag -->
    <rect x="130" y="295" width="240" height="24" rx="12" fill="#0284c7"/>
    <text x="250" y="311" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">DEMO PRODUCT — HACKATHON</text>

    <!-- Legal Metrology Spec Panel -->
    <rect x="55" y="340" width="390" height="175" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="55" y="340" width="390" height="28" rx="10" fill="#f1f5f9"/>
    <text x="75" y="359" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#334155">MANDATORY STATUTORY DECLARATIONS</text>

    <text x="75" y="390" font-family="monospace, monospace" font-size="12" font-weight="600" fill="#1e293b">NET QUANTITY : 50 g</text>
    <text x="75" y="412" font-family="monospace, monospace" font-size="12" font-weight="600" fill="#1e293b">MRP (INCL. TAXES) : ₹20.00 (₹0.40/g)</text>
    <text x="75" y="434" font-family="monospace, monospace" font-size="11" font-weight="600" fill="#1e293b">MFG: 12/08/2026 • BATCH: B-2026-LAYS-49A</text>
    <text x="75" y="456" font-family="monospace, monospace" font-size="10.5" font-weight="600" fill="#1e293b">MFG BY: PEPSICO INDIA HOLDINGS PVT. LTD.</text>
    <text x="75" y="476" font-family="monospace, monospace" font-size="10" font-weight="600" fill="#059669">CONSUMER CARE: 1800 22 4020 (VERIFIED)</text>
    <text x="75" y="496" font-family="monospace, monospace" font-size="10" font-weight="600" fill="#334155">COUNTRY OF ORIGIN: INDIA • FSSAI LIC. 10012011000168</text>

    <!-- Bottom QR Identifier Display -->
    <rect x="55" y="525" width="390" height="35" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="250" y="547" font-family="monospace, monospace" font-size="12" font-weight="800" fill="#0284c7" text-anchor="middle">QR CODE: ISCAN-LAYS-001</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createKurkureSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="600" viewBox="0 0 500 600">
    <defs>
      <radialGradient id="kkBg" cx="50%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#fdba74"/>
        <stop offset="60%" stop-color="#ea580c"/>
        <stop offset="100%" stop-color="#9a3412"/>
      </radialGradient>
      <filter id="kkShadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity="0.3"/>
      </filter>
    </defs>
    <!-- Packaging bag body -->
    <rect x="35" y="25" width="430" height="550" rx="24" fill="url(#kkBg)" stroke="#7c2d12" stroke-width="2" filter="url(#kkShadow)"/>
    
    <!-- Top Crimped Edge -->
    <path d="M 35 35 L 465 35" stroke="#7c2d12" stroke-width="4" stroke-dasharray="6 4"/>
    
    <!-- Kurkure Logo -->
    <rect x="110" y="125" width="280" height="75" rx="16" fill="#facc15" stroke="#7c2d12" stroke-width="3"/>
    <text x="250" y="174" font-family="system-ui, sans-serif" font-size="36" font-weight="900" fill="#c2410c" text-anchor="middle" letter-spacing="1">Kurkure</text>
    
    <!-- Title & Sub -->
    <text x="250" y="235" font-family="system-ui, sans-serif" font-size="23" font-weight="900" fill="#ffffff" text-anchor="middle">MASALA MUNCH</text>
    <text x="250" y="256" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#fef08a" text-anchor="middle">NAMKEEN / SNACK • TEDHA HAI PAR MERA HAI</text>

    <!-- Hackathon Demo Tag -->
    <rect x="130" y="278" width="240" height="24" rx="12" fill="#dc2626"/>
    <text x="250" y="294" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">DEMO PRODUCT — HACKATHON</text>

    <!-- Legal Metrology Spec Panel -->
    <rect x="55" y="325" width="390" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="55" y="325" width="390" height="28" rx="10" fill="#fef2f2"/>
    <text x="75" y="344" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#991b1b">STATUTORY PANEL (DEMO VIOLATION SCENARIO)</text>

    <text x="75" y="375" font-family="monospace, monospace" font-size="12" font-weight="600" fill="#1e293b">NET QUANTITY : 85 g</text>
    <text x="75" y="397" font-family="monospace, monospace" font-size="12" font-weight="600" fill="#1e293b">MRP (INCL. TAXES) : ₹20.00</text>
    <text x="75" y="419" font-family="monospace, monospace" font-size="11" font-weight="600" fill="#1e293b">MFG: 15/08/2026 • BATCH: KK-MUNCH-881</text>
    <text x="75" y="441" font-family="monospace, monospace" font-size="10.5" font-weight="600" fill="#1e293b">MFG BY: PEPSICO INDIA HOLDINGS, HAJIPUR</text>
    <text x="75" y="465" font-family="monospace, monospace" font-size="10" font-weight="800" fill="#dc2626">⚠ ISSUE 1: CONSUMER CARE — NOT FOUND</text>
    <text x="75" y="485" font-family="monospace, monospace" font-size="10" font-weight="800" fill="#d97706">⚠ ISSUE 2: BEST BEFORE DURATION UNVERIFIED</text>
    <text x="75" y="504" font-family="monospace, monospace" font-size="9.5" font-weight="600" fill="#64748b">COUNTRY OF ORIGIN: INDIA</text>

    <!-- Bottom QR Identifier Display -->
    <rect x="55" y="525" width="390" height="35" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="250" y="547" font-family="monospace, monospace" font-size="12" font-weight="800" fill="#c2410c" text-anchor="middle">QR CODE: ISCAN-KURKURE-001</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const HACKATHON_DEMO_PRODUCTS: Record<string, HackathonDemoProduct> = {
  'ISCAN-LAYS-001': {
    id: 'DEMO-LAYS-001',
    qrCode: 'ISCAN-LAYS-001',
    name: "Lay's Classic Salted",
    brand: "Lay's",
    category: 'Potato Chips',
    netQuantity: '50 g',
    mrp: '₹20.00 (incl. of all taxes)',
    unitSalePrice: '₹0.40 / g',
    manufacturer: 'PepsiCo India Holdings Pvt. Ltd., Level 3-5, Pioneer Square, Sector 62, Golf Course Ext Rd, Gurugram, Haryana - 122101',
    batchNumber: 'B-2026-LAYS-49A',
    dateInformation: 'Mfg: 12/08/2026, Best Before: 4 Months from packaging',
    mfgDate: '12/08/2026',
    expiryDate: '12/12/2026',
    countryOfOrigin: 'India',
    consumerCare: 'Contact: Consumer Feedback Executive, Tel: 1800 22 4020, Email: feedback@pepsico.com, Address: Gurugram, Haryana',
    unitOfMeasurement: 'g (grams)',
    imageUrl: createLaysSvg(),
    
    // DEMO OUTCOME: COMPLIANT
    complianceStatus: 'COMPLIANT',
    complianceExplanation: 'All required declarations available in the demo dataset.',
    screeningScore: 98,
    
    mandatoryDeclarations: [
      {
        id: 'decl-mfg',
        field: 'manufacturer',
        label: 'Manufacturer / Packer Information',
        rule: 'Rule 6(1)(a) - Name and complete postal address',
        status: 'pass',
        declaredValue: 'PepsiCo India Holdings Pvt. Ltd., Gurugram, Haryana - 122101',
        explanation: 'Registered manufacturer entity and complete physical address fully declared.'
      },
      {
        id: 'decl-net-qty',
        field: 'netQuantity',
        label: 'Net Quantity',
        rule: 'Rule 6(1)(c) & Rule 12 - Standard metric weight units',
        status: 'pass',
        declaredValue: '50 g',
        explanation: 'Standard metric unit (g) with correct numerical height and spacing.'
      },
      {
        id: 'decl-mrp',
        field: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        rule: 'Rule 6(1)(e) - Inclusive of all taxes',
        status: 'pass',
        declaredValue: '₹20.00 (incl. of all taxes)',
        explanation: 'MRP formatted with Rupee symbol (₹) and statutory inclusive of taxes clause.'
      },
      {
        id: 'decl-care',
        field: 'consumerCare',
        label: 'Consumer Care Information',
        rule: 'Rule 6(1)(g) - Consumer grievance contact',
        status: 'pass',
        declaredValue: 'Tel: 1800 22 4020, Email: feedback@pepsico.com',
        explanation: 'Designated helpline phone number, email address, and physical contact verified.'
      },
      {
        id: 'decl-date',
        field: 'dateInformation',
        label: 'Date-Related Declaration',
        rule: 'Rule 6(1)(d) - Month & Year of packaging/manufacture',
        status: 'pass',
        declaredValue: 'Mfg: 12/08/2026, Best Before: 4 Months',
        explanation: 'Manufacturing date and best before duration clearly stated.'
      },
      {
        id: 'decl-origin',
        field: 'countryOfOrigin',
        label: 'Country of Origin',
        rule: 'Rule 6(10) - Country of origin declaration',
        status: 'pass',
        declaredValue: 'India',
        explanation: 'Country of origin is prominently declared on packaging.'
      },
      {
        id: 'decl-uom',
        field: 'unitOfMeasurement',
        label: 'Unit of Measurement',
        rule: 'Rule 13 - Unit Sale Price & metric SI unit',
        status: 'pass',
        declaredValue: 'Unit: g (grams) • USP: ₹0.40 / g',
        explanation: 'Metric unit symbols comply with First Schedule specifications.'
      }
    ],
    violations: [],
    labelTag: 'Demo Product — Hackathon',
    isDemoData: true
  },

  'ISCAN-KURKURE-001': {
    id: 'DEMO-KURKURE-001',
    qrCode: 'ISCAN-KURKURE-001',
    name: 'Kurkure Masala Munch',
    brand: 'Kurkure',
    category: 'Namkeen / Snack',
    netQuantity: '85 g',
    mrp: '₹20.00 (incl. of all taxes)',
    unitSalePrice: 'Not declared',
    manufacturer: 'PepsiCo India Holdings Pvt. Ltd., Plot No. 27, Industrial Area, Hajipur, Bihar - 844101',
    batchNumber: 'KK-MUNCH-881',
    dateInformation: 'Mfg: 15/08/2026',
    mfgDate: '15/08/2026',
    expiryDate: undefined,
    countryOfOrigin: 'India',
    consumerCare: null, // DELIBERATE DEMO VIOLATION: Missing consumer care info
    unitOfMeasurement: 'g (grams)',
    imageUrl: createKurkureSvg(),
    
    // DEMO OUTCOME: NON-COMPLIANT
    complianceStatus: 'NON-COMPLIANT',
    complianceExplanation: 'Demo compliance scenario: Missing consumer care information and unverified required declaration in demo dataset.',
    screeningScore: 58,
    
    mandatoryDeclarations: [
      {
        id: 'decl-mfg',
        field: 'manufacturer',
        label: 'Manufacturer / Packer Information',
        rule: 'Rule 6(1)(a) - Name and complete postal address',
        status: 'pass',
        declaredValue: 'PepsiCo India Holdings Pvt. Ltd., Hajipur, Bihar - 844101',
        explanation: 'Manufacturer name and registered facility address verified in demo record.'
      },
      {
        id: 'decl-net-qty',
        field: 'netQuantity',
        label: 'Net Quantity',
        rule: 'Rule 6(1)(c) & Rule 12 - Standard metric weight units',
        status: 'pass',
        declaredValue: '85 g',
        explanation: 'Net quantity declared in grams.'
      },
      {
        id: 'decl-mrp',
        field: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        rule: 'Rule 6(1)(e) - Inclusive of all taxes',
        status: 'pass',
        declaredValue: '₹20.00 (incl. of all taxes)',
        explanation: 'MRP formatted with taxes included.'
      },
      {
        id: 'decl-care',
        field: 'consumerCare',
        label: 'Consumer Care Information',
        rule: 'Rule 6(1)(g) - Consumer grievance redressal cell',
        status: 'fail',
        declaredValue: null,
        explanation: 'Issue 1: Consumer care information — Not found in demo dataset.'
      },
      {
        id: 'decl-date',
        field: 'dateInformation',
        label: 'Date-Related Declaration',
        rule: 'Rule 6(1)(d) - Best Before / Expiry declaration',
        status: 'fail',
        declaredValue: 'Mfg: 15/08/2026 (Best before missing)',
        explanation: 'Issue 2: Required declaration — Best before duration could not be verified.'
      },
      {
        id: 'decl-origin',
        field: 'countryOfOrigin',
        label: 'Country of Origin',
        rule: 'Rule 6(10) - Country of origin declaration',
        status: 'pass',
        declaredValue: 'India',
        explanation: 'Country of origin is declared.'
      },
      {
        id: 'decl-uom',
        field: 'unitOfMeasurement',
        label: 'Unit of Measurement',
        rule: 'Rule 13 - Unit Sale Price & metric SI unit',
        status: 'pass',
        declaredValue: 'Unit: g (grams)',
        explanation: 'Unit of measurement declared.'
      }
    ],
    violations: [
      {
        id: 'viol-demo-care',
        field: 'Consumer care information',
        label: 'Consumer Care Information — Not Found',
        status: 'Missing',
        severity: 'CRITICAL',
        legalRule: 'Legal Metrology Rule 6(1)(g) & Rule 6(1)(da)',
        explanation: 'Issue 1: Consumer care information — Not found. Packaged commodities must display the name, address, telephone number, and email address of the person who can be contacted by the consumer in case of complaints.'
      },
      {
        id: 'viol-demo-decl',
        field: 'Required date declaration',
        label: 'Required Declaration — Could Not Be Verified',
        status: 'Unverified',
        severity: 'MAJOR',
        legalRule: 'Legal Metrology Rule 6(1)(d)',
        explanation: 'Issue 2: Required declaration — Could not be verified. Best before or expiry duration is missing from the package declarations dataset.'
      }
    ],
    labelTag: 'Demo Product — Hackathon',
    isDemoData: true
  }
};

/**
 * Match a scanned QR raw string against the local Hackathon demo product database.
 * Supports exact code, case-insensitive comparison, or embedded string match.
 */
export function lookupHackathonDemoProduct(rawText: string): HackathonDemoProduct | null {
  if (!rawText) return null;
  const trimmed = rawText.trim();
  const upper = trimmed.toUpperCase();

  // 1. Direct key match
  if (HACKATHON_DEMO_PRODUCTS[upper]) {
    return HACKATHON_DEMO_PRODUCTS[upper];
  }

  // 2. Substring matching for URLs or element strings like https://iscan.gov.in/qr/ISCAN-LAYS-001
  if (upper.includes('ISCAN-LAYS-001') || upper.includes('DEMO-LAYS-001')) {
    return HACKATHON_DEMO_PRODUCTS['ISCAN-LAYS-001'];
  }

  if (upper.includes('ISCAN-KURKURE-001') || upper.includes('DEMO-KURKURE-001')) {
    return HACKATHON_DEMO_PRODUCTS['ISCAN-KURKURE-001'];
  }

  return null;
}
