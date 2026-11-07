# Loft Backend Component Catalog

## Volume III — Backend Component Catalog

**Status:** Foundation  
**Version:** 1.0  
**Parent Standard:** Loft Backend Foundation — Volume I  
**Engineering Standard:** Loft Backend Design & Engineering System — Volume II  
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

O Loft Backend Component Catalog define os componentes reutilizáveis que devem ser considerados antes da criação de novas implementações.

O objetivo é evitar:

- duplicação de código;
- múltiplas implementações do mesmo conceito;
- inconsistência entre projetos;
- abstrações desnecessárias;
- regras de segurança espalhadas;
- integrações externas duplicadas;
- implementação divergente por diferentes equipes;
- código gerado por IA reinventando componentes existentes.

O catálogo deve funcionar como uma **biblioteca arquitetural de capacidades backend**.

Antes de implementar uma nova funcionalidade, o desenvolvedor ou agente de IA deve verificar:

```text
Existe um componente padrão para isso?
        │
        ├── SIM → reutilizar
        │
        └── NÃO → avaliar criação de novo componente
```

---

# 2. Princípio Fundamental

Um componente padrão deve possuir:

```text
Clear Responsibility
Stable Interface
Defined Inputs
Defined Outputs
Defined Errors
Security Model
Observability
Tests
Documentation
```

Um componente não deve existir apenas para "organizar código".

---

# 3. Component Categories

Os componentes são organizados em:

```text
Core
Authentication
Authorization
Users & Identity
Database
API
Pagination
Errors
Audit
Observability
Caching
Storage
Webhooks
Jobs
Notifications
External Integrations
AI
RAG
Events
Feature Flags
Configuration
Security
Testing
```

---

# 4. Component Lifecycle

Todo componente deve possuir um ciclo:

```text
Proposal
   ↓
Design
   ↓
Implementation
   ↓
Tests
   ↓
Documentation
   ↓
Adoption
   ↓
Maintenance
```

---

# 5. Component Maturity

Componentes podem possuir níveis:

```text
Experimental
Internal
Stable
Deprecated
```

### Experimental

Ainda em avaliação.

### Internal

Utilizado dentro de determinados domínios.

### Stable

Pode ser reutilizado amplamente.

### Deprecated

Não deve ser utilizado em novas implementações.

---

# 6. Component Contract

Todo componente deve documentar:

```text
Purpose
Responsibilities
Non-responsibilities
Inputs
Outputs
Dependencies
Errors
Security
Observability
Usage
Testing
Limitations
```

---

# 7. Core Component Catalog

Componentes fundamentais:

```text
Settings
RequestContext
DependencyContainer
Clock
IDGenerator
Serializer
Validator
```

---

# 8. Settings

## Responsibility

Centralizar configuração da aplicação.

Exemplo:

```python
class Settings(BaseSettings):
    app_name: str
    environment: str
    database_url: str
    jwt_secret_key: SecretStr
```

---

## Rules

`Settings` deve:

- utilizar Pydantic Settings;
- validar configuração;
- suportar ambientes;
- evitar acesso direto a `os.getenv()` espalhado;
- proteger secrets.

---

# 9. RequestContext

## Responsibility

Representar contexto da requisição atual.

Pode conter:

```text
request_id
trace_id
user_id
tenant_id
ip_address
user_agent
```

---

## Example

```python
class RequestContext:
    request_id: str
    trace_id: str | None
    user_id: UUID | None
    tenant_id: UUID | None
```

---

# 10. RequestContext Rules

O contexto não deve ser utilizado como armazenamento arbitrário de dados.

Adicionar propriedades somente quando possuírem significado transversal.

---

# 11. Clock

Componente para abstrair acesso ao tempo.

```python
class Clock(Protocol):
    def now(self) -> datetime:
        ...
```

Implementações:

```text
SystemClock
FixedClock
```

`FixedClock` deve ser utilizado em testes.

---

# 12. IDGenerator

Responsável pela geração de identificadores.

Pode suportar:

```text
UUID
ULID
```

A escolha deve ser definida pelo projeto.

---

# 13. Authentication Components

Componentes:

```text
AuthService
TokenService
PasswordService
SessionService
CurrentUser
AuthenticationMiddleware
```

---

# 14. AuthService

## Responsibility

Orquestrar autenticação.

Responsabilidades:

- login;
- logout;
- credential verification;
- session/token lifecycle;
- authentication events.

Não deve:

- implementar regras de autorização;
- gerenciar permissões;
- executar queries diretamente.

---

# 15. AuthService Interface

Exemplo:

```python
class AuthService:
    async def authenticate(
        self,
        credentials: LoginCredentials,
    ) -> AuthenticationResult:
        ...

    async def logout(
        self,
        session_id: UUID,
    ) -> None:
        ...
```

---

# 16. AuthenticationResult

Resposta padronizada:

```python
class AuthenticationResult(BaseModel):
    access_token: str
    refresh_token: str | None
    token_type: str = "bearer"
    expires_in: int
```

O formato definitivo deve seguir a estratégia de autenticação adotada no projeto.

---

# 17. TokenService

Responsável por:

- gerar tokens;
- validar tokens;
- extrair claims;
- verificar expiração;
- tratar token rotation quando aplicável.

