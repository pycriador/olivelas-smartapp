import { create } from 'zustand';
import type { RoleName } from '@/types/domain.types';

export type ActiveView =
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'workshop'
  | 'projects'
  | 'blueprints'
  | 'catalog-hub'
  | 'components'
  | 'modules'
  | 'templates'
  | 'rules'
  | 'specifications'
  | 'architectures'
  | 'documentation'
  | 'ai-gateway'
  | 'ai-agents'
  | 'ai-providers'
  | 'ai-composer'
  | 'ai-contracts'
  | 'iam-dashboard'
  | 'iam-users'
  | 'iam-groups'
  | 'iam-roles'
  | 'iam-matrix'
  | 'iam-sessions'
  | 'iam-invitations'
  | 'iam-shares'
  | 'profile'
  | 'rbac-users'
  | 'rbac-roles'
  | 'audit'
  | 'settings'
  | 'library-updates';

interface UIState {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  // Active RBAC Role
  currentRole: RoleName;
  setCurrentRole: (role: RoleName) => void;

  // 360 Knowledge Drawer
  inspectorDrawerOpen: boolean;
  activeEntity360: { type: string; id: string } | null;
  openInspector360: (type: string, id: string) => void;
  closeInspector360: () => void;

  // Command Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;

  // Selected Project context
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;

  // Collapsible Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

const getInitialActiveView = (): ActiveView => {
  if (typeof window === 'undefined') return 'dashboard';
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  if (pathname === '/' || pathname === '/landing') return 'landing';
  if (pathname === '/login') return 'login';
  if (pathname === '/workshop') return 'workshop';
  if (pathname.startsWith('/projects')) return 'projects';
  if (pathname.startsWith('/blueprints')) return 'blueprints';
  if (pathname.startsWith('/catalog/components')) return 'components';
  if (pathname.startsWith('/catalog/modules')) return 'modules';
  if (pathname.startsWith('/catalog/templates')) return 'templates';
  if (pathname.startsWith('/catalog')) return 'catalog-hub';
  if (pathname.startsWith('/knowledge/rules')) return 'rules';
  if (pathname.startsWith('/knowledge/specifications')) return 'specifications';
  if (pathname.startsWith('/knowledge/architectures')) return 'architectures';
  if (pathname.startsWith('/knowledge/docs')) return 'documentation';
  if (pathname.startsWith('/ai/composer')) return 'ai-composer';
  if (pathname.startsWith('/ai/contracts')) return 'ai-contracts';
  if (pathname.startsWith('/ai/gateway')) return 'ai-gateway';
  if (pathname.startsWith('/ai/agents')) return 'ai-agents';
  if (pathname.startsWith('/ai/providers')) return 'ai-providers';
  if (pathname.startsWith('/iam/dashboard')) return 'iam-dashboard';
  if (pathname.startsWith('/iam/users')) return 'iam-users';
  if (pathname.startsWith('/iam/groups')) return 'iam-groups';
  if (pathname.startsWith('/iam/sessions')) return 'iam-sessions';
  if (pathname.startsWith('/iam/invitations')) return 'iam-invitations';
  if (pathname.startsWith('/iam/shares')) return 'iam-shares';
  if (pathname.startsWith('/profile')) return 'profile';
  if (pathname.startsWith('/settings')) return 'settings';
  if (pathname.startsWith('/admin/audit')) return 'audit';
  if (pathname.startsWith('/platform/library-updates')) return 'library-updates';
  return 'dashboard';
};

export const useUIStore = create<UIState>((set) => ({
  activeView: getInitialActiveView(),
  setActiveView: (view) => set({ activeView: view }),

  currentRole: 'Global Admin',
  setCurrentRole: (role) => set({ currentRole: role }),

  inspectorDrawerOpen: false,
  activeEntity360: null,
  openInspector360: (type, id) =>
    set({
      inspectorDrawerOpen: true,
      activeEntity360: { type, id },
    }),
  closeInspector360: () =>
    set({
      inspectorDrawerOpen: false,
      activeEntity360: null,
    }),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

  selectedProjectId: null,
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),

  sidebarCollapsed: typeof window !== 'undefined' ? window.localStorage.getItem('loft_sidebar_collapsed') === 'true' : false,
  setSidebarCollapsed: (collapsed) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('loft_sidebar_collapsed', String(collapsed));
    }
    set({ sidebarCollapsed: collapsed });
  },
  toggleSidebar: () =>
    set((state) => {
      const next = !state.sidebarCollapsed;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('loft_sidebar_collapsed', String(next));
      }
      return { sidebarCollapsed: next };
    }),
}));
