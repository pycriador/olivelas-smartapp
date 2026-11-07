"""
Architecture Catalog Router
"""
from __future__ import annotations
from fastapi import APIRouter, Depends
from app.schemas.architectures import ArchitectureResponse
from app.schemas.common import PaginatedResponse, PaginationMeta
from app.services.architecture_service import ArchitectureService

router = APIRouter(prefix="/architectures", tags=["Architecture Catalog"])


def get_architecture_service() -> ArchitectureService:
    return ArchitectureService()


@router.get("", response_model=PaginatedResponse[ArchitectureResponse])
async def list_architectures(
    service: ArchitectureService = Depends(get_architecture_service),
):
    """List standard architectural patterns (FastAPI + React/AntD, Modular Monolith, etc.)."""
    archs = service.list_architectures()
    return PaginatedResponse(
        data=archs,
        meta=PaginationMeta(
            page=1,
            page_size=len(archs) or 20,
            total_items=len(archs),
            total_pages=1,
        ),
    )


@router.get("/{arch_id}", response_model=ArchitectureResponse)
async def get_architecture(
    arch_id: str,
    service: ArchitectureService = Depends(get_architecture_service),
):
    """Get full structure and constraints of an architecture pattern."""
    return service.get_architecture_by_id(arch_id)
