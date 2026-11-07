import React, { useState } from 'react';
import { Button, Avatar, Dropdown, MenuProps, Tooltip } from 'antd';
import {
  AppstoreOutlined,
  SearchOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  RobotOutlined,
  FundProjectionScreenOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { AppSwitcher } from './AppSwitcher';

interface AppHeaderProps {
  activeView: 'chat' | 'landing' | 'dashboard';
  onViewChange: (view: 'chat' | 'landing' | 'dashboard') => void;
  appName: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeView,
  onViewChange,
  appName,
}) => {
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: 'Meu Perfil' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Configurações' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, danger: true, label: 'Sair da Conta' },
  ];

  return (
    <header className="h-16 bg-white border-b border-[#E1E9EF] px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Waffle Button */}
        <button
          onClick={() => setSwitcherOpen(true)}
          className="p-2 rounded-lg text-[#627D98] hover:text-[#121619] hover:bg-[#F2F4F8] transition cursor-pointer"
          title="Olivelas App Switcher (Menu Waffle 9-dots)"
        >
          <AppstoreOutlined className="text-lg" />
        </button>

        <AppSwitcher isOpen={switcherOpen} onClose={() => setSwitcherOpen(false)} />

        {/* Brand Logo */}
        <div className="flex items-center gap-2 select-none cursor-pointer" onClick={() => onViewChange(activeView)}>
          <span className="text-xl font-black text-[#121619] tracking-tight">loft</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#F56738]" />
          <span className="font-semibold text-sm text-[#334E68] tracking-normal truncate max-w-xs">
            {appName}
          </span>
          <span className="text-[11px] bg-[#FFF2EC] text-[#F56738] border border-[#FDC4B2] font-semibold px-2 py-0.5 rounded-full hidden sm:inline-block">
            Copan DS
          </span>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center bg-[#F2F4F8] p-1 rounded-lg border border-[#E1E9EF] gap-1">
        <button
          onClick={() => onViewChange('chat')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
            activeView === 'chat'
              ? 'bg-white text-[#F56738] shadow-sm'
              : 'text-[#627D98] hover:text-[#121619]'
          }`}
        >
          <RobotOutlined />
          <span>Chatbot & Copiloto</span>
        </button>
        <button
          onClick={() => onViewChange('landing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
            activeView === 'landing'
              ? 'bg-white text-[#F56738] shadow-sm'
              : 'text-[#627D98] hover:text-[#121619]'
          }`}
        >
          <FundProjectionScreenOutlined />
          <span>Apresentação Institucional</span>
        </button>
        <button
          onClick={() => onViewChange('dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
            activeView === 'dashboard'
              ? 'bg-white text-[#F56738] shadow-sm'
              : 'text-[#627D98] hover:text-[#121619]'
          }`}
        >
          <TableOutlined />
          <span>Painel de Gestão</span>
        </button>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-3">
        <Tooltip title="Buscar (⌘K)">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#F2F4F8] border border-[#E1E9EF] rounded-lg text-xs text-[#627D98] cursor-pointer hover:bg-[#E8EDF5]">
            <SearchOutlined />
            <span>Buscar...</span>
            <kbd className="bg-white border border-[#CBD2D9] px-1 py-0.2 rounded text-[10px] font-mono">⌘K</kbd>
          </div>
        </Tooltip>

        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
            <Avatar style={{ backgroundColor: '#F56738' }} size="small" className="font-bold">
              WJ
            </Avatar>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#121619] leading-tight">Willian Jesus</span>
              <span className="text-[11px] text-[#627D98] leading-tight">willian.jesus@olivelas.com.br</span>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
