# CLAUDE.md — Padrão Loft (Frontend + Backend)

Este arquivo consolida os volumes de padronização Loft — **Frontend** (`Frontend/`) e **Backend** (`Backend/`) — em regras diretas para desenvolvimento assistido por IA neste projeto. Em caso de dúvida ou conflito, consulte os documentos originais — este arquivo é um resumo operacional, não substitui o conteúdo integral.

## Documentos e hierarquia

```
Frontend/
  Volume I   — Loft Design System — Foundation & UI Guidelines   (como parecer)
  Volume II  — Loft Frontend Foundation — Guia Inicial           (como construir)
  Volume III — Loft Component Catalog                            (o que reutilizar)
  Volume IV  — Loft Frontend Specification (FSD)                  (o que construir)

Backend/
  Loft Backend Foundation                (Vol. I  — stack/arquitetura)
  Loft Backend Engineering System        (Vol. II — como escrever o código)
  Loft Backend Component Catalog         (Vol. III — o que reutilizar)
  Loft Backend API Specification         (Vol. IV — contrato de API)
  Loft Backend AI Specification          (Vol. V  — IA no backend / AI-BAS)
  Loft Backend Security Specification    (Vol. VI — segurança)
```

Ordem de leitura obrigatória antes de implementar:
- **Frontend**: Design System → Frontend Foundation → Component Catalog → FSD.
- **Backend**: Foundation → Engineering System → Component Catalog → API Specification → AI Specification → Security Specification.

A especificação funcional (FSD no frontend; contratos/domínio enviados para o backend) tem prioridade para requisitos de negócio específicos do produto; os demais volumes definem padrões técnicos, visuais e de reutilização — e nunca devem ser contrariados sem justificativa explícita.

---

# PARTE 1 — FRONTEND

## Princípio central

```
Copan ('@loft/react-loft' + '@loft/tokens-loft' + '@loft/react-icons') = Loft UI
Biblioteca de componentes mandatória — não uma referência visual a copiar.
```

Toda UI deve importar componentes reais de `@loft/react-loft` e tokens de `@loft/tokens-loft`. Nunca introduzir uma biblioteca de UI genérica (Ant Design, MUI, Chakra, Bootstrap, styled-components) sem justificativa arquitetural explícita — e mesmo assim, nunca em substituição ao Copan nos componentes que ele já cobre.

Os pacotes `@loft/*` são privados e exigem um `NPM_TOKEN` com acesso ao escopo `@loft` configurado no `.npmrc` do projeto (`//registry.npmjs.org/:_authToken=${NPM_TOKEN}`) — esperado para qualquer aplicação padrão Loft, já que são construídas e rodadas por times internos.

## Stack oficial

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js LTS |
| Core | React 19+, TypeScript (`strict: true`), Vite |
| UI | `@loft/react-loft` (Copan) + `@loft/react-icons` |
| Tokens | `@loft/tokens-loft` (color, spacing, typography, border) |
| Routing | TanStack Router (rotas tipadas) |
| Server State | TanStack Query |
| Client State | React state / Zustand (só quando necessário) |
| Forms | React Hook Form |
| Validation | Zod (derivar tipos com `z.infer`) |
| Testing | Vitest (unit) + React Testing Library (component) + Playwright (E2E) |
| Lint/Format | ESLint + Prettier |

**Não usar por padrão** (exige justificativa técnica explícita para exceção): Next.js, Prisma, NextAuth, Redux, Ant Design, `@ant-design/icons`, Material UI, Chakra UI, Bootstrap, styled-components, jQuery.

## Regras de arquitetura

- **Server state ≠ Client state**: dados de API sempre via TanStack Query; nunca armazenar server state em Zustand.
- **Nunca** chamar `fetch`/HTTP diretamente em componentes. Fluxo obrigatório: `Component → TanStack Query → Service → API Client → Backend`.
- Estrutura de pastas: `src/{app,components,features,routes,services,hooks,stores,schemas,types,utils,theme,assets}`.
- Organização por domínio dentro de `features/` para projetos grandes.
- Autenticação isolada em `src/auth/` (provider, client, permissions, guards).
- Autorização baseada em permissões semânticas (`can('users.delete')`), nunca `if (user.role === 'admin')`. Não assumir hierarquia implícita entre permissões (`users.read` não implica `users.update`).
- Simplicidade antes de abstração: componente simples → composição → abstração reutilizável.
- Nunca secrets no frontend. Toda variável pública usa prefixo `VITE_`. Autorização real é sempre validada no backend — frontend só faz UX control, nunca security control.
- Adicionar dependência nova só quando: necessidade real + stack existente não resolve + manutenção ativa + compatível com React/TS + custo justificável.

