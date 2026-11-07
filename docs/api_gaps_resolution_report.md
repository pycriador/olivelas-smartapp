# Relatório de Resolução das Lacunas de API e Catálogo — Olivelas App Builder Engine

**Data de Atualização:** 19 de Outubro de 2026  
**Serviço Alvo:** Olivelas App Builder Engine (`http://127.0.0.1:8000`)  
**Status Global:** ✅ 18 / 18 Lacunas Resolvidas e Verificadas Automatizadamente

---

## 1. Visão Geral

Este documento registra a resolução técnica de todas as 18 lacunas identificadas durante a construção de aplicações reais utilizando as APIs do **Olivelas App Builder Engine**. Cada item detalha o comportamento anterior, a solução arquitetural implementada, os contratos de API resultantes e os arquivos atualizados.

---

## 2. Matriz Completa das 18 Lacunas e Soluções

### Gap 1 — Autenticação Obrigatória (`401 AUTHENTICATION_FAILED`) e Remoção de Headers Forjáveis
- **Problema Anterior:** Rotas protegidas (`/api/v1/projects/{id}`, `/api/v1/audit/logs`, `/api/v1/iam/auth/me`) respondiam `200 OK` sem header `Authorization` ou com `Bearer` vazio/inválido, e o OpenAPI expunha headers `X-User-Role` e `X-User-Email` passíveis de falsificação.
- **Solução Implementada:**
  - Todas as rotas protegidas (`/projects`, `/blueprints`, `/audit/logs`, `/iam/auth/me`, `/components`, `/modules`, `/templates`, `/rules`, `/specifications`, `/architectures`, `/knowledge`) utilizam a dependência estrita `get_current_user_claims`.
  - Requisições sem header `Authorization`, com `Bearer` vazio ou com JWT malformado/expirado/revogado retornam imediatamente **HTTP `401 Unauthorized`** com `error.code = "AUTHENTICATION_FAILED"`.
  - Os headers `X-User-Role` e `X-User-Email` foram completamente eliminados dos endpoints e do schema `/openapi.json`.

### Gap 2 — Respeito aos Requisitos de Persistência (PostgreSQL / Olivelas Opsbase) no Compose
- **Problema Anterior:** `POST /api/v1/ai/blueprints/compose` selecionava `arch_static_landing_page` (`database: "None (Stateless / In-Memory)"`) mesmo quando os requisitos exigiam login seguro, cadastro de usuários e PostgreSQL via Opsbase.
- **Solução Implementada:**
  - O motor de composição (`AICompositionService`) analisa requisitos de persistência (`postgresql`, `postgres`, `opsbase`, `banco de dados`, `crud`, `login`, `usuarios`, `autenticacao`, `jwt`, `rbac`) e seleciona deterministicamente `arch_loft_postgres_opsbase_fullstack` (`PostgreSQL 16 via Olivelas Opsbase (SQLAlchemy 2.0 + Alembic)`) ou `arch_loft_standard_fullstack`.
  - Arquiteturas stateless (`arch_static_landing_page`) só são escolhidas quando os requisitos pedem explicitamente uma página institucional estática sem banco de dados e sem autenticação.

### Gap 3 — Alinhamento entre `compose` e `validate-config` (Zero `MODULE_NOT_FOUND`)
- **Problema Anterior:** `identified_modules` no blueprint composto retornava nomes de bibliotecas Python/NPM (`react`, `antd`, `fastapi`, `pyjwt`), fazendo `POST /api/v1/blueprints/validate-config` falhar com 9× `MODULE_NOT_FOUND`.
- **Solução Implementada:**
  - `identified_modules` contém exclusivamente IDs canônicos de módulos do catálogo (`mod_*`), enquanto pacotes pip/npm ficam separados no campo `dependencies`.
  - O blueprint composto já nasce com `status: "ready"`.
  - `POST /api/v1/blueprints/validate-config` aceita tanto `module_ids` / `component_ids` / `template_ids` quanto `modules` / `components` / `templates` / `identified_modules` e herda automaticamente as regras e especificações da arquitetura selecionada, aprovando com `valid: true` e `0` erros.

