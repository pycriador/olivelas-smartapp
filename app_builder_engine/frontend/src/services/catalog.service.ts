import { apiClient } from './api-client';
import type {
  Component,
  Module,
  Template,
  Rule,
  Specification,
  Architecture,
  Entity360Response,
} from '@/types/domain.types';

export const catalogService = {
  // 360 Relations
  getEntity360: (type: string, id: string) =>
    apiClient.get<Entity360Response>(`/api/v1/relations/${type}/${id}`),

  // Universal Versioning
  createVersion: (entityType: string, entityId: string, payload: { version: string; changelog: string }) =>
    apiClient.post<any>(`/api/v1/catalog/${entityType}/${entityId}/versions`, payload),

  restoreVersion: (entityType: string, entityId: string, payload: { version: string }) =>
    apiClient.post<any>(`/api/v1/catalog/${entityType}/${entityId}/restore`, payload),

  transitionStatus: (entityType: string, entityId: string, payload: { status: string }) =>
    apiClient.post<any>(`/api/v1/catalog/${entityType}/${entityId}/status`, payload),

  // Components CRUD
  getComponents: (params?: { category?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString();
    return apiClient.get<Component[]>(`/api/v1/components${queryString ? `?${queryString}` : ''}`);
  },
  getComponentsPaginated: (params?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.page_size) query.append('page_size', String(params.page_size));
    const queryString = query.toString();
    return apiClient.getPaginated<Component>(`/api/v1/components${queryString ? `?${queryString}` : ''}`);
  },
  getComponentById: (id: string) => apiClient.get<Component>(`/api/v1/components/${id}`),
  createComponent: (payload: any) =>
    apiClient.post<Component>('/api/v1/components', payload),
  updateComponent: (id: string, payload: any) =>
    apiClient.put<Component>(`/api/v1/components/${id}`, payload),
  deleteComponent: (id: string) =>
    apiClient.delete(`/api/v1/components/${id}`),
  publishComponent: (id: string) =>
    apiClient.post<Component>(`/api/v1/components/${id}/publish`),
  deprecateComponent: (id: string) =>
    apiClient.post<Component>(`/api/v1/components/${id}/deprecate`),

  // Modules CRUD
  getModules: (params?: { category?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString();
    return apiClient.get<Module[]>(`/api/v1/modules${queryString ? `?${queryString}` : ''}`);
  },
  getModulesPaginated: (params?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.page_size) query.append('page_size', String(params.page_size));
    const queryString = query.toString();
    return apiClient.getPaginated<Module>(`/api/v1/modules${queryString ? `?${queryString}` : ''}`);
  },
  getModuleById: (id: string) => apiClient.get<Module>(`/api/v1/modules/${id}`),
  createModule: (payload: any) =>
    apiClient.post<Module>('/api/v1/modules', payload),
  updateModule: (id: string, payload: any) =>
    apiClient.put<Module>(`/api/v1/modules/${id}`, payload),
  deleteModule: (id: string) =>
    apiClient.delete(`/api/v1/modules/${id}`),
  publishModule: (id: string) =>
    apiClient.post<Module>(`/api/v1/modules/${id}/publish`),
  deprecateModule: (id: string) =>
    apiClient.post<Module>(`/api/v1/modules/${id}/deprecate`),

  // Templates CRUD
  getTemplates: (params?: { category?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    const queryString = query.toString();
    return apiClient.get<Template[]>(`/api/v1/templates${queryString ? `?${queryString}` : ''}`);
  },
  getTemplatesPaginated: (params?: {
    category?: string;
    architecture_id?: string;
    status?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.architecture_id) query.append('architecture_id', params.architecture_id);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.page_size) query.append('page_size', String(params.page_size));
    const queryString = query.toString();
    return apiClient.getPaginated<Template>(`/api/v1/templates${queryString ? `?${queryString}` : ''}`);
  },
  getTemplateById: (id: string) => apiClient.get<Template>(`/api/v1/templates/${id}`),
  createTemplate: (payload: any) =>
    apiClient.post<Template>('/api/v1/templates', payload),
  updateTemplate: (id: string, payload: any) =>
    apiClient.put<Template>(`/api/v1/templates/${id}`, payload),
  deleteTemplate: (id: string) =>
    apiClient.delete(`/api/v1/templates/${id}`),

  // Architectures CRUD
  getArchitectures: () => apiClient.get<Architecture[]>('/api/v1/architectures'),
  getArchitecturesPaginated: (params?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.page_size) query.append('page_size', String(params.page_size));
    const queryString = query.toString();
    return apiClient.getPaginated<Architecture>(`/api/v1/architectures${queryString ? `?${queryString}` : ''}`);
  },
  getArchitectureById: (id: string) => apiClient.get<Architecture>(`/api/v1/architectures/${id}`),
  createArchitecture: (payload: any) =>
    apiClient.post<Architecture>('/api/v1/architectures', payload),
  updateArchitecture: (id: string, payload: any) =>
    apiClient.put<Architecture>(`/api/v1/architectures/${id}`, payload),
  deleteArchitecture: (id: string) =>
    apiClient.delete(`/api/v1/architectures/${id}`),

  // Rules CRUD
  getRules: (params?: { category?: string; severity?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.severity) query.append('severity', params.severity);
    const queryString = query.toString();
    return apiClient.get<Rule[]>(`/api/v1/rules${queryString ? `?${queryString}` : ''}`);
  },
  getRulesPaginated: (params?: {
    category?: string;
    priority?: string;
    severity?: string;
    status?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.severity) query.append('severity', params.severity);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.page_size) query.append('page_size', String(params.page_size));
    const queryString = query.toString();
    return apiClient.getPaginated<Rule>(`/api/v1/rules${queryString ? `?${queryString}` : ''}`);
  },
  getRuleById: (id: string) => apiClient.get<Rule>(`/api/v1/rules/${id}`),
  createRule: (payload: any) =>
    apiClient.post<Rule>('/api/v1/rules', payload),
  updateRule: (id: string, payload: any) =>
    apiClient.put<Rule>(`/api/v1/rules/${id}`, payload),
  deleteRule: (id: string) =>
    apiClient.delete(`/api/v1/rules/${id}`),

  // Specifications CRUD
  getSpecifications: (params?: { category?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    const queryString = query.toString();
    return apiClient.get<Specification[]>(`/api/v1/specifications${queryString ? `?${queryString}` : ''}`);
  },
  getSpecificationsPaginated: (params?: {
    category?: string;
    tag?: string;
    status?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.tag) query.append('tag', params.tag);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.page_size) query.append('page_size', String(params.page_size));
    const queryString = query.toString();
    return apiClient.getPaginated<Specification>(`/api/v1/specifications${queryString ? `?${queryString}` : ''}`);
  },
  getSpecificationById: (id: string) =>
    apiClient.get<Specification>(`/api/v1/specifications/${id}`),
  createSpecification: (payload: any) =>
    apiClient.post<Specification>('/api/v1/specifications', payload),
  updateSpecification: (id: string, payload: any) =>
    apiClient.put<Specification>(`/api/v1/specifications/${id}`, payload),
  deleteSpecification: (id: string) =>
    apiClient.delete(`/api/v1/specifications/${id}`),
};
