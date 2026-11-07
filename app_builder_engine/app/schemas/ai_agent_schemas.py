"""
AI Agent Schemas
Pydantic models for specialized cognitive engineering agents.
"""
from __future__ import annotations
from typing import Optional, Any
from pydantic import BaseModel, Field


class AiAgentItem(BaseModel):
    id: str
    name: str
    slug: str
    role: str
    domain: str  # "Frontend / UI", "Security / RBAC", "Testing & Contracts", "Architecture", "Data & Backend"
    description: str
    avatar_icon: str
    color: str
    provider: str = "gemini"
    model: str = "gemini-2.5-flash"
    temperature: float = 0.2
    system_instruction: str
    capabilities: list[str] = Field(default_factory=list)
    is_system: bool = True
    status: str = "Active"  # "Active", "Disabled"
    usage_count: int = 0
    last_executed_at: Optional[str] = None


class AiAgentCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    role: str = Field(..., min_length=2, max_length=100)
    domain: str = Field(default="Architecture")
    description: str = Field(..., min_length=5)
    avatar_icon: str = Field(default="RobotOutlined")
    color: str = Field(default="#FF774A")
    provider: str = Field(default="gemini")
    model: str = Field(default="gemini-2.5-flash")
    temperature: float = Field(default=0.2, ge=0.0, le=1.0)
    system_instruction: str = Field(..., min_length=10)
    capabilities: list[str] = Field(default_factory=list)


class AiAgentUpdateRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    domain: Optional[str] = None
    description: Optional[str] = None
    avatar_icon: Optional[str] = None
    color: Optional[str] = None
    provider: Optional[str] = None
    model: Optional[str] = None
    temperature: Optional[float] = None
    system_instruction: Optional[str] = None
    capabilities: Optional[list[str]] = None
    status: Optional[str] = None


class AiAgentExecuteRequest(BaseModel):
    agent_id: str
    input_text: str = Field(..., min_length=1)
    context_type: str = Field(default="freeform")  # "blueprint", "code", "spec", "freeform"
    context_id: Optional[str] = None
    temperature_override: Optional[float] = None


class AiAgentExecuteResponse(BaseModel):
    agent_id: str
    agent_name: str
    output_text: str
    reasoning_summary: str
    latency_ms: int
    tokens_used: int
    model_used: str
    timestamp: str