---

# 18. Token Claims

Claims devem ser mínimas.

Exemplos:

```text
sub
iss
aud
iat
exp
jti
```

Claims adicionais somente quando justificadas.

Não colocar grandes objetos no JWT.

---

# 19. PasswordService

Responsável por:

```text
hash
verify
password policy
```

Nunca implementar hashing manualmente.

Utilizar algoritmo moderno recomendado pela biblioteca de segurança adotada.

---

# 20. SessionService

Quando houver sessões persistentes:

```text
create_session
get_session
revoke_session
revoke_all_sessions
```

Deve permitir controle de sessão por usuário.

---

# 21. CurrentUser

Dependency padrão:

```python
current_user = Depends(get_current_user)
```

Responsabilidade:

- validar autenticação;
- recuperar identidade;
- retornar contexto autenticado.

Não deve decidir autorização específica de cada recurso.

---

# 22. Authorization Components

Componentes:

```text
PermissionService
PolicyService
RoleService
TenantAccessService
ResourceAccessService
```

---

# 23. PermissionService

Responsável por verificar permissões.

Interface:

```python
class PermissionService:
    async def has_permission(
        self,
        actor: User,
        permission: str,
    ) -> bool:
        ...
```

---

# 24. Permission Naming

Padrão:

```text
resource:action
```

Exemplos:

```text
users:read
users:create
users:update
users:delete

documents:read
documents:create
documents:share
documents:delete
```

---

# 25. Permission Dependency

Permissões devem poder ser declaradas no endpoint.

Exemplo:

```python
Depends(require_permission("users:delete"))
```

---

# 26. RoleService

Responsável por:

```text
role lookup
role assignment
role removal
role validation
```

Roles não devem substituir permissions quando granularidade for necessária.

---

# 27. PolicyService

Responsável por regras de autorização mais complexas.

Exemplo:

```text
User can edit document if:

user has documents:update
AND
document belongs to user's tenant
AND
document is editable
```

---

# 28. ResourceAccessService

Responsável por verificar acesso ao recurso.

Exemplo:

```python
await resource_access.can_access(
    actor=current_user,
    resource=document,
    action="read",
)
```

---

# 29. TenantAccessService

Responsável por validar acesso a tenants.

Não confiar exclusivamente em `tenant_id` recebido pelo cliente.

---

# 30. Database Components

Componentes:

```text
DatabaseSession
Repository
UnitOfWork
TransactionManager
QueryBuilder
```

---

# 31. DatabaseSession

Dependency responsável por fornecer `AsyncSession`.

Exemplo:

```python
async def get_db() -> AsyncIterator[AsyncSession]:
    ...
```

---

# 32. Repository

Repositories encapsulam persistência.

Exemplo:

```python
class UserRepository:
    async def get_by_id(self, user_id: UUID) -> User | None:
        ...

    async def create(self, user: User) -> User:
        ...
```

---

# 33. Repository Rules

Repository não deve:

- conhecer HTTP;
- gerar HTTP exceptions;
- autenticar usuários;
- enviar emails;
- chamar LLMs.

---

# 34. UnitOfWork

Utilizar quando uma operação precisar coordenar múltiplos repositories.

Exemplo:

```python
async with unit_of_work:
    user = await users.create(...)
    await audit.create(...)
    await unit_of_work.commit()
```

---

# 35. UnitOfWork Responsibility

Responsável por:

```text
transaction boundary
repository lifecycle
commit
rollback
```

---

# 36. TransactionManager

Quando necessário, fornecer abstração explícita:

```python
async with transaction_manager.transaction():
    ...
```

Não utilizar quando a própria Unit of Work já resolver o problema.

---

# 37. Pagination Component

Componente padrão:

```text
Pagination
PaginationParams
PaginationMeta
PaginationResult
CursorPagination
```

---

# 38. PaginationParams

```python
class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
```

---

# 39. PaginationMeta

```python
class PaginationMeta(BaseModel):
    page: int
    page_size: int
    total: int
    has_next: bool
    has_previous: bool
```

---

# 40. PaginationResult

```python
class PaginationResult(Generic[T]):
    data: list[T]
    meta: PaginationMeta
```

---

# 41. CursorPagination

Para grandes datasets:

```text
CursorPagination
CursorEncoder
CursorDecoder
```

Cursor deve ser opaco para o consumidor.

---

# 42. Filtering Component

```text
FilterParser
FilterSchema
FilterBuilder
```

Filtros devem possuir whitelist de campos.

---

# 43. Sorting Component

```text
SortParser
SortField
SortDirection
```

Exemplo:

```text
?sort=-created_at,name
```

---

# 44. Search Component

```text
SearchQuery
SearchService
SearchStrategy
```

Deve possuir:

```text
minimum length
maximum length
allowed fields
rate limits
```

---

# 45. Error Components

Componentes:

```text
ApplicationError
ValidationError
NotFoundError
ConflictError
AuthenticationError
AuthorizationError
ExternalServiceError
RateLimitError
```

---

# 46. ApplicationError

Base:

```python
class ApplicationError(Exception):
    code: str
    message: str
```

---

# 47. ErrorMapper

Responsável por transformar erros internos em respostas HTTP.

Fluxo:

```text
Domain Error
      ↓
Application Error
      ↓
Error Mapper
      ↓
HTTP Response
```

---

# 48. ErrorResponse

Padrão:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource not found",
    "details": {},
    "request_id": "req_123"
  }
}
```

---

# 49. ValidationError

Deve representar erros de entrada ou regras de validação.

Não utilizar para problemas de infraestrutura.

---

# 50. NotFoundError

Utilizado quando um recurso esperado não existe ou não pode ser exposto ao ator.

Em determinados cenários, retornar 404 em vez de 403 pode evitar resource enumeration.

---

# 51. ConflictError

Utilizado para:

```text
duplicate resource
invalid state transition
concurrent modification
business conflict
```

---

# 52. ExternalServiceError

Representa falhas em:

```text
API
provider
storage
AI provider
payment provider
email
```

---

# 53. Audit Components

Componentes:

```text
AuditService
AuditEvent
AuditRepository
AuditContext
```

---

# 54. AuditService

Responsável por registrar ações relevantes.

Exemplo:

```python
await audit_service.record(
    action="USER_CREATED",
    actor_id=actor.id,
    resource_type="user",
    resource_id=user.id,
)
```

---

# 55. AuditEvent

Campos recomendados:

```text
event_id
action
actor_id
tenant_id
resource_type
resource_id
timestamp
ip_address
request_id
metadata
```

---

# 56. Audit Categories

Categorias podem incluir:

```text
AUTHENTICATION
AUTHORIZATION
DATA
ADMINISTRATION
SECURITY
AI
INTEGRATION
```

---

# 57. Audit vs Logging

Não utilizar logs como substituto de auditoria.

```text
Logger
→ operacional

AuditService
→ governança e rastreabilidade
```

---

# 58. Observability Components

Componentes:

```text
StructuredLogger
MetricsService
TracingService
HealthService
ReadinessService
```

---

# 59. StructuredLogger

Logs devem possuir estrutura consistente.

Campos recomendados:

```text
timestamp
level
service
environment
request_id
trace_id
user_id
tenant_id
event
duration
```

---

# 60. MetricsService

Métricas podem incluir:

```text
request_count
request_latency
error_count
database_latency
external_api_latency
queue_depth
job_duration
ai_tokens
ai_cost
```

---

# 61. TracingService

Tracing deve permitir acompanhar:

```text
API
 ↓
Service
 ↓
Database
 ↓
External API
 ↓
AI Provider
```

---

# 62. HealthService

Health check deve verificar somente dependências necessárias para determinar saúde operacional.

---

# 63. Health Endpoints

Padrão recomendado:

```text
GET /health
GET /ready
```

`/health`:

```text
process alive
```

`/ready`:

```text
ready to receive traffic
```

---

# 64. Cache Components

Componentes:

```text
CacheService
CacheKeyBuilder
CachePolicy
CacheInvalidator
```

---

# 65. CacheService

Interface:

```python
class CacheService:
    async def get(self, key: str): ...
    async def set(self, key: str, value, ttl: int): ...
    async def delete(self, key: str): ...
```

---

# 66. CachePolicy

Toda utilização deve definir:

```text
TTL
key
serialization
invalidation
fallback
```

---

# 67. CacheKeyBuilder

Keys devem ser determinísticas e namespaced.

Exemplo:

```text
user:{user_id}
tenant:{tenant_id}:users:{page}
```

---

# 68. Storage Components

Componentes:

```text
StorageService
StorageProvider
UploadService
DownloadService
FileValidator
```

---

# 69. StorageService

Interface:

```python
class StorageService:
    async def upload(...):
        ...

    async def download(...):
        ...

    async def delete(...):
        ...
```

---

# 70. StorageProvider

Implementações:

```text
S3StorageProvider
GCSStorageProvider
AzureStorageProvider
LocalStorageProvider
```

---

# 71. FileValidator

Validar:

```text
extension
MIME type
size
content
checksum
malware policy
```

quando aplicável.

Nunca confiar somente na extensão.

---

# 72. UploadService

Fluxo padrão:

```text
Receive
 ↓
Validate
 ↓
Authorize
 ↓
Store
 ↓
Persist metadata
 ↓
Audit
```

---

# 73. Webhook Components

Componentes:

```text
WebhookProcessor
WebhookVerifier
WebhookEvent
WebhookRepository
WebhookDispatcher
```

---

# 74. WebhookVerifier

Responsável por:

```text
signature validation
timestamp validation
replay protection
provider validation
```

---

# 75. WebhookProcessor

Fluxo:

```text
Webhook
 ↓
Verify
 ↓
Validate Schema
 ↓
Persist Event
 ↓
ACK
 ↓
