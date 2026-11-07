# Loft Backend API Specification

## Volume IV — Backend API Specification (BAS)

**Status:** Foundation  
**Version:** 1.0  
**Parent Standard:** Loft Backend Foundation — Volume I  
**Engineering Standard:** Loft Backend Design & Engineering System — Volume II  
**Component Standard:** Loft Backend Component Catalog — Volume III  
**Framework:** FastAPI  
**API Contract:** OpenAPI  
**Schema Validation:** Pydantic v2  
**Architecture:** API First + AI First

---

# 1. Objetivo

O Loft Backend API Specification — BAS define o padrão oficial para projetar, documentar, implementar, testar e evoluir APIs.

A API deve ser tratada como um **produto e contrato**, e não apenas como uma camada HTTP.

Toda API deve possuir:

```text
Contract
    ↓
Schema
    ↓
Authentication
    ↓
Authorization
    ↓
Validation
    ↓
Business Rules
    ↓
Persistence
    ↓
Observability
    ↓
Documentation
    ↓
Tests
```

---

# 2. API First

Nenhum endpoint significativo deve ser implementado diretamente no código sem antes definir seu contrato.

O fluxo recomendado:

```text
Requirement
    ↓
Resource
    ↓
Endpoint Contract
    ↓
Request Schema
    ↓
Response Schema
    ↓
Auth
    ↓
Permissions
    ↓
Errors
    ↓
OpenAPI
    ↓
Implementation
    ↓
Tests
```

---

# 3. API Contract as Source of Truth

A especificação da API deve ser a fonte de verdade para:

- frontend;
- backend;
- QA;
- documentação;
- SDKs;
- agentes de IA;
- integrações externas.

O código deve implementar o contrato, não redefini-lo implicitamente.

---

# 4. API Design Principles

As APIs Loft devem priorizar:

```text
Predictability
Consistency
Explicitness
Security
Discoverability
Backward Compatibility
Observability
Idempotency
Machine Readability
AI Friendliness
```

---

# 5. REST as Default

REST deve ser o padrão para APIs HTTP de recursos.

Usar:

```text
GET
POST
PUT
PATCH
DELETE
```

quando semanticamente apropriado.

Não utilizar RPC-style endpoints sem justificativa.

Evitar:

```text
POST /getUsers
POST /deleteUser
POST /updateUser
```

Preferir:

```text
GET    /users
DELETE /users/{user_id}
PATCH  /users/{user_id}
```

---

# 6. Resource-Oriented Design

Endpoints devem representar recursos.

Exemplo:

```text
/users
/users/{user_id}

/documents
/documents/{document_id}

/documents/{document_id}/versions
/documents/{document_id}/shares
```

---

# 7. Resource Naming

Resources devem:

- utilizar substantivos;
- utilizar plural;
- utilizar kebab-case quando necessário;
- evitar verbos;
- possuir nomes previsíveis.

Preferir:

```text
/payroll-runs
/payment-methods
/access-policies
```

Evitar:

```text
/getPayrollRuns
/createPaymentMethod
/manageAccess
```

---

# 8. URL Naming

Padrão:

```text
/{resource}
/{resource}/{id}
/{resource}/{id}/{subresource}
```

Exemplo:

```text
/users
/users/{user_id}
/users/{user_id}/sessions
```

---

# 9. API Versioning

APIs públicas devem possuir estratégia explícita de versionamento.

Padrão recomendado:

```text
/api/v1
```

Exemplo:

```text
/api/v1/users
/api/v1/documents
```

---

# 10. Versioning Rules

Uma nova versão deve ser criada quando houver breaking change.

Exemplos de breaking changes:

```text
remove field
rename field
change field type
change semantic meaning
remove endpoint
change required behavior
change authorization contract
```

---

# 11. Non-Breaking Changes

Normalmente não exigem nova versão:

```text
add optional field
add endpoint
add optional query parameter
add response metadata
```

Clientes devem tolerar campos desconhecidos quando apropriado.

---

# 12. HTTP Methods

## GET

Consulta.

Não deve produzir efeitos colaterais.

---

## POST

Criação ou execução de operações não idempotentes.

Exemplo:

```text
POST /documents
POST /reports/generate
```

---

## PUT

Substituição completa de recurso.

Utilizar somente quando a semântica de substituição integral for desejada.

---

## PATCH

Atualização parcial.

Exemplo:

```text
PATCH /users/{user_id}
```

---

## DELETE

Remoção ou desativação semântica do recurso.

---

# 13. HTTP Status Codes

Usar códigos HTTP semanticamente corretos.

| Código | Uso |
|---|---|
| 200 | sucesso |
| 201 | recurso criado |
| 202 | processamento assíncrono |
| 204 | sucesso sem conteúdo |
| 400 | requisição inválida |
| 401 | não autenticado |
| 403 | não autorizado |
| 404 | recurso não encontrado |
| 409 | conflito |
| 422 | erro de validação |
| 429 | rate limit |
| 500 | erro interno |
| 502 | upstream inválido |
| 503 | serviço indisponível |

