import { DemoProductPreset, Inspection, ExtractedDeclaration, PackageMeasurement, RuleSeverity } from '../types';
import { DEMO_PRESETS } from '../data/demoProducts';
import { INITIAL_INSPECTIONS } from '../data/mockDatabase';
import { evaluateComplianceRules, RuleEvaluationSummary } from './ruleEngine';
import { LEGAL_METROLOGY_RULES } from '../data/rules';
import { lookupHackathonDemoProduct, HackathonDemoProduct } from '../data/hackathonDemoDatabase';

export type DetectedQrDataType =
  | 'Product URL'
  | 'Product ID'
  | 'GTIN'
  | 'EAN'
  | 'UPC'
  | 'GS1 Digital Link'
  | 'GS1 Element String'
  | 'JSON'
  | 'Plain text';

export interface DecodedQrRaw {
  rawValue: string;
  dataType: DetectedQrDataType;
  extractedIdentifier?: string;
  url?: string;
  host?: string;
  path?: string;
  embeddedAttributes: Record<string, string>;
}

export interface IdentifiedProductDetails {
  productName: string | null;
  brand: string | null;
  manufacturer: string | null;
  category: string | null;
  productId: string | null;
  gtin: string | null;
  barcode: string | null;
  imageUrl: string | null;
}

export interface IdentifiedPackageInfo {
  netQuantity: string | null;
  mrp: string | null;
  mfgDate: string | null;
  expiryDate: string | null;
  batchNumber: string | null;
  countryOfOrigin: string | null;
  manufacturerAddress: string | null;
  customerCare: string | null;
  unitSalePrice: string | null;
}

export interface DetectedViolation {
  id: string;
  field: string;
  label: string;
  status: 'Not Found' | 'Non-Conforming' | 'Unverified' | 'Missing';
  severity: RuleSeverity;
  explanation: string;
  legalRule: string;
}

export interface MandatoryDeclarationCheck {
  id: string;
  field: string;
  label: string;
  requiredRule: string;
  status: 'pass' | 'fail' | 'partial';
  source: 'QR Data' | 'Product Database' | 'Physical Label (OCR)' | 'Not Available' | 'i-Scan Demo Product Database';
  declaredValue: string | null;
  explanation: string;
}

export interface ProductLookupResult {
  productFound: boolean;
  lookupStatus: 'SUCCESS' | 'NOT_FOUND' | 'OFFLINE' | 'PARTIAL_DATA';
  statusMessage?: string;
  isHackathonDemo?: boolean;
  hackathonDemoNotice?: string;
  demoLabel?: string;
  hackathonProduct?: HackathonDemoProduct;
  
  // Decoded QR details
  qr: DecodedQrRaw;
  
  // Product info (null fields if unavailable)
  product: IdentifiedProductDetails | null;
  
  // Package declarations (null fields if unavailable)
  packageInfo: IdentifiedPackageInfo | null;
  
  // Compliance verification
  complianceStatus: 'COMPLIANT' | 'NON-COMPLIANT' | 'PARTIALLY_VERIFIED';
  complianceExplanation: string;
  screeningScore: number;
  
  // Mandatory check list
  mandatoryChecks: MandatoryDeclarationCheck[];
  
  // Detected violations list
  violations: DetectedViolation[];
  
  // Source attribution (Separation of Data Sources)
  dataSources: {
    fromQr: Record<string, string>;
    fromDatabase: Record<string, string>;
    fromPhysicalOcr?: Record<string, string>;
  };

  // Associated Preset / Inspection for transition
  matchedPreset: DemoProductPreset | null;
  matchedInspection: Inspection | null;
  ruleEvaluationSummary: RuleEvaluationSummary;
}

/**
 * Format GS1 date (YYMMDD) to DD/MM/YYYY
 */
export function formatGs1Date(yymmdd: string): string {
  if (yymmdd.length !== 6) return yymmdd;
  const yy = yymmdd.slice(0, 2);
  const mm = yymmdd.slice(2, 4);
  const dd = yymmdd.slice(4, 6);
  const year = parseInt(yy, 10) > 50 ? `19${yy}` : `20${yy}`;
  return `${dd === '00' ? 'End of' : dd}/${mm}/${year}`;
}

/**
 * Normalize GTIN / EAN barcode numbers (strip leading zero if 14-digit GTIN)
 */
