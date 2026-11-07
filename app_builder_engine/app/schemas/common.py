"""
Common API Schemas
Follows Loft Backend API Specification Vol IV:
- Envelopes with {"data": [...], "meta": {...}} for collections
- Standard Error object
- ISO 8601 UTC timestamps
"""
from __future__ import annotations
from typing import Generic, TypeVar, Any
from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationMeta(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=5000)
    total_items: int = Field(ge=0)
    total_pages: int = Field(ge=0)


class PaginatedResponse(BaseModel, Generic[T]):
    data: list[T]
    meta: PaginationMeta


class SingleResponse(BaseModel, Generic[T]):
    data: T


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: dict[str, Any] = Field(default_factory=dict)
    request_id: str


class ErrorEnvelope(BaseModel):
    error: ErrorDetail
