import { User, Inspection, AuditLog, RepeatOffenderRecord, Notification } from '../types';
import { DEMO_PRESETS } from './demoProducts';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-insp-1',
    name: 'Inspector Rajesh Sharma',
    email: 'inspector@iscan.demo',
    role: 'inspector',
    department: 'Legal Metrology Enforcement Division',
    region: 'Assam & North East Zone',
    badgeNumber: 'LM-INS-7810'
  },
  {
    id: 'usr-sup-1',
    name: 'Dr. Ananya Roy (Joint Controller)',
    email: 'supervisor@iscan.demo',
    role: 'supervisor',
    department: 'Directorate of Legal Metrology',
    region: 'North East Regional HQ',
    badgeNumber: 'LM-DIR-0091'
  },
  {
    id: 'usr-admin-1',
    name: 'Vikram Sengupta (System Admin)',
    email: 'admin@iscan.demo',
    role: 'admin',
    department: 'Department of Consumer Affairs / NIC',
    region: 'National Central Unit',
    badgeNumber: 'NIC-SYS-1044'
  }
];

export const INITIAL_INSPECTIONS: Inspection[] = [
  {
    id: 'LM-2026-00021',
    productId: 'demo-prod-b',
    productName: 'Brahmaputra Gold Leaf Tea',
    brand: 'Brahmaputra Tea Co',
    category: 'Tea & Beverages',
    manufacturer: 'Hillcrest Tea Packers, Dibrugarh, Assam - 786001',
    barcode: '8904018290123',
    inspectorId: 'usr-insp-1',
    inspectorName: 'Inspector Rajesh Sharma',
    timestamp: '2026-09-04 10:14 IST',
    status: 'NEEDS_REVIEW',
    screeningScore: 82,
    images: DEMO_PRESETS[1].images,
    extractedDeclarations: DEMO_PRESETS[1].extractedDeclarations,
    measurements: DEMO_PRESETS[1].measurements,
    ruleResults: DEMO_PRESETS[1].ruleResults,
    boundingBoxes: DEMO_PRESETS[1].boundingBoxes,
    humanReview: {
      reviewedBy: 'Inspector Rajesh Sharma',
      status: 'CONFIRMED',
      remarks: 'Consumer care declaration not visible on rear panel. Manual inspection required; confirmed omission of Rule 6(1)(g).'
    },
    region: 'Assam',
    locationDetails: 'Supermarket Central, Paltan Bazaar, Guwahati'
  },
  {
    id: 'LM-2026-00020',
    productId: 'demo-prod-a',
    productName: 'Ananda Butter Crunch Biscuits',
    brand: 'Ananda Bakehouse',
    category: 'Biscuits & Bakery',
    manufacturer: 'Ananda Foods Pvt Ltd, Guwahati, Assam',
    barcode: '8901030829102',
    inspectorId: 'usr-insp-1',
    inspectorName: 'Inspector Rajesh Sharma',
    timestamp: '2026-09-04 09:30 IST',
    status: 'COMPLIANT',
    screeningScore: 98,
    images: DEMO_PRESETS[0].images,
    extractedDeclarations: DEMO_PRESETS[0].extractedDeclarations,
    measurements: DEMO_PRESETS[0].measurements,
    ruleResults: DEMO_PRESETS[0].ruleResults,
    boundingBoxes: DEMO_PRESETS[0].boundingBoxes,
    humanReview: {
      reviewedBy: 'Inspector Rajesh Sharma',
      status: 'CONFIRMED',
      remarks: 'All mandatory declarations verified and fully compliant.'
    },
    region: 'Assam',
    locationDetails: 'Bakehouse Retail, GS Road, Guwahati'
  },
  {
    id: 'LM-2026-00019',
    productId: 'demo-prod-c',
    productName: 'Shuddh Kachi Ghani Mustard Oil',
    brand: 'Shuddh Gold',
    category: 'Edible Oils',
    manufacturer: 'Shuddh Agrotech Ltd, Nagaon, Assam',
    barcode: '8902091823901',
    inspectorId: 'usr-insp-1',
    inspectorName: 'Inspector Rajesh Sharma',
    timestamp: '2026-09-03 16:45 IST',
    status: 'POTENTIAL_VIOLATION',
    screeningScore: 74,
    images: DEMO_PRESETS[2].images,
    extractedDeclarations: DEMO_PRESETS[2].extractedDeclarations,
    measurements: DEMO_PRESETS[2].measurements,
    ruleResults: DEMO_PRESETS[2].ruleResults,
    boundingBoxes: DEMO_PRESETS[2].boundingBoxes,
    humanReview: {
      reviewedBy: 'Inspector Rajesh Sharma',
      status: 'CONFIRMED',
      remarks: 'Missing "inclusive of all taxes" text on oil pouch packaging.'
    },
    region: 'Assam',
    locationDetails: 'Wholesale Depot, Nagaon'
  },
  {
    id: 'LM-2026-00018',
    productId: 'demo-prod-e',
    productName: 'Kashmir Valley Roasted Almonds',
    brand: 'Valley Harvest',
    category: 'Dry Fruits & Nuts',
    manufacturer: 'Valley Harvest Agro',
    barcode: '8906019283741',
    inspectorId: 'usr-insp-2',
    inspectorName: 'Inspector P. Tsering',
    timestamp: '2026-09-03 14:10 IST',
    status: 'POTENTIAL_VIOLATION',
    screeningScore: 68,
    images: DEMO_PRESETS[4].images,
    extractedDeclarations: DEMO_PRESETS[4].extractedDeclarations,
    measurements: DEMO_PRESETS[4].measurements,
    ruleResults: DEMO_PRESETS[4].ruleResults,
    boundingBoxes: DEMO_PRESETS[4].boundingBoxes,
    humanReview: {
      reviewedBy: 'Inspector P. Tsering',
      status: 'CONFIRMED',
      remarks: 'E-commerce listing priced at ₹599 vs packaging printed MRP ₹499.'
    },
    region: 'Arunachal Pradesh',
    locationDetails: 'Itanagar Market'
  },
  {
    id: 'LM-2026-00017',
    productId: 'demo-prod-g',
    productName: 'Meghalaya Lakadong Turmeric',
    brand: 'Hills Heritage',
    category: 'Spices & Condiments',
    manufacturer: 'Hills Organic Cooperative, Jowai, Meghalaya',
    barcode: '8907029103948',
    inspectorId: 'usr-insp-3',
    inspectorName: 'Inspector D. Sangma',
    timestamp: '2026-09-02 11:20 IST',
    status: 'NEEDS_REVIEW',
    screeningScore: 76,
    images: DEMO_PRESETS[6].images,
    extractedDeclarations: DEMO_PRESETS[6].extractedDeclarations,
    measurements: DEMO_PRESETS[6].measurements,
    ruleResults: DEMO_PRESETS[6].ruleResults,
    boundingBoxes: DEMO_PRESETS[6].boundingBoxes,
    humanReview: {
      reviewedBy: 'Inspector D. Sangma',
      status: 'CONFIRMED',
      remarks: 'Sub-standard font size 1.1mm verified with micrometer loupe.'
    },
    region: 'Meghalaya',
    locationDetails: 'Police Bazar, Shillong'
  },
  {
    id: 'LM-2026-00016',
    productId: 'demo-prod-f',
    productName: 'Verona Extra Virgin Olive Oil',
    brand: 'Verona Estate',
    category: 'Imported Edible Oils',
    manufacturer: 'Global Foods LLC, Mumbai',
    barcode: '8001020304050',
    inspectorId: 'usr-insp-1',
    inspectorName: 'Inspector Rajesh Sharma',
    timestamp: '2026-09-02 09:40 IST',
    status: 'POTENTIAL_VIOLATION',
    screeningScore: 71,
    images: DEMO_PRESETS[5].images,
    extractedDeclarations: DEMO_PRESETS[5].extractedDeclarations,
    measurements: DEMO_PRESETS[5].measurements,
    ruleResults: DEMO_PRESETS[5].ruleResults,
    boundingBoxes: DEMO_PRESETS[5].boundingBoxes,
    humanReview: {
      reviewedBy: 'Inspector Rajesh Sharma',
      status: 'CONFIRMED',
      remarks: 'Imported package lacked statutory Country of Origin tag.'
    },
    region: 'Assam',
    locationDetails: 'City Center Mall, Guwahati'
  },
  {
    id: 'LM-2026-00015',
    productId: 'demo-prod-d',
    productName: 'Himalayan Pink Rock Salt',
    brand: 'Himalayan Pure',
    category: 'Salt & Minerals',
    manufacturer: 'Pure Minerals Pvt Ltd, Imphal, Manipur',
    barcode: '8903029102837',
    inspectorId: 'usr-insp-4',
    inspectorName: 'Inspector L. Meitei',
    timestamp: '2026-09-01 15:30 IST',
    status: 'NEEDS_REVIEW',
    screeningScore: 61,
    images: DEMO_PRESETS[3].images,
    extractedDeclarations: DEMO_PRESETS[3].extractedDeclarations,
    measurements: DEMO_PRESETS[3].measurements,
    ruleResults: DEMO_PRESETS[3].ruleResults,
    boundingBoxes: DEMO_PRESETS[3].boundingBoxes,
    humanReview: {
      reviewedBy: 'Inspector L. Meitei',
      status: 'MODIFIED',
      remarks: 'Re-inspected physically; MRP ₹99.00 confirmed clear on physical pouch.'
    },
    region: 'Manipur',
    locationDetails: 'Thangal Bazaar, Imphal'
  },
  {
    id: 'LM-2026-00014',
    productId: 'demo-prod-h',
    productName: 'Royal Shahi Garam Masala',
    brand: 'Royal Flavours',
    category: 'Spices & Seasonings',
    manufacturer: 'Royal Spices & Herbs, Agartala, Tripura',
    barcode: '8908019283019',
    inspectorId: 'usr-insp-5',
    inspectorName: 'Inspector B. Debbarma',
    timestamp: '2026-09-01 12:05 IST',
    status: 'POTENTIAL_VIOLATION',
    screeningScore: 58,
    images: DEMO_PRESETS[7].images,
    extractedDeclarations: DEMO_PRESETS[7].extractedDeclarations,
    measurements: DEMO_PRESETS[7].measurements,
    ruleResults: DEMO_PRESETS[7].ruleResults,
    boundingBoxes: DEMO_PRESETS[7].boundingBoxes,
    humanReview: {
      reviewedBy: 'Inspector B. Debbarma',
      status: 'CONFIRMED',
      remarks: 'Unit sale price missing and manufacturing date omitted month.'
    },
    region: 'Tripura',
    locationDetails: 'Battala Market, Agartala'
  }
];