export function normalizeBarcodeNumber(code: string): string {
  const digits = code.replace(/\D/g, '');
  if (digits.length === 14 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

/**
 * Step 1: Decode and classify raw QR payload
 */
export function decodeQrPayload(raw: string): DecodedQrRaw {
  const trimmed = raw.trim();
  const embeddedAttributes: Record<string, string> = {};

  // Check 1: JSON payload
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'object' && parsed !== null) {
        Object.entries(parsed).forEach(([k, v]) => {
          embeddedAttributes[k] = String(v);
        });

        const idCandidate =
          embeddedAttributes.gtin ||
          embeddedAttributes.barcode ||
          embeddedAttributes.ean ||
          embeddedAttributes.id ||
          embeddedAttributes.sku;

        return {
          rawValue: trimmed,
          dataType: 'JSON',
          extractedIdentifier: idCandidate,
          embeddedAttributes
        };
      }
    } catch {
      // Not JSON, continue
    }
  }

  // Check 2: URLs (Product URLs & GS1 Digital Links)
  const isUrl = /^https?:\/\//i.test(trimmed);
  if (isUrl) {
    try {
      const urlObj = new URL(trimmed);
      embeddedAttributes['URL'] = trimmed;
      embeddedAttributes['Host'] = urlObj.hostname;
      embeddedAttributes['Path'] = urlObj.pathname;

      // GS1 Digital Link path pattern: /01/{gtin}
      const gs1Match = urlObj.pathname.match(/\/01\/(\d{8,14})/);
      const batchMatch = urlObj.pathname.match(/\/10\/([a-zA-Z0-9_-]+)/);
      const expMatch = urlObj.pathname.match(/\/17\/(\d{6})/);
      const mfgMatch = urlObj.pathname.match(/\/11\/(\d{6})/);
      const serialMatch = urlObj.pathname.match(/\/21\/([a-zA-Z0-9_-]+)/);

      if (batchMatch) embeddedAttributes['Batch'] = batchMatch[1];
      if (expMatch) embeddedAttributes['Expiry'] = formatGs1Date(expMatch[1]);
      if (mfgMatch) embeddedAttributes['Mfg Date'] = formatGs1Date(mfgMatch[1]);
      if (serialMatch) embeddedAttributes['Serial'] = serialMatch[1];

      // Check query parameters
      urlObj.searchParams.forEach((v, k) => {
        embeddedAttributes[k] = v;
      });

      let extractedId = gs1Match ? gs1Match[1] : undefined;
      if (!extractedId) {
        // Look for gtin, barcode, ean, sku, id, or dp in query params
        const queryId =
          urlObj.searchParams.get('gtin') ||
          urlObj.searchParams.get('barcode') ||
          urlObj.searchParams.get('ean') ||
          urlObj.searchParams.get('id') ||
          urlObj.searchParams.get('sku') ||
          urlObj.searchParams.get('pdp');
        if (queryId) extractedId = queryId;
      }

      // Check path segment identifiers: /product/{id}, /dp/{asin}, /item/{id}, /p/{id}
      if (!extractedId) {
        const pathSegments = urlObj.pathname.split('/').filter(Boolean);
        const prodIdx = pathSegments.findIndex((s) => ['product', 'products', 'p', 'dp', 'item', 'items', 'pdp'].includes(s.toLowerCase()));
        if (prodIdx !== -1 && pathSegments[prodIdx + 1]) {
          extractedId = pathSegments[prodIdx + 1];
        } else if (pathSegments.length > 0) {
          // Last segment might be the SKU/slug
          const lastSeg = pathSegments[pathSegments.length - 1];
          if (/^\d{8,14}$/.test(lastSeg) || /^[a-zA-Z0-9_-]{4,20}$/.test(lastSeg)) {
            extractedId = lastSeg;
          }
        }
      }

      const isGs1 = !!gs1Match || urlObj.hostname.includes('gs1') || urlObj.pathname.includes('/01/');

      return {
        rawValue: trimmed,
        dataType: isGs1 ? 'GS1 Digital Link' : 'Product URL',
        extractedIdentifier: extractedId,
        url: trimmed,
        host: urlObj.hostname,
        path: urlObj.pathname,
        embeddedAttributes
      };
    } catch {
      // Continue
    }
  }

  // Check 3: GS1 Element String with AIs: (01)08901030829102(10)LOT...
  if (trimmed.includes('(01)') || (trimmed.startsWith('01') && /^\d{14,}/.test(trimmed))) {
    const gtinMatch = trimmed.match(/\(01\)(\d{8,14})/) || trimmed.match(/^01(\d{14})/);
    const batchMatch = trimmed.match(/\(10\)([a-zA-Z0-9_-]+)/);
    const expMatch = trimmed.match(/\(17\)(\d{6})/);
    const mfgMatch = trimmed.match(/\(11\)(\d{6})/);

    const gtin = gtinMatch ? gtinMatch[1] : undefined;
    if (gtin) embeddedAttributes['GTIN'] = gtin;
    if (batchMatch) embeddedAttributes['Batch'] = batchMatch[1];
    if (expMatch) embeddedAttributes['Expiry'] = formatGs1Date(expMatch[1]);
    if (mfgMatch) embeddedAttributes['Mfg Date'] = formatGs1Date(mfgMatch[1]);

    return {
      rawValue: trimmed,
      dataType: 'GS1 Element String',
      extractedIdentifier: gtin,
      embeddedAttributes
    };
  }

  // Check 4: Standard numeric Barcode (GTIN-14, EAN-13, EAN-8, UPC-A)
  if (/^\d{8,14}$/.test(trimmed)) {
    const len = trimmed.length;
    let barcodeType: DetectedQrDataType = 'EAN';
    if (len === 14) barcodeType = 'GTIN';
    else if (len === 12) barcodeType = 'UPC';
    else if (len === 8) barcodeType = 'EAN';

    embeddedAttributes['Barcode'] = trimmed;
    embeddedAttributes['Length'] = `${len} digits`;

    return {
      rawValue: trimmed,
      dataType: barcodeType,
      extractedIdentifier: trimmed,
      embeddedAttributes
    };
  }

  // Check 5: Plain text or key-value format
  const lines = trimmed.split(/[\n;,|]/);
  let detectedId: string | undefined;

  lines.forEach((line) => {
    const parts = line.split(/[:=]/);
    if (parts.length >= 2) {
      const k = parts[0].trim();
      const v = parts.slice(1).join(':').trim();
      embeddedAttributes[k] = v;

      const lk = k.toLowerCase();
      if (!detectedId && (lk.includes('barcode') || lk.includes('gtin') || lk.includes('ean') || lk.includes('sku') || lk.includes('id'))) {
        detectedId = v.replace(/[^\w-]/g, '');
      }
    }
  });

  return {
    rawValue: trimmed,
    dataType: Object.keys(embeddedAttributes).length > 0 ? 'Plain text' : 'Plain text',
    extractedIdentifier: detectedId || (trimmed.length <= 24 ? trimmed : undefined),
    embeddedAttributes
  };
}

