# Loft Backend Foundation

## Volume I — Backend Specification & Architecture

**Status:** Foundation  
**Version:** 1.0  
**Primary Language:** Python  
**Framework:** FastAPI  
**Architecture:** API First + AI First  
**Database:** PostgreSQL  
**ORM:** SQLAlchemy 2.x  
**Migrations:** Alembic  
**Validation:** Pydantic v2  
**Authentication:** OAuth2 / JWT  
**Observability:** OpenTelemetry  
**API Documentation:** OpenAPI / Swagger UI / ReDoc

---

# 1. Objetivo

O Loft Backend Foundation define o padrão oficial para construção de APIs backend modernas, seguras, observáveis, escaláveis e preparadas para integração com aplicações web, mobile, automações, serviços externos e soluções baseadas em Inteligência Artificial.

O backend deve ser tratado como um produto de plataforma e não apenas como uma camada HTTP.

A arquitetura deve priorizar:

- API First;
- AI First;
- Security by Design;
- Type Safety;
- Async First;
- Observability by Default;
- Testability;
- Evolvability;
- Explicit Domain Boundaries;
- Contract-Driven Development;
- Cloud Native;
- Horizontal Scalability.

---

# 2. Princípios Arquiteturais

## 2.1 API First

A API é o contrato principal do sistema.

Toda funcionalidade relevante deve possuir:

- endpoint documentado;
- request schema;
- response schema;
- códigos HTTP definidos;
- tratamento de erros;
- autenticação/autorização quando aplicável;
- exemplos no OpenAPI;
- testes automatizados.

O frontend nunca deve depender diretamente de detalhes internos do domínio.

---

## 2.2 AI First

A IA deve ser considerada uma capacidade nativa do backend.

O backend deve ser preparado para:

- LLM providers;
- structured outputs;
- tool calling;
- embeddings;
- RAG;
- agentes;
- streaming;
- avaliação de respostas;
- observabilidade de chamadas LLM;
- controle de custos;
- fallback entre providers;
- versionamento de prompts;
- auditoria de operações de IA.

A camada de IA não deve estar espalhada pelos controllers.

Deve existir uma abstração própria:

```text
API
 ↓
Application Service
 ↓
AI Service
 ↓
AI Provider / Gateway
```

---

# 3. Stack Oficial

## Core

```text
Python 3.13+
FastAPI
Uvicorn
Pydantic v2
pydantic-settings
```

Python deve ser atualizado de acordo com o suporte oficial das bibliotecas utilizadas.

---

# 4. API Framework

## FastAPI

FastAPI será o framework HTTP padrão.

Utilizar extensivamente:

- Dependency Injection;
- APIRouter;
- Depends;
- Security;
- BackgroundTasks quando apropriado;
- lifespan;
- middleware;
- exception handlers;
- OpenAPI;
- response models;
- request models;
- tags;
- security schemes;
- WebSocket quando necessário;
- StreamingResponse;
- SSE quando necessário.

A documentação OpenAPI deve ser gerada automaticamente sempre que possível.

Endpoints não devem duplicar manualmente informações que já podem ser expressas através de:

- type hints;
- Pydantic;
- FastAPI decorators;
- response models;
- dependencies.

---

# 5. Estrutura de Projeto

Utilizar arquitetura orientada a domínio e responsabilidades.

Estrutura recomendada:

```text
app/
├── main.py
│
├── core/
│   ├── config.py
│   ├── security.py
│   ├── logging.py
│   ├── observability.py
│   ├── exceptions.py
│   └── lifespan.py
│
├── api/
│   ├── router.py
│   ├── dependencies.py
│   │
│   └── v1/
│       ├── router.py
│       ├── auth.py
│       ├── users.py
│       ├── health.py
│       └── ...
│
├── models/
│   ├── base.py
│   ├── user.py
│   └── ...
│
├── schemas/
│   ├── common.py
│   ├── auth.py
│   ├── user.py
│   └── ...
│
├── repositories/
│   ├── base.py
│   ├── user.py
│   └── ...
│
├── services/
│   ├── auth.py
│   ├── user.py
│   └── ...
│
├── domain/
│   ├── entities/
│   ├── value_objects/
│   ├── policies/
│   └── services/
│
├── integrations/
│   ├── http/
│   ├── storage/
│   ├── messaging/
│   └── external_apis/
│
├── ai/
│   ├── clients/
│   ├── providers/
│   ├── prompts/
│   ├── schemas/
│   ├── tools/
│   ├── agents/
│   ├── embeddings/
│   ├── rag/
│   └── evaluation/
│
├── db/
│   ├── session.py
│   ├── base.py
│   └── migrations/
│
└── tests/
    ├── unit/
    ├── integration/
    ├── api/
    ├── security/
    └── ai/
```

---

# 6. Separação de Responsabilidades

## Router

Responsável exclusivamente pela interface HTTP.

Não deve conter regra de negócio complexa.

Exemplo conceitual:

```text
Router
  ↓
Schema validation
  ↓
Dependency resolution
  ↓
Application Service
  ↓
Domain
  ↓
Repository
```

---

# 7. Pydantic

Pydantic será utilizado para:

- request validation;
- response serialization;
- configuration;
- domain DTOs;
- external API contracts;
- AI structured outputs;
- OpenAPI schemas.

Não utilizar entidades SQLAlchemy diretamente como contratos públicos da API.

Separar:

```text
SQLAlchemy Model
        ↓
Domain / Service
        ↓
Pydantic Response Schema
```

---

# 8. API Versioning

Todas as APIs públicas devem possuir versionamento.

Padrão:

```text
/api/v1/...
```

Exemplo:

```text
GET /api/v1/users
POST /api/v1/users
GET /api/v1/users/{user_id}
```

Breaking changes devem gerar nova versão.

Exemplo:

```text
/api/v1/users
/api/v2/users
```

---

# 9. Convenções HTTP

Utilizar semântica HTTP corretamente.

### GET

Consulta.

### POST

Criação ou operação não idempotente.

### PUT

Substituição completa.

### PATCH

Atualização parcial.

### DELETE

Remoção.

Utilizar status codes apropriados:

```text
200 OK
201 Created
202 Accepted
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
503 Service Unavailable
```

---

# 10. Response Envelope

Quando fizer sentido para o domínio, utilizar envelope consistente.

Exemplo:

```json
{
  "data": {},
  "meta": {
    "request_id": "..."
  }
}
```

Para listas:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 100
  }
}
```

Evitar envelopes artificiais quando o próprio HTTP/JSON já expressar adequadamente a resposta.

---

# 11. Paginação

Endpoints de coleção devem suportar paginação.

Padrão inicial:

```text
?page=1&page_size=20
```

Com limites:

```text
page_size <= 100
```

Para grandes datasets, preferir cursor pagination:

```text
?cursor=...
```

Evitar consultas que retornem datasets potencialmente ilimitados.

---

# 12. Filtering, Sorting e Search

Utilizar convenções consistentes:

```text
?status=active
?sort=-created_at
?search=john
?page=1
&page_size=20
```

Não permitir que parâmetros sejam diretamente convertidos em SQL sem validação.

Campos de ordenação devem possuir whitelist explícita.

---

# 13. Banco de Dados

## PostgreSQL

PostgreSQL será o banco relacional padrão.

Preferência por:

```text
PostgreSQL
+
SQLAlchemy 2.x
+
asyncpg
```

SQLAlchemy 2.x possui suporte nativo para `AsyncEngine` e `AsyncSession`, adequado à arquitetura async do FastAPI.

---

# 14. SQLAlchemy

Utilizar SQLAlchemy 2.x com:

- declarative mapping;
- typed models;
- AsyncEngine;
- AsyncSession;
- repository pattern quando necessário;
- explicit transactions;
- relationship configuration;
- indexes;
- constraints;
- foreign keys;
- database-level validation.

Evitar:

```text
session.execute(text(f"..."))
```

com valores fornecidos pelo usuário.

Sempre utilizar parâmetros bindados e APIs tipadas.

---

# 15. Async Database

O padrão será:

```text
FastAPI async
      ↓
SQLAlchemy AsyncSession
      ↓
asyncpg
      ↓
PostgreSQL
```

Nunca compartilhar a mesma `AsyncSession` entre tasks concorrentes. A própria documentação do SQLAlchemy alerta que `AsyncSession` não é segura para uso concorrente entre múltiplas tasks.

Cada request/dependency deve possuir seu próprio contexto de sessão.

---

# 16. Migrations

Utilizar:

```text
Alembic
```

Toda alteração estrutural deve possuir migration.

Nunca modificar schema de produção manualmente sem uma migration correspondente.

Pipeline:

```text
Model change
    ↓
Alembic revision
    ↓
Review
    ↓
Automated migration test
    ↓
Deploy
    ↓
Alembic upgrade
```

O Alembic deve ser usado também para detectar divergências entre models e database schema quando possível. A versão 1.19.x atual possui melhorias recentes no autogenerate.

---

# 17. Transações

Operações que modificam múltiplas entidades devem utilizar transação explícita.

Exemplo conceitual:

```text
BEGIN
 ↓
Create Order
 ↓
Create Order Items
 ↓
Update Inventory
 ↓
Create Audit Event
 ↓
