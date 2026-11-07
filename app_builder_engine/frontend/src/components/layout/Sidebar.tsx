import React, { useEffect, useState, useCallback } from 'react';
import { Menu, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  BuildOutlined,
  FolderOpenOutlined,
  FileDoneOutlined,
  AppstoreOutlined,
  BlockOutlined,
  LayoutOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  ApartmentOutlined,
  RobotOutlined,
  ApiOutlined,
  HistoryOutlined,
  TeamOutlined,
  ReadOutlined,
  CloudServerOutlined,
  NodeIndexOutlined,
  SettingOutlined,
  CloudSyncOutlined,
  ReloadOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

import { useUIStore, ActiveView } from '@/stores/uiStore';
import { navigateTo, VIEW_TO_PATH } from '@/router/navigation';
import { apiClient } from '@/services/api-client';

interface EngineStatusData {
  status: string;
  service: string;
  version: string;
  environment: string;
  database: string;
  active_projects: number;
  active_blueprints: number;
  catalog_entities: number;
  timestamp: string;
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const Sidebar: React.FC = () => {
  const { activeView, sidebarCollapsed, toggleSidebar } = useUIStore();

  const groupedItems: MenuItem[] = [
    getItem('WORKSPACE', 'grp_workspace', null, [
      getItem('Dashboard', 'dashboard', <DashboardOutlined />),
      getItem('Projetos', 'projects', <FolderOpenOutlined />),
      getItem('Blueprints Gerados', 'blueprints', <FileDoneOutlined />),
      getItem('Blueprint Studio', 'workshop', <BuildOutlined className="text-loft-orange" />),
    ], 'group'),

    getItem('CATÁLOGO DE ENGENHARIA', 'grp_catalog', null, [
      getItem('Catalog Hub', 'catalog-hub', <NodeIndexOutlined />),
      getItem('Componentes Copan', 'components', <AppstoreOutlined />),
      getItem('Templates de App', 'templates', <LayoutOutlined />),
      getItem('Módulos de Domínio', 'modules', <BlockOutlined />),
      getItem('Golden Rules', 'rules', <SafetyCertificateOutlined />),
      getItem('Arquiteturas Padrão', 'architectures', <ApartmentOutlined />),
    ], 'group'),

    getItem('BASE DE CONHECIMENTO', 'grp_knowledge', null, [
      getItem('Especificações (SDDs)', 'specifications', <FileTextOutlined />),
      getItem('Documentação', 'documentation', <ReadOutlined />),
    ], 'group'),

    getItem('AI & INTEGRAÇÕES', 'grp_ai', null, [
      getItem('AI Gateway', 'ai-gateway', <ApiOutlined />),
      getItem('AI Agents', 'ai-agents', <RobotOutlined />),
      getItem('AI Providers', 'ai-providers', <CloudServerOutlined />),
      getItem('AI Composer', 'ai-composer', <RobotOutlined className="text-loft-orange" />),
    ], 'group'),

    getItem('IDENTIDADE & ACESSO (IAM)', 'grp_iam', null, [
      getItem('Painel IAM', 'iam-dashboard', <DashboardOutlined />),
      getItem('Gestão de Usuários', 'iam-users', <TeamOutlined />),
      getItem('Grupos de Acesso', 'iam-groups', <TeamOutlined className="text-[#FF774A]" />),
      getItem('Papéis & Privilégios', 'iam-roles', <SafetyCertificateOutlined />),
      getItem('Matriz RBAC', 'iam-matrix', <NodeIndexOutlined />),
      getItem('Sessões Ativas', 'iam-sessions', <CloudServerOutlined />),
      getItem('Convites de Acesso', 'iam-invitations', <FileTextOutlined />),
      getItem('Compartilhamento', 'iam-shares', <ApartmentOutlined />),
      getItem('Trilha de Auditoria', 'audit', <HistoryOutlined />),
      getItem('Configurações', 'settings', <SettingOutlined className="text-[#0066CC]" />),
    ], 'group'),

    getItem('PLATAFORMA', 'grp_platform', null, [
      getItem('Atualizações de Bibliotecas', 'library-updates', <CloudSyncOutlined className="text-loft-orange" />),
    ], 'group'),
  ];

  const collapsedItems: MenuItem[] = [
    getItem('Dashboard', 'dashboard', <DashboardOutlined />),
    getItem('Projetos', 'projects', <FolderOpenOutlined />),
    getItem('Blueprints Gerados', 'blueprints', <FileDoneOutlined />),
    getItem('Blueprint Studio', 'workshop', <BuildOutlined className="text-loft-orange" />),
    { type: 'divider' },
    getItem('Catalog Hub', 'catalog-hub', <NodeIndexOutlined />),
    getItem('Componentes Copan', 'components', <AppstoreOutlined />),
    getItem('Templates de App', 'templates', <LayoutOutlined />),
    getItem('Módulos de Domínio', 'modules', <BlockOutlined />),
    getItem('Golden Rules', 'rules', <SafetyCertificateOutlined />),
    getItem('Arquiteturas Padrão', 'architectures', <ApartmentOutlined />),
    { type: 'divider' },
    getItem('Especificações (SDDs)', 'specifications', <FileTextOutlined />),
    getItem('Documentação', 'documentation', <ReadOutlined />),
    { type: 'divider' },
    getItem('AI Gateway', 'ai-gateway', <ApiOutlined />),
    getItem('AI Agents', 'ai-agents', <RobotOutlined />),
    getItem('AI Providers', 'ai-providers', <CloudServerOutlined />),
    getItem('AI Composer', 'ai-composer', <RobotOutlined className="text-loft-orange" />),
    { type: 'divider' },
    getItem('Painel IAM', 'iam-dashboard', <DashboardOutlined />),
    getItem('Gestão de Usuários', 'iam-users', <TeamOutlined />),
    getItem('Grupos de Acesso', 'iam-groups', <TeamOutlined className="text-[#FF774A]" />),
    getItem('Papéis & Privilégios', 'iam-roles', <SafetyCertificateOutlined />),
    getItem('Matriz RBAC', 'iam-matrix', <NodeIndexOutlined />),
    getItem('Sessões Ativas', 'iam-sessions', <CloudServerOutlined />),
    getItem('Convites de Acesso', 'iam-invitations', <FileTextOutlined />),
    getItem('Compartilhamento', 'iam-shares', <ApartmentOutlined />),
    getItem('Trilha de Auditoria', 'audit', <HistoryOutlined />),
    getItem('Configurações', 'settings', <SettingOutlined className="text-[#0066CC]" />),
    { type: 'divider' },
    getItem('Atualizações de Bibliotecas', 'library-updates', <CloudSyncOutlined className="text-loft-orange" />),
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const targetPath = VIEW_TO_PATH[e.key as ActiveView] || '/dashboard';
    navigateTo(targetPath);
  };

  const [engineStatus, setEngineStatus] = useState<EngineStatusData | null>(null);
  const [engineOnline, setEngineOnline] = useState<boolean>(true);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false);

  const checkEngineHealth = useCallback(async () => {
    setCheckingStatus(true);
    const start = performance.now();
    try {
      const data = await apiClient.get<EngineStatusData>('/api/v1/dashboard/engine-status');
      const elapsed = Math.max(1, Math.round(performance.now() - start));
      setEngineStatus(data);
      setEngineOnline(data?.status === 'online');
      setLatencyMs(elapsed);
    } catch {
      setEngineOnline(false);
      setLatencyMs(null);
    } finally {
      setCheckingStatus(false);
    }
  }, []);

  useEffect(() => {
    checkEngineHealth();
    const timer = window.setInterval(checkEngineHealth, 30000);
    return () => window.clearInterval(timer);
  }, [checkEngineHealth]);

  const statusTooltip = engineOnline && engineStatus
    ? `${engineStatus.service} v${engineStatus.version} (${engineStatus.environment}) • ${engineStatus.database} • ${engineStatus.active_projects} projetos / ${engineStatus.active_blueprints} blueprints • Latência: ${latencyMs ?? 1}ms`
    : 'Motor indisponível ou sem conexão com o backend FastAPI';

  return (
    <aside
      className={`${
        sidebarCollapsed ? 'w-[72px]' : 'w-64'
      } bg-white border-r border-loft-border flex flex-col shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-hidden select-none z-20 transition-[width] duration-300 ease-in-out`}
    >
      {/* Top Collapse / Expand Control Bar */}
      <div
        className={`h-11 px-3 border-b border-loft-border bg-[#FAFBFD] flex items-center shrink-0 ${
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {!sidebarCollapsed && (
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#627D98] pl-1">
            Menu Principal
          </span>
        )}
        <Tooltip
          title={sidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          placement="right"
        >
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#486581] hover:text-loft-orange hover:bg-[#FFF2EC] transition-colors cursor-pointer"
          >
            {sidebarCollapsed ? (
              <MenuUnfoldOutlined className="text-base" />
            ) : (
              <MenuFoldOutlined className="text-base" />
            )}
          </button>
        </Tooltip>
      </div>

      {/* Scrollable Menu Area */}
      <div
        className="py-1.5 flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain"
        style={{ scrollbarGutter: sidebarCollapsed ? 'auto' : 'stable' }}
      >
        <Menu
          mode="inline"
          inlineCollapsed={sidebarCollapsed}
          selectedKeys={[activeView]}
          onClick={handleMenuClick}
          items={sidebarCollapsed ? collapsedItems : groupedItems}
          className="border-none text-sm font-medium"
        />
      </div>

      {/* Fixed Engine Status Footer */}
      <div
        className={`${
          sidebarCollapsed ? 'p-2.5' : 'p-3.5'
        } border-t border-loft-border bg-[#FAFBFD] text-xs text-loft-muted shrink-0`}
      >
        <Tooltip title={statusTooltip} placement="right">
          {sidebarCollapsed ? (
            <div
              onClick={checkEngineHealth}
              className="flex flex-col items-center justify-center gap-1 cursor-pointer group py-0.5"
            >
              <div className="relative flex items-center justify-center">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    engineOnline ? 'bg-loft-success animate-pulse' : 'bg-red-500'
                  }`}
                />
              </div>
              <span className="text-[10px] font-mono font-semibold text-[#334E68] group-hover:text-loft-orange transition-colors">
                {engineOnline ? `v${engineStatus?.version?.split('.').slice(0, 2).join('.') || '2.4'}` : 'OFF'}
              </span>
            </div>
          ) : (
            <div
              onClick={checkEngineHealth}
              className="flex items-center justify-between font-medium cursor-pointer group"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[#334E68] font-semibold">Engine Status</span>
                <ReloadOutlined
                  spin={checkingStatus}
                  className="text-[10px] text-loft-muted opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
              {engineOnline ? (
                <span className="text-loft-success flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-loft-success animate-pulse" />
                  <span>v{engineStatus?.version || '1.0.0'} Ready</span>
                  {latencyMs !== null && (
                    <span className="text-[10px] text-[#829AB1] font-mono">({latencyMs}ms)</span>
                  )}
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Offline</span>
                </span>
              )}
            </div>
          )}
        </Tooltip>
      </div>
    </aside>
  );
};
