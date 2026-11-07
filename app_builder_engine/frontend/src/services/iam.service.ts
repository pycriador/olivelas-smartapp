import { apiClient } from './api-client';
import type {
  LoginResponse,
  IamUser,
  IamGroup,
  IamRole,
  IamPermission,
  PermissionMatrixItem,
  IamSession,
  IamInvitation,
  IamShare,
  IamDashboardStats,
} from '@/types/iam.types';

export interface BootstrapStatusResponse {
  total_users: number;
  has_users: boolean;
  first_user_will_be_global_admin: boolean;
  initial_role_on_signup: string;
  initial_group_on_signup: string;
}

export const iamService = {
  // Auth & Bootstrap (Primeiro Cadastro = Global Admin)
  getBootstrapStatus: () =>
    apiClient.get<BootstrapStatusResponse>('/api/v1/iam/auth/bootstrap-status'),

  login: (data: { username_or_email: string; password: string; remember_me?: boolean }) =>
    apiClient.post<LoginResponse>('/api/v1/iam/auth/login', data),

  signup: (data: {
    name: string;
    email: string;
    username?: string;
    password: string;
    language?: string;
    timezone_name?: string;
  }) => apiClient.post<LoginResponse>('/api/v1/iam/auth/signup', data),

  refreshToken: (refresh_token: string) =>
    apiClient.post<LoginResponse>('/api/v1/iam/auth/refresh', { refresh_token }),

  logout: () =>
    apiClient.post<{ message: string }>('/api/v1/iam/auth/logout', {}),

  getMe: () =>
    apiClient.get<IamUser>('/api/v1/iam/auth/me'),

  changePassword: (data: { current_password: string; new_password: string }) =>
    apiClient.post<{ message: string }>('/api/v1/iam/auth/change-password', data),

  // Users
  getUsers: (params?: { search?: string; role?: string; status?: string; group_id?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.role) q.append('role', params.role);
    if (params?.status) q.append('status', params.status);
    if (params?.group_id) q.append('group_id', params.group_id);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return apiClient.get<IamUser[]>(`/api/v1/iam/users${qs}`);
  },

  getUsersPaginated: (params?: {
    search?: string;
    role?: string;
    status?: string;
    group_id?: string;
    page?: number;
    page_size?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.role) q.append('role', params.role);
    if (params?.status) q.append('status', params.status);
    if (params?.group_id) q.append('group_id', params.group_id);
    if (params?.page) q.append('page', String(params.page));
    if (params?.page_size) q.append('page_size', String(params.page_size));
    const qs = q.toString() ? `?${q.toString()}` : '';
    return apiClient.getPaginated<IamUser>(`/api/v1/iam/users${qs}`);
  },

  getUser: (userId: string) =>
    apiClient.get<IamUser>(`/api/v1/iam/users/${userId}`),

  createUser: (data: any) =>
    apiClient.post<IamUser>('/api/v1/iam/users', data),

  updateUser: (userId: string, data: any) =>
    apiClient.put<IamUser>(`/api/v1/iam/users/${userId}`, data),

  deleteUser: (userId: string) =>
    apiClient.delete<{ message: string }>(`/api/v1/iam/users/${userId}`),

  adminResetPassword: (userId: string, data: { new_password: string; force_change_on_login?: boolean }) =>
    apiClient.post<{ message: string }>(`/api/v1/iam/users/${userId}/reset-password`, data),

  unlockUser: (userId: string) =>
    apiClient.post<{ message: string }>(`/api/v1/iam/users/${userId}/unlock`, {}),

  // Groups
  getGroups: () =>
    apiClient.get<IamGroup[]>('/api/v1/iam/groups'),

  getGroupsPaginated: (params?: { search?: string; page?: number; page_size?: number }) => {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.page) q.append('page', String(params.page));
    if (params?.page_size) q.append('page_size', String(params.page_size));
    const qs = q.toString() ? `?${q.toString()}` : '';
    return apiClient.getPaginated<IamGroup>(`/api/v1/iam/groups${qs}`);
  },

  getGroup: (groupId: string) =>
    apiClient.get<IamGroup>(`/api/v1/iam/groups/${groupId}`),

  createGroup: (data: any) =>
    apiClient.post<IamGroup>('/api/v1/iam/groups', data),

  updateGroup: (groupId: string, data: any) =>
    apiClient.put<IamGroup>(`/api/v1/iam/groups/${groupId}`, data),

  deleteGroup: (groupId: string) =>
    apiClient.delete<{ message: string }>(`/api/v1/iam/groups/${groupId}`),

  duplicateGroup: (groupId: string) =>
    apiClient.post<IamGroup>(`/api/v1/iam/groups/${groupId}/duplicate`, {}),

  // Roles
  getRoles: () =>
    apiClient.get<IamRole[]>('/api/v1/iam/roles'),

  getRolesPaginated: (params?: { search?: string; page?: number; page_size?: number }) => {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.page) q.append('page', String(params.page));
    if (params?.page_size) q.append('page_size', String(params.page_size));
    const qs = q.toString() ? `?${q.toString()}` : '';
    return apiClient.getPaginated<IamRole>(`/api/v1/iam/roles${qs}`);
  },

  getRole: (roleId: string) =>
    apiClient.get<IamRole>(`/api/v1/iam/roles/${roleId}`),

  createRole: (data: any) =>
    apiClient.post<IamRole>('/api/v1/iam/roles', data),

  updateRole: (roleId: string, data: any) =>
    apiClient.put<IamRole>(`/api/v1/iam/roles/${roleId}`, data),

  deleteRole: (roleId: string) =>
    apiClient.delete<{ message: string }>(`/api/v1/iam/roles/${roleId}`),

  // Permissions & Matrix
  getPermissions: () =>
    apiClient.get<IamPermission[]>('/api/v1/iam/permissions'),

  createPermission: (data: { code: string; name: string; category?: string; module?: string; description?: string }) =>
    apiClient.post<IamPermission>('/api/v1/iam/permissions', data),

  updatePermission: (permissionId: string, data: { name?: string; category?: string; module?: string; description?: string }) =>
    apiClient.put<IamPermission>(`/api/v1/iam/permissions/${permissionId}`, data),

  deletePermission: (permissionId: string) =>
    apiClient.delete<{ message: string }>(`/api/v1/iam/permissions/${permissionId}`),

  toggleRolePermission: (permissionId: string, roleName: string, granted: boolean) =>
    apiClient.post<{ message: string }>(`/api/v1/iam/permissions/${permissionId}/toggle`, {
      role_name: roleName,
      granted,
    }),

  getPermissionMatrix: () =>
    apiClient.get<PermissionMatrixItem[]>('/api/v1/iam/permissions/matrix'),

  getPermissionMatrixPaginated: (params?: {
    module?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.module) q.append('module', params.module);
    if (params?.search) q.append('search', params.search);
    if (params?.page) q.append('page', String(params.page));
    if (params?.page_size) q.append('page_size', String(params.page_size));
    const qs = q.toString() ? `?${q.toString()}` : '';
    return apiClient.getPaginated<PermissionMatrixItem>(`/api/v1/iam/permissions/matrix${qs}`);
  },


  // Sessions
  getSessions: () =>
    apiClient.get<IamSession[]>('/api/v1/iam/sessions'),

  getSessionsPaginated: (params?: {
    search?: string;
    is_active?: boolean;
    page?: number;
    page_size?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.is_active !== undefined) q.append('is_active', String(params.is_active));
    if (params?.page) q.append('page', String(params.page));
    if (params?.page_size) q.append('page_size', String(params.page_size));
    const qs = q.toString() ? `?${q.toString()}` : '';
    return apiClient.getPaginated<IamSession>(`/api/v1/iam/sessions${qs}`);
  },

  terminateSession: (sessionId: string) =>
    apiClient.delete<{ message: string }>(`/api/v1/iam/sessions/${sessionId}`),

  terminateAllUserSessions: (userId: string) =>
    apiClient.delete<{ message: string }>(`/api/v1/iam/sessions/user/${userId}/terminate-all`),

  // Invitations
  getInvitations: () =>
    apiClient.get<IamInvitation[]>('/api/v1/iam/invitations'),

  getInvitationsPaginated: (params?: {
    status?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.status) q.append('status', params.status);
    if (params?.search) q.append('search', params.search);
    if (params?.page) q.append('page', String(params.page));
    if (params?.page_size) q.append('page_size', String(params.page_size));
    const qs = q.toString() ? `?${q.toString()}` : '';
    return apiClient.getPaginated<IamInvitation>(`/api/v1/iam/invitations${qs}`);
  },

  createInvitation: (data: { email: string; role_id: string; group_id?: string | null }) =>
    apiClient.post<IamInvitation>('/api/v1/iam/invitations', data),

  cancelInvitation: (invitationId: string) =>
    apiClient.post<{ message: string }>(`/api/v1/iam/invitations/${invitationId}/cancel`, {}),

  // Shares
  getShares: (resourceType?: string, resourceId?: string) => {
    const q = new URLSearchParams();
    if (resourceType) q.append('resource_type', resourceType);
    if (resourceId) q.append('resource_id', resourceId);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return apiClient.get<IamShare[]>(`/api/v1/iam/shares${qs}`);
  },

  getSharesPaginated: (params?: {
    resource_type?: string;
    resource_id?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.resource_type) q.append('resource_type', params.resource_type);
    if (params?.resource_id) q.append('resource_id', params.resource_id);
    if (params?.search) q.append('search', params.search);
    if (params?.page) q.append('page', String(params.page));
    if (params?.page_size) q.append('page_size', String(params.page_size));
    const qs = q.toString() ? `?${q.toString()}` : '';
    return apiClient.getPaginated<IamShare>(`/api/v1/iam/shares${qs}`);
  },

  createShare: (data: { resource_type: string; resource_id: string; grantee_type: 'user' | 'group'; grantee_id: string; permission_level: string }) =>
    apiClient.post<IamShare>('/api/v1/iam/shares', data),

  deleteShare: (shareId: string) =>
    apiClient.delete<{ message: string }>(`/api/v1/iam/shares/${shareId}`),

  // Dashboard Stats
  getDashboardStats: () =>
    apiClient.get<IamDashboardStats>('/api/v1/iam/dashboard/stats'),
};