COMMIT
```

Qualquer falha relevante:

```text
ROLLBACK
```

---

# 18. Connection Pool

Configurar pool do SQLAlchemy de acordo com o ambiente.

Dev:

```text
small pool
```

Production:

```text
pool_size
max_overflow
pool_timeout
pool_recycle
pool_pre_ping
```

Os valores devem ser configuráveis por environment variables.

---

# 19. Configuration

Utilizar:

```text
pydantic-settings
```

Configuração baseada em environment variables.

Exemplo conceitual:

```text
APP_ENV
DATABASE_URL
JWT_SECRET_KEY
JWT_ALGORITHM
JWT_ACCESS_TOKEN_EXPIRE_MINUTES
REDIS_URL
OPENAI_API_KEY
ANTHROPIC_API_KEY
OTEL_EXPORTER_OTLP_ENDPOINT
```

Nunca armazenar secrets no código.

---

# 20. Authentication

Implementar autenticação baseada em padrões OAuth2.

Base inicial:

```text
OAuth2
+
JWT
+
pwdlib
+
PyJWT
```

FastAPI possui integração nativa com OAuth2 e seus security schemes, e sua documentação atual utiliza `pwdlib` para hashing e `PyJWT` para tokens.

---

# 21. Password Security

Nunca armazenar senha em plaintext.

Utilizar:

```text
pwdlib
```

Preferência por Argon2 quando suportado pela configuração de segurança.

Implementar:

```text
password hashing
password verification
password reset
password change
```

Nunca retornar hashes através da API.

---

# 22. JWT

Access tokens devem possuir:

```text
sub
iss
aud
iat
exp
jti
```

Evitar armazenar dados sensíveis dentro do JWT.

JWT é assinado, não criptografado. Portanto, seu payload não deve ser tratado como segredo.

---

# 23. Refresh Tokens

Quando necessário:

```text
Access Token
+
Refresh Token
```

Access tokens devem possuir curta duração.

Refresh tokens devem:

- possuir rotação;
- poder ser revogados;
- possuir identificação única;
- ser auditáveis;
- não permanecer indefinidamente válidos.

---

# 24. Authorization

Autenticação não é autorização.

Implementar autorização separadamente.

Suportar:

```text
RBAC
Scopes
Permissions
Resource ownership
Policy-based authorization
```

Exemplo:

```text
users:read
users:create
users:update
users:delete

reports:read
reports:create

admin:*
```

FastAPI integra OAuth2 scopes ao sistema de segurança e à documentação OpenAPI.

---

# 25. Dependency-based Authorization

Utilizar FastAPI Dependencies para proteção de rotas.

Conceito:

```text
get_current_user()
        ↓
require_authenticated()
        ↓
require_permission("users:write")
        ↓
endpoint
```

Isso permite manter autorização declarativa.

---

# 26. Multi-Tenant

Quando aplicável, o backend deve suportar isolamento por tenant.

Modelo:

```text
User
 ↓
Tenant
 ↓
Roles
 ↓
Permissions
 ↓
Resources
```

Toda query sensível deve aplicar o tenant context.

Nunca confiar apenas no frontend para filtrar tenant.

---

# 27. Security Middleware

Implementar:

- CORS;
- Trusted Hosts;
- security headers;
- request size limits;
- timeout controls;
- rate limiting;
- authentication;
- authorization;
- request ID;
- audit logging.

---

# 28. Rate Limiting

Implementar rate limiting principalmente para:

```text
/login
/token
/password-reset
/AI endpoints
/public endpoints
```

Rate limiting pode utilizar Redis como backend distribuído.

Exemplo conceitual:

```text
IP + endpoint
User + endpoint
API Key + endpoint
Tenant + endpoint
```

Não limitar apenas por IP em APIs autenticadas, pois NAT/proxies podem gerar falsos positivos.

---

# 29. CORS

CORS deve possuir allowlist explícita.

Nunca utilizar em produção:

```text
allow_origins=["*"]
```

quando a API utiliza credenciais.

Configurar por ambiente.

---

# 30. Security Headers

Adicionar headers apropriados, incluindo quando aplicável:

```text
X-Content-Type-Options
X-Frame-Options
Referrer-Policy
Content-Security-Policy
Strict-Transport-Security
```

O backend não deve assumir que o frontend ou proxy sempre adicionará esses headers.

---

# 31. Input Validation

Todos os inputs externos devem ser considerados não confiáveis.

Validar:

- JSON;
- query parameters;
- path parameters;
- headers;
- cookies;
- multipart;
- file uploads;
- webhook payloads;
- external API responses;
- LLM outputs.

---

# 32. File Upload Security

Quando houver upload:

- validar MIME type;
- validar extensão;
- limitar tamanho;
- gerar nome interno;
- nunca confiar no filename;
- armazenar fora do filesystem público;
- opcionalmente fazer malware scanning;
- validar conteúdo;
- evitar path traversal;
- utilizar URLs temporárias quando aplicável.

---

# 33. Error Handling

Nunca retornar stack traces em produção.

Criar exception hierarchy:

```text
ApplicationError
├── ValidationError
├── AuthenticationError
├── AuthorizationError
├── NotFoundError
├── ConflictError
├── ExternalServiceError
├── AIServiceError
└── InfrastructureError
```

Response:

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found",
    "request_id": "req_123"
  }
}
```

O `code` deve ser estável.

A mensagem pode mudar.

---

# 34. Request ID

Toda requisição deve possuir:

```text
X-Request-ID
```

