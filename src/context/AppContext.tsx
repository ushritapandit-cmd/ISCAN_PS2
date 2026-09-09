import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Inspection,
  Rule,
  AuditLog,
  Notification,
  RepeatOffenderRecord,
  DemoProductPreset,
  VerificationStatus
} from '../types';
import { INITIAL_USERS, INITIAL_INSPECTIONS, INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS, INITIAL_REPEAT_OFFENDERS } from '../data/mockDatabase';
import { LEGAL_METROLOGY_RULES } from '../data/rules';
import { DEMO_PRESETS } from '../data/demoProducts';
import { evaluateComplianceRules } from '../services/ruleEngine';

interface AppContextType {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  inspections: Inspection[];
  activeInspection: Inspection | null;
  selectedPreset: DemoProductPreset | null;
  activeRules: Rule[];
  auditLogs: AuditLog[];
  notifications: Notification[];
  repeatOffenders: RepeatOffenderRecord[];
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isDemoQrModalOpen: boolean;
  setIsDemoQrModalOpen: (open: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;

  // Actions
  loginAs: (role: UserRole) => void;
  logout: () => void;
  startNewInspection: (preset?: DemoProductPreset) => void;
  setActiveInspection: (inspection: Inspection | null) => void;
  updateActiveInspection: (updates: Partial<Inspection>) => void;
  confirmRuleFinding: (ruleId: string, status: VerificationStatus, remarks?: string) => void;
  finalizeInspection: (remarks: string) => void;
  addAuditLog: (action: string, entity: string, entityId: string, details: string) => void;
  toggleRuleStatus: (ruleId: string) => void;
  updateRule: (updatedRule: Rule) => void;
  markNotificationsAsRead: () => void;
  selectInspectionForReview: (inspectionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user defaults to Inspector Rajesh Sharma for quick demonstration
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [activeTab, setActiveTab] = useState<string>('qr-scanner');
  const [inspections, setInspections] = useState<Inspection[]>(INITIAL_INSPECTIONS);
  const [activeInspection, setActiveInspection] = useState<Inspection | null>(INITIAL_INSPECTIONS[0]);
  const [selectedPreset, setSelectedPreset] = useState<DemoProductPreset | null>(DEMO_PRESETS[1]);
  const [activeRules, setActiveRules] = useState<Rule[]>(LEGAL_METROLOGY_RULES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [repeatOffenders, setRepeatOffenders] = useState<RepeatOffenderRecord[]>(INITIAL_REPEAT_OFFENDERS);
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isDemoQrModalOpen, setIsDemoQrModalOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');

  const addAuditLog = (action: string, entity: string, entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      userName: currentUser?.name || 'Authorized Inspector',
      userRole: currentUser?.role || 'inspector',
      action,
      entity,
      entityId,
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const loginAs = (role: UserRole) => {
    const user = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(user);
    addAuditLog('User Login', 'Authentication', user.id, `User logged in as ${user.role} (${user.name})`);
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('User Logout', 'Authentication', currentUser.id, `User ${currentUser.name} signed out`);
    }
    setCurrentUser(null);
    setActiveTab('login');
  };

  const startNewInspection = (preset?: DemoProductPreset) => {
    const targetPreset = preset || DEMO_PRESETS[1]; // Default to Demo Product B (Missing declaration)
    setSelectedPreset(targetPreset);

    const now = new Date();
    const idSuffix = String(inspections.length + 22).padStart(5, '0');
    const newInspectionId = `LM-2026-${idSuffix}`;

    const newInspection: Inspection = {
      id: newInspectionId,
      productId: targetPreset.id,
      productName: targetPreset.name,
      brand: targetPreset.brand,
      category: targetPreset.category,
      manufacturer: targetPreset.manufacturer,
      barcode: targetPreset.barcode,
      inspectorId: currentUser?.id || 'usr-insp-1',
      inspectorName: currentUser?.name || 'Inspector Rajesh Sharma',
      timestamp: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      status: targetPreset.expectedStatus,
      screeningScore: targetPreset.screeningScore,
      images: targetPreset.images,
      extractedDeclarations: targetPreset.extractedDeclarations,
      measurements: targetPreset.measurements,
      ruleResults: targetPreset.ruleResults,
      boundingBoxes: targetPreset.boundingBoxes,
      humanReview: {
        reviewedBy: currentUser?.name || 'Inspector Rajesh Sharma',
        status: 'UNVERIFIED',
        remarks: ''
      },
      region: currentUser?.region?.includes('Assam') ? 'Assam' : 'North East Zone',
      locationDetails: 'Field Sector Unit, Inspection Center 04'
    };

    setActiveInspection(newInspection);
    setActiveTab('scanner');

    addAuditLog('Inspection Created', 'Inspection Workflow', newInspectionId, `Initiated compliance inspection for ${targetPreset.name}`);
  };

  const updateActiveInspection = (updates: Partial<Inspection>) => {
    if (!activeInspection) return;
    const updated = { ...activeInspection, ...updates };

    // Re-evaluate rules if declarations or measurements changed
    if (updates.extractedDeclarations || updates.measurements) {
      const evaluation = evaluateComplianceRules(
        updated.extractedDeclarations,
        updated.measurements,
        activeRules
      );
      updated.screeningScore = evaluation.screeningScore;
      updated.status = evaluation.overallStatus;
      updated.ruleResults = evaluation.ruleResults;
    }

    setActiveInspection(updated);
  };

  const confirmRuleFinding = (ruleId: string, status: VerificationStatus, remarks?: string) => {
    if (!activeInspection) return;
    const updatedRules = activeInspection.ruleResults.map((r) => {
      if (r.ruleId === ruleId) {
        return {
          ...r,
          verifiedStatus: status,
          inspectorRemarks: remarks || r.inspectorRemarks
        };
      }
      return r;
    });

    const updatedInspection: Inspection = {
      ...activeInspection,
      ruleResults: updatedRules,
      humanReview: {
        ...activeInspection.humanReview,
        status: status,
        remarks: remarks || activeInspection.humanReview.remarks,
        reviewedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
      }
    };

    setActiveInspection(updatedInspection);
    addAuditLog('Finding Verified', 'Rule Evaluation', ruleId, `Inspector verified finding with status: ${status}. Remarks: ${remarks || 'None'}`);
  };

  const finalizeInspection = (remarks: string) => {
    if (!activeInspection) return;
    const finalized: Inspection = {
      ...activeInspection,
      humanReview: {
        ...activeInspection.humanReview,
        status: 'CONFIRMED',
        remarks,
        reviewedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
      }
    };

    // Prepend to history if not already present
    setInspections((prev) => {
      const filtered = prev.filter((i) => i.id !== finalized.id);
      return [finalized, ...filtered];
    });

    setActiveInspection(finalized);
    addAuditLog('Report Finalized', 'Report Generation', finalized.id, `Completed inspection report with status ${finalized.status}`);
  };

  const selectInspectionForReview = (inspectionId: string) => {
    const match = inspections.find((i) => i.id === inspectionId);
    if (match) {
      setActiveInspection(match);
      setActiveTab('compliance');
    }
  };

  const toggleRuleStatus = (ruleId: string) => {
    setActiveRules((prev) =>
      prev.map((r) => (r.ruleId === ruleId ? { ...r, status: r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : r))
    );
    addAuditLog('Rule Status Toggled', 'Rule Database', ruleId, `Toggled rule status for ${ruleId}`);
  };

  const updateRule = (updatedRule: Rule) => {
    setActiveRules((prev) => prev.map((r) => (r.id === updatedRule.id ? updatedRule : r)));
    addAuditLog('Rule Updated', 'Rule Database', updatedRule.ruleId, `Updated configuration for rule ${updatedRule.ruleId}`);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeTab,
        setActiveTab,
        inspections,
        activeInspection,
        selectedPreset,
        activeRules,
        auditLogs,
        notifications,
        repeatOffenders,
        demoMode,
        setDemoMode,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        isDemoQrModalOpen,
        setIsDemoQrModalOpen,
        language,
        setLanguage,
        loginAs,
        logout,
        startNewInspection,
        setActiveInspection,
        updateActiveInspection,
        confirmRuleFinding,
        finalizeInspection,
        addAuditLog,
        toggleRuleStatus,
        updateRule,
        markNotificationsAsRead,
        selectInspectionForReview
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