### Gap 4 — Filtragem de Módulos e Templates por Domínio com Justificativa
- **Problema Anterior:** O compose retornava todos os 21 templates e módulos sem relação com o pedido (pagamentos, fornecedores, KYC, chatbot).
- **Solução Implementada:**
  - `AICompositionService` filtra os módulos, componentes e templates estritamente pelos domínios detectados nos requisitos do usuário e inclui a justificativa individual de cada item em `selection_rationale`.

### Gap 5 — Transparência de Falha do Provedor de IA (`ai_status` e `warnings[]`)
- **Problema Anterior:** Quando a chave Gemini falhava (HTTP 400/403), a resposta ainda dizia apenas "composto com sucesso" sem sinalizar a indisponibilidade da LLM em campos estruturados.
- **Solução Implementada:**
  - A resposta de `POST /api/v1/ai/blueprints/compose` expõe os campos `ai_status` (`"ok"` quando a inferência LLM sucede, `"unavailable"` quando há fallback determinístico por falha de chave/rede) e `warnings: list[str]`.

### Gap 6 — Contratos Reais e Implementações de Referência nos Componentes do Catálogo
- **Problema Anterior:** `cmp_be_auth_service`, `cmp_be_password_service` e `cmp_be_token_service` possuíam apenas stubs `async def execute(self, payload: dict) -> dict: ...`, e componentes de frontend não traziam código nem contrato de props.
- **Solução Implementada:**
  - Todos os componentes backend (`cmp_be_auth_service`, `cmp_be_password_service`, `cmp_be_token_service`, `cmp_be_permission_service`, `cmp_be_audit_service`, etc.) agora possuem contratos completos em `props_contract` (com `service_class`, lista detalhada de `methods`, assinaturas de `input`/`output` e `error_codes`), `interface_spec` tipado e implementação Python completa em `preview_code`.
  - Todos os componentes frontend (`cmp_fe_*`) possuem `props_contract` tipado e código React/TypeScript real em `preview_code`.

### Gap 7 — Arquitetura Canônica React + FastAPI + PostgreSQL Alinhada com a Spec Backend
- **Problema Anterior:** `arch_loft_standard_fullstack` declarava SQLite enquanto `spec_be_loft_backend_foundation` exigia PostgreSQL + SQLAlchemy + Alembic.
- **Solução Implementada:**
  - `arch_loft_standard_fullstack` foi atualizado para `PostgreSQL 16 (SQLAlchemy 2.0 + Alembic / Olivelas Opsbase)` e foi adicionada a arquitetura dedicada `arch_loft_postgres_opsbase_fullstack`, garantindo consistência total com `spec_be_loft_backend_foundation`.

### Gap 8 — Golden Rules Acionáveis (`json_schema`, `error_codes_table` e `examples`)
- **Problema Anterior:** `rul_loft_be_api_envelope` e `rul_loft_be_error_codes` tinham `examples: null` e não traziam JSON Schema nem tabela estruturada de códigos de erro.
- **Solução Implementada:**
  - Ambas as regras agora retornam `json_schema` (Draft 2020-12), `error_codes_table` completa (`AUTHENTICATION_FAILED`, `PERMISSION_DENIED`, `NOT_FOUND`, `CONFLICT`, `VALIDATION_ERROR`, `ACCOUNT_LOCKED`, `RATE_LIMITED`, `INTERNAL_ERROR`, `AI_SERVICE_ERROR`) e `examples` populado com payloads reais.

### Gap 9 — Valores Concretos na Especificação de Segurança (`spec_be_loft_backend_security_specification`)
- **Problema Anterior:** Faltavam valores explícitos de TTL de tokens, algoritmo JWT, política de senha, rate limit, lockout e armazenamento de token no browser.
- **Solução Implementada:**
  - A especificação `spec_be_loft_backend_security_specification` inclui a seção canônica **Security Configuration** com todos os valores explícitos adotados pela Olivelas.

