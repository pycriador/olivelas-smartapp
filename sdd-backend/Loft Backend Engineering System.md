# Loft Backend Engineering System

## Volume II — Backend Design & Engineering System

**Status:** Foundation  
**Version:** 1.0  
**Parent Standard:** Loft Backend Foundation — Volume I  
**Primary Language:** Python  
**Framework:** FastAPI  
**ORM:** SQLAlchemy 2.x  
**Validation:** Pydantic v2  
**Database:** PostgreSQL  
**Migration:** Alembic  
**Testing:** Pytest  
**API Standard:** OpenAPI  
**Architecture:** API First + AI First

---

# 1. Objetivo

O Loft Backend Engineering System define os padrões de implementação utilizados para construir, manter, revisar e evoluir backends baseados no Loft Backend Foundation.

Enquanto o Volume I define **o que a arquitetura deve possuir**, este documento define **como o código deve ser escrito**.

O objetivo é garantir:

- consistência entre projetos;
- legibilidade;
- previsibilidade;
- segurança;
- testabilidade;
- escalabilidade;
- facilidade de manutenção;
- onboarding rápido;
- menor acoplamento;
- qualidade de código;
- compatibilidade com desenvolvimento assistido por IA.

---

# 2. Princípios de Engenharia

Todo código backend deve seguir os seguintes princípios:

```text
Clarity over cleverness
Explicit over implicit
Composition over inheritance
Small interfaces over large abstractions
Type safety over runtime assumptions
Validated input over trusted input
Domain rules over framework rules
Automation over manual repetition
Observable behavior over opaque behavior
Simple architecture over premature abstraction
```

---

# 3. Golden Rules

## Rule 01 — Router não contém regra de negócio

Routers devem ser finos.

```text
Router
  ↓
Application Service
  ↓
Domain
  ↓
Repository
```

Não colocar regras complexas diretamente em endpoints.

---

## Rule 02 — SQLAlchemy Models não são API Schemas

Nunca expor diretamente entidades ORM como contratos públicos.

Separar:

```text
SQLAlchemy Model
        ↓
Service
        ↓
Pydantic Schema
        ↓
API Response
```

---

## Rule 03 — Toda entrada externa é não confiável

Isso inclui:

- request body;
- query parameters;
- path parameters;
- headers;
- cookies;
- uploads;
- webhooks;
- APIs externas;
- mensagens de filas;
- outputs de LLM.

Tudo deve ser validado.

---

## Rule 04 — Toda operação crítica deve ser observável

Operações importantes devem gerar:

- logs;
- métricas;
- traces quando aplicável;
- audit events quando necessário.

---

## Rule 05 — Segurança não é responsabilidade do frontend

Toda autorização deve ser validada no backend.

Nunca confiar em:

```text
hidden UI
disabled button
frontend route guard
frontend role
frontend validation
```

como mecanismo de segurança.

---

# 4. Naming Convention

A nomenclatura deve ser previsível.

---

# 5. Python Files

Arquivos devem utilizar:

```text
snake_case.py
```

Exemplos:

```text
user_service.py
auth_service.py
permission_repository.py
audit_log.py
```

Nunca:

```text
UserService.py
userService.py
USER_SERVICE.py
```

---

# 6. Classes

Classes devem utilizar:

```text
PascalCase
```

Exemplos:

```python
UserService
PermissionService
AuditService
UserRepository
CreateUserRequest
UserResponse
```

---

# 7. Functions

Funções devem utilizar:

```text
snake_case
```

Exemplos:

```python
get_current_user()
create_user()
validate_permission()
generate_access_token()
```

---

# 8. Variables

Variáveis devem utilizar:

```text
snake_case
```

Exemplo:

```python
current_user
access_token
tenant_id
request_id
```

---

# 9. Constants

Constantes devem utilizar:

```text
UPPER_SNAKE_CASE
```

Exemplo:

```python
MAX_PAGE_SIZE = 100
DEFAULT_PAGE_SIZE = 20
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

---

# 10. Boolean Naming

Booleanos devem possuir nomes semanticamente claros.

Preferir:

```python
is_active
is_verified
has_permission
can_edit
should_retry
```

Evitar:

```python
active
verify
permission
edit
retry
```

quando a intenção não for óbvia.

---

# 11. IDs

IDs devem possuir nomes explícitos.

Preferir:

```text
user_id
tenant_id
organization_id
document_id
request_id
trace_id
```

Evitar:

```text
id
```

em contextos onde exista ambiguidade.

---

# 12. UUID

Quando utilizar UUID:

```python
from uuid import UUID
```

Tipos devem ser explícitos:

```python
user_id: UUID
```

Evitar transportar IDs como strings sem necessidade.

---

# 13. Datetime

Utilizar timestamps timezone-aware.

Preferir:

```python
datetime
```

com timezone UTC.

Nunca depender de datetime local para dados persistidos.

---

# 14. Timezone

Backend deve utilizar UTC internamente.

```text
Database → UTC
Logs → UTC
Events → UTC
API timestamps → ISO 8601 + timezone
```

Conversão para timezone local deve ocorrer na camada de apresentação.

---

# 15. Type Hints

Type hints são obrigatórios para código de produção.

Exemplo:

```python
async def get_user(user_id: UUID) -> UserResponse:
    ...
```

Evitar:

```python
async def get_user(user_id):
    ...
```

---

# 16. Any

`Any` deve ser evitado.

Uso permitido somente quando:

- integração externa não possui typing;
- biblioteca exige;
- estrutura realmente dinâmica;
- existe justificativa explícita.

Preferir:

```text
TypedDict
Protocol
Generic
Pydantic model
Union
Literal
```

---

# 17. Optional Values

Preferir sintaxe moderna:

```python
str | None
```

em vez de:

```python
Optional[str]
```

quando compatível com a versão do Python adotada.

---

# 18. Enums

Utilizar enums quando o domínio possui conjunto fechado de valores.

Exemplo:

```python
class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
```

Não espalhar strings mágicas pelo código.

---

# 19. Magic Numbers

Evitar números mágicos.

Ruim:

```python
if attempts > 3:
```

Preferir:

```python
MAX_RETRY_ATTEMPTS = 3

