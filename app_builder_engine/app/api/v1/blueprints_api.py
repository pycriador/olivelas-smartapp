"""
Blueprints Router
Full CRUD, Workshop Composition, Dependency Resolution, Validation Diagnostics, and Deterministic JSON Export
"""
from __future__ import annotations
from datetime import datetime, timezone
import json
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query, status, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, model_validator
from app.domain.entities import (
    Blueprint,
    BlueprintBuildRequest,
    UpdateBlueprintSchema,
    BlueprintStatus,
    BlueprintValidationResult,
    ApiResponse,
    ApiListResponse,
    ApiMeta,
    AuditAction,
    AuditLog,
)
from app.storage.database import db
from app.services.blueprint_validation_service import blueprint_validation_service
from app.services.project_service import sync_blueprint_to_project
from app.services.rbac_service import rbac_service
from app.api.v1.iam_api import get_current_user_claims

router = APIRouter(prefix="/blueprints", tags=["Blueprints"])


class BlueprintCreateRequest(BaseModel):
    name: str = Field(..., min_length=2)
    description: str = ""
    project_id: str | None = None
    architecture_id: str = "arch_loft_standard_fullstack"
    features: list[str] = Field(default_factory=list)
    modules: list[str] = Field(default_factory=list)
    components: list[str] = Field(default_factory=list)
    templates: list[str] = Field(default_factory=list)
    integrations: list[str] = Field(default_factory=list)
    rules: list[str] = Field(default_factory=list)
    specifications: list[str] = Field(default_factory=list)


class ResolveDependenciesRequest(BaseModel):
    architecture_id: str = "arch_loft_standard_fullstack"
    module_ids: list[str] = Field(default_factory=list)
    component_ids: list[str] = Field(default_factory=list)
    template_ids: list[str] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def normalize_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("module_ids"):
                values["module_ids"] = values.get("modules") or values.get("identified_modules") or []
            if not values.get("component_ids"):
                values["component_ids"] = values.get("components") or values.get("identified_components") or []
            if not values.get("template_ids"):
                values["template_ids"] = values.get("templates") or values.get("identified_templates") or []
        return values


class ValidateConfigRequest(BaseModel):
    architecture_id: str = "arch_loft_standard_fullstack"
    module_ids: list[str] = Field(default_factory=list)
    component_ids: list[str] = Field(default_factory=list)
    template_ids: list[str] = Field(default_factory=list)
    rule_ids: list[str] = Field(default_factory=list)
    specification_ids: list[str] = Field(default_factory=list)
    ui_library: str | None = Field(
        default=None,
        description="Stack/biblioteca de UI declarada no projeto (ex.: 'copan', 'antd', 'mui', 'tailwind'). O Copan ('@loft/react-loft') é mandatório para toda aplicação padrão Loft — declarar outra biblioteca não rebaixa a severidade das regras Copan, apenas é citado no diagnóstico para orientar a migração.",
    )
    dependencies: list[str] | dict[str, Any] | None = Field(
        default=None,
        description="Lista ou mapa de dependências reais do projeto (ex.: package.json dependencies) para auditoria de conformidade real além da declaração.",
    )
    package_json: dict[str, Any] | None = Field(
        default=None,
        description="Conteúdo integral do package.json do frontend para inspeção de conformidade real (verifica uso de '@loft/react-loft'/'@loft/tokens-loft' vs bibliotecas externas como antd/MUI).",
    )
    source_files: dict[str, str] | None = Field(
        default=None,
        description="Mapa de arquivos de código-fonte (caminho -> conteúdo) para auditoria estática de tokens Copan e detecção de cores hexadecimais hardcoded.",
    )

    @model_validator(mode="before")
    @classmethod
    def normalize_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("module_ids"):
                values["module_ids"] = values.get("modules") or values.get("identified_modules") or []
            if not values.get("component_ids"):
                values["component_ids"] = values.get("components") or values.get("identified_components") or []
            if not values.get("template_ids"):
                values["template_ids"] = values.get("templates") or values.get("identified_templates") or []
            if not values.get("rule_ids"):
                values["rule_ids"] = values.get("rules") or values.get("identified_rules") or []
            if not values.get("specification_ids"):
                values["specification_ids"] = values.get("specifications") or values.get("identified_specifications") or []
            if not values.get("ui_library"):
                values["ui_library"] = (
                    values.get("ui_framework")
                    or values.get("ui_stack")
                    or values.get("frontend_library")
                    or None
                )
        return values


