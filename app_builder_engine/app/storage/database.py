"""
SQLAlchemy-backed Database Repository Layer for App Builder Engine
Provides persistent SQLite storage, ORM mappings, transaction lifecycle, and dictionary/list-like delegates
for seamless integration with domain entities and services.
"""
from __future__ import annotations
from datetime import datetime, timezone
from typing import Any, Iterator, Optional

from sqlalchemy import select, delete, desc
from sqlalchemy.orm import Session

from app.db.session import SessionLocal, init_db
from app.db.seed import seed_database
from app.domain.entities import (
    User,
    RoleName,
    AuditLog,
    Component,
    VersionSnapshot,
    Template,
    Module,
    Rule,
    RuleCategory,
    RulePriority,
    Architecture,
    Specification,
    Blueprint,
    BlueprintStatus,
    BlueprintValidationResult,
    Project,
    ProjectStatus,
    EntityLifecycleStatus,
)
from app.models.orm_models import (
    UserModel,
    ComponentModel,
    TemplateModel,
    ModuleModel,
    RuleModel,
    ArchitectureModel,
    SpecificationModel,
    ProjectModel,
    BlueprintModel,
    AuditLogModel,
    VersionSnapshotModel,
    SystemStateModel,
)


def _make_json_safe(val: Any) -> Any:
    if val is None:
        return None
    if isinstance(val, dict):
        return {str(k): _make_json_safe(v) for k, v in val.items()}
    if isinstance(val, (list, tuple, set)):
        return [_make_json_safe(item) for item in val]
    if isinstance(val, datetime):
        return val.isoformat()
    if hasattr(val, "value"):
        return val.value
    if hasattr(val, "model_dump"):
        return _make_json_safe(val.model_dump(mode="json"))
    if isinstance(val, (int, float, bool, str)):
        return val
    return str(val)


def _ensure_dt(val: Any) -> datetime:
    if isinstance(val, datetime):
        return val
    if isinstance(val, str):
        try:
            return datetime.fromisoformat(val)
        except Exception:
            pass
    return datetime.now(timezone.utc)


def _safe_enum(enum_cls, val, default):
    try:
        return enum_cls(val)
    except Exception:
        return default


def _parse_version_snapshot(v: Any) -> VersionSnapshot:
    if isinstance(v, VersionSnapshot):
        return v
    if not isinstance(v, dict):
        return VersionSnapshot(
            version=str(v),
            changelog="Versão canônica",
            created_at=datetime.now(timezone.utc),
            created_by="willian.jesus@loft.com.br",
            snapshot_data={},
        )
    return VersionSnapshot(
        version=str(v.get("version", "1.0.0")),
        changelog=str(v.get("changelog") or v.get("note") or v.get("description") or "Snapshot de versão"),
        created_at=_ensure_dt(v.get("created_at") or v.get("date") or v.get("timestamp")),
        created_by=str(v.get("created_by") or v.get("author") or v.get("owner") or "willian.jesus@loft.com.br"),
        snapshot_data=v.get("snapshot_data") or {},
    )


# --- Entity <-> Model Mappers ---

def orm_to_user(m: UserModel) -> User:
    return User(
        id=m.id,
        name=m.name,
        email=m.email,
        role=_safe_enum(RoleName, m.role, RoleName.VIEWER),
        is_active=m.is_active,
        created_at=m.created_at,
        updated_at=m.updated_at,
    )


def user_to_orm(e: User) -> UserModel:
    role_val = e.role.value if hasattr(e.role, "value") else str(e.role)
    return UserModel(
        id=e.id,
        name=e.name,
        email=e.email,
        role=role_val,
        is_active=e.is_active,
        created_at=e.created_at,
        updated_at=e.updated_at,
    )


def orm_to_component(m: ComponentModel) -> Component:
    versions = [_parse_version_snapshot(v) for v in (m.versions or [])]
    return Component(
        id=m.id,
        name=m.name,
        slug=m.slug,
        category=m.category,
        type=m.type,
        description=m.description,
        status=_safe_enum(EntityLifecycleStatus, m.status, EntityLifecycleStatus.PUBLISHED),
        version=m.version,
        owner=m.owner,
        tags=m.tags or [],
        dependencies=m.dependencies or [],
        rules=m.rules or [],
        specifications=m.specifications or [],
        modules=m.modules or [],
        templates=m.templates or [],
        props_contract=m.props_contract or {},
        preview_code=m.preview_code,
        documentation=m.documentation,
        interface_spec=m.interface_spec,
        example_usage=m.example_usage,
        versions=versions,
        created_at=m.created_at,
        updated_at=m.updated_at,
    )