## Design System (Copan — `@loft/tokens-loft` + `@loft/react-loft`)

- **Cores**: sempre `color` de `@loft/tokens-loft` — nunca hex/rgb hardcoded. Ação principal via `<Button variant="primary">` (a cor de marca já é aplicada pelo componente). Decorativo: `color.decorative.orange.main`, `.green.main`, etc. Semântico (nunca para decoração): `color.feedback.positive/negative/warning/informative/neutral` (cada um com `.main`/`.light`).
- **Tipografia**: `<Typography textStyle="...">` — escala real: `hero`, `h1`–`h4`, `subtitle`, `paragraph-lg/md/sm` (+ `-bold`), `caption`, `overline`, `label-sm/md`, `inherit`. Tamanhos desktop/mobile já embutidos no token — nunca definir escala px própria.
- **Espaçamento**: dois namespaces de `spacing` em `@loft/tokens-loft` — `inner.*` (base 4px, uso: padding/gap interno) e `layout.*` (base 8px, uso: espaço entre blocos). Em props de componente, use as chaves token (`"base02"`, `"innerBase04"`, `"layoutBase03"`, etc.), nunca px/rem literais.
- **Ícones**: apenas `@loft/react-icons` (ex.: `TrashIcon`, `SearchIcon`, `PencilIcon`), `color` sempre de `color.icon.*`, nunca hex.
- Prioridade de estilo: **token Copan (`@loft/tokens-loft`) → prop de componente Copan → CSS local (somente quando o Copan não cobre)**.
- Componentes customizados só quando o Copan não resolve e há necessidade recorrente de domínio — documentar Purpose/Props/States/Variants/Interactions/Accessibility/Responsive, e compor a partir de primitivas Copan (`Flex`, `Grid`/`GridItem`, `Typography`, etc.), nunca HTML cru estilizado à mão para o que o Copan já cobre.

## Loft Component Catalog (frontend)

Regra de ouro antes de criar qualquer componente:

```
1. Existe no Copan (@loft/react-loft)? → use-o
2. Existe no Loft Component Catalog?   → use-o (composto a partir de primitivas Copan)
3. Pode ser composto com existentes?   → componha
4. É necessidade recorrente (2+ contextos, comportamento estável)? → crie componente Loft
5. Caso contrário                      → mantenha local ao produto/feature
```

- Nunca duplicar componentes; nunca criar wrapper que só encapsula um componente Copan sem behavior/semântica real.
- Componentes não fazem fetching implícito — dados/loading vêm de props (`<DataTable data={data} loading={isLoading} />`, nunca `endpoint="..."`).
- Autorização via prop/permissão semântica (`<PermissionGate permission="users.update">`), nunca role hardcoded.
- Variants semânticas (`size: small | default | large`), nunca nomeadas por valor visual.

Componentes Tier 1 (Foundation): `PageHeader`, `PageContainer`, `LoadingState`, `EmptyState`, `ErrorState`, `FormSection`, `FormActions`, `DataTable`, `FilterBar`, `StatusTag`.

### App Switcher (menu de 9 pontos / "waffle")

Padrão de navegação entre produtos Loft, acionado pelo ícone de 9 pontos no header, ao lado do breadcrumb. Detalhes visuais que fazem parte do contrato deste componente (não são incidentais):

- O painel (`Produtos e Soluções`) é **`position: fixed`** ancorado no canto esquerdo da viewport (`left: 0`, abaixo do header) — nunca posicionado relativo ao próprio botão trigger. Isso garante que ele sempre cubra a sidebar do produto por completo, independente de onde o ícone fique no header (ex: depois de um breadcrumb longo).
- Grid principal (produtos "grandes": Fiança Aluguel, Sites, Adm Imóveis, CRM, Financiamento Imobiliário, Portal Loft): título em **verde de marca** `#0B6B4F` (mesmo tom usado no gradiente do hero do produto atual) — não usar `text.primary`. Produto atual recebe fundo verde-claro (`#EAF9EF`/borda `#B7E9C6`) + ícone de check.
- Grid secundário (links utilitários: Qualifica Leads, Clube Loft, CredSign, Assistente Loft, Selo de tecnologia Loft): cada item é um **pill com borda fina** (`border: 1px solid` neutral-100), título em `text.primary` (não verde), com marcador à esquerda em formato de **"chave"**: círculo oco laranja (`#FF774A`, ~9px, borda 1.5px) + traço sólido saindo do lado direito (~7×2px) — não usar um círculo cheio nem a cor `info`.
- Cards do grid principal são propositalmente **retangulares/achatados** (proporção largura:altura ≈ 2.5:1), não quadrados — padding vertical bem menor que o horizontal.

