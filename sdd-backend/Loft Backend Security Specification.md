# Loft Backend Security Specification

## Volume VI — Backend Security Specification (BSS)

**Status:** Foundation  
**Version:** 1.0  
**Parent Standard:** Loft Backend Foundation — Volume I  
**Engineering Standard:** Loft Backend Design & Engineering System — Volume II  
**Component Standard:** Loft Backend Component Catalog — Volume III  
**API Standard:** Loft Backend API Specification — Volume IV  
**AI Standard:** Loft Backend AI Specification — Volume V  
**Architecture:** Security by Design + Zero Trust + API First + AI First  
**Primary Framework:** FastAPI  
**Schema Layer:** Pydantic v2  
**ORM:** SQLAlchemy 2.x  
**Authentication:** OAuth2 / OIDC / JWT  
**Authorization:** RBAC + ABAC  
**Security Reference:** OWASP API Security Top 10 + OWASP ASVS

---

# 1. Objetivo

O Loft Backend Security Specification define os padrões obrigatórios de segurança para APIs e serviços backend.

O objetivo é estabelecer uma arquitetura:

```text
Secure by Default
Least Privilege
Zero Trust
Defense in Depth
Fail Secure
Explicit Authorization
Auditable
Tenant Isolated
```

Segurança deve ser tratada como requisito arquitetural e não como uma etapa posterior ao desenvolvimento.

## Security Configuration (Valores Padrão Canônicos Loft)

Toda aplicação cliente e serviço backend construído no ecossistema Loft deve adotar os seguintes valores canônicos de configuração de segurança (salvo exceção formal aprovada em ADR):

| Parâmetro | Chave de Configuração / Env | Valor Padrão Canônico | Descrição e Regra Operacional |
| :--- | :--- | :--- | :--- |
| **Access Token TTL** | `ACCESS_TOKEN_EXPIRE_MINUTES` / `JWT_ACCESS_TTL_SECONDS` | `60 minutos` (`3600 segundos`) | Tempo de vida máximo do token JWT de acesso (`type: "access"`). |
| **Refresh Token TTL** | `REFRESH_TOKEN_EXPIRE_DAYS` / `JWT_REFRESH_TTL_SECONDS` | `7 dias` (`604800 segundos`) | Tempo de vida máximo do refresh token (`type: "refresh"`) com rotação automática. |
| **Algoritmo JWT Padrão** | `JWT_ALGORITHM` | `HS256` (simétrico) / `RS256` (federado) | Algoritmo obrigatório na allowlist de validação JWT. Proibido aceitar `none`. |
| **Issuer / Audience JWT** | `JWT_ISSUER` / `JWT_AUDIENCE` | `loft-app-builder-iam` / `loft-ecosystem-apps` | Claims `iss` e `aud` validados em tokens emitidos pelo IAM central. |
| **Hashing de Senha** | `PASSWORD_HASH_SCHEME` | `Argon2id` (`m=65536, t=3, p=4`) | Fallback dev compatível: `PBKDF2-SHA256` (`260.000` iterações) ou `bcrypt` (`cost=12`). |
| **Política Mínima de Senha** | `PASSWORD_MIN_LENGTH` | Mínimo `8 caracteres` (Máx `128`) | Exige ao menos: 1 letra maiúscula (`A-Z`), 1 minúscula (`a-z`), 1 dígito (`0-9`) e 1 caractere especial (`!@#$%^&*()`). |
| **Limiar de Lockout** | `AUTH_LOCKOUT_THRESHOLD` | `5 tentativas falhas consecutivas` | Ao atingir 5 falhas de senha, a conta entra em estado `Locked` e retorna `HTTP 423 ACCOUNT_LOCKED`. |
| **Duração do Lockout** | `AUTH_LOCKOUT_DURATION_MINUTES` | `15 minutos` (`900 segundos`) | Desbloqueio automático após 15 min ou imediato via `/api/v1/iam/users/{id}/unlock` (`Admin`). |
| **Rate Limit (Login / Auth)** | `RATE_LIMIT_AUTH_PER_MINUTE` | `10 req/min` por IP + identificador | Exceder dispara `HTTP 429 RATE_LIMITED` com header `Retry-After: 60`. |
| **Rate Limit (API Geral)** | `RATE_LIMIT_API_PER_MINUTE` | `120 req/min` por usuário/token | Proteção contra abuso de API e scraping em rotas autenticadas. |
| **Armazenamento no Browser** | `BROWSER_TOKEN_STORAGE_POLICY` | `memory` + `sessionStorage` (`access_token`) | **Access Token:** em memória (Zustand/Context) com espelhamento opcional em `sessionStorage` (nunca `localStorage` para tokens sensíveis de longa duração). **Refresh Token:** Cookie `HttpOnly; Secure; SameSite=Strict; Path=/api/v1/iam/auth/refresh`. |

```json
{
  "security_configuration": {
    "jwt": {
      "algorithm": "HS256",
      "allowed_algorithms": ["HS256", "RS256"],
      "access_token_ttl_seconds": 3600,
      "access_token_ttl_minutes": 60,
      "refresh_token_ttl_seconds": 604800,
      "refresh_token_ttl_days": 7,
      "required_claims": ["sub", "email", "role", "permissions", "jti", "iat", "exp", "type"]
    },
    "password_policy": {
      "algorithm": "Argon2id",
      "argon2_params": { "memory_cost_kib": 65536, "time_cost": 3, "parallelism": 4 },
      "min_length": 8,
      "max_length": 128,
      "require_uppercase": true,
      "require_lowercase": true,
      "require_digit": true,
      "require_special": true
    },
    "account_lockout": {
      "max_failed_attempts": 5,
      "lockout_duration_minutes": 15,
      "lockout_duration_seconds": 900,
      "http_status_code": 423,
      "error_code": "ACCOUNT_LOCKED"
    },
    "rate_limiting": {
      "login_requests_per_minute": 10,
      "signup_requests_per_minute": 5,
      "authenticated_api_requests_per_minute": 120,
      "http_status_code": 429,
      "error_code": "RATE_LIMITED"
    },
    "browser_token_storage": {
      "access_token": "memory (Zustand store) + sessionStorage fallback",
      "refresh_token": "HttpOnly; Secure; SameSite=Strict cookie",
      "prohibited": "Never store refresh_token in localStorage"
    }
  }
}
```

