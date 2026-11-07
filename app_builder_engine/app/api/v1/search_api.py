"""
Global Search Router (Command Palette)
Searches across Projects, Blueprints, Components, Templates, Modules, Rules, Architectures, and Specs
"""
from __future__ import annotations
from fastapi import APIRouter, Depends, Query
from app.services.global_search_service import GlobalSearchService, SearchResultItem

router = APIRouter(prefix="/search", tags=["Global Search"])


def get_search_service() -> GlobalSearchService:
    return GlobalSearchService()


@router.get("", response_model=list[SearchResultItem])
async def global_search(
    q: str = Query(..., min_length=1, description="Termo para busca global"),
    limit: int = Query(20, ge=1, le=50),
    service: GlobalSearchService = Depends(get_search_service),
):
    """Global search for Command Palette (CMD+K)."""
    return service.search(query=q, limit=limit)
