import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { antdTheme } from './theme/antd-theme';
import { AppLayout } from './components/layout/AppLayout';
import { ChatbotPage } from './features/chat/ChatbotPage';
import { LandingPage } from './features/landing/LandingPage';
import { ProposalsDashboard } from './features/proposals/ProposalsDashboard';

export const App: React.FC = () => {
  const appName = "Olivelas AI Copilot Support";
  const isChatbotApp = appName.toLowerCase().includes('chat') || appName.toLowerCase().includes('copilot') || appName.toLowerCase().includes('assistente');
  const [activeView, setActiveView] = useState<'chat' | 'landing' | 'dashboard'>(isChatbotApp ? 'chat' : 'landing');

  return (
    <ConfigProvider theme={antdTheme} locale={ptBR}>
      <AppLayout
        activeView={activeView}
        onViewChange={setActiveView}
        appName={appName}
      >
        {activeView === 'chat' ? (
          <ChatbotPage appName={appName} />
        ) : activeView === 'landing' ? (
          <LandingPage
            appName={appName}
            onExploreDashboard={() => setActiveView('dashboard')}
          />
        ) : (
          <ProposalsDashboard appName={appName} />
        )}
      </AppLayout>
    </ConfigProvider>
  );
};

export default App;