def component_to_orm(e: Component) -> ComponentModel:
    status_val = e.status.value if hasattr(e.status, "value") else str(e.status)
    versions_json = [
        {
            "version": v.version,
            "changelog": v.changelog,
            "created_at": v.created_at.isoformat(),
            "created_by": v.created_by,
            "snapshot_data": _make_json_safe(v.snapshot_data),
        }
        for v in e.versions
    ]
    return ComponentModel(
        id=e.id,
        name=e.name,
        slug=e.slug or e.id,
        category=e.category,
        type=e.type,
        description=e.description,
        status=status_val,
        version=e.version,
        owner=e.owner,
        tags=e.tags,
        dependencies=e.dependencies,
        rules=e.rules,
        specifications=e.specifications,
        modules=e.modules,
        templates=e.templates,
        props_contract=e.props_contract,
        preview_code=e.preview_code,
        documentation=e.documentation,
        interface_spec=e.interface_spec,
        example_usage=e.example_usage,
        versions=versions_json,
        created_at=e.created_at,
        updated_at=e.updated_at,
    )


def orm_to_template(m: TemplateModel) -> Template:
    versions = [_parse_version_snapshot(v) for v in (m.versions or [])]
    return Template(
        id=m.id,
        name=m.name,
        slug=m.slug,
        category=m.category,
        description=m.description,
        status=_safe_enum(EntityLifecycleStatus, m.status, EntityLifecycleStatus.PUBLISHED),
        version=m.version,
        architecture=m.architecture,
        architecture_id=m.architecture_id,
        owner=m.owner,
        modules=m.modules or [],
        components=m.components or [],
        rules=m.rules or [],
        specifications=m.specifications or [],
        composition_tree=m.composition_tree or {},
        tags=m.tags or [],
        versions=versions,
        created_at=m.created_at,
        updated_at=m.updated_at,
    )


def template_to_orm(e: Template) -> TemplateModel:
    status_val = e.status.value if hasattr(e.status, "value") else str(e.status)
    versions_json = [
        {
            "version": v.version,
            "changelog": v.changelog,
            "created_at": v.created_at.isoformat() if hasattr(v.created_at, "isoformat") else str(v.created_at),
            "created_by": v.created_by,
            "snapshot_data": _make_json_safe(v.snapshot_data),
        }
        for v in e.versions
    ]
    return TemplateModel(
        id=e.id,
        name=e.name,
        slug=e.slug or e.id,
        category=e.category,
        description=e.description,
        status=status_val,
        version=e.version,
        architecture=e.architecture,
        architecture_id=getattr(e, "architecture_id", e.architecture),
        owner=e.owner,
        modules=e.modules,
        components=e.components,
        rules=e.rules,
        specifications=e.specifications,
        composition_tree=_make_json_safe(e.composition_tree),
        tags=getattr(e, "tags", []),
        versions=versions_json,
        created_at=e.created_at,
        updated_at=e.updated_at,
    )


def orm_to_module(m: ModuleModel) -> Module:
    versions = [_parse_version_snapshot(v) for v in (m.versions or [])]
    return Module(
        id=m.id,
        name=m.name,
        slug=m.slug,
        category=m.category,
        description=m.description,
        status=_safe_enum(EntityLifecycleStatus, m.status, EntityLifecycleStatus.PUBLISHED),
        version=m.version,
        owner=m.owner,
        components=m.components or [],
        apis=m.apis or [],
        dependencies=m.dependencies or [],
        rules=m.rules or [],
        specifications=m.specifications or [],
        templates=m.templates or [],
        tags=m.tags or [],
        versions=versions,
        created_at=m.created_at,
        updated_at=m.updated_at,
    )


