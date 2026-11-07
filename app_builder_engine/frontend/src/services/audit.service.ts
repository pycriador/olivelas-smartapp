import { apiClient } from './api-client';
import type { AuditLog } from '@/types/domain.types';

export const auditService = {
  getLogs: (limit = 50) => apiClient.get<AuditLog[]>(`/api/v1/audit/logs?page_size=${limit}`),
  getLogsPaginated: (params?: {
    action?: string;
    resource?: string;
    actor?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.action) query.append('action', params.action);
    if (params?.resource) query.append('resource', params.resource);
    if (params?.actor) query.append('actor', params.actor);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.page_size) query.append('page_size', String(params.page_size));
    const qs = query.toString();
    return apiClient.getPaginated<AuditLog>(`/api/v1/audit/logs${qs ? `?${qs}` : ''}`);
  },
};
