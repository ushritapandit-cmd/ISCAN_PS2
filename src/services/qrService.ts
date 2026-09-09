import { DemoProductPreset, Inspection, ExtractedDeclaration, PackageMeasurement } from '../types';
import { DEMO_PRESETS } from '../data/demoProducts';
import { INITIAL_INSPECTIONS } from '../data/mockDatabase';
import { evaluateComplianceRules, RuleEvaluationSummary } from './ruleEngine';
import { LEGAL_METROLOGY_RULES } from '../data/rules';
import {
  processProductQrScan,
  ProductLookupResult,
  DecodedQrRaw,
  IdentifiedProductDetails,
  IdentifiedPackageInfo,
  DetectedViolation,
  MandatoryDeclarationCheck
} from './productLookupService';

export {
  processProductQrScan,
  type ProductLookupResult,
  type DecodedQrRaw,
  type IdentifiedProductDetails,
  type IdentifiedPackageInfo,
  type DetectedViolation,
  type MandatoryDeclarationCheck
};

export type QrFormatType =
  | 'GS1_DIGITAL_LINK'
  | 'GS1_ELEMENT_STRING'
  | 'PRODUCT_URL'
  | 'BARCODE_EAN'
  | 'JSON_PAYLOAD'
  | 'PLAIN_TEXT';

export interface ParsedQrData {
  rawValue: string;
  formatType: QrFormatType;
  title: string;
  barcode?: string;
  gtin?: string;
  batchNumber?: string;
  expiryDate?: string;
  mfgDate?: string;
  serialNumber?: string;
  productName?: string;
  brand?: string;
  manufacturer?: string;
  mrp?: string;
  netQuantity?: string;
  url?: string;
  attributes: Record<string, string>;
  isRecognizedInCatalog: boolean;
}

export interface QrVerificationResult {
  parsed: ParsedQrData;
  matchedPreset: DemoProductPreset | null;
  matchedInspection: Inspection | null;
  evaluation: RuleEvaluationSummary;
  complianceState: 'COMPLIANT' | 'NEEDS_REVIEW' | 'POTENTIAL_VIOLATION';
  timestamp: string;
}

/**
 * Parse any QR code string (GS1 Digital Link, JSON, URL, Barcode, or plain text)
 */
