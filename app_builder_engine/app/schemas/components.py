"""
Component Catalog Schemas
"""
from __future__ import annotations
from pydantic import BaseModel, Field
from app.domain.models import ComponentLayer, ComponentCategory


class ComponentSummaryResponse(BaseModel):
    id: str
    name: str
    layer: ComponentLayer
    category: ComponentCategory
    description: str
    dependencies: list[str] = Field(default_factory=list)


class ComponentDetailResponse(ComponentSummaryResponse):
    responsibilities: list[str] = Field(default_factory=list)
    allowed_imports: list[str] = Field(default_factory=list)
    forbidden_imports: list[str] = Field(default_factory=list)
    interface_spec: str
    example_usage: str
    rules_of_use: list[str] = Field(default_factory=list)