Se recebido do upstream:

```text
propagar
```

Caso contrário:

```text
gerar
```

O request ID deve aparecer em:

- logs;
- errors;
- traces;
- responses;
- audit events quando aplicável.

---

# 35. Logging

Utilizar structured logging.

Preferência:

```text
JSON logs
```

Campos recomendados:

```text
timestamp
level
service
environment
request_id
trace_id
span_id
user_id
tenant_id
route
method
status_code
duration_ms
error_code
```

Nunca logar:

```text
password
access_token
refresh_token
API keys
secrets
credit card data
sensitive personal data
```

---

# 36. Observability

OpenTelemetry deve ser considerado parte da Foundation.

Implementar:

```text
Traces
Metrics
Logs correlation
```

OpenTelemetry Python atualmente possui tracing e métricas em estado estável, além de instrumentações para frameworks e bibliotecas.

Instrumentar pelo menos:

```text
FastAPI
HTTPX
SQLAlchemy
Redis
LLM calls
```

---

# 37. Health Checks

Implementar:

```text
GET /health
GET /health/live
GET /health/ready
```

### `/health/live`

Indica se o processo está vivo.

### `/health/ready`

Valida dependências críticas:

```text
Database
Redis
critical external services
```

Não utilizar `/health` para executar operações pesadas.

---

# 38. Metrics

Expor métricas da aplicação.

Métricas importantes:

```text
http_requests_total
http_request_duration_seconds
http_errors_total

db_query_duration
db_connection_pool_usage

external_api_requests
external_api_errors

ai_requests_total
ai_latency
ai_tokens
ai_cost
ai_errors
```

---

# 39. External HTTP Clients

Utilizar:

```text
HTTPX
```

Preferencialmente `AsyncClient`.

Nunca criar um novo HTTP client para cada request sem necessidade.

Gerenciar lifecycle através do `lifespan`.

---

# 40. Resilience

Integrações externas devem possuir:

```text
timeouts
retries
exponential backoff
circuit breaking quando necessário
fallback
idempotency
```

Retry não deve ser aplicado indiscriminadamente.

Nunca repetir automaticamente operações não idempotentes sem estratégia adequada.

---

# 41. Background Jobs

Operações demoradas não devem bloquear requests.

Exemplos:

```text
file processing
emails
reports
AI processing
batch operations
webhooks
data synchronization
```

Para tarefas simples:

```text
FastAPI BackgroundTasks
```

Para workloads distribuídos:

```text
Redis
+
Celery / Arq / equivalente
```

A escolha deve considerar:

- durabilidade;
- retries;
- scheduling;
- observabilidade;
- volume;
- concorrência.

---

# 42. Redis

Redis pode ser utilizado para:

- cache;
- rate limiting;
- distributed locks;
- job queues;
- temporary state;
- session metadata;
- idempotency keys.

Redis não deve substituir PostgreSQL como source of truth.

---

# 43. Caching

Implementar cache somente onde houver benefício mensurável.

Padrão:

```text
Cache-aside
```

Exemplo:

```text
Request
 ↓
Redis
 ↓ cache miss
PostgreSQL
 ↓
Redis
```

Sempre definir TTL.

Evitar cache indefinido.

---

# 44. Idempotency

Operações críticas devem suportar idempotency keys.

Exemplo:

```http
Idempotency-Key: 7d3...
```

Especialmente:

```text
payments
orders
imports
webhooks
AI jobs
external integrations
```

---

# 45. Webhooks

Webhooks devem possuir:

- signature validation;
- timestamp validation;
- replay protection;
- idempotency;
- retries;
- audit;
- observability.

Fluxo:

```text
Webhook
 ↓
Validate signature
 ↓
Validate timestamp
 ↓
Check idempotency
 ↓
Persist event
 ↓
Process async
 ↓
Return 2xx
```

---

# 46. API Keys

Para integrações machine-to-machine:

```text
API Keys
```

Cada chave deve possuir:

```text
id
name
owner
scopes
created_at
expires_at
last_used_at
revoked_at
```

Nunca armazenar API key em plaintext no banco.

Armazenar hash e exibir o segredo apenas durante a criação.

---

# 47. Audit Log

Operações sensíveis devem ser auditadas.

Exemplo:

```text
USER_CREATED
USER_UPDATED
USER_DELETED
ROLE_CHANGED
PERMISSION_CHANGED
LOGIN_SUCCESS
LOGIN_FAILED
TOKEN_REVOKED
API_KEY_CREATED
API_KEY_REVOKED
AI_REQUEST
DATA_EXPORTED
```

Campos:

```text
event_id
timestamp
actor_id
tenant_id
action
resource_type
resource_id
ip
user_agent
request_id
metadata
```

---

# 48. OpenAPI

A documentação OpenAPI deve ser considerada um artefato oficial.

Disponibilizar:

```text
/docs
/redoc
/openapi.json
```

Quando necessário, separar documentação:

```text
Public API
Internal API
Admin API
```