---

# 2. Security First Principles

Toda aplicação deve seguir:

```text
Never Trust
Always Verify
Least Privilege
Default Deny
Explicit Authorization
Secure Failure
Minimal Exposure
Strong Identity
Complete Auditability
```

---

# 3. Security Architecture

Arquitetura de referência:

```text
                    ┌──────────────────────┐
                    │       Client         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Edge / Gateway     │
                    │                      │
                    │ TLS                  │
                    │ Rate Limit           │
                    │ WAF                  │
                    │ Request Filtering    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       FastAPI        │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
        ┌────────────┐ ┌──────────────┐ ┌──────────────┐
        │ Identity   │ │ Authorization│ │ Validation   │
        │            │ │              │ │              │
        │ OAuth/OIDC │ │ RBAC / ABAC  │ │ Pydantic     │
        │ JWT        │ │ Policies     │ │ Input        │
        └────────────┘ └──────────────┘ └──────────────┘
                │              │              │
                └──────────────┼──────────────┘
                               ▼
                    ┌──────────────────────┐
                    │ Application Services │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    ▼                      ▼
             ┌──────────────┐      ┌──────────────┐
             │ Database     │      │ External APIs│
             │ + RLS        │      │ + Services   │
             └──────────────┘      └──────────────┘
```

---

# 4. Security Layers

A aplicação deve implementar defesa em profundidade:

```text
Layer 1 — Network
Layer 2 — TLS
Layer 3 — Edge / WAF
Layer 4 — Authentication
Layer 5 — Authorization
Layer 6 — Input Validation
Layer 7 — Business Rules
Layer 8 — Database Security
Layer 9 — Secrets
Layer 10 — Audit
Layer 11 — Monitoring
Layer 12 — Incident Response
```

---

# 5. Zero Trust

Nenhuma requisição deve ser considerada confiável apenas porque:

```text
originated internally
came from known service
came from same network
came from same tenant
```

Toda requisição relevante deve possuir identidade e contexto verificáveis.

---

# 6. Authentication vs Authorization

Nunca confundir:

```text
Authentication
=
Who are you?

Authorization
=
What are you allowed to do?
```

Um usuário autenticado não possui automaticamente acesso aos recursos.

---

# 7. Identity Architecture

A identidade deve possuir:

```text
User
Identity
Credentials
Session
Tenant
Roles
Permissions
Attributes
```

---

# 8. OAuth2

Utilizar OAuth2 para delegação de autorização quando aplicável.

Evitar implementar protocolo OAuth2 manualmente.

Preferir bibliotecas maduras e amplamente utilizadas.

---

# 9. OpenID Connect

OIDC deve ser utilizado quando o sistema precisar de autenticação federada baseada em identidade.

Exemplos:

```text
Google
Microsoft Entra ID
Okta
Keycloak
Auth0
```

---

# 10. Identity Provider

O backend deve abstrair o Identity Provider.

Evitar acoplamento direto da regra de negócio ao provider.

Arquitetura:

```text
Application
    ↓
Identity Service
    ↓
OIDC / OAuth Adapter
    ↓
Identity Provider
```

---

# 11. JWT

JWT pode ser utilizado para access tokens quando apropriado.

Validar obrigatoriamente:

```text
signature
issuer
audience
expiration
not-before
algorithm
```

---

# 12. JWT Algorithm Validation

Nunca aceitar algoritmo arbitrário enviado pelo token.

O backend deve possuir uma allowlist explícita de algoritmos.

---

# 13. JWT Claims

Claims relevantes podem incluir:

```text
sub
iss
aud
exp
iat
nbf
jti
scope
roles
tenant_id
```

Somente aceitar claims necessários.

---

# 14. JWT Audience

Validar `aud`.

Um token emitido para outro serviço não deve ser automaticamente aceito.

---

# 15. JWT Issuer

Validar `iss`.

---

# 16. JWT Expiration

Sempre validar `exp`.

Tokens expirados devem ser rejeitados.

---

# 17. JWT ID

Quando necessário, utilizar `jti` para:

```text
revocation
replay detection
audit
session tracking
```

---

# 18. Access Token

Access tokens devem:

```text
have short lifetime
contain minimal claims
be scoped
be validated on every protected request
```

---

# 19. Refresh Token

Refresh tokens devem:

```text
be protected
have controlled lifetime
support revocation
be rotated when appropriate
```

---

# 20. Refresh Token Rotation

Quando aplicável:

```text
Refresh Token A
      ↓
Token Refresh
      ↓
Refresh Token B
      ↓
Invalidate A
```

---

# 21. Token Revocation

Implementar estratégia para revogar tokens quando necessário.

Casos:

```text
logout
password reset
account disabled
security incident
credential compromise
```

---

# 22. Session Security

Sessões devem possuir:

```text
expiration
revocation
identity
device/session metadata
audit
```

---

# 23. Password Authentication

Quando o sistema armazenar senhas diretamente:

```text
never store plaintext
```

Utilizar hashing adaptativo e moderno.

Preferir:

```text
Argon2id
```

ou biblioteca equivalente madura.

---

# 24. Password Policy

Definir:

```text
minimum length
breached password detection
rate limiting
lockout strategy
reset policy
```

Evitar regras excessivamente complexas que reduzam usabilidade sem benefício proporcional.

---

# 25. Password Reset

Password reset deve utilizar tokens:

```text
single-use
short-lived
random
non-predictable
```

Nunca enviar senha existente ao usuário.

---

# 26. Account Recovery

Fluxos de recuperação devem ser tratados como operações de alto risco.

Evitar:

```text
security questions
```

como único fator de recuperação.

---

# 27. MFA

Suportar MFA quando necessário.

Métodos podem incluir:

```text
TOTP
WebAuthn / Passkeys
hardware security keys
```

---

# 28. WebAuthn

Para ambientes de alta segurança, considerar WebAuthn/Passkeys.

Preferir bibliotecas maduras em vez de implementar criptografia manualmente.

---

