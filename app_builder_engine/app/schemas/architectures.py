"""
Architecture Catalog Schemas
"""
from __future__ import annotations
from pydantic import BaseModel, Field


class ArchitectureResponse(BaseModel):
    id: str
    name: str
    description: str
    folder_structure: str
    core_layers: list[str] = Field(default_factory=list)
    data_flow: str
    best_for: list[str] = Field(default_factory=list)
    constraints: list[str] = Field(default_factory=list)