### Modais, Overlays e Contenção de Rolagem

- **Centralização Obrigatória (`centered={true}`)**: Todo `Modal` no padrão Loft deve ser explicitamente centralizado na viewport.
- **Contenção Estrita de Rolagem Interna**: O scroll deve ocorrer exclusivamente dentro do corpo do modal (`styles={{ body: { maxHeight: 'calc(85vh - 140px)', overflowY: 'auto' } }}`), eliminando qualquer vazamento de barra de rolagem para a janela principal (`window/body`).
- **Larguras Padronizadas**: `520px` (confirmação/alerta), `800px` (formulários médios, `EntityVersionModal`), `900px` (SDD Viewers, editores de markdown/código).

### Padrão de Telas de Edição Ricas (Studio / Workshop)

Para interfaces de composição e edição de recursos estruturais (ex: `/workshop`, blueprints, catálogos):
- **Header Contextual**: Breadcrumb, Status Tag e botões de ação fixos no topo (Salvar Rascunho, Validar, Publicar, Cancelar).
- **Card de Pré-carregamento Inteligente (Pre-fill)**: Duplo seletor (Template Canônico Loft vs Blueprint Existente) para preenchimento rápido de arquiteturas, módulos, componentes e Golden Rules.
- **Obrigatoriedade e Validação Lateral**: Nome e Descrição com validação obrigatória visual; painel lateral de conformidade em tempo real (`POST /blueprints/validate-config`) com bloqueio de publicação preventiva se houver violação de Golden Rules críticas.

### 20 Padrões Canônicos de Telas Enterprise para Blueprints

1. **CRM & Customer 360** (`/crm/customers`): Visão 360°, timeline de relacionamento, scoring e drawer de detalhes.
2. **Chatbot Cognitivo com IA & RAG** (`/ai/assistant`): Interface de chat stream, histórico e busca semântica em base de conhecimento.
3. **Portal de Homologação de Fornecedores** (`/suppliers/onboarding`): Wizard multi-step, CNDs e SLAs de prestadores.
4. **Gestão de Compras & Procurement PO** (`/procurement/orders`): Cotações comparativas e alçadas de aprovação multinível.
5. **Onboarding Digital & KYC Enterprise** (`/kyc/verification`): Validação biométrica facial, OCR e motor antifraude.
6. **Faturamento & Cobrança Recorrente SaaS** (`/billing/subscriptions`): Gestão de planos, régua de faturamento e conciliação bancária.
7. **Motor de Análise de Risco de Crédito & Fiança** (`/credit/risk-engine`): Score comportamental e cálculo de limite de garantia.
8. **Copilot de Análise Contratual Jurídica** (`/legal/contracts-copilot`): Diff viewer inteligente e apontador de cláusulas de risco.
9. **Gestão de Portfólio & Inventário de Imóveis** (`/properties/inventory`): Catálogo de unidades, fotos e sincronização com portais.
10. **Vistorias & Manutenção Predial** (`/inspections/maintenance`): Laudos fotográficos geolocalizados e despachos de reparo.
11. **Compliance, LGPD & Trilha de Auditoria** (`/compliance/audit-trail`): Logs imutáveis, portal DPO e consentimento regulatório.
12. **Portal de Admissão & Onboarding RH** (`/hr/onboarding`): Admissão digital de colaboradores e trilha de aculturamento.
13. **Gestão de Ativos Corporativos & ITSM** (`/it/assets`): Controle patrimonial de TI e licenças de software em nuvem.
14. **Portal do Desenvolvedor & API Marketplace** (`/dev/api-portal`): Documentação interativa OpenAPI v3, chaves de API e webhooks.
15. **Portal Loft Fiança Aluguel** (`/partner/guarantee`): Menu 9 pontos waffle, hero card verde Loft e contratação de fiança.
16. **Loft Engineering & Backoffice** (`/admin/backoffice`): Administração de catálogos técnicos e governança RBAC.
17. **Fintech & Checkout Imobiliário** (`/fintech/checkout`): Pagamentos Pix/Boleto/Cartão e split financeiro instantâneo.
18. **Analytics & Performance BI Dashboard** (`/analytics/bi`): KPIs em tempo real, volumetria transacional e gráficos executivos.
19. **CRM de Renegociação & Mesa de Acordos** (`/crm/renegotiation`): Mesa amigável de cobrança e acordos de quitação.
20. **AI Ops Gateway & Multi-Agent Hub** (`/ai/gateway`): Roteamento multi-LLM, orquestrador de agentes e guardrails.

