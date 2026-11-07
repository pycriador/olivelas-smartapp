import React, { useEffect, useState } from 'react';
import { Button, Tooltip, Avatar, Dropdown, message } from 'antd';
import type { MenuProps } from 'antd';
import {
  SearchOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  DownOutlined,
  CheckOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import { useUIStore } from '@/stores/uiStore';
import { navigateTo } from '@/router/navigation';
import { rbacService } from '@/services/rbac.service';
import { AppSwitcher } from './AppSwitcher';
import type { RoleName } from '@/types/domain.types';

export const Header: React.FC = () => {
  const { toggleCommandPalette, currentRole, setCurrentRole } = useUIStore();
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('willian.jesus@loft.com.br');
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState<boolean>(false);

  useEffect(() => {
    rbacService.getCurrentUser().then((user) => {
      if (user) {
        setCurrentRole(user.role);
        setCurrentUserEmail(user.email);
      }
    }).catch(() => {
      // ignore
    });
  }, [setCurrentRole]);

  const handleRoleChange = async (role: RoleName) => {
    try {
      await rbacService.switchRole(role);
      setCurrentRole(role);
      message.success(`Perfil ativo alterado para: ${role}`);
    } catch (err: any) {
      message.error(err.message || 'Falha ao alterar perfil.');
    }
  };

  const roleMenuItems: MenuProps['items'] = [
    {
      key: 'role-header',
      type: 'group',
      label: <span className="text-xs font-bold text-loft-muted uppercase">Alternar Perfil Ativo (RBAC)</span>,
    },
    {
      key: 'Global Admin',
      icon: currentRole === 'Global Admin' ? <CheckOutlined className="text-loft-orange" /> : <SafetyCertificateOutlined />,
      label: (
        <div className="py-0.5">
          <div className="font-semibold text-xs text-loft-dark">Global Admin</div>
          <div className="text-[11px] text-loft-muted">Acesso irrestrito e publicação</div>
        </div>
      ),
      onClick: () => handleRoleChange('Global Admin'),
    },
    {
      key: 'Admin',
      icon: currentRole === 'Admin' ? <CheckOutlined className="text-loft-orange" /> : <SafetyCertificateOutlined />,
      label: (
        <div className="py-0.5">
          <div className="font-semibold text-xs text-loft-dark">Admin</div>
          <div className="text-[11px] text-loft-muted">Gestão de catálogos e aprovação</div>
        </div>
      ),
      onClick: () => handleRoleChange('Admin'),
    },
    {
      key: 'Editor',
      icon: currentRole === 'Editor' ? <CheckOutlined className="text-loft-orange" /> : <UserOutlined />,
      label: (
        <div className="py-0.5">
          <div className="font-semibold text-xs text-loft-dark">Editor</div>
          <div className="text-[11px] text-loft-muted">Criação e edição de blueprints</div>
        </div>
      ),
      onClick: () => handleRoleChange('Editor'),
    },
    {
      key: 'Viewer',
      icon: currentRole === 'Viewer' ? <CheckOutlined className="text-loft-orange" /> : <UserOutlined />,
      label: (
        <div className="py-0.5">
          <div className="font-semibold text-xs text-loft-dark">Viewer</div>
          <div className="text-[11px] text-loft-muted">Consulta somente leitura</div>
        </div>
      ),
      onClick: () => handleRoleChange('Viewer'),
    },
  ];

  const getRoleBadgeColor = () => {
    switch (currentRole) {
      case 'Global Admin':
        return 'bg-[#FFF2EC] text-loft-orange border-[#FDC4B2]';
      case 'Admin':
        return 'bg-[#EBF8FF] text-[#0066CC] border-[#BEE3F8]';
      case 'Editor':
        return 'bg-[#F0FFF4] text-[#2F855A] border-[#C6F6D5]';
      case 'Viewer':
        return 'bg-[#F7FAFC] text-[#4A5568] border-[#E2E8F0]';
      default:
        return 'bg-loft-bg text-[#334E68] border-[#CBD2D9]';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-loft-border px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Brand / Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsAppSwitcherOpen(!isAppSwitcherOpen)}
          className={`p-2 rounded-lg transition ${
            isAppSwitcherOpen ? 'bg-[#FFEDE6] text-loft-orange' : 'text-loft-muted hover:bg-loft-bg hover:text-loft-dark'
          }`}
          title="Loft App Switcher (Menu Waffle)"
        >
          <AppstoreOutlined className="text-lg" />
        </button>

        <AppSwitcher
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentProduct="app-builder"
        />

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => navigateTo('/dashboard')}
          >
            <span className="text-xl font-black text-loft-dark tracking-tight">loft</span>
            <div className="w-1.5 h-1.5 rounded-full bg-loft-orange" />
            <span className="font-semibold text-sm text-[#334E68] tracking-normal">
              App Builder Engine
            </span>
          </div>

          <Dropdown menu={{ items: roleMenuItems }} trigger={['click']}>
            <button
              className={`text-xs border font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer ${getRoleBadgeColor()}`}
              title="Clique para alternar perfil RBAC"
            >
              <span>{currentRole}</span>
              <DownOutlined className="text-[10px]" />
            </button>
          </Dropdown>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          onClick={toggleCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-loft-bg hover:bg-[#E8EDF5] border border-loft-border rounded-lg text-sm text-loft-muted transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <SearchOutlined className="text-loft-muted" />
            <span>Buscar componentes, módulos, regras ou especificações...</span>
          </div>
          <kbd className="bg-white border border-[#CBD2D9] px-1.5 py-0.5 text-xs rounded-sm text-[#486581] font-mono shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Tooltip title="Buscar (⌘K)">
          <Button
            type="text"
            icon={<SearchOutlined />}
            onClick={toggleCommandPalette}
            className="md:hidden"
          />
        </Tooltip>

        <Tooltip title="Trilha de Auditoria">
          <Button
            type="text"
            icon={<QuestionCircleOutlined />}
            className="text-loft-muted hover:text-loft-dark"
            onClick={() => navigateTo('/admin/audit')}
          />
        </Tooltip>

        <div className="h-6 w-px bg-loft-border mx-1" />

        {/* User Profile Dropdown */}
        <Dropdown
          menu={{
            items: [
              {
                key: 'profile-info',
                type: 'group',
                label: (
                  <div className="py-1">
                    <div className="font-bold text-xs text-loft-dark">Willian Jesus</div>
                    <div className="text-[11px] text-loft-muted">{currentUserEmail}</div>
                  </div>
                ),
              },
              { type: 'divider' },
              {
                key: 'profile',
                icon: <UserOutlined />,
                label: 'Meu Perfil & Segurança',
                onClick: () => navigateTo('/profile'),
              },
              {
                key: 'iam',
                icon: <SafetyCertificateOutlined />,
                label: 'Painel IAM & Governança',
                onClick: () => navigateTo('/iam/dashboard'),
              },
              {
                key: 'settings',
                icon: <SettingOutlined />,
                label: 'Configurações & Categorias',
                onClick: () => navigateTo('/settings'),
              },
              { type: 'divider' },

              {
                key: 'logout',
                danger: true,
                label: 'Sair da Conta',
                onClick: () => {
                  localStorage.removeItem('loft_access_token');
                  localStorage.removeItem('loft_refresh_token');
                  localStorage.removeItem('loft_user_info');
                  message.info('Sessão encerrada.');
                  navigateTo('/login');
                },
              },
            ],
          }}
          trigger={['click']}
        >
          <div className="flex items-center gap-2.5 pl-1 cursor-pointer hover:opacity-80 transition">
            <Avatar
              style={{ backgroundColor: '#FF774A', verticalAlign: 'middle' }}
              size="default"
              className="font-bold border border-white shadow-2xs"
            >
              WJ
            </Avatar>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-loft-dark leading-tight">
                Willian Jesus
              </span>
              <span className="text-[11px] text-loft-muted font-medium leading-tight">
                {currentUserEmail}
              </span>
            </div>
            <DownOutlined className="text-[10px] text-loft-muted hidden lg:block" />
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