export function parseQrCodeData(raw: string): ParsedQrData {
  const trimmed = raw.trim();
  const attributes: Record<string, string> = {};

  console.log('[i-Scan QR Service] Parsing raw QR code payload:', trimmed);

  // 1. Check for JSON format
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      const parsedJson = JSON.parse(trimmed);
      if (typeof parsedJson === 'object' && parsedJson !== null) {
        Object.entries(parsedJson).forEach(([k, v]) => {
          attributes[k] = String(v);
        });

        const barcode = attributes.barcode || attributes.ean || attributes.gtin || attributes.id;
        const productName = attributes.productName || attributes.name || attributes.title;
        const brand = attributes.brand;
        const manufacturer = attributes.manufacturer || attributes.mfg;
        const mrp = attributes.mrp || attributes.price;
        const netQuantity = attributes.netQuantity || attributes.netQty || attributes.weight;
        const batchNumber = attributes.batch || attributes.batchNumber || attributes.lot;

        return {
          rawValue: trimmed,
          formatType: 'JSON_PAYLOAD',
          title: productName || 'JSON Structured Commodity Data',
          barcode,
          gtin: barcode,
          batchNumber,
          productName,
          brand,
          manufacturer,
          mrp,
          netQuantity,
          attributes,
          isRecognizedInCatalog: false
        };
      }
    } catch {
      // Not valid JSON, continue to other checks
    }
  }

  // 2. Check for GS1 Digital Link URL (e.g., https://id.gs1.org/01/08901030829102/10/BATCH123/17/261231)
  const isUrl = /^https?:\/\//i.test(trimmed);
  if (isUrl) {
    attributes['URL'] = trimmed;
    try {
      const urlObj = new URL(trimmed);
      attributes['Host'] = urlObj.hostname;
      attributes['Path'] = urlObj.pathname;

      // Check GS1 Digital Link path patterns: /01/{gtin}
      const gs1Match = urlObj.pathname.match(/\/01\/(\d{8,14})/);
      let gtin: string | undefined = gs1Match ? gs1Match[1] : undefined;

      // Extract GS1 AI keys from path: /10/{batch}, /17/{exp}, /21/{serial}
      const batchMatch = urlObj.pathname.match(/\/10\/([a-zA-Z0-9_-]+)/);
      const expMatch = urlObj.pathname.match(/\/17\/(\d{6})/);
      const mfgMatch = urlObj.pathname.match(/\/11\/(\d{6})/);
      const serialMatch = urlObj.pathname.match(/\/21\/([a-zA-Z0-9_-]+)/);

      let batchNumber = batchMatch ? batchMatch[1] : undefined;
      let expiryDate = expMatch ? formatGs1Date(expMatch[1]) : undefined;
      let mfgDate = mfgMatch ? formatGs1Date(mfgMatch[1]) : undefined;
      let serialNumber = serialMatch ? serialMatch[1] : undefined;

      // Also check query parameters (e.g. ?barcode=... or ?gtin=... or ?id=...)
      urlObj.searchParams.forEach((val, key) => {
        attributes[key] = val;
        const lKey = key.toLowerCase();
        if (!gtin && (lKey === 'barcode' || lKey === 'gtin' || lKey === 'ean' || lKey === 'sku' || lKey === 'id')) {
          gtin = val;
        }
        if (!batchNumber && (lKey === 'batch' || lKey === 'lot')) batchNumber = val;
      });

      // Normalize GTIN if length is 14 with leading zeros
      const normalizedBarcode = gtin ? normalizeBarcode(gtin) : undefined;

      if (gtin || urlObj.hostname.includes('gs1') || urlObj.pathname.includes('/01/')) {
        return {
          rawValue: trimmed,
          formatType: 'GS1_DIGITAL_LINK',
          title: `GS1 Digital Link (${normalizedBarcode || gtin || 'Product'})`,
          barcode: normalizedBarcode || gtin,
          gtin,
          batchNumber,
          expiryDate,
          mfgDate,
          serialNumber,
          url: trimmed,
          attributes,
          isRecognizedInCatalog: false
        };
      }

      // Check if URL matches any registered product name or barcode directly
      const matchedByUrl = DEMO_PRESETS.find(
        (p) =>
          trimmed.includes(p.barcode) ||
          trimmed.toLowerCase().includes(p.id.toLowerCase()) ||
          trimmed.toLowerCase().includes(p.brand.toLowerCase().replace(/\s+/g, ''))
      );

      return {
        rawValue: trimmed,
        formatType: 'PRODUCT_URL',
        title: matchedByUrl ? matchedByUrl.name : `Product Web Address (${urlObj.hostname})`,
        barcode: matchedByUrl?.barcode,
        url: trimmed,
        attributes,
        isRecognizedInCatalog: !!matchedByUrl
      };
    } catch {
      // URL parsing failed, fall through to generic
    }
  }

  // 3. Check for GS1 Element String with parentheses: (01)08901030829102(10)LOT123...
  if (trimmed.includes('(01)') || trimmed.startsWith('01') && /^\d{14,}/.test(trimmed)) {
    const gtinMatch = trimmed.match(/\(01\)(\d{8,14})/) || trimmed.match(/^01(\d{14})/);
    const batchMatch = trimmed.match(/\(10\)([a-zA-Z0-9_-]+)/);
    const expMatch = trimmed.match(/\(17\)(\d{6})/);
    const mfgMatch = trimmed.match(/\(11\)(\d{6})/);

    const gtin = gtinMatch ? gtinMatch[1] : undefined;
    const barcode = gtin ? normalizeBarcode(gtin) : undefined;

    return {
      rawValue: trimmed,
      formatType: 'GS1_ELEMENT_STRING',
      title: `GS1 Standard Element String (${barcode || 'Packaged Commodity'})`,
      barcode,
      gtin,
      batchNumber: batchMatch ? batchMatch[1] : undefined,
      expiryDate: expMatch ? formatGs1Date(expMatch[1]) : undefined,
      mfgDate: mfgMatch ? formatGs1Date(mfgMatch[1]) : undefined,
      attributes: {
        'GTIN/AI(01)': gtin || 'N/A',
        ...(batchMatch ? { 'Batch/AI(10)': batchMatch[1] } : {}),
        ...(expMatch ? { 'Expiry/AI(17)': formatGs1Date(expMatch[1]) } : {})
      },
      isRecognizedInCatalog: false
    };
  }

  // 4. Check for purely numeric Barcode (EAN-13, EAN-8, UPC-A, GTIN-14)
  if (/^\d{8,14}$/.test(trimmed)) {
    const normalized = normalizeBarcode(trimmed);
    return {
      rawValue: trimmed,
      formatType: 'BARCODE_EAN',
      title: `Standard EAN/Barcode: ${trimmed}`,
      barcode: normalized,
      gtin: trimmed,
      attributes: {
        'Barcode Number': trimmed,
        'Symbology': trimmed.length === 13 ? 'EAN-13' : trimmed.length === 8 ? 'EAN-8' : trimmed.length === 12 ? 'UPC-A' : 'GTIN-14'
      },
      isRecognizedInCatalog: false
    };
  }

  // 5. Key-Value or Delimited Plain Text (e.g. BARCODE: 8901030829102; MRP: 50.00)
  const lines = trimmed.split(/[\n;,|]/);
  let extractedBarcode: string | undefined;
  let extractedName: string | undefined;
  let extractedMfg: string | undefined;
  let extractedMrp: string | undefined;
  let extractedQty: string | undefined;

  lines.forEach((line) => {
    const parts = line.split(/[:=]/);
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim();
      attributes[key] = val;

      const lk = key.toLowerCase();
      if (!extractedBarcode && (lk.includes('barcode') || lk.includes('ean') || lk.includes('gtin') || lk.includes('code'))) {
        extractedBarcode = val.replace(/\D/g, '');
      }
      if (!extractedName && (lk.includes('product') || lk.includes('item') || lk.includes('commodity') || lk.includes('name'))) {
        extractedName = val;
      }
      if (!extractedMfg && (lk.includes('mfg') || lk.includes('manufacturer') || lk.includes('packer'))) {
        extractedMfg = val;
      }
      if (!extractedMrp && (lk.includes('mrp') || lk.includes('price'))) {
        extractedMrp = val;
      }
      if (!extractedQty && (lk.includes('qty') || lk.includes('weight') || lk.includes('net'))) {
        extractedQty = val;
      }
    }
  });

  return {
    rawValue: trimmed,
    formatType: 'PLAIN_TEXT',
    title: extractedName || (trimmed.length > 32 ? `${trimmed.substring(0, 32)}...` : trimmed),
    barcode: extractedBarcode,
    productName: extractedName,
    manufacturer: extractedMfg,
    mrp: extractedMrp,
    netQuantity: extractedQty,
    attributes: Object.keys(attributes).length > 0 ? attributes : { 'Decoded Content': trimmed },
    isRecognizedInCatalog: false
  };
}

