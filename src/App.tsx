import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { SearchModal } from './components/common/SearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { MobileBottomNav } from './components/common/MobileBottomNav';

// Inspection Flow Views
import { DashboardView } from './components/dashboard/DashboardView';
import { NewInspectionView } from './components/inspection/NewInspectionView';
import { ProductScanner } from './components/inspection/ProductScanner';
import { QrScannerView } from './components/inspection/QrScannerView';
import { OcrExtractionView } from './components/inspection/OcrExtractionView';
import { DataValidationView } from './components/inspection/DataValidationView';
import { ComplianceAnalysisView } from './components/inspection/ComplianceAnalysisView';
import { EvidenceViewer } from './components/inspection/EvidenceViewer';
import { InspectionReportView } from './components/inspection/InspectionReportView';
import { DemoQrGeneratorModal } from './components/inspection/DemoQrGeneratorModal';

// E-commerce Check
import { EcommerceCheckerView } from './components/ecommerce/EcommerceCheckerView';

// Repository & Watchlist
import { InspectionHistoryView } from './components/repository/InspectionHistoryView';
import { ProductRepositoryView } from './components/repository/ProductRepositoryView';
import { ViolationHistoryView } from './components/repository/ViolationHistoryView';
import { RepeatOffendersView } from './components/repository/RepeatOffendersView';

// Analytics & Reports
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { RegionalAnalysisView } from './components/analytics/RegionalAnalysisView';
import { InspectionWorkloadView } from './components/analytics/InspectionWorkloadView';

// Regulatory Admin & Tools
import { RuleDatabaseView } from './components/admin/RuleDatabaseView';
import { UserManagementView } from './components/admin/UserManagementView';
import { AuditLogsView } from './components/admin/AuditLogsView';
import { SettingsView } from './components/common/SettingsView';
import { HelpGuideView } from './components/common/HelpGuideView';
import { LoginView } from './components/auth/LoginView';

const AppContent: React.FC = () => {
  const { activeTab, isSearchOpen, isNotificationOpen, isDemoQrModalOpen, setIsDemoQrModalOpen } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Render view corresponding to activeTab
  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'new-inspection':
        return <NewInspectionView />;
      case 'qr-scanner':
        return <QrScannerView />;
      case 'scanner':
        return <ProductScanner />;
      case 'ocr':
      case 'ocr-results':
        return <OcrExtractionView />;
      case 'validation':
        return <DataValidationView />;
      case 'compliance':
        return <ComplianceAnalysisView />;
      case 'evidence':
        return <EvidenceViewer />;
      case 'report':
        return <InspectionReportView />;
      case 'ecommerce':
        return <EcommerceCheckerView />;
      case 'history':
        return <InspectionHistoryView />;
      case 'products':
      case 'repository':
        return <ProductRepositoryView />;
      case 'violations':
        return <ViolationHistoryView />;
      case 'repeat-offenders':
        return <RepeatOffendersView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'regional':
        return <RegionalAnalysisView />;
      case 'workload':
        return <InspectionWorkloadView />;
      case 'rule-db':
      case 'rules':
        return <RuleDatabaseView />;
      case 'users':
        return <UserManagementView />;
      case 'audit-logs':
        return <AuditLogsView />;
      case 'settings':
        return <SettingsView />;
      case 'help':
        return <HelpGuideView />;
      case 'login':
        return <LoginView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-800 antialiased flex">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main layout container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {activeTab !== 'login' && (
        <MobileBottomNav onOpenMenu={() => setSidebarOpen(true)} />
      )}

      {/* Global Modals & Drawers */}
      {isSearchOpen && <SearchModal />}
      {isNotificationOpen && <NotificationDrawer />}
      {isDemoQrModalOpen && (
        <DemoQrGeneratorModal
          isOpen={isDemoQrModalOpen}
          onClose={() => setIsDemoQrModalOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