def module_to_orm(e: Module) -> ModuleModel:
    status_val = e.status.value if hasattr(e.status, "value") else str(e.status)
    versions_json = [
        {
            "version": v.version,
            "changelog": v.changelog,
            "created_at": v.created_at.isoformat(),
            "created_by": v.created_by,
            "snapshot_data": _make_json_safe(v.snapshot_data),
        }
        for v in e.versions
    ]
    return ModuleModel(
        id=e.id,
        name=e.name,
        slug=e.slug or e.id,
        category=e.category,
        description=e.description,
        status=status_val,
        version=e.version,
        owner=e.owner,
        components=e.components,
        apis=e.apis,
        dependencies=e.dependencies,
        rules=e.rules,
        specifications=e.specifications,
        templates=e.templates,
        tags=e.tags or [],
        versions=versions_json,
        created_at=e.created_at,
        updated_at=e.updated_at,
    )


CANONICAL_API_ENVELOPE_SCHEMA: dict[str, Any] = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "ApiResponseEnvelope",
    "type": "object",
    "required": ["data", "meta"],
    "properties": {
        "data": {
            "description": "Payload principal da resposta (objeto, lista ou null em caso de erro).",
            "anyOf": [{"type": "object"}, {"type": "array"}, {"type": "null"}],
        },
        "meta": {
            "type": "object",
            "required": ["timestamp", "version"],
            "properties": {
                "page": {"type": "integer", "minimum": 1, "default": 1},
                "page_size": {"type": "integer", "minimum": 1, "maximum": 100, "default": 20},
                "total": {"type": "integer", "minimum": 0},
                "timestamp": {"type": "string", "format": "date-time"},
                "version": {"type": "string", "example": "1.0.0"},
                "request_id": {"type": "string", "example": "req_9f8a7b6c"},
            },
        },
        "error": {
            "anyOf": [
                {"type": "null"},
                {
                    "type": "object",
                    "required": ["code", "message"],
                    "properties": {
                        "code": {"type": "string", "example": "AUTHENTICATION_FAILED"},
                        "message": {"type": "string", "example": "Credenciais inválidas ou token expirado."},
                        "details": {"type": "object"},
                        "request_id": {"type": "string"},
                    },
                },
            ]
        },
    },
}

CANONICAL_ERROR_CODES_TABLE: list[dict[str, Any]] = [
    {"code": "AUTHENTICATION_FAILED", "http_status": 401, "exception_class": "AuthenticationError", "when_to_use": "Token JWT ausente, malformado, expirado, revogado ou credenciais de login inválidas."},
    {"code": "PERMISSION_DENIED", "http_status": 403, "exception_class": "AuthorizationError", "when_to_use": "Usuário autenticado não possui a permissão RBAC/ABAC necessária para a operação."},
    {"code": "NOT_FOUND", "http_status": 404, "exception_class": "NotFoundError", "when_to_use": "Entidade ou recurso solicitado não existe no banco de dados."},
    {"code": "CONFLICT", "http_status": 409, "exception_class": "ConflictError", "when_to_use": "Violação de unicidade (e-mail/username duplicado) ou conflito de estado."},
    {"code": "VALIDATION_ERROR", "http_status": 422, "exception_class": "ValidationError", "when_to_use": "Payload de entrada inválido segundo o contrato Pydantic v2 ou regra de domínio."},
    {"code": "ACCOUNT_LOCKED", "http_status": 423, "exception_class": "AccountLockedError", "when_to_use": "Conta bloqueada após atingir o limiar de 5 tentativas falhas de login (lockout de 15 min)."},
    {"code": "RATE_LIMITED", "http_status": 429, "exception_class": "RateLimitError", "when_to_use": "Limite de requisições por minuto excedido (10 req/min em auth, 120 req/min geral)."},
    {"code": "INTERNAL_ERROR", "http_status": 500, "exception_class": "ApplicationError", "when_to_use": "Falha interna inesperada tratada pelo handler global com trace_id."},
    {"code": "AI_SERVICE_ERROR", "http_status": 502, "exception_class": "AIServiceError", "when_to_use": "Falha de comunicação ou chave inválida no provedor upstream do AI Gateway."},
]