/**
 * Format GS1 YYMMDD date to readable DD/MM/YYYY
 */
function formatGs1Date(yymmdd: string): string {
  if (yymmdd.length !== 6) return yymmdd;
  const yy = yymmdd.slice(0, 2);
  const mm = yymmdd.slice(2, 4);
  const dd = yymmdd.slice(4, 6);
  const year = parseInt(yy, 10) > 50 ? `19${yy}` : `20${yy}`;
  return `${dd === '00' ? 'End of' : dd}/${mm}/${year}`;
}

/**
 * Normalize GTIN-14 to standard 13-digit EAN if leading zero exists
 */
export function normalizeBarcode(code: string): string {
  if (code.length === 14 && code.startsWith('0')) {
    return code.slice(1);
  }
  return code;
}

/**
 * Find matching product in catalog by barcode, ID, or name
 */
export function matchProductInCatalog(parsed: ParsedQrData): {
  preset: DemoProductPreset | null;
  inspection: Inspection | null;
} {
  const barcodeToMatch = parsed.barcode ? normalizeBarcode(parsed.barcode) : null;
  const rawLower = parsed.rawValue.toLowerCase();

  // 1. Try matching demo preset by barcode
  if (barcodeToMatch) {
    const matchByBarcode = DEMO_PRESETS.find(
      (p) => normalizeBarcode(p.barcode) === barcodeToMatch || p.barcode === parsed.rawValue
    );
    if (matchByBarcode) {
      return {
        preset: matchByBarcode,
        inspection: INITIAL_INSPECTIONS.find((i) => i.productId === matchByBarcode.id) || null
      };
    }
  }

  // 2. Try matching by preset ID in raw string (e.g. "demo-prod-a")
  const matchById = DEMO_PRESETS.find(
    (p) => rawLower.includes(p.id.toLowerCase()) || rawLower === p.id.toLowerCase()
  );
  if (matchById) {
    return {
      preset: matchById,
      inspection: INITIAL_INSPECTIONS.find((i) => i.productId === matchById.id) || null
    };
  }

  // 3. Try matching by product name or brand in raw string
  const matchByName = DEMO_PRESETS.find(
    (p) =>
      rawLower.includes(p.name.toLowerCase()) ||
      rawLower.includes(p.brand.toLowerCase())
  );
  if (matchByName) {
    return {
      preset: matchByName,
      inspection: INITIAL_INSPECTIONS.find((i) => i.productId === matchByName.id) || null
    };
  }

  // 4. Try matching existing inspections
  if (barcodeToMatch) {
    const inspectionMatch = INITIAL_INSPECTIONS.find(
      (i) => normalizeBarcode(i.barcode) === barcodeToMatch
    );
    if (inspectionMatch) {
      const preset = DEMO_PRESETS.find((p) => p.id === inspectionMatch.productId) || null;
      return { preset, inspection: inspectionMatch };
    }
  }

  return { preset: null, inspection: null };
}

