"""
Project Builder Schemas
"""
from __future__ import annotations
from pydantic import BaseModel, Field
from app.schemas.components import ComponentSummaryResponse
from app.schemas.rules import RuleResponse
from app.schemas.architectures import ArchitectureResponse
from app.schemas.templates import TemplateSummaryResponse


class ApiContractSchema(BaseModel):
    path: str
    method: str
    summary: str
    request_schema: str | None = None
    response_schema: str
    status_code: int = 200
    auth_required: bool = True
    permission: str | None = None


class GenerateProjectPlanRequest(BaseModel):
    project_name: str = Field(..., description="Nome do projeto / aplicação")
    description: str = Field(..., description="Descrição detalhada do objetivo e regras de negócio")
    target_type: str = Field(default="fullstack", description="frontend, backend, ou fullstack")
    features: list[str] = Field(default_factory=list, description="Lista de funcionalidades desejadas")
    integrations: list[str] = Field(default_factory=list, description="Serviços ou integrações externas")
    has_ai_capabilities: bool = Field(default=False, description="Se requer inteligência artificial / RAG / LLM")
    has_authentication: bool = True
    database_needed: bool = True


class ProjectBlueprintResponse(BaseModel):
    project_name: str
    target_type: str
    summary: str
    architecture: ArchitectureResponse
    folder_tree: str
    required_frontend_components: list[ComponentSummaryResponse] = Field(default_factory=list)
    required_backend_components: list[ComponentSummaryResponse] = Field(default_factory=list)
    api_contracts: list[ApiContractSchema] = Field(default_factory=list)
    data_models_summary: list[str] = Field(default_factory=list)
    applicable_rules: list[RuleResponse] = Field(default_factory=list)
    applicable_templates: list[TemplateSummaryResponse] = Field(default_factory=list)
    security_checklist: list[str] = Field(default_factory=list)
    implementation_steps: list[str] = Field(default_factory=list)
    agent_instructions_prompt: str