# 29. API Authentication

APIs podem utilizar:

```text
OAuth2 Bearer Token
JWT
API Key
Service Account
mTLS
```

dependendo do caso de uso.

---

# 30. API Keys

API Keys devem:

```text
be hashed when stored
have owner
have scopes
have expiration
support revocation
be auditable
```

---

# 31. API Key Format

API Keys devem possuir identificador público e segredo separado quando possível.

Exemplo conceitual:

```text
key_id
secret
```

---

# 32. API Key Rotation

Permitir:

```text
create new key
deploy new key
revoke old key
```

sem downtime.

---

# 33. API Key Scopes

Exemplo:

```text
documents:read
documents:write
users:read
reports:read
```

Nunca fornecer acesso global por padrão.

---

# 34. Service Accounts

Serviços backend devem possuir identidades próprias.

Evitar compartilhar credenciais entre serviços.

---

# 35. Service-to-Service Authentication

Quando apropriado:

```text
OAuth2 Client Credentials
mTLS
signed requests
workload identity
```

---

# 36. Machine Identity

Toda integração backend relevante deve possuir:

```text
identity
credentials
permissions
rotation
audit
```

---

# 37. Authorization

O sistema deve utilizar autorização explícita.

Modelo:

```text
Principal
   ↓
Policy
   ↓
Resource
   ↓
Action
   ↓
Decision
```

---

# 38. RBAC

RBAC deve representar papéis de negócio.

Exemplo:

```text
GlobalAdmin
GroupAdmin
Editor
Viewer
```

---

# 39. Permission Model

Permissões devem ser granulares.

Formato recomendado:

```text
resource:action
```

Exemplo:

```text
users:read
users:create
users:update
users:delete

documents:read
documents:create
documents:update
documents:delete
```

---

# 40. Default Deny

Se não existir uma regra explícita permitindo uma ação:

```text
DENY
```

---

# 41. Least Privilege

Usuários e serviços devem possuir somente as permissões necessárias.

---

# 42. Role Explosion

Evitar criar centenas de roles para representar pequenas diferenças.

Quando apropriado, utilizar ABAC.

---

# 43. ABAC

ABAC pode considerar:

```text
user attributes
resource attributes
tenant
department
ownership
environment
risk
time
location
```

---

# 44. Policy Engine

Para regras complexas, considerar um policy engine dedicado.

Exemplos de tecnologias a avaliar:

```text
OPA
OpenFGA
Casbin
Cedar
```

A escolha deve considerar:

```text
complexity
performance
operability
team expertise
integration
```

---

# 45. Authorization Service

Criar componente central:

```text
AuthorizationService
```

Responsável por:

```text
check_permission()
check_role()
check_policy()
check_resource_access()
```

---

# 46. Resource Ownership

Recursos podem possuir owner.

Exemplo:

```text
document.owner_id
```

Uma permissão global não deve ser necessária para acessar o próprio recurso quando a política permitir ownership.

---

# 47. Object-Level Authorization

Toda operação que recebe um resource ID deve verificar autorização sobre o objeto específico.

Evitar:

```text
GET /documents/{id}
```

com apenas:

```text
documents:read
```

sem verificar se o usuário pode acessar aquele documento.

---

# 48. BOLA Protection

Proteger contra:

```text
Broken Object Level Authorization
```

Exemplo de ataque:

```text
User A
GET /documents/USER_B_DOCUMENT
```

deve retornar:

```text
403
```

ou:

```text
404
```

conforme política de resource enumeration.

---

# 49. Function-Level Authorization

Não basta proteger objetos.

Também proteger funções administrativas.

Exemplo:

```text
POST /admin/users/{id}/disable
```

deve exigir permissão específica.

---

# 50. Tenant Isolation

Em aplicações multi-tenant:

```text
tenant_id
```

deve ser tratado como contexto de segurança.

Nunca confiar apenas no valor enviado pelo frontend.

---

# 51. Tenant Context

Derivar tenant preferencialmente de:

```text
authenticated identity
membership
authorization context
```

e não de:

```text
arbitrary request parameter
```

---

# 52. Cross-Tenant Access

Cross-tenant access deve ser negado por padrão.

---

# 53. Tenant-Aware Repository

Repositories devem possuir contexto de tenant quando necessário.

Exemplo:

```python
repository.list(
    tenant_id=current_tenant.id
)
```

---

# 54. Database Tenant Isolation

Quando apropriado, combinar:

```text
application authorization
+
database constraints / RLS
```

para defense in depth.

---

# 55. PostgreSQL Row Level Security

Quando utilizando PostgreSQL, RLS deve ser considerado para workloads multi-tenant de alto risco.

---

# 56. Tenant Context in Database

O contexto de tenant deve ser propagado de maneira segura.

Nunca permitir que o usuário altere diretamente um contexto privilegiado.

---

# 57. IDOR

Testar sistematicamente:

```text
user A → resource B
tenant A → resource B
role A → admin resource
```

---

# 58. Input Validation

Todo input externo deve ser considerado não confiável.

Validar:

```text
type
format
length
range
encoding
allowed values
```

---

# 59. Pydantic

Utilizar Pydantic v2 para validação de schemas da API.

---

# 60. Mass Assignment

Nunca permitir que o cliente atualize campos arbitrários do modelo.

Evitar:

```python
model.update(**request.dict())
```

quando o schema não for cuidadosamente controlado.

---

# 61. Allowlist Fields

Definir explicitamente campos editáveis.

---

# 62. SQL Injection

Nunca concatenar SQL com input externo.

Utilizar:

```text
SQLAlchemy
parameterized queries
```

---

# 63. Raw SQL

Raw SQL somente quando necessário e sempre parametrizado.

---

# 64. ORM Security

SQLAlchemy deve ser utilizado de forma segura.

Evitar:

```text
dynamic SQL concatenation
unsafe text queries
```

---

# 65. Database Credentials

Credenciais de banco nunca devem estar:

```text
source code
Git
Docker image
frontend
logs
```

---

# 66. Database Least Privilege

Aplicação deve utilizar usuário de banco com somente as permissões necessárias.

---

# 67. Database Encryption

Considerar:

```text
encryption at rest
TLS in transit
column-level encryption
```

quando necessário.

---

# 68. Secrets Management

Secrets devem ser gerenciados por:

```text
secret manager
environment configuration
vault
cloud secret service
```

conforme infraestrutura.

---

# 69. Secret Types

Exemplos:

```text
database credentials
JWT signing keys
OAuth client secrets
API keys
provider credentials
encryption keys
webhook secrets
```

---

# 70. Secret Rotation

Secrets críticos devem possuir estratégia de rotação.

---

# 71. Secret Exposure

Nunca registrar secrets em:

```text
logs
exceptions
metrics
traces
audit events
```

---

# 72. Secret Scanning

CI deve executar secret scanning.

Exemplos de ferramentas a avaliar:

```text
Gitleaks
TruffleHog
GitHub Secret Scanning
```

---

# 73. Cryptography

Nunca implementar criptografia própria.

Utilizar bibliotecas maduras.

---

# 74. Password Hashing

Preferir:

```text
Argon2id
```

quando disponível e adequado.

---

# 75. Randomness

Para tokens e secrets, utilizar CSPRNG.

Nunca:

```python
random.random()
```

para geração de credenciais.

---

# 76. Encryption Keys

Chaves devem possuir:

```text
rotation
access control
storage protection
audit
```

---

# 77. TLS

Toda comunicação externa deve utilizar TLS.

---

# 78. TLS Verification

Nunca desabilitar verificação de certificado em produção.

Evitar:

```text
verify=False
```

---

# 79. HTTP Security

Aplicações devem considerar:

```text
HSTS
CSP where applicable
X-Content-Type-Options
Referrer-Policy
secure cookies
```

quando aplicável ao contexto da API.

---

# 80. CORS

CORS deve utilizar allowlist explícita.

Evitar:

```text
allow_origins=["*"]
```

em aplicações autenticadas sem justificativa.

---

# 81. Cookies

Cookies de autenticação devem considerar:

```text
Secure
HttpOnly
SameSite
```

---

# 82. CSRF

Quando autenticação utilizar cookies, implementar proteção CSRF apropriada.

Bearer tokens em Authorization headers possuem modelo diferente de risco.

---

# 83. Rate Limiting

APIs devem possuir rate limiting.

---

# 84. Rate Limit Dimensions

Pode ser aplicado por:

```text
IP
user
tenant
API key
endpoint
provider
```

---

# 85. Authentication Rate Limits

Endpoints como:

```text
login
password reset
token refresh
MFA
```

devem possuir limites específicos.

---

# 86. Brute Force Protection

Detectar:

```text
repeated failures
credential stuffing
password spraying
```

---

# 87. Account Lockout

Evitar lockout permanente facilmente abusável.

Preferir mecanismos como:

```text
progressive delay
temporary lock
risk-based controls
```

---

# 88. Request Size Limits

Definir limites para:

```text
body
headers
query parameters
file uploads
```

---

# 89. File Upload Security

Uploads devem validar:

```text
MIME
extension
size
content
filename
storage location
```

---

# 90. File Name Security

Nunca confiar no filename fornecido pelo cliente.

Gerar identificadores internos seguros.

---

# 91. Malware Scanning

Uploads de risco podem exigir antivírus/malware scanning.

---

# 92. Path Traversal

Nunca permitir acesso arbitrário ao filesystem por meio de parâmetros.

---

# 93. SSRF

Integrações que recebem URLs externas devem proteger contra SSRF.

Bloquear ou controlar:

```text
localhost
127.0.0.1
private networks
metadata endpoints
internal services
```

quando apropriado.

---

# 94. Webhooks

Webhooks recebidos devem possuir autenticação.

Métodos possíveis:

```text
HMAC signature
mTLS
signed payload
provider-specific signature
```

---

# 95. Webhook Replay Protection

Utilizar:

```text
timestamp
nonce
event_id
idempotency
```

quando suportado.

---

# 96. Webhook Signature

Validar assinatura sobre payload bruto quando exigido pelo provider.

---

# 97. Idempotency

Endpoints sensíveis a repetição devem suportar idempotency keys.

Exemplo:

```text
Idempotency-Key: <unique-key>
```

---

# 98. Replay Attacks

Proteger operações críticas contra repetição.

---

# 99. API Versioning

APIs devem possuir versionamento.

Exemplo:

```text
/api/v1/...
```

---

# 100. Deprecated APIs

Endpoints deprecated devem possuir:

```text
deprecation date
migration path
sunset date
```

---

# 101. Security Headers

Definir headers de segurança adequados ao contexto.

---

# 102. OpenAPI Security

OpenAPI deve declarar corretamente:

```text
security schemes
OAuth2 flows
scopes
API keys
bearer authentication
```

---

# 103. Swagger / ReDoc

Documentação automática do FastAPI deve refletir o modelo de segurança real.

Nunca documentar endpoint como público quando ele exige autenticação.

---

# 104. API Error Security

Erros não devem revelar:

```text
stack traces
SQL
credentials
internal paths
provider secrets
```

---

# 105. Error Responses

Produzir erros estruturados.

Exemplo:

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action",
    "request_id": "req_123"
  }
}
```

---

# 106. Authentication Errors

Mensagens de autenticação não devem facilitar user enumeration.

Evitar:

```text
"user does not exist"
```

quando isso revelar identidade.

---

# 107. Authorization Errors

Retornar informação mínima necessária.

---

# 108. Security Logging

Registrar eventos de segurança importantes:

```text
login
logout
failed login
token refresh
password change
MFA
permission change
role change
API key creation
API key revocation
tenant changes
admin actions
```

---

# 109. Audit Trail

Operações críticas devem gerar audit event.

---

# 110. Audit Event

Formato recomendado:

```json
{
  "event": "USER_PERMISSION_CHANGED",
  "actor_id": "123",
  "target_id": "456",
  "tenant_id": "789",
  "timestamp": "...",
  "request_id": "...",
  "result": "success"
}
```

---

# 111. Audit Immutability

Audit logs devem ser protegidos contra alteração indevida.

---

# 112. Audit Retention

Definir política de retenção.

---

# 113. Security Monitoring

Monitorar:

```text
authentication anomalies
authorization failures
rate limit violations
suspicious API usage
tenant access anomalies
secret access
admin operations
```

---

# 114. Security Alerts

Alertas devem existir para eventos de alto risco.

Exemplos:

```text
mass permission changes
credential compromise
API key abuse
cross-tenant access attempt
unusual admin activity
```

---

# 115. Request Correlation

Toda requisição deve possuir:

```text
request_id
trace_id
```

quando observabilidade distribuída estiver habilitada.

---

# 116. Security Context

O backend deve construir um Security Context:

```python
class SecurityContext:
    user_id
    tenant_id
    roles
    permissions
    scopes
    authentication_method
    request_id
