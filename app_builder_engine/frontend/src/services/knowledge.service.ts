import { apiClient } from './api-client';
import type {
  KnowledgeCategory,
  KnowledgeDocumentSummary,
  KnowledgeDocumentDetail,
  KnowledgeDocumentCreate,
  KnowledgeDocumentUpdate,
  KnowledgeDocShareCreate,
  KnowledgeDocShareItem,
  ConfluenceImportRequest,
  GitHubImportRequest,
  RawDocImportRequest,
  ApiClientSource,
  ApiSavedRequest,
  ApiExecutionRequest,
  ApiExecutionResponse,
} from '@/types/knowledge.types';

export const knowledgeService = {
  // --- Knowledge Documents ---
  getDocuments: async (category?: KnowledgeCategory): Promise<KnowledgeDocumentSummary[]> => {
    const url = category ? `/api/v1/knowledge/docs?category=${category}` : '/api/v1/knowledge/docs';
    return apiClient.get<KnowledgeDocumentSummary[]>(url);
  },

  getDocumentById: async (docId: string): Promise<KnowledgeDocumentDetail> => {
    return apiClient.get<KnowledgeDocumentDetail>(`/api/v1/knowledge/docs/${docId}`);
  },

  createDocument: async (payload: KnowledgeDocumentCreate): Promise<KnowledgeDocumentDetail> => {
    return apiClient.post<KnowledgeDocumentDetail>('/api/v1/knowledge/docs', payload);
  },

  updateDocument: async (docId: string, payload: KnowledgeDocumentUpdate): Promise<KnowledgeDocumentDetail> => {
    return apiClient.put<KnowledgeDocumentDetail>(`/api/v1/knowledge/docs/${docId}`, payload);
  },

  deleteDocument: async (docId: string): Promise<void> => {
    return apiClient.delete<void>(`/api/v1/knowledge/docs/${docId}`);
  },

  // --- Document Sharing ---
  listShares: async (docId: string): Promise<KnowledgeDocShareItem[]> => {
    return apiClient.get<KnowledgeDocShareItem[]>(`/api/v1/knowledge/docs/${docId}/shares`);
  },

  addShare: async (docId: string, payload: KnowledgeDocShareCreate): Promise<KnowledgeDocShareItem> => {
    return apiClient.post<KnowledgeDocShareItem>(`/api/v1/knowledge/docs/${docId}/shares`, payload);
  },

  removeShare: async (docId: string, shareId: string): Promise<void> => {
    return apiClient.delete<void>(`/api/v1/knowledge/docs/${docId}/shares/${shareId}`);
  },

  // --- External Importers ---
  importConfluence: async (payload: ConfluenceImportRequest): Promise<KnowledgeDocumentDetail> => {
    return apiClient.post<KnowledgeDocumentDetail>('/api/v1/knowledge/import/confluence', payload);
  },

  importGitHub: async (payload: GitHubImportRequest): Promise<KnowledgeDocumentDetail> => {
    return apiClient.post<KnowledgeDocumentDetail>('/api/v1/knowledge/import/github', payload);
  },

  importRaw: async (payload: RawDocImportRequest): Promise<KnowledgeDocumentDetail> => {
    return apiClient.post<KnowledgeDocumentDetail>('/api/v1/knowledge/import/raw', payload);
  },

  syncAIOpsDocumentation: async (): Promise<{ synced: boolean; total_documents: number; timestamp: string }> => {
    return apiClient.post<{ synced: boolean; total_documents: number; timestamp: string }>('/api/v1/knowledge/sync/aiops-documentation');
  },

  // --- Favorites ---
  getUserFavorites: async (): Promise<string[]> => {
    const res = await apiClient.get<{ favorites: string[]; user_id: string; total: number }>('/api/v1/knowledge/favorites');
    return res.favorites || [];
  },

  toggleFavorite: async (docId: string): Promise<{ document_id: string; is_favorite: boolean; user_id: string }> => {
    return apiClient.post<{ document_id: string; is_favorite: boolean; user_id: string }>(`/api/v1/knowledge/favorites/${docId}`);
  },

  // --- HTTP Client ---
  executeRequest: async (payload: ApiExecutionRequest): Promise<ApiExecutionResponse> => {
    return apiClient.post<ApiExecutionResponse>('/api/v1/api-client/execute', payload);
  },

  listSources: async (): Promise<ApiClientSource[]> => {
    return apiClient.get<ApiClientSource[]>('/api/v1/api-client/sources');
  },

  saveSource: async (source: ApiClientSource): Promise<ApiClientSource> => {
    return apiClient.post<ApiClientSource>('/api/v1/api-client/sources', source);
  },

  deleteSource: async (sourceId: string): Promise<void> => {
    return apiClient.delete<void>(`/api/v1/api-client/sources/${sourceId}`);
  },

  listSavedRequests: async (): Promise<ApiSavedRequest[]> => {
    return apiClient.get<ApiSavedRequest[]>('/api/v1/api-client/requests');
  },

  saveRequest: async (request: ApiSavedRequest): Promise<ApiSavedRequest> => {
    return apiClient.post<ApiSavedRequest>('/api/v1/api-client/requests', request);
  },

  deleteSavedRequest: async (requestId: string): Promise<void> => {
    return apiClient.delete<void>(`/api/v1/api-client/requests/${requestId}`);
  },
};
