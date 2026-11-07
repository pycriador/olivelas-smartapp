"""
Audit Router
Queries immutable platform audit trail
"""
from __future__ import annotations
from typing import Any
from fastapi import APIRouter, Depends, Query
from app.domain.entities import AuditLog, AuditAction, ApiListResponse, ApiMeta
from app.services.audit_service import AuditService
from app.api.v1.iam_api import get_current_user_claims

router = APIRouter(prefix="/audit", tags=["Audit"])


def get_audit_service() -> AuditService:
    return AuditService()


@router.get("/logs", response_model=ApiListResponse[AuditLog])
async def list_audit_logs(
    action: str | None = None,
    resource: str | None = None,
    entity_id: str | None = None,
    actor: str | None = None,
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=500),
    service: AuditService = Depends(get_audit_service),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    offset = (page - 1) * page_size
    logs, total = service.list_logs(
        action=action,
        resource=resource,
        entity_id=entity_id,
        actor=actor,
        search=search,
        limit=page_size,
        offset=offset,
    )
    return ApiListResponse(
        data=logs,
        meta=ApiMeta(page=page, page_size=page_size, total=total),
    )