```

---

# 117. Dependency Injection

FastAPI dependencies devem ser utilizadas para:

```text
authentication
authorization
tenant context
security context
```

---

# 118. Authentication Dependency

Exemplo conceitual:

```python
current_user = Depends(get_current_user)
```

---

# 119. Permission Dependency

Exemplo:

```python
require_permission("documents:write")
```

---

# 120. Tenant Dependency

Exemplo:

```python
current_tenant = Depends(get_current_tenant)
```

---

# 121. Security Middleware

Middleware pode tratar:

```text
request correlation
security headers
logging
rate limiting
```

mas autorização de negócio deve permanecer em camada apropriada.

---

# 122. Security Boundary

Não concentrar toda segurança em middleware.

Authorization deve conhecer:

```text
resource
action
ownership
tenant
business context
```

---

# 123. Background Jobs

Jobs assíncronos também precisam de Security Context.

Nunca assumir:

```text
background job = trusted
```

---

# 124. Job Identity

Jobs devem registrar:

```text
created_by
tenant
service_identity
permissions
```

quando necessário.

---

# 125. Queue Security

Queues devem possuir:

```text
authentication
authorization
encryption
access control
dead letter policy
```

---

# 126. Cache Security

Caches devem respeitar:

```text
tenant
user
authorization
data sensitivity
TTL
```

---

# 127. Cache Poisoning

Inputs controlados pelo usuário não devem permitir manipular caches compartilhados de forma insegura.

---

# 128. Dependency Security

Dependências devem ser:

```text
versioned
scanned
updated
audited
```

---

# 129. Python Dependency Management

Utilizar um dependency manager moderno e lockfile.

Exemplos a avaliar:

```text
uv
Poetry
PDM
```

Escolher um padrão único para a organização.

---

# 130. Dependency Vulnerability Scanning

CI deve executar vulnerability scanning.

Ferramentas possíveis:

```text
pip-audit
OSV Scanner
Dependabot
Renovate
Snyk
```

---

# 131. Supply Chain Security

Avaliar:

```text
dependency vulnerabilities
malicious packages
package provenance
lockfiles
SBOM
```

---

# 132. SBOM

Builds de produção devem, quando aplicável, gerar Software Bill of Materials.

---

# 133. Container Security

Containers devem:

```text
run as non-root
use minimal images
pin dependencies
scan images
remove unnecessary packages
```

---

# 134. Docker Security

Evitar:

```text
privileged containers
host filesystem mounts
Docker socket exposure
root processes
```

sem justificativa explícita.

---

# 135. Kubernetes Security

Quando aplicável:

```text
NetworkPolicy
Pod Security
Service Accounts
RBAC
Secrets
Resource Limits
```

---

# 136. Network Segmentation

Separar:

```text
public
application
database
internal services
```

quando a infraestrutura permitir.

---

# 137. Egress Control

Serviços devem possuir acesso de saída mínimo necessário.

---

# 138. SSRF Defense in Depth

SSRF protection deve existir:

```text
application
network
cloud infrastructure
```

quando possível.

---

# 139. Security Configuration

Configurações de segurança devem possuir defaults seguros.

Exemplo:

```text
debug=false
secure cookies=true
TLS verification=true
CORS allowlist
```

---

# 140. Production Configuration

Nunca executar produção com:

```text
DEBUG=true
```

---

# 141. Development Security

Ambiente de desenvolvimento pode possuir flexibilidades, mas não deve ensinar padrões inseguros que sejam copiados para produção.

---

# 142. Test Environment

Testes devem possuir:

```text
isolated credentials
isolated database
fake secrets
mock providers
```

---

# 143. Security Testing

Testes obrigatórios:

```text
unit
integration
API security
authorization
authentication
dependency scanning
SAST
DAST
secret scanning
```

quando aplicável.

---

# 144. SAST

Executar Static Application Security Testing.

Ferramentas possíveis:

```text
Bandit
Semgrep
CodeQL
```

---

# 145. DAST

Executar Dynamic Application Security Testing contra ambientes controlados.

Ferramentas possíveis:

```text
OWASP ZAP
Burp Suite
```

---

# 146. API Security Testing

Testar:

```text
authentication bypass
authorization bypass
BOLA
BFLA
rate limiting
mass assignment
injection
SSRF
file upload
```

---

# 147. OWASP API Security

A implementação deve considerar o OWASP API Security Top 10, especialmente:

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

# 148. Authentication Tests

Testar:

```text
expired token
invalid signature
wrong issuer
wrong audience
wrong algorithm
missing token
revoked token
```

---

# 149. Authorization Tests

Para cada endpoint protegido testar:

```text
anonymous
authenticated user
wrong role
correct role
wrong tenant
resource owner
non-owner
admin
service account
```

---

# 150. Tenant Isolation Tests

Obrigatório testar:

```text
tenant A → tenant B
user A → user B
admin tenant A → tenant B
background job → wrong tenant
cache → wrong tenant
RAG → wrong tenant
```

---

# 151. Security Regression Tests

Vulnerabilidades corrigidas devem gerar testes de regressão.

---

# 152. Threat Modeling

Toda feature relevante deve possuir threat modeling.

---

# 153. STRIDE

STRIDE pode ser utilizado:

```text
Spoofing
Tampering
Repudiation
Information Disclosure
Denial of Service
Elevation of Privilege
```

---

# 154. Threat Modeling Flow

```text
Feature
 ↓
Assets
 ↓
Actors
 ↓
