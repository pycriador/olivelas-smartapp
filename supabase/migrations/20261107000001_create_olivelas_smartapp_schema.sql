-- =============================================================================
-- Migration 001: Create Isolated Schema `olivelas_smartapp` & Core Platform Tables
-- Target: Supabase PostgreSQL
-- Isolation: All tables reside exclusively inside `olivelas_smartapp` schema
-- =============================================================================

CREATE SCHEMA IF NOT EXISTS olivelas_smartapp;
SET search_path TO olivelas_smartapp, public;

-- 1. Users Table (Starts empty; 1st registered user becomes Global Admin via trigger & service)
CREATE TABLE IF NOT EXISTS olivelas_smartapp.users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    first_name VARCHAR(64) NOT NULL DEFAULT '',
    last_name VARCHAR(64) NOT NULL DEFAULT '',
    username VARCHAR(64) NOT NULL DEFAULT '',
    email VARCHAR(128) NOT NULL UNIQUE,
    password_hash VARCHAR(256) NOT NULL DEFAULT '',
    avatar_url VARCHAR(256) NOT NULL DEFAULT '',
    role VARCHAR(32) NOT NULL DEFAULT 'Viewer',
    status VARCHAR(32) NOT NULL DEFAULT 'Active',
    primary_group_id VARCHAR(64),
    language VARCHAR(16) NOT NULL DEFAULT 'pt-BR',
    timezone_name VARCHAR(64) NOT NULL DEFAULT 'America/Sao_Paulo',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_users_username ON olivelas_smartapp.users (username);
CREATE INDEX IF NOT EXISTS ix_olivelas_users_email ON olivelas_smartapp.users (email);
CREATE INDEX IF NOT EXISTS ix_olivelas_users_status ON olivelas_smartapp.users (status);

-- 2. Components Catalog Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.components (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) NOT NULL DEFAULT '',
    category VARCHAR(64) NOT NULL DEFAULT 'UI',
    type VARCHAR(32) NOT NULL DEFAULT 'frontend',
    description TEXT NOT NULL DEFAULT '',
    status VARCHAR(32) NOT NULL DEFAULT 'Published',
    version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    owner VARCHAR(128) NOT NULL DEFAULT 'Olivelas Frontend Guild',
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    dependencies JSONB NOT NULL DEFAULT '[]'::jsonb,
    rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    templates JSONB NOT NULL DEFAULT '[]'::jsonb,
    props_contract JSONB NOT NULL DEFAULT '{}'::jsonb,
    preview_code TEXT NOT NULL DEFAULT '',
    documentation TEXT NOT NULL DEFAULT '',
    interface_spec TEXT NOT NULL DEFAULT '',
    example_usage TEXT NOT NULL DEFAULT '',
    versions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_components_name ON olivelas_smartapp.components (name);
CREATE INDEX IF NOT EXISTS ix_olivelas_components_slug ON olivelas_smartapp.components (slug);
CREATE INDEX IF NOT EXISTS ix_olivelas_components_category ON olivelas_smartapp.components (category);
CREATE INDEX IF NOT EXISTS ix_olivelas_components_status ON olivelas_smartapp.components (status);

-- 3. Application Templates Catalog Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.templates (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) NOT NULL DEFAULT '',
    category VARCHAR(64) NOT NULL DEFAULT 'Application',
    description TEXT NOT NULL DEFAULT '',
    status VARCHAR(32) NOT NULL DEFAULT 'Published',
    version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    architecture VARCHAR(64) NOT NULL DEFAULT 'Modular Monolith',
    architecture_id VARCHAR(64) NOT NULL DEFAULT 'arch-modular-monolith',
    owner VARCHAR(128) NOT NULL DEFAULT 'Olivelas Core Team',
    modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    components JSONB NOT NULL DEFAULT '[]'::jsonb,
    rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    composition_tree JSONB NOT NULL DEFAULT '{}'::jsonb,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    versions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_templates_name ON olivelas_smartapp.templates (name);
CREATE INDEX IF NOT EXISTS ix_olivelas_templates_slug ON olivelas_smartapp.templates (slug);
CREATE INDEX IF NOT EXISTS ix_olivelas_templates_status ON olivelas_smartapp.templates (status);