## Estados obrigatórios

```
Loading            → Skeleton (estrutural) / Spin (pontual)
Success
Empty (No Data)    → o que aconteceu + o que fazer + ação (ex: "Criar usuário")
No Results         → filtro/busca sem retorno (ex: "Tente alterar os filtros")
Error              → o que aconteceu + como corrigir + ação de retry
Permission Denied  → refletir autorização real, nunca esconder só a ação
Not Found          → recurso inexistente/removido
Disabled
```

Formulários: label + input + helper/error; estados Initial/Editing/Submitting/Success/Error/Disabled; erro nunca só por cor; impedir submit duplicado; avisar sobre alterações não salvas.

Ações destrutivas: confirmação explícita centralizada, botão `danger`, texto com a consequência.

Modal vs Drawer vs Page: Modal para confirmação/edição curta/visualização SDD (sempre centralizado e com contenção de rolagem); Drawer para detalhes/edição contextual; Page para formulários longos/workshops de criação de blueprints.

## Frontend Specification / FSD

Ao receber a especificação (FSD) de uma aplicação real:

- **Nunca inventar** silenciosamente páginas, rotas, permissões, campos, entidades ou regras de negócio ausentes. Informação ausente = `[TBD]` ou perguntar.
- Toda página responde: o que existe / onde existe / quem pode acessar / como chega / o que pode fazer / o que acontece depois / o que acontece se der errado / como funciona no mobile.
- Rotas: path semântico (`/users/:id`), permissão, autenticação, query params compartilháveis (paginação/filtro/busca na URL).
- Redirects após mutação explícitos (`afterCreate`, `afterUpdate`, `afterDelete`).
- Erros de API nunca chegam brutos à UI — sempre mapeados para UX (nunca "HTTP 500" cru).
- Datas/números em formato brasileiro por padrão: `DD/MM/YYYY`, `DD/MM/YYYY HH:mm`, `R$ 1.234,56`, salvo especificação de i18n.

## Acessibilidade e Testes (frontend)

Obrigatório: contraste WCAG AA, navegação/foco por teclado, labels, mensagens de erro associadas ao campo, `aria-label` em ícones/botões sem texto, `prefers-reduced-motion`, áreas clicáveis adequadas.

- **Unit (Vitest)**: regras de negócio, schemas, hooks, utils.
- **Component (RTL)**: comportamento do usuário, não detalhes internos.
- **E2E (Playwright)**: jornadas críticas.
- Sem meta arbitrária de cobertura.

## Checklist frontend

```
Arquitetura   → Foundation/Design System respeitados, Catalog reutilizado, Copan ('@loft/react-loft'/'@loft/tokens-loft') usado de fato
Navegação     → rotas/breadcrumbs corretos, redirects definidos, deep links funcionando
UI            → PageHeader, layout consistente, tokens aplicados
Estado        → loading, success, empty, no results, error, permission denied, not found
Formulários   → labels, validação, error/loading/success state, sem submit duplicado
Tabelas       → sorting, filtering, pagination, empty, loading, actions
Dados         → API isolada em services, cache via TanStack Query, validação Zod
Segurança     → sem secrets, permission checks no front, backend autoritativo
Testes        → unit/component quando necessário, E2E nos fluxos críticos
Acessibilidade→ teclado, foco, contraste, labels, ARIA
Responsivo    → desktop, tablet, mobile
```

---

# PARTE 2 — BACKEND

## Stack oficial

