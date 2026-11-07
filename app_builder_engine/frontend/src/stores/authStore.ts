import { create } from 'zustand';
import { iamService, type BootstrapStatusResponse } from '@/services/iam.service';
import type { UserBasicInfo } from '@/types/iam.types';

interface AuthState {
  user: UserBasicInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  bootstrapStatus: BootstrapStatusResponse | null;

  login: (usernameOrEmail: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  signup: (data: { name: string; email: string; username?: string; password: string }) => Promise<boolean>;
  fetchBootstrapStatus: () => Promise<BootstrapStatusResponse | null>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hasPermission: (permissionCode: string) => boolean;
  hasRole: (roleName: string) => boolean;
  clearError: () => void;
}

const getStoredUser = (): UserBasicInfo | null => {
  try {
    const raw = localStorage.getItem('loft_user_info');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredUser(),
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('loft_access_token') : null,
  refreshToken: typeof window !== 'undefined' ? localStorage.getItem('loft_refresh_token') : null,
  isAuthenticated: Boolean(getStoredUser()),
  isLoading: false,
  error: null,
  bootstrapStatus: null,

  fetchBootstrapStatus: async () => {
    try {
      const status = await iamService.getBootstrapStatus();
      set({ bootstrapStatus: status });
      return status;
    } catch {
      return null;
    }
  },

  login: async (usernameOrEmail: string, password: string, rememberMe = false) => {
    set({ isLoading: true, error: null });
    try {
      const res = await iamService.login({
        username_or_email: usernameOrEmail,
        password,
        remember_me: rememberMe,
      });

      localStorage.setItem('loft_access_token', res.access_token);
      localStorage.setItem('loft_refresh_token', res.refresh_token);
      localStorage.setItem('loft_user_info', JSON.stringify(res.user));

      set({
        user: res.user,
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Falha ao autenticar. Verifique suas credenciais.',
      });
      return false;
    }
  },

  signup: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await iamService.signup(data);

      localStorage.setItem('loft_access_token', res.access_token);
      localStorage.setItem('loft_refresh_token', res.refresh_token);
      localStorage.setItem('loft_user_info', JSON.stringify(res.user));

      set({
        user: res.user,
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      await get().fetchBootstrapStatus();
      return true;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Falha ao realizar cadastro. Verifique os dados informados.',
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await iamService.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('loft_access_token');
      localStorage.removeItem('loft_refresh_token');
      localStorage.removeItem('loft_user_info');
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('loft_access_token');
    if (!token) {
      return;
    }
    try {
      const me = await iamService.getMe();
      set({
        user: {
          id: me.id,
          name: me.name,
          email: me.email,
          username: me.username,
          role: me.role,
          avatar_url: me.avatar_url,
          status: me.status,
          must_change_password: me.must_change_password,
          permissions: me.permissions,
          groups: me.groups,
        },
        isAuthenticated: true,
      });
    } catch {
      // keep fallback user in dev mode
    }
  },

  hasPermission: (permissionCode: string) => {
    const { user } = get();
    if (!user) return false;
    if (user.role === 'Global Admin' || user.permissions.includes('*')) return true;
    return user.permissions.includes(permissionCode);
  },

  hasRole: (roleName: string) => {
    const { user } = get();
    if (!user) return false;
    return user.role.toLowerCase() === roleName.toLowerCase();
  },

  clearError: () => set({ error: null }),
}));