Utilizar tags:

```text
Authentication
Users
Organizations
Reports
AI
Admin
Health
```

---

# 49. Swagger UI

Swagger UI deve permitir:

```text
Authorize
Bearer Token
OAuth2
API exploration
Request execution
Schema inspection
```

O schema OpenAPI deve refletir fielmente o comportamento real da API.

---

# 50. Contract First

Quando houver frontend, mobile ou consumidores externos críticos:

```text
OpenAPI
 ↓
Contract
 ↓
Backend
 ↓
Frontend SDK
```

Considerar geração automática de clients TypeScript.

Isso reduz divergência entre backend e frontend.

---

# 51. AI Architecture

A IA deve possuir uma camada própria.

```text
                    ┌──────────────┐
                    │   FastAPI    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ AI Service   │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        Structured      Agents        RAG
         Outputs
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────▼───────┐
                    │ AI Gateway   │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       OpenAI           Anthropic        Gemini
```

---

# 52. AI Provider Abstraction

Não acoplar domínio diretamente a:

```text
OpenAI
Anthropic
Gemini
```

Criar interface:

```text
AIProvider
```

Implementações:

```text
OpenAIProvider
AnthropicProvider
GeminiProvider
LocalProvider
```

Isso permite:

- troca de provider;
- fallback;
- testes;
- controle de custo;
- estratégia por modelo.

---

# 53. LiteLLM

Avaliar LiteLLM como gateway de modelos.

Ele fornece uma interface compatível com APIs de múltiplos providers e possui recursos como retry/fallback, routing, controle de custos e observabilidade.

Arquitetura possível:

```text
FastAPI
 ↓
AI Service
 ↓
LiteLLM
 ↓
Provider
```

Não tornar LiteLLM obrigatório para casos simples.

Utilizá-lo quando houver necessidade real de:

- múltiplos providers;
- fallback;
- routing;
- custo;
- governança.

---

# 54. Structured AI Outputs

Utilizar Pydantic como contrato de saída da IA.

Exemplo:

```text
LLM
 ↓
Structured Output
 ↓
Pydantic Validation
 ↓
Domain Object
```

Considerar:

```text
Instructor
```

para cenários de structured extraction.

Instructor utiliza Pydantic para definir, validar e tipar outputs estruturados e suporta múltiplos providers.

---

# 55. AI Tools

Ferramentas da IA devem ser explicitamente definidas.

Exemplo:

```text
search_users()
get_invoice()
create_report()
query_database()
search_knowledge_base()
```

Cada tool deve possuir:

```text
name
description
input schema
output schema
authorization policy
audit policy
timeout
```

Nunca permitir que um agente tenha acesso irrestrito ao banco ou infraestrutura.

---

# 56. AI Authorization

Toda tool de IA deve respeitar as mesmas políticas da API.

Exemplo:

```text
User
 ↓
AI Agent
 ↓
Tool
 ↓
Authorization
 ↓
Resource
```

A IA nunca deve ser uma forma de bypass do RBAC.

---

# 57. Prompt Management

Prompts devem ser tratados como código/configuração versionável.

Estrutura:

```text
ai/
└── prompts/
    ├── summarization/
    │   ├── v1.py
    │   └── v2.py
    ├── classification/
    └── extraction/
```

Registrar:

```text
prompt_version
model
temperature
provider
input
output
latency
tokens
cost
```

---

# 58. AI Observability

Toda chamada relevante de IA deve gerar telemetry.

Métricas:

```text
model
provider
input_tokens
output_tokens
total_tokens
latency
estimated_cost
status
error
```

Traces devem correlacionar:

```text
HTTP request
 ↓
Service
 ↓
AI call
 ↓
External provider
```

---

# 59. AI Guardrails

Implementar guardrails quando necessário:

```text
input validation
output validation
content filtering
PII detection
prompt injection protection
tool authorization
maximum tokens
maximum cost
timeout
retry limits
```

Não confiar exclusivamente no LLM para segurança.

---

# 60. RAG

Quando houver conhecimento privado:

```text
Document
 ↓
Parser
 ↓
Chunking
 ↓
Embedding
 ↓
Vector Store
 ↓
Retrieval
 ↓
LLM
```

Preferência inicial:

```text
PostgreSQL
+
pgvector
```

quando o volume e os requisitos permitirem.

---

# 61. RAG Security

RAG deve respeitar autorização.

Nunca executar:

```text
search(query)
```

sem considerar o contexto de acesso.

Preferir:

```text
search(
    query,
    tenant_id,
    user_id,
    permissions
)
```

A recuperação de documentos deve ser permission-aware.

---

# 62. Streaming

Para AI/chat endpoints, suportar quando necessário:

```text
StreamingResponse
SSE
```

Exemplo:

```text
POST /api/v1/ai/chat
```

Response:

```text
event: token
data: ...

event: token
data: ...

event: done
data: ...
```

---

# 63. AI Cost Controls

Implementar:

```text
per-user limits
per-tenant limits
per-model limits
daily budgets
monthly budgets
token limits
```

Exemplo:

```text
Tenant A
  ↓
$100/month AI budget
```

---

# 64. AI Evaluation

IA em produção deve possuir avaliação.

Criar estrutura:

```text
tests/
└── ai/
    ├── datasets/
    ├── evaluations/
    ├── regression/
    └── quality/
```

Medir:

```text
accuracy
precision
recall
structured-output validity
hallucination rate
latency
cost
```

---

# 65. Testing Strategy

Utilizar:

```text
pytest
pytest-asyncio
httpx
```

Camadas:

```text
Unit
Integration
API
Security
Database
AI
End-to-End
```

---

# 66. Unit Tests

Testar:

- domain services;
- business rules;
- validators;
- policies;
- utility functions;
- AI parsers;
- authorization rules.

Sem depender de banco real.

---

# 67. Integration Tests

Testar:

```text
FastAPI
+
PostgreSQL
+
Redis
+
external integrations
```

Preferir containers efêmeros quando possível.

---

# 68. API Tests

Testar:

```text
HTTP status
response schema
authentication
authorization
validation
pagination
errors
headers
```

Toda rota crítica deve possuir cobertura automatizada.

---

# 69. Security Tests

Testar obrigatoriamente:

```text
unauthenticated access
invalid JWT
expired JWT
revoked token
insufficient permission
tenant isolation
IDOR
rate limiting
mass assignment
SQL injection
path traversal
file upload abuse
```

---

# 70. Dependency Management

Preferência por:

```text
uv
```

ou ferramenta equivalente moderna.

Lockfile obrigatório.

Dependências devem ser:

- versionadas;
- auditadas;
- atualizadas regularmente;
- removidas quando não utilizadas.

---

# 71. Code Quality

Utilizar:

```text
Ruff
Pyright ou mypy
pytest
pre-commit
```

Quality gates:

```text
lint
format
type check
unit tests
integration tests
security checks
```

---

# 72. Static Security

Adicionar ao CI:

```text
Bandit
pip-audit
Semgrep quando aplicável
dependency vulnerability scanning
secret scanning
```

Nenhuma credencial deve entrar no Git.

---

# 73. Containerization

Produção deve utilizar container.

Imagem:

```text
Python slim
```

Princípios:

- non-root user;
- minimal packages;
- immutable image;
- healthcheck;
- multi-stage build quando necessário;
- pinned dependencies;
- no secrets in image.

---

# 74. Docker

Estrutura:

```text
Dockerfile
docker-compose.yml
.env.example
```

Desenvolvimento local deve permitir:

```text
API
PostgreSQL
Redis
```

subirem de forma reproduzível.

---

# 75. CI/CD

Pipeline mínimo:

```text
Commit
 ↓
Lint
 ↓
Format Check
 ↓
Type Check
 ↓
Unit Tests
 ↓
Integration Tests
 ↓
Security Scan
 ↓
Build
 ↓
Container Scan
 ↓
Deploy
 ↓
Health Check
```

---

# 76. Deployment

Aplicação deve ser stateless.

Não armazenar estado crítico em:

```text
local filesystem
process memory
```

Estado deve permanecer em:

```text
PostgreSQL
Redis
Object Storage
external services
```

Isso permite horizontal scaling.

---

# 77. Graceful Shutdown

Implementar FastAPI lifespan.

No shutdown:

```text
stop accepting requests
 ↓
finish active work
 ↓
close HTTP clients
 ↓
close Redis
 ↓
close database connections
 ↓
shutdown
```

---

# 78. Timeouts

Todo recurso externo deve possuir timeout explícito.

Exemplo:

```text
HTTP timeout
DB timeout
AI timeout
Redis timeout
job timeout
```

Nunca depender de timeout infinito.

---

# 79. Retries

Retry deve utilizar:

```text
exponential backoff
jitter
maximum attempts
```

Somente para erros transitórios.

Nunca fazer retry cego de:

```text
400
401
403
404
validation errors
```

---

# 80. Circuit Breaker

Para integrações críticas e instáveis, considerar circuit breaker.

Estado:

```text
CLOSED
 ↓ failure threshold
OPEN
 ↓ timeout
HALF_OPEN
 ↓
CLOSED
```

---

# 81. Pagination & Large Data

Nunca carregar grandes datasets integralmente em memória.

Preferir:

```text
pagination
streaming
batch processing
cursor iteration
```

Para exports:

```text
request
 ↓
create job
 ↓
process async
 ↓
store file
 ↓
return download URL
```

---

# 82. Database Performance

Obrigatório avaliar:

- indexes;
- query plans;
- N+1;
- eager loading;
- pagination;
- connection pool;
- transaction duration;
- locks.

Não adicionar índices indiscriminadamente.

Cada índice deve ter justificativa de acesso.

---

# 83. N+1 Prevention

Queries devem ser analisadas para evitar:

```text
1 query users
+
N queries relationships
```

Utilizar estratégias adequadas do SQLAlchemy.

---

# 84. Domain Layer

Regras de negócio importantes devem estar fora dos routers.

Exemplo:

```text
router
 ↓
service
 ↓
domain policy
 ↓
repository
```

O domínio deve ser testável sem HTTP.

---

# 85. Repository Pattern

Não obrigar Repository Pattern para toda tabela.

Utilizar quando ele realmente melhorar:

- testability;
- abstração;
- complexidade;
- domínio;
- múltiplas fontes.

Evitar criar abstrações artificiais como:

```text
GenericRepository[T]
```

para operações triviais.

---

# 86. External Integrations

Cada integração externa deve possuir seu próprio adapter.

Exemplo:

```text
integrations/
├── slack/
├── google/
├── github/
├── payments/
└── payroll/
```

O domínio não deve conhecer detalhes do SDK externo.

---

# 87. Adapter Pattern

Exemplo:

```text
Domain
 ↓
NotificationService
 ↓
NotificationProvider
 ├── SlackProvider
 ├── EmailProvider
 └── TeamsProvider
```

---

# 88. Feature Flags

Suportar feature flags quando necessário.

Exemplo:

```text
AI_COPILOT_ENABLED
NEW_REPORT_ENGINE
BETA_API
```

Não utilizar environment variables como substituto universal de feature flag.

---

# 89. API Deprecation

Endpoints deprecated devem possuir:

```text
deprecated=true
```

no OpenAPI quando apropriado.

Documentar:

```text
deprecated_at
sunset_at
replacement
```

---

# 90. Documentation

O backend deve possuir:

```text
README.md
ARCHITECTURE.md
SECURITY.md
API.md
DEVELOPMENT.md
DEPLOYMENT.md
AI.md
```

OpenAPI continua sendo a fonte técnica da API.

---

# 91. Developer Experience

Comandos padrão:

```bash
make dev
make test
make lint
make format
make typecheck
make migration
make migrate
make seed
make security
```

Ou equivalente via `uv`.

Um novo desenvolvedor deve conseguir executar o backend com o mínimo de configuração manual.

---

# 92. Seed Data

Ambiente de desenvolvimento deve possuir seeds controlados.

Exemplo:

```text
Admin
User
Demo Tenant
Demo Permissions
Demo Data
```

Nunca utilizar credenciais de produção nos seeds.

---

# 93. Environment Strategy

Ambientes:

```text
local
development
staging
production
```

Configuração deve ser externalizada.

Nunca depender de:

```text
if environment == "production"
```

para regras de negócio.

---

# 94. Secrets

Secrets devem ser armazenados em:

```text
Secret Manager
Vault
Cloud Secret Manager
environment injection
```

Nunca:

```text
Git
Dockerfile
database plaintext
logs
OpenAPI examples
```

---

# 95. API Security Model

Modelo completo:

```text
                    Request
                       │
                       ▼
                ┌─────────────┐
                │ Rate Limit  │
                └──────┬──────┘
                       ▼
                ┌─────────────┐
                │   AuthN     │
                └──────┬──────┘
                       ▼
                ┌─────────────┐
                │   AuthZ     │
                └──────┬──────┘
                       ▼
                ┌─────────────┐
                │ Validation  │
                └──────┬──────┘
                       ▼
                ┌─────────────┐
                │ Application │
                │   Service   │
                └──────┬──────┘
                       ▼
                ┌─────────────┐
                │   Domain    │
                └──────┬──────┘
                       ▼
                ┌─────────────┐
                │ Persistence │
                └─────────────┘
```

---

# 96. AI Security Model

Para IA:

```text
User
 ↓
Authentication
 ↓
Authorization
 ↓
Input Validation
 ↓
Prompt Construction
 ↓
AI Gateway
 ↓
LLM
 ↓
Output Validation
 ↓
Tool Authorization
 ↓
Response
```

A IA nunca deve receber privilégios superiores aos do usuário.

---

# 97. API Gateway Compatibility

O backend deve ser compatível com:

```text
API Gateway
Reverse Proxy
Load Balancer
Ingress
Service Mesh
```

Headers de tracing e request correlation devem ser preservados.

---

# 98. Scalability

A aplicação deve ser horizontalmente escalável.

```text
                Load Balancer
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      API 1        API 2        API 3
        │            │            │
        └────────────┼────────────┘
                     │
              PostgreSQL
                     │
                   Redis
```

Nenhuma instância deve depender de estado local.

---

# 99. Recommended Libraries

## Mandatory / Foundation

```text
fastapi
uvicorn
pydantic
pydantic-settings
sqlalchemy
asyncpg
alembic
pyjwt
pwdlib
httpx
```

## Development

```text
pytest
pytest-asyncio
ruff
pyright
pre-commit
```

## Security

```text
cryptography
bandit
pip-audit
semgrep
```

## Observability