### Gap 10 — Contrato IAM para Aplicações (`/api/v1/iam/contract`), Auto-Cadastro (`/signup`) e Membros de Grupos
- **Problema Anterior:** Não havia matriz publicada de papel → permissões para aplicações clientes, nem endpoint público de auto-cadastro ou endpoints de membros de grupos.
- **Solução Implementada:**
  - `GET /api/v1/iam/contract`: Publica `role_permissions_matrix` (*Global Admin*, *Admin*, *Developer*, *Viewer*), `security_configuration`, `self_registration` e `group_membership_endpoints`.
  - `POST /api/v1/iam/auth/signup` (`201 Created`): Auto-cadastro público com validação de política de senha, atribuindo papel `Viewer` e grupo `grp_viewers`.
  - `GET /api/v1/iam/groups/{group_id}/members`, `POST /api/v1/iam/groups/{group_id}/members` (`201 Created`) e `DELETE /api/v1/iam/groups/{group_id}/members/{user_id}`: Gestão completa de membros de grupos.

### Gap 11 — `architecture_id` Padrão Válido na Criação de Projetos
- **Problema Anterior:** `POST /api/v1/projects` usava `arch-modular-monolith` como default, que não existia no catálogo.
- **Solução Implementada:**
  - O default de `architecture_id` em `POST /api/v1/projects` agora é `arch_loft_standard_fullstack` (e `arch-modular-monolith` também é suportado no catálogo).

### Gap 12 — Persistência de `blueprint_id` em Projetos e Listagem de Versões (`GET /projects/{id}/versions`)
- **Problema Anterior:** `POST /api/v1/projects` ignorava `blueprint_id` e não existia `GET /api/v1/projects/{id}/versions`.
- **Solução Implementada:**
  - `POST /api/v1/projects` e `PUT /api/v1/projects/{id}` aceitam e persistem `blueprint_id`, vinculando bidirecionalmente o blueprint ao projeto (`bp.project_id = prj.id`).
  - Criado o endpoint `GET /api/v1/projects/{id}/versions` para listar todos os snapshots SemVer do projeto.

### Gap 13 — Auditoria de Criação de Versão (`VERSION_CREATED`) e Filtros na Trilha de Auditoria
- **Problema Anterior:** Criar versão de projeto não gerava log `VERSION_CREATED` e `GET /api/v1/audit/logs` não filtrava por `entity_id` ou `actor`.
- **Solução Implementada:**
  - `POST /api/v1/projects/{id}/versions` grava o evento `VERSION_CREATED` com `entity_id` do projeto, e `GET /api/v1/audit/logs` suporta filtros por `action`, `resource`, `entity_id` e `actor`.

### Gaps 14 & 15 — Sincronização de Credenciais `.env` e Suporte a `email` / `username` / `username_or_email`
- **Problema Anterior:** As variáveis `aiops_app_builder_user` / `aiops_app_builder_password` e `LOFT_ADMIN_EMAIL` / `LOFT_ADMIN_PASSWORD` divergiam entre o `.env` e o seed do banco.
- **Solução Implementada:**
  - Sincronizados `.env`, `app_builder_engine/.env` e `IamService.login`, aceitando autenticação administrativa com todas as variáveis padronizadas e permitindo enviar `username_or_email`, `email` ou `username` no payload de login.

### Gap 16 — Lockout de Conta Retornando `423 ACCOUNT_LOCKED` e Rate Limit `429 RATE_LIMITED`
- **Problema Anterior:** Conta bloqueada retornava `403 PERMISSION_DENIED` em vez de `423 ACCOUNT_LOCKED`.
- **Solução Implementada:**
  - Após 5 tentativas falhas de login, a conta é bloqueada por 15 minutos e o endpoint retorna **HTTP `423 Locked`** com `error.code = "ACCOUNT_LOCKED"`. Rate limit retorna **HTTP `429 Too Many Requests`** com `error.code = "RATE_LIMITED"`.