| Camada | Tecnologia |
|---|---|
| Linguagem | Python 3.13+ |
| Framework | FastAPI |
| Servidor ASGI | Uvicorn |
| Validação/Config | Pydantic v2 + `pydantic-settings` |
| Banco de dados | PostgreSQL |
| ORM | SQLAlchemy 2.x (async — `AsyncEngine`/`AsyncSession`) |
| Driver DB | asyncpg |
| Migrations | Alembic |
| Autenticação | OAuth2/JWT (`PyJWT`) + `pwdlib` (Argon2id) |
| Cache / Filas / Locks | Redis |
| Background jobs | `BackgroundTasks` (simples) → Redis + Celery/Arq (distribuído) |
| HTTP client externo | HTTPX (`AsyncClient`) |
| Observabilidade | OpenTelemetry (traces/métricas/logs correlacionados) |
| Docs de API | OpenAPI / Swagger UI / ReDoc |
| Testes | pytest + pytest-asyncio + httpx |
| Lint/Type/Format | Ruff + Pyright ou mypy + pre-commit |
| Gerenciador de deps | `uv` + lockfile obrigatório |
| Segurança estática (CI) | Bandit, pip-audit, Semgrep, secret scanning |
| Container | Docker (slim, non-root, multi-stage) |
| IA — providers | `openai`, `anthropic` (sempre via gateway abstrato, nunca direto) |
| IA — structured output | Instructor (baseado em Pydantic) |
| IA — RAG/vetores | PostgreSQL + `pgvector` |

Arquitetura: **API First + AI First + Security by Design**. Stateless por padrão (estado sempre em PostgreSQL/Redis/Object Storage, nunca em memória local da instância).

## Anti-patterns (nunca usar por padrão)

```
God Router / God Service / God Repository / GenericRepository everywhere
Global database session / global mutable state
Business logic dentro de Pydantic schemas ou dentro de routers
Raw SQL concatenation com input do usuário
Secrets em código-fonte / Git / Docker image / logs
Unbounded queries / unbounded AI calls / unbounded file uploads
Infinite retries / infinite timeouts
Wildcard CORS em produção (allow_origins=["*"] com credenciais)
JWT com informação sensível no payload
AI tools sem authorization
Chamadas diretas de LLM/SDK de provider a partir de controllers
```

Toda dependência nova passa pela **Library Selection Rule**: qual problema resolve / por que stdlib ou FastAPI/Pydantic/SQLAlchemy não resolvem / custo operacional / maturidade / licença / risco de vendor lock-in. Preferir poucas dependências de alta qualidade.

## Golden Rules de arquitetura

```
1. Router não contém regra de negócio nem chamada de IA direta.
2. SQLAlchemy Models não são API Schemas: Model → Service → Pydantic Schema → API Response.
3. Toda entrada externa é não confiável (body, query, headers, uploads, webhooks, APIs externas, e output de LLM).
4. Toda operação crítica deve ser observável (logs, métricas, traces, audit events).
5. Segurança não é responsabilidade do frontend — nunca confiar em UI escondida, botão desabilitado ou validação client-side.
```

Fluxo de camadas:

```
Router (HTTP, validação, status codes — nunca SQL direto/regra complexa/SDK externo)
  → Application Service (orquestra o use case)
  → Domain (regras de negócio, policies — nunca depende de FastAPI)
  → Repository (persistência — nunca conhece HTTP/JWT/e-mail/LLM)
  → Infrastructure (DB, Redis, HTTP externo, storage, AI providers)
```

IA sempre isolada em camada própria: `API → Application Service → AI Service → AI Gateway → Provider Adapter` (nunca controller → LLM/SDK direto). Tools de IA respeitam as mesmas políticas de autorização da API; RAG é *permission-aware* (`search(query, tenant_id, user_id, permissions)`, nunca `search(query)` puro).

## Estrutura de pastas

```
app/
├── main.py
├── core/            # config, security, logging, observability, exceptions
├── api/v1/          # routers
├── models/          # SQLAlchemy
├── schemas/         # Pydantic — Create/Update/Response/List/Filter SEPARADOS
├── repositories/
├── services/
├── domain/          # entities/, value_objects/, policies/
├── integrations/    # um adapter por serviço externo (slack/, payments/, ...)
├── ai/              # gateway/, providers/, prompts/, tools/, agents/, embeddings/, rag/
├── db/              # session.py, base.py, migrations/
└── tests/           # unit/, integration/, api/, security/, ai/
```

`CreateSchema` nunca contém campos controlados pelo servidor (`id`, `created_at`); `ResponseSchema` nunca expõe `password_hash`/tokens internos. Valores monetários sempre `Decimal` (nunca `float`).

## Loft Backend Component Catalog

