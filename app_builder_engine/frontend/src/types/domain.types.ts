export type EntityLifecycleStatus = 'Draft' | 'Published' | 'Deprecated' | 'Archived';
export type BlueprintStatus = 'Draft' | 'Validating' | 'Ready' | 'Published' | 'Archived';
export type ValidationSeverity = 'CRITICAL' | 'ERROR' | 'WARNING' | 'INFO';
export type RoleName = 'Global Admin' | 'Admin' | 'Editor' | 'Viewer';

export interface VersionSnapshot {
  version: string;
  changelog: string;
  created_at: string;
  created_by: string;
  snapshot_data?: Record<string, any>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  is_active: boolean;
  created_at?: string;
}

export interface RoleDefinition {
  name: string;
  description: string;
  permissions: string[];
}

export interface RecommendedAction {
  action_type: string;
  label: string;
  description?: string;
  payload?: Record<string, any>;
}

export interface BlueprintValidationDiagnostic {
  code: string;
  severity: ValidationSeverity;
  category: string;
  message: string;
  resource_id?: string | null;
  resource_type?: string | null;
  recommended_action?: RecommendedAction | null;
}

export interface BlueprintValidationResult {
  status: 'ready' | 'error' | 'warning';
  can_publish: boolean;
  diagnostics: BlueprintValidationDiagnostic[];
  critical_count: number;
  error_count: number;
  warning_count: number;
  info_count: number;
}

export interface EngineeringHealthMetrics {
  components_published: number;
  components_deprecated: number;
  blueprints_ready: number;
  blueprints_validation_errors: number;
  missing_dependencies_count: number;
  critical_rule_violations_count: number;
  specifications_unversioned_count: number;
  total_projects: number;
  total_blueprints: number;
  total_components: number;
  total_modules: number;
  total_templates: number;
  total_rules: number;
  total_architectures: number;
  total_specifications: number;
}

export interface Component {
  id: string;
  name: string;
  slug?: string;
  category: string;
  type?: string;
  description: string;
  status: EntityLifecycleStatus;
  version: string;
  owner?: string;
  tags: string[];
  dependencies: string[];
  rules: string[];
  specifications?: string[];
  specs?: string[];
  modules?: string[];
  templates?: string[];
  props_contract?: Record<string, any>;
  preview_code?: string;
  documentation?: string;
  interface_spec?: string;
  example_usage?: string;
  versions?: VersionSnapshot[];
  created_at?: string;
  updated_at?: string;
}

export interface Module {
  id: string;
  name: string;
  slug?: string;
  category?: string;
  description: string;
  status: EntityLifecycleStatus;
  version: string;
  owner?: string;
  components: string[];
  apis?: string[];
  dependencies: string[];
  rules: string[];
  specifications: string[];
  specs?: string[];
  templates?: string[];
  tags?: string[];
  versions?: VersionSnapshot[];
  created_at?: string;
  updated_at?: string;
}

export interface Template {
  id: string;
  name: string;
  slug?: string;
  category: string;
  description: string;
  status: EntityLifecycleStatus;
  version: string;
  architecture: string;
  architecture_id?: string;
  owner?: string;
  modules: string[];
  components: string[];
  rules: string[];
  specifications?: string[];
  composition_tree?: Record<string, any>;
  tags?: string[];
  versions?: VersionSnapshot[];
  created_at?: string;
  updated_at?: string;
}

export interface Rule {
  id: string;
  name: string;
  slug?: string;
  category: string;
  priority?: 'Required' | 'Recommended' | 'Optional';
  severity?: 'MANDATORY' | 'RECOMMENDED' | 'OPTIONAL';
  scope?: string;
  description: string;
  rule_statement?: string;
  rationale?: string;
  good_example?: string;
  bad_example?: string;
  applies_to: string[];
  exceptions?: string[];
  dependencies?: string[];
  specifications?: string[];
  status?: EntityLifecycleStatus;
  version?: string;
  referenced_spec?: string;
  versions?: VersionSnapshot[];
  created_at?: string;
  updated_at?: string;
}

