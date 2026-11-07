import { apiClient } from './api-client';
import type { Blueprint, BlueprintValidationResult } from '@/types/domain.types';
import type { BlueprintBuildPayload } from '@/types/api.types';

export interface ResolveDependenciesResult {
  resolved_components: string[];
  resolved_modules: string[];
  resolved_rules: string[];
  resolved_specifications: string[];
  missing_dependencies: Array<{
    source: string;
    source_id: string;
    required_id: string;
    type: string;
  }>;
}

export const blueprintsService = {
  getBlueprints: (params?: { project_id?: string }) => {
    const query = new URLSearchParams();
    if (params?.project_id) query.append('project_id', params.project_id);
    const queryString = query.toString();
    return apiClient.get<Blueprint[]>(`/api/v1/blueprints${queryString ? `?${queryString}` : ''}`);
  },
  getBlueprintsPaginated: (params?: {
    project_id?: string;
    status?: string;
    architecture_id?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.project_id) query.append('project_id', params.project_id);
    if (params?.status) query.append('status', params.status);
    if (params?.architecture_id) query.append('architecture_id', params.architecture_id);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.page_size) query.append('page_size', String(params.page_size));
    const queryString = query.toString();
    return apiClient.getPaginated<Blueprint>(`/api/v1/blueprints${queryString ? `?${queryString}` : ''}`);
  },
  getBlueprintById: (id: string) => apiClient.get<Blueprint>(`/api/v1/blueprints/${id}`),
  buildBlueprint: (payload: BlueprintBuildPayload) =>
    apiClient.post<Blueprint>('/api/v1/blueprints/build', payload),
  resolveDependencies: (payload: {
    architecture_id: string;
    module_ids: string[];
    component_ids: string[];
    template_ids?: string[];
  }) => apiClient.post<ResolveDependenciesResult>('/api/v1/blueprints/resolve-dependencies', payload),
  validateConfig: async (payload: {
    architecture_id: string;
    module_ids: string[];
    component_ids: string[];
    template_ids?: string[];
    rule_ids?: string[];
    specification_ids?: string[];
    ui_library?: string;
    dependencies?: string[] | Record<string, string>;
    package_json?: Record<string, any>;
    source_files?: Record<string, string>;
  }): Promise<BlueprintValidationResult> => {
    try {
      return await apiClient.post<BlueprintValidationResult>('/api/v1/blueprints/validate-config', payload);
    } catch (err: any) {
      if (err?.status === 422 && err?.data?.data) {
        return err.data.data as BlueprintValidationResult;
      }
      throw err;
    }
  },
  validateBlueprint: (blueprintId: string) =>
    apiClient.post<BlueprintValidationResult>(`/api/v1/blueprints/${blueprintId}/validate`),
  publishBlueprint: (blueprintId: string) =>
    apiClient.post<Blueprint>(`/api/v1/blueprints/${blueprintId}/publish`),
  updateBlueprint: (blueprintId: string, payload: any) =>
    apiClient.put<Blueprint>(`/api/v1/blueprints/${blueprintId}`, payload),
  deleteBlueprint: (blueprintId: string) =>
    apiClient.delete(`/api/v1/blueprints/${blueprintId}`),
};
