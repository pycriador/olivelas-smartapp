import { apiClient } from './api-client';
import type { AIComposeBlueprintPayload, AIComposeBlueprintResponse } from '@/types/api.types';

export const aiService = {
  composeBlueprint: (payload: AIComposeBlueprintPayload) =>
    apiClient.post<AIComposeBlueprintResponse>(
      '/api/v1/ai/blueprints/compose',
      payload
    ),
  getAgentContracts: () =>
    apiClient.get<Record<string, any>>('/api/v1/ai/agent-contracts'),
};