### Gap 17 — Padronização de Códigos HTTP REST (`201 Created`) e Envelope de Erros
- **Problema Anterior:** Endpoints de criação de sub-recursos retornavam `200 OK` em vez de `201 Created`.
- **Solução Implementada:**
  - `POST /api/v1/projects`, `POST /api/v1/projects/{id}/versions`, `POST /api/v1/iam/auth/signup` e `POST /api/v1/iam/groups/{id}/members` retornam `201 Created` de forma consistente.

### Gap 18 — Envelope `{ "data", "meta" }` no Endpoint `POST /api/v1/ai/blueprints/compose`
- **Problema Anterior:** `POST /api/v1/ai/blueprints/compose` retornava apenas campos na raiz sem o envelope padrão `data` e `meta`.
- **Solução Implementada:**
  - A resposta agora inclui `{ "data": { ... }, "meta": { "timestamp": "...", "version": "1.0.0" } }`, mantendo também os campos no nível raiz para retrocompatibilidade com clientes existentes.

---

## 🛠️ Correções de Reteste ao Vivo (19/10/2026) — A12, A13 e A15

### A12 — Vínculo Bidirecional `blueprint` ↔ `project` (Criação, Atualização, Troca e Remoção)
- **Problema Observado no Reteste:** `PUT /api/v1/projects/{id}` aceitava `blueprint_id` e `template_id`, mas consultar o blueprint (`GET /api/v1/ai/blueprints/{bp_id}`, `GET /api/v1/blueprints/{bp_id}` ou `GET /api/v1/projects/{id}/blueprint`) continuava retornando `project_id: null`.
- **Solução Implementada:**
  - Implementada sincronização transacional bidirecional em `ProjectService` (`sync_project_to_blueprint`, `sync_blueprint_to_project` e `reconcile_all_project_blueprint_links`):
    - **Vincular (`POST /api/v1/projects` ou `PUT /api/v1/projects/{id}` com `blueprint_id`)**: Atualiza `project.blueprint_id = bp_id`, `blueprint.project_id = project.id` e sincroniza `architecture_id` / `modules`.
    - **Trocar (`PUT /api/v1/projects/{id}` com novo `blueprint_id`)**: Limpa `old_blueprint.project_id = null` no blueprint anterior e define `new_blueprint.project_id = project.id` no novo blueprint.
    - **Desvincular (`PUT /api/v1/projects/{id}` com `blueprint_id: null` ou `DELETE /api/v1/projects/{id}`)**: Limpa `project.blueprint_id = null` e `blueprint.project_id = null` em ambos os lados.
    - **Operações pelo lado do Blueprint (`POST /api/v1/blueprints/build`, `PUT /api/v1/blueprints/{id}`, `DELETE /api/v1/blueprints/{id}`, `POST /api/v1/ai/blueprints/compose`, `GET/PUT /api/v1/ai/blueprints/{id}`)**: Também atualizam o `project.blueprint_id` correspondente.
    - **Reconciliação Automática na Inicialização**: O banco SQLite executa `_reconcile_links()` no startup para reparar quaisquer vínculos unilaterais preexistentes.

### A13 — `POST /api/v1/blueprints/validate-config` Retorna HTTP `422 (VALIDATION_ERROR)` Quando `can_publish=false`
- **Problema Observado no Reteste:** Enviar `architecture_id` inexistente ou configuração com erro crítico para `POST /api/v1/blueprints/validate-config` respondia HTTP `200 OK` com `status: "error"`.
- **Solução Implementada:**
  - Quando a validação resulta em `can_publish: false` ou `critical_count > 0` (por exemplo, `ARCH_NOT_FOUND`, `MISSING_MODULE_DEPENDENCY`, `COMPONENT_NOT_FOUND`), o endpoint agora responde **HTTP `422 Unprocessable Entity`** com `error.code = "VALIDATION_ERROR"`, mantendo integralmente `data` (`data.status = "error"`, `data.can_publish = false`, `data.diagnostics[]`) e `diagnostics[]` no corpo da resposta.
  - Quando `can_publish: true` (`status: "ready"` ou `status: "warning"`), o endpoint responde **HTTP `200 OK`** no envelope padrão `{ "data": { ... }, "meta": { ... } }`.
  - Ambos os códigos (`200` e `422`) e a semântica de `data.status`, `data.can_publish` e `data.validation_scope` estão formalmente documentados no schema OpenAPI (`/openapi.json`).

