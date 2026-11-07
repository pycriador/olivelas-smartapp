"""
Complete Domain Entities and Value Objects for App Builder Engine v1
Follows SemVer, Audit, RBAC, Clean Domain standards and Blueprint Validation Engine
"""
from __future__ import annotations
import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Generic, TypeVar
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------
class RoleName(str, Enum):
    GLOBAL_ADMIN = "Global Admin"
    ADMIN = "Admin"
    EDITOR = "Editor"
    VIEWER = "Viewer"


class ProjectStatus(str, Enum):
    DRAFT = "Draft"
    PLANNING = "Planning"
    READY = "Ready"
    ACTIVE = "Active"
    ARCHIVED = "Archived"


class EntityLifecycleStatus(str, Enum):
    DRAFT = "Draft"
    PUBLISHED = "Published"
    DEPRECATED = "Deprecated"
    ARCHIVED = "Archived"


class BlueprintStatus(str, Enum):
    DRAFT = "Draft"
    VALIDATING = "Validating"
    READY = "Ready"
    PUBLISHED = "Published"
    ARCHIVED = "Archived"


class ValidationSeverity(str, Enum):
    CRITICAL = "CRITICAL"
    ERROR = "ERROR"
    WARNING = "WARNING"
    INFO = "INFO"


class RuleCategory(str, Enum):
    ARCHITECTURE = "Architecture"
    SECURITY = "Security"
    FRONTEND = "Frontend"
    FRONTEND_UI = "Frontend & UI"
    DESIGN_SYSTEM = "Design System"
    LAYOUT_NAVIGATION = "Layout & Navigation"
    BACKEND = "Backend"
    BACKEND_ENGINEERING = "Backend Engineering"
    DATABASE = "Database"
    API = "API"
    API_SECURITY = "API & Security"
    AI = "AI"
    UX = "UX"
    PERFORMANCE = "Performance"
    STATE_MANAGEMENT = "State Management"
    OBSERVABILITY = "Observability"
    COMPLIANCE = "Compliance"
    QUALITY_TESTING = "Quality & Testing"
    DEVELOPMENT = "Development"


class RulePriority(str, Enum):
    REQUIRED = "Required"
    REQUIRED_UPPER = "REQUIRED"
    RECOMMENDED = "Recommended"
    RECOMMENDED_UPPER = "RECOMMENDED"
    OPTIONAL = "Optional"
    OPTIONAL_UPPER = "OPTIONAL"
    MANDATORY = "MANDATORY"
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class AuditAction(str, Enum):
    LOGIN = "LOGIN"
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
    PUBLISH = "PUBLISH"
    DEPRECATE = "DEPRECATE"
    ARCHIVE = "ARCHIVE"
    RESTORE = "RESTORE"
    VALIDATE = "VALIDATE"
    PERMISSION_CHANGE = "PERMISSION_CHANGE"
    # Legacy & Specific aliases
    PROJECT_CREATED = "PROJECT_CREATED"
    PROJECT_UPDATED = "PROJECT_UPDATED"
    PROJECT_ARCHIVED = "PROJECT_ARCHIVED"
    PROJECT_RESTORED = "PROJECT_RESTORED"
    PROJECT_DUPLICATED = "PROJECT_DUPLICATED"
    PROJECT_DELETED = "PROJECT_DELETED"
    VERSION_CREATED = "VERSION_CREATED"
    BLUEPRINT_CREATED = "BLUEPRINT_CREATED"
    BLUEPRINT_UPDATED = "BLUEPRINT_UPDATED"
    BLUEPRINT_DELETED = "BLUEPRINT_DELETED"
    COMPONENT_CREATED = "COMPONENT_CREATED"
    COMPONENT_UPDATED = "COMPONENT_UPDATED"
    COMPONENT_PUBLISHED = "COMPONENT_PUBLISHED"
    COMPONENT_DEPRECATED = "COMPONENT_DEPRECATED"
    COMPONENT_DELETED = "COMPONENT_DELETED"
    TEMPLATE_CREATED = "TEMPLATE_CREATED"
    TEMPLATE_UPDATED = "TEMPLATE_UPDATED"
    TEMPLATE_DELETED = "TEMPLATE_DELETED"
    MODULE_CREATED = "MODULE_CREATED"
    MODULE_UPDATED = "MODULE_UPDATED"
    MODULE_DELETED = "MODULE_DELETED"
    RULE_CREATED = "RULE_CREATED"
    RULE_UPDATED = "RULE_UPDATED"
    RULE_DELETED = "RULE_DELETED"
    SPECIFICATION_CREATED = "SPECIFICATION_CREATED"
    SPECIFICATION_UPDATED = "SPECIFICATION_UPDATED"
    SPECIFICATION_DELETED = "SPECIFICATION_DELETED"
    ARCHITECTURE_CREATED = "ARCHITECTURE_CREATED"
    ARCHITECTURE_UPDATED = "ARCHITECTURE_UPDATED"
    ARCHITECTURE_DELETED = "ARCHITECTURE_DELETED"
    API_ACCESS = "API_ACCESS"
    AI_BLUEPRINT_COMPOSED = "AI_BLUEPRINT_COMPOSED"


