"""
Template Engine Schemas
"""
from __future__ import annotations
from pydantic import BaseModel, Field
from app.domain.models import ComponentLayer


class TemplateSummaryResponse(BaseModel):
    id: str
    name: str
    category: str
    layer: ComponentLayer
    description: str
    parameters: list[str] = Field(default_factory=list)


class TemplateDetailResponse(TemplateSummaryResponse):
    target_path_template: str
    content: str


class TemplateRenderRequest(BaseModel):
    template_id: str
    variables: dict[str, str] = Field(default_factory=dict)


class TemplateRenderResponse(BaseModel):
    template_id: str
    rendered_target_path: str
    rendered_content: str
