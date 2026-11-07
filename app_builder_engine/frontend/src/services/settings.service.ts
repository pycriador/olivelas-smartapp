import { apiClient } from './api-client';
import type {
  CategoryItem,
  CategoryCreateInput,
  CategoryUpdateInput,
  CategoryRbacSettings,
  SystemSettingsSummary,
} from '@/types/settings.types';

export const settingsService = {
  getSummary: () =>
    apiClient.get<SystemSettingsSummary>('/api/v1/settings/summary'),

  getCategories: (type?: string) => {
    const qs = type ? `?type=${encodeURIComponent(type)}` : '';
    return apiClient.get<CategoryItem[]>(`/api/v1/settings/categories${qs}`);
  },

  getCategoriesPaginated: (params?: {
    type?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.type) q.append('type', params.type);
    if (params?.search) q.append('search', params.search);
    if (params?.page) q.append('page', String(params.page));
    if (params?.page_size) q.append('page_size', String(params.page_size));
    const qs = q.toString() ? `?${q.toString()}` : '';
    return apiClient.getPaginated<CategoryItem>(`/api/v1/settings/categories${qs}`);
  },

  createCategory: (data: CategoryCreateInput) =>
    apiClient.post<CategoryItem>('/api/v1/settings/categories', data),

  updateCategory: (categoryId: string, data: CategoryUpdateInput) =>
    apiClient.put<CategoryItem>(`/api/v1/settings/categories/${categoryId}`, data),

  deleteCategory: (categoryId: string) =>
    apiClient.delete<{ message: string }>(`/api/v1/settings/categories/${categoryId}`),

  getRbacSettings: () =>
    apiClient.get<CategoryRbacSettings>('/api/v1/settings/rbac'),

  updateRbacSettings: (data: CategoryRbacSettings) =>
    apiClient.put<CategoryRbacSettings>('/api/v1/settings/rbac', data),
};