# ---------------------------------------------------------------------------
# Versioning & Audit
# ---------------------------------------------------------------------------
class VersionSnapshot(BaseModel):
    version: str
    changelog: str = "Alteração de versão"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: str = "willian.jesus@loft.com.br"
    snapshot_data: dict[str, Any] = Field(default_factory=dict)


class User(BaseModel):
    id: str = Field(default_factory=lambda: f"usr_{uuid.uuid4().hex[:8]}")
    name: str
    email: str
    role: RoleName = RoleName.GLOBAL_ADMIN
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AuditLog(BaseModel):
    id: str = Field(default_factory=lambda: f"aud_{uuid.uuid4().hex[:10]}")
    actor: str = "willian.jesus@loft.com.br"
    action: AuditAction | str
    resource: str
    resource_id: str
    entity_type: str = ""
    entity_id: str = ""
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    result: str = "SUCCESS"  # SUCCESS, FAILED
    metadata: dict[str, Any] = Field(default_factory=dict)
    details: dict[str, Any] = Field(default_factory=dict)

    # Compatibility properties
    @property
    def user_email(self) -> str:
        return self.actor

    @property
    def metadata_json(self) -> dict[str, Any]:
        return self.metadata


# ---------------------------------------------------------------------------
# Validation Diagnostics Models
# ---------------------------------------------------------------------------
class RecommendedAction(BaseModel):
    action_type: str  # ADD_DEPENDENCY, ATTACH_RULE, SELECT_SPEC, UPDATE_VERSION
    label: str
    description: str = ""
    payload: dict[str, Any] = Field(default_factory=dict)


class BlueprintValidationDiagnostic(BaseModel):
    code: str
    severity: ValidationSeverity
    category: str  # DEPENDENCY, RULE, ARCHITECTURE, VERSION, SPECIFICATION
    message: str
    resource_id: str | None = None
    resource_type: str | None = None
    recommended_action: RecommendedAction | None = None


class BlueprintValidationResult(BaseModel):
    status: str = "ready"  # ready, error, warning
    can_publish: bool = True
    valid: bool = True
    is_valid: bool = True
    validation_scope: str = Field(
        default="declarative_manifest",
        description="Escopo da validação: 'declarative_manifest' (declaração consistente no manifesto) ou 'code_and_manifest_audited' (quando dependencies/source_files do projeto são inspecionados).",
    )
    conformance_mode: str = Field(
        default="declarative_manifest",
        description="Modo de verificação de conformidade ('declarative_manifest' vs 'code_audited').",
    )
    ui_library: str | None = Field(
        default=None,
        description="Biblioteca/Design System de UI declarada na validação (ex: 'copan', 'antd', 'tailwind', 'mui', ou null quando não declarada).",
    )
    status_meaning: str = Field(
        default="Declaração consistente com o catálogo (manifesto declarativo validado; não atesta auditoria estática do código-fonte salvo envio de source_files/dependencies).",
        description="Explicação semântica do campo status ('ready' = declaração consistente no manifesto ou código auditado quando artefatos são enviados).",
    )
    diagnostics: list[BlueprintValidationDiagnostic] = Field(default_factory=list)
    errors: list[BlueprintValidationDiagnostic] = Field(default_factory=list)
    warnings: list[BlueprintValidationDiagnostic] = Field(default_factory=list)
    critical_count: int = 0
    error_count: int = 0
    warning_count: int = 0
    info_count: int = 0


