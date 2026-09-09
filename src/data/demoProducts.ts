import { DemoProductPreset } from '../types';

// High-fidelity SVG package graphics generated as SVG Data URIs for realistic inspection rendering
export function createPackageSvg(title: string, sub: string, brand: string, netQty: string, mrp: string, details: string[]): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fdfbf7"/>
        <stop offset="100%" stop-color="#f3ede2"/>
      </linearGradient>
      <linearGradient id="badge" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0f2b48"/>
        <stop offset="100%" stop-color="#1e4e79"/>
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15"/>
      </filter>
    </defs>
    
    <!-- Package Body -->
    <rect x="30" y="20" width="540" height="710" rx="16" fill="url(#bg)" stroke="#d9d0c1" stroke-width="3" filter="url(#shadow)"/>
    
    <!-- Top Brand Header Banner -->
    <rect x="30" y="20" width="540" height="90" rx="16" fill="url(#badge)"/>
    <rect x="30" y="80" width="540" height="30" fill="url(#badge)"/>
    <text x="300" y="65" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="2">${brand.toUpperCase()}</text>
    <text x="300" y="98" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="#a5d8ff" text-anchor="middle">PACKAGED FOOD COMMODITY • COMPLIANCE LABEL</text>
    
    <!-- Product Front Emblem -->
    <circle cx="300" cy="180" r="45" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>
    <circle cx="300" cy="180" r="38" fill="none" stroke="#d97706" stroke-dasharray="4 3" stroke-width="2"/>
    <text x="300" y="187" font-family="system-ui, sans-serif" font-size="24" font-weight="900" fill="#92400e" text-anchor="middle">100%</text>
    <text x="300" y="202" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#b45309" text-anchor="middle">GENUINE</text>

    <!-- Product Title & Subtitle -->
    <text x="300" y="255" font-family="system-ui, sans-serif" font-size="26" font-weight="800" fill="#111827" text-anchor="middle">${title}</text>
    <text x="300" y="280" font-family="system-ui, sans-serif" font-size="15" font-weight="500" fill="#4b5563" text-anchor="middle">${sub}</text>

    <!-- Divider Line -->
    <line x1="70" y1="305" x2="530" y2="305" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="6 4"/>

    <!-- Mandatory Legal Metrology Information Panel -->
    <rect x="60" y="325" width="480" height="340" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="60" y="325" width="480" height="32" rx="8" fill="#e2e8f0"/>
    <text x="80" y="347" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#1e293b">LEGAL METROLOGY DECLARATION PANEL</text>
    
    <!-- Detail Rows -->
    ${details.map((d, i) => `
      <text x="80" y="${385 + (i * 28)}" font-family="monospace, monospace" font-size="13" font-weight="600" fill="#1f2937">${d}</text>
    `).join('')}

    <!-- Barcode Box -->
    <rect x="80" y="605" width="160" height="42" fill="#ffffff" stroke="#94a3b8" stroke-width="1"/>
    <!-- Simulated barcode lines -->
    <line x1="90" y1="610" x2="90" y2="640" stroke="#000" stroke-width="2"/>
    <line x1="95" y1="610" x2="95" y2="640" stroke="#000" stroke-width="1"/>
    <line x1="100" y1="610" x2="100" y2="640" stroke="#000" stroke-width="3"/>
    <line x1="106" y1="610" x2="106" y2="640" stroke="#000" stroke-width="1"/>
    <line x1="112" y1="610" x2="112" y2="640" stroke="#000" stroke-width="4"/>
    <line x1="120" y1="610" x2="120" y2="640" stroke="#000" stroke-width="2"/>
    <line x1="126" y1="610" x2="126" y2="640" stroke="#000" stroke-width="1"/>
    <line x1="132" y1="610" x2="132" y2="640" stroke="#000" stroke-width="3"/>
    <line x1="140" y1="610" x2="140" y2="640" stroke="#000" stroke-width="2"/>
    <line x1="146" y1="610" x2="146" y2="640" stroke="#000" stroke-width="1"/>
    <line x1="152" y1="610" x2="152" y2="640" stroke="#000" stroke-width="4"/>
    <line x1="160" y1="610" x2="160" y2="640" stroke="#000" stroke-width="1"/>
    <line x1="166" y1="610" x2="166" y2="640" stroke="#000" stroke-width="3"/>
    <line x1="174" y1="610" x2="174" y2="640" stroke="#000" stroke-width="2"/>
    <line x1="180" y1="610" x2="180" y2="640" stroke="#000" stroke-width="1"/>
    <line x1="188" y1="610" x2="188" y2="640" stroke="#000" stroke-width="3"/>
    <line x1="195" y1="610" x2="195" y2="640" stroke="#000" stroke-width="2"/>
    <line x1="202" y1="610" x2="202" y2="640" stroke="#000" stroke-width="2"/>
    <line x1="210" y1="610" x2="210" y2="640" stroke="#000" stroke-width="3"/>
    <line x1="218" y1="610" x2="218" y2="640" stroke="#000" stroke-width="1"/>
    <line x1="225" y1="610" x2="225" y2="640" stroke="#000" stroke-width="2"/>
    
    <!-- Prominent Net Qty & MRP Callout -->
    <rect x="280" y="598" width="120" height="52" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="340" y="618" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#64748b" text-anchor="middle">NET QUANTITY</text>
    <text x="340" y="640" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#0f172a" text-anchor="middle">${netQty}</text>

    <rect x="415" y="598" width="115" height="52" rx="6" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1.5"/>
    <text x="472" y="618" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#047857" text-anchor="middle">MRP (INCL. TAXES)</text>
    <text x="472" y="640" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#065f46" text-anchor="middle">${mrp}</text>

    <!-- Footer Stamp -->
    <text x="300" y="700" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#94a3b8" text-anchor="middle">FSSAI Lic No: 10319001000421 • Standard Packaging Spec 2024</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const DEMO_PRESETS: DemoProductPreset[] = [
  // 1. PRODUCT A: Fully Compliant
  {
    id: 'demo-prod-a',
    name: 'Ananda Butter Crunch Biscuits',
    brand: 'Ananda Bakehouse',
    category: 'Biscuits & Bakery',
    manufacturer: 'Ananda Foods Pvt Ltd, Industrial Area, Guwahati, Assam - 781021',
    barcode: '8901030829102',
    scenario: 'Fully Compliant Packaged Commodity',
    badgeTag: 'Compliant Baseline',
    expectedStatus: 'COMPLIANT',
    screeningScore: 98,
    images: [
      {
        id: 'img-a-front',
        type: 'front',
        url: createPackageSvg('Butter Crunch Biscuits', 'Rich Baked Crunchy Biscuits', 'Ananda', '250 g', '₹50.00', [
          'Net Qty: 250 g (Net Weight)',
          'MRP: ₹50.00 (Incl. of all taxes)',
          'Unit Sale Price: ₹0.20 / g',
          'Mfg Date: 08/2026 | Batch: AN-8291',
          'Mfd by: Ananda Foods Pvt Ltd, Guwahati, Assam',
          'Consumer Care: 1800-209-4022 | care@anandafoods.in',
          'Country of Origin: India'
        ]),
        name: 'Package_Front_View.jpg',
        qualityScore: 96,
        resolution: '1920x1080'
      },
      {
        id: 'img-a-back',
        type: 'back',
        url: createPackageSvg('Nutritional & Legal Panel', 'Back Information Panel', 'Ananda', '250 g', '₹50.00', [
          'Ingredients: Refined Wheat Flour, Butter, Sugar',
          'Energy: 480 kcal per 100g',
          'Store in cool dry place away from direct sunlight',
          'Postal Address: Ananda Foods Pvt Ltd, Guwahati 781021',
          'Consumer Grievance Officer: Shri R. Barua'
        ]),
        name: 'Package_Back_View.jpg',
        qualityScore: 94,
        resolution: '1920x1080'
      }
    ],
    extractedDeclarations: [
      {
        id: 'decl-a-1',
        field: 'productName',
        label: 'Generic Product Name',
        value: 'Butter Crunch Biscuits',
        confidence: 98,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(b) - Generic Product Name'
      },
      {
        id: 'decl-a-2',
        field: 'manufacturer',
        label: 'Manufacturer & Address',
        value: 'Ananda Foods Pvt Ltd, Industrial Area, Guwahati, Assam - 781021',
        confidence: 94,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(a) - Name and Address of Manufacturer'
      },
      {
        id: 'decl-a-3',
        field: 'netQuantity',
        label: 'Net Quantity',
        value: '250 g',
        confidence: 97,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(c) - Net Quantity with Standard Metric Unit'
      },
      {
        id: 'decl-a-4',
        field: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        value: '₹50.00 (Incl. of all taxes)',
        confidence: 99,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(d) - MRP inclusive of all taxes'
      },
      {
        id: 'decl-a-5',
        field: 'unitSalePrice',
        label: 'Unit Sale Price',
        value: '₹0.20 / g',
        confidence: 91,
        status: 'pass',
        legalRequirement: 'Rule 6(11) - Unit Sale Price per g/ml'
      },
      {
        id: 'decl-a-6',
        field: 'mfgDate',
        label: 'Date of Packing / Mfg',
        value: '08/2026',
        confidence: 96,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(e) - Month and Year of Manufacture'
      },
      {
        id: 'decl-a-7',
        field: 'consumerCare',
        label: 'Consumer Care Cell',
        value: '1800-209-4022 | care@anandafoods.in',
        confidence: 93,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(g) - Consumer Care Telephone & Email'
      },
      {
        id: 'decl-a-8',
        field: 'countryOfOrigin',
        label: 'Country of Origin',
        value: 'India',
        confidence: 98,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(f) - Country of Origin'
      }
    ],
    measurements: {
      mrp: {
        value: '₹50.00',
        detectedCurrency: 'INR (₹)',
        taxInclusiveClause: true,
        unitPriceText: '₹0.20 / g',
        confidence: 99,
        status: 'pass'
      },
      netQuantity: {
        quantity: '250',
        unit: 'g',
        standardSymbolUsed: true,
        confidence: 97,
        status: 'pass'
      },
      fontAnalysis: {
        estimatedNumeralHeightMm: 2.8,
        minimumRequiredMm: 2.0,
        contrastRatio: 8.5,
        readabilityScore: 95,
        status: 'pass',
        assessment: 'Estimated numeral height of 2.8 mm comfortably exceeds statutory minimum threshold of 2.0 mm (Schedule II).'
      },
      dateDeclaration: {
        mfgDate: '08/2026',
        formatValid: true,
        confidence: 96,
        status: 'pass'
      }
    },
    ruleResults: [
      {
        ruleId: 'LM-001',
        ruleName: 'Manufacturer / Packer Identity',
        requirement: 'Rule 6(1)(a) Complete name & address',
        result: 'PASS',
        confidence: 94,
        evidenceNotes: 'Full registered address detected including State & PIN.',
        recommendation: 'No action required.',
        verifiedStatus: 'CONFIRMED'
      },
      {
        ruleId: 'LM-002',
        ruleName: 'Generic Product Name',
        requirement: 'Rule 6(1)(b) Conspicuous generic name',
        result: 'PASS',
        confidence: 98,
        evidenceNotes: 'Generic name declared prominently on top panel.',
        recommendation: 'Compliant with Rule 6(1)(b).',
        verifiedStatus: 'CONFIRMED'
      },
      {
        ruleId: 'LM-003',
        ruleName: 'Net Quantity Declaration',
        requirement: 'Rule 6(1)(c) Metric unit symbols',
        result: 'PASS',
        confidence: 97,
        evidenceNotes: 'Net quantity "250 g" printed in SI metric format.',
        recommendation: 'Compliant.',
        verifiedStatus: 'CONFIRMED'
      },
      {
        ruleId: 'LM-004',
        ruleName: 'MRP & Inclusive of Taxes',
        requirement: 'Rule 6(1)(d) Tax inclusive clause',
        result: 'PASS',
        confidence: 99,
        evidenceNotes: 'Clear MRP ₹50.00 with "Incl. of all taxes" text.',
        recommendation: 'Compliant.',
        verifiedStatus: 'CONFIRMED'
      },
      {
        ruleId: 'LM-006',
        ruleName: 'Country of Origin',
        requirement: 'Rule 6(1)(f) Origin statement',
        result: 'PASS',
        confidence: 98,
        evidenceNotes: 'Explicit "Country of Origin: India" printed on label.',
        recommendation: 'Compliant.',
        verifiedStatus: 'CONFIRMED'
      },
      {
        ruleId: 'LM-007',
        ruleName: 'Consumer Care Cell',
        requirement: 'Rule 6(1)(g) Phone & email',
        result: 'PASS',
        confidence: 93,
        evidenceNotes: 'Valid toll-free number and verified email address present.',
        recommendation: 'Compliant.',
        verifiedStatus: 'CONFIRMED'
      },
      {
        ruleId: 'LM-008',
        ruleName: 'Unit Sale Price',
        requirement: 'Rule 6(11) USP on commodities > 100g',
        result: 'PASS',
        confidence: 91,
        evidenceNotes: 'Unit Sale Price ₹0.20/g declared clearly.',
        recommendation: 'Compliant.',
        verifiedStatus: 'CONFIRMED'
      },
      {
        ruleId: 'LM-009',
        ruleName: 'Numeral Size & Readability',
        requirement: 'Rule 7 Minimum 2mm numeral height',
        result: 'PASS',
        confidence: 95,
        evidenceNotes: 'Estimated numeral height 2.8 mm meets statutory threshold.',
        recommendation: 'Compliant.',
        verifiedStatus: 'CONFIRMED'
      }
    ],
    boundingBoxes: [
      { id: 'bb-a-1', field: 'Product Name', text: 'Butter Crunch Biscuits', x: 20, y: 30, width: 60, height: 6, confidence: 98, status: 'valid' },
      { id: 'bb-a-2', field: 'Net Quantity', text: '250 g', x: 46, y: 80, width: 22, height: 8, confidence: 97, status: 'valid' },
      { id: 'bb-a-3', field: 'MRP', text: '₹50.00 (Incl. of all taxes)', x: 69, y: 80, width: 22, height: 8, confidence: 99, status: 'valid' },
      { id: 'bb-a-4', field: 'Unit Price', text: '₹0.20 / g', x: 13, y: 55, width: 35, height: 4, confidence: 91, status: 'valid' },
      { id: 'bb-a-5', field: 'Manufacturer', text: 'Ananda Foods Pvt Ltd', x: 13, y: 62, width: 70, height: 5, confidence: 94, status: 'valid' },
      { id: 'bb-a-6', field: 'Consumer Care', text: '1800-209-4022', x: 13, y: 68, width: 65, height: 5, confidence: 93, status: 'valid' }
    ]
  },

  // 2. PRODUCT B: Missing Consumer-Care Declaration (Hackathon Demonstration Primary Scenario!)
  {
    id: 'demo-prod-b',
    name: 'Brahmaputra Gold Leaf Tea',
    brand: 'Brahmaputra Tea Co',
    category: 'Tea & Beverages',
    manufacturer: 'Hillcrest Tea Packers, Dibrugarh, Assam - 786001',
    barcode: '8904018290123',
    scenario: 'Missing Consumer Care Declaration (Rule 6(1)(g) Non-Compliance)',
    badgeTag: 'Missing Declaration',
    expectedStatus: 'NEEDS_REVIEW',
    screeningScore: 82,
    images: [
      {
        id: 'img-b-front',
        type: 'front',
        url: createPackageSvg('Gold Leaf Assam Tea', 'Selected CTC & Orthodox Blend', 'Brahmaputra', '500 g', '₹240.00', [
          'Net Quantity: 500 g',
          'MRP: ₹240.00 (Inclusive of all taxes)',
          'Unit Sale Price: ₹0.48 / g',
          'Packed on: 06/2026 | Batch: BLT-99',
          'Packed by: Hillcrest Tea Packers, Dibrugarh, Assam',
          'Country of Origin: India',
          '[MISSING CONSUMER GRIEVANCE DETAILS]'
        ]),
        name: 'Tea_Package_Rear_Panel.jpg',
        qualityScore: 92,
        resolution: '1920x1080'
      }
    ],
    extractedDeclarations: [
      {
        id: 'decl-b-1',
        field: 'productName',
        label: 'Generic Product Name',
        value: 'Gold Leaf Assam Tea',
        confidence: 96,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(b) - Generic Product Name'
      },
      {
        id: 'decl-b-2',
        field: 'manufacturer',
        label: 'Packer & Address',
        value: 'Hillcrest Tea Packers, Dibrugarh, Assam - 786001',
        confidence: 92,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(a) - Name and Address of Packer'
      },
      {
        id: 'decl-b-3',
        field: 'netQuantity',
        label: 'Net Quantity',
        value: '500 g',
        confidence: 97,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(c) - Net Quantity with Standard Metric Unit'
      },
      {
        id: 'decl-b-4',
        field: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        value: '₹240.00 (Inclusive of all taxes)',
        confidence: 98,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(d) - MRP inclusive of all taxes'
      },
      {
        id: 'decl-b-5',
        field: 'unitSalePrice',
        label: 'Unit Sale Price',
        value: '₹0.48 / g',
        confidence: 88,
        status: 'pass',
        legalRequirement: 'Rule 6(11) - Unit Sale Price'
      },
      {
        id: 'decl-b-6',
        field: 'mfgDate',
        label: 'Date of Packing',
        value: '06/2026',
        confidence: 94,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(e) - Month and Year of Packing'
      },
      {
        id: 'decl-b-7',
        field: 'consumerCare',
        label: 'Consumer Care Details',
        value: 'NOT DETECTED (No phone/email found)',
        confidence: 92,
        status: 'fail',
        legalRequirement: 'Rule 6(1)(g) - Mandatory Consumer Care Information'
      },
      {
        id: 'decl-b-8',
        field: 'countryOfOrigin',
        label: 'Country of Origin',
        value: 'India',
        confidence: 97,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(f) - Country of Origin'
      }
    ],
    measurements: {
      mrp: {
        value: '₹240.00',
        detectedCurrency: 'INR (₹)',
        taxInclusiveClause: true,
        unitPriceText: '₹0.48 / g',
        confidence: 98,
        status: 'pass'
      },
      netQuantity: {
        quantity: '500',
        unit: 'g',
        standardSymbolUsed: true,
        confidence: 97,
        status: 'pass'
      },
      fontAnalysis: {
        estimatedNumeralHeightMm: 3.2,
        minimumRequiredMm: 4.0, // For 500g package, min numeral height is 4.0mm
        contrastRatio: 6.8,
        readabilityScore: 78,
        status: 'review',
        assessment: 'Estimated numeral height of 3.2 mm is below the statutory 4.0 mm requirement for packages between 200g-1kg. Inspector measurement recommended.'
      },
      dateDeclaration: {
        mfgDate: '06/2026',
        formatValid: true,
        confidence: 94,
        status: 'pass'
      }
    },
    ruleResults: [
      {
        ruleId: 'LM-001',
        ruleName: 'Manufacturer / Packer Identity',
        requirement: 'Rule 6(1)(a) Complete name & address',
        result: 'PASS',
        confidence: 92,
        evidenceNotes: 'Packer details clearly identifiable on label.',
        recommendation: 'Compliant.',
        verifiedStatus: 'CONFIRMED'
      },
      {
        ruleId: 'LM-003',
        ruleName: 'Net Quantity Declaration',
        requirement: 'Rule 6(1)(c) Metric unit symbols',
        result: 'PASS',
        confidence: 97,
        evidenceNotes: 'Net quantity "500 g" meets metric specification.',
        recommendation: 'Compliant.',
        verifiedStatus: 'CONFIRMED'
      },
      {
        ruleId: 'LM-004',
        ruleName: 'MRP Declaration',
        requirement: 'Rule 6(1)(d) Tax inclusive clause',
        result: 'PASS',
        confidence: 98,
        evidenceNotes: 'MRP ₹240.00 with inclusive of all taxes.',
        recommendation: 'Compliant.',
        verifiedStatus: 'CONFIRMED'
      },
      {
        ruleId: 'LM-007',
        ruleName: 'Consumer Care Cell Details',
        requirement: 'Rule 6(1)(g) Mandatory Consumer Care cell contact info',
        result: 'POTENTIAL_VIOLATION',
        confidence: 92,
        evidenceNotes: 'OCR scan over entire principal and secondary information panels found no telephone number, email, or physical consumer grievance address.',
        recommendation: 'Issue Notice under Rule 6(1)(g) / Section 36(1) of Legal Metrology Act, 2009 for absence of consumer contact particulars.',
        verifiedStatus: 'UNVERIFIED',
        inspectorRemarks: 'Consumer care declaration not visible on rear or side panels. Physical packaging inspection confirms omission.'
      },
      {
        ruleId: 'LM-009',
        ruleName: 'Numeral Size & Readability',
        requirement: 'Rule 7 & Schedule II Height standards',
        result: 'NEEDS_REVIEW',
        confidence: 78,
        evidenceNotes: 'AI estimated numeral height 3.2 mm is marginal against 4.0 mm threshold for 500g package.',
        recommendation: 'Physical gauge verification required by Inspector.',
        verifiedStatus: 'UNVERIFIED'
      }
    ],
    boundingBoxes: [
      { id: 'bb-b-1', field: 'Product Name', text: 'Gold Leaf Assam Tea', x: 18, y: 31, width: 64, height: 6, confidence: 96, status: 'valid' },
      { id: 'bb-b-2', field: 'Net Quantity', text: '500 g', x: 46, y: 80, width: 22, height: 8, confidence: 97, status: 'valid' },
      { id: 'bb-b-3', field: 'MRP', text: '₹240.00', x: 69, y: 80, width: 22, height: 8, confidence: 98, status: 'valid' },
      { id: 'bb-b-4', field: 'Consumer Care (Missing)', text: 'Missing Consumer Care Cell', x: 13, y: 68, width: 74, height: 6, confidence: 92, status: 'violation' }
    ]
  },

  // 3. PRODUCT C: Potential MRP Issue (Missing Tax Inclusive Clause)
  {
    id: 'demo-prod-c',
    name: 'Shuddh Kachi Ghani Mustard Oil',
    brand: 'Shuddh Gold',
    category: 'Edible Oils',
    manufacturer: 'Shuddh Agrotech Ltd, Nagaon, Assam - 782001',
    barcode: '8902091823901',
    scenario: 'MRP Non-Compliance: Missing "Inclusive of All Taxes" text',
    badgeTag: 'MRP Non-Compliance',
    expectedStatus: 'POTENTIAL_VIOLATION',
    screeningScore: 74,
    images: [
      {
        id: 'img-c-front',
        type: 'front',
        url: createPackageSvg('Mustard Oil', 'Cold Pressed Kachi Ghani Oil', 'Shuddh', '1 L', 'MRP ₹175', [
          'Net Quantity: 1 L (Volume at 30°C)',
          'MRP: ₹175 [TAXES EXTRA NOT PERMITTED]',
          'Unit Sale Price: ₹175 / L',
          'Packed on: 07/2026',
          'Mfd by: Shuddh Agrotech Ltd, Nagaon',
          'Consumer Care: 0361-229401 | info@shuddh.in',
          'Country of Origin: India'
        ]),
        name: 'Oil_Pouch_Label.jpg',
        qualityScore: 91,
        resolution: '1920x1080'
      }
    ],
    extractedDeclarations: [
      {
        id: 'decl-c-1',
        field: 'productName',
        label: 'Generic Product Name',
        value: 'Kachi Ghani Mustard Oil',
        confidence: 97,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(b) - Generic Product Name'
      },
      {
        id: 'decl-c-2',
        field: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        value: '₹175 (Taxes Extra / Clause Absent)',
        confidence: 96,
        status: 'fail',
        legalRequirement: 'Rule 6(1)(d) - Must include "inclusive of all taxes"'
      },
      {
        id: 'decl-c-3',
        field: 'netQuantity',
        label: 'Net Quantity',
        value: '1 L',
        confidence: 95,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(c) - Volume declaration'
      }
    ],
    measurements: {
      mrp: {
        value: '₹175',
        detectedCurrency: 'INR (₹)',
        taxInclusiveClause: false, // VIOLATION
        confidence: 96,
        status: 'fail'
      },
      netQuantity: {
        quantity: '1',
        unit: 'L',
        standardSymbolUsed: true,
        confidence: 95,
        status: 'pass'
      },
      fontAnalysis: {
        estimatedNumeralHeightMm: 4.1,
        minimumRequiredMm: 4.0,
        contrastRatio: 7.9,
        readabilityScore: 89,
        status: 'pass',
        assessment: 'Estimated numeral height of 4.1 mm meets the 4.0 mm requirement for 1 Liter volume.'
      },
      dateDeclaration: {
        mfgDate: '07/2026',
        formatValid: true,
        confidence: 92,
        status: 'pass'
      }
    },
    ruleResults: [
      {
        ruleId: 'LM-004',
        ruleName: 'MRP Tax Inclusion Clause',
        requirement: 'Rule 6(1)(d) Mandates explicit "inclusive of all taxes"',
        result: 'POTENTIAL_VIOLATION',
        confidence: 96,
        evidenceNotes: 'The label states "MRP ₹175" without the statutory wording "inclusive of all taxes" or "incl. of all taxes". Retailers may use this to charge additional GST illegally.',
        recommendation: 'Charge under Section 36(1) for violation of Rule 6(1)(d).',
        verifiedStatus: 'UNVERIFIED'
      }
    ],
    boundingBoxes: [
      { id: 'bb-c-1', field: 'MRP Violation', text: 'MRP ₹175 (Missing tax clause)', x: 68, y: 80, width: 24, height: 8, confidence: 96, status: 'violation' }
    ]
  },

  // 4. PRODUCT D: Low Confidence / Blurry Image (Human Review Mandatory)
  {
    id: 'demo-prod-d',
    name: 'Himalayan Pink Rock Salt',
    brand: 'Himalayan Pure',
    category: 'Salt & Minerals',
    manufacturer: 'Pure Minerals Pvt Ltd, Imphal, Manipur - 795001',
    barcode: '8903029102837',
    scenario: 'Low Confidence OCR: Blurry Camera Angle Requiring Inspector Verification',
    badgeTag: 'Low Confidence Image',
    expectedStatus: 'NEEDS_REVIEW',
    screeningScore: 61,
    images: [
      {
        id: 'img-d-front',
        type: 'front',
        url: createPackageSvg('Himalayan Salt', 'Natural Mineral Pink Salt', 'Himalayan Pure', '1 kg', '₹99.00', [
          'Net Qty: 1 kg (Faded Print)',
          'MRP: ₹??.00 [BLURRY / GLARE DETECTED]',
          'Mfg Date: ??/2026',
          'Mfd by: Pure Minerals Ltd, Imphal',
          'Consumer Care: 0385-24... (Truncated)',
          'Origin: India'
        ]),
        name: 'Salt_Blurry_Photo.jpg',
        qualityScore: 48,
        resolution: '1280x720'
      }
    ],
    extractedDeclarations: [
      {
        id: 'decl-d-1',
        field: 'productName',
        label: 'Generic Product Name',
        value: 'Himalayan Salt (Pink)',
        confidence: 76,
        status: 'review',
        legalRequirement: 'Rule 6(1)(b) - Generic Product Name'
      },
      {
        id: 'decl-d-2',
        field: 'mrp',
        label: 'Maximum Retail Price',
        value: '₹99 (Low confidence due to glare)',
        confidence: 54,
        status: 'review',
        legalRequirement: 'Rule 6(1)(d) - MRP Verification'
      },
      {
        id: 'decl-d-3',
        field: 'consumerCare',
        label: 'Consumer Care Phone',
        value: '0385-24... (Incomplete digits)',
        confidence: 49,
        status: 'review',
        legalRequirement: 'Rule 6(1)(g) - Contact Details'
      }
    ],
    measurements: {
      mrp: {
        value: '₹99 (Uncertain)',
        detectedCurrency: 'INR (₹)',
        taxInclusiveClause: false,
        confidence: 54,
        status: 'review'
      },
      netQuantity: {
        quantity: '1',
        unit: 'kg',
        standardSymbolUsed: true,
        confidence: 78,
        status: 'review'
      },
      fontAnalysis: {
        estimatedNumeralHeightMm: 1.8,
        minimumRequiredMm: 4.0,
        contrastRatio: 3.2,
        readabilityScore: 52,
        status: 'review',
        assessment: 'Image suffers from reflection and blur. Camera angle prevents accurate digital metrology estimation.'
      },
      dateDeclaration: {
        formatValid: false,
        confidence: 45,
        status: 'review'
      }
    },
    ruleResults: [
      {
        ruleId: 'LM-004',
        ruleName: 'MRP Declaration',
        requirement: 'Rule 6(1)(d) Conspicuous MRP',
        result: 'NEEDS_REVIEW',
        confidence: 54,
        evidenceNotes: 'Glare over price panel prevents automated validation. Do not treat low confidence as an automatic violation.',
        recommendation: 'Manual inspection required. Retake image or verify with physical product.',
        verifiedStatus: 'UNVERIFIED'
      },
      {
        ruleId: 'LM-009',
        ruleName: 'Readability & Print Clarity',
        requirement: 'Rule 7 Clear & conspicuous font',
        result: 'NEEDS_REVIEW',
        confidence: 52,
        evidenceNotes: 'Print contrast score 3.2 is below automated reading reliability index.',
        recommendation: 'Inspector to check if print on packaging is physically smudged or if photo quality was degraded.',
        verifiedStatus: 'UNVERIFIED'
      }
    ],
    boundingBoxes: [
      { id: 'bb-d-1', field: 'Low Confidence MRP', text: '₹99 (Glare)', x: 68, y: 80, width: 24, height: 8, confidence: 54, status: 'review' }
    ]
  },

  // 5. PRODUCT E: Online / Offline E-commerce Mismatch (₹499 Package vs ₹599 Online)
  {
    id: 'demo-prod-e',
    name: 'Kashmir Valley Roasted Almonds',
    brand: 'Valley Harvest',
    category: 'Dry Fruits & Nuts',
    manufacturer: 'Valley Harvest Agro, Baramulla / Dist: Guwahati, Assam',
    barcode: '8906019283741',
    scenario: 'E-commerce Mismatch: Online Platform Selling Above Physical Package MRP',
    badgeTag: 'E-com MRP Mismatch',
    expectedStatus: 'POTENTIAL_VIOLATION',
    screeningScore: 68,
    images: [
      {
        id: 'img-e-front',
        type: 'front',
        url: createPackageSvg('Roasted Almonds', 'Premium California Jumbo Almonds', 'Valley Harvest', '500 g', '₹499.00', [
          'Net Quantity: 500 g',
          'MRP: ₹499.00 (Incl. of all taxes)',
          'Unit Sale Price: ₹0.99 / g',
          'Packed on: 05/2026',
          'Packed by: Valley Harvest Agro',
          'Consumer Care: 1800-419-0099',
          'Country of Origin: India'
        ]),
        name: 'Almonds_Physical_Pack.jpg',
        qualityScore: 95,
        resolution: '1920x1080'
      }
    ],
    extractedDeclarations: [
      {
        id: 'decl-e-1',
        field: 'productName',
        label: 'Product Name',
        value: 'Roasted Almonds 500g',
        confidence: 98,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(b) Generic Name'
      },
      {
        id: 'decl-e-2',
        field: 'mrp',
        label: 'Physical Pack MRP',
        value: '₹499.00 (Incl. of all taxes)',
        confidence: 99,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(d) Package MRP'
      }
    ],
    measurements: {
      mrp: {
        value: '₹499.00',
        detectedCurrency: 'INR (₹)',
        taxInclusiveClause: true,
        unitPriceText: '₹0.99 / g',
        confidence: 99,
        status: 'pass'
      },
      netQuantity: {
        quantity: '500',
        unit: 'g',
        standardSymbolUsed: true,
        confidence: 98,
        status: 'pass'
      },
      fontAnalysis: {
        estimatedNumeralHeightMm: 4.2,
        minimumRequiredMm: 4.0,
        contrastRatio: 8.8,
        readabilityScore: 94,
        status: 'pass',
        assessment: 'Package physical text height and contrast pass.'
      },
      dateDeclaration: {
        mfgDate: '05/2026',
        formatValid: true,
        confidence: 97,
        status: 'pass'
      }
    },
    ruleResults: [
      {
        ruleId: 'ECOM-001',
        ruleName: 'E-commerce Digital Marketplace Parity',
        requirement: 'Rule 6(10) E-commerce price cannot exceed physical printed MRP',
        result: 'POTENTIAL_VIOLATION',
        confidence: 98,
        evidenceNotes: 'Physical packaging clearly has printed MRP of ₹499.00. However, e-commerce marketplace listing lists price as ₹599.00 (₹100 over-pricing markup).',
        recommendation: 'Issue notice to e-commerce marketplace seller under Rule 6(10) and Section 36(1) for overcharging above MRP.',
        verifiedStatus: 'UNVERIFIED'
      }
    ],
    boundingBoxes: [
      { id: 'bb-e-1', field: 'Physical MRP', text: '₹499.00', x: 68, y: 80, width: 24, height: 8, confidence: 99, status: 'valid' }
    ],
    onlineComparison: {
      platform: 'ShopQuick India / MegaMart',
      listingUrl: 'https://shopquick.in/dp/B09ALMOND500G',
      onlineMrp: '₹599.00',
      onlineNetQty: '500 g',
      onlineManufacturer: 'Valley Harvest Agro',
      onlineCountry: 'India',
      hasMismatch: true,
      mismatchReason: 'Selling price / listed MRP online (₹599) exceeds statutory printed packaging MRP (₹499) by ₹100.'
    }
  },

  // 6. PRODUCT F: Country of Origin Non-Compliance
  {
    id: 'demo-prod-f',
    name: 'Verona Extra Virgin Olive Oil',
    brand: 'Verona Estate',
    category: 'Imported Edible Oils',
    manufacturer: 'Imported by Global Foods LLC, Mumbai / Label Missing Origin',
    barcode: '8001020304050',
    scenario: 'Country of Origin Declaration Missing on Imported Commodity',
    badgeTag: 'Origin Non-Compliance',
    expectedStatus: 'POTENTIAL_VIOLATION',
    screeningScore: 71,
    images: [
      {
        id: 'img-f-front',
        type: 'front',
        url: createPackageSvg('Extra Virgin Olive Oil', 'Cold Extracted Mediterranean Oil', 'Verona', '500 ml', '₹750.00', [
          'Net Volume: 500 ml',
          'MRP: ₹750.00 (Inclusive of all taxes)',
          'Unit Sale Price: ₹1.50 / ml',
          'Imported & Packed: 02/2026',
          'Importer: Global Foods LLC, Mumbai 400001',
          'Customer Care: support@globalfoods.in',
          '[COUNTRY OF ORIGIN OMITTED ON STICKER]'
        ]),
        name: 'Olive_Oil_Import_Bottle.jpg',
        qualityScore: 94,
        resolution: '1920x1080'
      }
    ],
    extractedDeclarations: [
      {
        id: 'decl-f-1',
        field: 'productName',
        label: 'Generic Product Name',
        value: 'Extra Virgin Olive Oil',
        confidence: 97,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(b) Generic Name'
      },
      {
        id: 'decl-f-2',
        field: 'countryOfOrigin',
        label: 'Country of Origin',
        value: 'NOT SPECIFIED (Missing Country Declaration)',
        confidence: 94,
        status: 'fail',
        legalRequirement: 'Rule 6(1)(f) & 2020 Amendment - Mandatory Origin Declaration'
      }
    ],
    measurements: {
      mrp: {
        value: '₹750.00',
        detectedCurrency: 'INR (₹)',
        taxInclusiveClause: true,
        unitPriceText: '₹1.50 / ml',
        confidence: 97,
        status: 'pass'
      },
      netQuantity: {
        quantity: '500',
        unit: 'ml',
        standardSymbolUsed: true,
        confidence: 96,
        status: 'pass'
      },
      fontAnalysis: {
        estimatedNumeralHeightMm: 3.5,
        minimumRequiredMm: 4.0,
        contrastRatio: 7.2,
        readabilityScore: 82,
        status: 'review',
        assessment: 'Numeral height 3.5 mm requires check against 4.0 mm threshold for 500 ml.'
      },
      dateDeclaration: {
        mfgDate: '02/2026',
        formatValid: true,
        confidence: 94,
        status: 'pass'
      }
    },
    ruleResults: [
      {
        ruleId: 'LM-006',
        ruleName: 'Country of Origin Declaration',
        requirement: 'Rule 6(1)(f) Mandatory statement of origin on all packages',
        result: 'POTENTIAL_VIOLATION',
        confidence: 94,
        evidenceNotes: 'Import sticker contains Importer address but fails to state Country of Origin (e.g. Italy/Spain/Greece). Mandated under 2020 amendment.',
        recommendation: 'Issue notice to importer Global Foods LLC for omission of statutory origin under Section 36.',
        verifiedStatus: 'UNVERIFIED'
      }
    ],
    boundingBoxes: [
      { id: 'bb-f-1', field: 'Missing Origin', text: 'Country of Origin Missing', x: 13, y: 70, width: 74, height: 6, confidence: 94, status: 'violation' }
    ]
  },

  // 7. PRODUCT G: Poor Readability / Numeral Font Size Below Statutory Limit
  {
    id: 'demo-prod-g',
    name: 'Meghalaya Lakadong Turmeric',
    brand: 'Hills Heritage',
    category: 'Spices & Condiments',
    manufacturer: 'Hills Organic Cooperative, Jowai, Meghalaya - 793150',
    barcode: '8907029103948',
    scenario: 'Sub-Standard Font Size: Numeral Height Estimated at 1.1 mm (Min Statutory 2.0 mm)',
    badgeTag: 'Font Size Defect',
    expectedStatus: 'NEEDS_REVIEW',
    screeningScore: 76,
    images: [
      {
        id: 'img-g-front',
        type: 'front',
        url: createPackageSvg('Lakadong Turmeric', 'High Curcumin Pure Spice Powder', 'Hills Heritage', '100 g', '₹65.00', [
          'Net Qty: 100 g (Tiny font < 1.2mm)',
          'MRP: ₹65.00 (Incl. of all taxes)',
          'Unit Price: ₹0.65/g',
          'Packed on: 06/2026',
          'Mfd by: Hills Organic Coop, Jowai, Meghalaya',
          'Consumer Care: 03652-220199',
          'Country of Origin: India'
        ]),
        name: 'Turmeric_Pouch_CloseUp.jpg',
        qualityScore: 89,
        resolution: '1920x1080'
      }
    ],
    extractedDeclarations: [
      {
        id: 'decl-g-1',
        field: 'productName',
        label: 'Generic Product Name',
        value: 'Lakadong Turmeric Powder',
        confidence: 96,
        status: 'pass',
        legalRequirement: 'Rule 6(1)(b) Generic Name'
      },
      {
        id: 'decl-g-2',
        field: 'netQuantity',
        label: 'Net Quantity',
        value: '100 g',
        confidence: 84,
        status: 'review',
        legalRequirement: 'Rule 7 & Schedule II - Minimum 2.0 mm numeral height'
      }
    ],
    measurements: {
      mrp: {
        value: '₹65.00',
        detectedCurrency: 'INR (₹)',
        taxInclusiveClause: true,
        confidence: 96,
        status: 'pass'
      },
      netQuantity: {
        quantity: '100',
        unit: 'g',
        standardSymbolUsed: true,
        confidence: 84,
        status: 'review'
      },
      fontAnalysis: {
        estimatedNumeralHeightMm: 1.1,
        minimumRequiredMm: 2.0,
        contrastRatio: 5.1,
        readabilityScore: 68,
        status: 'review',
        assessment: 'Computer vision estimated numeral height of 1.1 mm is substantially below statutory minimum of 2.0 mm (Schedule II, Table I). Inspector manual verification required with physical gauge.'
      },
      dateDeclaration: {
        mfgDate: '06/2026',
        formatValid: true,
        confidence: 93,
        status: 'pass'
      }
    },
    ruleResults: [
      {
        ruleId: 'LM-009',
        ruleName: 'Numeral Size & Readability Standards',
        requirement: 'Rule 7 & Schedule II Numeral height ≥ 2.0 mm for ≤ 200g pack',
        result: 'NEEDS_REVIEW',
        confidence: 76,
        evidenceNotes: 'Estimated numeral height 1.1 mm fails optical threshold. While AI vision cannot be a sole legal determination, physical measurement is warranted.',
        recommendation: 'Use inspector precision loupe / micrometer gauge to confirm print height.',
        verifiedStatus: 'UNVERIFIED'
      }
    ],
    boundingBoxes: [
      { id: 'bb-g-1', field: 'Sub-standard Font', text: 'Net Qty: 100 g (1.1mm)', x: 46, y: 80, width: 22, height: 8, confidence: 84, status: 'review' }
    ]
  },

  // 8. PRODUCT H: Multiple Findings (Outdated Mfg Date, Missing Unit Price, Obscured MRP)
  {
    id: 'demo-prod-h',
    name: 'Royal Shahi Garam Masala',
    brand: 'Royal Flavours',
    category: 'Spices & Seasonings',
    manufacturer: 'Royal Spices & Herbs, Agartala, Tripura - 799001',
    barcode: '8908019283019',
    scenario: 'Multiple Non-Compliances: Missing Unit Sale Price & Incomplete Packing Date',
    badgeTag: 'Multiple Non-Compliances',
    expectedStatus: 'POTENTIAL_VIOLATION',
    screeningScore: 58,
    images: [
      {
        id: 'img-h-front',
        type: 'front',
        url: createPackageSvg('Shahi Garam Masala', 'Aromatic Indian Spice Blend', 'Royal Flavours', '200 g', '₹120.00', [
          'Net Quantity: 200 g',
          'MRP: ₹120.00 (Incl. of all taxes)',
          '[UNIT SALE PRICE MISSING]',
          'Mfg Date: 2026 (Month Missing - Violation)',
          'Mfd by: Royal Spices & Herbs, Agartala, Tripura',
          'Consumer Care: 0381-230911',
          'Country of Origin: India'
        ]),
        name: 'Masala_Box_Pack.jpg',
        qualityScore: 92,
        resolution: '1920x1080'
      }
    ],
    extractedDeclarations: [
      {
        id: 'decl-h-1',
        field: 'unitSalePrice',
        label: 'Unit Sale Price',
        value: 'NOT DETECTED (Missing on 200g package)',
        confidence: 93,
        status: 'fail',
        legalRequirement: 'Rule 6(11) - Unit Sale Price required on packages > 100g'
      },
      {
        id: 'decl-h-2',
        field: 'mfgDate',
        label: 'Manufacturing Date',
        value: '2026 (Month missing - only year printed)',
        confidence: 91,
        status: 'fail',
        legalRequirement: 'Rule 6(1)(e) - Month and Year are both statutory requirements'
      }
    ],
    measurements: {
      mrp: {
        value: '₹120.00',
        detectedCurrency: 'INR (₹)',
        taxInclusiveClause: true,
        unitPriceText: undefined,
        confidence: 95,
        status: 'review'
      },
      netQuantity: {
        quantity: '200',
        unit: 'g',
        standardSymbolUsed: true,
        confidence: 96,
        status: 'pass'
      },
      fontAnalysis: {
        estimatedNumeralHeightMm: 2.2,
        minimumRequiredMm: 2.0,
        contrastRatio: 6.9,
        readabilityScore: 84,
        status: 'pass',
        assessment: 'Font height passes threshold.'
      },
      dateDeclaration: {
        mfgDate: '2026 (Invalid format: missing month)',
        formatValid: false,
        confidence: 91,
        status: 'fail'
      }
    },
    ruleResults: [
      {
        ruleId: 'LM-005',
        ruleName: 'Manufacturing / Packing Date Format',
        requirement: 'Rule 6(1)(e) Month & Year must both be present',
        result: 'POTENTIAL_VIOLATION',
        confidence: 91,
        evidenceNotes: 'Label only declares year "2026" without indicating the month of packing/manufacture.',
        recommendation: 'Issue notice under Rule 6(1)(e) for incomplete date declaration.',
        verifiedStatus: 'UNVERIFIED'
      },
      {
        ruleId: 'LM-008',
        ruleName: 'Unit Sale Price Declaration',
        requirement: 'Rule 6(11) Unit sale price mandatory for commodities above 100g',
        result: 'POTENTIAL_VIOLATION',
        confidence: 93,
        evidenceNotes: 'Commodity net weight is 200 g, which exceeds 100 g threshold, but Unit Sale Price (e.g. ₹0.60/g) is omitted.',
        recommendation: 'Issue notice under Rule 6(11) (2021 Amendment).',
        verifiedStatus: 'UNVERIFIED'
      }
    ],
    boundingBoxes: [
      { id: 'bb-h-1', field: 'Missing USP', text: 'Unit Sale Price Missing', x: 13, y: 55, width: 45, height: 5, confidence: 93, status: 'violation' },
      { id: 'bb-h-2', field: 'Invalid Date', text: 'Mfg Date: 2026 (No Month)', x: 13, y: 62, width: 45, height: 5, confidence: 91, status: 'violation' }
    ]
  }
];
