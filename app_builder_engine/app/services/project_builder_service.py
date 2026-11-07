"""
Project Builder Service (The Agent Brain)
Synthesizes user/agent requirements into a full Technical Blueprint & Execution Plan
"""
from __future__ import annotations
import re
from app.domain.models import (
    ProjectRequirement,
    ProjectBlueprint,
    ComponentLayer,
    RuleCategory,
)
from app.schemas.builder import (
    GenerateProjectPlanRequest,
    ProjectBlueprintResponse,
    ApiContractSchema,
)
from app.schemas.components import ComponentSummaryResponse
from app.schemas.rules import RuleResponse
from app.schemas.architectures import ArchitectureResponse
from app.schemas.templates import TemplateSummaryResponse
from app.services.catalog_service import CatalogService
from app.services.rules_service import RulesService
from app.services.architecture_service import ArchitectureService
from app.services.template_service import TemplateService


class ProjectBuilderService:
    def __init__(
        self,
        catalog_service: CatalogService | None = None,
        rules_service: RulesService | None = None,
        architecture_service: ArchitectureService | None = None,
        template_service: TemplateService | None = None,
    ) -> None:
        self.catalog = catalog_service or CatalogService()
        self.rules = rules_service or RulesService()
        self.architectures = architecture_service or ArchitectureService()
        self.templates = template_service or TemplateService()

    def generate_blueprint(self, req: GenerateProjectPlanRequest) -> ProjectBlueprintResponse:
        # 1. Select Architecture Pattern
        arch = self.architectures.get_architecture_by_id("arch-fastapi-react-loft")

        # 2. Derive required Frontend & Backend components
        fe_components: list[ComponentSummaryResponse] = []
        be_components: list[ComponentSummaryResponse] = []

        if req.target_type in ["frontend", "fullstack"]:
            fe_components.append(self.catalog.get_component_by_id("fe-page-header"))
            fe_components.append(self.catalog.get_component_by_id("fe-data-table"))
            fe_components.append(self.catalog.get_component_by_id("fe-filter-bar"))
            fe_components.append(self.catalog.get_component_by_id("fe-app-switcher"))

        if req.target_type in ["backend", "fullstack"]:
            if req.has_authentication:
                be_components.append(self.catalog.get_component_by_id("be-auth-service"))
                be_components.append(self.catalog.get_component_by_id("be-tenant-access-service"))
            if req.has_ai_capabilities:
                be_components.append(self.catalog.get_component_by_id("be-llm-gateway"))
            be_components.append(self.catalog.get_component_by_id("be-audit-service"))

        # 3. Generate API Contracts from features
        api_contracts: list[ApiContractSchema] = []
        
        # Base Auth contracts
        if req.has_authentication and req.target_type in ["backend", "fullstack"]:
            api_contracts.append(
                ApiContractSchema(
                    path="/api/v1/auth/login",
                    method="POST",
                    summary="Autenticação com e-mail e senha, retorna access_token JWT",
                    request_schema="LoginRequestSchema",
                    response_schema="TokenResponseSchema",
                    status_code=200,
                    auth_required=False,
                )
            )
            api_contracts.append(
                ApiContractSchema(
                    path="/api/v1/auth/me",
                    method="GET",
                    summary="Retorna dados do usuário logado e permissões",
                    response_schema="UserMeResponseSchema",
                    status_code=200,
                    auth_required=True,
                    permission="users:read",
                )
            )

        # Feature-derived contracts
        for feature in req.features:
            slug = re.sub(r"[^a-zA-Z0-9]+", "_", feature.lower()).strip("_")
            singular = slug.rstrip("s")
            entity_name = "".join(word.capitalize() for word in singular.split("_"))

            api_contracts.append(
                ApiContractSchema(
                    path=f"/api/v1/{slug}",
                    method="GET",
                    summary=f"Lista paginada de {feature}",
                    response_schema=f"PaginatedResponse[{entity_name}Response]",
                    status_code=200,
                    auth_required=req.has_authentication,
                    permission=f"{slug}:read",
                )
            )
            api_contracts.append(
                ApiContractSchema(
                    path=f"/api/v1/{slug}",
                    method="POST",
                    summary=f"Criação de {singular}",
                    request_schema=f"{entity_name}Create",
                    response_schema=f"{entity_name}Response",
                    status_code=201,
                    auth_required=req.has_authentication,
                    permission=f"{slug}:write",
                )
            )

        if req.has_ai_capabilities:
            api_contracts.append(
                ApiContractSchema(
                    path="/api/v1/ai/generate-insights",
                    method="POST",
                    summary="Processamento inteligente via LLMGateway com structured output",
                    request_schema="InsightRequestSchema",
                    response_schema="InsightResponseSchema",
                    status_code=200,
                    auth_required=True,
                    permission="ai:execute",
                )
            )

        # 4. Applicable Rules
        applicable_rules: list[RuleResponse] = []
        if req.target_type in ["frontend", "fullstack"]:
            applicable_rules.extend(self.rules.list_rules(category=RuleCategory.FRONTEND))
        if req.target_type in ["backend", "fullstack"]:
            applicable_rules.extend(self.rules.list_rules(category=RuleCategory.BACKEND))
        applicable_rules.extend(self.rules.list_rules(category=RuleCategory.SECURITY))
        if req.has_ai_capabilities:
            applicable_rules.extend(self.rules.list_rules(category=RuleCategory.AI_BAS))

        # 5. Applicable Templates
        applicable_templates: list[TemplateSummaryResponse] = self.templates.list_templates()

        # 6. Security Checklist
        security_checklist = [
            "Default Deny em todos os endpoints não públicos",
            "Tenant ID derivado estritamente do token JWT autenticado (nunca do body)",
            "Validação estrita de inputs via Pydantic v2 / Zod",
            "Criptografia de senhas com Argon2id via pwdlib",
            "Sem segredos em código, repositório ou logs",
            "Proteção contra BOLA/IDOR com verificação de posse do recurso",
        ]

        # 7. Implementation Steps
        implementation_steps = [
            "1. Setup de pastas seguindo o padrão oficial Olivelas (backend/app e frontend/src).",
            "2. Configuração de variáveis de ambiente com Pydantic Settings no backend e .env (prefixo VITE_) no frontend.",
            "3. Criação de modelos SQLAlchemy 2.x assíncronos e migrations com Alembic.",
            "4. Criação dos schemas Pydantic v2 (Create, Update, Response) para os contratos de API.",
            "5. Implementação dos repositories e application services com isolamento multi-tenant.",
            "6. Implementação dos routers FastAPI REST com injeção de dependência.",
            "7. Setup do tema Ant Design com tokens de marca Olivelas (#FF774A) e ConfigProvider.",
            "8. Implementação dos componentes Tier 1 (PageHeader, DataTable, FilterBar) e telas com os 7 estados obrigatórios.",
            "9. Execução da suíte de testes (Pytest no backend, Vitest no frontend) e validação de regras.",
        ]

        # 8. Formulate Agent Prompt
        agent_prompt = f"""# INSTRUÇÕES DE ENGENHARIA PARA O AGENTE DE IA

Você é o engenheiro responsável por construir a aplicação **{req.project_name}**.

## REQUISITOS DO PROJETO
- **Objetivo:** {req.description}
- **Escopo:** {req.target_type}
- **Funcionalidades:** {', '.join(req.features) if req.features else 'Padrão'}
- **IA Habilitada:** {'Sim (usar AI-BAS / LLMGateway)' if req.has_ai_capabilities else 'Não'}
- **Autenticação:** {'Sim (JWT + Argon2id)' if req.has_authentication else 'Não'}

## REGRAS DE OURO OBRIGATÓRIAS (NÃO VIOLE):
1. **Frontend:** NUNCA importar pacotes `@loft/*` ou Copan. Use Ant Design + Olivelas Tokens (#FF774A).
2. **Server State:** Use exclusivamente TanStack Query no frontend. Nunca faça `fetch` dentro de `useEffect`.
3. **Backend:** FastAPI + SQLAlchemy 2.x async. NUNCA coloque regras de negócio ou SQL dentro dos Routers.
4. **Segurança:** Zero Trust. NUNCA confie em `tenant_id` vindo do cliente.
5. **IA:** NUNCA importe SDK de OpenAI/Anthropic direto no domínio. Use sempre `LLMGateway` com Pydantic.

Siga rigorosamente a estrutura de pastas e os contratos de API fornecidos no Blueprint.
"""

        # Build folder tree representation
        folder_tree = f"""{req.project_name}/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/ (config.py, errors.py, logging.py)
│   │   ├── api/v1/ ({"".join([f"{f.lower()}.py, " for f in req.features])}auth.py)
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── domain/
│   │   ├── repositories/
│   │   └── ai/
│   └── tests/
└── frontend/
    ├── src/
    │   ├── app/ (App.tsx, router.tsx)
    │   ├── components/ (PageHeader, DataTable, FilterBar, AppSwitcher)
    │   ├── features/ ({"".join([f"{f.lower()}/, " for f in req.features])})
    │   ├── services/
    │   └── theme/
    └── package.json"""

        data_models = [
            f"Model {f.capitalize()}: id (UUID), tenant_id (UUID), title (str), status (str), created_at (datetime)"
            for f in req.features
        ]

        return ProjectBlueprintResponse(
            project_name=req.project_name,
            target_type=req.target_type,
            summary=f"Blueprint técnico para {req.project_name} baseado no padrão de engenharia Olivelas.",
            architecture=arch,
            folder_tree=folder_tree,
            required_frontend_components=[
                ComponentSummaryResponse(
                    id=c.id, name=c.name, layer=c.layer, category=c.category, description=c.description
                )
                for c in fe_components
            ],
            required_backend_components=[
                ComponentSummaryResponse(
                    id=c.id, name=c.name, layer=c.layer, category=c.category, description=c.description
                )
                for c in be_components
            ],
            api_contracts=api_contracts,
            data_models_summary=data_models,
            applicable_rules=applicable_rules,
            applicable_templates=applicable_templates,
            security_checklist=security_checklist,
            implementation_steps=implementation_steps,
            agent_instructions_prompt=agent_prompt,
        )
