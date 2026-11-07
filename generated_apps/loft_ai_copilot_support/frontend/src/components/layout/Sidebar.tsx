import React from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  RobotOutlined,
  FundProjectionScreenOutlined,
  TableOutlined,
  AppstoreOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

interface SidebarProps {
  activeView: 'chat' | 'landing' | 'dashboard';
  onViewChange: (view: 'chat' | 'landing' | 'dashboard') => void;
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

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const items: MenuItem[] = [
    getItem('NAVEGAÇÃO PRINCIPAL', 'grp_main', null, [
      getItem('Chatbot & Copiloto', 'chat', <RobotOutlined className={activeView === 'chat' ? 'text-[#F56738]' : ''} />),
      getItem('Apresentação Clientes', 'landing', <FundProjectionScreenOutlined className={activeView === 'landing' ? 'text-[#F56738]' : ''} />),
      getItem('Painel de Gestão', 'dashboard', <TableOutlined className={activeView === 'dashboard' ? 'text-[#F56738]' : ''} />),
    ], 'group'),

    getItem('SERVIÇOS & CATÁLOGO', 'grp_services', null, [
      getItem('Soluções & Produtos', 'solutions', <AppstoreOutlined />),
      getItem('Métricas & Performance', 'metrics', <LineChartOutlined />),
      getItem('Segurança & Compliance', 'security', <SafetyCertificateOutlined />),
    ], 'group'),

    getItem('SISTEMA', 'grp_system', null, [
      getItem('Configurações', 'settings', <SettingOutlined />),
      getItem('Central de Ajuda', 'help', <QuestionCircleOutlined />),
    ], 'group'),
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'chat' || e.key === 'landing' || e.key === 'dashboard') {
      onViewChange(e.key);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E1E9EF] flex flex-col shrink-0 min-h-[calc(100vh-64px)] select-none">
      <div className="py-3 flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          selectedKeys={[activeView]}
          onClick={handleMenuClick}
          items={items}
          className="border-none text-sm font-medium"
        />
      </div>

      <div className="p-4 border-t border-[#E1E9EF] bg-[#FAFBFD] text-xs text-[#627D98]">
        <div className="flex items-center justify-between font-medium">
          <span>Copan Engine</span>
          <span className="text-[#20A483] flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#20A483]" /> v1.0.0 Ready
          </span>
        </div>
        <div className="mt-1 text-[11px] text-[#829AB1]">
          Loft Design Tokens enforced
        </div>
      </div>
    </aside>
  );
};