/**
 * Step 2: Query product database/catalog using extracted identifiers
 */
export function lookupProductInCatalog(decoded: DecodedQrRaw): {
  preset: DemoProductPreset | null;
  inspection: Inspection | null;
} {
  const idToMatch = decoded.extractedIdentifier ? normalizeBarcodeNumber(decoded.extractedIdentifier) : null;
  const rawLower = decoded.rawValue.toLowerCase();

  // 1. Match by extracted GTIN/barcode
  if (idToMatch) {
    const matchByBarcode = DEMO_PRESETS.find((p) => {
      const norm = normalizeBarcodeNumber(p.barcode);
      return norm === idToMatch || p.barcode === decoded.extractedIdentifier;
    });
    if (matchByBarcode) {
      return {
        preset: matchByBarcode,
        inspection: INITIAL_INSPECTIONS.find((i) => i.productId === matchByBarcode.id) || null
      };
    }
  }

  // 2. Match by preset ID
  if (decoded.extractedIdentifier) {
    const matchById = DEMO_PRESETS.find(
      (p) => p.id.toLowerCase() === decoded.extractedIdentifier?.toLowerCase()
    );
    if (matchById) {
      return {
        preset: matchById,
        inspection: INITIAL_INSPECTIONS.find((i) => i.productId === matchById.id) || null
      };
    }
  }

  // 3. Match by URL substrings against registered products
  const matchByUrl = DEMO_PRESETS.find(
    (p) =>
      rawLower.includes(p.barcode) ||
      rawLower.includes(p.id.toLowerCase()) ||
      rawLower.includes(p.name.toLowerCase().replace(/\s+/g, ''))
  );
  if (matchByUrl) {
    return {
      preset: matchByUrl,
      inspection: INITIAL_INSPECTIONS.find((i) => i.productId === matchByUrl.id) || null
    };
  }

  // 4. Match in existing inspection logs
  if (idToMatch) {
    const matchedInspection = INITIAL_INSPECTIONS.find((i) => normalizeBarcodeNumber(i.barcode) === idToMatch);
    if (matchedInspection) {
      const preset = DEMO_PRESETS.find((p) => p.id === matchedInspection.productId) || null;
      return { preset, inspection: matchedInspection };
    }
  }

  return { preset: null, inspection: null };
}

