export interface CategoryItem {
  id: string;
  name: string;
  slug?: string;
  type: string;
  description: string;
  color: string;
  count: number;
  items_count?: number;
  is_system: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryCreateInput {
  name: string;
  type: string;
  description?: string;
  color?: string;
}

export interface CategoryUpdateInput {
  name: string;
  description?: string;
  color?: string;
  old_name?: string;
}

export interface CategoryRbacSettings {
  roles_can_manage: string[];
  roles_can_create: string[];
  roles_can_delete: string[];
}

export interface SystemSettingsSummary {
  default_versioning_policy: string;
  auto_audit_logging: boolean;
  golden_rules_mandate: boolean;
  rbac_settings: CategoryRbacSettings;
  total_categories: number;
  total_custom_categories: number;
}