Regra de ouro (idêntica em espírito ao frontend):

```
1. Existe componente padrão para isso no catálogo? → reutilizar
2. Existe implementação equivalente no codebase?    → reutilizar/estender
3. Só então                                          → avaliar criação de componente novo
```

Categorias: Core, Authentication, Authorization, Users & Identity, Database, API, Pagination, Errors, Audit, Observability, Caching, Storage, Webhooks, Jobs, Notifications, External Integrations, AI, RAG, Events, Feature Flags, Configuration, Security, Testing.

Componentes de referência mais usados: `AuthService`, `TokenService`, `PasswordService`, `PermissionService`, `PolicyService`, `TenantAccessService`, `Repository`/`UnitOfWork`, `Pagination`, `ApplicationError`/`ErrorMapper`, `AuditService`, `StructuredLogger`, `CacheService`, `StorageService`, `WebhookProcessor`, `JobService`, `NotificationService`, `ExternalClient`/`CircuitBreaker`, `AIService`/`LLMGateway`/`AIProvider`, `PromptService`, `GuardrailService`, `ToolRegistry`/`ToolExecutor`, `AgentService`, `RateLimitService`, `EncryptionService`, `SecretProvider`.

**Platform components** (`AuthService`, `AuditService`, `StorageService`, `AIService`) são reutilizáveis entre projetos; **Domain components** (ex. `PropertyService`, `LeadService`) pertencem ao produto — não forçar reuso cross-project. Nunca dependência circular entre componentes; providers de IA nunca acessados direto pelo domínio (sempre via `LLMGateway`).

## API Specification

- **REST orientado a recursos**, versionado (`/api/v1/...`); breaking change → nova versão. `operationId` estável (`createUser`, `getUser`...).
- Nomenclatura: substantivos/plural (`/payroll-runs`, não `/getPayrollRuns`); ações não-CRUD como subresource (`POST /documents/{id}/publish`).
- `snake_case` nos campos; IDs em `UUID`/`ULID` consistente; timestamps ISO 8601 UTC.
- **Sem envelope artificial** na resposta simples; coleções usam `{"data": [...], "meta": {...}}`.
- Paginação: `?page=1&page_size=20` (máximo 100); cursor pagination para grandes volumes. Sorting/filtering sempre com whitelist explícita — nunca input arbitrário direto em SQL.
- **Erro padrão**:
  ```json
  { "error": { "code": "USER_NOT_FOUND", "message": "User not found", "details": {}, "request_id": "req_123" } }
  ```
  `message` nunca inclui stack trace, SQL, secret ou path interno.
- Status codes: 200/201/202/204/400/401/403/404/409/422/429/500/503. **401 ≠ 403** (nunca confundir). Considerar `404` em vez de `403` quando `403` permitiria resource enumeration.
- Toda rota declara mecanismo de autenticação (`Bearer JWT`/`API Key`/`OAuth2`) e permissão (`resource:action`); endpoints públicos marcados explicitamente.
- `tenant_id` **nunca** confiável vindo do cliente — derivar do contexto autenticado.
- `Idempotency-Key` obrigatório em operações críticas (payments, imports, webhooks, AI jobs); mesma chave + payload diferente → `409 Conflict`.
- Rate limiting por categoria (`Authentication: 5/min`, `Public API: 60/min`, `Authenticated: 300/min`, `AI: 20/min` — valores de referência, ajustar ao produto).
- OpenAPI é o **contrato oficial** — agentes de IA não devem inventar status codes, permissões, campos, erros ou paginação que a API Specification já define.

## Security Specification

Princípios: Secure by Default, Least Privilege, Zero Trust, Defense in Depth, Fail Secure, Default Deny, Auditável, Tenant Isolated. **"Security is not a feature. Security is an architectural property."**

**Security Golden Rules:**
```
1.  Authentication nunca substitui authorization.
2.  Default é deny.
3.  Nunca confiar em tenant_id enviado pelo cliente.
4.  Toda operação sobre recurso verifica autorização sobre o objeto específico (BOLA/IDOR).
5.  Nunca armazenar secrets em plaintext.
6.  Nunca criar criptografia própria — usar bibliotecas maduras/auditadas.
7.  Nunca confiar no LLM para autorização.
8.  Nunca expor stack traces em produção.
9.  Sempre validar inputs externos.
10. Sempre limitar recursos consumidos (queries, uploads, tokens de IA, concorrência).
11. Sempre auditar operações privilegiadas.
12. Sempre proteger contra BOLA/BFLA.
13. Sempre testar isolamento entre tenants.
14. Sempre usar bibliotecas de segurança maduras (nunca hashing/JWT/crypto manual).
15. Toda exceção de segurança deve possuir owner e prazo de expiração.
```