if attempts > MAX_RETRY_ATTEMPTS:
```

---

# 20. Magic Strings

Evitar:

```python
if role == "admin":
```

quando o valor possuir significado de domínio.

Preferir:

```python
if role == Role.ADMIN:
```

---

# 21. Constants Organization

Constantes relacionadas devem ficar próximas ao contexto.

Evitar:

```text
constants.py
```

gigantesco contendo tudo do projeto.

Preferir:

```text
auth/constants.py
pagination/constants.py
ai/constants.py
billing/constants.py
```

---

# 22. Architecture Layers

A aplicação deve seguir uma separação lógica:

```text
HTTP/API
   ↓
Application
   ↓
Domain
   ↓
Infrastructure
```

---

# 23. API Layer

Responsabilidades:

- HTTP;
- routing;
- request validation;
- authentication dependencies;
- authorization dependencies;
- response serialization;
- status codes.

Não deve:

- executar SQL diretamente;
- implementar regras complexas;
- chamar SDKs externos diretamente;
- implementar lógica de IA diretamente.

---

# 24. Application Layer

Responsável por orquestrar casos de uso.

Exemplo:

```text
CreateUser
UpdateUser
DeleteUser
GenerateReport
ProcessDocument
ApprovePayroll
```

Application services coordenam:

```text
Domain
Repositories
Integrations
Transactions
Events
```

---

# 25. Domain Layer

Responsável por regras de negócio.

Exemplos:

```text
permission policies
validation rules
business calculations
state transitions
domain invariants
```

O domínio não deve depender de FastAPI.

---

# 26. Infrastructure Layer

Responsável por:

- database;
- Redis;
- HTTP clients;
- storage;
- queues;
- external providers;
- observability adapters;
- AI providers.

---

# 27. Dependency Direction

Dependências devem apontar para dentro.

```text
API
 ↓
Application
 ↓
Domain
```

Infrastructure implementa interfaces utilizadas pela aplicação/domínio.

Evitar:

```text
Domain → FastAPI
Domain → SQLAlchemy session
Domain → OpenAI SDK
```

quando uma abstração puder evitar esse acoplamento.

---

# 28. Dependency Injection

Utilizar FastAPI Dependency Injection para recursos relacionados ao request.

Exemplos:

```text
get_db()
get_current_user()
get_current_tenant()
require_permission()
get_request_id()
```

---

# 29. Dependency Scope

Dependencies devem possuir responsabilidade única.

Evitar:

```python
get_everything()
```

Preferir:

```python
get_db()
get_current_user()
get_current_tenant()
```

---

# 30. Service Layer

Services representam operações de negócio ou aplicação.

Exemplo:

```python
class UserService:
    async def create_user(...):
        ...

    async def update_user(...):
        ...

    async def deactivate_user(...):
        ...
```

---

# 31. Service Size

Services não devem se tornar "God Services".

Se uma classe possui dezenas de responsabilidades:

```text
UserService
  ├── authentication
  ├── billing
  ├── notifications
  ├── reports
  ├── permissions
  └── audit
```

deve ser dividida.

---

# 32. Repository Layer

Repositories encapsulam persistência quando isso melhora o design.

Exemplo:

```python
class UserRepository:
    async def get_by_id(...)
    async def get_by_email(...)
    async def create(...)
    async def update(...)
```

---

# 33. Repository Responsibilities

Repository deve cuidar de:

- queries;
- persistence;
- loading relationships;
- database-specific concerns.

Repository não deve cuidar de:

- HTTP;
- JWT;
- emails;
- business workflows;
- HTTP status codes.

---

# 34. Generic Repository

Não criar generic repositories automaticamente.

Evitar:

```python
class BaseRepository[T]:
    ...
```

se ele simplesmente esconder operações triviais.

Abstração deve existir quando reduzir complexidade.

---

# 35. Database Models

Models devem representar persistência.

Exemplo:

```python
class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID]
    email: Mapped[str]
    created_at: Mapped[datetime]
```

---

# 36. Schema Categories

Pydantic schemas devem ser separados por intenção.

Padrão:

```text
Create
Update
Response
List
Detail
Filter
```

Exemplo:

```text
CreateUserRequest
UpdateUserRequest
UserResponse
UserListResponse
UserFilter
```

---

# 37. Request Schemas

Request schemas representam entrada da API.

Exemplo:

```python
class CreateUserRequest(BaseModel):
    email: EmailStr
    name: str
```

Nunca reutilizar indiscriminadamente `Response` como request.

---

# 38. Response Schemas

Response schemas devem expor somente informações autorizadas.

Exemplo:

```python
class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    name: str
    created_at: datetime
```

Nunca incluir:

```text
password_hash
internal_tokens
secrets
internal metadata
```

---

# 39. Update Schemas

Updates devem representar alterações permitidas.

Exemplo:

```python
class UpdateUserRequest(BaseModel):
    name: str | None = None
```

Não utilizar um schema gigantesco contendo todos os campos do banco simplesmente porque "pode ser útil".

---

# 40. Pydantic Configuration

Utilizar configuração explícita.

Exemplo:

```python
class UserResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )
```

---

# 41. Validation Strategy

Validação deve ocorrer em níveis:

```text
API Schema
 ↓
Application validation
 ↓
Domain invariants
 ↓
Database constraints
```

Uma validação importante não deve existir somente no frontend.

---

# 42. Database Constraints

Regras críticas devem também existir no banco.

Exemplos:

```text
UNIQUE
NOT NULL
FOREIGN KEY
CHECK
PRIMARY KEY
```

Não confiar exclusivamente na aplicação para integridade.

---

# 43. Transactions

Transactions devem ser controladas pela camada de aplicação.

Exemplo:

```text
Service
 ↓
BEGIN
 ↓
Repository A
 ↓
Repository B
 ↓
Audit
 ↓
