"""
AI Gateway API Router
Endpoints for telemetry metrics, routing policies, prompt execution, and logs with RBAC enforcement.
"""
from __future__ import annotations
from typing import Any
from fastapi import APIRouter, Depends, Query, status
from app.domain.entities import ApiResponse, ApiListResponse, ApiMeta
from app.schemas.ai_gateway_schemas import (
    AiGatewayPolicy,
    AiGatewayMetrics,
    AiGatewayExecutionLog,
    AiGatewayExecuteRequest,
    AiGatewayExecuteResponse,
)
from app.services.ai_gateway_service import ai_gateway_service
from app.services.rbac_service import rbac_service
from app.api.v1.iam_api import get_current_user_claims

router = APIRouter(prefix="/ai/gateway", tags=["AI Gateway"])


@router.get("/metrics", response_model=ApiResponse[AiGatewayMetrics])
async def get_gateway_metrics(claims: dict[str, Any] = Depends(get_current_user_claims)):
    """Returns AI Gateway telemetry, traffic stats, and active provider health."""
    rbac_service.require_permission("ai.gateway:view", user_role=claims.get("role"))
    metrics = ai_gateway_service.get_metrics()
    return ApiResponse(data=metrics)


@router.get("/policy", response_model=ApiResponse[AiGatewayPolicy])
async def get_gateway_policy(claims: dict[str, Any] = Depends(get_current_user_claims)):
    """Returns the active AI Gateway routing and safety policies."""
    rbac_service.require_permission("ai.gateway:view", user_role=claims.get("role"))
    policy = ai_gateway_service.get_policy()
    return ApiResponse(data=policy)


@router.put("/policy", response_model=ApiResponse[AiGatewayPolicy])
async def update_gateway_policy(
    body: AiGatewayPolicy,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Updates AI Gateway routing, fallback, and caching policies."""
    rbac_service.require_permission("ai.gateway:manage", user_role=claims.get("role"))
    actor = claims.get("email", "willian.jesus@olivelas.com.br")
    updated = ai_gateway_service.update_policy(body.model_dump(), actor_email=actor)
    return ApiResponse(data=updated)


@router.get("/logs", response_model=ApiListResponse[AiGatewayExecutionLog])
async def get_gateway_logs(
    limit: int | None = Query(None, ge=1, le=500),
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1, le=500),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Returns prompt execution audit logs through the gateway."""
    rbac_service.require_permission("ai.gateway:view", user_role=claims.get("role"))
    all_logs = ai_gateway_service.get_execution_logs(limit=500)
    total = len(all_logs)
    eff_page_size = page_size if page_size is not None else (limit if limit is not None else 20)
    start = (page - 1) * eff_page_size
    paged = all_logs[start : start + eff_page_size]
    return ApiListResponse(
        data=paged,
        meta=ApiMeta(page=page, page_size=eff_page_size, total=total),
    )


@router.post("/execute", response_model=ApiResponse[AiGatewayExecuteResponse])
async def execute_prompt_gateway(
    body: AiGatewayExecuteRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Executes a prompt through the AI Gateway with safety, fallback, and caching."""
    rbac_service.require_permission("ai.gateway:execute", user_role=claims.get("role"))
    actor = claims.get("email", "willian.jesus@olivelas.com.br")
    result = await ai_gateway_service.execute_prompt(body, actor_email=actor)
    return ApiResponse(data=result)
