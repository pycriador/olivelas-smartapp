"""
AI Gateway Router
Uniform entry point for agent querying and assisted generation
Follows Loft Backend AI Specification Vol V (AI-BAS)
"""
from __future__ import annotations
import time
from typing import Any
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field
from app.ai.gateway import LLMGateway
from app.ai.prompts import PromptRegistry
from app.api.v1.iam_api import get_current_user_claims
from app.services.rbac_service import rbac_service
from app.services.ai_gateway_service import ai_gateway_service

router = APIRouter(prefix="/ai", tags=["AI Gateway"])


def get_llm_gateway() -> LLMGateway:
    return LLMGateway()


class PromptExecutionRequest(BaseModel):
    prompt: str
    system_prompt: str | None = None
    temperature: float = Field(default=0.2, ge=0.0, le=1.0)


class PromptExecutionResponse(BaseModel):
    response: str
    model_alias: str = "loft-architect-v1"


@router.post("/execute", response_model=PromptExecutionResponse, status_code=status.HTTP_200_OK)
async def execute_prompt(
    body: PromptExecutionRequest,
    gateway: LLMGateway = Depends(get_llm_gateway),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """
    Execute an AI request through the unified AI-BAS gateway.

    Security parity note: this route duplicates POST /api/v1/ai/gateway/execute
    (app/api/v1/ai_gateway_api.py). It now enforces the same Bearer-token
    authentication, the same 'ai.gateway:execute' RBAC permission, and records
    the same execution audit trail (AiGatewayService._record_log, surfaced via
    GET /api/v1/ai/gateway/logs and the AuditLogModel table).
    """
    rbac_service.require_permission("ai.gateway:execute", user_role=claims.get("role"))
    actor = claims.get("email", "willian.jesus@loft.com.br")
    sys_prompt = body.system_prompt or PromptRegistry.BUILDER_SYSTEM_PROMPT

    provider = gateway.provider
    provider_name = type(provider).__name__
    model_name = getattr(provider, "model", "unknown")
    approx_tokens = max(len(body.prompt.split()) * 4 // 3, 1)
    start_time = time.time()

    try:
        result = await gateway.generate_text(prompt=body.prompt, system_prompt=sys_prompt)
    except Exception as exc:
        latency_ms = max(int((time.time() - start_time) * 1000), 1)
        ai_gateway_service._record_log(
            prompt=body.prompt,
            system_prompt=sys_prompt,
            response=f"Error: {exc}",
            provider=provider_name,
            model=model_name,
            latency_ms=latency_ms,
            tokens_used=approx_tokens,
            status="ERROR",
            actor=actor,
        )
        raise

    latency_ms = max(int((time.time() - start_time) * 1000), 1)
    ai_gateway_service._record_log(
        prompt=body.prompt,
        system_prompt=sys_prompt,
        response=result,
        provider=provider_name,
        model=model_name,
        latency_ms=latency_ms,
        tokens_used=approx_tokens,
        status="SUCCESS",
        actor=actor,
    )
    return PromptExecutionResponse(response=result)