COMMIT
```

---

# 44. Transaction Boundary

Uma operação de negócio deve possuir uma fronteira transacional clara.

Evitar repositories fazendo:

```python
await session.commit()
```

automaticamente em toda operação.

Isso dificulta composição de múltiplas operações.

Preferir que o service controle o commit quando necessário.

---

# 45. Rollback

Erros durante uma operação transacional devem causar rollback.

Nunca deixar uma session em estado inconsistente.

---

# 46. Read vs Write

Quando necessário, separar mentalmente:

```text
Commands
Queries
```

Commands alteram estado.

Queries consultam estado.

Isso não significa implementar CQRS completo em todo projeto.

---

# 47. Query Optimization

Queries devem retornar apenas o necessário.

Evitar:

```python
SELECT *
```

em queries de alto volume.

Preferir projeções quando apropriado.

---

# 48. N+1

Todo código que carrega relacionamentos deve ser avaliado contra N+1.

Utilizar adequadamente:

```text
selectinload
joinedload
explicit joins
```

de acordo com o caso.

---

# 49. Pagination

Paginação deve ser padronizada.

Schema:

```python
class PaginationParams(BaseModel):
    page: int = 1
    page_size: int = 20
```

Com validação:

```text
page >= 1
1 <= page_size <= MAX_PAGE_SIZE
```

---

# 50. Pagination Response

Estrutura recomendada:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 100,
    "has_next": true
  }
}
```

---

# 51. Cursor Pagination

Para grandes volumes, utilizar cursor pagination.

Exemplo:

```text
?cursor=eyJpZCI6...
```

Cursor deve ser:

- opaco;
- validado;
- seguro;
- estável.

Não expor detalhes internos desnecessários.

---

# 52. Sorting

Sorting deve utilizar whitelist.

Exemplo:

```text
?sort=-created_at
```

Backend deve mapear:

```text
created_at → User.created_at
name → User.name
```

Nunca transformar input arbitrário em SQL.

---

# 53. Filtering

Filtros devem possuir schema explícito.

Exemplo:

```python
class UserFilter(BaseModel):
    status: UserStatus | None = None
    search: str | None = None
```

---

# 54. Search

Search deve possuir limites.

Exemplo:

```text
minimum search length
maximum search length
allowed fields
rate limits
```

Não permitir consultas extremamente custosas sem controle.

---

# 55. Error Architecture

Criar erros de aplicação estruturados.

Exemplo:

```python
class ApplicationError(Exception):
    code: str
    message: str
```

Subclasses:

```text
NotFoundError
ConflictError
AuthorizationError
ValidationError
ExternalServiceError
```

---

# 56. Error Codes

Error codes devem ser:

- únicos;
- estáveis;
- machine-readable;
- documentados.

Exemplo:

```text
USER_NOT_FOUND
USER_ALREADY_EXISTS
INVALID_CREDENTIALS
PERMISSION_DENIED
RESOURCE_CONFLICT
EXTERNAL_SERVICE_UNAVAILABLE
```

---

# 57. HTTP Exception Mapping

Application errors devem ser convertidos em HTTP errors em um único lugar.

Exemplo:

```text
NotFoundError
       ↓
404

ConflictError
       ↓
409

AuthorizationError
       ↓
403
```

Não espalhar `HTTPException` pela camada de domínio.

---

# 58. Error Response

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

# 59. Error Information Disclosure

Mensagens de erro não devem revelar:

- stack traces;
- SQL;
- credentials;
- internal hostnames;
- secrets;
- infrastructure details.

---

# 60. Logging Standard

Logs devem ser estruturados.

Preferir:

```python
logger.info(
    "user_created",
    extra={
        "user_id": str(user.id),
        "request_id": request_id,
    },
)
```

ou um logger estruturado equivalente.

---

# 61. Log Levels

Utilizar:

```text
DEBUG
INFO
WARNING
ERROR
CRITICAL
```

### DEBUG

Informações úteis apenas para desenvolvimento.

### INFO

Eventos operacionais normais.

### WARNING

Situações anormais recuperáveis.

### ERROR

Falha de operação.

### CRITICAL

Falha que pode comprometer o serviço.

---

# 62. Logging Sensitive Data

Nunca logar:

```text
password
password_hash
JWT
refresh_token
API_KEY
Authorization header
credit card
private keys
```

PII deve ser minimizada e mascarada quando necessária.

---

# 63. Correlation IDs

Todo request deve possuir:

```text
request_id
trace_id
```

quando tracing estiver habilitado.

Esses identificadores devem acompanhar chamadas externas.

---

# 64. Observability Context

Logs e traces devem permitir responder:

```text
What happened?
Who triggered it?
Which request?
Which tenant?
Which service?
How long did it take?
Where did it fail?
```

---

# 65. External API Clients

Toda integração HTTP deve ser encapsulada.

Evitar:

```python
async with httpx.AsyncClient() as client:
    ...
```

espalhado por dezenas de services.

Preferir:

```text
ExternalClient
 ↓
Provider / Adapter
 ↓
Application Service
```

---

# 66. HTTP Client Configuration

Todos os clients externos devem definir:

```text
timeout
headers
authentication
retry policy
error mapping
observability
```

---

# 67. External Errors

Erros externos devem ser convertidos para erros internos.

Exemplo:

```text
StripeTimeout
        ↓
ExternalServiceUnavailable

GitHub404
        ↓
ExternalResourceNotFound
```

O domínio não deve depender de exceptions específicas de SDK.

---

# 68. Retry Policy

Retry deve ocorrer somente para erros transitórios.

Exemplos:

```text
timeout
connection reset
429
5xx
```

Não retry:

```text
400
401
403
404
validation error
```

---

# 69. Idempotency

Endpoints de criação sensíveis devem suportar idempotency.

Exemplo:

```text
POST /payments
Idempotency-Key: abc123
```

A mesma chave deve produzir o mesmo resultado lógico.

---

# 70. Background Jobs

Jobs devem possuir:

```text
job_id
status
created_at
started_at
completed_at
error
retry_count
```

Estados:

```text
PENDING
RUNNING
COMPLETED
FAILED
CANCELLED
```

---

# 71. Job Design

Jobs devem ser:

- idempotentes;
- observáveis;
- retryable quando apropriado;
- pequenos;
- independentes.

Evitar jobs gigantes que executem dezenas de responsabilidades.

---

# 72. Events

Eventos internos podem representar fatos de domínio.

Exemplo:

```text
UserCreated
PaymentApproved
DocumentProcessed
PayrollValidated
```

