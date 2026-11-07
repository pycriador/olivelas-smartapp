import { apiClient } from './api-client';
import type {
  MultiProviderSettings,
  AiProviderUpdateRequest,
  AiTestConnectionRequest,
  AiTestConnectionResponse,
  AiModelOption,
  AiProviderConfigItem,
  AiCustomProviderCreateRequest,
  AiCustomProviderUpdateRequest,
} from '@/types/ai.types';

export const aiSettingsService = {
  getAiSettings: () =>
    apiClient.get<MultiProviderSettings>('/api/v1/settings/ai'),

  updateAiSettings: (payload: AiProviderUpdateRequest) =>
    apiClient.put<MultiProviderSettings>('/api/v1/settings/ai', payload),

  testConnection: (payload: AiTestConnectionRequest) =>
    apiClient.post<AiTestConnectionResponse>('/api/v1/settings/ai/test', payload),

  getAiModels: () =>
    apiClient.get<AiModelOption[]>('/api/v1/settings/ai/models'),

  fetchGeminiLiveModels: (apiKey?: string) =>
    apiClient.post<AiModelOption[]>('/api/v1/settings/ai/gemini/fetch-models', {
      api_key: apiKey,
    }),

  createCustomProvider: (payload: AiCustomProviderCreateRequest) =>
    apiClient.post<AiProviderConfigItem>('/api/v1/settings/ai/providers', payload),

  updateProviderById: (providerId: string, payload: AiCustomProviderUpdateRequest) =>
    apiClient.put<AiProviderConfigItem>(`/api/v1/settings/ai/providers/${providerId}`, payload),

  deleteProviderById: (providerId: string) =>
    apiClient.delete<{ message: string }>(`/api/v1/settings/ai/providers/${providerId}`),

  fetchLiveModelsForProvider: (providerId: string, apiKey?: string, baseUrl?: string) =>
    apiClient.post<AiModelOption[]>(`/api/v1/settings/ai/providers/${providerId}/fetch-models`, {
      provider_id: providerId,
      api_key: apiKey,
      base_url: baseUrl,
    }),
};