- **Senhas**: Argon2id, nunca plaintext; reset com token single-use/short-lived; MFA (TOTP/WebAuthn/Passkeys) quando necessário.
- **JWT**: validar `signature`, `issuer`, `audience`, `expiration`; allowlist explícita de algoritmos; claims mínimos.
- **API Keys**: hashed ao armazenar, com owner/scopes/expiration/revocation.
- **Autorização**: RBAC + ABAC, formato `resource:action`, verificação por objeto (nunca só permissão genérica de recurso).
- **Vulnerabilidades comuns** (OWASP API Top 10): SQL Injection (nunca concatenar; usar ORM/parameterized queries), Mass Assignment (allowlist de campos editáveis), SSRF (bloquear localhost/redes privadas/metadata endpoints), BOLA/BFLA, upload malicioso (validar MIME/extension/size/content, nunca confiar no filename).
- **Nunca logar**: password, tokens, API keys, secrets, dados de cartão, PII sensível.
- Webhooks: validar signature/timestamp/replay antes de processar; `validate → persist → acknowledge → process async`.

## AI Specification (AI-BAS)

Princípio fundamental: **"Nenhuma regra de negócio deve depender diretamente de um provider de IA."**

```
Application → AIService → LLMGateway → Provider Adapter → OpenAI / Anthropic / Google / Local Model
```

**AI Architecture Golden Rules:**
```
1.  Nunca acoplar domínio diretamente ao provider de IA.
2.  Nunca confiar no LLM para autorização.
3.  Nunca usar LLM para regra determinística que pode ser resolvida deterministicamente (validação, cálculo financeiro, transição de estado).
4.  Sempre validar structured output (Pydantic/Instructor) antes de entrar no domínio.
5.  Sempre controlar custo (token/cost tracking).
6.  Sempre controlar timeout.
7.  Sempre considerar prompt injection — conteúdo externo/RAG é DATA, nunca instrução do sistema.
8.  Sempre respeitar tenant isolation (RAG nunca retorna documento de outro tenant).
9.  Agents devem possuir permissões explícitas (nunca herdam permissão implícita do usuário).
10. Tools devem possuir schema de input/output, permissão e risk level (`READ/LOW_RISK_WRITE/HIGH_RISK_WRITE/CRITICAL`).
11. Operações críticas exigem validação determinística, não só validação por LLM.
12. AI output não deve ser automaticamente considerado verdade — validar contra schema/business rules/authorization antes de mutar dados.
13. Prompts devem possuir versionamento (ex. `document.summary:v1`).
14. Mudanças de modelo/provider devem poder ser avaliadas (evaluation dataset, prompt regression).
15. Toda IA relevante deve ser observável (logs, tracing, audit).
```

- Model aliases em vez de nome de modelo hardcoded (`default_reasoning`, `fast_generation`, `embedding_default`).
- Agents sempre com limites explícitos: `max_iterations`, `max_tool_calls`, `max_tokens`, `timeout`, `allowed_tools`, `budget` — nunca loop ilimitado.
- Instruction Hierarchy: `System Policy → Application Policy → Tool Policy → User Instruction → Retrieved Content` (conteúdo recuperado nunca tem autoridade sobre o sistema).
- Fallback silencioso proibido em funcionalidades de alto risco; retry só para erros transitórios (timeout/rate limit/503).
- Credenciais de provider nunca vão para o frontend nem para o código-fonte.

Princípio final:
> `LLM ≠ Business Logic`, `LLM ≠ Authorization`, `LLM ≠ Source of Truth` — `LLM = Probabilistic Intelligence Layer`. A aplicação continua responsável por Security/Authorization/Business Rules/Data Integrity/Audit/Governance; a camada de IA é responsável por Reasoning/Generation/Extraction/Classification/Retrieval/Agentic Workflows.

## Engenharia (convenções de código e testes)