def orm_to_rule(m: RuleModel) -> Rule:
    versions = [_parse_version_snapshot(v) for v in (m.versions or [])]
    json_schema = None
    error_codes_table = None
    examples: dict[str, Any] = {
        "bad": m.bad_example or "",
        "good": m.good_example or "",
    }
    if m.id == "rul_loft_be_api_envelope":
        json_schema = CANONICAL_API_ENVELOPE_SCHEMA
        examples = {
            "bad": m.bad_example or "return {'id': 'usr_01', 'name': 'Maria'}",
            "good": m.good_example or "return ApiResponse(data={'id': 'usr_01', 'name': 'Maria'}, meta=ApiMeta(total=1))",
            "success_single_response": {
                "data": {"id": "prj_01", "name": "Portal Loft", "status": "Active"},
                "meta": {"page": 1, "page_size": 20, "total": 1, "timestamp": "2026-10-19T12:00:00Z", "version": "1.0.0"},
                "error": None,
            },
            "success_list_response": {
                "data": [{"id": "prj_01", "name": "Portal Loft"}],
                "meta": {"page": 1, "page_size": 20, "total": 1, "timestamp": "2026-10-19T12:00:00Z", "version": "1.0.0"},
            },
            "error_response": {
                "data": None,
                "error": {
                    "code": "AUTHENTICATION_FAILED",
                    "message": "Token de autenticação ausente. Envie o header Authorization: Bearer <token>.",
                    "details": {},
                    "request_id": "req_01",
                },
                "meta": {"request_id": "req_01"},
            },
        }
    elif m.id == "rul_loft_be_error_codes":
        error_codes_table = CANONICAL_ERROR_CODES_TABLE
        json_schema = CANONICAL_API_ENVELOPE_SCHEMA["properties"]["error"]
        examples = {
            "bad": m.bad_example or "raise HTTPException(status_code=500, detail=str(e))",
            "good": m.good_example or "raise AuthenticationError('Token inválido ou expirado.')",
            "error_codes_table": CANONICAL_ERROR_CODES_TABLE,
            "sample_401": {
                "data": None,
                "error": {"code": "AUTHENTICATION_FAILED", "message": "Credenciais inválidas para 'user@loft.com.br'.", "details": {}, "request_id": "req_401"},
            },
            "sample_423": {
                "data": None,
                "error": {"code": "ACCOUNT_LOCKED", "message": "Conta bloqueada por segurança após 5 tentativas falhas.", "details": {"failed_attempts": 5}, "request_id": "req_423"},
            },
        }

    return Rule(
        id=m.id,
        name=m.name,
        slug=m.slug,
        category=_safe_enum(RuleCategory, m.category, RuleCategory.ARCHITECTURE),
        priority=_safe_enum(RulePriority, m.priority, RulePriority.REQUIRED),
        scope=m.scope,
        description=m.description,
        rule_statement=m.rule_statement,
        applies_to=m.applies_to or [],
        exceptions=m.exceptions or [],
        dependencies=m.dependencies or [],
        specifications=m.specifications or [],
        status=_safe_enum(EntityLifecycleStatus, m.status, EntityLifecycleStatus.PUBLISHED),
        version=m.version,
        bad_example=m.bad_example,
        good_example=m.good_example,
        examples=examples,
        json_schema=json_schema,
        error_codes_table=error_codes_table,
        referenced_spec=m.referenced_spec,
        versions=versions,
        created_at=m.created_at,
        updated_at=m.updated_at,
    )


def rule_to_orm(e: Rule) -> RuleModel:
    cat_val = e.category.value if hasattr(e.category, "value") else str(e.category)
    prio_val = e.priority.value if hasattr(e.priority, "value") else str(e.priority)
    status_val = e.status.value if hasattr(e.status, "value") else str(e.status)
    versions_json = [
        {
            "version": v.version,
            "changelog": v.changelog,
            "created_at": v.created_at.isoformat(),
            "created_by": v.created_by,
            "snapshot_data": _make_json_safe(v.snapshot_data),
        }
        for v in e.versions
    ]
    return RuleModel(
        id=e.id,
        name=e.name,
        slug=e.slug or e.id,
        category=cat_val,
        priority=prio_val,
        scope=e.scope,
        description=e.description,
        rule_statement=e.rule_statement,
        applies_to=e.applies_to,
        exceptions=e.exceptions,
        dependencies=e.dependencies,
        specifications=e.specifications,
        status=status_val,
        version=e.version,
        bad_example=e.bad_example,
        good_example=e.good_example,
        referenced_spec=e.referenced_spec,
        versions=versions_json,
        created_at=e.created_at,
        updated_at=e.updated_at,
    )