Async Processing
```

---

# 76. WebhookEvent

Deve possuir:

```text
event_id
provider
event_type
received_at
payload
signature
status
processing_attempts
```

---

# 77. Webhook Idempotency

Eventos devem possuir mecanismo de deduplicação.

Exemplo:

```text
provider + event_id
```

com constraint apropriada.

---

# 78. Job Components

Componentes:

```text
JobService
JobQueue
JobProcessor
JobStatus
JobRepository
RetryPolicy
```

---

# 79. JobService

Responsável por criar e acompanhar jobs.

Exemplo:

```python
job = await job_service.enqueue(
    job_type="document.process",
    payload={"document_id": str(document.id)},
)
```

---

# 80. JobProcessor

Responsável por:

```text
execute
retry
fail
complete
```

---

# 81. RetryPolicy

Deve definir:

```text
max_attempts
backoff
jitter
retryable_errors
```

---

# 82. Dead Letter

Jobs que excederem retry devem poder ser direcionados para:

```text
Dead Letter Queue
```

quando suportado pela infraestrutura.

---

# 83. Notification Components

Componentes:

```text
NotificationService
NotificationProvider
NotificationTemplate
NotificationPreference
```

---

# 84. NotificationService

Responsável por orquestrar notificações.

```text
NotificationService
        ↓
Provider
```

---

# 85. NotificationProvider

Exemplos:

```text
EmailProvider
SlackProvider
TeamsProvider
PushProvider
SMSProvider
```

---

# 86. NotificationTemplate

Templates devem ser versionáveis.

Exemplo:

```text
user_invitation:v1
password_reset:v2
report_ready:v1
```

---

# 87. Notification Preferences

Usuários podem possuir preferências:

```text
email
push
slack
digest
marketing
system
```

A aplicação deve respeitar essas preferências quando aplicável.

---

# 88. External Integration Components

Componentes:

```text
ExternalClient
ProviderAdapter
RetryPolicy
CircuitBreaker
IntegrationHealth
```

---

# 89. ExternalClient

Responsável por comunicação HTTP.

Deve possuir:

```text
timeout
retry
auth
headers
logging
metrics
tracing
```

---

# 90. ProviderAdapter

Adaptar API externa para modelo interno.

Exemplo:

```text
GitHub API
    ↓
GitHubProvider
    ↓
InternalRepository
```

---

# 91. CircuitBreaker

Para integrações críticas e instáveis, considerar circuit breaker.

Estados:

```text
CLOSED
OPEN
HALF_OPEN
```

Não utilizar indiscriminadamente.

---

# 92. AI Components

Componentes principais:

```text
AIService
LLMGateway
AIProvider
PromptService
StructuredOutputParser
TokenTracker
AICostTracker
AIUsageTracker
GuardrailService
AIContextBuilder
```

---

# 93. AIService

Responsável pela orquestração de operações de IA.

Exemplo:

```python
result = await ai_service.generate(
    task="document_summary",
    input=document,
)
```

---

# 94. LLMGateway

O gateway deve abstrair o provider.

Fluxo:

```text
Application
    ↓
AIService
    ↓
LLMGateway
    ↓
Provider
```

---

# 95. AIProvider

Interface:

```python
class AIProvider(Protocol):
    async def generate(
        self,
        request: AIRequest,
    ) -> AIResponse:
        ...
```

---

# 96. Provider Implementations

Exemplos:

```text
OpenAIProvider
AnthropicProvider
GeminiProvider
LocalModelProvider
```

Os providers não devem ser acessados diretamente pelo domínio.

---

# 97. AIRequest

Deve possuir campos como:

```text
model
messages
temperature
max_tokens
response_format
tools
metadata
timeout
```

---

# 98. AIResponse

Deve permitir registrar:

```text
content
model
provider
usage
finish_reason
latency
metadata
```

---

# 99. PromptService

Responsável por:

```text
prompt retrieval
prompt version
template rendering
variable validation
```

---

# 100. Prompt Registry

Prompts devem possuir identificador:

```text
document.summary
invoice.extract
support.answer
```

e versão:

```text
v1
v2
```

---

# 101. StructuredOutputParser

Responsável por transformar output de LLM em schema validado.

Fluxo:

```text
LLM
 ↓
Raw Output
 ↓
Parser
 ↓
Pydantic Schema
 ↓
Domain
```

---

# 102. AI GuardrailService

Responsável por políticas relacionadas à IA.

Pode incluir:

```text
input validation
output validation
content policy
PII detection
tool restrictions
maximum context
```

---

# 103. TokenTracker

Registrar:

```text
input_tokens
output_tokens
total_tokens
```

por operação.

---

# 104. AICostTracker

Calcular custo estimado quando possível.

Campos:

```text
provider
model
tokens
unit_price
estimated_cost
currency
```

---

# 105. AIUsageTracker

Permitir métricas por:

```text
user
tenant
feature
model
provider
request
```

---

# 106. AIContextBuilder

Responsável por construir contexto enviado ao modelo.

Exemplo:

```text
User Context
+
Conversation
+
Retrieved Documents
+
System Instructions
+
Tool Context
```

---

# 107. ToolRegistry

Ferramentas disponíveis para agents devem ser registradas.

Exemplo:

```python
tool_registry.register(
    name="get_user",
    handler=get_user,
    permission="users:read",
)
```

---

# 108. ToolDefinition

Toda tool deve possuir:

```text
name
description
input_schema
output_schema
permissions
timeout
risk_level
```

---

# 109. ToolExecutor

Fluxo:

```text
Tool Request
 ↓
Schema Validation
 ↓
Authorization
 ↓
Execution
 ↓
Output Validation
 ↓