-- 4. Domain Modules Catalog Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.modules (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) NOT NULL DEFAULT '',
    category VARCHAR(64) NOT NULL DEFAULT 'Core Domain',
    description TEXT NOT NULL DEFAULT '',
    status VARCHAR(32) NOT NULL DEFAULT 'Published',
    version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    owner VARCHAR(128) NOT NULL DEFAULT 'Olivelas Platform Team',
    components JSONB NOT NULL DEFAULT '[]'::jsonb,
    apis JSONB NOT NULL DEFAULT '[]'::jsonb,
    dependencies JSONB NOT NULL DEFAULT '[]'::jsonb,
    rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    templates JSONB NOT NULL DEFAULT '[]'::jsonb,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    versions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_modules_name ON olivelas_smartapp.modules (name);
CREATE INDEX IF NOT EXISTS ix_olivelas_modules_slug ON olivelas_smartapp.modules (slug);
CREATE INDEX IF NOT EXISTS ix_olivelas_modules_status ON olivelas_smartapp.modules (status);

-- 5. Golden Rules Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.rules (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) NOT NULL DEFAULT '',
    category VARCHAR(64) NOT NULL DEFAULT 'Architecture',
    priority VARCHAR(32) NOT NULL DEFAULT 'REQUIRED',
    scope VARCHAR(64) NOT NULL DEFAULT 'Global',
    description TEXT NOT NULL DEFAULT '',
    rule_statement TEXT NOT NULL DEFAULT '',
    applies_to JSONB NOT NULL DEFAULT '[]'::jsonb,
    exceptions JSONB NOT NULL DEFAULT '[]'::jsonb,
    dependencies JSONB NOT NULL DEFAULT '[]'::jsonb,
    specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(32) NOT NULL DEFAULT 'Published',
    version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    bad_example TEXT,
    good_example TEXT,
    referenced_spec VARCHAR(128),
    versions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_rules_name ON olivelas_smartapp.rules (name);
CREATE INDEX IF NOT EXISTS ix_olivelas_rules_slug ON olivelas_smartapp.rules (slug);
CREATE INDEX IF NOT EXISTS ix_olivelas_rules_status ON olivelas_smartapp.rules (status);

-- 6. Canonical Architectures Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.architectures (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) NOT NULL DEFAULT '',
    category VARCHAR(64) NOT NULL DEFAULT 'Pattern',
    description TEXT NOT NULL DEFAULT '',
    version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    status VARCHAR(32) NOT NULL DEFAULT 'Published',
    characteristics JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_for JSONB NOT NULL DEFAULT '[]'::jsonb,
    restrictions JSONB NOT NULL DEFAULT '[]'::jsonb,
    layers JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    canonical_folder_structure JSONB NOT NULL DEFAULT '[]'::jsonb,
    folder_tree TEXT NOT NULL DEFAULT '',
    modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    components JSONB NOT NULL DEFAULT '[]'::jsonb,
    rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    versions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_architectures_name ON olivelas_smartapp.architectures (name);
CREATE INDEX IF NOT EXISTS ix_olivelas_architectures_slug ON olivelas_smartapp.architectures (slug);