export const INITIAL_REPEAT_OFFENDERS: RepeatOffenderRecord[] = [
  {
    id: 'rep-1',
    manufacturer: 'ABC Foods & Confectioneries Pvt Ltd',
    brand: 'ABC Treat',
    totalInspections: 24,
    potentialViolations: 8,
    needsReviewCount: 5,
    violationRatio: 33.3,
    commonViolations: ['MRP declaration missing tax clause', 'Consumer care cell phone non-functional', 'Numeral font height < 2mm'],
    lastInspectionDate: '2026-09-02',
    riskLevel: 'HIGH',
    region: 'Assam'
  },
  {
    id: 'rep-2',
    manufacturer: 'Shuddh Agrotech Ltd',
    brand: 'Shuddh Gold',
    totalInspections: 19,
    potentialViolations: 6,
    needsReviewCount: 3,
    violationRatio: 31.5,
    commonViolations: ['Tax inclusion text missing', 'Over-stickered price labels', 'Net volume temperature deviation'],
    lastInspectionDate: '2026-09-03',
    riskLevel: 'HIGH',
    region: 'Assam'
  },
  {
    id: 'rep-3',
    manufacturer: 'Valley Harvest Agro',
    brand: 'Valley Harvest',
    totalInspections: 16,
    potentialViolations: 5,
    needsReviewCount: 2,
    violationRatio: 31.2,
    commonViolations: ['E-commerce listing markup above package MRP', 'Unit Sale Price missing'],
    lastInspectionDate: '2026-09-03',
    riskLevel: 'MEDIUM',
    region: 'Arunachal Pradesh'
  },
  {
    id: 'rep-4',
    manufacturer: 'Global Foods LLC (Importer)',
    brand: 'Various Imported Labels',
    totalInspections: 14,
    potentialViolations: 4,
    needsReviewCount: 4,
    violationRatio: 28.5,
    commonViolations: ['Country of origin omitted on sticker', 'Importer address incomplete'],
    lastInspectionDate: '2026-09-02',
    riskLevel: 'MEDIUM',
    region: 'National'
  },
  {
    id: 'rep-5',
    manufacturer: 'Royal Spices & Herbs',
    brand: 'Royal Flavours',
    totalInspections: 12,
    potentialViolations: 4,
    needsReviewCount: 2,
    violationRatio: 33.3,
    commonViolations: ['Manufacturing month omitted', 'Unit Sale Price omitted on > 100g packs'],
    lastInspectionDate: '2026-09-01',
    riskLevel: 'WATCHLIST',
    region: 'Tripura'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-04 10:18 IST',
    userName: 'Inspector Rajesh Sharma',
    userRole: 'inspector',
    action: 'Report Generated',
    entity: 'Inspection Report',
    entityId: 'LM-2026-00021',
    details: 'Generated official PDF compliance inspection report for Brahmaputra Gold Leaf Tea.'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-04 10:16 IST',
    userName: 'Inspector Rajesh Sharma',
    userRole: 'inspector',
    action: 'Finding Confirmed',
    entity: 'Rule Evaluation',
    entityId: 'LM-007 (Rule 6(1)(g))',
    details: 'Inspector confirmed potential non-compliance: Consumer Care Cell omitted on rear panel.'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-04 10:14 IST',
    userName: 'Inspector Rajesh Sharma',
    userRole: 'inspector',
    action: 'Rule Evaluated',
    entity: 'Rule Engine',
    entityId: 'LM-2026-00021',
    details: 'Legal Metrology rule engine versioned 2011+amendments completed screening. Status: NEEDS_REVIEW.'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-04 10:13 IST',
    userName: 'Inspector Rajesh Sharma',
    userRole: 'inspector',
    action: 'OCR Executed',
    entity: 'OCR Service',
    entityId: 'LM-2026-00021',
    details: 'Extracted 8 label declarations with 92% average confidence score.'
  },
  {
    id: 'log-5',
    timestamp: '2026-09-04 10:12 IST',
    userName: 'Inspector Rajesh Sharma',
    userRole: 'inspector',
    action: 'Product Scanned',
    entity: 'Image Processor',
    entityId: 'LM-2026-00021',
    details: 'Uploaded rear panel image (1920x1080). Perspective corrected and contrast normalized.'
  },
  {
    id: 'log-6',
    timestamp: '2026-09-04 09:00 IST',
    userName: 'Inspector Rajesh Sharma',
    userRole: 'inspector',
    action: 'User Login',
    entity: 'Authentication',
    entityId: 'usr-insp-1',
    details: 'Logged into mobile inspector terminal from Guwahati field sector.'
  },
  {
    id: 'log-7',
    timestamp: '2026-09-03 17:30 IST',
    userName: 'Vikram Sengupta (System Admin)',
    userRole: 'admin',
    action: 'Rule Database Updated',
    entity: 'Legal Metrology Rules',
    entityId: 'LM-008',
    details: 'Verified Unit Sale Price threshold applicability under 2021 amendment provisions.'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: '3 Inspections Require Human Review',
    message: 'High-priority items pending inspector confirmation in Assam & Meghalaya field zones.',
    timestamp: '15 mins ago',
    type: 'urgent',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Low-Confidence OCR Alert',
    message: 'Inspection LM-2026-00015 contains glare artifacts; manual verification required.',
    timestamp: '1 hour ago',
    type: 'warning',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Official Report Generated',
    message: 'Inspection report LM-2026-00021 ready for download & supervisor endorsement.',
    timestamp: '2 hours ago',
    type: 'success',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Legal Metrology Rule Engine Synchronized',
    message: 'Version 2011 (Amended 2022) rules active across all scanning terminals.',
    timestamp: '1 day ago',
    type: 'info',
    read: true
  }
];