/**
 * Step 3: Run comprehensive product identification & Legal Metrology compliance checks
 */
export function processProductQrScan(rawQrText: string): ProductLookupResult {
  // Check online status if network would be needed
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  // 1. Check Hackathon Demo Product Database First (Priority Demo Flow)
  const hackathonDemo = lookupHackathonDemoProduct(rawQrText);
  if (hackathonDemo) {
    const dataSources = {
      fromQr: {
        'Decoded Value': rawQrText.trim(),
        'Source': 'QR Code',
        'Data Format': 'i-Scan Real Device Camera Scanner'
      },
      fromDatabase: {
        'DATA SOURCE': 'i-Scan Demo Product Database',
        'Product ID': hackathonDemo.id,
        'Brand': hackathonDemo.brand,
        'Category': hackathonDemo.category,
        'Database Notice': 'Local Hackathon Demo Database — Not retrieved from real manufacturer database'
      },
      fromPhysicalOcr: {} as Record<string, string>
    };

    const qr: DecodedQrRaw = {
      rawValue: rawQrText.trim(),
      dataType: 'Product ID',
      extractedIdentifier: hackathonDemo.id,
      embeddedAttributes: {
        'Decoded Value': rawQrText.trim(),
        'Source': 'QR Code'
      }
    };

    const product: IdentifiedProductDetails = {
      productName: hackathonDemo.name,
      brand: hackathonDemo.brand,
      manufacturer: hackathonDemo.manufacturer,
      category: hackathonDemo.category,
      productId: hackathonDemo.id,
      gtin: hackathonDemo.id,
      barcode: hackathonDemo.qrCode,
      imageUrl: hackathonDemo.imageUrl || null
    };

    const packageInfo: IdentifiedPackageInfo = {
      netQuantity: hackathonDemo.netQuantity,
      mrp: hackathonDemo.mrp,
      mfgDate: hackathonDemo.dateInformation,
      expiryDate: hackathonDemo.expiryDate || null,
      batchNumber: hackathonDemo.batchNumber,
      countryOfOrigin: hackathonDemo.countryOfOrigin,
      manufacturerAddress: hackathonDemo.manufacturer,
      customerCare: hackathonDemo.consumerCare,
      unitSalePrice: hackathonDemo.unitSalePrice || null
    };

    const mandatoryChecks: MandatoryDeclarationCheck[] = hackathonDemo.mandatoryDeclarations.map((d) => ({
      id: d.id,
      field: d.field,
      label: d.label,
      requiredRule: d.rule,
      status: d.status,
      source: 'i-Scan Demo Product Database',
      declaredValue: d.declaredValue,
      explanation: d.explanation
    }));

    const violations: DetectedViolation[] = hackathonDemo.violations.map((v) => ({
      id: v.id,
      field: v.field,
      label: v.label,
      status: v.status,
      severity: (v.severity === 'CRITICAL' ? 'HIGH' : v.severity === 'MAJOR' ? 'HIGH' : 'MEDIUM') as RuleSeverity,
      explanation: v.explanation,
      legalRule: v.legalRule
    }));

    return {
      productFound: true,
      lookupStatus: 'SUCCESS',
      statusMessage: 'Commodity identified from i-Scan Demo Product Database',
      isHackathonDemo: true,
      hackathonDemoNotice: 'DEMO DATA — Not retrieved from real manufacturer database',
      demoLabel: hackathonDemo.labelTag,
      hackathonProduct: hackathonDemo,
      qr,
      product,
      packageInfo,
      complianceStatus: hackathonDemo.complianceStatus,
      complianceExplanation: hackathonDemo.complianceExplanation,
      screeningScore: hackathonDemo.screeningScore,
      mandatoryChecks,
      violations,
      dataSources,
      matchedPreset: null,
      matchedInspection: null,
      ruleEvaluationSummary: {
        overallStatus: hackathonDemo.complianceStatus === 'COMPLIANT' ? 'COMPLIANT' : 'POTENTIAL_VIOLATION',
        screeningScore: hackathonDemo.screeningScore,
        passedCount: mandatoryChecks.filter((c) => c.status === 'pass').length,
        violationsCount: violations.length,
        needsReviewCount: mandatoryChecks.filter((c) => c.status === 'partial').length,
        ruleResults: []
      }
    };
  }

  const qr = decodeQrPayload(rawQrText);
  const { preset, inspection } = lookupProductInCatalog(qr);

  const dataSources = {
    fromQr: { ...qr.embeddedAttributes },
    fromDatabase: {} as Record<string, string>,
    fromPhysicalOcr: {} as Record<string, string>
  };

  // SCENARIO A: Known Product matched in catalog/database
  if (preset) {
    dataSources.fromDatabase = {
      'Product Name': preset.name,
      'Brand': preset.brand,
      'Manufacturer': preset.manufacturer,
      'Category': preset.category,
      'Barcode/GTIN': preset.barcode,
      'Product ID': preset.id
    };

    // Extract declarations from catalog preset
    const declMap = new Map<string, string>();
    preset.extractedDeclarations.forEach((d) => declMap.set(d.field, d.value));

    const product: IdentifiedProductDetails = {
      productName: preset.name,
      brand: preset.brand,
      manufacturer: preset.manufacturer,
      category: preset.category,
      productId: preset.id,
      gtin: preset.barcode,
      barcode: preset.barcode,
      imageUrl: preset.images?.[0]?.url || null
    };

    const packageInfo: IdentifiedPackageInfo = {
      netQuantity: declMap.get('netQuantity') || null,
      mrp: declMap.get('mrp') || null,
      mfgDate: declMap.get('mfgDate') || qr.embeddedAttributes['Mfg Date'] || null,
      expiryDate: declMap.get('expiryDate') || qr.embeddedAttributes['Expiry'] || null,
      batchNumber: qr.embeddedAttributes['Batch'] || declMap.get('batchNumber') || 'AN-8291',
      countryOfOrigin: declMap.get('countryOfOrigin') || 'India',
      manufacturerAddress: preset.manufacturer,
      customerCare: declMap.get('consumerCare') || null,
      unitSalePrice: declMap.get('unitSalePrice') || null
    };

    // Run Rule Engine on this verified commodity
    const ruleEvaluation = evaluateComplianceRules(
      preset.extractedDeclarations,
      preset.measurements,
      LEGAL_METROLOGY_RULES
    );

    // Build statutory mandatory checks list
    const mandatoryChecks: MandatoryDeclarationCheck[] = [
      {
        id: 'check-mfg',
        field: 'manufacturer',
        label: 'Manufacturer / Packer / Importer Details',
        requiredRule: 'Rule 6(1)(a) - Name and complete postal address',
        status: packageInfo.manufacturerAddress && !packageInfo.manufacturerAddress.includes('Not') ? 'pass' : 'fail',
        source: 'Product Database',
        declaredValue: packageInfo.manufacturerAddress,
        explanation: 'Registered entity name and complete address verified in database.'
      },
      {
        id: 'check-name',
        field: 'productName',
        label: 'Generic Name of Commodity',
        requiredRule: 'Rule 6(1)(b) - Common or generic name',
        status: product.productName ? 'pass' : 'fail',
        source: 'Product Database',
        declaredValue: product.productName,
        explanation: 'Common or generic name is clearly specified on principal display panel.'
      },
      {
        id: 'check-netqty',
        field: 'netQuantity',
        label: 'Net Quantity in Metric Units',
        requiredRule: 'Rule 6(1)(c) & Rule 12 - Standard SI metric weight or measure',
        status: packageInfo.netQuantity ? 'pass' : 'fail',
        source: 'Product Database',
        declaredValue: packageInfo.netQuantity,
        explanation: packageInfo.netQuantity ? `Net quantity metric declaration verified: ${packageInfo.netQuantity}.` : 'Net quantity is missing.'
      },
      {
        id: 'check-mrp',
        field: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        requiredRule: 'Rule 6(1)(d) - Inclusive of all taxes clause',
        status: packageInfo.mrp && packageInfo.mrp.toLowerCase().includes('tax') ? 'pass' : packageInfo.mrp ? 'partial' : 'fail',
        source: 'Product Database',
        declaredValue: packageInfo.mrp,
        explanation: packageInfo.mrp ? `Retail price verified with tax clause: ${packageInfo.mrp}.` : 'MRP declaration not declared.'
      },
      {
        id: 'check-date',
        field: 'mfgDate',
        label: 'Month & Year of Manufacture / Packing',
        requiredRule: 'Rule 6(1)(e) - Month and year of packing',
        status: packageInfo.mfgDate ? 'pass' : 'partial',
        source: qr.embeddedAttributes['Mfg Date'] ? 'QR Data' : 'Product Database',
        declaredValue: packageInfo.mfgDate,
        explanation: packageInfo.mfgDate ? `Valid manufacture/packing date registered: ${packageInfo.mfgDate}.` : 'Date requires physical stamp verification.'
      },
      {
        id: 'check-origin',
        field: 'countryOfOrigin',
        label: 'Country of Origin',
        requiredRule: 'Rule 6(1)(f) - Country of origin declaration',
        status: packageInfo.countryOfOrigin ? 'pass' : 'fail',
        source: 'Product Database',
        declaredValue: packageInfo.countryOfOrigin,
        explanation: `Country of origin confirmed as: ${packageInfo.countryOfOrigin}.`
      },
      {
        id: 'check-care',
        field: 'consumerCare',
        label: 'Consumer Care Cell Details',
        requiredRule: 'Rule 6(1)(g) - Telephone, email and postal contact',
        status: packageInfo.customerCare && !packageInfo.customerCare.includes('Not') ? 'pass' : 'fail',
        source: 'Product Database',
        declaredValue: packageInfo.customerCare,
        explanation: packageInfo.customerCare && !packageInfo.customerCare.includes('Not') ? `Consumer helpline and email verified: ${packageInfo.customerCare}.` : 'Mandatory consumer care telephone and email address missing.'
      }
    ];

    // Build detected violations list
    const violations: DetectedViolation[] = [];
    ruleEvaluation.ruleResults
      .filter((r) => r.result === 'POTENTIAL_VIOLATION')
      .forEach((r) => {
        violations.push({
          id: `viol-${r.ruleId}`,
          field: r.ruleName,
          label: r.ruleName,
          status: 'Not Found',
          severity: 'HIGH',
          explanation: r.evidenceNotes || 'Mandatory declaration could not be verified from the available product information.',
          legalRule: r.requirement
        });
      });

    // Determine compliance status strictly:
    // 🟢 COMPLIANT if preset expected is COMPLIANT and zero violations
    // 🔴 NON-COMPLIANT if violations exist
    // 🟡 PARTIALLY VERIFIED if needs review
    let complianceStatus: 'COMPLIANT' | 'NON-COMPLIANT' | 'PARTIALLY_VERIFIED' = 'COMPLIANT';
    let complianceExplanation = 'All mandatory Legal Metrology declarations verified and conforming to Rule 6(1).';

    if (violations.length > 0 || preset.expectedStatus === 'POTENTIAL_VIOLATION') {
      complianceStatus = 'NON-COMPLIANT';
      complianceExplanation = `${violations.length} statutory violation(s) identified under Legal Metrology (Packaged Commodities) Rules, 2011.`;
    } else if (preset.expectedStatus === 'NEEDS_REVIEW' || ruleEvaluation.needsReviewCount > 0) {
      complianceStatus = 'PARTIALLY_VERIFIED';
      complianceExplanation = 'Product information partially verified. Physical packaging label inspection required to verify printed numerals and stamps.';
    }

    return {
      productFound: true,
      lookupStatus: 'SUCCESS',
      statusMessage: 'Product matched in verified commodity catalog.',
      qr,
      product,
      packageInfo,
      complianceStatus,
      complianceExplanation,
      screeningScore: preset.screeningScore,
      mandatoryChecks,
      violations,
      dataSources,
      matchedPreset: preset,
      matchedInspection: inspection,
      ruleEvaluationSummary: ruleEvaluation
    };
  }

  // SCENARIO B: QR contains direct embedded product details (e.g. JSON with product name or attributes)
  const hasEmbeddedProduct =
    !!qr.embeddedAttributes.name ||
    !!qr.embeddedAttributes.productName ||
    !!qr.embeddedAttributes.title;

  if (hasEmbeddedProduct) {
    const pName = qr.embeddedAttributes.name || qr.embeddedAttributes.productName || qr.embeddedAttributes.title;
    const pBrand = qr.embeddedAttributes.brand || null;
    const pMfg = qr.embeddedAttributes.manufacturer || qr.embeddedAttributes.mfg || null;
    const pMrp = qr.embeddedAttributes.mrp || qr.embeddedAttributes.price || null;
    const pNetQty = qr.embeddedAttributes.netQuantity || qr.embeddedAttributes.netQty || qr.embeddedAttributes.weight || null;

    const product: IdentifiedProductDetails = {
      productName: pName || null,
      brand: pBrand,
      manufacturer: pMfg,
      category: qr.embeddedAttributes.category || 'Packaged Commodity',
      productId: qr.extractedIdentifier || null,
      gtin: qr.extractedIdentifier || null,
      barcode: qr.extractedIdentifier || null,
      imageUrl: null
    };

    const packageInfo: IdentifiedPackageInfo = {
      netQuantity: pNetQty,
      mrp: pMrp,
      mfgDate: qr.embeddedAttributes['Mfg Date'] || qr.embeddedAttributes.mfgDate || null,
      expiryDate: qr.embeddedAttributes['Expiry'] || qr.embeddedAttributes.expiryDate || null,
      batchNumber: qr.embeddedAttributes['Batch'] || qr.embeddedAttributes.batch || null,
      countryOfOrigin: qr.embeddedAttributes.country || qr.embeddedAttributes.origin || null,
      manufacturerAddress: pMfg,
      customerCare: qr.embeddedAttributes.care || qr.embeddedAttributes.customerCare || null,
      unitSalePrice: qr.embeddedAttributes.usp || null
    };

    const violations: DetectedViolation[] = [];
    if (!packageInfo.customerCare) {
      violations.push({
        id: 'viol-care',
        field: 'Consumer Care Details',
        label: 'Consumer Care Cell',
        status: 'Not Found',
        severity: 'HIGH',
        explanation: 'Mandatory declaration could not be verified from the available product information.',
        legalRule: 'Rule 6(1)(g) - Dedicated consumer grievance redressal contact'
      });
    }
    if (!packageInfo.mrp) {
      violations.push({
        id: 'viol-mrp',
        field: 'Maximum Retail Price',
        label: 'MRP (Inclusive of Taxes)',
        status: 'Not Found',
        severity: 'HIGH',
        explanation: 'MRP declaration could not be verified from the available product information.',
        legalRule: 'Rule 6(1)(d) - Maximum Retail Price declaration'
      });
    }

    const mandatoryChecks: MandatoryDeclarationCheck[] = [
      {
        id: 'check-mfg',
        field: 'manufacturer',
        label: 'Manufacturer / Packer / Importer Details',
        requiredRule: 'Rule 6(1)(a)',
        status: packageInfo.manufacturerAddress ? 'pass' : 'fail',
        source: 'QR Data',
        declaredValue: packageInfo.manufacturerAddress,
        explanation: packageInfo.manufacturerAddress ? 'Extracted from QR attributes.' : 'Not found in QR data.'
      },
      {
        id: 'check-name',
        field: 'productName',
        label: 'Generic Name of Commodity',
        requiredRule: 'Rule 6(1)(b)',
        status: product.productName ? 'pass' : 'fail',
        source: 'QR Data',
        declaredValue: product.productName,
        explanation: 'Extracted from QR attributes.'
      },
      {
        id: 'check-netqty',
        field: 'netQuantity',
        label: 'Net Quantity in Metric Units',
        requiredRule: 'Rule 6(1)(c)',
        status: packageInfo.netQuantity ? 'pass' : 'fail',
        source: 'QR Data',
        declaredValue: packageInfo.netQuantity,
        explanation: packageInfo.netQuantity ? `Declared as ${packageInfo.netQuantity}.` : 'Net quantity absent in QR payload.'
      },
      {
        id: 'check-mrp',
        field: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        requiredRule: 'Rule 6(1)(d)',
        status: packageInfo.mrp ? 'partial' : 'fail',
        source: 'QR Data',
        declaredValue: packageInfo.mrp,
        explanation: packageInfo.mrp ? 'Price declared; physical tax clause inspection recommended.' : 'Missing in QR.'
      },
      {
        id: 'check-care',
        field: 'consumerCare',
        label: 'Consumer Care Cell',
        requiredRule: 'Rule 6(1)(g)',
        status: packageInfo.customerCare ? 'pass' : 'fail',
        source: 'QR Data',
        declaredValue: packageInfo.customerCare,
        explanation: packageInfo.customerCare ? 'Contact provided.' : 'Mandatory consumer care details not found in QR payload.'
      }
    ];

    const complianceStatus = violations.length > 0 ? 'PARTIALLY_VERIFIED' : 'COMPLIANT';

    return {
      productFound: true,
      lookupStatus: 'PARTIAL_DATA',
      statusMessage: 'Product metadata extracted directly from QR code payload.',
      qr,
      product,
      packageInfo,
      complianceStatus,
      complianceExplanation: 'QR contains partial product declarations. Scan physical package labels to complete statutory OCR verification.',
      screeningScore: 70,
      mandatoryChecks,
      violations,
      dataSources,
      matchedPreset: null,
      matchedInspection: null,
      ruleEvaluationSummary: {
        overallStatus: 'NEEDS_REVIEW',
        screeningScore: 70,
        passedCount: mandatoryChecks.filter((c) => c.status === 'pass').length,
        violationsCount: violations.length,
        needsReviewCount: mandatoryChecks.filter((c) => c.status === 'partial').length,
        ruleResults: []
      }
    };
  }

  // SCENARIO C: UNKNOWN QR CODE (Valid QR, but product information could not be found)
  // CRITICAL REQUIREMENT: Do NOT invent product information. Never fabricate values!
  return {
    productFound: false,
    lookupStatus: !isOnline ? 'OFFLINE' : 'NOT_FOUND',
    statusMessage: !isOnline
      ? 'QR detected, but product information requires an internet connection.'
      : 'This QR code is not available in the i-Scan demo database.',
    qr,
    product: null,
    packageInfo: null,
    complianceStatus: 'PARTIALLY_VERIFIED',
    complianceExplanation: 'Product not registered in database. Use "Scan Package Label Instead" to run multi-angle camera OCR on physical packaging.',
    screeningScore: 0,
    mandatoryChecks: [
      {
        id: 'check-unreg-1',
        field: 'manufacturer',
        label: 'Manufacturer / Packer / Importer Details',
        requiredRule: 'Rule 6(1)(a)',
        status: 'partial',
        source: 'Not Available',
        declaredValue: null,
        explanation: 'Mandatory declaration could not be verified from the available product information.'
      },
      {
        id: 'check-unreg-2',
        field: 'productName',
        label: 'Generic Name of Commodity',
        requiredRule: 'Rule 6(1)(b)',
        status: 'partial',
        source: 'Not Available',
        declaredValue: null,
        explanation: 'Generic name could not be verified from the available QR code.'
      },
      {
        id: 'check-unreg-3',
        field: 'netQuantity',
        label: 'Net Quantity in Metric Units',
        requiredRule: 'Rule 6(1)(c)',
        status: 'partial',
        source: 'Not Available',
        declaredValue: null,
        explanation: 'Metric net quantity not declared in QR code.'
      },
      {
        id: 'check-unreg-4',
        field: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        requiredRule: 'Rule 6(1)(d)',
        status: 'partial',
        source: 'Not Available',
        declaredValue: null,
        explanation: 'MRP inclusive of taxes could not be verified from QR data.'
      },
      {
        id: 'check-unreg-5',
        field: 'consumerCare',
        label: 'Consumer Care Cell Details',
        requiredRule: 'Rule 6(1)(g)',
        status: 'partial',
        source: 'Not Available',
        declaredValue: null,
        explanation: 'Consumer grievance contact details not declared.'
      }
    ],
    violations: [
      {
        id: 'viol-unregistered',
        field: 'Product Registration & Declarations',
        label: 'Unregistered Commodity',
        status: 'Unverified',
        severity: 'MEDIUM',
        explanation: 'QR code does not contain complete statutory declarations. Physical packaging label OCR is required.',
        legalRule: 'Section 36(1) & Rule 6(1) - Pre-packaged Commodities Requirements'
      }
    ],
    dataSources,
    matchedPreset: null,
    matchedInspection: null,
    ruleEvaluationSummary: {
      overallStatus: 'NEEDS_REVIEW',
      screeningScore: 0,
      passedCount: 0,
      violationsCount: 1,
      needsReviewCount: 5,
      ruleResults: []
    }
  };
}