def orm_to_architecture(m: ArchitectureModel) -> Architecture:
    versions = [_parse_version_snapshot(v) for v in (m.versions or [])]
    if m.id == "arch_static_landing_page":
        db_engine = "None (Stateless / In-Memory)"
    elif m.id == "arch_loft_postgres_opsbase_fullstack":
        db_engine = "PostgreSQL 16 via AIOps Opsbase (SQLAlchemy 2.0 + Alembic)"
    else:
        db_engine = "PostgreSQL 16 (SQLAlchemy 2.0 + Alembic / AIOps Opsbase)"
    return Architecture(
        id=m.id,
        name=m.name,
        slug=m.slug,
        category=m.category,
        description=m.description,
        database=db_engine,
        version=m.version,
        status=_safe_enum(EntityLifecycleStatus, m.status, EntityLifecycleStatus.PUBLISHED),
        characteristics=m.characteristics or [],
        recommended_for=m.recommended_for or [],
        restrictions=m.restrictions or [],
        layers=m.layers or [],
        recommended_modules=m.recommended_modules or [],
        canonical_folder_structure=m.canonical_folder_structure or [],
        folder_tree=m.folder_tree,
        modules=m.modules or [],
        components=m.components or [],
        rules=m.rules or [],
        specifications=m.specifications or [],
        versions=versions,
        created_at=m.created_at,
        updated_at=m.updated_at,
    )


def architecture_to_orm(e: Architecture) -> ArchitectureModel:
    status_val = e.status.value if hasattr(e.status, "value") else str(e.status)
    versions_json = [
        {
            "version": v.version,
            "changelog": v.changelog,
            "created_at": v.created_at.isoformat(),
            "created_by": v.created_by,
            "snapshot_data": _make_json_safe(v.snapshot_data),
        }
        for v in e.versions
    ]
    return ArchitectureModel(
        id=e.id,
        name=e.name,
        slug=e.slug or e.id,
        category=e.category,
        description=e.description,
        version=e.version,
        status=status_val,
        characteristics=e.characteristics,
        recommended_for=e.recommended_for,
        restrictions=e.restrictions,
        layers=e.layers,
        recommended_modules=getattr(e, "recommended_modules", []),
        canonical_folder_structure=_make_json_safe(e.canonical_folder_structure),
        folder_tree=e.folder_tree,
        modules=e.modules,
        components=e.components,
        rules=e.rules,
        specifications=e.specifications,
        versions=versions_json,
        created_at=e.created_at,
        updated_at=e.updated_at,
    )


def orm_to_specification(m: SpecificationModel) -> Specification:
    versions = [_parse_version_snapshot(v) for v in (m.versions or [])]
    return Specification(
        id=m.id,
        name=m.name,
        title=m.title,
        slug=m.slug,
        category=m.category,
        version=m.version,
        status=_safe_enum(EntityLifecycleStatus, m.status, EntityLifecycleStatus.PUBLISHED),
        description=m.description,
        summary=m.summary,
        content=m.content,
        tags=m.tags or [],
        related_components=m.related_components or [],
        related_rules=m.related_rules or [],
        related_templates=m.related_templates or [],
        related_architectures=m.related_architectures or [],
        related_modules=m.related_modules or [],
        versions=versions,
        created_at=m.created_at,
        updated_at=m.updated_at,
    )


def specification_to_orm(e: Specification) -> SpecificationModel:
    status_val = e.status.value if hasattr(e.status, "value") else str(e.status)
    versions_json = [
        {
            "version": v.version,
            "changelog": v.changelog,
            "created_at": v.created_at.isoformat(),
            "created_by": v.created_by,
            "snapshot_data": _make_json_safe(v.snapshot_data),
        }
        for v in e.versions
    ]
    return SpecificationModel(
        id=e.id,
        name=e.name,
        title=e.title or e.name,
        slug=e.slug or e.id,
        category=e.category,
        version=e.version,
        status=status_val,
        description=e.description,
        summary=e.summary,
        content=e.content,
        tags=e.tags,
        related_components=e.related_components,
        related_rules=e.related_rules,
        related_templates=e.related_templates,
        related_architectures=e.related_architectures,
        related_modules=e.related_modules,
        versions=versions_json,
        created_at=e.created_at,
        updated_at=e.updated_at,
    )


