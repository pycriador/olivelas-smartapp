import { apiClient } from './api-client';
import type { DashboardMetrics, EngineeringHealthMetrics, AuditLog } from '@/types/domain.types';

export const dashboardService = {
  getMetrics: () => apiClient.get<DashboardMetrics>('/api/v1/dashboard/metrics'),
  getEngineeringHealth: () => apiClient.get<EngineeringHealthMetrics>('/api/v1/dashboard/health'),
  getActivity: (limit = 10) => apiClient.get<AuditLog[]>(`/api/v1/dashboard/activity?limit=${limit}`),
};
