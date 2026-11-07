import React from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import ptBR from 'antd/locale/pt_BR';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { antdTheme } from './theme/antd-theme';
import { AppLayout } from './components/layout/AppLayout';
import { useUIStore } from './stores/uiStore';

// Features
import { DashboardPage } from './features/dashboard/DashboardPage';
import { BlueprintWorkshopPage } from './features/workshop/BlueprintWorkshopPage';
import { ProjectsPage } from './features/projects/ProjectsPage';
import { BlueprintsPage } from './features/blueprints/BlueprintsPage';
import { CatalogHubPage } from './features/catalog/CatalogHubPage';
import { ComponentsCatalogPage } from './features/catalog/components/ComponentsCatalogPage';
import { ModulesCatalogPage } from './features/catalog/modules/ModulesCatalogPage';
import { TemplatesCatalogPage } from './features/catalog/templates/TemplatesCatalogPage';
import { GoldenRulesPage } from './features/knowledge/rules/GoldenRulesPage';
import { SpecificationsPage } from './features/knowledge/specifications/SpecificationsPage';
import { ArchitecturesPage } from './features/knowledge/architectures/ArchitecturesPage';
import { KnowledgeDocumentationPage } from './features/knowledge/docs/KnowledgeDocumentationPage';
import { AIBlueprintComposerPage } from './features/ai/AIBlueprintComposerPage';
import { AIApiContractsPage } from './features/ai/AIApiContractsPage';
import { AIProvidersPage } from './features/ai/AIProvidersPage';
import { AIGatewayPage } from './features/ai/AIGatewayPage';
import { AIAgentsPage } from './features/ai/AIAgentsPage';
import { AuditTrailPage } from './features/audit/AuditTrailPage';
import { LibraryUpdatesPage } from './features/platform/LibraryUpdatesPage';

// IAM & Landing features
import { LandingPage } from './features/landing/LandingPage';
import { LoginPage } from './features/auth/LoginPage';
import { IamDashboardPage } from './features/iam/IamDashboardPage';
import { UsersManagementPage } from './features/iam/UsersManagementPage';
import { GroupsManagementPage } from './features/iam/GroupsManagementPage';
import { SessionsManagementPage } from './features/iam/SessionsManagementPage';
import { InvitationsPage } from './features/iam/InvitationsPage';
import { ResourceSharingPage } from './features/iam/ResourceSharingPage';
import { UserProfilePage } from './features/iam/UserProfilePage';
import { SettingsPage } from './features/settings/SettingsPage';

import { parseRoute, VIEW_TO_PATH, navigateTo } from './router/navigation';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const App: React.FC = () => {
  const { activeView, setActiveView, openInspector360 } = useUIStore();

  // Initialize and synchronize route on load and on browser back/forward
  React.useEffect(() => {
    const handleLocationChange = () => {
      const parsed = parseRoute(window.location.pathname, window.location.search);
      if (parsed.view !== useUIStore.getState().activeView) {
        setActiveView(parsed.view);
      }
      if (parsed.entityId && parsed.entityType) {
        openInspector360(parsed.entityType, parsed.entityId);
      }
    };

    // Parse initial URL on mount
    handleLocationChange();

    // Listen to browser Back / Forward buttons
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [setActiveView, openInspector360]);

  // Synchronize URL when activeView changes from internal interactions
  const isInitialMount = React.useRef(true);
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const expectedPath = VIEW_TO_PATH[activeView] || '/dashboard';
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    if (currentPath !== expectedPath && !(activeView === 'landing' && currentPath === '/')) {
      const hash = window.location.hash || '';
      const params = new URLSearchParams(window.location.search);
      params.delete('page');
      params.delete('page_size');
      const cleanSearch = params.toString() ? `?${params.toString()}` : '';
      window.history.pushState({ view: activeView }, '', `${expectedPath}${cleanSearch}${hash}`);
    }
  }, [activeView]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} />;
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'workshop':
        return <BlueprintWorkshopPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'blueprints':
        return <BlueprintsPage />;
      case 'catalog-hub':
        return <CatalogHubPage />;
      case 'components':
        return <ComponentsCatalogPage />;
      case 'modules':
        return <ModulesCatalogPage />;
      case 'templates':
        return <TemplatesCatalogPage />;
      case 'rules':
        return <GoldenRulesPage />;
      case 'specifications':
        return <SpecificationsPage />;
      case 'architectures':
        return <ArchitecturesPage />;
      case 'documentation':
        return <KnowledgeDocumentationPage />;
      case 'ai-gateway':
        return <AIGatewayPage />;
      case 'ai-agents':
        return <AIAgentsPage />;
      case 'ai-providers':
        return <AIProvidersPage />;
      case 'ai-composer':
        return <AIBlueprintComposerPage />;
      case 'ai-contracts':
        return <AIApiContractsPage />;
      case 'iam-dashboard':
        return <IamDashboardPage onNavigate={navigateTo} />;
      case 'iam-users':
      case 'rbac-users':
        return <UsersManagementPage />;
      case 'iam-groups':
        return <GroupsManagementPage />;
      case 'iam-roles':
      case 'rbac-roles':
        return <SettingsPage initialTab="roles" />;
      case 'iam-matrix':
        return <SettingsPage initialTab="matrix" />;
      case 'iam-sessions':
        return <SessionsManagementPage />;
      case 'iam-invitations':
        return <InvitationsPage />;
      case 'iam-shares':
        return <ResourceSharingPage />;
      case 'profile':
        return <UserProfilePage />;
      case 'audit':
        return <AuditTrailPage />;
      case 'settings':
        return <SettingsPage />;
      case 'library-updates':
        return <LibraryUpdatesPage />;
      default:
        return <DashboardPage />;

    }
  };

  const isFullscreenView = activeView === 'landing' || activeView === 'login';

  return (
    <QueryClientProvider client={queryClient}>
      <StyleProvider layer>
        <ConfigProvider theme={antdTheme} locale={ptBR}>
          <AntdApp>
            {isFullscreenView ? renderActiveView() : <AppLayout>{renderActiveView()}</AppLayout>}
          </AntdApp>
        </ConfigProvider>
      </StyleProvider>
    </QueryClientProvider>
  );
};

export default App;