Trust Boundaries
 ↓
Threats
 ↓
Mitigations
 ↓
Tests
```

---

# 155. Security Assets

Identificar:

```text
credentials
PII
financial data
business data
tokens
secrets
AI prompts
AI outputs
documents
tenant data
```

---

# 156. Trust Boundaries

Mapear:

```text
client → API
API → database
API → provider
API → queue
AI → tools
tenant → tenant
service → service
```

---

# 157. Threat Register

Manter registro:

```text
threat
risk
likelihood
impact
mitigation
owner
status
```

---

# 158. Risk Classification

Classificar:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

---

# 159. Security Gate

HIGH e CRITICAL risks não devem ser liberados sem mitigação ou aceitação formal do risco.

---

# 160. Secure Coding

Código backend deve evitar:

```text
eval
exec
unsafe deserialization
shell injection
SQL concatenation
path traversal
dynamic imports from user input
```

---

# 161. Command Injection

Nunca executar comandos construídos diretamente a partir de input externo.

---

# 162. Serialization

Evitar formatos de serialização inseguros.

Nunca desserializar objetos arbitrários não confiáveis.

---

# 163. Regex Security

Evitar regex suscetível a catastrophic backtracking.

---

# 164. ReDoS

Testar inputs que possam causar:

```text
Regular Expression Denial of Service
```

---

# 165. Resource Exhaustion

Limitar:

```text
requests
payloads
files
queries
AI tokens
jobs
concurrency
```

---

# 166. Pagination Security

Nunca permitir:

```text
limit=100000000
```

Definir:

```text
default_limit
max_limit
```

---

# 167. Query Security

Queries complexas devem possuir limites.

---

# 168. Sorting Security

Sort fields devem utilizar allowlist.

Evitar aceitar nomes arbitrários de colunas.

---

# 169. Filtering Security

Filtros devem utilizar schema controlado.

---

# 170. Search Security

Search deve proteger contra:

```text
SQL injection
resource exhaustion
data enumeration
```

---

# 171. Enumeration Protection

Endpoints que permitem descobrir IDs ou usuários devem considerar:

```text
authorization
pagination
rate limiting
opaque IDs
generic errors
```

quando necessário.

---

# 172. Sensitive Endpoints

Endpoints administrativos devem possuir controles adicionais:

```text
strong authentication
MFA
audit
rate limiting
permission checks
```

quando apropriado.

---

# 173. Admin Security

Global Admin deve possuir:

```text
explicit role
explicit permissions
strong authentication
audit
```

---

# 174. Break Glass Access

Ambientes críticos podem possuir mecanismo controlado de emergency access.

Deve ser:

```text
temporary
audited
explicit
highly restricted
```

---

# 175. Privileged Access Management

Acesso privilegiado deve ser minimizado e auditado.

---

# 176. Impersonation

Quando existir "login as" ou impersonation:

```text
original_actor
impersonated_user
reason
start
end
```

devem ser auditados.

---

# 177. Impersonation Security

Impersonation não deve permitir escalada de privilégios além das permissões permitidas ao administrador.

---

# 178. Audit for Admin Actions

Todas as ações administrativas relevantes devem gerar audit event.

---

# 179. Security Events

Padronizar eventos:

```text
AUTH_LOGIN_SUCCESS
AUTH_LOGIN_FAILURE
AUTH_LOGOUT
AUTH_TOKEN_REFRESH
AUTH_TOKEN_REVOKED

USER_CREATED
USER_DISABLED
USER_DELETED

ROLE_ASSIGNED
ROLE_REVOKED

PERMISSION_GRANTED
PERMISSION_REVOKED

API_KEY_CREATED
API_KEY_REVOKED

TENANT_ACCESS_DENIED

