export interface AiModelOption {
  id: string;
  name: string;
  provider: string;
  description: string;
  context_window: number;
  recommended: boolean;
  is_multimodal: boolean;
}

export interface AiProviderConfigItem {
  id: string;
  name: string;
  provider_type?: string;
  enabled: boolean;
  is_custom?: boolean;
  api_key: string;
  base_url?: string;
  default_model: string;
  available_models: AiModelOption[];
  temperature: number;
  max_output_tokens: number;
  top_p: number;
  top_k?: number;
  system_instruction?: string;
  organization_id?: string;
  project_id?: string;
  anthropic_version?: string;
  azure_deployment?: string;
  api_version?: string;
  headers?: Record<string, string>;
  is_default: boolean;
  status: 'configured' | 'unconfigured' | 'connected' | 'error';
  last_tested_at?: string;
  last_error?: string;
}

export interface AiCustomProviderCreateRequest {
  name: string;
  base_url: string;
  api_key?: string;
  provider_type?: string;
  default_model: string;
  available_models?: AiModelOption[];
  temperature?: number;
  max_output_tokens?: number;
  headers?: Record<string, string>;
  system_instruction?: string;
  enabled?: boolean;
}

export interface AiCustomProviderUpdateRequest {
  name?: string;
  base_url?: string;
  api_key?: string;
  default_model?: string;
  available_models?: AiModelOption[];
  temperature?: number;
  max_output_tokens?: number;
  headers?: Record<string, string>;
  system_instruction?: string;
  enabled?: boolean;
}

export interface MultiProviderSettings {
  default_provider: string;
  default_model: string;
  providers: AiProviderConfigItem[];
  fallback_provider?: string;
  enable_stream: boolean;
  log_prompts: boolean;
}

export interface AiProviderUpdateRequest {
  default_provider?: string;
  default_model?: string;
  providers: AiProviderConfigItem[];
  fallback_provider?: string;
  enable_stream?: boolean;
  log_prompts?: boolean;
}

export interface AiTestConnectionRequest {
  provider_id: string;
  api_key?: string;
  model?: string;
  base_url?: string;
}

export interface AiTestConnectionResponse {
  success: boolean;
  provider_id: string;
  model: string;
  latency_ms: number;
  message: string;
  raw_response?: string;
}

// AI Gateway Types
export interface AiGatewayPolicy {
  primary_provider: string;
  primary_model: string;
  fallback_provider: string;
  fallback_model: string;
  enable_fallback: boolean;
  enable_semantic_cache: boolean;
  enable_pii_sanitization: boolean;
  enable_audit_logging: boolean;
  rate_limit_per_minute: number;
  max_context_tokens: number;
  timeout_seconds: number;
}

export interface AiGatewayMetrics {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  cached_requests: number;
  avg_latency_ms: number;
  total_prompt_tokens: number;
  total_completion_tokens: number;
  active_provider: string;
  active_model: string;
  uptime_percentage: number;
}

export interface AiGatewayExecutionLog {
  id: string;
  prompt_preview: string;
  full_prompt?: string;
  system_prompt?: string;
  response_preview: string;
  full_response?: string;
  provider: string;
  model: string;
  latency_ms: number;
  tokens_used: number;
  status: 'SUCCESS' | 'ERROR' | 'CACHED';
  actor: string;
  timestamp: string;
}

export interface AiGatewayExecuteRequest {
  prompt: string;
  system_prompt?: string;
  temperature?: number;
  max_tokens?: number;
  override_provider?: string;
  override_model?: string;
}

export interface AiGatewayExecuteResponse {
  response: string;
  provider: string;
  model: string;
  latency_ms: number;
  prompt_tokens: number;
  completion_tokens: number;
  cached: boolean;
  timestamp: string;
}

// AI Agents Types
export interface AiAgentItem {
  id: string;
  name: string;
  slug: string;
  role: string;
  domain: string;
  description: string;
  avatar_icon: string;
  color: string;
  provider?: string;
  model: string;
  temperature: number;
  system_instruction: string;
  capabilities: string[];
  is_system: boolean;
  status: 'Active' | 'Disabled';
  usage_count: number;
  last_executed_at?: string;
}

export interface AiAgentCreateRequest {
  name: string;
  role: string;
  domain: string;
  description: string;
  avatar_icon?: string;
  color?: string;
  provider?: string;
  model?: string;
  temperature?: number;
  system_instruction: string;
  capabilities: string[];
}

export interface AiAgentUpdateRequest {
  name?: string;
  role?: string;
  domain?: string;
  description?: string;
  avatar_icon?: string;
  color?: string;
  provider?: string;
  model?: string;
  temperature?: number;
  system_instruction?: string;
  capabilities?: string[];
  status?: 'Active' | 'Disabled';
}

export interface AiAgentExecuteRequest {
  agent_id: string;
  input_text: string;
  context_type?: 'blueprint' | 'code' | 'spec' | 'freeform';
  context_id?: string;
  temperature_override?: number;
}

export interface AiAgentExecuteResponse {
  agent_id: string;
  agent_name: string;
  output_text: string;
  reasoning_summary: string;
  latency_ms: number;
  tokens_used: number;
  model_used: string;
  timestamp: string;
}

