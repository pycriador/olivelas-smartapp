"""
AI Agents API Router
Endpoints for managing specialized cognitive agents and executing tasks with RBAC enforcement.
"""
from __future__ import annotations
from typing import Any
from fastapi import APIRouter, Depends, Query, status
from app.domain.entities import ApiResponse, ApiListResponse, ApiMeta
from app.schemas.ai_agent_schemas import (
    AiAgentItem,
    AiAgentCreateRequest,
    AiAgentUpdateRequest,
    AiAgentExecuteRequest,
    AiAgentExecuteResponse,
)
from app.services.ai_agent_service import ai_agent_service
from app.services.rbac_service import rbac_service
from app.api.v1.iam_api import get_current_user_claims

router = APIRouter(prefix="/ai/agents", tags=["AI Agents Catalog"])


@router.get("", response_model=ApiListResponse[AiAgentItem])
async def list_agents(
    domain: str | None = Query(None),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1, le=200),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Lists all canonical and custom AI agents."""
    rbac_service.require_permission("ai.agents:view", user_role=claims.get("role"))
    agents = ai_agent_service.list_agents()
    if domain:
        agents = [a for a in agents if (a.domain or "").lower() == domain.lower()]
    if search:
        q = search.lower()
        agents = [
            a for a in agents
            if q in a.name.lower()
            or q in (a.description or "").lower()
            or q in (a.domain or "").lower()
            or any(q in cap.lower() for cap in (a.capabilities or []))
        ]
    total = len(agents)
    if page_size is not None:
        start = (page - 1) * page_size
        paged = agents[start : start + page_size]
        eff_size = page_size
    else:
        paged = agents
        eff_size = total or 20
    return ApiListResponse(
        data=paged,
        meta=ApiMeta(page=page, page_size=eff_size, total=total),
    )


@router.get("/{agent_id}", response_model=ApiResponse[AiAgentItem])
async def get_agent(agent_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    """Retrieves an AI agent by ID."""
    rbac_service.require_permission("ai.agents:view", user_role=claims.get("role"))
    agent = ai_agent_service.get_agent(agent_id)
    return ApiResponse(data=agent)


@router.post("", response_model=ApiResponse[AiAgentItem], status_code=status.HTTP_201_CREATED)
async def create_agent(
    body: AiAgentCreateRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Creates a new AI agent."""
    rbac_service.require_permission("ai.agents:create", user_role=claims.get("role"))
    actor = claims.get("email", "willian.jesus@loft.com.br")
    created = ai_agent_service.create_agent(body, actor_email=actor)
    return ApiResponse(data=created)


@router.put("/{agent_id}", response_model=ApiResponse[AiAgentItem])
async def update_agent(
    agent_id: str,
    body: AiAgentUpdateRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Updates an existing AI agent."""
    rbac_service.require_permission("ai.agents:edit", user_role=claims.get("role"))
    actor = claims.get("email", "willian.jesus@loft.com.br")
    updated = ai_agent_service.update_agent(agent_id, body, actor_email=actor)
    return ApiResponse(data=updated)


@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent(
    agent_id: str,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Deletes an AI agent from the catalog."""
    rbac_service.require_permission("ai.agents:delete", user_role=claims.get("role"))
    actor = claims.get("email", "willian.jesus@loft.com.br")
    ai_agent_service.delete_agent(agent_id, actor_email=actor)
    return None


@router.post("/{agent_id}/execute", response_model=ApiResponse[AiAgentExecuteResponse])
async def execute_agent(
    agent_id: str,
    body: AiAgentExecuteRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Executes a cognitive engineering task through the specified AI agent."""
    rbac_service.require_permission("ai.agents:execute", user_role=claims.get("role"))
    actor = claims.get("email", "willian.jesus@loft.com.br")
    result = await ai_agent_service.execute_agent(agent_id, body, actor_email=actor)
    return ApiResponse(data=result)