```text
opentelemetry-api
opentelemetry-sdk
opentelemetry-instrumentation-fastapi
opentelemetry-instrumentation-httpx
opentelemetry-instrumentation-sqlalchemy
```

## Infrastructure

```text
redis
```

e, quando necessário:

```text
celery
```

ou:

```text
arq
```

## AI

Base:

```text
openai
anthropic
```

Abstração multi-provider:

```text
litellm
```

Structured outputs:

```text
instructor
```

RAG:

```text
pgvector
```

quando aplicável.

---

# 100. Biblioteca Selection Rule

Não adicionar uma biblioteca simplesmente porque ela existe.

Toda dependência deve responder:

```text
Qual problema ela resolve?
Por que não podemos usar a stdlib?
Por que não podemos utilizar FastAPI/Pydantic/SQLAlchemy?
Qual o custo operacional?
Qual a maturidade?
Qual a licença?
Qual o risco de vendor lock-in?
```

Preferir poucas dependências de alta qualidade.

---

# 101. Anti-Patterns

Não utilizar:

```text
God Router
God Service
God Repository
GenericRepository everywhere
Global database session
Global mutable state
Business logic inside Pydantic schemas
Business logic inside routers
Raw SQL concatenation
Secrets in source code
Unbounded queries
Unbounded AI calls
Unbounded file uploads
Infinite retries
Infinite timeouts
Wildcard CORS in production
JWT with sensitive information
AI tools without authorization
Direct LLM calls from controllers
```

---

# 102. Definition of Done

Uma nova feature backend somente estará pronta quando:

### API

- [ ] Endpoint implementado
- [ ] OpenAPI atualizado
- [ ] Request schema
- [ ] Response schema
- [ ] HTTP status correto
- [ ] Error handling
- [ ] Pagination quando aplicável

### Security

- [ ] Authentication
- [ ] Authorization
- [ ] Input validation
- [ ] Rate limit quando necessário
- [ ] Audit quando necessário
- [ ] Secrets protegidos

### Database

- [ ] SQLAlchemy model
- [ ] Migration
- [ ] Indexes avaliados
- [ ] Transaction strategy
- [ ] Query performance avaliada

### Tests

- [ ] Unit tests
- [ ] API tests
- [ ] Integration tests
- [ ] Security tests
- [ ] AI tests quando aplicável

### Observability

- [ ] Logs
- [ ] Metrics
- [ ] Trace
- [ ] Request ID
- [ ] Error correlation

### AI

Quando aplicável:

- [ ] Provider abstraction
- [ ] Structured output
- [ ] Prompt versioning
- [ ] Token tracking
- [ ] Cost tracking
- [ ] Guardrails
- [ ] Authorization
- [ ] Evaluation

---

# 103. Target Architecture

A arquitetura final esperada:

```text
                         ┌──────────────────────┐
                         │      Frontend        │
                         │ React / Mobile / etc │
                         └──────────┬───────────┘
                                    │
                              HTTPS / OpenAPI
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      FastAPI         │
                         │       API Layer      │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
                AuthN/AuthZ      Services          AI
                    │               │               │
                    │               │        ┌──────┴──────┐
                    │               │        │ AI Gateway  │
                    │               │        │ LiteLLM     │
                    │               │        └──────┬──────┘
                    │               │               │
                    │               │          LLM Providers
                    │               │
                    ▼               ▼
                Security         Domain
                                    │
                       ┌────────────┼────────────┐
                       │            │            │
                       ▼            ▼            ▼
                  PostgreSQL      Redis      External APIs
                       │
                  SQLAlchemy
                       │
                    Alembic

             ┌───────────────────────────────┐
             │       Observability           │
             │ OpenTelemetry / Logs / Metrics│
             │ Traces / AI Telemetry         │
             └───────────────────────────────┘
```

---

# 104. Foundation Goal

O objetivo do Loft Backend Foundation não é criar um boilerplate gigantesco.

O objetivo é estabelecer uma plataforma mínima, porém completa, capaz de crescer de:

```text
Simple CRUD API
```

para:

```text
Enterprise API
        +
Authentication
        +
RBAC
        +
Multi-Tenant
        +
Async Jobs
        +
External Integrations
        +
Observability
        +
AI
        +
RAG
        +
Agents
```

sem precisar reescrever a arquitetura.

---

# 105. Golden Path

Todo novo backend deve seguir inicialmente:

```text
1. FastAPI
2. Pydantic
3. SQLAlchemy
4. PostgreSQL
5. Alembic
6. Authentication
7. Authorization
8. OpenAPI
9. Structured Logging
10. OpenTelemetry
11. Tests
12. CI/CD
```

Adicionar somente quando houver necessidade:

```text
Redis
Background Jobs
API Keys
Webhooks
RAG
LiteLLM
Agents
Vector Search
Caching
Feature Flags
Event Bus
```

A Foundation deve permanecer pequena; a arquitetura deve ser capaz de crescer sem ser obrigada a carregar complexidade que o produto ainda não necessita.