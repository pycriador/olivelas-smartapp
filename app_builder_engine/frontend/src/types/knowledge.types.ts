/**
 * Knowledge & Documentation Hub Types
 */

export type KnowledgeCategory =
  | 'master_guide'
  | 'frontend_spec'
  | 'backend_spec'
  | 'design_system'
  | 'architecture_adr'
  | 'ai_skills_prompts'
  | 'security_iam'
  | 'devops_sre'
  | 'external_confluence'
  | 'external_github'
  | 'api_integrations';

export interface KnowledgeDocShareItem {
  id: string;
  document_id: string;
  target_type: 'user' | 'group';
  target_id: string;
  target_name: string;
  role: 'viewer' | 'editor';
  created_at: string;
  created_by: string;
}

export interface KnowledgeDocShareCreate {
  target_type: 'user' | 'group';
  target_id: string;
  target_name: string;
  role: 'viewer' | 'editor';
}

export interface KnowledgeDocumentSummary {
  id: string;
  title: string;
  category: KnowledgeCategory;
  volume?: string | null;
  file_path?: string | null;
  summary: string;
  key_points: string[];
  tags: string[];
  author?: string;
  version?: string;
  updated_at?: string;
  is_custom: boolean;
  source_url?: string | null;
  shares_count: number;
}

export interface KnowledgeDocumentDetail extends KnowledgeDocumentSummary {
  content: string;
  shares: KnowledgeDocShareItem[];
}

export interface KnowledgeDocumentCreate {
  title: string;
  category: KnowledgeCategory;
  volume?: string;
  summary: string;
  content: string;
  key_points?: string[];
  tags?: string[];
  author?: string;
  version?: string;
  source_url?: string;
}

export interface KnowledgeDocumentUpdate {
  title?: string;
  category?: KnowledgeCategory;
  volume?: string;
  summary?: string;
  content?: string;
  key_points?: string[];
  tags?: string[];
  version?: string;
}

export interface ConfluenceImportRequest {
  space_key: string;
  page_id_or_title?: string;
  base_url: string;
  api_token?: string;
  username?: string;
  target_category: KnowledgeCategory;
}

export interface GitHubImportRequest {
  repo_url: string;
  branch: string;
  path_filter?: string;
  github_token?: string;
  target_category: KnowledgeCategory;
}

export interface RawDocImportRequest {
  title: string;
  category: KnowledgeCategory;
  source_url?: string;
  content: string;
  tags?: string[];
}

export interface KnowledgeSearchResult {
  document_id: string;
  title: string;
  category: KnowledgeCategory;
  volume?: string | null;
  matched_snippet: string;
  relevance_score: number;
}

// --- API Client Types ---

export interface ApiClientSource {
  id: string;
  name: string;
  base_url: string;
  auth_type: 'none' | 'bearer' | 'api_key' | 'basic';
  auth_config: Record<string, any>;
  default_headers: Record<string, string>;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiSavedRequest {
  id: string;
  source_id?: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  params: Array<{ key: string; value: string; enabled: boolean; description?: string }>;
  headers: Array<{ key: string; value: string; enabled: boolean; description?: string }>;
  auth_type: 'inherit' | 'none' | 'bearer' | 'api_key' | 'basic';
  auth_config: Record<string, any>;
  body_type: 'none' | 'json' | 'raw' | 'form_data';
  body_content?: string;
  description?: string;
  folder?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiExecutionRequest {
  method: string;
  url: string;
  params: Record<string, string>;
  headers: Record<string, string>;
  auth_type: string;
  auth_token?: string;
  auth_username?: string;
  auth_password?: string;
  body_type: string;
  body?: string;
}

export interface ApiExecutionResponse {
  status_code: number;
  status_text: string;
  latency_ms: number;
  response_size_bytes: number;
  headers: Record<string, string>;
  body: string;
  is_json: boolean;
}