- **Naming**: arquivos `snake_case.py`, classes `PascalCase`, funções/variáveis `snake_case`, constantes `UPPER_SNAKE_CASE`; type hints obrigatórios; `Any` evitado; `str | None` em vez de `Optional[str]`.
- **Erros**: hierarquia `ApplicationError` → subclasses (`NotFoundError`, `ConflictError`, `AuthorizationError`, `ValidationError`, `ExternalServiceError`, `AIServiceError`) → `ErrorMapper` → `ErrorResponse`. Nunca `except Exception: pass`.
- **Logging estruturado (JSON)**: `timestamp, level, service, request_id, trace_id, user_id, tenant_id, route, status_code, duration_ms`. Nunca logar secrets/PII sensível. **Audit ≠ Logging** (audit = governança/rastreabilidade, com `actor_id, resource_type, resource_id, action`).
- **Async**: todo I/O é async (DB, Redis, HTTP, storage, AI); CPU-bound pesado vai para worker/job queue.
- **Testes**: pirâmide com maioria em unit (domain/application), menos em integration/API/E2E. Testes de segurança obrigatórios por endpoint protegido (no token, invalid token, wrong permission, wrong tenant, resource ownership). Testes de IA: schema validation, provider failures, timeouts, outputs malformados, tool authorization.
- **CI Quality Gates** (todo PR): `ruff / typecheck / unit tests / integration tests / security scan / dependency scan / migration validation` — nunca merge se lint, typecheck, testes ou security scan falharem.
- **Migrations**: mudanças perigosas (drop/rename column, non-null sem default) via Expand/Contract, nunca direto em produção.
- **Jobs/eventos**: idempotentes, observáveis, retryable; eventos representam fatos (`UserCreated`, não `CreateUser`); Outbox Pattern para eventos críticos.

## Checklist backend (Definition of Done)

```
API           → endpoint, OpenAPI atualizado, schemas request/response, status code correto, erros padronizados
Segurança     → authentication, authorization, tenant isolation, rate limit, secrets protegidos, audit
Dados         → model SQLAlchemy, migration, constraints, índices avaliados, transaction strategy
Testes        → unit, integration, API, security, AI quando aplicável
Observabilidade→ logs estruturados, metrics, tracing, request_id
IA (quando aplicável) → provider abstraction (nunca SDK direto), structured output, prompt versionado,
                        token/cost tracking, guardrails, authorization, evaluation dataset
```

## Regras específicas para geração assistida por IA (backend)

> Antes de implementar, leia Foundation → Engineering System → Component Catalog → API Specification → AI Specification → Security Specification, nessa ordem.
> Não invente rotas, status codes, permissões, campos, erros ou paginação que a API Specification já define — marque `[TBD]` ou pergunte.
> Antes de criar Service/Repository/Provider/Client/Middleware novo, verifique o Component Catalog e o codebase existente.
> Router nunca contém regra de negócio, SQL direto ou chamada de IA/SDK externo direta.
> Toda entrada externa (body, query, headers, uploads, webhooks, e output de LLM) é não confiável e deve ser validada.
> Autorização real sempre no backend; nunca delegada ao LLM, ao frontend ou a UI escondida.
> `tenant_id` nunca confiável vindo do cliente — derivar do contexto autenticado.
> Nunca secrets/credenciais em código-fonte, logs, respostas de erro ou payload de JWT.
> Toda funcionalidade de IA usa `AIService → LLMGateway → Provider Adapter` — nunca SDK de provider importado direto no domínio.
> Agents e tools sempre com permissão explícita, schema de input/output e limites de custo/iterações/timeout.
> Structured output de IA sempre validado via Pydantic antes de entrar no domínio ou disparar uma mutação.
> Não refatorar áreas grandes sem `goal, scope, risk, tests, rollback strategy` definidos; não criar abstração antes de existir um segundo caso real.
> Rode os quality gates (lint, typecheck, testes, security scan) antes de reportar uma implementação como concluída.

---

# Checklist geral (Frontend + Backend)

```
Contrato      → frontend consome exatamente o que a API Specification define; nada inventado de ambos os lados
Segurança     → autorização real no backend; frontend/UI nunca é mecanismo de autorização
Estados       → loading/empty/no-results/error/permission-denied/not-found tratados nas duas pontas
Reuso         → Copan/Loft Catalog (frontend) e Component Catalog (backend) verificados antes de criar algo novo
IA            → nunca dependência direta de provider; nunca fonte de verdade para autorização/regra de negócio/cálculo crítico
Observabilidade→ request_id propagado ponta a ponta, erros de API nunca expostos brutos na UI
Testes        → unit/component/E2E no frontend; unit/integration/API/security no backend
```