Eventos devem ser fatos, não comandos.

Preferir:

```text
UserCreated
```

em vez de:

```text
CreateUser
```

---

# 73. Event Payload

Eventos devem possuir schema versionado.

Exemplo:

```json
{
  "event_type": "user.created",
  "version": 1,
  "event_id": "...",
  "occurred_at": "...",
  "data": {}
}
```

---

# 74. Audit vs Logs

Não confundir:

```text
Logs
```

com:

```text
Audit Logs
```

Logs são operacionais.

Audit logs representam ações relevantes do sistema.

Audit events devem possuir retenção e governança próprias.

---

# 75. Authentication Code

Authentication deve ficar isolada.

Exemplo:

```text
services/auth_service.py
core/security.py
api/v1/auth.py
```

Não espalhar JWT generation por toda a aplicação.

---

# 76. Authorization Code

Authorization deve ser declarativa.

Exemplo:

```python
@router.delete(
    "/users/{user_id}",
    dependencies=[
        Depends(require_permission("users:delete"))
    ],
)
```

Ou mecanismo equivalente.

---

# 77. Permission Naming

Formato recomendado:

```text
resource:action
```

Exemplos:

```text
users:read
users:create
users:update
users:delete

reports:read
reports:create
reports:export

admin:manage
```

---

# 78. Resource Ownership

Quando necessário, autorização deve verificar ownership.

Exemplo:

```text
User A
 ↓
Document A
```

User B não deve acessar Document A somente porque conhece o UUID.

---

# 79. IDOR Protection

Todo endpoint que recebe um resource ID deve verificar:

```text
Does the authenticated actor have access to this resource?
```

Nunca considerar UUID como mecanismo de autorização.

---

# 80. Tenant Context

Quando multi-tenant:

```text
request
 ↓
authenticated user
 ↓
tenant context
 ↓
service
 ↓
repository
 ↓
tenant-filtered query
```

---

# 81. Tenant Isolation

Tenant ID deve ser derivado de contexto confiável.

Nunca aceitar:

```json
{
  "tenant_id": "other-tenant"
}
```

como única fonte de autorização.

---

# 82. Database Security

Queries multi-tenant devem aplicar isolamento no banco quando apropriado.

Considerar PostgreSQL Row Level Security em sistemas que necessitem de uma segunda camada de isolamento.

---

# 83. Secrets Management

Secrets devem ser acessados através de configuração segura.

Código deve consumir:

```python
settings.database_url
```

e não:

```python
os.getenv("DATABASE_URL")
```

espalhado pelo projeto.

---

# 84. Configuration Object

Centralizar configuração:

```python
class Settings(BaseSettings):
    app_env: str
    database_url: str
    jwt_secret_key: SecretStr
```

---

# 85. Secret Types

Utilizar tipos apropriados para secrets.

Exemplo:

```python
SecretStr
```

Evitar secrets como strings comuns quando isso aumentar risco de exposição.

---

# 86. AI Code Standards

Código relacionado a IA deve seguir os mesmos padrões de engenharia.

Não criar exceções como:

```text
"É IA, então pode ficar no router."
```

IA também deve possuir:

```text
service
schemas
validation
authorization
observability
tests
error handling
```

---

# 87. AI Service

Exemplo:

```python
class AIService:
    async def summarize_document(
        self,
        document: Document,
    ) -> Summary:
        ...
```

O service não deve conhecer detalhes HTTP.

---

# 88. AI Provider

Criar abstração quando múltiplos providers forem necessários.

Exemplo:

```python
class AIProvider(Protocol):
    async def generate(...):
        ...
```

Implementações:

```text
OpenAIProvider
AnthropicProvider
GeminiProvider
```

---

# 89. Structured Output

Preferir outputs tipados.

Exemplo:

```python
class InvoiceExtraction(BaseModel):
    invoice_number: str
    total: Decimal
    issue_date: date
```

A saída do modelo deve ser validada antes de entrar no domínio.

---

# 90. Prompt Versioning

Prompts devem possuir versão.

Exemplo:

```text
invoice_extraction:v1
invoice_extraction:v2
```

Alterações relevantes devem gerar nova versão.

---

# 91. AI Cost Tracking

Toda operação relevante deve permitir identificar:

```text
provider
model
input_tokens
output_tokens
total_tokens
estimated_cost
```

---

# 92. AI Error Handling

Distinguir:

```text
AIProviderError
AIValidationError
AITimeoutError
AIRateLimitError
AIContentPolicyError
AIConfigurationError
```

Não tratar todos como:

```text
Exception
```

---

# 93. AI Testing

Testar:

```text
schema validation
provider failures
timeouts
malformed outputs
hallucinated fields
tool authorization
prompt regression
```

---

# 94. RAG Code

RAG deve possuir separação:

```text
DocumentLoader
Chunker
EmbeddingService
VectorRepository
Retriever
ContextBuilder
GenerationService
```

Evitar uma classe:

```text
RAGService
```

com milhares de linhas.

---

# 95. AI Tool Design

Tools devem possuir:

```text
input schema
output schema
permission
timeout
audit policy
```

Tool calls devem ser auditáveis quando alteram estado.

---

# 96. Tool Safety

Tools de leitura:

```text
read-only
```

Tools de escrita:

```text
mutation
```

Devem ser claramente separadas.

Exemplo:

```text
get_user
```

versus:

```text
delete_user
```

---

# 97. AI Agents

Agents devem possuir limites explícitos:

```text
max_iterations
max_tool_calls
max_tokens
timeout
allowed_tools
budget
```

Nunca permitir loop ilimitado.

---

# 98. Prompt Injection

Aplicações com RAG e tools devem assumir que conteúdo externo pode conter instruções maliciosas.

Documentos recuperados devem ser tratados como:

```text
DATA
```

e não como:

```text
SYSTEM INSTRUCTIONS
```

---

# 99. Code Organization

Organização recomendada:

```text
app/
├── api/
├── core/
├── domain/
├── services/
├── repositories/
├── models/
├── schemas/
├── integrations/
├── ai/
├── db/
└── tests/
```

---

# 100. Module Size

Não existe número absoluto de linhas, mas módulos que acumulam múltiplas responsabilidades devem ser avaliados para divisão.

