"""
Catalog APIs (Components, Templates, Modules, Rules, Architectures, Specifications)
Includes 360° Knowledge Graph Relations, CRUD, SemVer lifecycle transitions, and Restore
"""
from __future__ import annotations
from typing import Any
from fastapi import APIRouter, Depends, Query, HTTPException, status
from pydantic import BaseModel, Field
from app.domain.entities import (
    Component,
    Template,
    Module,
    Rule,
    RuleCategory,
    RulePriority,
    Architecture,
    Specification,
    EntityLifecycleStatus,
    Entity360Response,
    CreateComponentSchema,
    UpdateComponentSchema,
    CreateModuleSchema,
    UpdateModuleSchema,
    CreateTemplateSchema,
    UpdateTemplateSchema,
    CreateRuleSchema,
    UpdateRuleSchema,
    CreateSpecificationSchema,
    UpdateSpecificationSchema,
    CreateArchitectureSchema,
    UpdateArchitectureSchema,
    VersionSnapshot,
    ApiResponse,
    ApiListResponse,
    ApiMeta,
)
from app.services.catalog_management_service import CatalogManagementService
from app.services.versioning_service import versioning_service
from app.services.rbac_service import rbac_service
from app.api.v1.iam_api import get_current_user_claims

router = APIRouter(tags=["Building Blocks & Knowledge Catalogs"])


def get_catalog_service() -> CatalogManagementService:
    return CatalogManagementService()


class CreateVersionRequest(BaseModel):
    version: str
    changelog: str


class RestoreVersionRequest(BaseModel):
    version: str


class TransitionStatusRequest(BaseModel):
    status: EntityLifecycleStatus