---

# 14. 200 OK

Utilizar quando a operação foi concluída e possui response body.

```http
GET /users/123
```

---

# 15. 201 Created

Utilizar quando um recurso foi criado.

Preferencialmente retornar:

```text
Location
```

quando aplicável.

---

# 16. 202 Accepted

Utilizar quando o processamento foi aceito, mas ainda não concluído.

Exemplo:

```http
POST /documents/{id}/process
```

Response:

```json
{
  "job_id": "job_123",
  "status": "queued"
}
```

---

# 17. 204 No Content

Utilizar quando não existe conteúdo a retornar.

Exemplo:

```http
DELETE /users/{id}
```

---

# 18. 401 vs 403

### 401

Usuário não autenticado.

### 403

Usuário autenticado, mas sem autorização.

Não confundir autenticação com autorização.

---

# 19. 404 Resource Enumeration

Em operações sensíveis, considerar retornar `404` quando revelar a existência de um recurso não autorizado permitiria enumeration.

Exemplo:

```text
User A tenta acessar Document B
```

Pode retornar:

```text
404 Not Found
```

em vez de:

```text
403 Forbidden
```

quando a política de segurança determinar.

---

# 20. Request Schema

Toda entrada estruturada deve possuir schema Pydantic.

Exemplo:

```python
class CreateUserRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
```

Não utilizar `dict` genérico quando um contrato explícito for possível.

---

# 21. Response Schema

Toda resposta significativa deve possuir schema explícito.

Exemplo:

```python
class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    created_at: datetime
```

---

# 22. Schema Separation

Separar:

```text
CreateSchema
UpdateSchema
ResponseSchema
ListSchema
FilterSchema
```

quando suas responsabilidades forem diferentes.

Não utilizar um único schema universal para tudo.

---

# 23. Create Schema

Representa dados necessários para criação.

Exemplo:

```text
CreateUserRequest
```

Não deve conter campos controlados pelo servidor:

```text
id
created_at
updated_at
```

---

# 24. Update Schema

Representa campos modificáveis.

Exemplo:

```python
class UpdateUserRequest(BaseModel):
    name: str | None = None
```

Campos imutáveis não devem ser aceitos.

---

# 25. Response Schema

Pode conter:

```text
id
timestamps
computed fields
links
metadata
```

que não fazem parte da entrada.

---

# 26. Schema Validation

Validação deve ocorrer em camadas:

```text
HTTP Validation
        ↓
Schema Validation
        ↓
Business Validation
        ↓
Persistence Constraints
```

Pydantic não substitui regras de negócio.

---

# 27. Pydantic Rules

Utilizar Pydantic para:

- validação;
- serialização;
- documentação;
- parsing;
- structured output.

Evitar lógica de negócio complexa dentro de schemas.

---

# 28. Field Naming

Padrão:

```text
snake_case
```

Exemplo:

```json
{
  "created_at": "...",
  "updated_at": "..."
}
```

---

# 29. IDs

IDs devem possuir formato consistente.

Exemplo:

```text
UUID
ULID
```

Não misturar formatos arbitrariamente.

---

# 30. Timestamps

Utilizar ISO 8601.

Exemplo:

```json
{
  "created_at": "2026-08-25T18:30:00Z"
}
```

Preferir UTC no backend.

---

# 31. Nullable vs Optional

Diferenciar:

```text
optional
```

de:

```text
nullable
```

Exemplo:

```python
description: str | None
```

não significa automaticamente que o campo pode ser omitido.

O contrato deve deixar essa semântica explícita.

---

# 32. Pagination

List endpoints devem utilizar paginação quando o dataset puder crescer significativamente.

Padrão:

```text
?page=1&page_size=20
```

ou cursor pagination quando apropriado.

---

# 33. Pagination Limits

Nunca permitir:

```text
?page_size=1000000
```

Definir limite máximo.

Exemplo:

```text
default = 20
maximum = 100
```

---

# 34. Paginated Response

