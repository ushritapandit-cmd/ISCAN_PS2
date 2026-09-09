export type UserRole = 'inspector' | 'supervisor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  region: string;
  badgeNumber: string;
  avatar?: string;
}

export type InspectionStatus = 'COMPLIANT' | 'NEEDS_REVIEW' | 'POTENTIAL_VIOLATION';
export type VerificationStatus = 'UNVERIFIED' | 'CONFIRMED' | 'REJECTED' | 'MODIFIED' | 'PENDING_SUPERVISOR';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type RuleSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

export interface BoundingBox {
  id: string;
  field: string;
  text: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  confidence: number;
  status: 'valid' | 'review' | 'violation';
}

export interface ExtractedDeclaration {
  id: string;
  field: string;
  label: string;
  value: string;
  confidence: number;
  status: 'pass' | 'review' | 'fail';
  boundingBox?: BoundingBox;
  isEditable?: boolean;
  legalRequirement: string;
}

export interface Rule {
  id: string;
  ruleId: string;
  name: string;
  requirement: string;
  section: string;
  version: string;
  applicability: string;
  severity: RuleSeverity;
  status: 'ACTIVE' | 'INACTIVE';
  description: string;
  lastUpdated: string;
  penaltyClause: string;
}

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  requirement: string;
  result: 'PASS' | 'POTENTIAL_VIOLATION' | 'NEEDS_REVIEW' | 'NOT_APPLICABLE';
  confidence: number;
  evidenceNotes: string;
  recommendation: string;
  verifiedStatus: VerificationStatus;
  inspectorRemarks?: string;
}

export interface PackageMeasurement {
  mrp: {
    value: string;
    detectedCurrency: string;
    taxInclusiveClause: boolean; // e.g., "incl. of all taxes"
    unitPriceText?: string;
    confidence: number;
    status: 'pass' | 'fail' | 'review';
  };
  netQuantity: {
    quantity: string;
    unit: string;
    standardSymbolUsed: boolean; // e.g. "g", "ml", "kg"
    confidence: number;
    status: 'pass' | 'fail' | 'review';
  };
  fontAnalysis: {
    estimatedNumeralHeightMm: number;
    minimumRequiredMm: number;
    contrastRatio: number;
    readabilityScore: number;
    status: 'pass' | 'review';
    assessment: string;
  };
  dateDeclaration: {
    mfgDate?: string;
    expiryOrBestBefore?: string;
    formatValid: boolean;
    confidence: number;
    status: 'pass' | 'review' | 'fail';
  };
}

export interface ProductImage {
  id: string;
  type: 'front' | 'back' | 'side' | 'top_bottom';
  url: string;
  name: string;
  qualityScore: number; // 0-100
  resolution: string;
}

export interface Inspection {
  id: string; // e.g. LM-2026-00021
  productId: string;
  productName: string;
  brand: string;
  category: string;
  manufacturer: string;
  barcode: string;
  inspectorId: string;
  inspectorName: string;
  timestamp: string;
  status: InspectionStatus;
  screeningScore: number; // 0-100
  images: ProductImage[];
  extractedDeclarations: ExtractedDeclaration[];
  measurements: PackageMeasurement;
  ruleResults: RuleEvaluationResult[];
  boundingBoxes: BoundingBox[];
  humanReview: {
    reviewedBy: string;
    reviewedAt?: string;
    status: VerificationStatus;
    remarks: string;
    supervisorApproval?: {
      approvedBy: string;
      approvedAt: string;
      status: 'APPROVED' | 'REJECTED';
      notes: string;
    };
  };
  region: string;
  locationDetails?: string;
}

export interface DemoProductPreset {
  id: string;
  name: string;
  brand: string;
  category: string;
  manufacturer: string;
  barcode: string;
  scenario: string;
  badgeTag: string;
  expectedStatus: InspectionStatus;
  screeningScore: number;
  images: ProductImage[];
  extractedDeclarations: ExtractedDeclaration[];
  measurements: PackageMeasurement;
  ruleResults: RuleEvaluationResult[];
  boundingBoxes: BoundingBox[];
  onlineComparison?: {
    platform: string;
    listingUrl: string;
    onlineMrp: string;
    onlineNetQty: string;
    onlineManufacturer: string;
    onlineCountry: string;
    hasMismatch: boolean;
    mismatchReason: string;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  read: boolean;
  linkAction?: string;
}

export interface RepeatOffenderRecord {
  id: string;
  manufacturer: string;
  brand: string;
  totalInspections: number;
  potentialViolations: number;
  needsReviewCount: number;
  violationRatio: number; // percentage
  commonViolations: string[];
  lastInspectionDate: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'WATCHLIST';
  region: string;
}