Sinais:

```text
many unrelated imports
many public methods
many dependencies
multiple unrelated domain concepts
```

---

# 101. Function Size

Funções devem ser pequenas o suficiente para possuir uma responsabilidade clara.

Se uma função exige comentários extensivos para explicar seus blocos internos, avaliar extração.

---

# 102. Comments

Comentários devem explicar:

```text
WHY
```

e não:

```text
WHAT
```

Ruim:

```python
# Increment counter
counter += 1
```

Bom:

```python
# Keep the retry counter consistent with the external provider's
# rate-limit window.
counter += 1
```

---

# 103. TODO

TODOs devem possuir contexto.

Evitar:

```python
# TODO
```

Preferir:

```python
# TODO(#123): Replace temporary polling with webhook processing.
```

---

# 104. Dead Code

Código morto deve ser removido.

Não manter:

```text
unused functions
unused imports
commented-out implementations
old endpoints
unused dependencies
```

---

# 105. Feature Flags

Código condicionado por feature flag deve possuir estratégia de remoção.

Toda flag temporária deve possuir:

```text
owner
creation_date
expected_removal
```

---

# 106. Dependency Management

Toda dependência deve ser justificada.

Antes de adicionar uma biblioteca:

```text
1. Existe na stdlib?
2. Existe no FastAPI?
3. Existe no Pydantic?
4. Existe no SQLAlchemy?
5. Existe uma dependência já instalada?
6. A biblioteca é madura?
7. Possui manutenção ativa?
8. Qual a licença?
9. Qual o impacto de segurança?
10. Qual o custo operacional?
```

---

# 107. Dependency Pinning

Dependências devem possuir lockfile.

Build de produção deve ser reproduzível.

---

# 108. Dependency Updates

Atualizações devem ocorrer de maneira controlada.

Fluxo:

```text
Update
 ↓
Install
 ↓
Tests
 ↓
Security Scan
 ↓
Review
 ↓
Merge
```

---

# 109. Ruff

Ruff deve ser utilizado para:

- lint;
- formatting;
- import sorting;
- regras de qualidade.

Configuração deve estar versionada.

---

# 110. Type Checking

Utilizar Pyright ou mypy.

O projeto deve definir um padrão único.

Type checking deve fazer parte do CI.

---

# 111. Pre-commit

Hooks recomendados:

```text
ruff
format
type check
secret detection
```

Hooks devem ser rápidos.

---

# 112. Testing Pyramid

Preferência:

```text
          E2E
         /   \
      API     Integration
       /         \
     Unit ------- Domain
```

A maior quantidade de testes deve estar em:

```text
unit
domain
application
```

---

# 113. Unit Tests

Unit tests não devem depender de:

```text
internet
real PostgreSQL
real Redis
real LLM
real third-party API
```

---

# 114. Integration Tests

Integration tests devem validar integração real entre componentes.

Exemplos:

```text
SQLAlchemy ↔ PostgreSQL
FastAPI ↔ Database
Redis ↔ Job system
```

---

# 115. API Tests

API tests devem executar HTTP contra a aplicação.

Validar:

```text
status
headers
schema
auth
permissions
errors
```

---

# 116. Test Naming

Nome deve explicar comportamento.

Preferir:

```python
test_user_cannot_update_user_from_another_tenant()
```

Evitar:

```python
test_user_update()
```

---

# 117. Arrange / Act / Assert

Testes devem preferencialmente seguir:

```text
Arrange
Act
Assert
```

Exemplo:

```python
# Arrange
user = ...

# Act
result = await service.create_user(...)

# Assert
assert result.email == ...
```

---

# 118. Test Isolation

Cada teste deve ser independente.

Não depender da ordem de execução.

---

# 119. Fixtures

Fixtures devem representar dependências reutilizáveis.

Exemplo:

```text
db_session
authenticated_client
admin_user
regular_user
tenant
```

Evitar fixtures gigantescas que criem metade da aplicação.

---

# 120. Mocking

Mockar dependências externas.

Exemplo:

```text
OpenAI
Slack
GitHub
Payment provider
Email provider
```

Não mockar internals indiscriminadamente.

---

# 121. Contract Tests

Quando existir integração crítica:

```text
API
External Provider
```

considerar contract tests.

---

# 122. Database Tests

Testar:

```text
constraints
transactions
migrations
indexes
tenant isolation
```

---

# 123. Migration Tests

CI deve validar que migrations:

```text
apply successfully
```

e, quando aplicável:

```text
downgrade successfully
```

---

# 124. Security Tests

Testes obrigatórios para endpoints protegidos:

```text
no token
invalid token
expired token
wrong permission
wrong tenant
resource ownership violation
```

---

# 125. Performance Tests

Endpoints críticos devem possuir testes de performance quando necessário.

Medir:

```text
latency
throughput
error rate
database load
```

Não otimizar baseado apenas em percepção.

---

# 126. Load Testing

Para serviços de alto volume, considerar:

```text
k6
Locust
equivalent tooling
```

---

# 127. API Contract

Cada endpoint deve possuir contrato:

```text
Method
Path
Request
Response
Status Codes
Authentication
Permissions
Errors
Pagination
Rate Limit
Idempotency
Examples
```

---

# 128. Endpoint Naming

Resources devem utilizar substantivos.

Preferir:

```text
GET /users
GET /users/{id}
POST /users
```

Evitar:

```text
GET /getUsers
POST /createUser
```

---

# 129. Actions

Quando uma operação realmente representa uma ação, utilizar subresource/action.

Exemplo:

```text
POST /users/{id}/activate
POST /payments/{id}/approve
POST /documents/{id}/process
```

Não transformar todas as operações em RPC.

---

# 130. Nested Resources

Utilizar nesting somente quando houver relação forte.

Exemplo:

```text
GET /organizations/{organization_id}/users
```

Evitar:

```text
/organizations/{org}/departments/{department}/users/{user}/documents/{document}/...
```

Nesting excessivo prejudica usabilidade.

---

# 131. HTTP Status Consistency

Todos os endpoints semelhantes devem utilizar status codes semelhantes.

Criar convenções e mantê-las.

---

# 132. API Response Consistency

