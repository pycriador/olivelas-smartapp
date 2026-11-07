"""
SDD Knowledge Loader & Document Parser
Loads and indexes all Olivelas SDDs, Design System docs, and CLAUDE.md
"""
from __future__ import annotations
import os
import re
from pathlib import Path
from app.core.config import settings
from app.domain.models import KnowledgeCategory, KnowledgeDocument


class SDDLoader:
    def __init__(self, workspace_root: Path | None = None) -> None:
        self.workspace_root = workspace_root or settings.WORKSPACE_ROOT
        self._documents: dict[str, KnowledgeDocument] = {}
        self._load_all()

    def _load_all(self) -> None:
        # 1. Load CLAUDE.md (Master Guide)
        claude_path = self.workspace_root / "CLAUDE.md"
        if claude_path.exists():
            content = claude_path.read_text(encoding="utf-8")
            self._documents["claude-master-guide"] = KnowledgeDocument(
                id="claude-master-guide",
                title="CLAUDE.md — Padrão Olivelas (Frontend + Backend)",
                category=KnowledgeCategory.MASTER_GUIDE,
                volume="Master Guide",
                file_path=str(claude_path),
                summary="Consolidação de regras operacionais, Golden Rules de arquitetura, segurança e IA para desenvolvimento assistido.",
                key_points=[
                    "Copan (@loft/react-loft + @loft/tokens-loft) é dependência técnica mandatória, não referência visual",
                    "Copan + Olivelas Conventions = Olivelas UI",
                    "Stack Frontend: React 19+, TypeScript, Vite, TanStack Router/Query, Zustand, RHF, Zod",
                    "Stack Backend: Python 3.13+, FastAPI, PostgreSQL async (SQLAlchemy 2.x), Alembic, Pydantic v2",
                    "Arquitetura: API First + AI First + Security by Design",
                    "IA isolada via AIService -> LLMGateway -> Provider Adapter (AI-BAS)",
                    "Segurança: Zero Trust, Default Deny, autorização por objeto (BOLA/IDOR), tenant isolation",
                ],
                tags=["master", "rules", "frontend", "backend", "security", "ai"],
                content=content,
            )

        # 2. Load sdd-frontend
        fe_dir = self.workspace_root / "sdd-frontend"
        if fe_dir.exists():
            for f in sorted(fe_dir.glob("*.md")):
                content = f.read_text(encoding="utf-8")
                doc_id = f"frontend-{f.stem.lower().replace(' ', '-').replace('—', '-')}"
                
                # Extract volume if present
                vol_match = re.search(r"Volume\s+([IVXLCDM]+)", f.name)
                volume = f"Volume {vol_match.group(1)}" if vol_match else "Frontend Doc"

                # Extract first lines for summary
                lines = [l.strip() for l in content.splitlines() if l.strip() and not l.startswith("#")]
                summary = lines[0] if lines else f"Documento de especificação: {f.name}"

                self._documents[doc_id] = KnowledgeDocument(
                    id=doc_id,
                    title=f.stem.replace("Loft", "Olivelas").replace("AIOps", "Olivelas"),
                    category=KnowledgeCategory.FRONTEND_SPEC,
                    volume=volume,
                    file_path=str(f),
                    summary=summary,
                    key_points=[
                        "Especificação canônica de frontend Olivelas",
                        "Padronização de componentes, arquitetura, design tokens e fluxos de usuário",
                    ],
                    tags=["frontend", "ui", "react", "copan", "design-system", volume.lower()],
                    content=content,
                )

        # 3. Load sdd-backend
        be_dir = self.workspace_root / "sdd-backend"
        if be_dir.exists():
            for f in sorted(be_dir.glob("*.md")):
                content = f.read_text(encoding="utf-8")
                doc_id = f"backend-{f.stem.lower().replace(' ', '-')}"

                vol_match = re.search(r"Volume\s+([IVXLCDM]+)", content)
                volume = f"Volume {vol_match.group(1)}" if vol_match else "Backend Doc"

                lines = [l.strip() for l in content.splitlines() if l.strip() and not l.startswith("#")]
                summary = lines[0] if lines else f"Documento de especificação backend: {f.name}"

                self._documents[doc_id] = KnowledgeDocument(
                    id=doc_id,
                    title=f.stem.replace("Loft", "Olivelas").replace("AIOps", "Olivelas"),
                    category=KnowledgeCategory.BACKEND_SPEC,
                    volume=volume,
                    file_path=str(f),
                    summary=summary,
                    key_points=[
                        "Especificação canônica de backend Olivelas",
                        "Padrões de engenharia, contratos de API, segurança Zero Trust e arquitetura de IA",
                    ],
                    tags=["backend", "python", "fastapi", "sqlalchemy", "security", "ai", "api"],
                    content=content,
                )

        # 4. Load copan_design_system
        ds_dir = self.workspace_root / "copan_design_system"
        if ds_dir.exists():
            readme = ds_dir / "README.md"
            if readme.exists():
                content = readme.read_text(encoding="utf-8")
                self._documents["copan-design-system-readme"] = KnowledgeDocument(
                    id="copan-design-system-readme",
                    title="Copan — Olivelas Design System (README)",
                    category=KnowledgeCategory.DESIGN_SYSTEM,
                    volume="Design System",
                    file_path=str(readme),
                    summary="Fundamentos visuais, tom de voz em pt-BR, cores (Orange #F56738), tipografia Inter e regras de UI.",
                    key_points=[
                        "Tom de voz em pt-BR, imperativo gentil, nunca 'nós' ou 'Sr./Sra.'",
                        "Sem emojis em telas de produto",
                        "Formatação de moeda R$ 1.234,56 e área 62m²",
                        "Cards: 12px radius, 1px borda OU sombra elevation-raised (nunca ambos)",
                        "Header 72px fixo e footer escuro #121619",
                    ],
                    tags=["design-system", "tokens", "voice-and-tone", "colors", "typography"],
                    content=content,
                    author="Olivelas Design Guild",
                    version="2.4.0",
                )

        # 5. Load Architecture ADRs (ADR-0001 to ADR-0006)
        adr_dir = self.workspace_root / "app_builder_engine" / "docs" / "architecture"
        if adr_dir.exists():
            for f in sorted(adr_dir.glob("ADR-*.md")):
                content = f.read_text(encoding="utf-8")
                doc_id = f"adr-{f.stem.lower()}"
                
                # Extract title from first # line
                title_line = [l.strip("# ").strip() for l in content.splitlines() if l.startswith("# ")]
                title = title_line[0] if title_line else f.stem

                self._documents[doc_id] = KnowledgeDocument(
                    id=doc_id,
                    title=f"{f.stem}: {title}",
                    category=KnowledgeCategory.ARCHITECTURE_ADR,
                    volume="Architecture Decisions (ADRs)",
                    file_path=str(f),
                    summary=f"Registro de decisão arquitetural canônica da Olivelas ({f.stem}).",
                    key_points=[
                        "Decisão arquitetural formal e imutável",
                        "Contexto, opções avaliadas, decisão aprovada e consequências",
                    ],
                    tags=["architecture", "adr", "rfc", "standards", f.stem.lower()],
                    content=content,
                    author="Olivelas Architecture Chapter",
                    version="1.0.0",
                )

        # 6. Canonical AI Skills & Prompts (Cursor, Claude, Antigravity)
        self._documents["ai-skills-cursor-claude"] = KnowledgeDocument(
            id="ai-skills-cursor-claude",
            title="Olivelas AI Engineering Skills: Cursor Rules, Claude & Antigravity",
            category=KnowledgeCategory.AI_SKILLS_PROMPTS,
            volume="AI Assistant Skills",
            file_path=None,
            summary="Conjunto de regras canônicas (.cursorrules), instruções de sistema do Claude Code e habilidades do Antigravity para desenvolvimento assistido na Olivelas.",
            key_points=[
                "Regras de UI: usar sempre as bibliotecas @loft/* reais (@loft/react-loft, @loft/tokens-loft, @loft/react-icons)",
                "Frontend: React 19, Vite, TanStack Router, Copan (@loft/react-loft) com tokens reais (@loft/tokens-loft)",
                "Backend: FastAPI async, Pydantic v2, SQLAlchemy 2.0 com async_session, Alembic com rollback testado",
                "Segurança: Proibição estrita de dados mock em testes de produção, sanitização de PII e validação BOLA/BFLA",
                "IA: Chamadas isoladas via AI Gateway com timeout de 30s e fallback automático de modelo",
            ],
            tags=["ai", "cursor", "claude", "antigravity", "prompt-engineering", "skills", "cursorrules"],
            content="""# Olivelas AI Engineering Skills & Rules (.cursorrules / Claude / Antigravity)

Este documento define as **regras de ouro e habilidades** para agentes de IA que operam no ecossistema da Olivelas (Cursor, Claude Code, Antigravity, Copilot).

---

## 1. Regras Canônicas para Cursor (.cursorrules)

```markdown
# Olivelas Engineering Rules for Cursor & AI Agents

Você é um Engenheiro de Software Senior e Arquiteto na Olivelas. Siga rigorosamente os padrões abaixo:

### 1.1 Frontend (React 19 + TypeScript)
- Use **React 19**, TypeScript estrito, Vite.
- Componentes e tokens **reais** do Copan — nunca Ant Design, MUI, Chakra ou hex hardcoded:
  - `@loft/react-loft`: componentes (Button, TextField, Table, Dialog, Modal, Tabs, Typography, ...)
  - `@loft/tokens-loft`: tokens (`color.background.brand` / `color.decorative.orange.main` = `#FF774A`, `color.text.primary` = `#191F23`, `color.interaction.link` = `#20A483`)
  - `@loft/react-icons`: ícones nomeados
  - Pacotes privados — requerem `NPM_TOKEN` no `.npmrc` (`//registry.npmjs.org/:_authToken=${NPM_TOKEN}`)
- Estruture o código em **Feature-Sliced Design (FSD)**: `app/`, `features/`, `components/`, `services/`, `types/`.
- Sempre importar `@loft/react-loft`/`@loft/tokens-loft` de verdade — nunca copiar só a paleta de cores sobre outra biblioteca de UI.

### 1.2 Backend (FastAPI + Python 3.13)
- Use **FastAPI**, Pydantic v2 e SQLAlchemy 2.0 com suporte async (`async_sessionmaker`).
- Camadas desacopladas: `api/v1/` (Routers) -> `services/` (Regras de Negócio) -> `models/` e `storage/` (Persistência).
- Envelopamento padrão de respostas:
  ```json
  {
    "data": { ... },
    "error": null,
    "meta": { "timestamp": "...", "version": "1.0.0" }
  }
  ```
- Todas as mutações críticas de pagamento devem aceitar o cabeçalho `Idempotency-Key`.

### 1.3 Migrações de Banco de Dados (Alembic)
- Padrão **Expand & Contract** para zero-downtime.
- Toda migration DEVE conter método `upgrade()` e `downgrade()` totalmente reversíveis.
```

---

## 2. Padrão de Prompt de Sistema do Claude Code (CLAUDE.md)

O arquivo `CLAUDE.md` na raiz do repositório orienta o Claude sobre a pilha tecnológica, convenções de commits, suíte de testes e políticas de segurança.

---

## 3. Diretrizes de IA-First & AI-BAS

Todas as integrações de inteligência artificial na Olivelas devem seguir a arquitetura **AI-BAS (AI-Backed Agentic Services)**:
1. **Isolamento de Credenciais**: API Keys nunca são hardcoded nem expostas no frontend.
2. **Gateway Resiliente**: Toda chamada LLM passa pelo AI Gateway com fallback (ex: Gemini 2.5 Flash -> Failover).
3. **Auditabilidade Total**: Cada inferência registra autor, latência, tokens consumidos e prompt hash.
""",
            author="Olivelas AI Chapter",
            version="2.1.0",
        )

        # 7. Security & IAM Guidelines
        self._documents["security-zero-trust-guidelines"] = KnowledgeDocument(
            id="security-zero-trust-guidelines",
            title="Guia de Segurança Zero-Trust & Prevenção BOLA/BFLA na Olivelas",
            category=KnowledgeCategory.SECURITY_IAM,
            volume="Security Standards",
            file_path=None,
            summary="Padrões de segurança por design, autenticação RBAC granular, prevenção a vulnerabilidades OWASP Top 10 e conformidade LGPD.",
            key_points=[
                "Zero Trust & Default Deny em todas as rotas da API",
                "Validação estrita de BOLA (Broken Object Level Authorization) comparando tenant_id e user_id do token",
                "Sanitização de PII (CPF, RG, e-mail, telefone) antes de envio para logs ou provedores de IA",
                "Assinatura criptográfica HMAC SHA-256 em webhooks de terceiros",
            ],
            tags=["security", "zero-trust", "owasp", "bola", "bfla", "iam", "rbac", "lgpd"],
            content="""# Guia de Segurança Zero-Trust & Prevenção BOLA/BFLA

## 1. Princípio de Menor Privilégio & Default Deny
Por padrão, todo endpoint da API deve negar acesso a menos que o token JWT contenha a claim de privilégio necessária.

```python
# Exemplo de verificação de permissão no FastAPI
@router.post("/contracts/{contract_id}/sign")
async def sign_contract(
    contract_id: str,
    current_user: User = Depends(get_current_user),
    contract_service: ContractService = Depends(get_contract_service),
):
    # Verificação BOLA: Usuário é o titular ou corretor autorizado deste contrato?
    contract = await contract_service.get_contract(contract_id)
    if contract.tenant_id != current_user.tenant_id and current_user.role != "global_admin":
        raise ForbiddenError("Acesso negado ao contrato especificado.", code="BOLA_VIOLATION")
    
    return await contract_service.sign(contract_id, user=current_user)
```

## 2. Sanitização de PII
Dados sensíveis de inquilinos e locadores nunca devem ser gravados em texto claro em logs de aplicação ou enviados a modelos de IA abertos sem máscara.
""",
            author="Olivelas InfoSec Team",
            version="1.5.0",
        )

        # 8. SRE & Observability Playbook
        self._documents["sre-observability-playbook"] = KnowledgeDocument(
            id="sre-observability-playbook",
            title="Playbook de Observabilidade, Tracing Distribuído & SRE",
            category=KnowledgeCategory.DEVOPS_SRE,
            volume="DevOps & SRE",
            file_path=None,
            summary="Diretrizes de instrumentação com OpenTelemetry, métricas Prometheus, logs estruturados em JSON e políticas de SLI/SLO da Olivelas.",
            key_points=[
                "OpenTelemetry SDK com auto-instrumentação para FastAPI, SQLAlchemy e HTTPX",
                "Métricas padrão RED: Rate (RPS), Errors (5xx), Duration (p95/p99 latency)",
                "Logs estruturados contendo trace_id, span_id, tenant_id e user_id",
                "Alertas proativos no Slack/PagerDuty para taxas de erro superiores a 1% em 5 minutos",
            ],
            tags=["sre", "devops", "opentelemetry", "metrics", "prometheus", "tracing", "runbook"],
            content="""# Playbook de Observabilidade & SRE

## 1. Métricas RED
Todas as aplicações Olivelas expõem métricas Prometheus no endpoint `/metrics`:
- **Rate**: `http_requests_total{method, endpoint, status_code}`
- **Errors**: `http_request_errors_total{endpoint, error_code}`
- **Duration**: `http_request_duration_seconds_bucket{endpoint, le}`

## 2. Distributed Tracing com OpenTelemetry
Propague o cabeçalho `traceparent` (W3C Trace Context) em todas as chamadas HTTP e filas de mensageria para manter a correlação de ponta a ponta.
""",
            author="Olivelas SRE Guild",
            version="1.3.0",
        )

        # 9. Confluence Synced Doc (Sample)
        self._documents["confluence-loft-arch-wiki"] = KnowledgeDocument(
            id="confluence-loft-arch-wiki",
            title="Olivelas Architecture Wiki & Engineering Guild Standard (Confluence Sync)",
            category=KnowledgeCategory.EXTERNAL_CONFLUENCE,
            volume="Confluence Cloud",
            file_path=None,
            summary="Documento sincronizado do Confluence Space 'TECH' contendo diretrizes do Architecture Guild da Olivelas.",
            key_points=[
                "Sincronização bidirecional via Confluence REST API",
                "Padrão de RFC (Request for Comments) para novas dependências e mudanças arquiteturais",
                "Guia de design de banco de dados e particionamento de tabelas",
            ],
            tags=["confluence", "atlassian", "wiki", "architecture", "rfc", "external-sync"],
            content="""# Olivelas Architecture Guild Wiki (Confluence Space: TECH)

> **Origem**: Atlassian Confluence Cloud (`https://olivelas.atlassian.net/wiki/spaces/TECH/pages/4819201`)
> **Última Sincronização**: Automática via Confluence REST API

## 1. Governança de Mudanças Arquiteturais
Qualquer alteração que introduza novo banco de dados, broker de mensagens ou serviço de IA deve passar por uma **RFC (Request for Comments)** avaliada pelo Architecture Chapter.

## 2. Critérios de Avaliação
1. **Impacto de Custo**: Estimativa de custo de infraestrutura e tokens de LLM.
2. **Observabilidade**: Suporte nativo a OpenTelemetry e métricas Prometheus.
3. **Escalabilidade**: Testes de carga demonstrando capacidade de 1.000 RPS sem degradação de p95.
""",
            author="Architecture Chapter",
            version="3.0.0",
            source_url="https://olivelas.atlassian.net/wiki/spaces/TECH/pages/4819201",
        )

        # 10. GitHub Synced Doc (Sample)
        self._documents["github-aiops-documentation"] = KnowledgeDocument(
            id="github-aiops-documentation",
            title="aiops-documentation Repository Standard (GitHub Sync)",
            category=KnowledgeCategory.EXTERNAL_GITHUB,
            volume="GitHub Docs",
            file_path=None,
            summary="Documentação técnica consolidada sincronizada do repositório oficial pycriador/olivelas-smartapp.",
            key_points=[
                "Sincronizado automaticamente com o branch main do repositório GitHub",
                "Catálogo de agentes de IA, contratos de prompts e benchmarks de modelos",
                "Instruções para deploy contínuo em Kubernetes (EKS)",
            ],
            tags=["github", "aiops", "git-sync", "ci-cd", "kubernetes", "external-sync"],
            content="""# aiops-documentation Repository Standard

> **Origem**: GitHub (`https://github.com/pycriador/olivelas-smartapp`)
> **Branch**: `main`

## Visão Geral
O repositório `aiops-documentation` consolida as especificações operacionais de Olivelas da Olivelas, incluindo:
- Catálogo de Agentes de IA e ferramentas aprovadas.
- Benchmarks de acurácia e latência de modelos (Gemini 2.5 Flash, Claude 3.7 Sonnet, GPT-4o).
- Guias de contingência e failover de provedores de IA.
""",
            author="Olivelas Core Team",
            version="1.1.0",
            source_url="https://github.com/pycriador/olivelas-smartapp",
        )

        # 9. Load all canonical documents from pycriador/olivelas-smartapp
        try:
            from app.storage.aiops_docs_loader import load_aiops_documentation
            aiops_docs = load_aiops_documentation()
            for doc in aiops_docs:
                self._documents[doc.id] = doc
        except Exception as e:
            pass

    def get_all(self) -> list[KnowledgeDocument]:
        return list(self._documents.values())

    def get_by_id(self, doc_id: str) -> KnowledgeDocument | None:
        return self._documents.get(doc_id)

    def search(self, query: str, category: KnowledgeCategory | None = None, limit: int = 10) -> list[tuple[KnowledgeDocument, str, float]]:
        results: list[tuple[KnowledgeDocument, str, float]] = []
        tokens = [t.lower() for t in query.split() if len(t) > 2]
        
        for doc in self._documents.values():
            if category and doc.category != category:
                continue

            doc_text = f"{doc.title} {doc.summary} {' '.join(doc.tags)} {doc.content or ''}".lower()
            
            score = 0.0
            matched_snippet = doc.summary

            # Check exact query match
            if query.lower() in doc_text:
                score += 10.0

            # Check individual tokens
            for token in tokens:
                if token in doc_text:
                    score += 1.0

            if score > 0:
                # Find a snippet containing matches
                if doc.content:
                    idx = doc.content.lower().find(tokens[0] if tokens else query.lower())
                    if idx != -1:
                        start = max(0, idx - 100)
                        end = min(len(doc.content), idx + 200)
                        matched_snippet = ("..." if start > 0 else "") + doc.content[start:end].replace("\n", " ").strip() + "..."

                results.append((doc, matched_snippet, score))

        results.sort(key=lambda x: x[2], reverse=True)
        return results[:limit]