Audit
```

---

# 110. Tool Risk Levels

Classificar tools:

```text
READ
LOW_RISK_WRITE
HIGH_RISK_WRITE
CRITICAL
```

---

# 111. AgentService

Agents devem ser encapsulados.

Responsabilidades:

```text
planning
tool selection
execution loop
iteration limit
timeout
budget
```

---

# 112. AgentPolicy

Toda execução de agent deve possuir:

```text
max_iterations
max_tool_calls
max_tokens
timeout
allowed_tools
budget
```

---

# 113. RAG Components

Componentes:

```text
DocumentLoader
DocumentParser
Chunker
EmbeddingService
EmbeddingProvider
VectorRepository
Retriever
Reranker
ContextBuilder
```

---

# 114. DocumentLoader

Responsável por carregar:

```text
PDF
DOCX
TXT
HTML
CSV
XLSX
```

conforme capacidades do projeto.

---

# 115. DocumentParser

Transforma conteúdo bruto em representação estruturada.

---

# 116. Chunker

Responsável por dividir documentos.

Configurações podem incluir:

```text
chunk_size
chunk_overlap
strategy
```

Esses valores devem ser configuráveis por domínio quando necessário.

---

# 117. EmbeddingService

Interface:

```python
class EmbeddingService:
    async def embed(
        self,
        texts: list[str],
    ) -> list[list[float]]:
        ...
```

---

# 118. EmbeddingProvider

Implementações:

```text
OpenAIEmbeddingProvider
GeminiEmbeddingProvider
LocalEmbeddingProvider
```

---

# 119. VectorRepository

Responsável por:

```text
store embeddings
search vectors
delete vectors
filter metadata
```

---

# 120. Retriever

Responsável por recuperar contexto relevante.

Pode suportar:

```text
semantic search
keyword search
hybrid search
metadata filtering
```

---

# 121. Reranker

Opcional.

Fluxo:

```text
Query
 ↓
Retriever
 ↓
Top N
 ↓
Reranker
 ↓
Top K
```

---

# 122. Event Components

Componentes:

```text
EventBus
EventPublisher
EventHandler
DomainEvent
IntegrationEvent
```

---

# 123. EventBus

Responsável por distribuir eventos internamente.

---

# 124. EventPublisher

Responsável por publicar eventos externos.

Pode utilizar:

```text
SQS
Kafka
RabbitMQ
SNS
Redis Streams
```

dependendo da infraestrutura.

---

# 125. EventHandler

Handlers devem ser:

```text
idempotent
observable
retryable
small
```

---

# 126. Feature Flag Components

Componentes:

```text
FeatureFlagService
FeatureFlagEvaluator
FeatureFlagContext
```

---

# 127. FeatureFlagService

Exemplo:

```python
enabled = await feature_flags.is_enabled(
    "new_dashboard",
    context,
)
```

---

# 128. FeatureFlagContext

Pode considerar:

```text
user_id
tenant_id
environment
role
attributes
```

---

# 129. Configuration Components

Componentes:

```text
Settings
EnvironmentConfig
SecretProvider
ConfigValidator
```

---

# 130. SecretProvider

Abstração:

```python
class SecretProvider(Protocol):
    async def get(self, key: str) -> str:
        ...
```

Possíveis implementações:

```text
EnvironmentSecretProvider
AWSSecretsManagerProvider
VaultProvider
```

---

# 131. Security Components

Componentes:

```text
RateLimitService
SecurityHeaders
CORSConfig
APIKeyService
EncryptionService
SignatureVerifier
```

---

# 132. RateLimitService

Responsável por:

```text
identify actor
identify endpoint
count requests
enforce policy
```

---

# 133. APIKeyService

Responsável por:

```text
generate
hash
validate
revoke
rotate
```

API keys não devem ser armazenadas em plaintext.

---

# 134. SignatureVerifier

Reutilizável para:

```text
webhooks
signed URLs
internal callbacks
external signatures
```

---

# 135. EncryptionService

Quando houver necessidade de criptografia de dados em aplicação.

Responsabilidades:

```text
encrypt
decrypt
key version
rotation
```

Não implementar criptografia manualmente.

---

# 136. URL Components

Quando necessário:

```text
URLSigner
URLBuilder
RedirectValidator
```

Devem impedir open redirects quando houver URLs fornecidas pelo usuário.

---

# 137. Testing Components

Componentes reutilizáveis:

```text
TestDatabase
APIClientFixture
AuthFixture
TenantFixture
Factory
MockProvider
```

---

# 138. Factory Pattern

Factories devem ser utilizadas para dados de teste complexos.

Exemplo:

```python
user = UserFactory.create()
```

Não utilizar factories para esconder lógica importante.

---

# 139. Test Provider

Para integrações:

```text
FakeAIProvider
FakeEmailProvider
FakeStorageProvider
FakePaymentProvider
```

Devem implementar as mesmas interfaces dos providers reais.

---

# 140. Component Dependency Rules

Componentes devem possuir dependências mínimas.

Exemplo:

```text
PermissionService
    ↓
UserRepository

não:

PermissionService
    ↓
FastAPI
    ↓
Slack
    ↓
AI
    ↓
Storage
```

---

# 141. Component Composition

Componentes devem ser combináveis.

Exemplo:

```text
UserService
 ├── UserRepository
 ├── PermissionService
 ├── AuditService
 └── NotificationService