List endpoints devem possuir estrutura consistente.

Detail endpoints devem possuir estrutura consistente.

Error responses devem ser globais.

---

# 133. OpenAPI Metadata

Todo router deve possuir tags apropriadas.

Exemplo:

```python
router = APIRouter(
    prefix="/users",
    tags=["Users"],
)
```

---

# 134. OpenAPI Descriptions

Endpoints importantes devem possuir descrição clara.

Exemplo:

```python
@router.get(
    "/{user_id}",
    summary="Get user",
    description="Returns the authenticated user's accessible user resource.",
)
```

Não duplicar documentação desnecessariamente.

---

# 135. API Examples

Schemas importantes devem possuir exemplos.

Exemplo:

```python
json_schema_extra={
    "example": {
        "email": "user@example.com",
        "name": "John Doe",
    }
}
```

---

# 136. Backward Compatibility

Mudanças devem ser classificadas:

```text
Patch
Minor
Breaking
```

Breaking changes devem possuir estratégia de migração.

---

# 137. Database Migration Safety

Evitar migrations perigosas diretamente em produção.

Exemplos:

```text
drop column
rename column
large table rewrite
non-null column without default
```

Preferir migrations em múltiplas etapas.

---

# 138. Expand / Contract

Para alterações breaking de banco:

```text
Expand
 ↓
Deploy compatible code
 ↓
Migrate data
 ↓
Switch reads/writes
 ↓
Contract
```

---

# 139. Data Migration

Migrations de schema e migrations de dados devem ser diferenciadas quando apropriado.

Não colocar milhões de registros sendo processados em uma migration transacional gigante sem avaliar impacto.

---

# 140. Database Transactions and External APIs

Evitar manter transaction aberta enquanto espera API externa.

Ruim:

```text
BEGIN
 ↓
Database
 ↓
Call external API
 ↓
Wait 10 seconds
 ↓
COMMIT
```

Preferir:

```text
Persist state
 ↓
Commit
 ↓
External operation
 ↓
Update state
```

ou workflow transacional apropriado.

---

# 141. Distributed Transactions

Não assumir que PostgreSQL + external service formam uma única transaction.

Quando necessário utilizar:

```text
Saga
Outbox
Idempotency
Compensation
```

---

# 142. Outbox Pattern

Para eventos críticos:

```text
Transaction
 ├── Domain change
 └── Outbox event
        ↓
      Commit
        ↓
 Event Processor
        ↓
 External systems
```

Isso evita perder eventos entre database commit e publicação.

---

# 143. API Idempotency + Outbox

Operações externas críticas devem combinar:

```text
Idempotency
+
Outbox
+
Retry
```

quando apropriado.

---

# 144. Caching Rules

Cache deve possuir:

```text
key
TTL
invalidation strategy
owner
```

Nunca introduzir cache sem definir invalidação.

---

# 145. Cache Keys

Keys devem ser namespaced.

Exemplo:

```text
user:{user_id}
tenant:{tenant_id}:users:{page}
report:{report_id}
```

---

# 146. Cache Invalidation

Quando uma entidade muda:

```text
write
 ↓
invalidate relevant cache
```

Evitar cache inconsistente indefinidamente.

---

# 147. Redis Usage

Redis deve ser utilizado para dados temporários ou capacidades distribuídas.

Não armazenar dados críticos exclusivamente em Redis sem persistência/estratégia adequada.

---

# 148. Background Job Reliability

Jobs devem suportar:

```text
retry
dead letter
visibility timeout
idempotency
observability
```

quando a tecnologia utilizada oferecer esses recursos.

---

# 149. Webhook Engineering

Webhook receivers devem:

```text
validate
persist
acknowledge
process async
```

Não executar processamento pesado antes de responder ao provider.

---

# 150. Webhook Security

Validar:

```text
signature
timestamp
replay
source
payload schema
```

---

# 151. File Processing

Processamento de arquivos deve ser assíncrono quando potencialmente pesado.

Fluxo:

```text
Upload
 ↓
Validate
 ↓
Persist metadata
 ↓
Queue job
 ↓
Process
 ↓
Update status
```

---

# 152. Storage Abstraction

Não acoplar domínio a S3.

Preferir:

```text
StorageService
 ↓
StorageProvider
 ├── S3
 ├── GCS
 ├── Azure Blob
 └── Local
```

---

# 153. Notifications

Notificações devem possuir abstraction:

```text
NotificationService
 ↓
NotificationProvider
 ├── Email
 ├── Slack
 ├── Teams
 └── Push
```

---

# 154. Email

Email deve ser tratado como integração externa.

Não construir HTML complexo dentro de services de domínio.

---

# 155. Audit Service

Audit deve possuir serviço próprio.

Exemplo:

```python
await audit_service.record(
    action="USER_CREATED",
    actor_id=user.id,
    resource_type="user",
    resource_id=new_user.id,
)
```

---

# 156. Audit Reliability

Para operações críticas, audit event deve participar da estratégia transacional.

Quando necessário utilizar Outbox.

---

# 157. API Keys

API key validation deve estar isolada.

Nunca espalhar:

```python
if api_key == ...
```

pelo código.

---

# 158. Rate Limit Service

Rate limiting deve ser abstraído:

```text
RateLimitService
 ↓
Redis
```

Não acoplar cada endpoint diretamente ao Redis.

---

# 159. Feature Flag Service

Quando necessário:

```text
FeatureFlagService
```

deve encapsular:

```text
flag evaluation
targeting
tenant overrides
user overrides
```

---

# 160. Service Interface

Services devem possuir APIs pequenas.

Evitar classes com dezenas de métodos não relacionados.

---

# 161. Protocols

Utilizar `Protocol` quando uma abstração baseada em comportamento for útil.

Exemplo:

```python
class StorageProvider(Protocol):
    async def upload(...): ...
    async def delete(...): ...
```

Isso facilita:

- mocking;
- troca de implementação;
- testes;
- desacoplamento.

---

# 162. Inheritance

Preferir composição.

Evitar hierarquias profundas:

```text
BaseService
 ↓
AuthenticatedService
 ↓
TenantService
 ↓
AuditedTenantService
 ↓
UserService
```

