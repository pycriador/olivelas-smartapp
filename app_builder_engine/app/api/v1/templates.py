"""
Template Engine Router
"""
from __future__ import annotations
from fastapi import APIRouter, Depends, status
from app.domain.models import ComponentLayer
from app.schemas.templates import (
    TemplateSummaryResponse,
    TemplateDetailResponse,
    TemplateRenderRequest,
    TemplateRenderResponse,
)
from app.schemas.common import PaginatedResponse, PaginationMeta
from app.services.template_service import TemplateService

router = APIRouter(prefix="/templates", tags=["Template Engine"])


def get_template_service() -> TemplateService:
    return TemplateService()


@router.get("", response_model=PaginatedResponse[TemplateSummaryResponse])
async def list_templates(
    layer: ComponentLayer | None = None,
    category: str | None = None,
    service: TemplateService = Depends(get_template_service),
):
    """List code templates available for scaffolding."""
    tpls = service.list_templates(layer=layer, category=category)
    return PaginatedResponse(
        data=tpls,
        meta=PaginationMeta(
            page=1,
            page_size=len(tpls) or 20,
            total_items=len(tpls),
            total_pages=1,
        ),
    )


@router.get("/{template_id}", response_model=TemplateDetailResponse)
async def get_template(
    template_id: str,
    service: TemplateService = Depends(get_template_service),
):
    """Get raw template content and expected parameters."""
    return service.get_template_by_id(template_id)


@router.post("/render", response_model=TemplateRenderResponse, status_code=status.HTTP_200_OK)
async def render_template(
    body: TemplateRenderRequest,
    service: TemplateService = Depends(get_template_service),
):
    """Render a code template with user/agent-provided variables."""
    return service.render_template(template_id=body.template_id, variables=body.variables)