-- 7. SDD Specifications Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.specifications (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    title VARCHAR(256) NOT NULL DEFAULT '',
    slug VARCHAR(128) NOT NULL DEFAULT '',
    category VARCHAR(64) NOT NULL DEFAULT 'Engineering Standard',
    version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    status VARCHAR(32) NOT NULL DEFAULT 'Published',
    description TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    related_components JSONB NOT NULL DEFAULT '[]'::jsonb,
    related_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    related_templates JSONB NOT NULL DEFAULT '[]'::jsonb,
    related_architectures JSONB NOT NULL DEFAULT '[]'::jsonb,
    related_modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    versions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_specifications_name ON olivelas_smartapp.specifications (name);
CREATE INDEX IF NOT EXISTS ix_olivelas_specifications_slug ON olivelas_smartapp.specifications (slug);

-- 8. Projects Table (Starts empty so user can register new projects)
CREATE TABLE IF NOT EXISTS olivelas_smartapp.projects (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    domain VARCHAR(64) NOT NULL DEFAULT 'Real Estate Core',
    status VARCHAR(32) NOT NULL DEFAULT 'Planning',
    architecture VARCHAR(64) NOT NULL DEFAULT 'Modular Monolith',
    architecture_id VARCHAR(64) NOT NULL DEFAULT 'arch-modular-monolith',
    template_id VARCHAR(64),
    version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    owner VARCHAR(128) NOT NULL DEFAULT 'Global Admin',
    blueprint_id VARCHAR(64),
    requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    components JSONB NOT NULL DEFAULT '[]'::jsonb,
    templates JSONB NOT NULL DEFAULT '[]'::jsonb,
    rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    versions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_projects_name ON olivelas_smartapp.projects (name);
CREATE INDEX IF NOT EXISTS ix_olivelas_projects_slug ON olivelas_smartapp.projects (slug);
CREATE INDEX IF NOT EXISTS ix_olivelas_projects_status ON olivelas_smartapp.projects (status);

-- 9. Blueprints Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.blueprints (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) NOT NULL DEFAULT '',
    project_id VARCHAR(64),
    architecture_id VARCHAR(64) NOT NULL DEFAULT 'arch-modular-monolith',
    architecture_name VARCHAR(128) NOT NULL DEFAULT 'Modular Monolith',
    description TEXT NOT NULL DEFAULT '',
    version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    status VARCHAR(32) NOT NULL DEFAULT 'Draft',
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    components JSONB NOT NULL DEFAULT '[]'::jsonb,
    templates JSONB NOT NULL DEFAULT '[]'::jsonb,
    integrations JSONB NOT NULL DEFAULT '[]'::jsonb,
    rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    dependencies JSONB NOT NULL DEFAULT '[]'::jsonb,
    folder_structure JSONB NOT NULL DEFAULT '{}'::jsonb,
    api_contracts JSONB NOT NULL DEFAULT '[]'::jsonb,
    validation JSONB NOT NULL DEFAULT '{}'::jsonb,
    raw_blueprint_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    versions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_blueprints_name ON olivelas_smartapp.blueprints (name);
CREATE INDEX IF NOT EXISTS ix_olivelas_blueprints_slug ON olivelas_smartapp.blueprints (slug);
CREATE INDEX IF NOT EXISTS ix_olivelas_blueprints_status ON olivelas_smartapp.blueprints (status);

-- 10. Audit Logs Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    action VARCHAR(64) NOT NULL,
    resource VARCHAR(64) NOT NULL DEFAULT '',
    resource_id VARCHAR(64) NOT NULL DEFAULT '',
    entity_type VARCHAR(64) NOT NULL DEFAULT '',
    entity_id VARCHAR(64) NOT NULL DEFAULT '',
    actor VARCHAR(128) NOT NULL DEFAULT 'System',
    user_email VARCHAR(128) NOT NULL DEFAULT 'system@olivelas.com.br',
    result VARCHAR(32) NOT NULL DEFAULT 'SUCCESS',
    metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_audit_logs_action ON olivelas_smartapp.audit_logs (action);
CREATE INDEX IF NOT EXISTS ix_olivelas_audit_logs_timestamp ON olivelas_smartapp.audit_logs (timestamp DESC);

-- 11. Version Snapshots Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.version_snapshots (
    id VARCHAR(64) PRIMARY KEY,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    version VARCHAR(32) NOT NULL,
    changelog TEXT NOT NULL DEFAULT '',
    snapshot_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by VARCHAR(128) NOT NULL DEFAULT 'System',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_version_snapshots_entity ON olivelas_smartapp.version_snapshots (entity_type, entity_id);

-- 12. System States Table (Platform Configurations & Personalizations)
CREATE TABLE IF NOT EXISTS olivelas_smartapp.system_states (
    key VARCHAR(64) PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 13. IAM Groups Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.groups (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    slug VARCHAR(128) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    color VARCHAR(32) NOT NULL DEFAULT '#FF774A',
    icon VARCHAR(64) NOT NULL DEFAULT 'TeamOutlined',
    status VARCHAR(32) NOT NULL DEFAULT 'Active',
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_groups_name ON olivelas_smartapp.groups (name);
CREATE INDEX IF NOT EXISTS ix_olivelas_groups_slug ON olivelas_smartapp.groups (slug);

-- 14. IAM Roles Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.iam_roles (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    slug VARCHAR(128) NOT NULL DEFAULT '',
    category VARCHAR(64) NOT NULL DEFAULT 'System',
    priority INTEGER NOT NULL DEFAULT 100,
    description TEXT NOT NULL DEFAULT '',
    status VARCHAR(32) NOT NULL DEFAULT 'Active',
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_iam_roles_name ON olivelas_smartapp.iam_roles (name);
CREATE INDEX IF NOT EXISTS ix_olivelas_iam_roles_slug ON olivelas_smartapp.iam_roles (slug);

-- 15. IAM Permissions Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.permissions (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(128) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL DEFAULT 'General',
    module VARCHAR(64) NOT NULL DEFAULT 'Core',
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_permissions_code ON olivelas_smartapp.permissions (code);
CREATE INDEX IF NOT EXISTS ix_olivelas_permissions_category ON olivelas_smartapp.permissions (category);
CREATE INDEX IF NOT EXISTS ix_olivelas_permissions_module ON olivelas_smartapp.permissions (module);

-- 16. IAM User Groups Mapping Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.user_groups (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    group_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_user_groups_user_id ON olivelas_smartapp.user_groups (user_id);
CREATE INDEX IF NOT EXISTS ix_olivelas_user_groups_group_id ON olivelas_smartapp.user_groups (group_id);

-- 17. IAM Group Roles Mapping Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.group_roles (
    id VARCHAR(64) PRIMARY KEY,
    group_id VARCHAR(64) NOT NULL,
    role_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_group_roles_group_id ON olivelas_smartapp.group_roles (group_id);
CREATE INDEX IF NOT EXISTS ix_olivelas_group_roles_role_id ON olivelas_smartapp.group_roles (role_id);

-- 18. IAM Role Permissions Mapping Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.role_permissions (
    id VARCHAR(64) PRIMARY KEY,
    role_id VARCHAR(64) NOT NULL,
    permission_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_role_permissions_role_id ON olivelas_smartapp.role_permissions (role_id);
CREATE INDEX IF NOT EXISTS ix_olivelas_role_permissions_perm_id ON olivelas_smartapp.role_permissions (permission_id);

-- 19. Active Sessions Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    ip_address VARCHAR(64) NOT NULL DEFAULT '127.0.0.1',
    user_agent VARCHAR(512) NOT NULL DEFAULT '',
    browser VARCHAR(64) NOT NULL DEFAULT 'Chrome',
    os_name VARCHAR(64) NOT NULL DEFAULT 'macOS',
    device VARCHAR(64) NOT NULL DEFAULT 'Desktop',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    token_jti VARCHAR(64) NOT NULL DEFAULT '',
    last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_sessions_user_id ON olivelas_smartapp.sessions (user_id);
CREATE INDEX IF NOT EXISTS ix_olivelas_sessions_token_jti ON olivelas_smartapp.sessions (token_jti);

-- 20. Invitations Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.invitations (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(128) NOT NULL,
    role_id VARCHAR(64) NOT NULL DEFAULT 'rol_viewer',
    group_id VARCHAR(64),
    invited_by_id VARCHAR(64) NOT NULL,
    token VARCHAR(128) NOT NULL UNIQUE,
    status VARCHAR(32) NOT NULL DEFAULT 'Pending',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ
);

-- 21. Shares Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.shares (
    id VARCHAR(64) PRIMARY KEY,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64) NOT NULL,
    grantor_id VARCHAR(64) NOT NULL,
    grantee_type VARCHAR(32) NOT NULL DEFAULT 'user',
    grantee_id VARCHAR(64) NOT NULL,
    permission_level VARCHAR(32) NOT NULL DEFAULT 'read',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. Token Blacklist Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.token_blacklist (
    id VARCHAR(64) PRIMARY KEY,
    token_jti VARCHAR(64) NOT NULL UNIQUE,
    user_id VARCHAR(64) NOT NULL,
    reason VARCHAR(128) NOT NULL DEFAULT 'logout',
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. Knowledge Documents Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.knowledge_documents (
    id VARCHAR(128) PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    category VARCHAR(64) NOT NULL,
    volume VARCHAR(128),
    file_path VARCHAR(512),
    summary TEXT NOT NULL DEFAULT '',
    key_points JSONB NOT NULL DEFAULT '[]'::jsonb,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    content TEXT NOT NULL DEFAULT '',
    author VARCHAR(128) NOT NULL DEFAULT 'Olivelas Engineering',
    version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    source_url VARCHAR(512),
    is_custom BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_olivelas_knowledge_docs_title ON olivelas_smartapp.knowledge_documents (title);
CREATE INDEX IF NOT EXISTS ix_olivelas_knowledge_docs_category ON olivelas_smartapp.knowledge_documents (category);

-- 24. Knowledge Document Shares Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.knowledge_doc_shares (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(128) NOT NULL,
    target_type VARCHAR(32) NOT NULL DEFAULT 'group',
    target_id VARCHAR(64) NOT NULL,
    target_name VARCHAR(128) NOT NULL DEFAULT '',
    role VARCHAR(32) NOT NULL DEFAULT 'viewer',
    created_by VARCHAR(128) NOT NULL DEFAULT 'system@olivelas.com.br',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 25. Knowledge Document Favorites Table
CREATE TABLE IF NOT EXISTS olivelas_smartapp.knowledge_doc_favorites (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    document_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