def orm_to_project(m: ProjectModel) -> Project:
    versions = [_parse_version_snapshot(v) for v in (m.versions or [])]
    return Project(
        id=m.id,
        name=m.name,
        slug=m.slug,
        description=m.description,
        domain=m.domain,
        status=_safe_enum(ProjectStatus, m.status, ProjectStatus.PLANNING),
        architecture=m.architecture,
        architecture_id=m.architecture_id,
        template_id=m.template_id,
        version=m.version,
        owner=m.owner,
        blueprint_id=m.blueprint_id,
        requirements=m.requirements or [],
        modules=m.modules or [],
        components=m.components or [],
        templates=m.templates or [],
        rules=m.rules or [],
        specifications=m.specifications or [],
        tags=m.tags or [],
        versions=versions,
        created_at=m.created_at,
        updated_at=m.updated_at,
    )


def project_to_orm(e: Project) -> ProjectModel:
    status_val = e.status.value if hasattr(e.status, "value") else str(e.status)
    versions_json = [
        {
            "version": v.version,
            "changelog": v.changelog,
            "created_at": v.created_at.isoformat(),
            "created_by": v.created_by,
            "snapshot_data": _make_json_safe(v.snapshot_data),
        }
        for v in e.versions
    ]
    return ProjectModel(
        id=e.id,
        name=e.name,
        slug=e.slug or e.id,
        description=e.description,
        domain=e.domain,
        status=status_val,
        architecture=e.architecture,
        architecture_id=e.architecture_id,
        template_id=e.template_id,
        version=e.version,
        owner=e.owner,
        blueprint_id=e.blueprint_id,
        requirements=e.requirements,
        modules=e.modules,
        components=e.components,
        templates=e.templates,
        rules=e.rules,
        specifications=e.specifications,
        tags=e.tags,
        versions=versions_json,
        created_at=e.created_at,
        updated_at=e.updated_at,
    )


def orm_to_blueprint(m: BlueprintModel) -> Blueprint:
    val_data = m.validation or {}
    validation = None
    if val_data:
        try:
            validation = BlueprintValidationResult(**val_data)
        except Exception:
            pass
    versions = [_parse_version_snapshot(v) for v in (m.versions or [])]
    return Blueprint(
        id=m.id,
        name=m.name,
        slug=m.slug,
        project_id=m.project_id,
        architecture_id=m.architecture_id,
        architecture_name=m.architecture_name,
        description=m.description,
        version=m.version,
        status=_safe_enum(BlueprintStatus, m.status, BlueprintStatus.DRAFT),
        features=m.features or [],
        modules=m.modules or [],
        components=m.components or [],
        templates=m.templates or [],
        integrations=m.integrations or [],
        rules=m.rules or [],
        specifications=m.specifications or [],
        dependencies=m.dependencies or [],
        folder_structure=m.folder_structure or {},
        api_contracts=m.api_contracts or [],
        validation=validation,
        raw_blueprint_json=m.raw_blueprint_json or {},
        versions=versions,
        created_at=m.created_at,
        updated_at=m.updated_at,
    )


def blueprint_to_orm(e: Blueprint) -> BlueprintModel:
    status_val = e.status.value if hasattr(e.status, "value") else str(e.status)
    val_json = e.validation.model_dump() if e.validation and hasattr(e.validation, "model_dump") else (e.validation or {})
    versions_json = [
        {
            "version": v.version,
            "changelog": v.changelog,
            "created_at": v.created_at.isoformat(),
            "created_by": v.created_by,
            "snapshot_data": _make_json_safe(v.snapshot_data),
        }
        for v in e.versions
    ]
    return BlueprintModel(
        id=e.id,
        name=e.name,
        slug=e.slug or e.id,
        project_id=e.project_id,
        architecture_id=e.architecture_id,
        architecture_name=e.architecture_name,
        description=e.description,
        version=e.version,
        status=status_val,
        features=e.features,
        modules=e.modules,
        components=e.components,
        templates=e.templates,
        integrations=e.integrations,
        rules=e.rules,
        specifications=e.specifications,
        dependencies=e.dependencies,
        folder_structure=e.folder_structure,
        api_contracts=e.api_contracts,
        validation=val_json,
        raw_blueprint_json=e.raw_blueprint_json,
        versions=versions_json,
        created_at=e.created_at,
        updated_at=e.updated_at,
    )


