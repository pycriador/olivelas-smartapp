export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateComponentPayload {
  name: string;
  category: string;
  type?: string;
  description: string;
  framework?: string;
  dependencies?: string[];
  rules?: string[];
  specs?: string[];
  props_contract?: Record<string, any>;
  preview_code?: string;
  tags?: string[];
}

export interface CreateModulePayload {
  name: string;
  category: string;
  description: string;
  components?: string[];
  dependencies?: string[];
  rules?: string[];
  specs?: string[];
}

export interface CreateRulePayload {
  id?: string;
  name: string;
  category: string;
  severity: 'MANDATORY' | 'RECOMMENDED' | 'OPTIONAL';
  description: string;
  rule_statement: string;
  rationale: string;
  good_example: string;
  bad_example: string;
  applies_to?: string[];
}

export interface CreateProjectPayload {
  name: string;
  description: string;
  domain: string;
  architecture_id: string;
  template_id?: string;
  modules?: string[];
  components?: string[];
  tags?: string[];
}

export interface BlueprintBuildPayload {
  name: string;
  description: string;
  architecture_id: string;
  module_ids: string[];
  component_ids?: string[];
  template_ids?: string[];
  project_id?: string;
}

export interface AIComposeBlueprintPayload {
  application: {
    name: string;
    description?: string;
  };
  requirements: string[];
  provider?: string;
  model?: string;
  temperature?: number;
  system_instruction?: string;
  generate_ai_rationale?: boolean;
}

export interface AIComposeBlueprintResponse {
  type: string;
  blueprint_id: string;
  application_name: string;
  architecture: string;
  matched_features: string[];
  identified_modules: string[];
  identified_components: string[];
  identified_templates: string[];
  identified_rules: string[];
  identified_specifications: string[];
  identified_dependencies: string[];
  folder_structure: string;
  api_contracts: Array<{
    path: string;
    method: string;
    summary: string;
    status_code: number;
  }>;
  raw_blueprint: Record<string, any>;
  ai_provider?: string;
  ai_model?: string;
  ai_reasoning?: string;
  ai_latency_ms?: number;
  ai_tokens_used?: number;
}