Padrão:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 135,
    "has_next": true,
    "has_previous": false
  }
}
```

---

# 35. Cursor Pagination

Para grandes datasets:

```text
GET /events?cursor=abc&page_size=50
```

Response:

```json
{
  "data": [],
  "meta": {
    "next_cursor": "xyz",
    "has_next": true
  }
}
```

---

# 36. Filtering

Filtros devem ser explicitamente documentados.

Exemplo:

```text
GET /users?status=active&role=admin
```

Não permitir filtros arbitrários diretamente em SQL.

---

# 37. Sorting

Padrão:

```text
?sort=created_at
```

Descendente:

```text
?sort=-created_at
```

Múltiplos:

```text
?sort=-created_at,name
```

Somente campos permitidos devem ser aceitos.

---

# 38. Search

Quando aplicável:

```text
?q=john
```

Definir:

```text
minimum length
maximum length
searchable fields
normalization
```

---

# 39. Field Selection

Não implementar:

```text
?fields=*
```

sem uma necessidade clara.

Quando houver field selection, possuir whitelist.

---

# 40. Includes / Expansion

Evitar N+1 APIs como:

```text
GET /users
GET /users/{id}/profile
GET /users/{id}/permissions
```

para cada item.

Quando necessário, considerar:

```text
?include=profile,permissions
```

com limites claros.

---

# 41. Authentication

Toda rota deve declarar explicitamente seu modelo de autenticação.

Exemplo:

```text
Authentication:
Bearer JWT
```

ou:

```text
Authentication:
API Key
```

ou:

```text
Authentication:
OAuth2
```

---

# 42. Public Endpoints

Endpoints públicos devem ser explicitamente marcados como públicos.

Exemplo:

```text
GET /health
GET /public/config
```

Não assumir que uma rota é pública por ausência de dependency.

---

# 43. Authentication Dependency

Rotas autenticadas devem utilizar dependency padrão.

Exemplo:

```python
current_user = Depends(get_current_user)
```

Não implementar autenticação manual em cada router.

---

# 44. Authorization

Autenticação não é autorização.

Toda operação protegida deve definir:

```text
Authentication
+
Authorization
+
Resource Access
```

quando aplicável.

---

# 45. Permission Declaration

Permissões devem ser declaradas de forma explícita.

Exemplo:

```text
users:read
users:create
users:update
users:delete
```

---

# 46. Ownership

Quando um recurso possui owner:

```text
owner_id
```

a especificação deve indicar se:

```text
owner
admin
tenant admin
```

podem acessá-lo.

---

# 47. Tenant Isolation

Em sistemas multi-tenant:

```text
tenant_id
```

não deve ser considerado confiável somente porque veio do request.

O backend deve derivar ou validar o tenant pelo contexto autenticado.

---

# 48. API Keys

Quando API Keys forem utilizadas, especificar:

```text
key type
scope
expiration
rotation
revocation
rate limit
permissions
```

---

# 49. Idempotency

Operações que podem ser repetidas devem declarar se são idempotentes.

Para operações críticas, suportar:

```http
Idempotency-Key: <unique-key>
```

---

# 50. Idempotency-Key

A chave deve ser:

```text
unique
opaque
client-generated
```

---

# 51. Idempotency Storage

O backend deve armazenar:

```text
idempotency_key
request_hash
status
response
created_at
expires_at
```

quando necessário.

---

# 52. Idempotency Conflict

Se a mesma chave for reutilizada com payload diferente:

```text
409 Conflict
```

ou outro comportamento explicitamente definido.

---

# 53. Idempotent Operations

Normalmente:

```text
GET
PUT
DELETE
```

possuem semântica idempotente.

`POST` não deve ser considerado idempotente automaticamente.

---

# 54. Conditional Requests

Quando necessário, utilizar:

```text
ETag
If-Match
If-None-Match
```

para controle de concorrência e cache.

---

# 55. Optimistic Concurrency

Recursos sujeitos a edição concorrente podem utilizar:

```text
version
updated_at
ETag
```

---

# 56. Response Envelope

Não criar envelopes desnecessários.

Preferir:

```json
{
  "id": "123",
  "name": "John"
}
```

em vez de:

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John"
  }
}
```

quando não houver necessidade arquitetural.

---

# 57. Collection Response

Para listas, utilizar:

```json
{
  "data": [],
  "meta": {}
}
```

quando metadata de paginação for necessária.

---

# 58. Error Contract

Todos os erros devem possuir formato consistente.

Padrão:

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found",
    "details": {},
    "request_id": "req_123"
  }
}
```

---

# 59. Error Code

`code` deve ser estável e machine-readable.

Exemplos:

```text
USER_NOT_FOUND
INVALID_CREDENTIALS
PERMISSION_DENIED
RESOURCE_CONFLICT
VALIDATION_ERROR
RATE_LIMIT_EXCEEDED
```

---

# 60. Error Message

`message` deve ser:

```text
human-readable
safe
concise
```

Nunca incluir:

```text
stack trace
SQL query
secret
token
internal path
```

---

# 61. Error Details

`details` pode conter informações estruturadas.

Exemplo:

```json
{
  "field": "email",
  "reason": "already_exists"
}
```

Não expor informações sensíveis.

---

# 62. Request ID

Toda resposta deve possuir ou estar associada a:

```text
request_id
```

para troubleshooting.

---

# 63. Validation Error

Exemplo:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "fields": [
        {
          "field": "email",
          "reason": "invalid_format"
        }
      ]
    },
    "request_id": "req_123"
  }
}
```

---

# 64. API Headers

Headers relevantes devem ser documentados.

Exemplos:

```text
Authorization
Content-Type
Accept
Idempotency-Key
X-Request-ID
If-Match
```

---

# 65. Content-Type

JSON:

```text
application/json
```

Upload:

```text
multipart/form-data
```

quando necessário.

---

# 66. Compression