SECURITY_POLICY_VIOLATION
```

---

# 180. Security Incident Response

Definir processo para:

```text
detect
contain
investigate
eradicate
recover
learn
```

---

# 181. Incident Evidence

Preservar:

```text
request_id
trace_id
timestamp
actor
tenant
event
source
result
```

sem armazenar secrets.

---

# 182. Credential Compromise

Em caso de comprometimento:

```text
revoke
rotate
invalidate sessions
investigate
audit
notify
```

conforme impacto.

---

# 183. API Key Compromise

Processo:

```text
identify
revoke
replace
audit
review usage
```

---

# 184. JWT Key Compromise

Deve existir estratégia de:

```text
key rotation
key versioning
token invalidation
```

---

# 185. Signing Keys

Chaves de assinatura devem possuir:

```text
secure storage
rotation
version
limited access
audit
```

---

# 186. Key Rotation

Rotação deve permitir coexistência controlada entre:

```text
old key
new key
```

durante janela de migração.

---

# 187. Security Documentation

Todo serviço deve documentar:

```text
authentication
authorization
roles
permissions
tenants
secrets
external integrations
security controls
```

---

# 188. Security Architecture Decision Records

Decisões relevantes devem ser documentadas como ADRs.

Exemplos:

```text
why JWT
why OAuth2
why RBAC
why ABAC
why RLS
why API Keys
why OPA
```

---

# 189. Security Dependency Catalog

Documentar bibliotecas utilizadas.

Exemplos de categorias:

```text
FastAPI
Pydantic
SQLAlchemy
OAuth/OIDC
JWT
Password Hashing
Cryptography
Rate Limiting
Security Headers
Validation
SAST
Dependency Scanning
```

Sempre preferir bibliotecas maduras e mantidas.

---

# 190. Security Library Selection

Antes de adicionar uma biblioteca de segurança avaliar:

```text
maintenance
release frequency
security history
community
license
documentation
transitive dependencies
CVE history
```

---

# 191. Cryptographic Libraries

Preferir bibliotecas amplamente auditadas.

Nunca criar:

```text
custom hashing
custom encryption
custom JWT implementation
custom password hashing
```

---

# 192. FastAPI Security

Utilizar os mecanismos nativos do FastAPI quando adequados:

```text
OAuth2PasswordBearer
Security
Depends
OpenAPI Security Schemes
```

complementados por bibliotecas maduras quando necessário.

---

# 193. Security Dependencies

Security dependencies devem ser reutilizáveis.

Exemplo:

```text
get_current_user
get_security_context
require_authentication
require_permission
require_role
require_tenant
```

---

# 194. Authorization Decorators / Dependencies

Padronizar:

```python
Depends(require_permission("documents:read"))
```

ou mecanismo equivalente.

---

# 195. Security Context Propagation

Security context deve ser propagado para:

```text
services
repositories
jobs
audit
AI
RAG
tools
```

quando necessário.

---

# 196. AI Security Integration

O Volume VI deve complementar o Volume V.

Toda funcionalidade AI deve respeitar:

```text
authentication
authorization
tenant isolation
data classification
audit
rate limiting
budget
tool permissions
```

---

# 197. AI Agent Authorization

Agents nunca devem receber permissões implícitas do usuário.

O backend deve verificar:

```text
user permission
+
agent permission
+
tool permission
```

antes da execução.

---

# 198. AI Tool Security

Tool calls devem passar por:

```text
authentication context
authorization
schema validation
risk policy
audit
```

---

# 199. RAG Security

RAG deve respeitar:

```text
document authorization
tenant isolation
data classification
retention
deletion
audit
```

---

# 200. Prompt Security

Prompts devem ser tratados como artefatos potencialmente sensíveis.

---

# 201. AI Data Leakage

Monitorar:

```text
cross-tenant leakage
PII leakage
secret leakage
system prompt leakage
document leakage
```

---

# 202. Security Testing for AI

Testes devem incluir:

```text
prompt injection
indirect prompt injection
tool injection
data exfiltration
cross-tenant retrieval
unauthorized tool execution
```

---

# 203. API Security and AI

Endpoints AI devem possuir:

```text
authentication
authorization
rate limiting
budget control
input validation
output validation
audit
observability
```

---

# 204. Security Headers for AI

Quando AI estiver integrada a aplicações web, considerar proteção adicional contra:

```text
XSS
CSRF
clickjacking
content injection
```

---

# 205. AI File Processing

Arquivos enviados para processamento AI devem seguir os mesmos controles de upload:

```text
validation
size limits
malware scanning
tenant isolation
access control
retention
```

---

# 206. Security Definition of Done

Uma feature só pode ser considerada pronta quando:

```text
[ ] Authentication defined
[ ] Authorization defined
[ ] Roles defined
[ ] Permissions defined
[ ] Tenant model defined
[ ] Object-level authorization
[ ] Input validation
[ ] Output validation
[ ] Rate limiting
[ ] Resource limits
[ ] Secrets management
[ ] Audit
[ ] Security logging
[ ] Error handling
[ ] Dependency scanning
[ ] SAST
[ ] Security tests
[ ] Threat model
[ ] Sensitive data review
[ ] AI security review when applicable
[ ] Incident considerations
```

---

# 207. Production Security Gate

Antes do deploy:

```text
[ ] No known critical vulnerabilities
[ ] No exposed secrets
[ ] Authentication verified
[ ] Authorization verified
[ ] Tenant isolation tested
[ ] Rate limits configured
[ ] TLS enabled
[ ] Security headers configured
[ ] CORS reviewed
[ ] Database permissions reviewed
[ ] Audit enabled
[ ] Monitoring enabled
[ ] Alerts configured
[ ] Backup strategy
[ ] Incident response defined
[ ] Dependency scan passed
[ ] Container scan passed
[ ] Security tests passed
```

---

# 208. Security CI/CD

Pipeline recomendado:

```text
Commit
 ↓
Lint
 ↓
Type Check
 ↓
Unit Tests
 ↓
SAST
 ↓
Secret Scan
 ↓
Dependency Scan
 ↓
Build
 ↓
Container Scan
 ↓
Integration Tests
 ↓
API Security Tests
 ↓
DAST
 ↓
Security Gate
 ↓
Deploy
```

---

# 209. Security Release Strategy

Mudanças de segurança críticas devem possuir:

```text
review
testing
rollback
monitoring
```

---

# 210. Vulnerability Management

Vulnerabilidades devem possuir:

```text
severity
owner
SLA
status
remediation
verification
```

---

# 211. Severity

Classificar:

```text
CRITICAL
HIGH
MEDIUM
LOW
INFORMATIONAL
```

---

# 212. Security SLA

Definir SLA organizacional para correção conforme severidade.

---

# 213. Security Exception

Exceções devem possuir:

```text
reason
risk
owner
expiration
mitigation
approval
```

Exceções nunca devem ser permanentes por padrão.

---

# 214. Security Review

Features críticas devem passar por security review.

Exemplos:

```text
authentication
authorization
payments
PII
tenant architecture
admin operations
AI agents
external integrations
file processing
```

---

# 215. Security Checklist per Endpoint

Cada endpoint deve poder responder:

```text
Who can call?
How are they authenticated?
What permission is required?
What tenant can they access?
What resource can they access?
What fields can they modify?
What rate limit applies?
What data is returned?
What is logged?
What happens on failure?
```

---

# 216. Security Endpoint Contract

Exemplo:

```yaml
security:
  authentication:
    required: true
    scheme: bearer

  authorization:
    permissions:
      - documents:read

  tenant:
    required: true

  resource:
    ownership_check: true

  rate_limit:
    requests: 100
    window: 60

  audit:
    enabled: true

  sensitive_data:
    redaction: true
```

---

# 217. Security Component Catalog

Componentes de segurança reutilizáveis devem incluir:

```text
AuthenticationService
AuthorizationService
PermissionService
RoleService
TenantService
SecurityContext
TokenService
APIKeyService
SessionService
PasswordService
MFAService
AuditService
RateLimitService
PolicyService
SecretService
EncryptionService
WebhookSecurityService
SecurityEventService
```

---

# 218. Security Service Rules

Componentes de segurança devem ser:

```text
stateless where possible
testable
auditable
provider-agnostic
dependency-injected
```

---

# 219. Security Service Isolation

Não espalhar lógica de segurança por dezenas de endpoints.

Centralizar políticas reutilizáveis.

---

# 220. Security Configuration

Configurações sensíveis devem ser centralizadas.

Exemplo:

```yaml
security:
  jwt:
    issuer:
    audience:
    algorithms:
    access_token_ttl:

  password:
    algorithm: argon2id

  cors:
    allowed_origins:

  rate_limit:
    enabled: true