def orm_to_audit_log(m: AuditLogModel) -> AuditLog:
    return AuditLog(
        id=m.id,
        action=m.action,
        resource=m.resource,
        resource_id=m.resource_id,
        entity_type=m.entity_type or m.resource,
        entity_id=m.entity_id or m.resource_id,
        actor=m.actor or m.user_email,
        result=m.result,
        metadata=m.metadata_json or {},
        details=m.details or m.metadata_json or {},
        timestamp=m.timestamp,
    )


def audit_log_to_orm(e: AuditLog) -> AuditLogModel:
    action_val = e.action.value if hasattr(e.action, "value") else str(e.action)
    return AuditLogModel(
        id=e.id,
        action=action_val,
        resource=e.resource,
        resource_id=e.resource_id,
        entity_type=e.entity_type or e.resource,
        entity_id=e.entity_id or e.resource_id,
        actor=e.actor,
        user_email=e.user_email,
        result=e.result,
        metadata_json=e.metadata_json,
        details=e.details,
        timestamp=e.timestamp,
    )


# --- Generic SQLAlchemy Dict Adapter ---

class SqlAlchemyDictAdapter:
    """Provides dictionary-like interface (get, values, items, [], in, del) backed directly by SQLAlchemy queries."""
    def __init__(self, model_cls, orm_to_entity, entity_to_orm):
        self.model_cls = model_cls
        self.orm_to_entity = orm_to_entity
        self.entity_to_orm = entity_to_orm

    def __getitem__(self, key: str):
        with SessionLocal() as s:
            item = s.get(self.model_cls, key)
            if not item:
                raise KeyError(f"{self.model_cls.__name__} '{key}' not found")
            return self.orm_to_entity(item)

    def __setitem__(self, key: str, value: Any):
        with SessionLocal() as s:
            if self.model_cls is UserModel:
                existing = s.get(UserModel, key)
                if existing:
                    role_val = value.role.value if hasattr(value.role, "value") else str(value.role)
                    existing.name = value.name
                    existing.email = value.email
                    existing.role = role_val
                    existing.is_active = value.is_active
                    existing.updated_at = datetime.now(timezone.utc)
                    s.commit()
                    return
            orm_obj = self.entity_to_orm(value)
            orm_obj.id = key
            s.merge(orm_obj)
            s.commit()

    def __delitem__(self, key: str):
        with SessionLocal() as s:
            item = s.get(self.model_cls, key)
            if item:
                s.delete(item)
                s.commit()

    def __contains__(self, key: str) -> bool:
        with SessionLocal() as s:
            return s.get(self.model_cls, key) is not None

    def __len__(self) -> int:
        with SessionLocal() as s:
            from sqlalchemy import func
            return s.scalar(select(func.count()).select_from(self.model_cls)) or 0

    def __iter__(self) -> Iterator[str]:
        with SessionLocal() as s:
            rows = s.scalars(select(self.model_cls.id)).all()
            return iter(rows)

    def get(self, key: str, default: Any = None) -> Any:
        with SessionLocal() as s:
            item = s.get(self.model_cls, key)
            return self.orm_to_entity(item) if item else default

    def keys(self) -> list[str]:
        with SessionLocal() as s:
            return list(s.scalars(select(self.model_cls.id)).all())

    def values(self) -> list[Any]:
        with SessionLocal() as s:
            rows = s.scalars(select(self.model_cls)).all()
            return [self.orm_to_entity(r) for r in rows]

    def items(self) -> list[tuple[str, Any]]:
        with SessionLocal() as s:
            rows = s.scalars(select(self.model_cls)).all()
            return [(r.id, self.orm_to_entity(r)) for r in rows]

    def clear(self):
        with SessionLocal() as s:
            s.execute(delete(self.model_cls))
            s.commit()