Preferir composição através de dependencies e collaborators.

---

# 163. Utility Modules

Não criar:

```text
utils.py
```

gigantesco.

Separar por domínio:

```text
datetime_utils.py
security_utils.py
pagination_utils.py
serialization_utils.py
```

---

# 164. Exception Handling

Nunca utilizar:

```python
except Exception:
    pass
```

---

# 165. Broad Exception Handling

Quando capturar `Exception`, deve existir uma razão clara.

Sempre:

```text
log
map
re-raise
recover
```

adequadamente.

---

# 166. Silent Failures

Nenhuma operação importante deve falhar silenciosamente.

---

# 167. Async Standards

Operações I/O devem ser async quando o stack suportar.

Exemplos:

```text
HTTP
Database
Redis
Storage
AI
```

---

# 168. Blocking Code

Não executar operações bloqueantes longas dentro do event loop.

Exemplos:

```text
large CPU processing
blocking SDK
large file processing
heavy image processing
```

Devem ser delegadas para:

```text
worker
thread
process
job queue
```

conforme o caso.

---

# 169. Concurrency

Código concorrente deve considerar:

```text
race conditions
locks
idempotency
transaction isolation
duplicate processing
```

---

# 170. Distributed Locks

Utilizar distributed locks somente quando realmente necessários.

Não utilizar Redis locks como substituto de constraints/transações do PostgreSQL.

---

# 171. Database Constraints First

Sempre que uma regra puder ser garantida pelo banco de forma apropriada, considerar constraint.

Exemplo:

```text
unique email
```

é melhor garantido por:

```text
UNIQUE constraint
```

do que apenas:

```text
if email_exists()
```

---

# 172. Race Conditions

Código:

```python
if not exists:
    create()
```

pode sofrer race condition.

Preferir:

```text
database constraint
+
handle IntegrityError
```

quando apropriado.

---

# 173. Transactions Isolation

Não alterar isolation level sem necessidade.

Mudanças de isolamento devem possuir justificativa.

---

# 174. Decimal

Valores monetários não devem utilizar `float`.

Preferir:

```text
Decimal
```

ou representação inteira apropriada.

---

# 175. Money

Definir claramente:

```text
currency
amount
precision
rounding
```

---

# 176. Serialization

Datas:

```text
ISO 8601
```

UUID:

```text
canonical string
```

Decimal:

```text
string ou formato explicitamente definido
```

---

# 177. API Security Headers

Security headers devem ser aplicados consistentemente quando apropriado.

Não duplicar responsabilidades entre aplicação e gateway sem necessidade.

---

# 178. CORS

Configuração deve ser explícita por ambiente.

Development pode possuir permissões mais amplas.

Production deve possuir allowlist.

---

# 179. Rate Limiting Policy

Rate limit deve ser definido por endpoint ou categoria.

Exemplo:

```text
Authentication:
5/minute

Public API:
60/minute

Authenticated API:
300/minute

AI:
20/minute
```

Os valores devem ser definidos pelo produto e capacidade da infraestrutura, não copiados cegamente.

---

# 180. API Abuse Protection

Endpoints de alto custo devem possuir controles adicionais.

Exemplos:

```text
AI generation
exports
search
file processing
reports
```

---

# 181. AI Abuse Protection

AI endpoints devem possuir:

```text
authentication
authorization
rate limit
token limit
cost limit
timeout
max context
```

---

# 182. AI Prompt Security

Prompts de sistema não devem ser tratados como segredo absoluto.

Não depender da ocultação do prompt como mecanismo de segurança.

A segurança deve estar nas:

```text
permissions
tools
data access
validation
```

---

# 183. AI Output Trust

LLM output nunca deve ser considerado confiável por padrão.

Validar:

```text
schema
business rules
authorization
database constraints
```

antes de executar mutations.

---

# 184. AI Mutation Safety

Agentes não devem executar mutations diretamente sem políticas.

Fluxo:

```text
AI
 ↓
Tool request
 ↓
Authorization
 ↓
Validation
 ↓
Optional approval
 ↓
Mutation
 ↓
Audit
```

---

# 185. Human-in-the-loop

Operações de alto impacto podem exigir aprovação humana.

Exemplos:

```text
delete
financial transaction
permission changes
bulk updates
production actions
```

---

# 186. Prompt and Model Configuration

Model settings devem ser configuráveis:

```text
model
temperature
max_tokens
timeout
provider
```

Não espalhar valores hardcoded.

---

# 187. AI Fallback

Fallback deve ser explícito.

Exemplo:

```text
Primary Model
 ↓ unavailable
Secondary Model
 ↓ unavailable
Graceful failure
```

Não alternar silenciosamente para modelos com capacidades ou políticas incompatíveis.

---

# 188. AI Evaluation Dataset

Datasets de avaliação devem ser versionados.

Exemplo:

```text
evaluation_dataset:v1
evaluation_dataset:v2
```

---

# 189. Prompt Regression

Mudanças em prompts devem ser avaliadas contra casos conhecidos.

---

# 190. API Documentation as Code

Documentação técnica deve acompanhar implementação.

Não manter documentação manual divergente do OpenAPI.

---

# 191. README Standard

Todo backend deve possuir README com:

```text
Project overview
Architecture
Requirements
Installation
Environment
Development
Testing
Migrations
Deployment
API documentation
AI capabilities
Security
Troubleshooting
```

---

# 192. Architecture Decision Records

Decisões arquiteturais importantes devem ser registradas.

Estrutura:

```text
docs/
└── adr/
    ├── 001-use-fastapi.md
    ├── 002-use-postgresql.md
    └── 003-ai-provider-abstraction.md
```

---

# 193. ADR Format

Cada ADR deve possuir:

```text
Context
Decision
Alternatives
Consequences
Status
```

---

# 194. Code Review

Toda alteração significativa deve passar por revisão.

Reviewer deve avaliar:

```text
Correctness
Security
Architecture
Performance
Tests
Observability
Maintainability
```

---

# 195. AI-Assisted Code Review

Código produzido por IA deve receber o mesmo rigor de revisão que código produzido manualmente.

Não assumir que:

```text
"passou pelo LLM"
```

significa:

```text
"está correto"
```