### A15 — Validação Copan Exige `ui_library` Explícita para Rebaixar para `WARNING` + Inspeção Real de Conformidade e Escopo Declarativo Explícito
- **Problema Observado no Reteste:** Omitir `rul_copan_01_brand_orange` e `rul_copan_02_tokens_only` sem declarar `ui_library` precisava manter o erro `CRITICAL` (`can_publish=false`), rebaixando para `WARNING` **apenas** quando o projeto declara explicitamente uma biblioteca de UI que não seja Copan (ex.: `ui_library: "antd"`), além de inspecionar conformidade real e documentar que `ready` declarativo significa "declaração consistente".
- **Solução Implementada:**
  1. **Exigência Copan Mantida como `CRITICAL` por Padrão e Rebaixada para `WARNING` Somente com `ui_library` Explícita**:
     - Se `rul_copan_01_brand_orange` / `rul_copan_02_tokens_only` não forem enviadas em `rule_ids` e **não houver declaração explícita** de `ui_library` não-Copan (`ui_library: null`), o endpoint mantém os diagnósticos `MISSING_ARCH_MANDATORY_RULE` e `MISSING_COPAN_MANDATE` como `CRITICAL`, retornando **HTTP `422 (VALIDATION_ERROR)`**, `status: "error"`, `can_publish: false` e `ui_library: null` (sem assumir `"custom"`).
     - Quando o projeto declara explicitamente uma biblioteca de UI que não seja Copan (ex.: `ui_library: "antd"`), a exigência das regras Copan é rebaixada para `WARNING`, retornando **HTTP `200 OK`**, `status: "warning"` e `can_publish: true`.
  2. **Auditoria Real de Conformidade de Código e Dependências (`validation_scope: "code_and_manifest_audited"`)**:
     - `POST /api/v1/blueprints/validate-config` aceita opcionalmente `ui_library`, `dependencies`, `package_json` e `source_files` (mapa `{ "caminho/arquivo.tsx": "conteúdo" }`).
     - Se as regras Copan forem declaradas mas o `package_json`/`dependencies` ou `ui_library` usar `antd`/`@mui`/`chakra` sem pacotes ou tokens Copan, ou se `source_files` importar `antd` sem `--copan-*` ou contiver cores hexadecimais hardcoded (`#...`), o motor emite diagnósticos específicos de auditoria (`COPAN_UI_STACK_DIVERGENCE`, `COPAN_CODE_AUDIT_MISMATCH`, `COPAN_HARDCODED_HEX_DETECTED`).
  3. **Documentação Explícita do Significado de `ready` (`validation_scope` e `status_meaning`)**:
     - Toda resposta de `validate-config` inclui os campos `validation_scope` (`"declarative_manifest"` vs `"code_and_manifest_audited"`), `conformance_mode`, `ui_library` e `status_meaning`, além do diagnóstico informativo `DECLARATIVE_VALIDATION_SCOPE`, deixando explícito que no modo declarativo `status: "ready"` significa **"declaração consistente com o catálogo"**, e não **"código-fonte auditado"**.

---

## 🔒 Correções de Segurança e Consistência ao Vivo (20/10/2026) — S1, S2, S3 e S4