# ---------------------------------------------------------------------------
# Core Entities
# ---------------------------------------------------------------------------
class Component(BaseModel):
    id: str
    name: str
    slug: str = ""
    description: str
    category: str = "UI Foundation"
    type: str = "Frontend"  # Frontend, Backend, Fullstack, Service
    version: str = "1.0.0"
    status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED
    owner: str = "willian.jesus@loft.com.br"
    tags: list[str] = Field(default_factory=list)
    dependencies: list[str] = Field(default_factory=list)
    rules: list[str] = Field(default_factory=list)
    templates: list[str] = Field(default_factory=list)
    modules: list[str] = Field(default_factory=list)
    specifications: list[str] = Field(default_factory=list)
    props_contract: dict[str, Any] = Field(default_factory=dict)
    preview_code: str = ""
    documentation: str = ""
    interface_spec: str = ""
    example_usage: str = ""
    versions: list[VersionSnapshot] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Template(BaseModel):
    id: str
    name: str
    slug: str = ""
    description: str
    version: str = "1.0.0"
    category: str = "Application"
    status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED
    owner: str = "willian.jesus@loft.com.br"
    components: list[str] = Field(default_factory=list)
    modules: list[str] = Field(default_factory=list)
    rules: list[str] = Field(default_factory=list)
    specifications: list[str] = Field(default_factory=list)
    architecture: str = "Modular Monolith"
    architecture_id: str = "arch_loft_standard_fullstack"
    composition_tree: dict[str, Any] = Field(default_factory=dict)
    tags: list[str] = Field(default_factory=list)
    versions: list[VersionSnapshot] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Module(BaseModel):
    id: str
    name: str
    slug: str = ""
    description: str
    version: str = "1.0.0"
    category: str = "Core Domain"
    status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED
    owner: str = "willian.jesus@loft.com.br"
    components: list[str] = Field(default_factory=list)
    apis: list[str] = Field(default_factory=list)
    rules: list[str] = Field(default_factory=list)
    dependencies: list[str] = Field(default_factory=list)
    specifications: list[str] = Field(default_factory=list)
    templates: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    versions: list[VersionSnapshot] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Rule(BaseModel):
    id: str
    name: str
    slug: str = ""
    description: str
    rule_statement: str = ""
    category: RuleCategory = RuleCategory.ARCHITECTURE
    priority: RulePriority = RulePriority.REQUIRED
    scope: str = "Global"
    applies_to: list[str] = Field(default_factory=lambda: ["REST API", "Frontend", "Backend"])
    exceptions: list[str] = Field(default_factory=list)
    dependencies: list[str] = Field(default_factory=list)
    specifications: list[str] = Field(default_factory=list)
    status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED
    version: str = "1.0.0"
    bad_example: str | None = None
    good_example: str | None = None
    examples: Any = None
    json_schema: dict[str, Any] | None = None
    error_codes_table: list[dict[str, Any]] | None = None
    referenced_spec: str | None = None
    versions: list[VersionSnapshot] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Architecture(BaseModel):
    id: str
    name: str
    slug: str = ""
    category: str = "Pattern"
    description: str
    database: str = "PostgreSQL 16 (SQLAlchemy 2.0 + Alembic / AIOps Opsbase)"
    version: str = "1.0.0"
    characteristics: list[str] = Field(default_factory=list)
    recommended_for: list[str] = Field(default_factory=list)
    restrictions: list[str] = Field(default_factory=list)
    layers: list[str] = Field(default_factory=lambda: ["Presentation", "API", "Services", "Domain", "Database"])
    canonical_folder_structure: Any = Field(default_factory=dict)
    folder_tree: str = ""
    modules: list[str] = Field(default_factory=list)
    components: list[str] = Field(default_factory=list)
    rules: list[str] = Field(default_factory=list)
    specifications: list[str] = Field(default_factory=list)
    status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED
    versions: list[VersionSnapshot] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Specification(BaseModel):
    id: str
    name: str
    title: str = ""
    summary: str = ""
    slug: str = ""
    description: str = ""
    category: str = "Backend Specification"
    version: str = "1.0.0"
    status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED
    content: str = ""
    tags: list[str] = Field(default_factory=list)
    related_components: list[str] = Field(default_factory=list)
    related_rules: list[str] = Field(default_factory=list)
    related_templates: list[str] = Field(default_factory=list)
    related_architectures: list[str] = Field(default_factory=list)
    related_modules: list[str] = Field(default_factory=list)
    versions: list[VersionSnapshot] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Blueprint(BaseModel):
    id: str = Field(default_factory=lambda: f"bp_{uuid.uuid4().hex[:8]}")
    project_id: str | None = None
    name: str
    slug: str = ""
    description: str = ""
    version: str = "1.0.0"
    status: BlueprintStatus = BlueprintStatus.DRAFT
    architecture_id: str = "arch_loft_standard_fullstack"
    architecture_name: str = "Loft Standard Fullstack Architecture"
    features: list[str] = Field(default_factory=list)
    modules: list[str] = Field(default_factory=list)
    components: list[str] = Field(default_factory=list)
    templates: list[str] = Field(default_factory=list)
    integrations: list[str] = Field(default_factory=list)
    rules: list[str] = Field(default_factory=list)
    specifications: list[str] = Field(default_factory=list)
    dependencies: list[str] = Field(default_factory=list)
    folder_structure: Any = Field(default_factory=dict)
    api_contracts: list[dict[str, Any]] = Field(default_factory=list)
    validation: BlueprintValidationResult | None = None
    raw_blueprint_json: dict[str, Any] = Field(default_factory=dict)
    versions: list[VersionSnapshot] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Project(BaseModel):
    id: str = Field(default_factory=lambda: f"prj_{uuid.uuid4().hex[:8]}")
    name: str
    slug: str = ""
    description: str
    domain: str = "Core Engineering"
    status: ProjectStatus = ProjectStatus.PLANNING
    owner: str = "willian.jesus@loft.com.br"
    architecture: str = "Loft Standard Fullstack Architecture"
    architecture_id: str = "arch_loft_standard_fullstack"
    template_id: str | None = None
    version: str = "1.0.0"
    blueprint_id: str | None = None
    requirements: list[str] = Field(default_factory=list)
    modules: list[str] = Field(default_factory=list)
    components: list[str] = Field(default_factory=list)
    templates: list[str] = Field(default_factory=list)
    rules: list[str] = Field(default_factory=list)
    specifications: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    versions: list[VersionSnapshot] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------------------------------------------------------------------------