@router.get("", response_model=ApiListResponse[Blueprint])
async def list_blueprints(
    project_id: str | None = Query(None),
    status: str | None = Query(None),
    architecture_id: str | None = Query(None),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1, le=500),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    bps = list(db.blueprints.values())
    if project_id:
        bps = [b for b in bps if b.project_id == project_id]
    if status:
        st_lower = status.lower()
        bps = [
            b for b in bps
            if (b.status.value if hasattr(b.status, "value") else str(b.status)).lower() == st_lower
        ]
    if architecture_id:
        bps = [
            b for b in bps
            if b.architecture_id == architecture_id or (b.architecture_name and b.architecture_name.lower() == architecture_id.lower())
        ]
    if search:
        q = search.lower()
        bps = [
            b for b in bps
            if q in b.name.lower()
            or q in (b.description or "").lower()
            or q in (b.architecture_name or "").lower()
            or q in b.id.lower()
        ]
    total = len(bps)
    if page_size is not None:
        start = (page - 1) * page_size
        paged = bps[start : start + page_size]
        eff_size = page_size
    else:
        paged = bps
        eff_size = total or 20
    return ApiListResponse(
        data=paged,
        meta=ApiMeta(page=page, page_size=eff_size, total=total),
    )


@router.get("/{blueprint_id}", response_model=ApiResponse[Blueprint])
async def get_blueprint(blueprint_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    bp = db.blueprints.get(blueprint_id)
    if not bp:
        raise HTTPException(status_code=404, detail=f"Blueprint '{blueprint_id}' não encontrado.")
    return ApiResponse(data=bp)


@router.post("/resolve-dependencies")
async def resolve_dependencies(body: ResolveDependenciesRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    """Calculates all transitive dependencies for selected components, modules, and templates."""
    result = blueprint_validation_service.resolve_dependencies(
        architecture_id=body.architecture_id,
        module_ids=body.module_ids,
        component_ids=body.component_ids,
        template_ids=body.template_ids,
    )
    return ApiResponse(data=result)


@router.post(
    "/validate-config",
    response_model=ApiResponse[BlueprintValidationResult],
    responses={
        200: {
            "description": (
                "Configuração publicável (`data.can_publish = true`, `data.status` em `'ready'` ou `'warning'`). "
                "Nota importante: quando `data.validation_scope = 'declarative_manifest'`, `status = 'ready'` "
                "atesta **declaração consistente do manifesto**, e não código-fonte auditado. Para auditar conformidade "
                "real de código e dependências, envie `package_json`, `dependencies` ou `source_files` "
                "(`data.validation_scope = 'code_and_manifest_audited'`)."
            ),
        },
        422: {
            "description": (
                "Erro de validação (`VALIDATION_ERROR`): retornado quando há diagnósticos `CRITICAL`, `ERROR` ou "
                "`data.can_publish = false` (por exemplo, `architecture_id` inexistente, ou ausência das regras Copan — "
                "mandatórias para toda aplicação com componentes de frontend, sem exceção por `ui_library` declarada). "
                "Mantém `data` (`status`, `can_publish`, `diagnostics[]`) e `error` (`code = 'VALIDATION_ERROR'`) no envelope."
            ),
        },
    },
)
async def validate_config(body: ValidateConfigRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    """
    Executa validação diagnóstica sobre a configuração de um Blueprint.

    - **Envelope e Status HTTP**:
      - Retorna **HTTP 200** quando `data.can_publish == true` (`data.status` é `"ready"` ou `"warning"`).
      - Retorna **HTTP 422 (`VALIDATION_ERROR`)** quando há diagnósticos `CRITICAL`/`ERROR` ou `data.can_publish == false`,
        mantendo `data` (`data.status`, `data.can_publish`, `data.diagnostics[]`) e `diagnostics[]` no corpo da resposta.
    - **Escopo da Validação (`data.validation_scope` e `data.status_meaning`)**:
      - Em modo declarativo (`validation_scope = "declarative_manifest"`), `status = "ready"` significa **declaração consistente**
        entre os IDs informados no manifesto, e **não código-fonte auditado**.
      - Quando `ui_library`, `dependencies`, `package_json` ou `source_files` são fornecidos, o motor executa inspeção real
        de stack/tokens (`validation_scope = "code_and_manifest_audited"`).
      - As regras de UI do Copan (`rul_copan_01_brand_orange`, `rul_copan_02_tokens_only`, `rul_copan_07_component_library_mandatory`)
        são **sempre `CRITICAL`** quando há componentes de frontend (`can_publish = false`, HTTP 422) — declarar `ui_library`
        diferente de Copan (ex.: `'antd'`) não rebaixa mais a severidade; o Copan é mandatório para toda aplicação padrão Loft.
    """
    result = blueprint_validation_service.validate_blueprint_configuration(
        architecture_id=body.architecture_id,
        module_ids=body.module_ids,
        component_ids=body.component_ids,
        template_ids=body.template_ids,
        rule_ids=body.rule_ids,
        specification_ids=body.specification_ids,
        ui_library=body.ui_library,
        dependencies=body.dependencies,
        package_json=body.package_json,
        source_files=body.source_files,
    )

    if not result.can_publish or result.critical_count > 0:
        payload_data = result.model_dump(mode="json")
        diagnostics_dump = [d.model_dump(mode="json") for d in result.diagnostics]
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "data": payload_data,
                "status": result.status,
                "can_publish": result.can_publish,
                "validation_scope": result.validation_scope,
                "conformance_mode": result.conformance_mode,
                "status_meaning": result.status_meaning,
                "diagnostics": diagnostics_dump,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": (
                        f"Configuração do Blueprint inválida para publicação: "
                        f"{result.critical_count} violação(ões) CRITICAL e {result.error_count} erro(s) de dependência."
                    ),
                    "details": {
                        "status": result.status,
                        "can_publish": result.can_publish,
                        "critical_count": result.critical_count,
                        "error_count": result.error_count,
                        "warning_count": result.warning_count,
                        "validation_scope": result.validation_scope,
                        "status_meaning": result.status_meaning,
                        "diagnostics": diagnostics_dump,
                    },
                },
                "meta": {
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "version": "2.4.0",
                    "status": result.status,
                    "can_publish": result.can_publish,
                    "validation_scope": result.validation_scope,
                    "conformance_mode": result.conformance_mode,
                    "status_meaning": result.status_meaning,
                },
            },
        )

    return ApiResponse(data=result)


