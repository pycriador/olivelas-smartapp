"""
Settings API Router v1 — Centralized Categories, System Settings, and RBAC Endpoints
"""
from __future__ import annotations
from typing import Any, Optional
from fastapi import APIRouter, Depends, Query, status
from app.domain.entities import ApiResponse, ApiListResponse, ApiMeta
from app.schemas.settings_schemas import (
    CategoryItem,
    CategoryCreateRequest,
    CategoryUpdateRequest,
    CategoryRbacSettings,
    SystemSettingsResponse,
)
from app.services.settings_service import settings_service
from app.api.v1.iam_api import get_current_user_claims

router = APIRouter(prefix="/settings", tags=["System Settings & Categories"])


@router.get("/summary", response_model=ApiResponse[SystemSettingsResponse])
async def get_system_summary():
    res = settings_service.get_system_settings_summary()
    return ApiResponse(data=res)


@router.get("/categories", response_model=ApiListResponse[CategoryItem])
async def list_categories(
    type: Optional[str] = Query(None, description="Filtrar por tipo de entidade"),
    search: Optional[str] = Query(None, description="Buscar por nome, descrição ou tipo"),
    page: int = Query(1, ge=1),
    page_size: Optional[int] = Query(None, ge=1, le=500),
):
    items = settings_service.list_all_categories(entity_type=type)
    if search:
        q = search.lower()
        items = [
            c for c in items
            if q in c.name.lower()
            or q in (c.description or "").lower()
            or q in c.entity_type.lower()
        ]
    total = len(items)
    if page_size is not None:
        start = (page - 1) * page_size
        paged = items[start : start + page_size]
        eff_size = page_size
    else:
        paged = items
        eff_size = total or 50
    return ApiListResponse(
        data=paged,
        meta=ApiMeta(page=page, page_size=eff_size, total=total),
    )


@router.post("/categories", response_model=ApiResponse[CategoryItem], status_code=status.HTTP_201_CREATED)
async def create_category(
    body: CategoryCreateRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    actor_email = claims.get("email", "willian.jesus@loft.com.br")
    actor_role = claims.get("role", "Global Admin")
    res = settings_service.create_category(body, actor_email=actor_email, actor_role=actor_role)
    return ApiResponse(data=res)


@router.put("/categories/{category_id}", response_model=ApiResponse[CategoryItem])
async def update_category(
    category_id: str,
    body: CategoryUpdateRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    actor_email = claims.get("email", "willian.jesus@loft.com.br")
    actor_role = claims.get("role", "Global Admin")
    res = settings_service.update_category(category_id, body, actor_email=actor_email, actor_role=actor_role)
    return ApiResponse(data=res)


@router.delete("/categories/{category_id}", response_model=ApiResponse[dict[str, str]])
async def delete_category(
    category_id: str,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    actor_email = claims.get("email", "willian.jesus@loft.com.br")
    actor_role = claims.get("role", "Global Admin")
    settings_service.delete_category(category_id, actor_email=actor_email, actor_role=actor_role)
    return ApiResponse(data={"message": f"Categoria '{category_id}' excluída com sucesso."})


@router.get("/rbac", response_model=ApiResponse[CategoryRbacSettings])
async def get_rbac_settings():
    res = settings_service._get_rbac_settings()
    return ApiResponse(data=res)


@router.put("/rbac", response_model=ApiResponse[CategoryRbacSettings])
async def update_rbac_settings(
    body: CategoryRbacSettings,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    actor_email = claims.get("email", "willian.jesus@loft.com.br")
    res = settings_service.update_rbac_settings(body, actor_email=actor_email)
    return ApiResponse(data=res)
