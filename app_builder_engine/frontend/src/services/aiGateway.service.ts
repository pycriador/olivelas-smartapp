import { apiClient } from './api-client';
import type {
  AiGatewayPolicy,
  AiGatewayMetrics,
  AiGatewayExecutionLog,
  AiGatewayExecuteRequest,
  AiGatewayExecuteResponse,
} from '@/types/ai.types';

export const aiGatewayService = {
  getMetrics: () =>
    apiClient.get<AiGatewayMetrics>('/api/v1/ai/gateway/metrics'),

  getPolicy: () =>
    apiClient.get<AiGatewayPolicy>('/api/v1/ai/gateway/policy'),

  updatePolicy: (policy: AiGatewayPolicy) =>
    apiClient.put<AiGatewayPolicy>('/api/v1/ai/gateway/policy', policy),

  getLogs: (limit: number = 20) =>
    apiClient.get<AiGatewayExecutionLog[]>(`/api/v1/ai/gateway/logs?limit=${limit}`),

  getLogsPaginated: (params?: { page?: number; page_size?: number }) => {
    const q = new URLSearchParams();
    if (params?.page) q.append('page', String(params.page));
    if (params?.page_size) q.append('page_size', String(params.page_size));
    const qs = q.toString() ? `?${q.toString()}` : '';
    return apiClient.getPaginated<AiGatewayExecutionLog>(`/api/v1/ai/gateway/logs${qs}`);
  },

  executePrompt: (req: AiGatewayExecuteRequest) =>
    apiClient.post<AiGatewayExecuteResponse>('/api/v1/ai/gateway/execute', req),
};