A infraestrutura pode suportar:

```text
gzip
br
```

quando apropriado.

Não implementar compressão manualmente no endpoint.

---

# 67. File Upload API

Uploads devem especificar:

```text
content type
max size
allowed formats
authentication
authorization
storage behavior
validation
virus scanning
```

---

# 68. Large File Upload

Para arquivos grandes, preferir:

```text
presigned URL
multipart upload
async processing
```

em vez de manter a conexão HTTP aberta durante todo o processamento.

---

# 69. Async Processing

Operações longas devem retornar:

```http
202 Accepted
```

com identificador de job.

Exemplo:

```json
{
  "job_id": "job_123",
  "status": "queued",
  "status_url": "/api/v1/jobs/job_123"
}
```

---

# 70. Job Status

Endpoint:

```text
GET /jobs/{job_id}
```

Resposta:

```json
{
  "id": "job_123",
  "status": "running",
  "progress": 45
}
```

Estados recomendados:

```text
queued
running
completed
failed
cancelled
```

---

# 71. Long-Running Requests

Evitar requests HTTP longos para:

```text
AI processing
large file processing
bulk imports
reports
data exports
```

quando o processamento puder ser assíncrono.

---

# 72. Bulk Operations

Operações em lote devem ser explicitamente projetadas.

Exemplo:

```text
POST /users/bulk
```

Definir:

```text
maximum items
partial success
transaction behavior
idempotency
error model
```

---

# 73. Bulk Response

Exemplo:

```json
{
  "accepted": 95,
  "rejected": 5,
  "errors": []
}
```

---

# 74. Transactions

A especificação deve declarar quando uma operação possui comportamento transacional.

Exemplo:

```text
Create Order
+
Create Payment
+
Create Audit
```

deve definir claramente:

```text
atomic
partial
async
```

---

# 75. Consistency

Para operações distribuídas, especificar:

```text
strong consistency
eventual consistency
read-after-write
```

quando isso for relevante para o consumidor.

---

# 76. Eventual Consistency

Quando uma operação disparar processamento assíncrono:

```text
POST /documents
```

a resposta não deve implicar que todos os processos derivados terminaram.

---

# 77. Webhooks

Webhooks devem especificar:

```text
event
payload
signature
retry
idempotency
delivery semantics
```

---

# 78. Webhook Security

Webhook consumers devem validar:

```text
signature
timestamp
replay
event_id
```

quando suportado pelo provider.

---

# 79. API Rate Limiting

Toda API deve possuir política de rate limiting apropriada.

A especificação deve definir:

```text
limit
window
scope
response
```

---

# 80. Rate Limit Response

Utilizar:

```http
429 Too Many Requests
```

quando o limite for excedido.

Quando aplicável:

```http
Retry-After
```

---

# 81. API Quotas

Rate limit e quota são conceitos diferentes.

Rate limit:

```text
requests / time
```

Quota:

```text
resources / period
```

Exemplo:

```text
100 API calls/minute
10,000 AI tokens/day
```

---

# 82. API Security

Cada endpoint deve ser avaliado contra:

```text
Authentication
Authorization
Input Validation
Resource Ownership
Tenant Isolation
Rate Limiting
Data Exposure
Injection
Enumeration
Abuse
```

---

# 83. OWASP API Security

A especificação deve considerar especialmente:

```text
Broken Object Level Authorization
Broken Authentication
Broken Object Property Level Authorization
Unrestricted Resource Consumption
Broken Function Level Authorization
Unrestricted Access to Sensitive Business Flows
Server Side Request Forgery
Security Misconfiguration
Improper Inventory Management
Unsafe Consumption of APIs
```

---

# 84. Sensitive Fields

Endpoints devem declarar campos sensíveis.

Exemplos:

```text
password
token
secret
api_key
tax identifiers
financial information
```

Esses campos não devem aparecer inadvertidamente em responses ou logs.

---

# 85. Mass Assignment Protection

Não permitir que o cliente atualize campos administrativos simplesmente adicionando propriedades ao JSON.

Exemplo perigoso:

```json
{
  "name": "John",
  "is_admin": true
}
```

se `is_admin` não fizer parte do contrato de atualização.

---

# 86. SSRF Protection

Endpoints que recebem URLs devem definir:

```text
allowed protocols
allowed hosts
private network policy
redirect policy
DNS validation
```

---

# 87. External URL Fetching

Não permitir arbitrariamente:

```text
POST /import
{
  "url": "http://internal-service"
}
```

sem validação e proteção contra SSRF.

---

# 88. API Observability

Cada endpoint deve permitir observar:

```text
request_count
latency
status_code
error_rate
```

e, quando relevante:

```text
database_latency
external_latency
AI_latency
queue_latency
```

---

# 89. Trace Propagation

Quando houver integração distribuída, propagar:

```text
trace_id
request_id
```

---

# 90. Logging

Não registrar:

```text
password
JWT
API keys
secrets
full sensitive payloads
```

---

# 91. API Metrics