export interface Specification {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
  category: string;
  version: string;
  status?: EntityLifecycleStatus;
  description?: string;
  summary?: string;
  content: string;
  tags: string[];
  related_components?: string[];
  related_rules?: string[];
  related_templates?: string[];
  related_architectures?: string[];
  related_modules?: string[];
  versions?: VersionSnapshot[];
  created_at?: string;
  updated_at?: string;
}

export interface Architecture {
  id: string;
  name: string;
  slug?: string;
  category: string;
  description: string;
  version?: string;
  characteristics?: string[];
  recommended_for?: string[];
  restrictions?: string[];
  layers: string[];
  recommended_modules?: string[];
  canonical_folder_structure?: Record<string, any>;
  folder_tree?: string;
  modules?: string[];
  components?: string[];
  rules?: string[];
  specifications?: string[];
  status?: EntityLifecycleStatus;
  versions?: VersionSnapshot[];
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  slug?: string;
  description: string;
  domain: string;
  status: 'Draft' | 'Planning' | 'Ready' | 'In Development' | 'Active' | 'Archived';
  architecture: string;
  architecture_id?: string;
  template_id?: string;
  version?: string;
  owner?: string;
  blueprint_id?: string | null;
  requirements?: string[];
  modules: string[];
  components: string[];
  templates?: string[];
  rules?: string[];
  specifications?: string[];
  tags: string[];
  versions?: VersionSnapshot[];
  created_at: string;
  updated_at: string;
}

export interface Blueprint {
  id: string;
  name: string;
  slug?: string;
  project_id?: string | null;
  architecture_id: string;
  architecture_name?: string;
  description: string;
  version: string;
  status?: BlueprintStatus;
  features?: string[];
  modules: string[];
  components: string[];
  templates?: string[];
  integrations?: string[];
  rules: string[];
  specifications?: string[];
  dependencies?: string[];
  folder_structure?: Record<string, any>;
  api_contracts?: Array<Record<string, any>>;
  validation?: BlueprintValidationResult | null;
  raw_blueprint_json?: Record<string, any>;
  versions?: VersionSnapshot[];
  created_at: string;
  updated_at?: string;
}

export interface Entity360Response {
  id?: string;
  type?: string;
  entity_type?: string;
  entity_id?: string;
  name?: string;
  slug?: string;
  description?: string;
  version?: string;
  status?: string;
  category?: string;
  tags?: string[];
  what_is_it: {
    id: string;
    name: string;
    category: string;
    status: string;
    version: string;
    tags: string[];
  };
  what_is_it_for: {
    description: string;
    characteristics?: string[];
    contract?: Record<string, any>;
    preview_code?: string;
  };
  dependencies: {
    internal_dependencies: string[];
    package_dependencies: string[];
  };
  where_used: {
    modules: Array<{ id: string; name: string }>;
    templates: Array<{ id: string; name: string }>;
    blueprints: Array<{ id: string; name: string }>;
    projects: Array<{ id: string; name: string }>;
  };
  associated_rules: Array<{
    id: string;
    name: string;
    severity?: string;
    priority?: string;
    description: string;
    good_example?: string;
    bad_example?: string;
  }>;
  associated_specs: Array<{
    id: string;
    title?: string;
    name?: string;
    summary?: string;
    description?: string;
  }>;
  version_lifecycle: {
    active_version: string;
    status: string;
    allowed_actions: string[];
    history?: Array<{ version: string; status: string; date: string }>;
  };
  versions?: VersionSnapshot[];
}

export interface DashboardMetrics {
  components_count: number;
  modules_count: number;
  templates_count: number;
  rules_count: number;
  architectures_count: number;
  specifications_count: number;
  projects_count: number;
  blueprints_count: number;
  audit_events_count?: number;
}

export interface AuditLog {
  id: string;
  action: string;
  resource?: string;
  resource_id?: string;
  entity_type?: string;
  entity_id?: string;
  actor?: string;
  user_email?: string;
  timestamp: string;
  result?: string;
  metadata?: Record<string, any>;
  details?: Record<string, any>;
}
