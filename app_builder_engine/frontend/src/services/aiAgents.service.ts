import { apiClient } from './api-client';
import type {
  AiAgentItem,
  AiAgentCreateRequest,
  AiAgentUpdateRequest,
  AiAgentExecuteRequest,
  AiAgentExecuteResponse,
} from '@/types/ai.types';

export const aiAgentsService = {
  listAgents: () =>
    apiClient.get<AiAgentItem[]>('/api/v1/ai/agents'),

  listAgentsPaginated: (params?: {
    domain?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.domain) q.append('domain', params.domain);
    if (params?.search) q.append('search', params.search);
    if (params?.page) q.append('page', String(params.page));
    if (params?.page_size) q.append('page_size', String(params.page_size));
    const qs = q.toString() ? `?${q.toString()}` : '';
    return apiClient.getPaginated<AiAgentItem>(`/api/v1/ai/agents${qs}`);
  },

  getAgent: (agentId: string) =>
    apiClient.get<AiAgentItem>(`/api/v1/ai/agents/${agentId}`),

  createAgent: (req: AiAgentCreateRequest) =>
    apiClient.post<AiAgentItem>('/api/v1/ai/agents', req),

  updateAgent: (agentId: string, req: AiAgentUpdateRequest) =>
    apiClient.put<AiAgentItem>(`/api/v1/ai/agents/${agentId}`, req),

  deleteAgent: (agentId: string) =>
    apiClient.delete<void>(`/api/v1/ai/agents/${agentId}`),

  executeAgent: (agentId: string, req: AiAgentExecuteRequest) =>
    apiClient.post<AiAgentExecuteResponse>(`/api/v1/ai/agents/${agentId}/execute`, req),
};