export const REGIONAL_DATA = [
  { state: 'Assam', inspections: 412, compliant: 236, violations: 118, needsReview: 58, topViolation: 'Consumer Care Cell' },
  { state: 'Arunachal Pradesh', inspections: 142, compliant: 86, violations: 38, needsReview: 18, topViolation: 'E-commerce MRP Mismatch' },
  { state: 'Manipur', inspections: 118, compliant: 64, violations: 34, needsReview: 20, topViolation: 'Readability / Font Size' },
  { state: 'Meghalaya', inspections: 156, compliant: 92, violations: 42, needsReview: 22, topViolation: 'Numeral Height < 2mm' },
  { state: 'Mizoram', inspections: 96, compliant: 58, violations: 24, needsReview: 14, topViolation: 'Unit Sale Price' },
  { state: 'Nagaland', inspections: 104, compliant: 61, violations: 28, needsReview: 15, topViolation: 'Manufacturing Date Format' },
  { state: 'Sikkim', inspections: 88, compliant: 56, violations: 20, needsReview: 12, topViolation: 'MRP Tax Inclusion' },
  { state: 'Tripura', inspections: 132, compliant: 73, violations: 38, needsReview: 21, topViolation: 'Unit Sale Price' }
];

export const WORKLOAD_INSPECTORS = [
  { id: 'usr-insp-1', name: 'Inspector Rajesh Sharma', completed: 42, pending: 4, avgTimeMinutes: 4.8, region: 'Assam' },
  { id: 'usr-insp-2', name: 'Inspector P. Tsering', completed: 37, pending: 3, avgTimeMinutes: 5.2, region: 'Arunachal Pradesh' },
  { id: 'usr-insp-3', name: 'Inspector D. Sangma', completed: 31, pending: 6, avgTimeMinutes: 5.9, region: 'Meghalaya' },
  { id: 'usr-insp-4', name: 'Inspector L. Meitei', completed: 28, pending: 2, avgTimeMinutes: 4.5, region: 'Manipur' },
  { id: 'usr-insp-5', name: 'Inspector B. Debbarma', completed: 26, pending: 5, avgTimeMinutes: 6.1, region: 'Tripura' }
];
