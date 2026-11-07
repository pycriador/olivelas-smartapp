"""
AI Agent Gateway Router
Dedicated structured endpoints consumed by external AI Agents (Cursor, Claude, Antigravity)
"""
from __future__ import annotations
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from app.domain.entities import Blueprint, UpdateBlueprintSchema, ApiListResponse, ApiMeta
from app.services.ai_composition_service import (
    AICompositionService,
    AICompositionRequest,
    AICompositionResponse,
)
from app.services.global_search_service import GlobalSearchService, SearchResultItem
from app.services.project_service import sync_blueprint_to_project
from app.storage.database import db

router = APIRouter(prefix="/ai", tags=["AI Agent Gateway"])


def get_ai_composition_service() -> AICompositionService:
    return AICompositionService()


def get_search_service() -> GlobalSearchService:
    return GlobalSearchService()


class AISearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    limit: int = Field(default=10, ge=1, le=50)


@router.get("/components")
async def ai_list_components():
    """Returns AI-optimized structured list of components with full contracts, methods, props, and reference code."""
    return [
        {
            "type": "component",
            "component_type": c.type,
            "id": c.id,
            "name": c.name,
            "category": c.category,
            "version": c.version,
            "status": c.status.value,
            "dependencies": c.dependencies,
            "rules": c.rules,
            "specifications": c.specifications,
            "props_contract": c.props_contract,
            "interface_spec": c.interface_spec,
            "preview_code": c.preview_code,
            "example_usage": c.example_usage,
            "documentation": c.documentation,
        }
        for c in db.components.values()
    ]


@router.get("/templates")
async def ai_list_templates():
    """Returns AI-optimized list of templates."""
    return [
        {
            "type": "template",
            "id": t.id,
            "name": t.name,
            "category": t.category,
            "version": t.version,
            "architecture": t.architecture,
            "architecture_id": t.architecture_id,
            "components": t.components,
            "modules": t.modules,
            "rules": t.rules,
            "specifications": t.specifications,
        }
        for t in db.templates.values()
    ]


@router.get("/rules")
async def ai_list_rules():
    """Returns AI-optimized list of mandatory architectural and security rules with schemas and examples."""
    return [
        {
            "type": "rule",
            "id": r.id,
            "name": r.name,
            "category": r.category.value,
            "priority": r.priority.value,
            "scope": r.scope,
            "description": r.description,
            "rule_statement": r.rule_statement,
            "bad_example": r.bad_example,
            "good_example": r.good_example,
            "examples": r.examples,
            "json_schema": r.json_schema,
            "error_codes_table": r.error_codes_table,
            "referenced_spec": r.referenced_spec,
        }
        for r in db.rules.values()
    ]


@router.get("/architectures")
async def ai_list_architectures():
    """Returns AI-optimized list of architectures with folder trees and constraints."""
    return [
        {
            "type": "architecture",
            "id": a.id,
            "name": a.name,
            "description": a.description,
            "layers": a.layers,
            "characteristics": a.characteristics,
            "recommended_for": a.recommended_for,
            "restrictions": a.restrictions,
            "folder_tree": a.folder_tree,
            "modules": a.modules,
            "components": a.components,
            "rules": a.rules,
            "specifications": a.specifications,
        }
        for a in db.architectures.values()
    ]


@router.get("/specifications")
async def ai_list_specifications():
    """Returns AI-optimized list of technical specifications."""
    return [
        {
            "type": "specification",
            "id": s.id,
            "name": s.name,
            "category": s.category,
            "version": s.version,
            "tags": s.tags,
            "content_summary": s.description,
            "content": s.content,
        }
        for s in db.specifications.values()
    ]


@router.post("/search", response_model=list[SearchResultItem])
async def ai_search(body: AISearchRequest, service: GlobalSearchService = Depends(get_search_service)):
    """AI Agent search across all knowledge and building blocks."""
    return service.search(query=body.query, limit=body.limit)


@router.get("/blueprints", response_model=ApiListResponse[Blueprint])
async def ai_list_blueprints(
    search: str | None = None,
    status: str | None = None,
    page: int = 1,
    page_size: int | None = None,
):
    """Returns list of all composed and custom blueprints with synchronized project_id."""
    bps = list(db.blueprints.values())
    if search:
        q = search.lower()
        bps = [
            b for b in bps
            if q in b.name.lower() or q in b.description.lower() or q in b.id.lower()
        ]
    if status:
        bps = [
            b for b in bps
            if (b.status.value if hasattr(b.status, "value") else str(b.status)).lower() == status.lower()
        ]
    total = len(bps)
    eff_size = page_size if page_size is not None else (total or 20)
    p = max(1, page)
    ps = max(1, eff_size)
    start = (p - 1) * ps
    return ApiListResponse(
        data=bps[start : start + ps],
        meta=ApiMeta(page=p, page_size=ps, total=total),
    )


@router.get("/blueprints/{blueprint_id}")
async def ai_get_blueprint(blueprint_id: str):
    """Returns a specific blueprint by ID with full envelope and top-level fields (including synchronized project_id)."""
    bp = db.blueprints.get(blueprint_id)
    if not bp:
        raise HTTPException(status_code=404, detail=f"Blueprint '{blueprint_id}' não encontrado.")
    bp_dump = bp.model_dump(mode="json")
    return {
        **bp_dump,
        "blueprint_id": bp.id,
        "data": bp_dump,
        "error": None,
        "meta": {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "version": "2.4.0",
        },
    }


@router.put("/blueprints/{blueprint_id}")
async def ai_update_blueprint(blueprint_id: str, body: UpdateBlueprintSchema):
    """Updates a blueprint via the AI Gateway router and maintains bidirectional project_id <-> blueprint_id sync."""
    bp = db.blueprints.get(blueprint_id)
    if not bp:
        raise HTTPException(status_code=404, detail=f"Blueprint '{blueprint_id}' não encontrado.")
    if "project_id" in body.model_fields_set:
        sync_blueprint_to_project(bp, body.project_id)
    if body.name is not None:
        bp.name = body.name
    if body.description is not None:
        bp.description = body.description
    db.blueprints[bp.id] = bp
    bp_dump = bp.model_dump(mode="json")
    return {
        **bp_dump,
        "blueprint_id": bp.id,
        "data": bp_dump,
        "error": None,
        "meta": {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "version": "2.4.0",
        },
    }


@router.post("/blueprints/compose", response_model=AICompositionResponse, status_code=status.HTTP_200_OK)
@router.post("/compose-blueprint", response_model=AICompositionResponse, status_code=status.HTTP_200_OK)
async def ai_compose_blueprint(
    body: AICompositionRequest,
    service: AICompositionService = Depends(get_ai_composition_service),
):
    """
    AI Blueprint Composition Engine.
    Receives application requirements, maps to modules, components, templates, rules, and architecture,
    and returns a structured Blueprint wrapped in `{ data, meta }` with optional live AI Gateway reasoning.
    """
    return await service.compose_blueprint_async(body)