# Engineering Health Metrics
# ---------------------------------------------------------------------------
class EngineeringHealthMetrics(BaseModel):
    components_published: int = 0
    components_deprecated: int = 0
    blueprints_ready: int = 0
    blueprints_validation_errors: int = 0
    missing_dependencies_count: int = 0
    critical_rule_violations_count: int = 0
    specifications_unversioned_count: int = 0
    total_projects: int = 0
    total_blueprints: int = 0
    total_components: int = 0
    total_modules: int = 0
    total_templates: int = 0
    total_rules: int = 0
    total_architectures: int = 0
    total_specifications: int = 0


# ---------------------------------------------------------------------------
# API Standard Contracts
# ---------------------------------------------------------------------------
class ApiMeta(BaseModel):
    page: int = 1
    page_size: int = 20
    total: int = 0
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    data: T
    meta: dict[str, Any] = Field(default_factory=dict)


class ApiListResponse(BaseModel, Generic[T]):
    data: list[T]
    meta: ApiMeta


class ApiErrorDetail(BaseModel):
    code: str
    message: str
    details: dict[str, Any] = Field(default_factory=dict)


class ApiErrorEnvelope(BaseModel):
    error: ApiErrorDetail


# ---------------------------------------------------------------------------
# DTO & Schema Models for CRUD
# ---------------------------------------------------------------------------
class CreateComponentSchema(BaseModel):
    name: str
    slug: str | None = None
    category: str = "UI Foundation"
    type: str = "Frontend"
    description: str
    tags: list[str] = Field(default_factory=list)
    dependencies: list[str] = Field(default_factory=list)
    rules: list[str] = Field(default_factory=list)
    specifications: list[str] = Field(default_factory=list)
    documentation: str = ""
    interface_spec: str = ""
    example_usage: str = ""
    version: str = "1.0.0"
    status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED


