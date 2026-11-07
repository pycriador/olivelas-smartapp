"""
Component Catalog Router
Endpoints for querying frontend and backend reusable component specifications
"""
from __future__ import annotations
from fastapi import APIRouter, Depends, Query
from app.domain.models import ComponentLayer, ComponentCategory
from app.schemas.components import ComponentSummaryResponse, ComponentDetailResponse
from app.schemas.common import PaginatedResponse, PaginationMeta
from app.services.catalog_service import CatalogService

router = APIRouter(prefix="/components", tags=["Component Catalog"])


def get_catalog_service() -> CatalogService:
    return CatalogService()


@router.get("", response_model=PaginatedResponse[ComponentSummaryResponse])
async def list_components(
    layer: ComponentLayer | None = None,
    category: ComponentCategory | None = None,
    search: str | None = Query(None, description="Filter components by name or description"),
    service: CatalogService = Depends(get_catalog_service),
):
    """List reusable components from the Olivelas Component Catalog."""
    comps = service.list_components(layer=layer, category=category, search=search)
    return PaginatedResponse(
        data=comps,
        meta=PaginationMeta(
            page=1,
            page_size=len(comps) or 20,
            total_items=len(comps),
            total_pages=1,
        ),
    )


@router.get("/{component_id}", response_model=ComponentDetailResponse)
async def get_component(
    component_id: str,
    service: CatalogService = Depends(get_catalog_service),
):
    """Get complete specification, dependencies, rules of use, and code examples for a component."""
    return service.get_component_by_id(component_id)