/**
 * Run verification and rule engine on QR data
 */
export function verifyQrCompliance(parsed: ParsedQrData): QrVerificationResult {
  const { preset, inspection } = matchProductInCatalog(parsed);

  if (preset) {
    parsed.isRecognizedInCatalog = true;
    parsed.productName = preset.name;
    parsed.brand = preset.brand;
    parsed.manufacturer = preset.manufacturer;
    parsed.barcode = preset.barcode;

    const evaluation = evaluateComplianceRules(
      preset.extractedDeclarations,
      preset.measurements,
      LEGAL_METROLOGY_RULES
    );

    return {
      parsed,
      matchedPreset: preset,
      matchedInspection: inspection,
      evaluation,
      complianceState: preset.expectedStatus,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
    };
  }

  // Construct dynamic declarations from the scanned QR data for unrecognized items
  const dynamicDeclarations: ExtractedDeclaration[] = [
    {
      id: 'qr-decl-1',
      field: 'productName',
      label: 'Generic Name of Commodity',
      value: parsed.productName || 'General Packaged Commodity',
      confidence: parsed.productName ? 92 : 65,
      status: parsed.productName ? 'pass' : 'review',
      legalRequirement: 'Rule 6(1)(b) - Common/Generic name must be stated'
    },
    {
      id: 'qr-decl-2',
      field: 'manufacturer',
      label: 'Manufacturer / Packer / Importer',
      value: parsed.manufacturer || 'Declaration Not Found in QR Data',
      confidence: parsed.manufacturer ? 90 : 40,
      status: parsed.manufacturer ? 'pass' : 'fail',
      legalRequirement: 'Rule 6(1)(a) - Name and complete address of manufacturer/packer'
    },
    {
      id: 'qr-decl-3',
      field: 'netQuantity',
      label: 'Net Quantity (Metric Units)',
      value: parsed.netQuantity || 'Not detected in QR code',
      confidence: parsed.netQuantity ? 94 : 45,
      status: parsed.netQuantity ? 'pass' : 'fail',
      legalRequirement: 'Rule 6(1)(c) & Rule 12 - Mandatory metric net quantity declaration'
    },
    {
      id: 'qr-decl-4',
      field: 'mrp',
      label: 'Maximum Retail Price (MRP)',
      value: parsed.mrp || (parsed.url ? 'Refer to Online Listing MRP' : 'Not detected in QR code'),
      confidence: parsed.mrp ? 92 : 50,
      status: parsed.mrp ? 'pass' : 'review',
      legalRequirement: 'Rule 6(1)(e) - MRP inclusive of all taxes'
    },
    {
      id: 'qr-decl-5',
      field: 'mfgDate',
      label: 'Month & Year of Manufacture',
      value: parsed.mfgDate || (parsed.batchNumber ? `Batch ${parsed.batchNumber} logged` : 'Not declared in QR'),
      confidence: parsed.mfgDate ? 95 : 60,
      status: parsed.mfgDate ? 'pass' : 'review',
      legalRequirement: 'Rule 6(1)(d) - Month & Year of manufacture or packing'
    },
    {
      id: 'qr-decl-6',
      field: 'consumerCare',
      label: 'Consumer Care Helpline & Email',
      value: parsed.attributes['Consumer Care'] || parsed.attributes['care'] || 'Not detected in QR payload',
      confidence: 50,
      status: 'review',
      legalRequirement: 'Rule 6(1)(g) - Dedicated consumer grievance redressal contact'
    },
    {
      id: 'qr-decl-7',
      field: 'countryOfOrigin',
      label: 'Country of Origin',
      value: parsed.attributes['Country'] || 'India (Default Registration)',
      confidence: 80,
      status: 'pass',
      legalRequirement: 'Rule 6(10) - Country of origin for imported goods'
    }
  ];

  const dynamicMeasurements: PackageMeasurement = {
    mrp: {
      value: parsed.mrp || '0.00',
      detectedCurrency: '₹',
      taxInclusiveClause: !!parsed.mrp && parsed.mrp.toLowerCase().includes('tax'),
      confidence: parsed.mrp ? 85 : 40,
      status: parsed.mrp ? 'pass' : 'review'
    },
    netQuantity: {
      quantity: parsed.netQuantity ? parsed.netQuantity.replace(/[^\d.]/g, '') : '0',
      unit: parsed.netQuantity ? parsed.netQuantity.replace(/[\d.\s]/g, '') : 'g',
      standardSymbolUsed: true,
      confidence: parsed.netQuantity ? 90 : 40,
      status: parsed.netQuantity ? 'pass' : 'review'
    },
    fontAnalysis: {
      estimatedNumeralHeightMm: 2.5,
      minimumRequiredMm: 2.0,
      contrastRatio: 6.2,
      readabilityScore: 88,
      status: 'pass',
      assessment: 'QR metadata verified against Legal Metrology requirements.'
    },
    dateDeclaration: {
      mfgDate: parsed.mfgDate,
      expiryOrBestBefore: parsed.expiryDate,
      formatValid: !!parsed.mfgDate || !!parsed.expiryDate,
      confidence: 80,
      status: parsed.mfgDate ? 'pass' : 'review'
    }
  };

  const evaluation = evaluateComplianceRules(
    dynamicDeclarations,
    dynamicMeasurements,
    LEGAL_METROLOGY_RULES
  );

  return {
    parsed,
    matchedPreset: null,
    matchedInspection: null,
    evaluation,
    complianceState: evaluation.overallStatus,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
  };
}