---

# 196. AI Coding Rules

Ferramentas de IA utilizadas no desenvolvimento devem seguir:

```text
existing architecture
existing conventions
existing dependencies
existing tests
existing security policies
```

A IA não deve introduzir uma nova biblioteca ou padrão sem justificativa.

---

# 197. AI Implementation Workflow

Para implementar uma feature:

```text
Understand
 ↓
Inspect existing architecture
 ↓
Identify affected modules
 ↓
Define contract
 ↓
Implement domain
 ↓
Implement persistence
 ↓
Implement API
 ↓
Implement tests
 ↓
Implement observability
 ↓
Security review
 ↓
Run quality gates
```

---

# 198. No Blind Refactoring

Não refatorar grandes áreas apenas para "deixar mais bonito".

Toda refatoração deve possuir:

```text
goal
scope
risk
tests
rollback strategy
```

---

# 199. No Premature Abstraction

Não criar abstrações antes de existir um segundo caso real que justifique a generalização.

Preferir:

```text
simple implementation
```

até que exista evidência de necessidade.

---

# 200. Complexity Budget

Toda feature deve avaliar:

```text
How much complexity does this add?
```

Complexidade operacional também conta:

```text
new service
new queue
new database
new provider
new library
new deployment
```

---

# 201. Definition of Ready

Antes de iniciar implementação:

- [ ] objetivo definido;
- [ ] domínio identificado;
- [ ] API contract definido;
- [ ] autenticação definida;
- [ ] autorização definida;
- [ ] dados identificados;
- [ ] dependências externas identificadas;
- [ ] requisitos de observabilidade identificados;
- [ ] requisitos de IA identificados;
- [ ] riscos identificados.

---

# 202. Definition of Done

Uma feature backend está concluída quando:

## Architecture

- [ ] responsabilidade correta;
- [ ] baixo acoplamento;
- [ ] sem abstrações desnecessárias.

## API

- [ ] endpoint implementado;
- [ ] OpenAPI atualizado;
- [ ] schemas definidos;
- [ ] errors definidos;
- [ ] status codes corretos.

## Security

- [ ] authentication;
- [ ] authorization;
- [ ] validation;
- [ ] rate limit quando aplicável;
- [ ] audit quando necessário.

## Database

- [ ] models;
- [ ] migration;
- [ ] constraints;
- [ ] indexes avaliados;
- [ ] transactions avaliadas.

## Tests

- [ ] unit;
- [ ] integration;
- [ ] API;
- [ ] security;
- [ ] AI quando aplicável.

## Observability

- [ ] logs;
- [ ] metrics;
- [ ] tracing;
- [ ] request ID.

## Documentation

- [ ] README atualizado;
- [ ] ADR quando necessário;
- [ ] API documentation.

---

# 203. CI Quality Gates

Todo Pull Request deve validar:

```text
ruff
typecheck
unit tests
integration tests
security scan
dependency scan
migration validation
```

Quando aplicável:

```text
API contract tests
AI evaluation
performance tests
```

---

# 204. Minimum Quality Gate

Nenhum código deve ser merged se:

```text
lint fails
type check fails
tests fail
security scan identifies blocking vulnerability
migration is invalid
```

---

# 205. Production Readiness Checklist

Antes de produção:

### API

- [ ] OpenAPI validado
- [ ] authentication
- [ ] authorization
- [ ] rate limits
- [ ] pagination
- [ ] errors

### Security

- [ ] secrets manager
- [ ] CORS
- [ ] security headers
- [ ] dependency scan
- [ ] security tests
- [ ] audit

### Database

- [ ] migrations
- [ ] indexes
- [ ] constraints
- [ ] backup strategy
- [ ] connection pool

### Infrastructure

- [ ] container
- [ ] health checks
- [ ] graceful shutdown
- [ ] autoscaling strategy

### Observability

- [ ] logs
- [ ] metrics
- [ ] traces
- [ ] alerts
- [ ] dashboards

### AI

- [ ] model configured
- [ ] provider configured
- [ ] token limits
- [ ] cost limits
- [ ] guardrails
- [ ] evaluation
- [ ] AI observability

---

# 206. Standard Backend Blueprint

O backend padrão deve seguir aproximadamente:

```text
                         CLIENT
                           │
                           ▼
                     ┌───────────┐
                     │  FastAPI  │
                     └─────┬─────┘
                           │
               ┌───────────┼───────────┐
               │           │           │
               ▼           ▼           ▼
             AuthN       AuthZ      Validation
               │           │           │
               └───────────┼───────────┘
                           │
                           ▼
                   Application Service
                           │
                  ┌────────┼────────┐
                  │        │        │
                  ▼        ▼        ▼
               Domain   Repository  Events
                  │        │
                  │        ▼
                  │    PostgreSQL
                  │
                  ├──── Redis
                  │
                  ├──── External APIs
                  │
                  └──── AI Service
                           │
                     ┌─────┴─────┐
                     │ AI Gateway│
                     └─────┬─────┘
                           │
                      LLM Providers

      ┌────────────────────────────────────────┐
      │           Observability                │
      │ Logs │ Metrics │ Traces │ Audit │ AI  │
      └────────────────────────────────────────┘
```

---

# 207. Engineering Philosophy

O Loft Backend Engineering System deve seguir uma filosofia simples:

```text
Make the correct thing easy.
Make the dangerous thing difficult.
Make the important thing observable.
Make the contract explicit.
Make the business rule testable.
Make the security boundary unavoidable.
Make the architecture understandable by humans and AI.
```

---

# 208. Final Standard

Todo backend Loft deve buscar:

```text
Readable
Typed
Tested
Secure
Observable
Documented
API First
AI First
Cloud Ready
Horizontally Scalable
```

A arquitetura deve permanecer simples enquanto o domínio for simples e evoluir somente quando a complexidade real do produto justificar.

A Foundation define as capacidades disponíveis.

O Engineering System define como essas capacidades devem ser utilizadas.

Nenhum padrão deve ser adotado apenas por moda tecnológica.

Toda decisão deve considerar:

```text
Business Value
Engineering Cost
Operational Cost
Security Risk
Performance
Maintainability
Developer Experience
AI Compatibility
```