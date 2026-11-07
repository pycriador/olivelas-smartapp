"""
AI Provider Settings Schemas
Pydantic models for managing AI Providers, Gemini Models, Grok, OpenAI, Copilot, Custom Gateways, and Connection Testing.
"""
from __future__ import annotations
from typing import Any, Optional
from pydantic import BaseModel, Field


class AiModelOption(BaseModel):
    id: str
    name: str
    provider: str
    description: str = ""
    context_window: int = 1000000
    recommended: bool = False
    is_multimodal: bool = True


class AiProviderConfigItem(BaseModel):
    id: str  # e.g., "gemini", "openai", "grok", "copilot", "anthropic", "ollama", or "cst_xxx"
    name: str  # e.g., "Google Gemini", "xAI (Grok)", "OpenAI", "GitHub Copilot", "Anthropic Claude", "Local / Ollama"
    provider_type: str = "openai_compatible"  # "gemini" | "openai" | "grok" | "copilot" | "anthropic" | "ollama" | "custom"
    enabled: bool = True
    is_custom: bool = False
    api_key: str = ""  # Masked when returned: sk-...****
    base_url: Optional[str] = None
    default_model: str = "gemini-2.5-flash"
    available_models: list[AiModelOption] = Field(default_factory=list)
    temperature: float = Field(default=0.2, ge=0.0, le=2.0)
    max_output_tokens: int = Field(default=4096, ge=128, le=128000)
    top_p: float = Field(default=0.95, ge=0.0, le=1.0)
    top_k: Optional[int] = Field(default=40, ge=1, le=100)
    system_instruction: Optional[str] = None
    organization_id: Optional[str] = None
    project_id: Optional[str] = None
    anthropic_version: Optional[str] = "2023-06-01"
    azure_deployment: Optional[str] = None
    api_version: Optional[str] = None
    headers: dict[str, str] = Field(default_factory=dict)
    is_default: bool = False
    status: str = "configured"  # "configured", "unconfigured", "connected", "error"
    last_tested_at: Optional[str] = None
    last_error: Optional[str] = None


class MultiProviderSettings(BaseModel):
    default_provider: str = "gemini"
    default_model: str = "gemini-2.5-flash"
    providers: list[AiProviderConfigItem] = Field(default_factory=list)
    fallback_provider: Optional[str] = "openai"
    enable_stream: bool = False
    log_prompts: bool = True


class AiProviderUpdateRequest(BaseModel):
    default_provider: Optional[str] = None
    default_model: Optional[str] = None
    providers: list[AiProviderConfigItem]
    fallback_provider: Optional[str] = None
    enable_stream: Optional[bool] = None
    log_prompts: Optional[bool] = None


class AiCustomProviderCreateRequest(BaseModel):
    name: str
    base_url: str
    api_key: Optional[str] = ""
    provider_type: str = "custom"
    default_model: str = "custom-model"
    available_models: list[AiModelOption] = Field(default_factory=list)
    temperature: float = 0.2
    max_output_tokens: int = 4096
    headers: dict[str, str] = Field(default_factory=dict)
    system_instruction: Optional[str] = None
    enabled: bool = True


class AiCustomProviderUpdateRequest(BaseModel):
    name: Optional[str] = None
    base_url: Optional[str] = None
    api_key: Optional[str] = None
    default_model: Optional[str] = None
    available_models: Optional[list[AiModelOption]] = None
    temperature: Optional[float] = None
    max_output_tokens: Optional[int] = None
    headers: Optional[dict[str, str]] = None
    system_instruction: Optional[str] = None
    enabled: Optional[bool] = None


class AiTestConnectionRequest(BaseModel):
    provider_id: str
    api_key: Optional[str] = None
    model: Optional[str] = None
    base_url: Optional[str] = None


class AiTestConnectionResponse(BaseModel):
    success: bool
    provider_id: str
    model: str
    latency_ms: int
    message: str
    raw_response: Optional[str] = None


class AiFetchModelsRequest(BaseModel):
    provider_id: str = "gemini"
    api_key: Optional[str] = None
    base_url: Optional[str] = None