/**
 * Synthesize a full Inspection record from a verified QR result
 */
export function createInspectionFromQr(
  qrResult: QrVerificationResult,
  inspectorName: string,
  inspectorId: string,
  existingInspectionsCount: number
): Inspection {
  const { parsed, matchedPreset, matchedInspection, evaluation } = qrResult;

  if (matchedInspection) {
    return matchedInspection;
  }

  const idSuffix = String(existingInspectionsCount + 30).padStart(5, '0');
  const inspectionId = `LM-2026-${idSuffix}`;
  const now = new Date();

  if (matchedPreset) {
    return {
      id: inspectionId,
      productId: matchedPreset.id,
      productName: matchedPreset.name,
      brand: matchedPreset.brand,
      category: matchedPreset.category,
      manufacturer: matchedPreset.manufacturer,
      barcode: matchedPreset.barcode,
      inspectorId,
      inspectorName,
      timestamp: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      status: matchedPreset.expectedStatus,
      screeningScore: matchedPreset.screeningScore,
      images: matchedPreset.images,
      extractedDeclarations: matchedPreset.extractedDeclarations,
      measurements: matchedPreset.measurements,
      ruleResults: matchedPreset.ruleResults,
      boundingBoxes: matchedPreset.boundingBoxes,
      humanReview: {
        reviewedBy: inspectorName,
        status: 'UNVERIFIED',
        remarks: `Initiated via Real QR Camera Scanner. Decoded format: ${parsed.formatType}.`
      },
      region: 'Assam & North East Zone',
      locationDetails: 'Field Sector Unit • QR Code Verification'
    };
  }

  // Create new inspection for unrecognized product
  return {
    id: inspectionId,
    productId: parsed.barcode || `qr-prod-${Date.now()}`,
    productName: parsed.productName || parsed.title || 'Packaged Commodity (QR Decoded)',
    brand: parsed.brand || 'Field Verified Brand',
    category: 'General Packaged Goods',
    manufacturer: parsed.manufacturer || 'Pending Field Label Verification',
    barcode: parsed.barcode || 'NO_EAN_IN_QR',
    inspectorId,
    inspectorName,
    timestamp: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    status: evaluation.overallStatus,
    screeningScore: evaluation.screeningScore,
    images: [],
    extractedDeclarations: [
      {
        id: 'decl-qr-val',
        field: 'qrPayload',
        label: 'Decoded QR Value',
        value: parsed.rawValue,
        confidence: 100,
        status: 'pass',
        legalRequirement: 'Statutory QR / E-label declaration'
      }
    ],
    measurements: {
      mrp: {
        value: parsed.mrp || '0.00',
        detectedCurrency: '₹',
        taxInclusiveClause: false,
        confidence: 50,
        status: 'review'
      },
      netQuantity: {
        quantity: parsed.netQuantity || '0',
        unit: 'g',
        standardSymbolUsed: true,
        confidence: 50,
        status: 'review'
      },
      fontAnalysis: {
        estimatedNumeralHeightMm: 2.0,
        minimumRequiredMm: 2.0,
        contrastRatio: 6.0,
        readabilityScore: 85,
        status: 'pass',
        assessment: 'Evaluated from digital QR stream'
      },
      dateDeclaration: {
        formatValid: true,
        confidence: 75,
        status: 'review'
      }
    },
    ruleResults: evaluation.ruleResults,
    boundingBoxes: [],
    humanReview: {
      reviewedBy: inspectorName,
      status: 'UNVERIFIED',
      remarks: `Scanned with i-Scan live camera QR decoder. Format: ${parsed.formatType}. Proceed with physical multi-angle label verification.`
    },
    region: 'Field Enforcement Zone',
    locationDetails: 'Live Field QR Scan Terminal'
  };
}