```

---

# 142. Component Boundaries

Um componente deve possuir uma responsabilidade clara.

Se a descrição começa com:

```text
"This service handles..."
```

e possui muitos "and", provavelmente precisa ser dividido.

---

# 143. Component Discovery

O projeto deve possuir documentação pesquisável:

```text
docs/
└── components/
    ├── authentication.md
    ├── authorization.md
    ├── pagination.md
    ├── audit.md
    ├── ai.md
    └── storage.md
```

---

# 144. Component Registry

Projetos maiores podem manter um registry:

```text
Component
Owner
Status
Version
Location
Dependencies
Usage
```

---

# 145. Component Versioning

Breaking changes devem resultar em versionamento apropriado.

Exemplo:

```text
NotificationService v1
NotificationService v2
```

Não quebrar consumidores silenciosamente.

---

# 146. Deprecation

Componente deprecated deve informar:

```text
deprecated_since
replacement
removal_target
migration_notes
```

---

# 147. Component Ownership

Componentes críticos devem possuir owner técnico.

Exemplos:

```text
AuthService → Identity
AIService → AI Platform
StorageService → Platform
AuditService → Security
```

---

# 148. Component Security Classification

Componentes devem possuir classificação:

```text
PUBLIC
INTERNAL
SENSITIVE
CRITICAL
```

Exemplos:

```text
Pagination → PUBLIC

AuthService → CRITICAL

TokenService → CRITICAL

AIService → SENSITIVE
```

---

# 149. Component Observability

Componentes críticos devem produzir métricas.

Exemplo:

```text
AuthService
→ authentication_success
→ authentication_failure

AIService
→ ai_requests
→ ai_latency
→ ai_tokens
→ ai_cost

JobService
→ jobs_started
→ jobs_completed
→ jobs_failed
```

---

# 150. Component Testing Requirements

Cada componente deve possuir:

```text
Unit Tests
Integration Tests when applicable
Failure Tests
Security Tests when applicable
```

---

# 151. Component Documentation

Documentação mínima:

```text
Purpose
Interface
Example
Dependencies
Errors
Security
Observability
Testing
```

---

# 152. Component Creation Rule

Antes de criar um novo componente:

```text
1. Search existing catalog.
2. Search existing codebase.
3. Identify reusable component.
4. Determine whether extension is possible.
5. Only then create new component.
```

---

# 153. AI Component Creation Rule

Agentes de IA devem obrigatoriamente verificar o catálogo antes de criar:

```text
Service
Repository
Provider
Client
Utility
Middleware
Dependency
```

---

# 154. AI Anti-Pattern

Nunca permitir automaticamente:

```python
class NewAuthManager:
    ...
```

quando já existir:

```text
AuthService
TokenService
SessionService
```

---

# 155. AI Reuse Strategy

Ao receber uma nova tarefa, a IA deve executar:

```text
Understand requirement
        ↓
Search Component Catalog
        ↓
Search existing implementation
        ↓
Reuse
        ↓
Extend
        ↓
Create only if necessary
```

---

# 156. Component Selection Matrix

Antes de escolher um componente:

| Necessidade | Componente |
|---|---|
| Login | `AuthService` |
| JWT | `TokenService` |
| Senhas | `PasswordService` |
| Permissão | `PermissionService` |
| Policy complexa | `PolicyService` |
| Tenant | `TenantAccessService` |
| Persistência | `Repository` |
| Transaction | `UnitOfWork` |
| Paginação | `Pagination` |
| Erros | `ApplicationError` |
| Auditoria | `AuditService` |
| Logs | `StructuredLogger` |
| Métricas | `MetricsService` |
| Cache | `CacheService` |
| Arquivos | `StorageService` |
| Webhooks | `WebhookProcessor` |
| Jobs | `JobService` |
| Notificações | `NotificationService` |
| HTTP externo | `ExternalClient` |
| IA | `AIService` |
| LLM | `LLMGateway` |
| Provider | `AIProvider` |
| Prompt | `PromptService` |
| Tool | `ToolRegistry` |
| Agent | `AgentService` |
| Embeddings | `EmbeddingService` |
| RAG | `Retriever` |
| Feature flags | `FeatureFlagService` |
| Secrets | `SecretProvider` |
| API Keys | `APIKeyService` |
| Rate limit | `RateLimitService` |

---

# 157. Standard Service Composition

Um service típico pode possuir:

```text
Service
├── Repository
├── PermissionService
├── AuditService
├── EventPublisher
├── NotificationService
└── ExternalClient
```

Somente adicionar dependências realmente necessárias.

---

# 158. Standard AI Service Composition

Uma operação de IA pode seguir:

```text
AIService
├── PromptService
├── LLMGateway
├── GuardrailService
├── StructuredOutputParser
├── TokenTracker
├── CostTracker
└── AuditService
```

---

# 159. Standard Document AI Composition

Para processamento de documentos:

```text
DocumentService
├── StorageService
├── DocumentParser
├── Chunker
├── EmbeddingService
├── VectorRepository
├── AIService
├── AuditService
└── JobService
```

---

# 160. Standard Secure Mutation

Operações de escrita sensíveis devem seguir:

```text
Request
 ↓
