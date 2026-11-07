"""
Data Transfer Objects & Models for App Builder Engine API Client.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Union


@dataclass
class ApplicationMetaInput:
    name: str
    description: str = ""
    domain: str = "Real Estate Fintech"
    owner: str = "Olivelas Engineering Guild"
    target_type: str = "fullstack"
    framework_frontend: str = "React 19 (Ant Design)"
    framework_backend: str = "FastAPI (SQLAlchemy 2.0)"
    database: str = "SQLite / PostgreSQL"


@dataclass
class AICompositionRequest:
    application: ApplicationMetaInput
    requirements: List[str] = field(default_factory=list)
    preferences: Dict[str, Any] = field(default_factory=dict)
    enable_ai_agent_scaffold: bool = True


@dataclass
class AICompositionResponse:
    blueprint_id: str
    name: str
    description: str
    architecture_id: str
    architecture_name: str
    folder_tree: str
    resolved_modules: List[Any] = field(default_factory=list)
    resolved_components: List[Any] = field(default_factory=list)
    resolved_rules: List[Any] = field(default_factory=list)
    resolved_templates: List[Any] = field(default_factory=list)
    resolved_dependencies: List[str] = field(default_factory=list)
    api_contracts: List[Dict[str, Any]] = field(default_factory=list)
    security_checklist: List[str] = field(default_factory=list)
    scaffold_instructions: str = ""
    composition_status: str = "Draft"
    raw_blueprint: Dict[str, Any] = field(default_factory=dict)
    data: Optional[Dict[str, Any]] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> AICompositionResponse:
        raw_bp = data.get("raw_blueprint") or {}
        
        # Modules
        modules = (
            data.get("identified_modules")
            or raw_bp.get("modules")
            or data.get("resolved_modules")
            or data.get("modules")
            or []
        )
        
        # Components
        components = (
            data.get("identified_components")
            or raw_bp.get("components")
            or data.get("resolved_components")
            or data.get("components")
            or []
        )
        
        # Rules
        rules = (
            data.get("identified_rules")
            or raw_bp.get("rules")
            or data.get("resolved_rules")
            or data.get("rules")
            or []
        )

        # Templates
        templates = (
            data.get("identified_templates")
            or raw_bp.get("templates")
            or data.get("templates")
            or []
        )

        # Dependencies
        deps = (
            data.get("identified_dependencies")
            or raw_bp.get("dependencies")
            or data.get("dependencies")
            or []
        )

        arch_name = (
            data.get("architecture")
            or raw_bp.get("architecture")
            or data.get("architecture_name")
            or "Olivelas Standard Fullstack"
        )

        return cls(
            blueprint_id=data.get("blueprint_id") or data.get("id") or "bp_gen_01",
            name=data.get("application_name") or data.get("name") or "Application",
            description=data.get("description") or "",
            architecture_id=data.get("architecture_id") or "arch_loft_standard_fullstack",
            architecture_name=arch_name,
            folder_tree=data.get("folder_structure") or data.get("folder_tree") or "",
            resolved_modules=modules,
            resolved_components=components,
            resolved_rules=rules,
            resolved_templates=templates,
            resolved_dependencies=deps,
            api_contracts=data.get("api_contracts") or [],
            security_checklist=data.get("security_checklist") or [
                "Autenticação JWT com rotação de chaves",
                "RBAC granular com checagem de permissões por rota",
                "Sanitização e mascaramento de dados sensíveis (LGPD)",
                "Trilha de auditoria em todas as mutações"
            ],
            scaffold_instructions=data.get("scaffold_instructions") or data.get("agent_instructions") or "",
            composition_status=data.get("composition_status") or data.get("status") or "Draft",
            raw_blueprint=raw_bp,
            data=data,
        )



@dataclass
class GeneratePlanRequest:
    project_name: str
    description: str
    target_type: str = "fullstack"
    features: List[str] = field(default_factory=list)
    has_ai_capabilities: bool = True
    has_authentication: bool = True
    template_id: Optional[str] = None
    architecture_id: Optional[str] = None


@dataclass
class ProjectBlueprintResponse:
    project_name: str
    target_type: str
    architecture: Dict[str, Any]
    folder_structure: List[str]
    frontend_components: List[Dict[str, Any]]
    backend_components: List[Dict[str, Any]]
    api_contracts: List[Dict[str, Any]]
    rules: List[Dict[str, Any]]
    security_checklist: List[str]
    implementation_steps: List[str]
    agent_system_prompt: str
    data: Optional[Dict[str, Any]] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> ProjectBlueprintResponse:
        return cls(
            project_name=data.get("project_name", "Olivelas App"),
            target_type=data.get("target_type", "fullstack"),
            architecture=data.get("architecture", {}),
            folder_structure=data.get("folder_structure", []),
            frontend_components=data.get("frontend_components", []),
            backend_components=data.get("backend_components", []),
            api_contracts=data.get("api_contracts", []),
            rules=data.get("rules", []),
            security_checklist=data.get("security_checklist", []),
            implementation_steps=data.get("implementation_steps", []),
            agent_system_prompt=data.get("agent_system_prompt", ""),
            data=data,
        )


@dataclass
class ProjectCreate:
    name: str
    description: str
    slug: Optional[str] = None
    template_id: Optional[str] = None
    architecture_id: Optional[str] = None
    owner: str = "Olivelas Engineering Guild"
    tags: List[str] = field(default_factory=list)
    repository_url: Optional[str] = None


@dataclass
class ProjectResponse:
    id: str
    name: str
    slug: str
    description: str
    status: str
    owner: str
    tags: List[str]
    version: str
    template_id: Optional[str] = None
    architecture_id: Optional[str] = None
    blueprint_id: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> ProjectResponse:
        return cls(
            id=data.get("id", ""),
            name=data.get("name", ""),
            slug=data.get("slug", ""),
            description=data.get("description", ""),
            status=data.get("status", "Active"),
            owner=data.get("owner", ""),
            tags=data.get("tags", []),
            version=data.get("version", "1.0.0"),
            template_id=data.get("template_id"),
            architecture_id=data.get("architecture_id"),
            blueprint_id=data.get("blueprint_id"),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
            data=data,
        )


@dataclass
class BlueprintBuildRequest:
    project_id: Optional[str] = None
    name: str = ""
    description: str = ""
    architecture_id: str = "arch_loft_standard_fullstack"
    template_id: Optional[str] = None
    components: List[str] = field(default_factory=list)
    modules: List[str] = field(default_factory=list)
    rules: List[str] = field(default_factory=list)
    specifications: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)


@dataclass
class BlueprintResponse:
    id: str
    name: str
    description: str
    status: str
    version: str
    architecture_id: str
    project_id: Optional[str] = None
    components: List[Any] = field(default_factory=list)
    modules: List[Any] = field(default_factory=list)
    rules: List[Any] = field(default_factory=list)
    specifications: List[Any] = field(default_factory=list)
    composition_tree: Dict[str, Any] = field(default_factory=dict)
    folder_tree: str = ""
    data: Optional[Dict[str, Any]] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> BlueprintResponse:
        return cls(
            id=data.get("id", ""),
            name=data.get("name", ""),
            description=data.get("description", ""),
            status=data.get("status", "Draft"),
            version=data.get("version", "1.0.0"),
            architecture_id=data.get("architecture_id", ""),
            project_id=data.get("project_id"),
            components=data.get("components", []),
            modules=data.get("modules", []),
            rules=data.get("rules", []),
            specifications=data.get("specifications", []),
            composition_tree=data.get("composition_tree", {}),
            folder_tree=data.get("folder_tree", ""),
            data=data,
        )


@dataclass
class ConfigValidationRequest:
    components: List[str] = field(default_factory=list)
    modules: List[str] = field(default_factory=list)
    rules: List[str] = field(default_factory=list)
    architecture_id: Optional[str] = None


@dataclass
class ConfigValidationResponse:
    valid: bool
    issues: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    missing_dependencies: List[str] = field(default_factory=list)
    diagnostics: Dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> ConfigValidationResponse:
        return cls(
            valid=data.get("valid", True),
            issues=data.get("issues", []),
            warnings=data.get("warnings", []),
            missing_dependencies=data.get("missing_dependencies", []),
            diagnostics=data.get("diagnostics", {}),
        )


@dataclass
class LoginRequest:
    username_or_email: str
    password: str


@dataclass
class LoginResponse:
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in_seconds: int = 86400
    user: Dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> LoginResponse:
        return cls(
            access_token=data.get("access_token", ""),
            refresh_token=data.get("refresh_token", ""),
            token_type=data.get("token_type", "Bearer"),
            expires_in_seconds=data.get("expires_in_seconds", 86400),
            user=data.get("user", {}),
        )


@dataclass
class UserResponse:
    id: str
    name: str
    email: str
    username: str
    role: str
    status: str
    groups: List[str] = field(default_factory=list)
    permissions: List[str] = field(default_factory=list)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> UserResponse:
        return cls(
            id=data.get("id", ""),
            name=data.get("name", ""),
            email=data.get("email", ""),
            username=data.get("username", ""),
            role=data.get("role", ""),
            status=data.get("status", "Active"),
            groups=data.get("groups", []),
            permissions=data.get("permissions", []),
        )
