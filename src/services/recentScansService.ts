import { ProductLookupResult, processProductQrScan } from './productLookupService';

export interface RecentScanItem {
  id: string;
  scannedAt: string; // ISO string
  timestampDisplay: string;
  rawValue: string;
  format: string;
  productFound: boolean;
  productName: string;
  brand: string;
  manufacturer: string;
  category: string;
  barcode: string;
  gtin?: string;
  mrp?: string;
  netQuantity?: string;
  complianceStatus: 'COMPLIANT' | 'NON-COMPLIANT' | 'PARTIALLY_VERIFIED';
  screeningScore: number;
  violationsCount: number;
  matchedPresetId?: string;
  inspectionId?: string;
  lookupResult: ProductLookupResult;
}

const STORAGE_KEY = 'iscan_recent_qr_scans_v2';
const listeners = new Set<(scans: RecentScanItem[]) => void>();

function notifyListeners(scans: RecentScanItem[]) {
  listeners.forEach((listener) => {
    try {
      listener(scans);
    } catch (err) {
      console.error('Error notifying recent scans listener:', err);
    }
  });
}

function formatRelativeTime(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return 'Recent';
  }
}

/**
 * Generate default seed scans for field demonstration
 */
function createDefaultSeedScans(): RecentScanItem[] {
  const seedCodes = [
    {
      code: 'ISCAN-LAYS-001',
      minsAgo: 5,
      inspectionId: 'LM-2026-00022'
    },
    {
      code: 'ISCAN-KURKURE-001',
      minsAgo: 22,
      inspectionId: 'LM-2026-00020'
    },
    {
      code: 'https://id.gs1.org/01/08901030829102/10/BATCH2026/17/261231',
      minsAgo: 45,
      inspectionId: 'LM-2026-00018'
    },
    {
      code: 'https://id.gs1.org/01/08904018290123/10/LOT889',
      minsAgo: 98,
      inspectionId: 'LM-2026-00015'
    },
    {
      code: '8902091823901',
      minsAgo: 160,
      inspectionId: 'LM-2026-00008'
    },
    {
      code: 'https://example.com/pdp/unregistered-commodity-99881',
      minsAgo: 310,
      inspectionId: 'LM-2026-00005'
    }
  ];

  return seedCodes.map((seed, index) => {
    const lookup = processProductQrScan(seed.code);
    const date = new Date(Date.now() - seed.minsAgo * 60 * 1000);
    const iso = date.toISOString();

    const pName = lookup.product?.productName || (lookup.productFound ? 'Packaged Commodity' : 'Unregistered Commodity');
    const pBrand = lookup.product?.brand || 'Unregistered Brand';
    const pMfg = lookup.packageInfo?.manufacturerAddress || lookup.product?.manufacturer || 'Unverified in Master Catalog';
    const pCat = lookup.product?.category || 'Packaged Commodity';
    const pBarcode = lookup.product?.gtin || lookup.qr.extractedIdentifier || lookup.qr.rawValue;

    return {
      id: `scan-seed-${index + 1}-${Date.now()}`,
      scannedAt: iso,
      timestampDisplay: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + `, ${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
      rawValue: seed.code,
      format: lookup.qr.dataType,
      productFound: lookup.productFound,
      productName: pName,
      brand: pBrand,
      manufacturer: pMfg,
      category: pCat,
      barcode: pBarcode,
      gtin: lookup.product?.gtin || undefined,
      mrp: lookup.packageInfo?.mrp || undefined,
      netQuantity: lookup.packageInfo?.netQuantity || undefined,
      complianceStatus: lookup.complianceStatus,
      screeningScore: lookup.screeningScore,
      violationsCount: lookup.violations.length,
      matchedPresetId: lookup.matchedPreset?.id,
      inspectionId: seed.inspectionId,
      lookupResult: lookup
    };
  });
}

/**
 * Get all recent scans from persistent storage
 */
export function getRecentScans(): RecentScanItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      const defaults = createDefaultSeedScans();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    const parsed: RecentScanItem[] = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[recentScansService] Failed to parse localStorage:', err);
    return createDefaultSeedScans();
  }
}

/**
 * Save a new scan item from a ProductLookupResult
 */
export function saveRecentScan(
  lookupResult: ProductLookupResult,
  inspectionId?: string
): RecentScanItem {
  const currentScans = getRecentScans();
  const now = new Date();
  const iso = now.toISOString();

  const pName = lookupResult.product?.productName || (lookupResult.productFound ? 'Packaged Commodity' : 'Unregistered Commodity');
  const pBrand = lookupResult.product?.brand || 'Unregistered Brand';
  const pMfg = lookupResult.packageInfo?.manufacturerAddress || lookupResult.product?.manufacturer || 'Unverified in Master Catalog';
  const pCat = lookupResult.product?.category || 'Packaged Commodity';
  const pBarcode = lookupResult.product?.gtin || lookupResult.qr.extractedIdentifier || lookupResult.qr.rawValue;

  const newScan: RecentScanItem = {
    id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    scannedAt: iso,
    timestampDisplay: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + `, ${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
    rawValue: lookupResult.qr.rawValue,
    format: lookupResult.qr.dataType,
    productFound: lookupResult.productFound,
    productName: pName,
    brand: pBrand,
    manufacturer: pMfg,
    category: pCat,
    barcode: pBarcode,
    gtin: lookupResult.product?.gtin || undefined,
    mrp: lookupResult.packageInfo?.mrp || undefined,
    netQuantity: lookupResult.packageInfo?.netQuantity || undefined,
    complianceStatus: lookupResult.complianceStatus,
    screeningScore: lookupResult.screeningScore,
    violationsCount: lookupResult.violations.length,
    matchedPresetId: lookupResult.matchedPreset?.id,
    inspectionId: inspectionId || lookupResult.matchedInspection?.id,
    lookupResult
  };

  // Remove previous duplicates with exact same rawValue so the new scan moves to the top
  const filtered = currentScans.filter((s) => s.rawValue !== newScan.rawValue);
  const updated = [newScan, ...filtered].slice(0, 30); // Keep latest 30 scans

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('[recentScansService] Failed to write to localStorage:', err);
  }

  notifyListeners(updated);
  return newScan;
}

/**
 * Remove a specific scan from history
 */
export function deleteRecentScan(id: string): void {
  const currentScans = getRecentScans();
  const updated = currentScans.filter((s) => s.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('[recentScansService] Failed to update localStorage:', err);
  }
  notifyListeners(updated);
}

/**
 * Clear all recent scans
 */
export function clearRecentScans(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.warn('[recentScansService] Failed to clear localStorage:', err);
  }
  notifyListeners([]);
}

/**
 * Reset history back to default demo seeds
 */
export function resetToDefaultScans(): RecentScanItem[] {
  const defaults = createDefaultSeedScans();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  } catch (err) {
    console.warn('[recentScansService] Failed to write defaults to localStorage:', err);
  }
  notifyListeners(defaults);
  return defaults;
}

/**
 * Subscribe to scan history changes
 */
export function subscribeToRecentScans(listener: (scans: RecentScanItem[]) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export { formatRelativeTime };
