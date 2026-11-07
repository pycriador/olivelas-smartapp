"""
Domain Models & Entities for App Builder Engine
Follows Loft Backend Engineering System Vol II (Pydantic / Clean Domain)
"""
from __future__ import annotations
from enum import Enum
from typing import Any
from pydantic import BaseModel, Field


class KnowledgeCategory(str, Enum):
    MASTER_GUIDE = "master_guide"
    FRONTEND_SPEC = "frontend_spec"
    BACKEND_SPEC = "backend_spec"
    DESIGN_SYSTEM = "design_system"
    ARCHITECTURE_ADR = "architecture_adr"
    AI_SKILLS_PROMPTS = "ai_skills_prompts"
    SECURITY_IAM = "security_iam"
    DEVOPS_SRE = "devops_sre"
    EXTERNAL_CONFLUENCE = "external_confluence"
    EXTERNAL_GITHUB = "external_github"
    API_INTEGRATIONS = "api_integrations"


class KnowledgeDocShare(BaseModel):
    id: str
    document_id: str
    target_type: str  # "user" | "group"
    target_id: str  # e.g. "willian.jesus@loft.com.br" or "tech-leads"
    target_name: str
    role: str = "viewer"  # "viewer" | "editor"
    created_at: str
    created_by: str


class KnowledgeDocument(BaseModel):
    id: str
    title: str
    category: KnowledgeCategory
    volume: str | None = None
    file_path: str | None = None
    summary: str
    key_points: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    content: str | None = None
    author: str | None = "Loft Engineering"
    version: str | None = "1.0.0"
    updated_at: str | None = None
    is_custom: bool = False
    source_url: str | None = None
    shares: list[KnowledgeDocShare] = Field(default_factory=list)


class ApiClientSource(BaseModel):
    id: str
    name: str
    base_url: str
    auth_type: str = "none"  # "none" | "bearer" | "api_key" | "basic"
    auth_config: dict[str, Any] = Field(default_factory=dict)
    default_headers: dict[str, str] = Field(default_factory=dict)
    description: str | None = None
    created_at: str
    updated_at: str


class ApiSavedRequest(BaseModel):
    id: str
    source_id: str | None = None
    name: str
    method: str = "GET"  # GET, POST, PUT, DELETE, PATCH
    url: str
    params: list[dict[str, Any]] = Field(default_factory=list)  # [{key, value, enabled, description}]
    headers: list[dict[str, Any]] = Field(default_factory=list)  # [{key, value, enabled, description}]
    auth_type: str = "inherit"  # "inherit" | "none" | "bearer" | "api_key" | "basic"
    auth_config: dict[str, Any] = Field(default_factory=dict)
    body_type: str = "none"  # "none" | "json" | "raw" | "form_data"
    body_content: str | None = None
    description: str | None = None
    folder: str | None = "Geral"
    created_at: str
    updated_at: str


class ApiExecutionRequest(BaseModel):
    method: str = "GET"
    url: str
    params: dict[str, str] = Field(default_factory=dict)
    headers: dict[str, str] = Field(default_factory=dict)
    auth_type: str = "none"
    auth_token: str | None = None
    auth_username: str | None = None
    auth_password: str | None = None
    body_type: str = "none"
    body: str | None = None


class ApiExecutionResponse(BaseModel):
    status_code: int
    status_text: str
    latency_ms: int
    response_size_bytes: int
    headers: dict[str, str]
    body: str
    is_json: bool = False


class ComponentLayer(str, Enum):
    FRONTEND = "frontend"
    BACKEND = "backend"


class ComponentCategory(str, Enum):
    # Frontend categories
    UI_FOUNDATION = "ui_foundation"
    NAVIGATION = "navigation"
    DATA_DISPLAY = "data_display"
    FEEDBACK = "feedback"
    FORMS = "forms"
    
    # Backend categories
    PLATFORM_CORE = "platform_core"
    AUTH_SECURITY = "auth_security"
    DATABASE_PERSISTENCE = "database_persistence"
    AI_INTELLIGENCE = "ai_intelligence"
    OBSERVABILITY = "observability"
    INTEGRATIONS = "integrations"


class LoftComponent(BaseModel):
    id: str
    name: str
    layer: ComponentLayer
    category: ComponentCategory
    description: str
    responsibilities: list[str] = Field(default_factory=list)
    dependencies: list[str] = Field(default_factory=list)
    allowed_imports: list[str] = Field(default_factory=list)
    forbidden_imports: list[str] = Field(default_factory=list)
    interface_spec: str
    example_usage: str
    rules_of_use: list[str] = Field(default_factory=list)


class RuleCategory(str, Enum):
    FRONTEND = "frontend"
    BACKEND = "backend"
    SECURITY = "security"
    AI_BAS = "ai_bas"
    ARCHITECTURE = "architecture"


class RuleSeverity(str, Enum):
    CRITICAL = "CRITICAL"          # Violations break security or architectural integrity
    MUST = "MUST"                  # Mandatory standard
    SHOULD = "SHOULD"              # Recommended standard
    BEST_PRACTICE = "BEST_PRACTICE"


class ArchitecturalRule(BaseModel):
    id: str
    title: str
    category: RuleCategory
    severity: RuleSeverity
    statement: str
    rationale: str
    bad_example: str | None = None
    good_example: str | None = None
    referenced_sdd: str | None = None


class ArchitecturePattern(BaseModel):
    id: str
    name: str
    description: str
    folder_structure: str
    core_layers: list[str]
    data_flow: str
    best_for: list[str]
    constraints: list[str]


class CodeTemplate(BaseModel):
    id: str
    name: str
    category: str
    layer: ComponentLayer
    description: str
    target_path_template: str
    content: str
    parameters: list[str] = Field(default_factory=list)


class ProjectRequirement(BaseModel):
    project_name: str
    description: str
    target_type: str = "fullstack"  # frontend, backend, fullstack
    features: list[str] = Field(default_factory=list)
    integrations: list[str] = Field(default_factory=list)
    has_ai_capabilities: bool = False
    has_authentication: bool = True
    database_needed: bool = True


class ApiContract(BaseModel):
    path: str
    method: str
    summary: str
    request_schema: str | None = None
    response_schema: str
    status_code: int = 200
    auth_required: bool = True
    permission: str | None = None


class ProjectBlueprint(BaseModel):
    project_name: str
    target_type: str
    summary: str
    architecture: ArchitecturePattern
    folder_tree: str
    required_frontend_components: list[LoftComponent] = Field(default_factory=list)
    required_backend_components: list[LoftComponent] = Field(default_factory=list)
    api_contracts: list[ApiContract] = Field(default_factory=list)
    data_models_summary: list[str] = Field(default_factory=list)
    applicable_rules: list[ArchitecturalRule] = Field(default_factory=list)
    applicable_templates: list[CodeTemplate] = Field(default_factory=list)
    security_checklist: list[str] = Field(default_factory=list)
    implementation_steps: list[str] = Field(default_factory=list)
    agent_instructions_prompt: str