```

---

# 221. Secure Defaults

Defaults devem favorecer segurança.

Exemplo:

```text
authentication required
authorization denied
debug disabled
TLS enabled
CORS restricted
rate limiting enabled
audit enabled
```

---

# 222. Fail Secure

Quando houver dúvida ou falha de infraestrutura de segurança:

```text
DENY
```

em vez de:

```text
ALLOW
```

Exemplo:

```text
authorization service unavailable
        ↓
deny access
```

---

# 223. Availability vs Security

Para operações críticas, segurança deve prevalecer sobre disponibilidade.

Não criar:

```text
authorization service unavailable
        ↓
bypass authorization
```

---

# 224. Security Observability

Monitorar:

```text
auth failures
authorization failures
rate limit blocks
suspicious requests
tenant violations
security exceptions
secret access
admin operations
```

---

# 225. Security Metrics

Métricas recomendadas:

```text
auth_success_total
auth_failure_total
authorization_denied_total
rate_limit_blocked_total
security_events_total
api_key_usage_total
token_refresh_total
tenant_access_denied_total
```

---

# 226. Security Alerting

Alertas devem ser configurados para padrões anômalos.

Exemplos:

```text
sudden login failures
mass authorization failures
API key spike
cross-tenant attempts
admin privilege escalation
```

---

# 227. Security Dashboard

Dashboard deve permitir visualizar:

```text
authentication
authorization
API abuse
vulnerabilities
security events
admin actions
tenant isolation violations
```

---

# 228. Security Documentation

Cada projeto deve possuir:

```text
SECURITY.md
```

contendo:

```text
security architecture
supported versions
authentication
authorization
secret management
vulnerability reporting
incident process
```

---

# 229. Vulnerability Disclosure

Projetos expostos externamente devem possuir mecanismo para reporte responsável de vulnerabilidades.

---

# 230. Security Ownership

Toda aplicação deve possuir:

```text
security owner
technical owner
incident owner
```

---

# 231. Security Training

Desenvolvedores devem conhecer:

```text
OWASP API Security
authentication
authorization
secure coding
secrets
SQL injection
SSRF
XSS
CSRF
BOLA
BFLA
AI security
```

---

# 232. Security Golden Rules

## Rule 1

Authentication nunca substitui authorization.

## Rule 2

Default deve ser deny.

## Rule 3

Nunca confiar em tenant_id enviado pelo cliente.

## Rule 4

Toda operação sobre recurso deve verificar autorização sobre o objeto.

## Rule 5

Nunca armazenar secrets em plaintext.

## Rule 6

Nunca criar criptografia própria.

## Rule 7

Nunca confiar no LLM para autorização.

## Rule 8

Nunca expor stack traces em produção.

## Rule 9

Sempre validar inputs externos.

## Rule 10

Sempre limitar recursos consumidos.

## Rule 11

Sempre auditar operações privilegiadas.

## Rule 12

Sempre proteger APIs contra BOLA/BFLA.

## Rule 13

Sempre testar isolamento entre tenants.

## Rule 14

Sempre utilizar bibliotecas de segurança maduras.

## Rule 15

Toda exceção de segurança deve possuir owner e expiração.

---

# 233. Security Development Flow

```text
Requirement
    ↓
Asset Identification
    ↓
Threat Modeling
    ↓
Authentication
    ↓
Authorization
    ↓
Tenant Model
    ↓
Input / Output Validation
    ↓
Business Rules
    ↓
Data Security
    ↓
Audit
    ↓
Security Tests
    ↓
SAST / DAST
    ↓
Review
    ↓
Deploy
    ↓
Monitoring
```

---

# 234. Complete Backend Security Model

```text
                         SECURITY
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
      IDENTITY          AUTHORIZATION        DATA
          │                  │                  │
    OAuth2 / OIDC       RBAC / ABAC         Encryption
    JWT                 Policies             RLS
    MFA                 Permissions          Secrets
    Sessions            Tenant               Retention
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ▼
                         API SECURITY
                             │
                 ┌───────────┼────────────┐
                 ▼           ▼            ▼
              TLS        Rate Limit    Validation
                 │           │            │
                 └───────────┼────────────┘
                             ▼
                       APPLICATION
                             │
                ┌────────────┼────────────┐
                ▼            ▼            ▼
              Audit        AI          Integrations
                │            │            │
                └────────────┼────────────┘
                             ▼
                    OBSERVABILITY
                             │
                ┌────────────┼────────────┐
                ▼            ▼            ▼
              Logs         Metrics       Traces
                             │
                             ▼
                       INCIDENT RESPONSE
```

---

# 235. Loft Backend Security Standard

O backend Loft deve ser construído assumindo que:

```text
Clients are untrusted.
Networks are untrusted.
Tokens can be compromised.
Users can be malicious.
Tenants must be isolated.
External APIs can fail.
LLMs are probabilistic and untrusted.
Dependencies can contain vulnerabilities.
```

Portanto:

```text
Identity
+
Authorization
+
Isolation
+
Validation
+
Encryption
+
Audit
+
Observability
+
Testing
+
Incident Response
```

devem formar uma única arquitetura de segurança.

---

# 236. Final Principle

Segurança não deve ser implementada como:

```text
API
+
Authentication
```

A arquitetura deve evoluir para:

```text
API
│
├── Identity
├── Authentication
├── Authorization
├── RBAC
├── ABAC
├── Tenant Isolation
├── Data Security
├── Secrets
├── Rate Limiting
├── Input Validation
├── Audit
├── Observability
├── Threat Modeling
├── Security Testing
├── Supply Chain Security
├── AI Security
└── Incident Response
```

O princípio final é:

```text
Security is not a feature.
Security is an architectural property.
```

E:

```text
Never Trust.
Always Verify.
Least Privilege.
Default Deny.
Fail Secure.
Audit Everything Important.
```

O Loft Backend deve ser **secure by design, zero-trust by default, tenant-aware, API-first e AI-ready**, mantendo segurança como uma preocupação transversal a todos os Volumes I–V.