Métricas mínimas:

```text
http_requests_total
http_request_duration
http_errors_total
```

com labels controladas.

Evitar cardinalidade explosiva.

---

# 92. OpenAPI

FastAPI deve gerar OpenAPI automaticamente.

A especificação deve ser tratada como artefato oficial.

Endpoints devem possuir:

```text
summary
description
tags
parameters
request body
responses
security
examples
```

---

# 93. Swagger UI

Swagger UI deve estar disponível nos ambientes apropriados.

Exemplo:

```text
/docs
```

---

# 94. ReDoc

ReDoc pode ser disponibilizado:

```text
/redoc
```

quando desejado.

---

# 95. Production Documentation

Ambientes produtivos devem possuir política explícita sobre:

```text
Swagger availability
OpenAPI availability
authentication requirements
public exposure
```

Não expor documentação administrativa sem necessidade.

---

# 96. OpenAPI Tags

Endpoints devem ser organizados por domínio.

Exemplo:

```text
Users
Documents
Authentication
Reports
Payroll
AI
Administration
```

---

# 97. Endpoint Documentation

Todo endpoint deve possuir:

```text
summary
description
auth requirement
permission
request schema
response schema
errors
examples
```

---

# 98. API Examples

Exemplos devem ser fornecidos para endpoints importantes.

Exemplo:

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

# 99. API Specification Template

Cada endpoint deve ser especificado utilizando:

```text
Endpoint
Method
Resource
Purpose
Authentication
Authorization
Request
Query Parameters
Path Parameters
Headers
Response
Errors
Pagination
Idempotency
Rate Limit
Side Effects
Observability
Examples
```

---

# 100. BAS Endpoint Template

```yaml
endpoint:
  name: Create User
  method: POST
  path: /api/v1/users

purpose:
  description: Creates a new user.

authentication:
  required: true
  mechanism: bearer_jwt

authorization:
  permissions:
    - users:create

request:
  headers:
    - name: Authorization
      required: true

  body:
    schema: CreateUserRequest

response:
  status: 201
  schema: UserResponse

errors:
  - 400
  - 401
  - 403
  - 409
  - 422
  - 500

idempotency:
  supported: true
  header: Idempotency-Key

rate_limit:
  policy: standard_write

observability:
  audit: true
  metrics: true
  tracing: true
```

---

# 101. Endpoint Naming

Cada endpoint deve possuir um nome lógico.

Exemplo:

```text
CreateUser
GetUser
ListUsers
UpdateUser
DeleteUser
```

Isso facilita:

```text
documentation
testing
AI generation
SDK generation
```

---

# 102. CRUD Standard

Quando um resource possui CRUD completo:

```text
POST   /users
GET    /users
GET    /users/{id}
PATCH  /users/{id}
DELETE /users/{id}
```

---

# 103. Action Endpoints

Ações são permitidas quando não representam CRUD puro.

Exemplos:

```text
POST /documents/{id}/publish
POST /documents/{id}/archive
POST /reports/{id}/generate
POST /users/{id}/reset-password
```

---

# 104. Action Rules

Actions devem:

- utilizar verbos claros;
- possuir semântica explícita;
- definir idempotência;
- definir autorização;
- definir side effects.

---

# 105. State Transitions

Quando um recurso possui lifecycle:

```text
draft
published
archived
```

as transições devem ser explicitamente documentadas.

---

# 106. Invalid State Transition

Retornar:

```text
409 Conflict
```

quando uma operação não for permitida pelo estado atual.

---

# 107. API Side Effects

Toda especificação deve indicar efeitos colaterais relevantes.

Exemplo:

```text
POST /users
```

pode:

```text
create user
create audit
send invitation
publish event
```

---

# 108. Side Effect Classification

Classificar:

```text
SYNC
ASYNC
EXTERNAL
IRREVERSIBLE
```

---

# 109. Dangerous Operations

Operações destrutivas devem possuir:

```text
explicit authorization
audit
idempotency where possible
confirmation mechanism when appropriate
```

---

# 110. Soft Delete

Quando utilizado:

```text
deleted_at
```

deve ser consistente entre endpoints.

Definir:

```text
include_deleted
restore
permanent_delete
```

quando aplicável.

---

# 111. DELETE Semantics

Documentar se:

```text
DELETE
```

significa:

```text
soft delete
hard delete
deactivation
revocation
```

---

# 112. API Searchability

Endpoints devem ser facilmente descobertos através de:

```text
OpenAPI
tags
operationId
schemas
examples
```

---

# 113. operationId

Todo endpoint deve possuir `operationId` estável.

Exemplo:

```text
createUser
getUser
listUsers
updateUser
deleteUser
```

Não alterar sem necessidade.

---

# 114. SDK Compatibility

Quando SDKs forem gerados a partir de OpenAPI, schemas e operation IDs devem permanecer estáveis.

---

# 115. API Contract Testing

O contrato deve ser testado.

Validar:

```text
request schema
response schema
status codes
headers
errors
authentication
authorization
```

