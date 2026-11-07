"""
AI Gateway Schemas
Pydantic schemas for AI Gateway routing policies, telemetry metrics, and prompt execution.
"""
from __future__ import annotations
from typing import Optional, Any
from pydantic import BaseModel, Field


class AiGatewayPolicy(BaseModel):
    primary_provider: str = "gemini"
    primary_model: str = "gemini-2.5-flash"
    fallback_provider: str = "openai"
    fallback_model: str = "gpt-4o"
    enable_fallback: bool = True
    enable_semantic_cache: bool = True
    enable_pii_sanitization: bool = True
    enable_audit_logging: bool = True
    rate_limit_per_minute: int = Field(default=120, ge=10, le=10000)
    max_context_tokens: int = Field(default=1000000, ge=4000, le=2000000)
    timeout_seconds: int = Field(default=30, ge=5, le=120)


class AiGatewayMetrics(BaseModel):
    total_requests: int = 0
    successful_requests: int = 0
    failed_requests: int = 0
    cached_requests: int = 0
    avg_latency_ms: int = 0
    total_prompt_tokens: int = 0
    total_completion_tokens: int = 0
    active_provider: str = "gemini"
    active_model: str = "gemini-2.5-flash"
    uptime_percentage: float = 99.98


class AiGatewayExecutionLog(BaseModel):
    id: str
    prompt_preview: str
    full_prompt: Optional[str] = None
    system_prompt: Optional[str] = None
    response_preview: str
    full_response: Optional[str] = None
    provider: str
    model: str
    latency_ms: int
    tokens_used: int
    status: str = "SUCCESS"  # "SUCCESS", "ERROR", "CACHED"
    actor: str = "willian.jesus@olivelas.com.br"
    timestamp: str


class AiGatewayExecuteRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    system_prompt: Optional[str] = None
    temperature: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    max_tokens: Optional[int] = Field(default=None, ge=128, le=8192)
    override_provider: Optional[str] = None
    override_model: Optional[str] = None


class AiGatewayExecuteResponse(BaseModel):
    response: str
    provider: str
    model: str
    latency_ms: int
    prompt_tokens: int
    completion_tokens: int
    cached: bool = False
    timestamp: str