### S1 — JWT Sempre Assinado com Segredo Hardcoded, Ignorando o `.env`
- **Problema Observado:** `app/core/security.py` definia `SECRET_KEY = getattr(settings, "jwt_secret_key", "loft_super_secure_enterprise_iam_jwt_secret_key_2026")`, mas a classe `Settings` (`app/core/config.py`) não declarava nenhum campo `jwt_secret_key`. Como resultado, `getattr` sempre retornava o fallback hardcoded, independentemente do valor de `JWT_SECRET_KEY` no `.env` — que, além disso, só existia em `.env.example`, nunca no `.env` real (`app_builder_engine/.env`).
- **Solução Implementada:**
  - Adicionado o campo `jwt_secret_key: str` em `Settings` (`app/core/config.py`), populado em `Settings.load()` a partir de `os.getenv("JWT_SECRET_KEY")` (reaproveitando o mecanismo já existente de `load_dotenv_files()`).
  - Se a variável não estiver definida (ou mantiver o valor de exemplo `your-secure-random-jwt-secret-key-min-32-chars`), a aplicação não quebra no startup: cai em um fallback de desenvolvimento documentado em código (`_DEV_FALLBACK_JWT_SECRET_KEY`) e registra um `logger.warning` explícito.
  - Gerado um segredo aleatório forte com `secrets.token_hex(32)` e gravado em `app_builder_engine/.env` como `JWT_SECRET_KEY=372115ba0bac1dfdbe4fc7f9377d76c7416a0c9c10824de2ac33f30a54c29ad1` (arquivo `.env` real, fora do controle de versão — `.env.example` permanece apenas com o nome da variável).
  - `app/core/security.py` passou a consumir `settings.jwt_secret_key` (já carregado do `.env`), mantendo `getattr` apenas como proteção defensiva adicional.
  - **Validação ao vivo:** `POST /api/v1/iam/login` com as credenciais de `app_builder_engine/.env` → `HTTP 200`, token assinado com o novo segredo; `GET /api/v1/iam/me` com esse token → `HTTP 200` retornando o perfil do usuário autenticado corretamente.

### S2 — Endpoints de Catálogo e Blueprints Sem Autenticação
- **Problema Observado:** Nenhuma rota de `app/api/v1/catalog_api.py` (Components, Templates, Modules, Rules, Architectures, Specifications) ou `app/api/v1/blueprints_api.py` usava `Depends(get_current_user_claims)`. Confirmado ao vivo: `GET /api/v1/components` respondia `200 OK` sem nenhum header `Authorization`.
- **Solução Implementada:**
  - Importado `get_current_user_claims` (de `app.api.v1.iam_api`, mesma origem usada por `iam_api.py`, `ai_agents_api.py`, `settings_api.py`, `ai_settings_api.py` e `ai_gateway_api.py`) em `catalog_api.py` e `blueprints_api.py`.
  - Adicionado o parâmetro `claims: dict[str, Any] = Depends(get_current_user_claims)` a **todas** as funções de rota de ambos os arquivos (36 endpoints em `catalog_api.py`, 10 em `blueprints_api.py`, incluindo leitura e escrita), preservando os campos já existentes em `ValidateConfigRequest` (`ui_library`, `dependencies`, `package_json`, `source_files`) sem reverter nenhuma mudança não commitada.
  - **Validação ao vivo:**
    - `GET /api/v1/components` sem header → `HTTP 401` (`AUTHENTICATION_FAILED`); com `Authorization: Bearer <token>` → `HTTP 200`.
    - `GET /api/v1/blueprints` sem header → `HTTP 401`; com token → `HTTP 200`.
    - `POST /api/v1/blueprints/validate-config` sem header → `HTTP 401`; com token → `HTTP 200` (fluxo de validação preservado).