---

# 116. Integration Tests

Endpoints críticos devem possuir testes de integração.

Exemplo:

```text
POST /users
→ database
→ audit
→ response
```

---

# 117. Security Tests

Endpoints protegidos devem testar:

```text
unauthenticated
wrong role
wrong tenant
wrong ownership
expired token
invalid token
```

---

# 118. Negative Tests

Todo endpoint significativo deve possuir testes para:

```text
invalid input
missing resource
unauthorized access
conflict
rate limit
dependency failure
```

---

# 119. Contract Regression

Mudanças no schema devem ser detectadas automaticamente.

CI deve identificar breaking changes quando possível.

---

# 120. API Deprecation

Endpoints deprecated devem possuir:

```text
deprecated
replacement
sunset_date
migration_notes
```

---

# 121. Deprecation Headers

Quando apropriado, utilizar:

```text
Deprecation
Sunset
Link
```

conforme política adotada.

---

# 122. API Compatibility

Mudanças devem priorizar:

```text
backward compatibility
```

quando possível.

---

# 123. Breaking Change Review

Antes de breaking change:

```text
Impact Analysis
Consumer Analysis
Migration Plan
Documentation
Versioning Decision
```

---

# 124. API First + Frontend

Frontend não deve depender de:

```text
database schema
internal ORM models
internal service objects
```

O frontend depende do API contract.

---

# 125. API First + AI

Agentes de IA devem consumir o contrato da API antes de inferir seu comportamento.

A IA deve preferir:

```text
OpenAPI
JSON Schema
Pydantic schemas
```

em vez de inferir formatos pelo código.

---

# 126. AI-Readable API

APIs devem possuir:

```text
clear names
stable schemas
explicit descriptions
examples
machine-readable errors
operationIds
```

---

# 127. AI Action Safety

Quando APIs forem utilizadas por agents, operações devem declarar:

```text
risk_level
required_permission
idempotency
side_effects
confirmation_required
```

---

# 128. AI Tool Mapping

Uma API pode ser exposta como tool.

Exemplo:

```text
POST /documents/{id}/approve
```

pode possuir:

```text
tool:
  name: approve_document
  risk_level: HIGH_RISK_WRITE
  permission: documents:approve
  confirmation_required: true
```

---

# 129. AI Tool Restrictions

Agents não devem receber automaticamente acesso a todos os endpoints.

Tool exposure deve ser explicitamente permitido.

---

# 130. AI API Consumption

Para endpoints destinados a agents, especificar:

```text
human_allowed
agent_allowed
agent_scope
tool_allowed
```

quando necessário.

---

# 131. API Rate Limits for AI

AI endpoints podem possuir limites específicos:

```text
requests/minute
tokens/minute
tokens/day
cost/day
```

---

# 132. AI Cost Control

Quando aplicável, a API deve permitir associar:

```text
user
tenant
feature
request
model
provider
```

ao consumo de IA.

---

# 133. API Gateway

Quando existir API Gateway, responsabilidades devem ser separadas:

```text
Gateway
├── TLS
├── routing
├── rate limiting
├── WAF
└── authentication edge checks

Application
├── authorization
├── business rules
├── persistence
└── domain logic
```

O gateway não deve substituir autorização de domínio.

---

# 134. CORS

CORS deve ser configurado explicitamente.

Nunca:

```text
allow_origins=["*"]
```

para aplicações autenticadas sem uma justificativa clara.

---

# 135. Security Headers

Quando aplicável:

```text
X-Content-Type-Options
Content-Security-Policy
Strict-Transport-Security
Referrer-Policy
```

devem ser configurados na camada apropriada.

---

# 136. API Timeout

Toda integração externa deve possuir timeout.

Endpoints também devem possuir limites operacionais apropriados.

Nunca depender de timeout infinito.

---

# 137. Retry

Retries devem existir somente para operações consideradas retryable.

Nunca repetir automaticamente:

```text
non-idempotent mutation
```

sem estratégia de idempotência.

---

# 138. External Failure

Quando uma dependência externa falhar:

```text
502
503
504
```

podem ser utilizados conforme a natureza da falha.

Nunca retornar detalhes internos do provider.

---

# 139. API Dependency Failure

O contrato deve indicar quais dependências podem gerar:

```text
degraded mode
failure
async fallback
```

quando relevante.

---

# 140. API Performance

Endpoints devem possuir metas de performance quando necessário.

Exemplo:

```text
p95 < 300ms
p99 < 1s
```

Não estabelecer metas arbitrárias; devem ser definidas pelo domínio.

---

# 141. N+1 Prevention

Endpoints que retornam collections devem avaliar:

```text
database queries
joins
selectinload
batch loading
```

---

# 142. Response Size

Responses devem evitar payloads excessivamente grandes.

Utilizar:

```text
pagination
field selection
async export
```

quando apropriado.

---

# 143. Export APIs

Exports grandes devem preferir:

```text
POST /exports
```

