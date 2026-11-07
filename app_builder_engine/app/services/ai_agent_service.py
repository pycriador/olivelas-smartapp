"""
AI Agent Service
Manages specialized cognitive engineering agents, custom agent persistence, and execution lifecycle.
"""
from __future__ import annotations
import uuid
from datetime import datetime, timezone
from typing import Optional, Any
from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.orm_models import SystemStateModel, AuditLogModel
from app.schemas.ai_agent_schemas import (
    AiAgentItem,
    AiAgentCreateRequest,
    AiAgentUpdateRequest,
    AiAgentExecuteRequest,
    AiAgentExecuteResponse,
)
from app.schemas.ai_gateway_schemas import AiGatewayExecuteRequest
from app.services.ai_gateway_service import ai_gateway_service
from app.core.errors import NotFoundError, ConflictError

SYSTEM_STATE_AGENTS_KEY = "ai_agents_catalog"


class AiAgentService:
    def __init__(self) -> None:
        pass

    def get_canonical_agents(self) -> list[dict[str, Any]]:
        return [
            {
                "id": "agent_copan_refactor",
                "name": "Copan UI Refactor Agent",
                "slug": "copan-ui-refactor",
                "role": "Copan Design System Specialist",
                "domain": "Frontend / UI",
                "description": "Analisa componentes e código legado React/TSX, refatorando-os para utilizar exclusivamente os componentes e design tokens canônicos do Loft Copan Design System com Feature-Sliced Design (FSD) e acessibilidade WCAG.",
                "avatar_icon": "CodeOutlined",
                "color": "#FF774A",
                "provider": "gemini",
                "model": "gemini-2.5-flash",
                "temperature": 0.2,
                "system_instruction": """Você é o Especialista Canônico em Copan Design System da Loft.
Sua missão é inspecionar o código React / TypeScript fornecido e refatorá-lo segundo o SDD de Frontend da Loft:
1. Arquitetura Feature-Sliced Design (FSD): Organize o componente nas camadas adequadas (shared / entities / features / widgets / pages).
2. Usar componentes canônicos do pacote @/components/loft (PageContainer, PageHeader, LoftCard, StatCard, EmptyState, DataTable, LoftButton).
3. Substituir CSS inline ou cores arbitrárias pelos tokens oficiais Loft (#FF774A, #121619, #0B6B4F, #F0F4F8, #D9E2EC).
4. Tipagem TypeScript estrita de Props com interfaces exportadas (ex: UserCardProps).
5. Conformidade de Acessibilidade WCAG 2.1 AA (atributos aria-label, role, navegação por teclado).
6. Forneça o código TSX completo e refatorado acompanhado de uma explicação técnica das melhorias.""",
                "capabilities": [
                    "Detecção de CSS/estilos inline arbitrários",
                    "Conversão para Design Tokens Loft Copan",
                    "Aderência a Feature-Sliced Design (FSD)",
                    "Aprimoramento de acessibilidade WCAG 2.1 AA",
                    "Tipagem TypeScript estrita de Props"
                ],
                "is_system": True,
                "status": "Active",
                "usage_count": 42,
                "last_executed_at": "2026-09-08 14:30:00 UTC",
            },
            {
                "id": "agent_database_migration",
                "name": "Database Migration Agent",
                "slug": "database-migration-agent",
                "role": "PostgreSQL & Alembic Migration Architect",
                "domain": "Data & Backend",
                "description": "Planeja e gera migrações Alembic 100% reversíveis, schemas SQLAlchemy 2.0, estratégias de indexação otimizadas e planos de migração zero-downtime (Expand & Contract) para PostgreSQL.",
                "avatar_icon": "DatabaseOutlined",
                "color": "#1890FF",
                "provider": "gemini",
                "model": "gemini-2.5-flash",
                "temperature": 0.1,
                "system_instruction": """Você é o Arquiteto Especialista em Banco de Dados e Migrações da Loft (PostgreSQL & Alembic).
Sua missão é analisar o schema ou requisito de banco de dados fornecido e produzir:
1. Script Alembic de migração completo com funções upgrade() e downgrade() estritamente reversíveis.
2. Modelos ORM SQLAlchemy 2.0 (Mapped, mapped_column, ForeignKey com ondelete adequado, UUID v4 primary keys).
3. Estratégia de Indexação: Índices B-Tree para lookups frequentes, GIN para campos JSONB/Full-Text Search, e índices parciais com WHERE clause.
4. Plano de Migração Zero-Downtime (Padrão Expand & Contract / Multi-Phase Rollout) garantindo retrocompatibilidade com a versão anterior da aplicação em produção.
5. Considerações de Lock e Performance em tabelas de alto volume (ex: evitar NOT NULL sem DEFAULT em tabelas grandes).""",
                "capabilities": [
                    "Geração de scripts Alembic upgrade/downgrade reversíveis",
                    "Modelagem SQLAlchemy 2.0 ORM com Mapped types",
                    "Estratégias de índices PostgreSQL (B-Tree, GIN, Partial)",
                    "Planos de rollout Zero-Downtime (Expand & Contract)",
                    "Auditoria de Foreign Keys e integridade referencial"
                ],
                "is_system": True,
                "status": "Active",
                "usage_count": 31,
                "last_executed_at": "2026-09-08 15:10:00 UTC",
            },
            {
                "id": "agent_fastapi_backend",
                "name": "FastAPI & Clean Architecture Backend Agent",
                "slug": "fastapi-clean-architecture",
                "role": "Backend Architecture & DDD Specialist",
                "domain": "Architecture",
                "description": "Desenvolve endpoints FastAPI de alta performance e desacoplados seguindo Domain-Driven Design (DDD), Clean Architecture (Router -> Service -> Repository), Schemas Pydantic v2 estritos e chaves de idempotência.",
                "avatar_icon": "ApiOutlined",
                "color": "#0B6B4F",
                "provider": "gemini",
                "model": "gemini-2.5-flash",
                "temperature": 0.2,
                "system_instruction": """Você é o Especialista em Engenharia Backend FastAPI e Clean Architecture da Loft.
Sua missão é estruturar módulos backend robustos seguindo as diretrizes técnicas da Loft:
1. Camadas Desacopladas (Clean Architecture / DDD):
   - Router/Controller: Validação HTTP, cabeçalhos, status codes padronizados (200, 201, 400, 404, 409, 500).
   - Service/Use Case: Regras de negócio puras, orquestração de transações e eventos.
   - Repository: Acesso a dados via SQLAlchemy 2.0 com Dependency Injection (Depends(get_db)).
2. Idempotência: Suporte a cabeçalho Idempotency-Key em operações POST/PUT de pagamento ou mutação crítica.
3. Schemas Pydantic v2 com validações estritas (Field(..., min_length=..., max_length=...), ConfigDict).
4. Tracing e Logging estruturado com OpenTelemetry e Correlation IDs.
5. Tratamento de exceções customizadas (DomainError, NotFoundError, ConflictError).""",
                "capabilities": [
                    "Desenvolvimento Router -> Service -> Repository",
                    "Injeção de dependência FastAPI (Depends)",
                    "Schemas de entrada/saída Pydantic v2",
                    "Tratamento de idempotência em mutações críticas",
                    "Instrumentação com OpenTelemetry e logs estruturados"
                ],
                "is_system": True,
                "status": "Active",
                "usage_count": 38,
                "last_executed_at": "2026-09-08 14:05:00 UTC",
            },
            {
                "id": "agent_security_bola",
                "name": "Security & BOLA Audit Agent",
                "slug": "security-bola-audit",
                "role": "Cloud Security & RBAC Auditor",
                "domain": "Security / RBAC",
                "description": "Inspeciona especificações técnicas, rotas REST e contratos de API para identificar vulnerabilidades de Broken Object Level Authorization (BOLA), falhas de controle de acesso a nível de função (BFLA) e permissões frouxas.",
                "avatar_icon": "SafetyCertificateOutlined",
                "color": "#52C41A",
                "provider": "gemini",
                "model": "gemini-2.5-flash",
                "temperature": 0.1,
                "system_instruction": """Você é o Agente Auditor de Segurança de Aplicações da Loft.
Sua missão é realizar uma análise estrita de segurança e RBAC sobre a especificação ou código submetido:
1. Identificar riscos de BOLA (Broken Object Level Authorization) em identificadores de recursos (/projects/{id}, /users/{id}).
2. Validar que cada endpoint possui decorator ou middleware de autorização (@require_permission / Depends(verify_tenant_access)).
3. Auditar sanitização de dados sensíveis e PII (CPF, Cartão, Senhas, E-mails) em logs e respostas.
4. Apresentar um parecer com Classificação de Risco (Crítico, Alto, Médio, Baixo), vetor de ataque e ações corretivas recomendadas.""",
                "capabilities": [
                    "Varredura de vulnerabilidades BOLA/BFLA",
                    "Checagem de conformidade com Matriz RBAC",
                    "Auditoria de sanitização de PII em logs",
                    "Recomendações de hardening de autenticação JWT"
                ],
                "is_system": True,
                "status": "Active",
                "usage_count": 28,
                "last_executed_at": "2026-09-08 13:45:00 UTC",
            },
            {
                "id": "agent_test_contracts",
                "name": "Test & Contract Generator",
                "slug": "test-contract-generator",
                "role": "QA & OpenAPI Contract Specialist",
                "domain": "Testing & Contracts",
                "description": "Gera automaticamente suites de testes unitários e de integração em PyTest ou Jest, além de especificações completas OpenAPI 3.1 com schemas Pydantic e exemplos canônicos a partir de Blueprints.",
                "avatar_icon": "ExperimentOutlined",
                "color": "#722ED1",
                "provider": "gemini",
                "model": "gemini-2.5-flash",
                "temperature": 0.2,
                "system_instruction": """Você é o Especialista em Engenharia de Qualidade e Contratos de API da Loft.
Sua missão é produzir:
1. Suites completas de testes unitários (PyTest com FastAPI TestClient ou Jest para React) com cobertura de casos felizes e cenários de borda (edge cases e 4xx/5xx).
2. Contratos OpenAPI 3.1 claros com exemplos reais de payloads de requisição e resposta.
3. Testes de regressão contra regras de validação de negócios e testes de integração com banco de dados em memória.""",
                "capabilities": [
                    "Geração de PyTest suites com fixtures",
                    "Geração de testes de componentes React/Testing Library",
                    "Especificação de contratos OpenAPI 3.1",
                    "Criação de mocks estruturados"
                ],
                "is_system": True,
                "status": "Active",
                "usage_count": 35,
                "last_executed_at": "2026-09-08 12:10:00 UTC",
            },
            {
                "id": "agent_golden_rules",
                "name": "Golden Rules Architecture Enforcer",
                "slug": "golden-rules-enforcer",
                "role": "Enterprise Architecture Enforcer",
                "domain": "Architecture",
                "description": "Valida propostas de arquitetura e blueprints em relação às Golden Rules canônicas da Loft (isolamento de banco de dados, SemVer estrito, tracing distribuído e idempotent APIs).",
                "avatar_icon": "CrownOutlined",
                "color": "#FA8C16",
                "provider": "gemini",
                "model": "gemini-2.5-flash",
                "temperature": 0.1,
                "system_instruction": """Você é o Guardião Canônico das Golden Rules de Engenharia da Loft.
Analise o Blueprint ou proposta técnica contra as regras fundamentais:
- RUL-01: Isolamento de banco por domínio (sem cross-database joins).
- RUL-02: APIs idempotentes com chaves Idempotency-Key em operações mutantes.
- RUL-03: Tracing distribuído com OpenTelemetry e Correlation IDs.
- RUL-04: Versionamento SemVer estrito em endpoints e modelos.
Emita o Relatório de Conformidade com Status (APROVADO, APROVADO COM RESSALVAS, REJEITADO) e plano de remediação.""",
                "capabilities": [
                    "Verificação de aderência às Golden Rules Loft",
                    "Auditoria de arquitetura distribuída",
                    "Validação de SemVer e retrocompatibilidade",
                    "Análise de acoplamento entre domínios"
                ],
                "is_system": True,
                "status": "Active",
                "usage_count": 19,
                "last_executed_at": "2026-09-08 11:20:00 UTC",
            },
        ]

    def list_agents(self) -> list[AiAgentItem]:
        with SessionLocal() as session:
            row = session.scalar(
                select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_AGENTS_KEY)
            )
            canonical = self.get_canonical_agents()
            if not row or not row.value or not isinstance(row.value, list):
                session.merge(SystemStateModel(key=SYSTEM_STATE_AGENTS_KEY, value=canonical))
                session.commit()
                return [AiAgentItem(**item) for item in canonical]
            
            existing_map = {item["id"]: item for item in row.value}
            merged_list = []
            canonical_ids = {c["id"] for c in canonical}
            for c in canonical:
                if c["id"] in existing_map:
                    existing_item = dict(existing_map[c["id"]])
                    existing_item["provider"] = "gemini"
                    existing_item["model"] = "gemini-2.5-flash"
                    existing_item["system_instruction"] = c["system_instruction"]
                    existing_item["description"] = c["description"]
                    existing_item["capabilities"] = c["capabilities"]
                    existing_item["role"] = c["role"]
                    existing_item["domain"] = c["domain"]
                    merged_list.append(existing_item)
                else:
                    merged_list.append(c)
            
            for item in row.value:
                if item["id"] not in canonical_ids:
                    item_copy = dict(item)
                    if not item_copy.get("provider"):
                        item_copy["provider"] = "gemini"
                    if not item_copy.get("model"):
                        item_copy["model"] = "gemini-2.5-flash"
                    merged_list.append(item_copy)

            row.value = merged_list
            session.merge(SystemStateModel(key=SYSTEM_STATE_AGENTS_KEY, value=merged_list))
            session.commit()
            return [AiAgentItem(**item) for item in merged_list]

    def get_agent(self, agent_id: str) -> AiAgentItem:
        agents = self.list_agents()
        agent = next((a for a in agents if a.id == agent_id), None)
        if not agent:
            raise NotFoundError(f"AI Agent com ID '{agent_id}' não foi encontrado.")
        return agent

    def create_agent(self, body: AiAgentCreateRequest, actor_email: str = "willian.jesus@loft.com.br") -> AiAgentItem:
        agents = self.list_agents()
        slug = body.name.lower().replace(" ", "-")
        if any(a.slug == slug for a in agents):
            raise ConflictError(f"Já existe um agente com o identificador '{slug}'.")

        new_agent = AiAgentItem(
            id=f"agent_cst_{uuid.uuid4().hex[:8]}",
            name=body.name,
            slug=slug,
            role=body.role,
            domain=body.domain,
            description=body.description,
            avatar_icon=body.avatar_icon,
            color=body.color,
            provider=body.provider or "gemini",
            model=body.model or "gemini-2.5-flash",
            temperature=body.temperature,
            system_instruction=body.system_instruction,
            capabilities=body.capabilities,
            is_system=False,
            status="Active",
            usage_count=0,
            last_executed_at=None,
        )

        with SessionLocal() as session:
            row = session.scalar(
                select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_AGENTS_KEY)
            )
            current_list = list(row.value) if row and row.value else []
            current_list.append(new_agent.model_dump())
            session.merge(SystemStateModel(key=SYSTEM_STATE_AGENTS_KEY, value=current_list))
            
            # Audit log
            session.add(
                AuditLogModel(
                    id=f"aud_agt_c_{uuid.uuid4().hex[:8]}",
                    action="AI_AGENT_CREATE",
                    entity_type="AiAgent",
                    entity_id=new_agent.id,
                    actor=actor_email,
                    user_email=actor_email,
                    timestamp=datetime.now(timezone.utc),
                    result="SUCCESS",
                    metadata_json=new_agent.model_dump(),
                )
            )
            session.commit()

        return new_agent

    def update_agent(self, agent_id: str, body: AiAgentUpdateRequest, actor_email: str = "willian.jesus@loft.com.br") -> AiAgentItem:
        agents = self.list_agents()
        agent = self.get_agent(agent_id)

        dump = agent.model_dump()
        for field, value in body.model_dump(exclude_unset=True).items():
            if value is not None:
                dump[field] = value

        updated = AiAgentItem(**dump)

        with SessionLocal() as session:
            row = session.scalar(
                select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_AGENTS_KEY)
            )
            current_list = [item if item["id"] != agent_id else updated.model_dump() for item in row.value]
            session.merge(SystemStateModel(key=SYSTEM_STATE_AGENTS_KEY, value=current_list))
            
            session.add(
                AuditLogModel(
                    id=f"aud_agt_u_{uuid.uuid4().hex[:8]}",
                    action="AI_AGENT_UPDATE",
                    entity_type="AiAgent",
                    entity_id=agent_id,
                    actor=actor_email,
                    user_email=actor_email,
                    timestamp=datetime.now(timezone.utc),
                    result="SUCCESS",
                    metadata_json=updated.model_dump(),
                )
            )
            session.commit()

        return updated

    def delete_agent(self, agent_id: str, actor_email: str = "willian.jesus@loft.com.br") -> None:
        agents = self.list_agents()
        agent = self.get_agent(agent_id)

        with SessionLocal() as session:
            row = session.scalar(
                select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_AGENTS_KEY)
            )
            current_list = [item for item in (row.value if row and row.value else []) if item["id"] != agent_id]
            session.merge(SystemStateModel(key=SYSTEM_STATE_AGENTS_KEY, value=current_list))
            
            session.add(
                AuditLogModel(
                    id=f"aud_agt_d_{uuid.uuid4().hex[:8]}",
                    action="AI_AGENT_DELETE",
                    entity_type="AiAgent",
                    entity_id=agent_id,
                    actor=actor_email,
                    user_email=actor_email,
                    timestamp=datetime.now(timezone.utc),
                    result="SUCCESS",
                    metadata_json={"agent_id": agent_id, "name": agent.name},
                )
            )
            session.commit()

    async def execute_agent(
        self,
        agent_id: str,
        request: AiAgentExecuteRequest,
        actor_email: str = "willian.jesus@loft.com.br",
    ) -> AiAgentExecuteResponse:
        agent = self.get_agent(agent_id)
        
        # Build contextual instruction prompt
        context_header = f"=== CONTEXTO DA TAREFA ({request.context_type.upper()}) ===\n"
        if request.context_id:
            context_header += f"Identificador do Recurso: {request.context_id}\n"
        
        full_prompt = f"{context_header}\nEntrada do Usuário:\n{request.input_text}"

        # Execute through AI Gateway with explicit provider and model
        gw_res = await ai_gateway_service.execute_prompt(
            request=AiGatewayExecuteRequest(
                prompt=full_prompt,
                system_prompt=agent.system_instruction,
                temperature=request.temperature_override or agent.temperature,
                override_provider=getattr(agent, "provider", "gemini") or "gemini",
                override_model=agent.model or "gemini-2.5-flash",
            ),
            actor_email=actor_email,
        )

        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

        # Update agent usage count
        with SessionLocal() as session:
            row = session.scalar(
                select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_AGENTS_KEY)
            )
            if row and row.value:
                updated_list = []
                for item in row.value:
                    if item["id"] == agent_id:
                        item["usage_count"] = item.get("usage_count", 0) + 1
                        item["last_executed_at"] = now_str
                    updated_list.append(item)
                session.merge(SystemStateModel(key=SYSTEM_STATE_AGENTS_KEY, value=updated_list))
                session.commit()

        # Generate concise reasoning summary
        reasoning = f"Executado com sucesso pelo agente '{agent.name}' utilizando o modelo {gw_res.model} em {gw_res.latency_ms}ms."

        return AiAgentExecuteResponse(
            agent_id=agent.id,
            agent_name=agent.name,
            output_text=gw_res.response,
            reasoning_summary=reasoning,
            latency_ms=gw_res.latency_ms,
            tokens_used=gw_res.prompt_tokens + gw_res.completion_tokens,
            model_used=gw_res.model,
            timestamp=now_str,
        )


ai_agent_service = AiAgentService()