### S3 — Endpoint Duplicado `POST /api/v1/ai/execute` Sem Autenticação e Sem Auditoria
- **Problema Observado:** `app/api/v1/ai_gateway.py` (router `prefix="/ai"`, rota `POST /execute`) não exigia autenticação nem gravava trilha de auditoria, ao contrário do endpoint oficial `POST /api/v1/ai/gateway/execute` (`app/api/v1/ai_gateway_api.py`), que aplica `Depends(get_current_user_claims)`, `rbac_service.require_permission("ai.gateway:execute", ...)` e registro de auditoria via `AiGatewayService._record_log`.
- **Solução Implementada:**
  - Adicionado `claims: dict[str, Any] = Depends(get_current_user_claims)` e a checagem `rbac_service.require_permission("ai.gateway:execute", user_role=claims.get("role"))` ao endpoint `POST /api/v1/ai/execute`.
  - Adicionada a mesma chamada de auditoria usada por `/gateway/execute` (`ai_gateway_service._record_log(...)`), registrando prompt, resposta, provedor, modelo, latência, status (`SUCCESS`/`ERROR`) e ator (`claims["email"]`) tanto em caso de sucesso quanto de falha do provedor de IA — essa trilha fica visível em `GET /api/v1/ai/gateway/logs` e na tabela `audit_logs`.
  - **Validação ao vivo:** `POST /api/v1/ai/execute` sem header → `HTTP 401` (`AUTHENTICATION_FAILED`); com token válido → requisição autenticada e autorizada com sucesso (o provedor Gemini retornou `403` por política de rede do sandbox, não relacionado à auth), e o registro de auditoria correspondente (`actor: willian.jesus@olivelas.com.br`, `status: ERROR`) apareceu imediatamente em `GET /api/v1/ai/gateway/logs`.

### S4 — TTL do Access Token Inconsistente Entre Código e Documentação (e uma Terceira Divergência em Runtime)
- **Problema Observado:** `POST /api/v1/iam/login` retornava `expires_in: 900` (15 min) em teste ao vivo; `app/core/security.py` definia `ACCESS_TOKEN_EXPIRE_MINUTES = 60` (1h); e `GET /api/v1/iam/contract` + `README.md` documentavam `24h`. Três valores diferentes para o mesmo conceito.
- **Causa Raiz:** `IamService.login()` (`app/services/iam_service.py`) chamava `create_access_token(..., expires_delta=timedelta(days=7) if body.remember_me else timedelta(minutes=15))`, um valor hardcoded e independente de `ACCESS_TOKEN_EXPIRE_MINUTES`. Já `app/services/iam_service.py` (`get_application_iam_contract`) expunha `"access_token_ttl_seconds": 86400` também hardcoded, sem relação com nenhum dos dois valores de código.
- **Solução Implementada (alinhado ao valor correto segundo a Loft Backend Security Specification, 15 min — e não ampliado para 60min/24h):** o comentário original de `IamService.login()` ("15m default per Loft Backend Security Specification") indicava que 15 minutos sempre foi o valor de TTL correto; a divergência real estava em `ACCESS_TOKEN_EXPIRE_MINUTES = 60` (código) e em `86400` hardcoded no contrato — ambos corrigidos para convergir em 15 min, em vez de estender o TTL real da aplicação.
  - `app/core/security.py`: `ACCESS_TOKEN_EXPIRE_MINUTES` corrigido de `60` para `15`, com comentário referenciando a Loft Backend Security Specification.
  - `IamService.login()` passou a usar `timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)` (importado de `app.core.security`) em vez do literal `timedelta(minutes=15)`, eliminando a divergência de runtime sem alterar o valor efetivo.
  - `get_application_iam_contract()` passou a calcular `"access_token_ttl_seconds": ACCESS_TOKEN_EXPIRE_MINUTES * 60` em vez do literal `86400`, tornando `app/core/security.py` a única fonte de verdade.
  - `README.md` (seção do Contrato IAM) atualizado de "TTL de Access Token 24h" para "TTL de Access Token 15min — `ACCESS_TOKEN_EXPIRE_MINUTES` em `app/core/security.py`, conforme Loft Backend Security Specification".
  - **Validação ao vivo:** `GET /api/v1/iam/contract` → `security_configuration.access_token_ttl_seconds: 900`; `POST /api/v1/iam/login` → `expires_in: 900`; `GET /api/v1/iam/me` com o novo token → `HTTP 200`. Documentação, constante de código e comportamento de runtime agora reportam o mesmo valor (900s / 15min), consistente com a especificação de segurança original.