@router.post("/build", response_model=ApiResponse[Blueprint], status_code=status.HTTP_201_CREATED)
async def build_custom_blueprint(body: BlueprintBuildRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    """Builds and stores a new Blueprint with automatic dependency resolution and validation."""
    rbac_service.require_permission("create")
    current_user = db.get_current_user()

    # 1. Resolve dependencies
    resolved = blueprint_validation_service.resolve_dependencies(
        architecture_id=body.architecture_id,
        module_ids=body.module_ids,
        component_ids=body.component_ids,
        template_ids=body.template_ids,
    )

    all_modules = sorted(list(set(body.module_ids + resolved["resolved_modules"])))
    all_components = sorted(list(set(body.component_ids + resolved["resolved_components"])))
    all_rules = sorted(list(set(body.rule_ids + resolved["resolved_rules"])))
    all_specs = sorted(list(set(body.specification_ids + resolved["resolved_specifications"])))

    # 2. Validate
    validation = blueprint_validation_service.validate_blueprint_configuration(
        architecture_id=body.architecture_id,
        module_ids=all_modules,
        component_ids=all_components,
        template_ids=body.template_ids,
        rule_ids=all_rules,
        specification_ids=all_specs,
    )

    arch = db.architectures.get(body.architecture_id)
    arch_name = arch.name if arch else "Modular Monolith"

    # 3. Assemble JSON contract
    raw_json = {
        "name": body.name,
        "project_id": body.project_id,
        "version": "1.0.0",
        "status": "ready" if validation.can_publish else "draft",
        "architecture": {"id": body.architecture_id, "name": arch_name},
        "modules": all_modules,
        "components": all_components,
        "templates": body.template_ids,
        "rules": all_rules,
        "specifications": all_specs,
        "validation": {
            "status": validation.status,
            "can_publish": validation.can_publish,
            "critical_count": validation.critical_count,
            "error_count": validation.error_count,
            "validation_scope": validation.validation_scope,
            "status_meaning": validation.status_meaning,
        },
    }

    bp = Blueprint(
        name=body.name,
        description=body.description,
        project_id=body.project_id,
        architecture_id=body.architecture_id,
        architecture_name=arch_name,
        modules=all_modules,
        components=all_components,
        templates=body.template_ids,
        rules=all_rules,
        specifications=all_specs,
        dependencies=resolved.get("resolved_dependencies", []),
        status=BlueprintStatus.READY if validation.can_publish else BlueprintStatus.DRAFT,
        validation=validation,
        raw_blueprint_json=raw_json,
    )

    db.blueprints[bp.id] = bp

    # Bidirectional sync with project if project_id was provided
    if body.project_id:
        sync_blueprint_to_project(bp, body.project_id)
        if body.project_id in db.projects:
            prj = db.projects[body.project_id]
            prj.modules = all_modules
            prj.components = all_components
            prj.templates = body.template_ids
            prj.rules = all_rules
            db.projects[prj.id] = prj

    db.audit_logs.insert(
        0,
        AuditLog(
            actor=current_user.email,
            action=AuditAction.CREATE,
            resource="Blueprint",
            resource_id=bp.id,
            metadata={"name": bp.name, "status": bp.status.value, "project_id": bp.project_id},
        ),
    )

    return ApiResponse(data=bp)


@router.post("/{blueprint_id}/validate", response_model=ApiResponse[BlueprintValidationResult])
async def validate_existing_blueprint(blueprint_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    """Re-runs validation on an existing blueprint."""
    bp = db.blueprints.get(blueprint_id)
    if not bp:
        raise HTTPException(status_code=404, detail=f"Blueprint '{blueprint_id}' não encontrado.")

    result = blueprint_validation_service.validate_blueprint_configuration(
        architecture_id=bp.architecture_id,
        module_ids=bp.modules,
        component_ids=bp.components,
        template_ids=bp.templates,
        rule_ids=bp.rules,
        specification_ids=bp.specifications,
    )
    bp.validation = result
    bp.status = BlueprintStatus.READY if result.can_publish else BlueprintStatus.DRAFT
    db.blueprints[bp.id] = bp
    return ApiResponse(data=result)


@router.post("/{blueprint_id}/publish", response_model=ApiResponse[Blueprint])
async def publish_blueprint(blueprint_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    """Publishes a blueprint. Blocks if critical or error diagnostic violations exist."""
    rbac_service.require_permission("publish")
    bp = db.blueprints.get(blueprint_id)
    if not bp:
        raise HTTPException(status_code=404, detail=f"Blueprint '{blueprint_id}' não encontrado.")

    # Validate first
    val = blueprint_validation_service.validate_blueprint_configuration(
        architecture_id=bp.architecture_id,
        module_ids=bp.modules,
        component_ids=bp.components,
        template_ids=bp.templates,
        rule_ids=bp.rules,
        specification_ids=bp.specifications,
    )
    bp.validation = val

    if not val.can_publish:
        db.blueprints[bp.id] = bp
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Não é possível publicar: O Blueprint possui {val.critical_count} erro(s) crítico(s) e {val.error_count} erro(s) de dependência.",
        )

    bp.status = BlueprintStatus.PUBLISHED
    db.blueprints[bp.id] = bp
    current_user = db.get_current_user()

    db.audit_logs.insert(
        0,
        AuditLog(
            actor=current_user.email,
            action=AuditAction.PUBLISH,
            resource="Blueprint",
            resource_id=bp.id,
            metadata={"name": bp.name, "version": bp.version},
        ),
    )

    return ApiResponse(data=bp)


@router.get("/{blueprint_id}/download")
async def download_blueprint_json(blueprint_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    """Returns the deterministic JSON blueprint as an attachment download."""
    bp = db.blueprints.get(blueprint_id)
    if not bp:
        raise HTTPException(status_code=404, detail=f"Blueprint '{blueprint_id}' não encontrado.")

    content = json.dumps(bp.raw_blueprint_json or bp.model_dump(), indent=2, ensure_ascii=False)
    filename = f"blueprint-{bp.slug or bp.id}.json"
    return Response(
        content=content,
        media_type="application/json",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.put("/{blueprint_id}", response_model=ApiResponse[Blueprint])
async def update_blueprint(blueprint_id: str, body: UpdateBlueprintSchema, claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("update")
    bp = db.blueprints.get(blueprint_id)
    if not bp:
        raise HTTPException(status_code=404, detail=f"Blueprint '{blueprint_id}' não encontrado.")
    
    current_user = db.get_current_user()

    if body.name is not None:
        bp.name = body.name
    if body.slug is not None:
        bp.slug = body.slug
    if body.description is not None:
        bp.description = body.description
    if body.architecture_id is not None:
        bp.architecture_id = body.architecture_id
        arch = db.architectures.get(body.architecture_id)
        if arch:
            bp.architecture_name = arch.name
    if "project_id" in body.model_fields_set:
        sync_blueprint_to_project(bp, body.project_id)
    if body.version is not None:
        bp.version = body.version
    if body.status is not None:
        bp.status = body.status

    # Modules, components, templates, rules, specifications
    if body.modules is not None:
        bp.modules = body.modules
    elif body.module_ids is not None:
        bp.modules = body.module_ids

    if body.components is not None:
        bp.components = body.components
    elif body.component_ids is not None:
        bp.components = body.component_ids

    if body.templates is not None:
        bp.templates = body.templates
    elif body.template_ids is not None:
        bp.templates = body.template_ids

    if body.rules is not None:
        bp.rules = body.rules
    elif body.rule_ids is not None:
        bp.rules = body.rule_ids

    if body.specifications is not None:
        bp.specifications = body.specifications
    elif body.specification_ids is not None:
        bp.specifications = body.specification_ids

    # Re-validate and recalculate diagnostics
    validation = blueprint_validation_service.validate_blueprint_configuration(
        architecture_id=bp.architecture_id,
        module_ids=bp.modules,
        component_ids=bp.components,
        template_ids=bp.templates,
        rule_ids=bp.rules,
        specification_ids=bp.specifications,
    )
    bp.validation = validation

    # Reassemble raw JSON contract
    bp.raw_blueprint_json = {
        "id": bp.id,
        "name": bp.name,
        "project_id": bp.project_id,
        "version": bp.version,
        "status": bp.status.value if hasattr(bp.status, "value") else str(bp.status),
        "architecture": {"id": bp.architecture_id, "name": bp.architecture_name},
        "modules": bp.modules,
        "components": bp.components,
        "templates": bp.templates,
        "rules": bp.rules,
        "specifications": bp.specifications,
        "validation": {
            "status": validation.status,
            "can_publish": validation.can_publish,
            "critical_count": validation.critical_count,
            "error_count": validation.error_count,
            "validation_scope": validation.validation_scope,
            "status_meaning": validation.status_meaning,
        },
    }
            
    db.blueprints[blueprint_id] = bp

    db.audit_logs.insert(
        0,
        AuditLog(
            actor=current_user.email,
            action=AuditAction.UPDATE,
            resource="Blueprint",
            resource_id=bp.id,
            metadata={"name": bp.name, "version": bp.version, "project_id": bp.project_id},
        ),
    )

    return ApiResponse(data=bp)


@router.delete("/{blueprint_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blueprint(blueprint_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("delete")
    current_user = db.get_current_user()
    if blueprint_id in db.blueprints:
        bp = db.blueprints.get(blueprint_id)
        if bp and bp.project_id:
            sync_blueprint_to_project(bp, None)
        del db.blueprints[blueprint_id]
        db.audit_logs.insert(
            0,
            AuditLog(
                actor=current_user.email,
                action=AuditAction.DELETE,
                resource="Blueprint",
                resource_id=blueprint_id,
                metadata={"name": bp.name if bp else blueprint_id},
            ),
        )
    return None
