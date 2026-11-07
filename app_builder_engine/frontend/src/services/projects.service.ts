import { apiClient } from './api-client';
import type { Project } from '@/types/domain.types';
import type { CreateProjectPayload } from '@/types/api.types';

export const projectsService = {
  getProjects: (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString();
    return apiClient.get<Project[]>(`/api/v1/projects${queryString ? `?${queryString}` : ''}`);
  },
  getProjectsPaginated: (params?: { status?: string; search?: string; domain?: string; category?: string; page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.domain) query.append('domain', params.domain);
    if (params?.category) query.append('category', params.category);
    if (params?.page) query.append('page', String(params.page));
    if (params?.page_size) query.append('page_size', String(params.page_size));
    const queryString = query.toString();
    return apiClient.getPaginated<Project>(`/api/v1/projects${queryString ? `?${queryString}` : ''}`);
  },
  getProjectById: (id: string) => apiClient.get<Project>(`/api/v1/projects/${id}`),
  createProject: (payload: CreateProjectPayload) =>
    apiClient.post<Project>('/api/v1/projects', payload),
  updateProject: (id: string, payload: Partial<CreateProjectPayload> & { status?: string }) =>
    apiClient.put<Project>(`/api/v1/projects/${id}`, payload),
  duplicateProject: (id: string) =>
    apiClient.post<Project>(`/api/v1/projects/${id}/duplicate`),
  archiveProject: (id: string) =>
    apiClient.post<Project>(`/api/v1/projects/${id}/archive`),
  unarchiveProject: (id: string) =>
    apiClient.post<Project>(`/api/v1/projects/${id}/unarchive`),
  createVersion: (id: string, payload: { version: string; changelog: string }) =>
    apiClient.post<any>(`/api/v1/projects/${id}/versions`, payload),
  restoreVersion: (id: string, payload: { version: string }) =>
    apiClient.post<Project>(`/api/v1/projects/${id}/restore`, payload),
  deleteProject: (id: string) => apiClient.delete(`/api/v1/projects/${id}`),
};
