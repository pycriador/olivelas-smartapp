"""
AI Composition Service (Deterministic AI Agent Gateway)
Composes technical blueprints from structured requirements without probabilistic hallucinations.
"""
from __future__ import annotations
from datetime import datetime, timezone
import uuid
from typing import Any
from pydantic import BaseModel, Field, model_validator
from app.domain.entities import (
    Blueprint,
    BlueprintStatus,
    AuditAction,
)
from app.storage.database import db
from app.services.audit_service import AuditService
from app.services.ai_gateway_service import ai_gateway_service
from app.schemas.ai_gateway_schemas import AiGatewayExecuteRequest
from app.services.ai_provider_service import ai_provider_service
from app.services.blueprint_validation_service import blueprint_validation_service
from app.services.project_service import sync_blueprint_to_project


class ApplicationMetaInput(BaseModel):
    name: str = Field(..., description="Nome da aplicação solicitada")
    description: str | None = None
    database: str | None = Field(default=None, description="Motor de banco de dados preferencial (ex: postgresql, opsbase, sqlite)")
    architecture_id: str | None = Field(default=None, description="ID da arquitetura desejada no catálogo")
    project_id: str | None = Field(default=None, description="ID do projeto ao qual vincular este blueprint bidirecionalmente")


class AICompositionRequest(BaseModel):
    application: ApplicationMetaInput
    requirements: list[str] = Field(..., min_length=1, description="Lista de requisitos funcionais ou termos de negócio")
    project_id: str | None = Field(default=None, description="ID do projeto ao qual vincular este blueprint bidirecionalmente")
    provider: str | None = Field(default=None, description="Provedor de IA configurado (e.g. gemini, openai, anthropic)")
    model: str | None = Field(default=None, description="Modelo de IA selecionado (e.g. gemini-2.5-flash)")
    temperature: float | None = Field(default=0.2, description="Temperatura da inferência")
    system_instruction: str | None = Field(default=None, description="Instrução customizada de sistema")
    generate_ai_rationale: bool = Field(default=True, description="Gerar raciocínio técnico via inferência real de IA")

    @model_validator(mode="before")
    @classmethod
    def normalize_input(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if "application" not in values or not values["application"]:
                app_name = values.get("project_name") or values.get("name") or "Olivelas Application"
                values["application"] = {
                    "name": app_name,
                    "description": values.get("description"),
                    "database": values.get("database"),
                    "architecture_id": values.get("architecture_id"),
                    "project_id": values.get("project_id"),
                }
            elif isinstance(values["application"], str):
                values["application"] = {"name": values["application"], "project_id": values.get("project_id")}
            reqs = values.get("requirements")
            if isinstance(reqs, str):
                values["requirements"] = [r.strip() for r in reqs.split(",") if r.strip()] or [reqs]
        return values


class AICompositionResponse(BaseModel):
    type: str = "blueprint"
    blueprint_id: str
    project_id: str | None = None
    status: str = "ready"
    application_name: str
    architecture: str
    architecture_id: str
    database: str
    matched_features: list[str]
    identified_modules: list[str]
    identified_components: list[str]
    identified_templates: list[str]
    identified_rules: list[str]
    identified_specifications: list[str]
    identified_dependencies: list[str]
    selection_rationale: dict[str, str] = Field(default_factory=dict)
    validation: dict[str, Any] = Field(default_factory=dict)
    folder_structure: str
    api_contracts: list[dict[str, Any]]
    raw_blueprint: dict[str, Any]
    ai_status: str = "deterministic"
    warnings: list[str] = Field(default_factory=list)
    ai_provider: str | None = None
    ai_model: str | None = None
    ai_reasoning: str | None = None
    ai_latency_ms: int | None = None
    ai_tokens_used: int | None = None
    data: dict[str, Any] | None = None
    error: dict[str, Any] | None = None
    meta: dict[str, Any] = Field(default_factory=dict)


DOMAIN_MODULE_INTENTS: list[dict[str, Any]] = [
    {
        "module_id": "mod_auth_identity_be",
        "template_id": "tpl_loft_admin_backoffice",
        "keywords": [
            "login", "autenticacao", "autenticação", "signup", "auto-cadastro", "autocadastro",
            "jwt", "rbac", "iam", "usuarios", "usuários", "grupos", "papeis", "papéis",
            "roles", "permissoes", "permissões", "senha", "argon2", "sessao", "sessão",
            "bloqueio", "lockout", "identidade", "controle de acesso",
        ],
        "rationale": "Selecionado para atender aos requisitos de autenticação JWT, auto-cadastro (signup), gestão de usuários/grupos e matriz RBAC.",
    },
    {
        "module_id": "mod_data_table_filtering",
        "template_id": "tpl_loft_admin_backoffice",
        "keywords": [
            "crud", "listagem", "listagens", "tabela", "tabelas", "filtro", "filtros",
            "busca", "paginacao", "paginação", "cadastro", "gerenciamento", "gestao de usuarios",
            "gestão de usuários", "backoffice", "admin", "painel administrativo",
        ],
        "rationale": "Selecionado para fornecer componentes padronizados de listagem (DataTable), filtros avançados (FilterBar), paginação e estados vazios.",
    },
    {
        "module_id": "mod_audit_compliance",
        "template_id": "tpl_loft_compliance_audit",
        "keywords": [
            "auditoria", "audit", "trilha", "lgpd", "compliance", "conformidade",
            "rastreabilidade", "logs de seguranca", "logs de segurança", "governanca", "governança",
        ],
        "rationale": "Selecionado para atender aos requisitos de trilha de auditoria imutável, rastreabilidade de mutações e conformidade LGPD.",
    },
    {
        "module_id": "mod_analytics_kpi_dashboard",
        "template_id": "tpl_loft_analytics_bi",
        "keywords": [
            "dashboard", "kpi", "kpis", "metricas", "métricas", "analytics",
            "indicadores", "graficos", "gráficos", "relatorios executivos", "bi",
        ],
        "rationale": "Selecionado para visualização de indicadores (KPIs), métricas operacionais e painéis analíticos.",
    },
    {
        "module_id": "mod_landing_page_marketing",
        "template_id": "tpl_loft_static_landing_page",
        "keywords": [
            "landing page", "landing-page", "institucional", "vitrine", "showcase",
            "apresentacao da plataforma", "apresentação da plataforma", "hero section",
            "apresentacao para clientes", "apresentação para clientes",
        ],
        "rationale": "Selecionado para compor a página institucional de apresentação (Hero Section, vitrine de recursos e chamada para ação).",
    },
    {
        "module_id": "mod_crm_customer_management",
        "template_id": "tpl_loft_customer_crm_360",
        "keywords": [
            "crm", "carteira de clientes", "pipeline de vendas", "renegociacao",
            "renegociação", "locatarios", "locatários", "historico de relacionamento",
        ],
        "rationale": "Selecionado para gestão de relacionamento com clientes (CRM 360) e pipeline comercial.",
    },
    {
        "module_id": "mod_ai_chat_copilot",
        "template_id": "tpl_loft_ai_support_chatbot",
        "keywords": [
            "chatbot", "copiloto", "copilot", "rag", "assistente conversacional",
            "chat com ia", "streaming de chat", "atendimento ia",
        ],
        "rationale": "Selecionado para interface de chat/copiloto interativo com IA generativa e RAG.",
    },
    {
        "module_id": "mod_supplier_procurement",
        "template_id": "tpl_loft_supplier_management",
        "keywords": [
            "fornecedor", "fornecedores", "procurement", "suprimentos",
            "ordem de compra", "ordens de compra", "cotacao", "cotação", "cnd", "homologacao de fornecedores",
        ],
        "rationale": "Selecionado para gestão e homologação de fornecedores e compras (Procurement).",
    },
    {
        "module_id": "mod_payments_checkout",
        "template_id": "tpl_loft_fintech_checkout",
        "keywords": [
            "pagamento", "pagamentos", "pix", "boleto", "checkout", "fintech",
            "cobranca", "cobrança", "assinatura", "split de pagamento", "conciliacao bancaria",
        ],
        "rationale": "Selecionado para processamento transacional financeiro, checkout e meios de pagamento.",
    },
    {
        "module_id": "mod_document_kyc_validation",
        "template_id": "tpl_loft_onboarding_kyc",
        "keywords": [
            "kyc", "kyb", "biometria", "ocr", "antifraude",
            "validacao de documentos", "validação de documentos", "esteira antifraude",
        ],
        "rationale": "Selecionado para validação documental OCR, biometria e prevenção à fraude (KYC).",
    },
]


class AICompositionService:
    def __init__(self, audit_service: AuditService | None = None):
        self.audit = audit_service or AuditService()

    def compose_blueprint(self, req: AICompositionRequest) -> AICompositionResponse:
        app_name = req.application.name
        user_reqs = [r.strip() for r in req.requirements if r.strip()]
        user_reqs_lower = [r.lower() for r in user_reqs]
        combined_text = " ".join(
            user_reqs_lower
            + [
                app_name.lower(),
                (req.application.description or "").lower(),
                (req.application.database or "").lower(),
            ]
        )

        matched_modules: set[str] = set()
        matched_components: set[str] = set()
        matched_templates: set[str] = set()
        matched_rules: set[str] = set()
        matched_specs: set[str] = set()
        matched_deps: set[str] = set()
        matched_features: list[str] = list(user_reqs)
        selection_rationale: dict[str, str] = {}

        # Always include base navigation & layout module if available in catalog
        if "mod_layout_navigation" in db.modules:
            matched_modules.add("mod_layout_navigation")
            selection_rationale["mod_layout_navigation"] = (
                "Módulo estrutural canônico obrigatório para layout Copan (AppShell, Header, Sidebar e navegação)."
            )

        # 1. Domain-specific intent matching (avoids false-positive catalog flooding)
        for intent in DOMAIN_MODULE_INTENTS:
            mod_id = intent["module_id"]
            tpl_id = intent["template_id"]
            matched_kws = [kw for kw in intent["keywords"] if kw in combined_text]
            if matched_kws:
                if mod_id in db.modules:
                    matched_modules.add(mod_id)
                    selection_rationale[mod_id] = (
                        f"{intent['rationale']} (Termos detectados: {', '.join(matched_kws[:4])})"
                    )
                if tpl_id and tpl_id in db.templates:
                    matched_templates.add(tpl_id)
                    if tpl_id not in selection_rationale:
                        selection_rationale[tpl_id] = (
                            f"Template recomendado para o módulo '{mod_id}' com base nos termos: {', '.join(matched_kws[:3])}."
                        )

        # 2. Check persistence & database requirements (Gap 2 & Gap 7)
        asks_postgres = any(
            kw in combined_text
            for kw in ["postgres", "postgresql", "opsbase", "pgvector", "alembic", "rds", "aurora", "relacional"]
        )
        asks_opsbase = "opsbase" in combined_text
        asks_sqlite = any(kw in combined_text for kw in ["sqlite", "sqlite3"]) and not asks_postgres
        asks_persistence = (
            asks_postgres
            or asks_sqlite
            or "mod_auth_identity_be" in matched_modules
            or "mod_audit_compliance" in matched_modules
            or "mod_data_table_filtering" in matched_modules
            or any(
                kw in combined_text
                for kw in [
                    "banco de dados", "persistencia", "persistência", "database", "crud",
                    "cadastro", "usuarios", "usuários", "grupos", "login", "autenticacao",
                    "autenticação", "rbac", "auditoria", "sessao", "sessão", "sqlalchemy",
                ]
            )
        )
        asks_no_db = any(
            kw in combined_text
            for kw in [
                "sem banco de dados", "sem banco", "sem db", "no database",
                "sem persistencia", "sem persistência", "stateless", "apenas estatico",
            ]
        ) and not asks_postgres

        is_static_app = asks_no_db or (
            any(kw in combined_text for kw in ["landing page", "estatico", "estático"])
            and not asks_persistence
        )

        # Ensure persistent fullstack apps have data table + auth if not matched yet
        if not is_static_app and len(matched_modules) <= 1:
            if "mod_data_table_filtering" in db.modules:
                matched_modules.add("mod_data_table_filtering")
                selection_rationale["mod_data_table_filtering"] = (
                    "Incluído por padrão para suportar operações de listagem e CRUD em aplicações fullstack."
                )
            if "mod_auth_identity_be" in db.modules:
                matched_modules.add("mod_auth_identity_be")
                selection_rationale["mod_auth_identity_be"] = (
                    "Incluído por padrão para garantir autenticação JWT e controle de acesso RBAC."
                )
            if "tpl_loft_admin_backoffice" in db.templates:
                matched_templates.add("tpl_loft_admin_backoffice")
                selection_rationale["tpl_loft_admin_backoffice"] = (
                    "Template base para aplicações fullstack administrativas e operacionais."
                )

        if is_static_app:
            if "mod_landing_page_marketing" in db.modules:
                matched_modules.add("mod_landing_page_marketing")
                selection_rationale["mod_landing_page_marketing"] = (
                    "Aplicação estática/institucional sem persistência relacional."
                )
            if "tpl_loft_static_landing_page" in db.templates:
                matched_templates.add("tpl_loft_static_landing_page")
                selection_rationale["tpl_loft_static_landing_page"] = (
                    "Template canônico para landing pages institucionais stateless."
                )

        # 3. Select Architecture & Database Engine (Gap 2 & Gap 7)
        if req.application.architecture_id and req.application.architecture_id in db.architectures:
            arch_id = req.application.architecture_id
        elif is_static_app and "arch_static_landing_page" in db.architectures:
            arch_id = "arch_static_landing_page"
        elif asks_opsbase and "arch_loft_postgres_opsbase_fullstack" in db.architectures:
            arch_id = "arch_loft_postgres_opsbase_fullstack"
        elif any("fianca" in r or "fiança" in r or "imobiliaria" in r for r in user_reqs_lower) and "arch_loft_portal_spa" in db.architectures:
            arch_id = "arch_loft_portal_spa"
        elif "arch_loft_standard_fullstack" in db.architectures:
            arch_id = "arch_loft_standard_fullstack"
        elif db.architectures:
            arch_id = list(db.architectures.keys())[0]
        else:
            arch_id = "arch_loft_standard_fullstack"

        arch = db.architectures.get(arch_id)
        if is_static_app:
            database_engine = "None (Stateless / In-Memory)"
            arch_name = arch.name if arch else "Olivelas Institutional Landing Page & Static Showcase Architecture"
            selection_rationale[arch_id] = "Arquitetura stateless selecionada pois não há requisitos de persistência em banco de dados."
        elif asks_sqlite:
            database_engine = "SQLite 3.x (SQLAlchemy 2.0 ORM)"
            arch_name = arch.name if arch else "Olivelas Standard Fullstack (React 19 + FastAPI + SQLAlchemy 2.0)"
            selection_rationale[arch_id] = "Arquitetura fullstack selecionada com persistência local em SQLite conforme solicitado."
        elif asks_opsbase:
            database_engine = "PostgreSQL 16 via Olivelas Opsbase (SQLAlchemy 2.0 + Alembic)"
            arch_name = arch.name if arch else "Olivelas Standard Fullstack (Vite React 19 + FastAPI + PostgreSQL / Opsbase)"
            selection_rationale[arch_id] = (
                "Arquitetura fullstack persistente selecionada para atender aos requisitos de banco PostgreSQL gerenciado via Olivelas Opsbase."
            )
        else:
            database_engine = "PostgreSQL 16 (SQLAlchemy 2.0 + Alembic)"
            arch_name = arch.name if arch else "Olivelas Standard Fullstack (Vite React 19 + FastAPI + PostgreSQL)"
            selection_rationale[arch_id] = (
                "Arquitetura fullstack canônica selecionada com persistência transacional em PostgreSQL 16 + SQLAlchemy 2.0 + Alembic."
            )

        # 4. Collect components, rules, specs, and dependencies strictly from selected modules/templates
        # IMPORTANT (Gap 3): Never add package names (e.g. react, fastapi, pyjwt) to matched_modules!
        for mod_id in list(matched_modules):
            mod = db.modules.get(mod_id)
            if not mod:
                continue
            for comp_id in mod.components:
                if comp_id in db.components:
                    matched_components.add(comp_id)
            for rule_id in mod.rules:
                if rule_id in db.rules:
                    matched_rules.add(rule_id)
            for spec_id in mod.specifications:
                if spec_id in db.specifications:
                    matched_specs.add(spec_id)
            for dep in mod.dependencies:
                if dep in db.modules:
                    matched_modules.add(dep)
                    if dep not in selection_rationale:
                        selection_rationale[dep] = f"Dependência de domínio requerida pelo módulo '{mod_id}'."
                else:
                    matched_deps.add(dep)

        for tpl_id in list(matched_templates):
            tpl = db.templates.get(tpl_id)
            if not tpl:
                continue
            for comp_id in tpl.components:
                if comp_id in db.components:
                    matched_components.add(comp_id)
            for rule_id in tpl.rules:
                if rule_id in db.rules:
                    matched_rules.add(rule_id)
            for spec_id in tpl.specifications:
                if spec_id in db.specifications:
                    matched_specs.add(spec_id)

        # Add RBAC guard & user repository backend components when auth/IAM is requested
        if "mod_auth_identity_be" in matched_modules:
            for extra_comp in ["cmp_be_user_repository", "cmp_be_rbac_guard", "cmp_be_audit_service"]:
                if extra_comp in db.components:
                    matched_components.add(extra_comp)

        # Resolve component rules, specs & package dependencies
        for c_id in list(matched_components):
            comp = db.components.get(c_id)
            if not comp:
                continue
            for dep in comp.dependencies:
                if dep not in db.modules:
                    matched_deps.add(dep)
            for r_id in comp.rules:
                if r_id in db.rules:
                    matched_rules.add(r_id)
            for s_id in comp.specifications:
                if s_id in db.specifications:
                    matched_specs.add(s_id)

        # Attach architecture mandatory rules & specs so validate-config passes with 0 errors
        if arch:
            for r_id in arch.rules:
                if r_id in db.rules:
                    matched_rules.add(r_id)
            for s_id in arch.specifications:
                if s_id in db.specifications:
                    matched_specs.add(s_id)

        # Apply canonical engineering rules
        for r_id in [
            "rul_copan_01_brand_orange",
            "rul_copan_02_tokens_only",
            "rul_fe_05_css_toolchain_complete",
            "rul_loft_be_api_envelope",
            "rul_loft_be_error_codes",
            "rul_sec_04_audit_trail_logging",
        ]:
            if r_id in db.rules:
                matched_rules.add(r_id)

        # Core specs
        for s_id in [
            "spec_be_loft_backend_foundation",
            "spec_be_loft_backend_security_specification",
            "spec_be_loft_backend_api_specification",
            "spec_fe_volume_i_loft_design_system_foundation_ui_guidelines",
        ]:
            if s_id in db.specifications:
                matched_specs.add(s_id)

        # 5. Core package dependencies tailored to architecture & database
        matched_deps.update({
            "FastAPI>=0.115.0",
            "Pydantic>=2.8.0",
            "PyJWT>=2.9.0",
            "argon2-cffi>=23.1.0",
            "React>=19.0.0",
            "@loft/react-loft",
            "@loft/tokens-loft",
            "@loft/react-icons",
            "tailwindcss>=3.4.4",
            "postcss>=8.4.38",
            "autoprefixer>=10.4.19",
            "@tanstack/react-query>=5.50.0",
            "axios>=1.7.4",
        })
        if not is_static_app:
            matched_deps.add("SQLAlchemy>=2.0.0")
            matched_deps.add("Alembic>=1.13.0")
            if not asks_sqlite:
                matched_deps.add("psycopg[binary]>=3.2.0")
                matched_deps.add("asyncpg>=0.29.0")

        # Strict catalog ID filtering to guarantee validate-config passes (Gap 3)
        valid_modules = sorted([m for m in matched_modules if m in db.modules])
        valid_components = sorted([c for c in matched_components if c in db.components])
        valid_templates = sorted([t for t in matched_templates if t in db.templates])
        valid_rules = sorted([r for r in matched_rules if r in db.rules])
        valid_specs = sorted([s for s in matched_specs if s in db.specifications])
        valid_deps = sorted(list(matched_deps))

        # 6. Validate blueprint configuration right away so blueprint is READY (Gap 3)
        validation_res = blueprint_validation_service.validate_blueprint_configuration(
            architecture_id=arch_id,
            module_ids=valid_modules,
            component_ids=valid_components,
            template_ids=valid_templates,
            rule_ids=valid_rules,
            specification_ids=valid_specs,
        )

        folder_structure = (
            f"""{app_name.lower().replace(' ', '-')}/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/ (config, errors, logging)
│   │   └── api/v1/ (mock endpoints & health)
│   └── tests/
└── frontend/
    ├── src/
    │   ├── components/layout/ (AppHeader, Sidebar, AppSwitcher)
    │   ├── features/landing/ (LandingPage showcase)
    │   ├── theme/
    │   └── App.tsx
    └── package.json"""
            if is_static_app
            else f"""{app_name.lower().replace(' ', '-')}/
├── backend/
│   ├── alembic/ (migrations PostgreSQL / Opsbase)
│   ├── app/
│   │   ├── main.py
│   │   ├── core/ (config, security, errors, logging)
│   │   ├── db/ (session, base, opsbase_connector)
│   │   ├── modules/
{chr(10).join([f'│   │   │   ├── {m.replace("mod_", "").replace("mod-", "")}/' for m in valid_modules])}
│   │   └── api/v1/
│   └── tests/
└── frontend/
    ├── src/
    │   ├── app/ (router, providers)
    │   ├── components/
    │   ├── features/
    │   └── theme/
    └── package.json"""
        )

        # Generate API contracts from selected modules
        api_contracts: list[dict[str, Any]] = []
        for m_id in valid_modules:
            mod = db.modules.get(m_id)
            if not mod:
                continue
            for api_route in mod.apis:
                method = "POST" if any(k in api_route for k in ["login", "signup", "token", "upload", "verify", "charge", "pix"]) else "GET"
                api_contracts.append({
                    "path": api_route,
                    "method": method,
                    "module_id": m_id,
                    "summary": f"Endpoint fornecido pelo módulo {mod.name}",
                    "status_code": 200,
                })

        bp_id = f"bp_{uuid.uuid4().hex[:8]}"
        bp_status = BlueprintStatus.READY if validation_res.can_publish else BlueprintStatus.DRAFT
        target_project_id = req.project_id or req.application.project_id
        raw_blueprint_json = {
            "id": bp_id,
            "project": app_name,
            "project_id": target_project_id,
            "status": bp_status.value.lower(),
            "architecture": arch_name,
            "architecture_id": arch_id,
            "is_static": is_static_app,
            "database": database_engine,
            "features": matched_features,
            "modules": valid_modules,
            "components": valid_components,
            "templates": valid_templates,
            "rules": valid_rules,
            "specifications": valid_specs,
            "dependencies": valid_deps,
            "selection_rationale": selection_rationale,
            "validation": validation_res.model_dump(),
        }

        bp = Blueprint(
            id=bp_id,
            name=f"{app_name} Blueprint",
            description=f"Blueprint determinístico gerado para '{app_name}' a partir dos requisitos: {', '.join(user_reqs)}",
            project_id=target_project_id,
            status=bp_status,
            architecture_id=arch_id,
            architecture_name=arch_name,
            features=matched_features,
            modules=valid_modules,
            components=valid_components,
            templates=valid_templates,
            rules=valid_rules,
            specifications=valid_specs,
            dependencies=valid_deps,
            validation=validation_res,
            folder_structure=folder_structure,
            api_contracts=api_contracts,
            raw_blueprint_json=raw_blueprint_json,
        )
        db.blueprints[bp.id] = bp
        if target_project_id:
            sync_blueprint_to_project(bp, target_project_id)

        self.audit.log(
            action=AuditAction.AI_BLUEPRINT_COMPOSED,
            resource="Blueprint",
            resource_id=bp.id,
            metadata={
                "application_name": app_name,
                "project_id": bp.project_id,
                "architecture_id": arch_id,
                "database": database_engine,
                "modules_count": len(valid_modules),
                "templates_count": len(valid_templates),
                "status": bp_status.value.lower(),
            },
        )

        res = AICompositionResponse(
            type="blueprint",
            blueprint_id=bp.id,
            project_id=bp.project_id,
            status=bp_status.value.lower(),
            application_name=app_name,
            architecture=arch_name,
            architecture_id=arch_id,
            database=database_engine,
            matched_features=matched_features,
            identified_modules=valid_modules,
            identified_components=valid_components,
            identified_templates=valid_templates,
            identified_rules=valid_rules,
            identified_specifications=valid_specs,
            identified_dependencies=valid_deps,
            selection_rationale=selection_rationale,
            validation=validation_res.model_dump(),
            folder_structure=folder_structure,
            api_contracts=api_contracts,
            raw_blueprint=raw_blueprint_json,
            ai_status="deterministic",
            warnings=[],
            ai_provider=req.provider or "gemini",
            ai_model=req.model or "gemini-2.5-flash",
            ai_reasoning=(
                f"Composição determinística SDD concluída para '{app_name}' com banco '{database_engine}' "
                f"e arquitetura '{arch_id}'. Módulos selecionados ({len(valid_modules)}): {', '.join(valid_modules)}."
            ),
        )
        self._populate_envelope(res)
        return res

    @staticmethod
    def _populate_envelope(res: AICompositionResponse) -> None:
        payload = res.model_dump(exclude={"data", "error", "meta"})
        res.data = payload
        res.error = None
        res.meta = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "version": "2.4.0",
            "ai_status": res.ai_status,
            "warnings": res.warnings,
            "can_publish": res.validation.get("can_publish", True),
        }

    async def compose_blueprint_async(
        self,
        req: AICompositionRequest,
        actor_email: str = "willian.jesus@olivelas.com.br",
    ) -> AICompositionResponse:
        base_res = self.compose_blueprint(req)

        if not req.generate_ai_rationale:
            self._populate_envelope(base_res)
            return base_res

        prov_config = ai_provider_service.get_masked_settings()
        target_provider = req.provider or prov_config.default_provider or "gemini"
        target_model = req.model or prov_config.default_model or "gemini-2.5-flash"

        system_instruction = req.system_instruction or """Você é o Engenheiro Chefe de Arquitetura de Software da Olivelas (Olivelas Enterprise Architecture Lead).
Sua missão é emitir um Parecer Técnico e Racional de Engenharia para o Blueprint de aplicação composto deterministicamente.
Analise:
1. Aderência às Golden Rules de Engenharia (RUL-01 a RUL-04).
2. Estratégia de desacoplamento entre Frontend (Copan Design System & FSD) e Backend (FastAPI, DDD, PostgreSQL).
3. Recomendações de segurança (BOLA, RBAC), idempotência e observabilidade com OpenTelemetry.
Seja conciso, técnico, direto e estruturado."""

        prompt = f"""=== PARECER DE ARQUITETURA PARA NOVA APLICAÇÃO OLIVELAS ===
Nome da Aplicação: {req.application.name}
Descrição: {req.application.description or 'N/A'}
Banco de Dados Selecionado: {base_res.database}
Requisitos Funcionais:
{chr(10).join([f'- {r}' for r in req.requirements])}

Módulos Mapeados: {', '.join(base_res.identified_modules)}
Componentes Selecionados: {', '.join(base_res.identified_components)}
Golden Rules Aplicadas: {', '.join(base_res.identified_rules)}
Arquitetura Base: {base_res.architecture} ({base_res.architecture_id})

Por favor, forneça a justificativa técnica de arquitetura, pontos de atenção de segurança/idempotência e recomendações de rollout para este Blueprint."""

        try:
            gw_res = await ai_gateway_service.execute_prompt(
                request=AiGatewayExecuteRequest(
                    prompt=prompt,
                    system_prompt=system_instruction,
                    temperature=req.temperature or 0.2,
                    override_provider=target_provider,
                    override_model=target_model,
                ),
                actor_email=actor_email,
            )
            base_res.ai_status = "ok"
            base_res.warnings = []
            base_res.ai_provider = gw_res.provider
            base_res.ai_model = gw_res.model
            base_res.ai_reasoning = gw_res.response
            base_res.ai_latency_ms = gw_res.latency_ms
            base_res.ai_tokens_used = gw_res.completion_tokens + gw_res.prompt_tokens
        except Exception as e:
            err_msg = str(e)
            base_res.ai_status = "unavailable"
            base_res.warnings = [
                f"AI_GATEWAY_UNAVAILABLE: Inferência LLM ({target_provider}/{target_model}) indisponível ({err_msg}). "
                "O blueprint foi composto exclusivamente pelo motor determinístico SDD; configure uma chave válida em /api/v1/ai-providers para habilitar o parecer generativo."
            ]
            base_res.ai_reasoning = (
                f"[MODO DETERMINÍSTICO — IA INDISPONÍVEL] Parecer generativo do gateway '{target_provider}/{target_model}' "
                f"não pôde ser emitido ({err_msg}). Justificativa determinística por item disponível em 'selection_rationale'."
            )

        self._populate_envelope(base_res)
        return base_res


ai_composition_service = AICompositionService()