seguido por:

```text
GET /exports/{id}
```

e download posterior.

---

# 144. API Caching

GET endpoints podem utilizar:

```text
Cache-Control
ETag
Last-Modified
```

quando apropriado.

---

# 145. Cache Semantics

Nunca assumir que cache é seguro para dados:

```text
personal
tenant-specific
sensitive
authorization-dependent
```

sem política adequada.

---

# 146. Multi-Tenant API

Todo endpoint tenant-aware deve definir:

```text
tenant source
tenant validation
tenant isolation
cross-tenant access
```

---

# 147. Tenant Context

Preferir obter tenant através de:

```text
authenticated context
token claims
membership
```

em vez de confiar somente em:

```text
X-Tenant-ID
```

fornecido pelo cliente.

---

# 148. Admin APIs

Endpoints administrativos devem possuir:

```text
strong authorization
audit
stricter rate limits
additional observability
```

quando apropriado.

---

# 149. Internal APIs

Mesmo APIs internas devem possuir autenticação e autorização apropriadas.

"Internal network" não deve ser considerado uma fronteira de segurança suficiente.

---

# 150. Service-to-Service APIs

Podem utilizar:

```text
OAuth2 client credentials
mTLS
signed requests
service identity
```

conforme arquitetura.

---

# 151. API Inventory

Toda aplicação deve manter inventário de:

```text
endpoint
method
owner
version
authentication
permission
status
consumers
```

---

# 152. API Ownership

Cada domínio deve possuir owner técnico.

Exemplo:

```text
/users → Identity
/documents → Documents
/payments → Payments
/ai → AI Platform
```

---

# 153. API Lifecycle

```text
Draft
 ↓
Specified
 ↓
Implemented
 ↓
Tested
 ↓
Released
 ↓
Stable
 ↓
Deprecated
 ↓
Removed
```

---

# 154. Draft API

Pode existir em especificação sem implementação.

Isso permite:

```text
frontend development
mocking
contract review
AI generation
```

antes do backend.

---

# 155. Mock API

A partir do OpenAPI, deve ser possível gerar mocks.

Exemplo:

```text
OpenAPI
 ↓
Mock Server
 ↓
Frontend
```

---

# 156. Contract-Driven Frontend

Frontend pode desenvolver contra:

```text
OpenAPI Mock
```

sem depender da implementação real do backend.

---

# 157. API Review

Antes de implementar um endpoint:

```text
[ ] Resource correto
[ ] HTTP method correto
[ ] Naming correto
[ ] Request schema
[ ] Response schema
[ ] Authentication
[ ] Authorization
[ ] Tenant behavior
[ ] Errors
[ ] Pagination
[ ] Idempotency
[ ] Rate limit
[ ] Side effects
[ ] Observability
[ ] OpenAPI
```

---

# 158. API Implementation Review

Depois da implementação:

```text
[ ] Contract matches code
[ ] OpenAPI generated
[ ] Tests exist
[ ] Security tested
[ ] Errors standardized
[ ] Logging safe
[ ] Metrics available
[ ] Audit implemented
[ ] Idempotency implemented where required
[ ] Documentation complete
```

---

# 159. AI API Implementation Protocol

Agentes de IA devem seguir:

```text
1. Read BAS.
2. Identify endpoint contract.
3. Read Component Catalog.
4. Reuse standard components.
5. Implement schemas first.
6. Implement authorization.
7. Implement service logic.
8. Implement repository logic.
9. Implement router.
10. Generate/update OpenAPI.
11. Generate tests.
12. Run contract validation.
13. Review security.
```

---

# 160. AI Must Not Infer

Agentes não devem inventar:

```text
status codes
permissions
fields
error codes
pagination
authentication
```

quando a BAS já define esses elementos.

---

# 161. API Specification Example

## Create User

```yaml
name: CreateUser

method: POST

path: /api/v1/users

purpose:
  description: Creates a user in the current tenant.

authentication:
  required: true
  scheme: bearer

authorization:
  permissions:
    - users:create

tenant:
  required: true
  source: authenticated_context

request:
  content_type: application/json
  schema: CreateUserRequest

response:
  status: 201
  schema: UserResponse

errors:
  - 401 AUTHENTICATION_REQUIRED
  - 403 PERMISSION_DENIED
  - 409 USER_ALREADY_EXISTS
  - 422 VALIDATION_ERROR

idempotency:
  supported: true
  header: Idempotency-Key

side_effects:
  - create_audit
  - publish_user_created_event
  - send_invitation_async

observability:
  logging: true
  metrics: true
  tracing: true
  audit: true

rate_limit:
  policy: standard_write
```

---

# 162. API Specification Example — List

## List Users

```yaml
name: ListUsers

method: GET

path: /api/v1/users

purpose:
  description: Returns users accessible to the authenticated actor.

authentication:
  required: true

authorization:
  permissions:
    - users:read

query:
  pagination:
    type: offset
    default_page_size: 20
    max_page_size: 100

  filters:
    - status
    - role

  sorting:
    allowed:
      - created_at
      - name
      - email

response:
  status: 200
  schema: PaginatedUserResponse

errors:
  - 401
  - 403

observability:
  metrics: true
  tracing: true
```