# --- Audit Logs List Adapter ---

class SqlAlchemyAuditLogsAdapter:
    """Provides list-like interface for audit logs stored in SQLite."""
    def insert(self, index: int, value: AuditLog):
        with SessionLocal() as s:
            orm_obj = audit_log_to_orm(value)
            s.add(orm_obj)
            s.commit()

    def append(self, value: AuditLog):
        self.insert(0, value)

    def __getitem__(self, item):
        with SessionLocal() as s:
            stmt = select(AuditLogModel).order_by(desc(AuditLogModel.timestamp))
            rows = s.scalars(stmt).all()
            entities = [orm_to_audit_log(r) for r in rows]
            return entities[item]

    def __len__(self) -> int:
        with SessionLocal() as s:
            return len(s.scalars(select(AuditLogModel)).all())

    def __iter__(self) -> Iterator[AuditLog]:
        with SessionLocal() as s:
            stmt = select(AuditLogModel).order_by(desc(AuditLogModel.timestamp))
            rows = s.scalars(stmt).all()
            return iter([orm_to_audit_log(r) for r in rows])


# --- Database Singleton Manager ---

class Database:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._init_storage()
        return cls._instance

    def _init_storage(self):
        init_db()
        with SessionLocal() as session:
            seed_database(session)

        self.users = SqlAlchemyDictAdapter(UserModel, orm_to_user, user_to_orm)
        self.components = SqlAlchemyDictAdapter(ComponentModel, orm_to_component, component_to_orm)
        self.templates = SqlAlchemyDictAdapter(TemplateModel, orm_to_template, template_to_orm)
        self.modules = SqlAlchemyDictAdapter(ModuleModel, orm_to_module, module_to_orm)
        self.rules = SqlAlchemyDictAdapter(RuleModel, orm_to_rule, rule_to_orm)
        self.architectures = SqlAlchemyDictAdapter(ArchitectureModel, orm_to_architecture, architecture_to_orm)
        self.specifications = SqlAlchemyDictAdapter(SpecificationModel, orm_to_specification, specification_to_orm)
        self.projects = SqlAlchemyDictAdapter(ProjectModel, orm_to_project, project_to_orm)
        self.blueprints = SqlAlchemyDictAdapter(BlueprintModel, orm_to_blueprint, blueprint_to_orm)
        self.audit_logs = SqlAlchemyAuditLogsAdapter()
        self._reconcile_links()

    def _reconcile_links(self):
        """Ensures bidirectional consistency between Project.blueprint_id and Blueprint.project_id on startup."""
        for prj in self.projects.values():
            if prj.blueprint_id:
                bp = self.blueprints.get(prj.blueprint_id)
                if bp and bp.project_id != prj.id:
                    bp.project_id = prj.id
                    if isinstance(bp.raw_blueprint_json, dict):
                        bp.raw_blueprint_json["project_id"] = prj.id
                    self.blueprints[bp.id] = bp
        for bp in self.blueprints.values():
            if bp.project_id:
                prj = self.projects.get(bp.project_id)
                if prj and not prj.blueprint_id:
                    prj.blueprint_id = bp.id
                    self.projects[prj.id] = prj

    @property
    def active_user_id(self) -> str:
        with SessionLocal() as s:
            state = s.get(SystemStateModel, "active_user_id")
            if state and state.value and "user_id" in state.value:
                return state.value["user_id"]
            return "usr_admin01"

    @active_user_id.setter
    def active_user_id(self, user_id: str):
        with SessionLocal() as s:
            s.merge(SystemStateModel(key="active_user_id", value={"user_id": user_id}))
            s.commit()

    def get_current_user(self) -> User:
        user_id = self.active_user_id
        user = self.users.get(user_id)
        if user:
            return user
        all_users = self.users.values()
        if all_users:
            for u in all_users:
                if u.role == RoleName.GLOBAL_ADMIN:
                    return u
            return all_users[0]
        return User(
            id="usr_bootstrap_admin",
            name="Global Admin (Aguardando Primeiro Cadastro)",
            email="admin@olivelas.com.br",
            role=RoleName.GLOBAL_ADMIN,
        )


# Global singleton instance
db = Database()