class UpdateComponentSchema(BaseModel):
    name: str | None = None
    slug: str | None = None
    category: str | None = None
    type: str | None = None
    description: str | None = None
    tags: list[str] | None = None
    dependencies: list[str] | None = None
    rules: list[str] | None = None
    specifications: list[str] | None = None
    documentation: str | None = None
    interface_spec: str | None = None
    example_usage: str | None = None
    version: str | None = None
    status: EntityLifecycleStatus | None = None


class CreateModuleSchema(BaseModel):
    name: str
    slug: str | None = None
    description: str
    category: str = "Core Domain"
    components: list[str] = Field(default_factory=list)
    apis: list[str] = Field(default_factory=list)
    rules: list[str] = Field(default_factory=list)
    dependencies: list[str] = Field(default_factory=list)
    specifications: list[str] = Field(default_factory=list)
    templates: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    version: str = "1.0.0"
    status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED


class UpdateModuleSchema(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    category: str | None = None
    components: list[str] | None = None
    apis: list[str] | None = None
    rules: list[str] | None = None
    dependencies: list[str] | None = None
    specifications: list[str] | None = None
    templates: list[str] | None = None
    tags: list[str] | None = None
    version: str | None = None
    status: EntityLifecycleStatus | None = None


class CreateTemplateSchema(BaseModel):
    name: str
    slug: str | None = None
    description: str
    category: str = "Application"
    components: list[str] = Field(default_factory=list)
    modules: list[str] = Field(default_factory=list)
    rules: list[str] = Field(default_factory=list)
    specifications: list[str] = Field(default_factory=list)
    architecture: str = "arch_loft_standard_fullstack"
    version: str = "1.0.0"
    status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED


class UpdateTemplateSchema(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    category: str | None = None
    components: list[str] | None = None
    modules: list[str] | None = None
    rules: list[str] | None = None
    specifications: list[str] | None = None
    architecture: str | None = None
    version: str | None = None
    status: EntityLifecycleStatus | None = None


class CreateRuleSchema(BaseModel):
    name: str
    slug: str | None = None
    description: str
    rule_statement: str = ""
    category: RuleCategory = RuleCategory.ARCHITECTURE
    priority: RulePriority = RulePriority.REQUIRED
    scope: str = "Global"
    applies_to: list[str] = Field(default_factory=lambda: ["REST API", "Frontend", "Backend"])
    exceptions: list[str] = Field(default_factory=list)
    dependencies: list[str] = Field(default_factory=list)
    specifications: list[str] = Field(default_factory=list)
    bad_example: str | None = None
    good_example: str | None = None
    referenced_spec: str | None = None
    version: str = "1.0.0"
    status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED


class UpdateRuleSchema(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    rule_statement: str | None = None
    category: RuleCategory | None = None
    priority: RulePriority | None = None
    scope: str | None = None
    applies_to: list[str] | None = None
    exceptions: list[str] | None = None
    dependencies: list[str] | None = None
    specifications: list[str] | None = None
    bad_example: str | None = None
    good_example: str | None = None
    referenced_spec: str | None = None
    version: str | None = None
    status: EntityLifecycleStatus | None = None


class CreateSpecificationSchema(BaseModel):
    name: str
    title: str | None = None
    slug: str | None = None
    summary: str | None = None
    description: str = ""
    category: str = "Frontend Specification"
    content: str = ""
    tags: list[str] = Field(default_factory=list)
    related_components: list[str] = Field(default_factory=list)
    related_rules: list[str] = Field(default_factory=list)
    related_templates: list[str] = Field(default_factory=list)
    related_architectures: list[str] = Field(default_factory=list)
    related_modules: list[str] = Field(default_factory=list)
    version: str = "1.0.0"
    status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED


class UpdateSpecificationSchema(BaseModel):
    name: str | None = None
    title: str | None = None
    slug: str | None = None
    summary: str | None = None
    description: str | None = None
    category: str | None = None
    content: str | None = None
    tags: list[str] | None = None
    related_components: list[str] | None = None
    related_rules: list[str] | None = None
    related_templates: list[str] | None = None
    related_architectures: list[str] | None = None
    related_modules: list[str] | None = None
    version: str | None = None
    status: EntityLifecycleStatus | None = None


class CreateArchitectureSchema(BaseModel):
    name: str
    slug: str | None = None
    description: str
    category: str = "Pattern"
    characteristics: list[str] = Field(default_factory=list)
    recommended_for: list[str] = Field(default_factory=list)
    restrictions: list[str] = Field(default_factory=list)
    layers: list[str] = Field(default_factory=lambda: ["Presentation", "API", "Services", "Domain", "Database"])
    folder_tree: str = ""
    modules: list[str] = Field(default_factory=list)
    components: list[str] = Field(default_factory=list)
    rules: list[str] = Field(default_factory=list)
    specifications: list[str] = Field(default_factory=list)
    version: str = "1.0.0"
    status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED


class UpdateArchitectureSchema(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    category: str | None = None
    characteristics: list[str] | None = None
    recommended_for: list[str] | None = None
    restrictions: list[str] | None = None
    layers: list[str] | None = None
    folder_tree: str | None = None
    modules: list[str] | None = None
    components: list[str] | None = None
    rules: list[str] | None = None
    specifications: list[str] | None = None
    version: str | None = None
    status: EntityLifecycleStatus | None = None


class UpdateBlueprintSchema(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    architecture_id: str | None = None
    module_ids: list[str] | None = None
    modules: list[str] | None = None
    component_ids: list[str] | None = None
    components: list[str] | None = None
    template_ids: list[str] | None = None
    templates: list[str] | None = None
    rule_ids: list[str] | None = None
    rules: list[str] | None = None
    specification_ids: list[str] | None = None
    specifications: list[str] | None = None
    project_id: str | None = None
    version: str | None = None
    status: BlueprintStatus | None = None


class CreateProjectSchema(BaseModel):
    name: str
    slug: str | None = None
    description: str
    domain: str = "Core Engineering"
    architecture_id: str = "arch_loft_standard_fullstack"
    modules: list[str] = Field(default_factory=list)
    components: list[str] = Field(default_factory=list)
    templates: list[str] = Field(default_factory=list)
    rules: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    status: ProjectStatus = ProjectStatus.PLANNING


class BlueprintBuildRequest(BaseModel):
    name: str
    slug: str | None = None
    description: str = ""
    architecture_id: str = "arch_loft_standard_fullstack"
    module_ids: list[str] = Field(default_factory=list)
    component_ids: list[str] = Field(default_factory=list)
    template_ids: list[str] = Field(default_factory=list)
    rule_ids: list[str] = Field(default_factory=list)
    specification_ids: list[str] = Field(default_factory=list)
    project_id: str | None = None


class Entity360Response(BaseModel):
    id: str
    type: str  # Component, Module, Template, Rule, Architecture, Specification, Project, Blueprint
    name: str
    slug: str = ""
    description: str
    version: str
    status: str
    category: str | None = None
    tags: list[str] = Field(default_factory=list)
    what_is_it: dict[str, Any]
    what_is_it_for: dict[str, Any]
    dependencies: list[dict[str, Any]]
    where_used: list[dict[str, Any]]
    associated_rules: list[dict[str, Any]]
    associated_specs: list[dict[str, Any]]
    version_lifecycle: dict[str, Any]
    versions: list[VersionSnapshot] = Field(default_factory=list)