/**
 * Synthesize an Inspection directly from ProductLookupResult
 */
export function createInspectionFromLookup(
  lookupResult: ProductLookupResult,
  inspectorName: string,
  inspectorId: string,
  existingInspectionsCount: number
): Inspection {
  if (lookupResult.matchedInspection) {
    return lookupResult.matchedInspection;
  }

  const idSuffix = String(existingInspectionsCount + 30).padStart(5, '0');
  const inspectionId = `LM-2026-${idSuffix}`;
  const now = new Date();

  if (lookupResult.matchedPreset) {
    const p = lookupResult.matchedPreset;
    return {
      id: inspectionId,
      productId: p.id,
      productName: p.name,
      brand: p.brand,
      category: p.category,
      manufacturer: p.manufacturer,
      barcode: p.barcode,
      inspectorId,
      inspectorName,
      timestamp: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      status: p.expectedStatus,
      screeningScore: p.screeningScore,
      images: p.images,
      extractedDeclarations: p.extractedDeclarations,
      measurements: p.measurements,
      ruleResults: p.ruleResults,
      boundingBoxes: p.boundingBoxes,
      humanReview: {
        reviewedBy: inspectorName,
        status: 'UNVERIFIED',
        remarks: `Initiated via Real QR Camera Scanner. Product verified: ${p.name}.`
      },
      region: 'Assam & North East Zone',
      locationDetails: 'Field Sector Unit • QR Code Verification'
    };
  }

  // Unregistered or partial data product
  const pName = lookupResult.product?.productName || (lookupResult.productFound ? 'Packaged Commodity' : 'Unregistered Product');
  const pBrand = lookupResult.product?.brand || 'Unregistered Brand';
  const pMfg = lookupResult.packageInfo?.manufacturerAddress || lookupResult.product?.manufacturer || 'Unverified in Registry';
  const pBarcode = lookupResult.product?.gtin || lookupResult.qr.extractedIdentifier || lookupResult.qr.rawValue;

  return {
    id: inspectionId,
    productId: lookupResult.product?.productId || `qr-prod-${Date.now()}`,
    productName: pName,
    brand: pBrand,
    category: lookupResult.product?.category || 'General Packaged Goods',
    manufacturer: pMfg,
    barcode: pBarcode,
    inspectorId,
    inspectorName,
    timestamp: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    status:
      lookupResult.complianceStatus === 'COMPLIANT'
        ? 'COMPLIANT'
        : lookupResult.complianceStatus === 'NON-COMPLIANT'
        ? 'POTENTIAL_VIOLATION'
        : 'NEEDS_REVIEW',
    screeningScore: lookupResult.screeningScore,
    images: [],
    extractedDeclarations: [
      {
        id: 'decl-unreg-name',
        field: 'productName',
        label: 'Generic Name of Commodity',
        value: lookupResult.product?.productName || 'Not available',
        confidence: lookupResult.product?.productName ? 95 : 30,
        status: lookupResult.product?.productName ? 'pass' : 'review',
        legalRequirement: 'Rule 6(1)(b) - Common or generic name'
      },
      {
        id: 'decl-unreg-mfg',
        field: 'manufacturer',
        label: 'Manufacturer & Address',
        value: pMfg,
        confidence: pMfg !== 'Unverified in Registry' ? 90 : 30,
        status: pMfg !== 'Unverified in Registry' ? 'pass' : 'fail',
        legalRequirement: 'Rule 6(1)(a) - Name & address of manufacturer'
      },
      {
        id: 'decl-unreg-netqty',
        field: 'netQuantity',
        label: 'Net Quantity',
        value: lookupResult.packageInfo?.netQuantity || 'Not available',
        confidence: lookupResult.packageInfo?.netQuantity ? 90 : 30,
        status: lookupResult.packageInfo?.netQuantity ? 'pass' : 'fail',
        legalRequirement: 'Rule 6(1)(c) - Metric net quantity'
      },
      {
        id: 'decl-unreg-mrp',
        field: 'mrp',
        label: 'Maximum Retail Price',
        value: lookupResult.packageInfo?.mrp || 'Not available',
        confidence: lookupResult.packageInfo?.mrp ? 90 : 30,
        status: lookupResult.packageInfo?.mrp ? 'pass' : 'fail',
        legalRequirement: 'Rule 6(1)(d) - MRP with all taxes'
      },
      {
        id: 'decl-unreg-care',
        field: 'consumerCare',
        label: 'Consumer Care Cell',
        value: lookupResult.packageInfo?.customerCare || 'Not available',
        confidence: lookupResult.packageInfo?.customerCare ? 90 : 30,
        status: lookupResult.packageInfo?.customerCare ? 'pass' : 'fail',
        legalRequirement: 'Rule 6(1)(g) - Consumer grievance details'
      },
      {
        id: 'decl-unreg-qrval',
        field: 'qrPayload',
        label: 'Decoded QR Value',
        value: lookupResult.qr.rawValue,
        confidence: 100,
        status: 'pass',
        legalRequirement: 'Statutory QR payload'
      }
    ],
    measurements: {
      mrp: {
        value: lookupResult.packageInfo?.mrp || '0.00',
        detectedCurrency: '₹',
        taxInclusiveClause: !!lookupResult.packageInfo?.mrp && lookupResult.packageInfo.mrp.toLowerCase().includes('tax'),
        confidence: lookupResult.packageInfo?.mrp ? 80 : 30,
        status: lookupResult.packageInfo?.mrp ? 'pass' : 'review'
      },
      netQuantity: {
        quantity: lookupResult.packageInfo?.netQuantity ? lookupResult.packageInfo.netQuantity.replace(/[^\d.]/g, '') : '0',
        unit: 'g',
        standardSymbolUsed: true,
        confidence: lookupResult.packageInfo?.netQuantity ? 80 : 30,
        status: lookupResult.packageInfo?.netQuantity ? 'pass' : 'review'
      },
      fontAnalysis: {
        estimatedNumeralHeightMm: 2.0,
        minimumRequiredMm: 2.0,
        contrastRatio: 6.0,
        readabilityScore: 85,
        status: 'pass',
        assessment: 'Evaluated from digital QR stream'
      },
      dateDeclaration: {
        mfgDate: lookupResult.packageInfo?.mfgDate || undefined,
        expiryOrBestBefore: lookupResult.packageInfo?.expiryDate || undefined,
        formatValid: !!lookupResult.packageInfo?.mfgDate || !!lookupResult.packageInfo?.expiryDate,
        confidence: 75,
        status: 'review'
      }
    },
    ruleResults: lookupResult.ruleEvaluationSummary.ruleResults,
    boundingBoxes: [],
    humanReview: {
      reviewedBy: inspectorName,
      status: 'UNVERIFIED',
      remarks: `Scanned with i-Scan live camera QR decoder. Status: ${lookupResult.lookupStatus}. Scan package label to complete physical verification.`
    },
    region: 'Field Enforcement Zone',
    locationDetails: 'Live Field QR Scan Terminal'
  };
}