# ---------------------------------------------------------------------------
# 360° Knowledge Graph Relations
# ---------------------------------------------------------------------------
@router.get("/relations/{entity_type}/{entity_id}", response_model=ApiResponse[Entity360Response])
@router.get("/catalog/relations/{entity_type}/{entity_id}", response_model=ApiResponse[Entity360Response])
async def get_entity_relations(
    entity_type: str,
    entity_id: str,
    service: CatalogManagementService = Depends(get_catalog_service),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    res = service.get_entity_360_relations(entity_type=entity_type, entity_id=entity_id)
    return ApiResponse(data=res)


# ---------------------------------------------------------------------------
# Versioning & Restore Endpoints
# ---------------------------------------------------------------------------
@router.post("/catalog/{entity_type}/{entity_id}/versions", response_model=ApiResponse[VersionSnapshot])
async def create_version_snapshot(entity_type: str, entity_id: str, body: CreateVersionRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("update")
    snap = versioning_service.create_version_snapshot(
        entity_type=entity_type,
        entity_id=entity_id,
        new_version=body.version,
        changelog=body.changelog,
    )
    return ApiResponse(data=snap)


@router.post("/catalog/{entity_type}/{entity_id}/restore")
async def restore_entity_version(entity_type: str, entity_id: str, body: RestoreVersionRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("restore")
    restored = versioning_service.restore_version(
        entity_type=entity_type,
        entity_id=entity_id,
        target_version=body.version,
    )
    return ApiResponse(data=restored)


@router.post("/catalog/{entity_type}/{entity_id}/status")
async def transition_entity_status(entity_type: str, entity_id: str, body: TransitionStatusRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("update")
    res = versioning_service.transition_lifecycle(
        entity_type=entity_type,
        entity_id=entity_id,
        new_status=body.status,
    )
    return ApiResponse(data=res)


def _paginate_items(items: list[Any], page: int, page_size: int | None) -> tuple[list[Any], ApiMeta]:
    total = len(items)
    if page_size is not None:
        start = (page - 1) * page_size
        paged = items[start : start + page_size]
        eff_size = page_size
    else:
        paged = items
        eff_size = total or 20
    return paged, ApiMeta(page=page, page_size=eff_size, total=total)


# ---------------------------------------------------------------------------
# Components
# ---------------------------------------------------------------------------
@router.get("/components", response_model=ApiListResponse[Component])
async def list_components(
    category: str | None = None,
    status: EntityLifecycleStatus | None = None,
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1, le=500),
    service: CatalogManagementService = Depends(get_catalog_service),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    comps = service.list_components(category=category, status=status, search=search)
    paged, meta = _paginate_items(comps, page, page_size)
    return ApiListResponse(data=paged, meta=meta)


@router.get("/components/{component_id}", response_model=ApiResponse[Component])
async def get_component(component_id: str, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    comp = service.get_component(component_id)
    return ApiResponse(data=comp)


@router.post("/components", response_model=ApiResponse[Component], status_code=status.HTTP_201_CREATED)
async def create_component(body: CreateComponentSchema, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("create")
    comp = service.create_component(
        name=body.name,
        description=body.description,
        category=body.category,
        tags=body.tags,
        dependencies=body.dependencies,
        documentation=body.documentation,
        interface_spec=body.interface_spec,
        example_usage=body.example_usage,
        version=body.version,
        status=body.status,
    )
    return ApiResponse(data=comp)


@router.put("/components/{component_id}", response_model=ApiResponse[Component])
async def update_component(component_id: str, body: UpdateComponentSchema, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("update")
    comp = service.update_component(component_id, body.model_dump(exclude_unset=True))
    return ApiResponse(data=comp)


@router.delete("/components/{component_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_component(component_id: str, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("delete")
    service.delete_component(component_id)
    return None


@router.post("/components/{component_id}/publish", response_model=ApiResponse[Component])
async def publish_component(component_id: str, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("publish")
    comp = service.publish_component(component_id)
    return ApiResponse(data=comp)


@router.post("/components/{component_id}/deprecate", response_model=ApiResponse[Component])
async def deprecate_component(component_id: str, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("deprecate")
    comp = service.deprecate_component(component_id)
    return ApiResponse(data=comp)


# ---------------------------------------------------------------------------
# Templates
# ---------------------------------------------------------------------------
@router.get("/templates", response_model=ApiListResponse[Template])
async def list_templates(
    category: str | None = None,
    status: EntityLifecycleStatus | None = None,
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1, le=500),
    service: CatalogManagementService = Depends(get_catalog_service),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    tpls = service.list_templates(category=category, status=status, search=search)
    paged, meta = _paginate_items(tpls, page, page_size)
    return ApiListResponse(data=paged, meta=meta)


@router.get("/templates/{template_id}", response_model=ApiResponse[Template])
async def get_template(template_id: str, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    tpl = service.get_template(template_id)
    return ApiResponse(data=tpl)


@router.post("/templates", response_model=ApiResponse[Template], status_code=status.HTTP_201_CREATED)
async def create_template(body: CreateTemplateSchema, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("create")
    tpl = service.create_template(
        name=body.name,
        description=body.description,
        category=body.category,
        components=body.components,
        modules=body.modules,
        rules=body.rules,
        architecture=body.architecture,
        version=body.version,
        status=body.status,
    )
    return ApiResponse(data=tpl)


@router.put("/templates/{template_id}", response_model=ApiResponse[Template])
async def update_template(template_id: str, body: UpdateTemplateSchema, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("update")
    tpl = service.update_template(template_id, body.model_dump(exclude_unset=True))
    return ApiResponse(data=tpl)


@router.delete("/templates/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(template_id: str, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("delete")
    service.delete_template(template_id)
    return None


# ---------------------------------------------------------------------------
# Modules
# ---------------------------------------------------------------------------
@router.get("/modules", response_model=ApiListResponse[Module])
async def list_modules(
    category: str | None = None,
    status: EntityLifecycleStatus | None = None,
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1, le=500),
    service: CatalogManagementService = Depends(get_catalog_service),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    mods = service.list_modules(category=category, status=status, search=search)
    paged, meta = _paginate_items(mods, page, page_size)
    return ApiListResponse(data=paged, meta=meta)


@router.get("/modules/{module_id}", response_model=ApiResponse[Module])
async def get_module(module_id: str, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    mod = service.get_module(module_id)
    return ApiResponse(data=mod)


@router.post("/modules", response_model=ApiResponse[Module], status_code=status.HTTP_201_CREATED)
async def create_module(body: CreateModuleSchema, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("create")
    mod = service.create_module(
        name=body.name,
        description=body.description,
        components=body.components,
        apis=body.apis,
        rules=body.rules,
        dependencies=body.dependencies,
        specifications=body.specifications,
        templates=body.templates,
        tags=body.tags,
        version=body.version,
        status=body.status,
    )
    return ApiResponse(data=mod)


@router.put("/modules/{module_id}", response_model=ApiResponse[Module])
async def update_module(module_id: str, body: UpdateModuleSchema, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("update")
    mod = service.update_module(module_id, body.model_dump(exclude_unset=True))
    return ApiResponse(data=mod)


@router.delete("/modules/{module_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_module(module_id: str, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("delete")
    service.delete_module(module_id)
    return None


# ---------------------------------------------------------------------------
# Rules
# ---------------------------------------------------------------------------
@router.get("/rules", response_model=ApiListResponse[Rule])
async def list_rules(
    category: str | None = None,
    priority: str | None = None,
    status: EntityLifecycleStatus | None = None,
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1, le=500),
    service: CatalogManagementService = Depends(get_catalog_service),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    rules = service.list_rules(category=category, priority=priority, status=status, search=search)
    paged, meta = _paginate_items(rules, page, page_size)
    return ApiListResponse(data=paged, meta=meta)


@router.get("/rules/{rule_id}", response_model=ApiResponse[Rule])
async def get_rule(rule_id: str, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rule = service.get_rule(rule_id)
    return ApiResponse(data=rule)


@router.post("/rules", response_model=ApiResponse[Rule], status_code=status.HTTP_201_CREATED)
async def create_rule(body: CreateRuleSchema, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("create")
    rule = service.create_rule(
        name=body.name,
        description=body.description,
        category=body.category,
        priority=body.priority,
        scope=body.scope,
        bad_example=body.bad_example,
        good_example=body.good_example,
        referenced_spec=body.referenced_spec,
        version=body.version,
        status=body.status,
    )
    return ApiResponse(data=rule)


@router.put("/rules/{rule_id}", response_model=ApiResponse[Rule])
async def update_rule(rule_id: str, body: UpdateRuleSchema, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("update")
    rule = service.update_rule(rule_id, body.model_dump(exclude_unset=True))
    return ApiResponse(data=rule)


@router.delete("/rules/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_rule(rule_id: str, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("delete")
    service.delete_rule(rule_id)
    return None


# ---------------------------------------------------------------------------
# Architectures
# ---------------------------------------------------------------------------
@router.get("/architectures", response_model=ApiListResponse[Architecture])
async def list_architectures(
    category: str | None = None,
    status: EntityLifecycleStatus | None = None,
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1, le=500),
    service: CatalogManagementService = Depends(get_catalog_service),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    archs = service.list_architectures(category=category, status=status, search=search)
    paged, meta = _paginate_items(archs, page, page_size)
    return ApiListResponse(data=paged, meta=meta)


@router.get("/architectures/{architecture_id}", response_model=ApiResponse[Architecture])
async def get_architecture(architecture_id: str, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    arch = service.get_architecture(architecture_id)
    return ApiResponse(data=arch)


@router.post("/architectures", response_model=ApiResponse[Architecture], status_code=status.HTTP_201_CREATED)
async def create_architecture(body: CreateArchitectureSchema, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("create")
    arch = service.create_architecture(
        name=body.name,
        description=body.description,
        category=body.category,
        characteristics=body.characteristics,
        recommended_for=body.recommended_for,
        restrictions=body.restrictions,
        layers=body.layers,
        folder_tree=body.folder_tree,
        modules=body.modules,
        components=body.components,
        rules=body.rules,
        specifications=body.specifications,
        version=body.version,
        status=body.status,
    )
    return ApiResponse(data=arch)


@router.put("/architectures/{architecture_id}", response_model=ApiResponse[Architecture])
async def update_architecture(architecture_id: str, body: UpdateArchitectureSchema, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("update")
    arch = service.update_architecture(architecture_id, body.model_dump(exclude_unset=True))
    return ApiResponse(data=arch)


@router.delete("/architectures/{architecture_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_architecture(architecture_id: str, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("delete")
    service.delete_architecture(architecture_id)
    return None


# ---------------------------------------------------------------------------
# Specifications
# ---------------------------------------------------------------------------
@router.get("/specifications", response_model=ApiListResponse[Specification])
async def list_specifications(
    category: str | None = None,
    status: EntityLifecycleStatus | None = None,
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1, le=500),
    service: CatalogManagementService = Depends(get_catalog_service),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    specs = service.list_specifications(category=category, status=status, search=search)
    paged, meta = _paginate_items(specs, page, page_size)
    return ApiListResponse(data=paged, meta=meta)


@router.get("/specifications/{spec_id}", response_model=ApiResponse[Specification])
async def get_specification(spec_id: str, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    spec = service.get_specification(spec_id)
    return ApiResponse(data=spec)


@router.post("/specifications", response_model=ApiResponse[Specification], status_code=status.HTTP_201_CREATED)
async def create_specification(body: CreateSpecificationSchema, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("create")
    spec = service.create_specification(
        name=body.title or body.name,
        description=body.summary or body.description,
        category=body.category,
        content=body.content,
        tags=body.tags,
        related_components=body.related_components,
        related_rules=body.related_rules,
        related_templates=body.related_templates,
        related_architectures=body.related_architectures,
        version=body.version,
        status=body.status,
    )
    return ApiResponse(data=spec)


@router.put("/specifications/{spec_id}", response_model=ApiResponse[Specification])
async def update_specification(spec_id: str, body: UpdateSpecificationSchema, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("update")
    spec = service.update_specification(spec_id, body.model_dump(exclude_unset=True))
    return ApiResponse(data=spec)


@router.delete("/specifications/{spec_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_specification(spec_id: str, service: CatalogManagementService = Depends(get_catalog_service), claims: dict[str, Any] = Depends(get_current_user_claims)):
    rbac_service.require_permission("delete")
    service.delete_specification(spec_id)
    return None
