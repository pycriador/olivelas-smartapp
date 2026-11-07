export interface UserBasicInfo {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  avatar_url: string;
  status: string;
  must_change_password: boolean;
  permissions: string[];
  groups: string[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserBasicInfo;
}

export interface IamUser {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Locked';
  primary_group_id?: string | null;
  language: string;
  timezone_name: string;
  is_active: boolean;
  must_change_password: boolean;
  avatar_url: string;
  failed_login_attempts: number;
  locked_until?: string | null;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
  groups: string[];
  permissions: string[];
}

export interface IamGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  status: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  member_count: number;
  role_count: number;
  roles: string[];
}

export interface IamRole {
  id: string;
  name: string;
  slug: string;
  category: string;
  priority: number;
  description: string;
  status: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  permission_count: number;
  permissions: string[];
}

export interface IamPermission {
  id: string;
  code: string;
  name: string;
  category: string;
  module: string;
  description: string;
  created_at: string;
}

export interface PermissionMatrixItem {
  permission_id: string;
  code: string;
  name: string;
  module: string;
  category: string;
  granted_roles: string[];
  granted_groups: string[];
}

export interface IamSession {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  ip_address: string;
  user_agent: string;
  browser: string;
  os_name: string;
  device: string;
  is_active: boolean;
  last_activity: string;
  expires_at: string;
  created_at: string;
}

export interface IamInvitation {
  id: string;
  email: string;
  role_id: string;
  role_name: string;
  group_id?: string | null;
  group_name: string;
  invited_by_id: string;
  invited_by_name: string;
  token: string;
  status: 'Pending' | 'Accepted' | 'Cancelled' | 'Expired';
  expires_at: string;
  created_at: string;
  accepted_at?: string | null;
}

export interface IamShare {
  id: string;
  resource_type: string;
  resource_id: string;
  grantor_id: string;
  grantor_name: string;
  grantee_type: 'user' | 'group';
  grantee_id: string;
  grantee_name: string;
  permission_level: 'read' | 'comment' | 'edit' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface IamDashboardStats {
  total_users: number;
  active_users: number;
  total_groups: number;
  total_roles: number;
  total_permissions: number;
  active_sessions: number;
  pending_invitations: number;
  total_shares: number;
  recent_logs: Array<{
    id: string;
    action: string;
    actor: string;
    resource: string;
    result: string;
    timestamp: string;
  }>;
}