Authentication
 ↓
Authorization
 ↓
Validation
 ↓
Business Rule
 ↓
Transaction
 ↓
Persistence
 ↓
Audit
 ↓
Event
 ↓
Response
```

---

# 161. Standard Read Operation

Operações de leitura:

```text
Request
 ↓
Authentication
 ↓
Authorization
 ↓
Tenant / Ownership Validation
 ↓
Repository
 ↓
Schema
 ↓
Response
```

---

# 162. Standard Async Operation

Operações pesadas:

```text
Request
 ↓
Validate
 ↓
Authorize
 ↓
Create Job
 ↓
Queue
 ↓
202 Accepted
```

---

# 163. Standard Webhook

```text
Webhook
 ↓
Signature Verification
 ↓
Schema Validation
 ↓
Idempotency Check
 ↓
Persist
 ↓
ACK
 ↓
Async Processing
 ↓
Audit
```

---

# 164. Standard AI Request

```text
Request
 ↓
Authentication
 ↓
Authorization
 ↓
Rate Limit
 ↓
Input Validation
 ↓
Guardrails
 ↓
Context Construction
 ↓
LLM Gateway
 ↓
Provider
 ↓
Output Validation
 ↓
Business Validation
 ↓
Usage Tracking
 ↓
Audit
 ↓
Response
```

---

# 165. Standard AI Tool Mutation

```text
Agent
 ↓
Tool Request
 ↓
Input Validation
 ↓
Permission Check
 ↓
Resource Access Check
 ↓
Risk Evaluation
 ↓
Approval if required
 ↓
Execution
 ↓
Audit
 ↓
Output Validation
```

---

# 166. Anti-Patterns

Não criar:

```text
GodService
GodRepository
GodUtils
GodController
GodAIService
```

---

# 167. Anti-Pattern — Direct Database in Router

Evitar:

```python
@router.get("/users")
async def users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(...)
```

quando a lógica de acesso puder ser encapsulada em repository/service.

---

# 168. Anti-Pattern — Direct AI in Router

Evitar:

```python
@router.post("/summary")
async def summary():
    response = await openai.chat.completions.create(...)
```

Preferir:

```text
Router
 ↓
AIService
 ↓
LLMGateway
 ↓
Provider
```

---

# 169. Anti-Pattern — Direct SDK Usage

Evitar SDKs espalhados:

```text
openai
stripe
boto3
slack_sdk
github
```

Preferir adapters/providers.

---

# 170. Anti-Pattern — Generic Utils

Evitar:

```text
utils.py
helpers.py
common.py
misc.py
```

como depósitos de código sem domínio claro.

---

# 171. Anti-Pattern — Service Leakage

Não permitir que um service dependa diretamente de detalhes internos de outro service.

Preferir contratos claros.

---

# 172. Anti-Pattern — Circular Dependencies

Evitar:

```text
UserService
 ↓
PermissionService
 ↓
UserService
```

Resolver através de:

```text
Domain
Policy
Repository
Event
```

ou reorganização das responsabilidades.

---

# 173. Anti-Pattern — Hidden Side Effects

Métodos como:

```python
user_service.get_user()
```

não devem silenciosamente:

```text
send email
create audit
call AI
publish event
```

sem que isso faça parte claramente do contrato.

---

# 174. Anti-Pattern — Over-Abstraction

Não criar interfaces para tudo.

Exemplo desnecessário:

```text
IUserService
IUserServiceFactory
IUserServiceProvider
IUserServiceManager
```

quando existe apenas uma implementação e nenhum benefício arquitetural.

---

# 175. Anti-Pattern — Framework Leakage

Domain code não deve depender diretamente de:

```text
FastAPI
Request
HTTPException
BackgroundTasks
```

quando isso puder ser evitado.

---

# 176. Anti-Pattern — Security Through UI

Nunca considerar:

```text
frontend hidden button
frontend route
frontend role
```

como autorização.

---

# 177. Anti-Pattern — Trusting AI Output

Nunca executar automaticamente:

```text
LLM output
```

como comando confiável.

Sempre validar e autorizar.

---

# 178. Anti-Pattern — Unbounded Agents

Nunca permitir agents sem:

```text
timeout
iteration limit
tool limit
token limit
cost limit
```

---

# 179. Component Quality Gate

Um novo componente só deve entrar no catálogo se:

- [ ] possuir responsabilidade clara;
- [ ] possuir interface;
- [ ] possuir testes;
- [ ] possuir documentação;
- [ ] possuir tratamento de erros;
- [ ] possuir modelo de segurança;
- [ ] possuir observabilidade quando necessário;
- [ ] possuir pelo menos um caso real de uso;
- [ ] não duplicar componente existente.

---

# 180. Component Review Checklist

Durante code review:

```text
[ ] Existe componente equivalente?
[ ] O componente está no nível correto?
[ ] A interface é pequena?
[ ] A responsabilidade está clara?
[ ] Existem dependências desnecessárias?
[ ] Existe acoplamento com framework?
[ ] Existe risco de segurança?
[ ] Existe observabilidade?
[ ] Existem testes?
[ ] Pode ser reutilizado?
[ ] A abstração é realmente necessária?
```

---

# 181. Golden Component Set

Todo backend Loft deve considerar como baseline:

```text
Core
├── Settings
├── RequestContext
├── Clock
└── IDGenerator

