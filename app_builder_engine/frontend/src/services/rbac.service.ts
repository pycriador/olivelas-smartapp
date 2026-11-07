import { apiClient } from './api-client';
import type { User, RoleDefinition } from '@/types/domain.types';

export const rbacService = {
  getUsers: () => apiClient.get<User[]>('/api/v1/rbac/users'),
  getCurrentUser: () => apiClient.get<User>('/api/v1/rbac/current-user'),
  getRoles: () => apiClient.get<RoleDefinition[]>('/api/v1/rbac/roles'),
  switchRole: (role: string) => apiClient.post<User>('/api/v1/rbac/switch-role', { role }),
};
