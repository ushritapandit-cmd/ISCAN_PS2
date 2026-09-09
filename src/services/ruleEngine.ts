import { ExtractedDeclaration, PackageMeasurement, RuleEvaluationResult, InspectionStatus, Rule } from '../types';
import { LEGAL_METROLOGY_RULES } from '../data/rules';

export interface RuleEvaluationSummary {
  overallStatus: InspectionStatus;
  screeningScore: number; // 0-100
  passedCount: number;
  violationsCount: number;
  needsReviewCount: number;
  ruleResults: RuleEvaluationResult[];
}

/**
 * Versioned Legal Metrology Compliance Rule Engine
 * Deterministic rules evaluated on structured product declarations.
 */
export function evaluateComplianceRules(
  declarations: ExtractedDeclaration[],
  measurements: PackageMeasurement,
  activeRules: Rule[] = LEGAL_METROLOGY_RULES
): RuleEvaluationSummary {
  const ruleResults: RuleEvaluationResult[] = [];

  const declMap = new Map<string, ExtractedDeclaration>();
  declarations.forEach((d) => declMap.set(d.field, d));

  let passedCount = 0;
  let violationsCount = 0;
  let needsReviewCount = 0;

  activeRules.forEach((rule) => {
    let result: 'PASS' | 'POTENTIAL_VIOLATION' | 'NEEDS_REVIEW' | 'NOT_APPLICABLE' = 'PASS';
    let confidence = 95;
    let evidenceNotes = '';
    let recommendation = 'Compliant with statutory requirements.';

    switch (rule.ruleId) {
      case 'LM-001': {
        // Manufacturer / Packer / Importer Name & Address
        const mfgDecl = declMap.get('manufacturer');
        if (!mfgDecl || mfgDecl.value.toLowerCase().includes('not detected') || mfgDecl.value.trim().length < 5) {
          result = 'POTENTIAL_VIOLATION';
          confidence = mfgDecl ? mfgDecl.confidence : 90;
          evidenceNotes = 'Mandatory declaration of Manufacturer, Packer, or Importer name and address is missing or incomplete.';
          recommendation = 'Issue notice under Rule 6(1)(a) / Section 36(1) of Legal Metrology Act, 2009.';
        } else if (mfgDecl.confidence < 75) {
          result = 'NEEDS_REVIEW';
          confidence = mfgDecl.confidence;
          evidenceNotes = `Manufacturer text detected with low confidence (${mfgDecl.confidence}%). Check address details physically.`;
          recommendation = 'Manual inspection required to verify complete registered address.';
        } else {
          result = 'PASS';
          confidence = mfgDecl.confidence;
          evidenceNotes = `Registered entity name & address verified: "${mfgDecl.value}".`;
        }
        break;
      }

      case 'LM-002': {
        // Generic or Common Product Name
        const nameDecl = declMap.get('productName');
        if (!nameDecl || nameDecl.value.toLowerCase().includes('not detected')) {
          result = 'POTENTIAL_VIOLATION';
          confidence = 92;
          evidenceNotes = 'Common or generic name not found on the principal display panel.';
          recommendation = 'Verify if generic name is declared under brand logo per Rule 6(1)(b).';
        } else {
          result = 'PASS';
          confidence = nameDecl.confidence;
          evidenceNotes = `Generic commodity name declared: "${nameDecl.value}".`;
        }
        break;
      }

      case 'LM-003': {
        // Net Quantity & Metric Units
        const netQtyDecl = declMap.get('netQuantity');
        if (!netQtyDecl || netQtyDecl.value.toLowerCase().includes('not detected')) {
          result = 'POTENTIAL_VIOLATION';
          confidence = 95;
          evidenceNotes = 'Net quantity declaration absent.';
          recommendation = 'Violation of Rule 6(1)(c). Net quantity is a non-negotiable consumer declaration.';
        } else if (!measurements.netQuantity.standardSymbolUsed) {
          result = 'POTENTIAL_VIOLATION';
          confidence = 94;
          evidenceNotes = 'Non-standard unit symbol detected. Rule 12 specifies strict SI symbols (g, kg, ml, l, etc.).';
          recommendation = 'Issue advisory/notice for non-conforming unit symbols.';
        } else if (netQtyDecl.confidence < 75) {
          result = 'NEEDS_REVIEW';
          confidence = netQtyDecl.confidence;
          evidenceNotes = 'Net quantity numeral extracted with low optical confidence.';
          recommendation = 'Confirm net weight/volume with physical packaging inspection.';
        } else {
          result = 'PASS';
          confidence = netQtyDecl.confidence;
          evidenceNotes = `Net quantity properly declared with standard SI unit: "${netQtyDecl.value}".`;
        }
        break;
      }

      case 'LM-004': {
        // MRP & Tax Inclusive Clause
        const mrpDecl = declMap.get('mrp');
        if (!mrpDecl || mrpDecl.value.toLowerCase().includes('not detected')) {
          result = 'POTENTIAL_VIOLATION';
          confidence = 95;
          evidenceNotes = 'Maximum Retail Price declaration absent on package.';
          recommendation = 'Direct violation of Rule 6(1)(d).';
        } else if (!measurements.mrp.taxInclusiveClause) {
          result = 'POTENTIAL_VIOLATION';
          confidence = mrpDecl.confidence;
          evidenceNotes = 'MRP printed without mandatory "inclusive of all taxes" / "incl. of all taxes" wording.';
          recommendation = 'Notice under Rule 6(1)(d) & Section 36(1) for missing tax inclusion text.';
        } else if (mrpDecl.confidence < 75) {
          result = 'NEEDS_REVIEW';
          confidence = mrpDecl.confidence;
          evidenceNotes = `MRP extracted with ${mrpDecl.confidence}% confidence due to background contrast/glare.`;
          recommendation = 'Inspector must verify printed MRP manually.';
        } else {
          result = 'PASS';
          confidence = mrpDecl.confidence;
          evidenceNotes = `Valid MRP with tax inclusive clause detected: "${mrpDecl.value}".`;
        }
        break;
      }

      case 'LM-005': {
        // Date of Packing / Mfg
        const dateDecl = declMap.get('mfgDate');
        if (!dateDecl || dateDecl.value.toLowerCase().includes('not detected') || dateDecl.status === 'fail') {
          result = 'POTENTIAL_VIOLATION';
          confidence = dateDecl ? dateDecl.confidence : 90;
          evidenceNotes = 'Month and year of manufacture or packing omitted or invalid format.';
          recommendation = 'Violation of Rule 6(1)(e). Month and year are both compulsory.';
        } else if (dateDecl.confidence < 75 || !measurements.dateDeclaration.formatValid) {
          result = 'NEEDS_REVIEW';
          confidence = dateDecl.confidence;
          evidenceNotes = 'Date format requires inspection verification (e.g. only year or non-standard format).';
          recommendation = 'Check stamp on crimp or bottom seal for legible MM/YYYY.';
        } else {
          result = 'PASS';
          confidence = dateDecl.confidence;
          evidenceNotes = `Date of manufacture/packing correctly declared: "${dateDecl.value}".`;
        }
        break;
      }

      case 'LM-006': {
        // Country of Origin
        const originDecl = declMap.get('countryOfOrigin');
        if (!originDecl || originDecl.value.toLowerCase().includes('not specified') || originDecl.status === 'fail') {
          result = 'POTENTIAL_VIOLATION';
          confidence = originDecl ? originDecl.confidence : 92;
          evidenceNotes = 'Country of origin is missing on the package or import sticker.';
          recommendation = 'Issue notice under Rule 6(1)(f) (2020 Amendment).';
        } else {
          result = 'PASS';
          confidence = originDecl.confidence;
          evidenceNotes = `Origin declared: "${originDecl.value}".`;
        }
        break;
      }

      case 'LM-007': {
        // Consumer Care Cell Details
        const careDecl = declMap.get('consumerCare');
        if (!careDecl || careDecl.value.toLowerCase().includes('not detected') || careDecl.status === 'fail') {
          result = 'POTENTIAL_VIOLATION';
          confidence = careDecl ? careDecl.confidence : 92;
          evidenceNotes = 'No consumer grievance telephone number or email address found on packaging.';
          recommendation = 'Violation of Rule 6(1)(g). Mandatory consumer care cell omitted.';
        } else if (careDecl.confidence < 75) {
          result = 'NEEDS_REVIEW';
          confidence = careDecl.confidence;
          evidenceNotes = 'Consumer care contact digits truncated or partially obscured in photo.';
          recommendation = 'Physically verify helpline number on package.';
        } else {
          result = 'PASS';
          confidence = careDecl.confidence;
          evidenceNotes = `Consumer grievance telephone/email verified: "${careDecl.value}".`;
        }
        break;
      }

      case 'LM-008': {
        // Unit Sale Price (USP)
        const uspDecl = declMap.get('unitSalePrice');
        const netQtyNumber = parseFloat(measurements.netQuantity.quantity || '0');
        const isEligibleForUsp = netQtyNumber > 100;

        if (isEligibleForUsp && (!uspDecl || uspDecl.value.toLowerCase().includes('not detected') || uspDecl.status === 'fail')) {
          result = 'POTENTIAL_VIOLATION';
          confidence = 91;
          evidenceNotes = 'Commodity exceeds 100g/100ml but Unit Sale Price (per g/ml) is absent.';
          recommendation = 'Violation of Rule 6(11) (2021 Amendment). Unit Sale Price mandatory.';
        } else if (uspDecl && uspDecl.confidence < 75) {
          result = 'NEEDS_REVIEW';
          confidence = uspDecl.confidence;
          evidenceNotes = 'Unit sale price calculation requires human verification.';
          recommendation = 'Verify unit price ratio against net quantity.';
        } else {
          result = 'PASS';
          confidence = uspDecl ? uspDecl.confidence : 90;
          evidenceNotes = uspDecl ? `Unit Sale Price stated: "${uspDecl.value}".` : 'Not strictly applicable for mini/single-serve packages ≤ 100g.';
        }
        break;
      }

      case 'LM-009': {
        // Numeral Size & Readability
        if (measurements.fontAnalysis.status === 'review' || measurements.fontAnalysis.estimatedNumeralHeightMm < measurements.fontAnalysis.minimumRequiredMm) {
          result = 'NEEDS_REVIEW';
          confidence = Math.round(measurements.fontAnalysis.readabilityScore);
          evidenceNotes = `Estimated numeral height ${measurements.fontAnalysis.estimatedNumeralHeightMm} mm is below statutory threshold ${measurements.fontAnalysis.minimumRequiredMm} mm (Schedule II).`;
          recommendation = 'AI font height is advisory only. Inspector must perform physical measurement with calibrated gauge.';
        } else {
          result = 'PASS';
          confidence = 94;
          evidenceNotes = `Estimated numeral height (${measurements.fontAnalysis.estimatedNumeralHeightMm} mm) complies with statutory minimum (${measurements.fontAnalysis.minimumRequiredMm} mm).`;
        }
        break;
      }

      default:
        result = 'PASS';
        confidence = 90;
        evidenceNotes = 'Automated screening rule satisfied.';
        break;
    }

    if (result === 'PASS') passedCount++;
    else if (result === 'POTENTIAL_VIOLATION') violationsCount++;
    else if (result === 'NEEDS_REVIEW') needsReviewCount++;

    ruleResults.push({
      ruleId: rule.ruleId,
      ruleName: rule.name,
      requirement: `${rule.section} - ${rule.name}`,
      result,
      confidence,
      evidenceNotes,
      recommendation,
      verifiedStatus: 'UNVERIFIED'
    });
  });

  // Calculate screening score (NOT legal judgment)
  const totalEvaluated = passedCount + violationsCount + needsReviewCount;
  const weightedScore = Math.round(
    ((passedCount * 1.0 + needsReviewCount * 0.5) / (totalEvaluated || 1)) * 100
  );

  let overallStatus: InspectionStatus = 'COMPLIANT';
  if (violationsCount > 0) {
    overallStatus = 'POTENTIAL_VIOLATION';
  } else if (needsReviewCount > 0) {
    overallStatus = 'NEEDS_REVIEW';
  }

  return {
    overallStatus,
    screeningScore: Math.max(10, Math.min(100, weightedScore)),
    passedCount,
    violationsCount,
    needsReviewCount,
    ruleResults
  };
}