Authentication
├── AuthService
├── TokenService
├── PasswordService
└── SessionService

Authorization
├── PermissionService
├── PolicyService
├── RoleService
├── TenantAccessService
└── ResourceAccessService

Persistence
├── Repository
├── UnitOfWork
└── TransactionManager

API
├── Pagination
├── Filtering
├── Sorting
├── ErrorMapper
└── Response schemas

Observability
├── StructuredLogger
├── MetricsService
├── TracingService
└── HealthService

Security
├── RateLimitService
├── APIKeyService
├── SignatureVerifier
└── EncryptionService

Platform
├── CacheService
├── StorageService
├── JobService
├── WebhookProcessor
├── NotificationService
└── ExternalClient

AI
├── AIService
├── LLMGateway
├── AIProvider
├── PromptService
├── GuardrailService
├── StructuredOutputParser
├── ToolRegistry
├── ToolExecutor
├── AgentService
├── EmbeddingService
├── VectorRepository
└── Retriever

Governance
├── AuditService
├── FeatureFlagService
└── SecretProvider
```

---

# 182. Recommended Package Structure

Uma implementação de referência pode utilizar:

```text
app/
├── api/
│   ├── dependencies/
│   ├── middleware/
│   └── v1/
│
├── core/
│   ├── config.py
│   ├── context.py
│   ├── exceptions.py
│   ├── logging.py
│   ├── security.py
│   └── telemetry.py
│
├── domain/
│   ├── users/
│   ├── documents/
│   ├── billing/
│   └── ...
│
├── services/
│   ├── auth/
│   ├── authorization/
│   ├── audit/
│   ├── notifications/
│   ├── storage/
│   └── ...
│
├── repositories/
│   ├── users/
│   ├── documents/
│   └── ...
│
├── infrastructure/
│   ├── database/
│   ├── redis/
│   ├── storage/
│   ├── messaging/
│   └── external/
│
├── ai/
│   ├── gateway/
│   ├── providers/
│   ├── prompts/
│   ├── tools/
│   ├── agents/
│   ├── embeddings/
│   └── rag/
│
├── models/
├── schemas/
├── jobs/
├── events/
└── tests/
```

---

# 183. Domain Components vs Platform Components

É importante distinguir:

```text
Platform Component
```

de:

```text
Domain Component
```

Platform:

```text
AuthService
AuditService
StorageService
AIService
Pagination
```

Domain:

```text
PayrollComparisonService
PropertyService
LeadService
DocumentApprovalService
```

Platform components podem ser reutilizados entre projetos.

Domain components pertencem ao produto.

---

# 184. Do Not Force Reuse

Nem todo código precisa virar componente compartilhado.

Só promover para componente quando existir:

```text
repeated usage
stable behavior
clear interface
cross-domain value
```

---

# 185. Shared Components

Quando um componente possuir uso transversal entre projetos, avaliar criação de package compartilhado.

Exemplo:

```text
loft-backend-core
```

Pode conter:

```text
pagination
errors
logging
auth primitives
observability
common schemas
```

Não deve conter regras de negócio.

---

# 186. Package Boundaries

Packages compartilhados devem evitar dependências específicas de produto.

Um package comum não deve depender de:

```text
Payroll
Property
Lead
Campaign
```

---

# 187. Component Registry as Source of Truth

O catálogo deve ser considerado a fonte oficial para componentes reutilizáveis.

Quando uma implementação divergir do catálogo, deve existir:

```text
justification
ADR
migration plan
```

quando aplicável.

---

# 188. AI as a First-Class Consumer

O catálogo deve ser escrito de maneira que agentes de IA consigam determinar:

```text
Which component?
When to use?
When not to use?
Required inputs?
Expected outputs?
Security requirements?
Examples?
```

---

# 189. AI Implementation Protocol

Toda IA que implementar backend deve seguir:

```text
STEP 1
Read Foundation.

STEP 2
Read Engineering System.

STEP 3
Search Component Catalog.

STEP 4
Identify reusable components.

STEP 5
Reuse existing components.

STEP 6
Extend components when appropriate.

STEP 7
Create new components only when justified.

STEP 8
Update tests.

STEP 9
Update documentation.

STEP 10
Update catalog if a reusable component was created.
```

---

# 190. Final Principle

O Backend Component Catalog não existe para impedir evolução.

Ele existe para impedir **reinvenção desnecessária**.

A regra geral é:

```text
Reuse
  ↓
Extend
  ↓
Compose
  ↓
Only then
  ↓
Create
```

O backend Loft deve evoluir através de componentes pequenos, explícitos, testáveis e observáveis.

A arquitetura deve ser suficientemente padronizada para que diferentes equipes e agentes de IA produzam código compatível entre si, mas suficientemente flexível para que o domínio continue determinando a solução.

---

# 191. Final Component Standard

Todo componente Loft deve buscar:

```text
Small
Explicit
Typed
Testable
Secure
Observable
Composable
Documented
Reusable
AI-Friendly
```

E toda nova implementação deve responder:

```text
"Por que este componente precisa existir?"
```

antes de responder:

```text
"Como este componente será implementado?"
```