---

# 163. API Specification Example — AI

## Generate Document Summary

```yaml
name: GenerateDocumentSummary

method: POST

path: /api/v1/documents/{document_id}/summary

purpose:
  description: Generates an AI-powered summary of a document.

authentication:
  required: true

authorization:
  permissions:
    - documents:read
    - ai:generate

tenant:
  required: true

request:
  schema: GenerateSummaryRequest

response:
  status: 202
  schema: AIJobResponse

processing:
  asynchronous: true

idempotency:
  supported: true

ai:
  provider: gateway
  structured_output: true
  guardrails: true
  usage_tracking: true
  cost_tracking: true

audit:
  enabled: true

rate_limit:
  policy: ai_generation
```

---

# 164. API Specification Example — Sensitive Mutation

## Approve Payroll

```yaml
name: ApprovePayroll

method: POST

path: /api/v1/payroll-runs/{payroll_run_id}/approve

purpose:
  description: Approves a payroll run.

authentication:
  required: true

authorization:
  permissions:
    - payroll:approve

risk:
  level: high

idempotency:
  supported: true

concurrency:
  strategy: optimistic

side_effects:
  - update_payroll_state
  - create_audit
  - publish_payroll_approved_event

audit:
  required: true

response:
  status: 200
  schema: PayrollRunResponse

errors:
  - 401
  - 403
  - 404
  - 409
  - 422
```

---

# 165. BAS Definition of Done

Um endpoint só está completo quando:

```text
[ ] Contract defined
[ ] Resource defined
[ ] HTTP method defined
[ ] Request schema defined
[ ] Response schema defined
[ ] Authentication defined
[ ] Authorization defined
[ ] Tenant behavior defined
[ ] Errors defined
[ ] Pagination defined
[ ] Idempotency evaluated
[ ] Rate limit defined
[ ] Side effects defined
[ ] Observability defined
[ ] Audit evaluated
[ ] OpenAPI generated
[ ] Tests implemented
[ ] Security tests implemented
[ ] Documentation available
```

---

# 166. API Quality Gate

Uma API não deve ser considerada pronta se:

```text
endpoint works
```

mas:

```text
contract is undefined
```

ou:

```text
security is implicit
```

ou:

```text
errors are inconsistent
```

ou:

```text
OpenAPI is inaccurate
```

---

# 167. Golden API Standard

Uma API Loft deve buscar:

```text
Predictable
Typed
Documented
Versioned
Secure
Observable
Testable
Idempotent when required
Tenant-aware
Machine-readable
AI-readable
```

---

# 168. API Architecture Summary

A arquitetura recomendada:

```text
                    ┌─────────────────────┐
                    │      Consumer       │
                    │ Web / Mobile / AI   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     API Gateway     │
                    │ TLS / WAF / Routing  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │   HTTP / OpenAPI    │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
          ┌───────────────┐         ┌───────────────┐
          │ Authorization │         │   Validation  │
          └───────┬───────┘         └───────┬───────┘
                  └────────────┬────────────┘
                               ▼
                    ┌─────────────────────┐
                    │      Services       │
                    │  Business / Domain  │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
      ┌────────────┐   ┌──────────────┐   ┌────────────┐
      │ Repository │   │ External     │   │ AI Gateway │
      │            │   │ Integrations │   │            │
      └─────┬──────┘   └──────────────┘   └────────────┘
            │
            ▼
      ┌────────────┐
      │ PostgreSQL │
      └────────────┘

        Cross-Cutting:
        ├── Audit
        ├── Logging
        ├── Metrics
        ├── Tracing
        ├── Security
        └── Idempotency
```

---

# 169. Final Principle

O BAS estabelece uma regra simples:

```text
Design the API
        ↓
Define the Contract
        ↓
Define Security
        ↓
Define Behavior
        ↓
Define Errors
        ↓
Define Observability
        ↓
Implement
        ↓
Test
```

Não:

```text
Write endpoint
        ↓
Discover behavior later
```

A API deve ser suficientemente explícita para que:

```text
Human
Frontend
Backend
QA
SDK
Automation
AI Agent
```

consigam interpretar o mesmo contrato sem depender de conhecimento implícito.

---

# 170. API First + AI First Principle

O objetivo final do BAS é tornar o backend **contract-driven e machine-readable**.

A API não deve ser apenas consumível por humanos.

Ela deve ser consumível por:

```text
Applications
SDKs
Automation
Agents
LLMs
Testing Systems
Developer Tooling
```

Portanto:

```text
OpenAPI
+
JSON Schema
+
Pydantic
+
Stable operationId
+
Explicit permissions
+
Explicit errors
+
Explicit side effects
+
Explicit AI capabilities
```

formam o contrato oficial da API Loft.