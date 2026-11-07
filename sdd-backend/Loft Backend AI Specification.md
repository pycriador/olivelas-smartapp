# Loft Backend AI Specification

## Volume V — AI Backend Specification (AI-BAS)

**Status:** Foundation  
**Version:** 1.0  
**Parent Standard:** Loft Backend Foundation — Volume I  
**Engineering Standard:** Loft Backend Design & Engineering System — Volume II  
**Component Standard:** Loft Backend Component Catalog — Volume III  
**API Standard:** Loft Backend API Specification — Volume IV  
**Architecture:** API First + AI First  
**Primary Framework:** FastAPI  
**Schema Layer:** Pydantic v2  
**AI Architecture:** Provider-Agnostic AI Gateway

---

# 1. Objetivo

O Loft Backend AI Specification — AI-BAS define o padrão oficial para projetar, implementar, operar, testar, observar e governar funcionalidades de Inteligência Artificial dentro dos backends Olivelas.

O objetivo é permitir que aplicações utilizem:

- LLMs;
- embeddings;
- RAG;
- agents;
- tools;
- structured output;
- multimodal AI;
- classificação;
- extração;
- sumarização;
- geração;
- avaliação;
- workflows inteligentes;

sem criar dependência direta entre o domínio da aplicação e um fornecedor específico de IA.

---

# 2. Princípio Fundamental

Nenhuma regra de negócio deve depender diretamente de um provider de IA.

Evitar:

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(...)
```

dentro de:

```text
router
service
domain
repository
```

Preferir:

```text
Application
    ↓
AIService
    ↓
LLMGateway
    ↓
Provider Adapter
    ↓
OpenAI / Anthropic / Google / Local Model / etc.
```

---

# 3. AI Architecture

Arquitetura padrão:

```text
┌──────────────────────────────────────────────┐
│                  Application                 │
│                                              │
│  FastAPI / Services / Domain / Workflows     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                 AI Service                   │
│                                              │
│ use-case orchestration                       │
│ authorization                                │
│ prompt resolution                            │
│ model selection                              │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                 AI Gateway                   │
│                                              │
│ provider abstraction                         │
│ routing                                      │
│ fallback                                     │
│ retries                                      │
│ timeout                                      │
│ usage tracking                               │
│ cost tracking                                │
│ observability                                │
└───────────────┬───────────────┬──────────────┘
                │               │
                ▼               ▼
         ┌────────────┐  ┌──────────────┐
         │ Providers  │  │ AI Services  │
         │            │  │              │
         │ OpenAI     │  │ Embeddings   │
         │ Anthropic  │  │ Vector DB    │
         │ Google     │  │ RAG          │
         │ Local      │  │ Moderation   │
         └────────────┘  └──────────────┘
```

---

# 4. AI First Principles

Todo recurso de IA deve priorizar:

```text
Provider Independence
Observability
Security
Determinism where possible
Structured Output
Testability
Evaluation
Cost Control
Latency Control
Auditability
Reproducibility
Human Oversight
```

---

# 5. AI Capability Classification

Cada funcionalidade de IA deve ser classificada.

Tipos:

```text
GENERATION
CLASSIFICATION
EXTRACTION
SUMMARIZATION
EMBEDDING
RANKING
RETRIEVAL
AGENT
VISION
AUDIO
TRANSCRIPTION
TRANSLATION
MODERATION
PREDICTION
```

---

# 6. AI Use Case Definition

Toda feature de IA deve possuir uma definição explícita.

Exemplo:

```yaml
use_case:
  name: document_summary

  capability:
    type: summarization

  input:
    type: document

  output:
    type: structured_summary

  human_review:
    required: false

  risk:
    level: medium
```

---

# 7. AI Risk Classification

Classificar funcionalidades:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Exemplo:

```text
LOW
translation

MEDIUM
document summarization

HIGH
financial recommendation

CRITICAL
automated irreversible decision
```

---

# 8. AI Risk Governance

Quanto maior o risco:

```text
Risk ↑
  ↓
Guardrails ↑
Evaluation ↑
Audit ↑
Human Oversight ↑
Restrictions ↑
```

---

# 9. LLM Gateway

Todas as chamadas de LLM devem passar pelo LLM Gateway.

O Gateway deve abstrair:

```text
provider
model
authentication
request formatting
response normalization
retry
timeout
fallback
usage
cost
logging
tracing
```

---

# 10. Provider Abstraction

Criar uma interface comum.

Exemplo:

```python
class LLMProvider(Protocol):

    async def generate(
        self,
        request: LLMRequest,
    ) -> LLMResponse:
        ...
```

Providers específicos implementam essa interface.

---

# 11. Provider Adapters

Estrutura:

```text
AI Gateway
    │
    ├── OpenAIAdapter
    ├── AnthropicAdapter
    ├── GoogleAdapter
    ├── AzureOpenAIAdapter
    └── LocalModelAdapter
```

---

# 12. Provider Independence

A camada de domínio nunca deve importar:

```text
openai
anthropic
google-generativeai
```

diretamente.

Essas dependências pertencem à infraestrutura AI.

---

# 13. Model Registry

Modelos devem ser registrados.

Exemplo:

```yaml
models:
  default_reasoning:
    provider: openai
    model: model-name
    temperature: 0.2

  fast_generation:
    provider: anthropic
    model: model-name
```

---

# 14. Model Aliases

A aplicação deve preferir aliases:

```text
default_reasoning
fast_generation
cheap_generation
embedding_default
vision_default
```

em vez de acoplar:

```text
specific-provider-model-name
```

ao domínio.

---

# 15. Model Routing

O Gateway pode selecionar modelos baseado em:

```text
capability
latency
cost
availability
tenant
risk
context size
structured output support
```

---

# 16. Model Fallback

Quando permitido:

```text
Primary Model
      ↓
Failure
      ↓
Fallback Model
```

Fallback deve ser explícito.

Não utilizar fallback silencioso em funcionalidades de alto risco.

---

# 17. Provider Failover

Provider failover pode ocorrer:

```text
Provider A
    ↓
unavailable
    ↓
Provider B
```

Registrar:

```text
original_provider
fallback_provider
reason
```

---

# 18. Timeouts

Toda chamada de IA deve possuir timeout.

Definir:

```text
connect_timeout
read_timeout
total_timeout
```

---

# 19. Retries

Retries devem ser limitados.

Retry somente para erros potencialmente transitórios:

```text
timeout
rate limit
temporary provider failure
503
```

Não fazer retry indiscriminado.

---

# 20. Exponential Backoff

Quando retries forem permitidos:

```text
retry 1
    ↓
backoff
    ↓
retry 2
    ↓
backoff
    ↓
retry 3
```

Com jitter quando apropriado.

---

# 21. LLM Request

Representar requests com schema próprio.

Exemplo:

```python
class LLMRequest(BaseModel):
    model: str
    messages: list[Message]
    temperature: float | None = None
    max_tokens: int | None = None
    response_schema: type[BaseModel] | None = None
```

---

# 22. LLM Response

Normalizar respostas entre providers.

Exemplo:

```python
class LLMResponse(BaseModel):
    content: str
    model: str
    provider: str
    usage: TokenUsage
    finish_reason: str | None
```

---

# 23. Token Usage

Registrar:

```text
input_tokens
output_tokens
total_tokens
cached_tokens
```

quando suportado.

---

# 24. Cost Tracking

Registrar custo estimado:

```text
input_cost
output_cost
total_cost
currency
```

---

# 25. Cost Attribution

Associar consumo a:

```text
request_id
user_id
tenant_id
application
feature
use_case
model
provider
```

quando aplicável.

---

# 26. AI Budgets

Implementar limites quando necessário:

```text
user budget
tenant budget
application budget
feature budget
daily budget
monthly budget
```

---

# 27. Budget Enforcement

Quando o orçamento for excedido:

```text
AI_BUDGET_EXCEEDED
```

deve ser retornado de forma estruturada.

---

# 28. Prompt Management

Prompts não devem ficar espalhados pelo código.

Evitar:

```python
prompt = """
You are an assistant...
"""
```

em dezenas de services.

---

# 29. Prompt Registry

Criar registry de prompts.

Exemplo:

```text
document_summary
document_classification
customer_response
invoice_extraction
```

---

# 30. Prompt Versioning

Todo prompt relevante deve possuir:

```text
name
version
status
owner
created_at
updated_at
```

---

# 31. Prompt Lifecycle

```text
Draft
 ↓
Testing
 ↓
Approved
 ↓
Production
 ↓
Deprecated
```

---

# 32. Prompt Immutability

Prompts em produção devem ser versionados.

Não alterar silenciosamente uma versão ativa sem registrar a mudança.

---

# 33. Prompt Metadata

Registrar:

```text
prompt_version
model
provider
temperature
configuration
```

para permitir reprodução.

---

# 34. System Prompt

System prompts devem possuir governança equivalente a código crítico.

Não permitir alteração arbitrária por usuários comuns.

---

# 35. User Prompt

Input do usuário deve ser tratado como dado não confiável.

Nunca assumir que instruções fornecidas pelo usuário possuem a mesma autoridade do system prompt.

---

# 36. Prompt Injection

Toda funcionalidade baseada em LLM deve considerar prompt injection.

Exemplos:

```text
Ignore previous instructions
Reveal your system prompt
Execute this tool
Ignore security rules
```

devem ser tratados como conteúdo potencialmente não confiável.

---

# 37. Instruction Hierarchy

Estabelecer prioridade:

```text
System Policy
      ↓
Application Policy
      ↓
Tool Policy
      ↓
User Instruction
      ↓
Retrieved Content
```

Conteúdo recuperado via RAG nunca deve ganhar autoridade sobre as instruções do sistema.

---

# 38. Structured Output

Quando o backend espera dados estruturados, utilizar structured output.

Preferir:

```text
Pydantic
JSON Schema
Provider Structured Output
```

em vez de:

```text
parse string manually
```

---

# 39. Structured Output Example

```python
class InvoiceExtraction(BaseModel):
    invoice_number: str | None
    supplier: str | None
    total: Decimal | None
    due_date: date | None
```

A IA deve retornar um objeto validável contra esse schema.

---

# 40. Structured Output Validation

Pipeline:

```text
LLM
 ↓
Structured Output
 ↓
Pydantic Validation
 ↓
Business Validation
 ↓
Application
```

---

# 41. Invalid AI Output

Se a resposta não validar:

```text
AI_OUTPUT_VALIDATION_ERROR
```

Pode existir retry controlado com correção estruturada.

---

# 42. AI Determinism

Quando possível:

```text
temperature low
structured output
fixed prompts
fixed model
```

para tarefas determinísticas.

---

# 43. Generation vs Extraction

Não utilizar geração livre quando o problema é extração estruturada.

Preferir:

```text
document
 ↓
structured extraction
```

em vez de:

```text
document
 ↓
free-form answer
 ↓
regex parsing
```

---

# 44. Multimodal AI

Quando utilizar imagens, áudio ou vídeo, especificar:

```text
input format
maximum size
resolution
duration
provider capability
privacy requirements
retention
```

---

# 45. Vision

Imagens devem ser validadas antes de serem enviadas ao provider.

Validar:

```text
mime type
size
dimensions
format
```

---

# 46. Audio

Áudio deve definir:

```text
duration limit
format
language
transcription policy
retention
```

---

# 47. AI Content Moderation

Quando necessário, utilizar moderation antes e/ou depois da geração.

Pipeline:

```text
Input
 ↓
Moderation
 ↓
LLM
 ↓
Output Moderation
 ↓
Application
```

---

# 48. Guardrails

Guardrails devem proteger:

```text
input
output
tools
retrieval
business actions
```

---

# 49. Guardrail Types

Utilizar quando aplicável:

```text
schema validation
content moderation
PII detection
prompt injection detection
topic restriction
output length
allowed actions
tool permissions
```

---

# 50. PII Protection

Detectar ou proteger informações pessoais quando necessário.

Exemplos:

```text
CPF
email
phone
financial information
credentials
```

---

# 51. Data Minimization

Enviar para o provider somente os dados necessários.

Não enviar:

```text
entire database record
```

quando bastar:

```text
specific fields
```

---

# 52. Sensitive Data

Antes de enviar dados a um provider externo, considerar:

```text
data classification
provider policy
retention
encryption
legal requirements
tenant policy
```

---

# 53. AI Provider Policy

Cada provider deve possuir configuração explícita:

```text
allowed
disabled
approved_models
data_policy
regions
retention
```

---

# 54. Tenant AI Policy

Tenants podem possuir políticas:

```text
AI enabled
AI disabled
allowed providers
allowed models
budget
retention
data processing
```

---

# 55. AI Authorization

Não basta autenticar o usuário.

Verificar:

```text
ai:use
ai:generate
ai:embed
ai:agent
ai:tool
```

quando aplicável.

---

# 56. AI Feature Permissions

Permissões devem poder ser específicas por capability.

Exemplo:

```text
documents:summary
documents:extract
ai:generate
ai:agent
```

---

# 57. AI Audit

Operações relevantes devem ser auditadas.

Registrar:

```text
actor
tenant
use_case
model
provider
prompt_version
timestamp
request_id
result_status
```

Não registrar conteúdo sensível sem necessidade.

---

# 58. AI Observability

Observar:

```text
latency
tokens
cost
errors
model
provider
fallback
retries
guardrail events
```

---

# 59. AI Metrics

Métricas recomendadas:

```text
ai_requests_total
ai_request_duration
ai_request_errors
ai_input_tokens
ai_output_tokens
ai_cost_total
ai_fallback_total
ai_guardrail_blocked
ai_output_validation_failed
```

---

# 60. AI Tracing

AI calls devem possuir tracing.

Trace:

```text
API Request
 ↓
AI Service
 ↓
Prompt Resolution
 ↓
RAG
 ↓
LLM
 ↓
Tool Calls
 ↓
Response Validation
```

---

# 61. AI Observability Privacy

Observabilidade não deve justificar vazamento de prompts ou respostas sensíveis.

Utilizar:

```text
redaction
sampling
hashing
metadata-only logging
```

quando necessário.

---

# 62. Prompt Logging

Registrar conteúdo do prompt somente quando permitido pela política de segurança e privacidade.

Preferir:

```text
prompt_id
prompt_version
hash
```

quando o conteúdo não precisar ser armazenado.

---

# 63. AI Evaluation

Toda funcionalidade importante de IA deve possuir avaliação.

Não considerar:

```text
"parece funcionar"
```

como critério suficiente.

---

# 64. Evaluation Dataset

Criar datasets representativos.

Exemplo:

```text
input
expected_output
acceptable_variations
risk_level
```

---

# 65. Evaluation Types

Utilizar:

```text
exact match
structured validation
semantic similarity
LLM-as-judge
human evaluation
classification metrics
retrieval metrics
```

conforme o caso.

---

# 66. Evaluation Metrics

Exemplos:

```text
accuracy
precision
recall
F1
faithfulness
groundedness
relevance
hallucination rate
latency
cost
```

---

# 67. Regression Evaluation

Toda alteração relevante em:

```text
prompt
model
provider
RAG
tool
guardrail
```

deve poder disparar avaliação de regressão.

---

# 68. Model Evaluation

Antes de trocar modelos:

```text
baseline
candidate
evaluation dataset
comparison
cost
latency
quality
```

---

# 69. Prompt Evaluation

Alterações de prompt devem ser avaliadas.

Exemplo:

```text
prompt v12
vs
prompt v13
```

---

# 70. RAG Architecture

Arquitetura padrão:

```text
Documents
    ↓
Ingestion
    ↓
Chunking
    ↓
Embedding
    ↓
Vector Store
    ↓
Retriever
    ↓
Context Builder
    ↓
LLM
```

---

# 71. Document Ingestion

Ingestion deve ser desacoplada da consulta.

Pipeline:

```text
Upload
 ↓
Validation
 ↓
Extraction
 ↓
Normalization
 ↓
Chunking
 ↓
Embedding
 ↓
Indexing
```

---

# 72. Chunking

Chunking deve ser configurável por use case.

Considerar:

```text
chunk_size
overlap
semantic boundaries
metadata
```

---

# 73. Chunk Metadata

Cada chunk deve possuir metadata suficiente para rastreamento.

Exemplo:

```text
document_id
document_version
page
section
tenant_id
source
created_at
```

---

# 74. Embeddings

Embeddings devem possuir registry de modelos.

Exemplo:

```text
embedding_default
embedding_multilingual
```

---

# 75. Embedding Versioning

Não misturar embeddings incompatíveis no mesmo índice sem estratégia explícita.

Registrar:

```text
embedding_model
embedding_version
dimensions
```

---

# 76. Vector Store

A camada de domínio não deve depender diretamente de um banco vetorial específico.

Criar abstração:

```python
class VectorStore(Protocol):
    async def search(...):
        ...
```

---

# 77. Retrieval

Retrieval deve possuir parâmetros explícitos:

```text
top_k
score_threshold
filters
tenant
metadata
```

---

# 78. Tenant Isolation in RAG

Nunca permitir que retrieval retorne documentos de outro tenant.

Tenant filtering deve ocorrer na camada de retrieval e/ou banco, conforme arquitetura.

---

# 79. Hybrid Search

Quando apropriado, combinar:

```text
vector search
+
keyword search
```

---

# 80. Reranking

Quando necessário:

```text
Retriever
 ↓
Candidate documents
 ↓
Reranker
 ↓
Top context
 ↓
LLM
```

---

# 81. Context Limits

O sistema deve controlar:

```text
context window
retrieved tokens
prompt tokens
output tokens
```

---

# 82. RAG Grounding

Respostas baseadas em RAG devem, quando aplicável, fornecer referências.

Exemplo:

```json
{
  "answer": "...",
  "sources": [
    {
      "document_id": "123",
      "page": 5
    }
  ]
}
```

---

# 83. Hallucination Control

Quando a resposta não puder ser fundamentada:

```text
do not invent
```

Preferir:

```text
insufficient_information
```

ou resposta equivalente.

---

# 84. RAG Evaluation

Avaliar:

```text
retrieval_recall
context_relevance
groundedness
answer_relevance
citation_accuracy
```

---

# 85. Agents

Agents devem ser tratados como workflows controlados, não como acesso irrestrito ao sistema.

---

# 86. Agent Architecture

```text
Agent
 ├── Instructions
 ├── Model
 ├── Memory
 ├── Tools
 ├── Guardrails
 ├── Budget
 ├── Permissions
 └── Max Steps
```

---

# 87. Agent Permissions

Cada agent deve possuir permissões explícitas.

Exemplo:

```text
agent:document-assistant

allowed:
    documents:read
    documents:search

denied:
    documents:delete
    users:delete
```

---

# 88. Agent Tool Registry

Tools devem possuir registry.

Exemplo:

```text
search_documents
get_document
create_ticket
send_notification
update_record
```

---

# 89. Tool Schema

Toda tool deve possuir:

```text
name
description
input_schema
output_schema
permissions
risk
timeout
```

---

# 90. Tool Calling

Tool calls devem ser validados.

Pipeline:

```text
LLM
 ↓
Tool Request
 ↓
Schema Validation
 ↓
Authorization
 ↓
Risk Check
 ↓
Execution
 ↓
Result Validation
 ↓
LLM
```

---

# 91. High-Risk Tools

Tools de alto risco devem exigir controles adicionais.

Exemplos:

```text
delete_data
approve_payment
send_external_message
modify_permissions
execute_code
```

---

# 92. Human-in-the-Loop

Para operações críticas:

```text
Agent
 ↓
Proposal
 ↓
Human Approval
 ↓
Execution
```

---

# 93. Agent Maximum Steps

Agents devem possuir limite:

```text
max_steps
```

para evitar loops infinitos.

---

# 94. Agent Budget

Agents devem possuir limites de:

```text
tokens
cost
time
tool calls
```

---

# 95. Agent Memory

Memory deve ser explícita.

Tipos:

```text
short_term
session
long_term
retrieval_based
```

---

# 96. Memory Security

Memórias devem respeitar:

```text
tenant
user
authorization
retention
deletion
privacy
```

---

# 97. Tool Result Trust

Resultados de tools e sistemas externos devem ser tratados como dados.

Não devem alterar automaticamente a hierarquia de instruções.

---

# 98. Agent Prompt Injection

Agents devem considerar que:

```text
documents
web pages
emails
tool outputs
user inputs
```

podem conter instruções maliciosas.

---

# 99. Agent Sandboxing

Quando agents puderem executar código ou operações perigosas:

```text
sandbox
resource limits
network restrictions
filesystem restrictions
```

devem ser considerados obrigatórios.

---

# 100. Code Execution

Nunca permitir execução arbitrária de código pelo LLM diretamente no processo principal da aplicação.

Preferir sandbox isolado.

---

# 101. AI Tools and API

Quando uma API for exposta como tool:

```text
API Contract
+
Tool Contract
```

devem permanecer consistentes.

O AI-BAS deve referenciar o BAS.

---

# 102. AI Tool Risk

Cada tool deve possuir:

```text
risk_level:
  LOW
  MEDIUM
  HIGH
  CRITICAL
```

---

# 103. AI Confirmation

Tools de alto risco podem exigir:

```text
confirmation_required: true
```

---

# 104. AI Approval

A aprovação deve ser realizada pelo backend.

Nunca confiar somente em:

```text
LLM says approved
```

---

# 105. AI Business Rules

LLMs não devem substituir regras determinísticas quando uma regra de negócio puder ser implementada deterministicamente.

Preferir:

```text
Deterministic Rule
```

para:

```text
validation
authorization
calculation
financial totals
state transitions
```

---

# 106. AI Decision Support

Quando IA apoiar decisões:

```text
AI recommendation
        ↓
Business validation
        ↓
Policy validation
        ↓
Human/System decision
```

---

# 107. AI Must Not Bypass Authorization

Nunca permitir:

```text
LLM
 ↓
Tool
 ↓
Database
```

sem passar pelo mesmo modelo de autorização da aplicação.

---

# 108. AI Prompt Templates

Templates devem suportar:

```text
system
developer
user
context
examples
```

quando o provider permitir.

---

# 109. Prompt Variables

Variáveis devem ser explicitamente declaradas.

Exemplo:

```yaml
variables:
  - document
  - language
  - user_context
```

---

# 110. Prompt Injection via Variables

Variáveis provenientes de usuários ou documentos devem ser tratadas como dados.

Não concatenar instruções privilegiadas com conteúdo não confiável de maneira ambígua.

---

# 111. Prompt Composition

Prompts complexos podem ser compostos:

```text
Base Policy
+
Task Instructions
+
Context
+
User Input
```

---

# 112. AI Configuration

Configurações devem ser centralizadas.

Exemplo:

```text
temperature
max_output_tokens
top_p
model
provider
timeout
```

---

# 113. Environment Configuration

Secrets e provider credentials devem vir de:

```text
environment
secret manager
configuration service
```

Nunca do código-fonte.

---

# 114. AI API Keys

Provider credentials nunca devem ser enviados ao frontend.

---

# 115. Secret Rotation

Provider credentials devem suportar rotação.

---

# 116. AI Data Retention

Definir retenção para:

```text
prompts
responses
embeddings
documents
agent memory
traces
evaluation datasets
```

---

# 117. AI Data Deletion

Quando aplicável, suportar exclusão:

```text
user
tenant
document
conversation
memory
embedding
```

---

# 118. AI Privacy

Toda funcionalidade deve avaliar:

```text
what data is sent
where it is sent
how long it is retained
who can access it
```

---

# 119. AI Compliance

Quando necessário, considerar:

```text
LGPD
data residency
provider agreements
retention policies
auditability
consent
```

---

# 120. AI Incident Handling

Incidentes devem poder ser rastreados por:

```text
request_id
trace_id
model
provider
prompt_version
user
tenant
timestamp
```

---

# 121. AI Failure Modes

Considerar:

```text
provider unavailable
invalid output
hallucination
prompt injection
tool failure
retrieval failure
timeout
rate limit
budget exceeded
guardrail violation
```

---

# 122. Graceful Degradation

Quando possível:

```text
AI unavailable
      ↓
fallback behavior
      ↓
manual workflow
```

---

# 123. AI Availability

Funcionalidades críticas devem definir:

```text
availability target
fallback
timeout
degraded mode
```

---

# 124. Streaming

Streaming pode ser utilizado para:

```text
chat
long generation
interactive UX
```

mas deve possuir:

```text
authentication
authorization
disconnect handling
timeout
usage tracking
```

---

# 125. Streaming Security

Não transmitir dados que o usuário não teria autorização para receber somente porque estão sendo gerados em streaming.

---

# 126. AI Chat

Chat APIs devem possuir:

```text
conversation_id
message_id
user_id
tenant_id
model
prompt_version
```

quando necessário.

---

# 127. Conversation Ownership

Conversas devem possuir controle de acesso explícito.

---

# 128. Message Persistence

Definir se mensagens são:

```text
persisted
ephemeral
encrypted
redacted
```

---

# 129. AI Context Window

Conversas longas devem utilizar estratégia de:

```text
summarization
truncation
retrieval
memory
```

em vez de enviar todo o histórico indefinidamente.

---

# 130. AI Evaluation in CI

Quando possível:

```text
Code Change
 ↓
Unit Tests
 ↓
Integration Tests
 ↓
AI Evaluation
 ↓
Security Checks
```

---

# 131. AI Regression Thresholds

Definir thresholds.

Exemplo:

```text
quality >= baseline
hallucination <= threshold
cost <= threshold
latency <= threshold
```

---

# 132. Golden Dataset

Casos críticos devem possuir um conjunto de testes estável.

Exemplo:

```text
golden_cases/
    document_summary.json
    invoice_extraction.json
    support_classification.json
```

---

# 133. Human Evaluation

Para funcionalidades subjetivas, avaliações humanas podem complementar avaliações automáticas.

---

# 134. LLM-as-Judge

Pode ser utilizado, mas nunca deve ser tratado como verdade absoluta.

Sempre considerar:

```text
judge bias
model bias
evaluation drift
```

---

# 135. AI Quality Monitoring

Em produção monitorar:

```text
quality signals
user feedback
fallback rate
error rate
cost
latency
```

---

# 136. User Feedback

Quando aplicável, suportar:

```text
thumbs_up
thumbs_down
rating
feedback_reason
```

---

# 137. AI Feedback Loop

```text
Production
 ↓
Feedback
 ↓
Evaluation Dataset
 ↓
Prompt / Model Improvement
 ↓
Evaluation
 ↓
Release
```

---

# 138. Model Drift

Monitorar alterações de qualidade causadas por:

```text
model updates
provider changes
data changes
prompt changes
retrieval changes
```

---

# 139. Provider Changes

Provider/model updates devem ser tratados como mudanças potencialmente impactantes.

Não assumir que:

```text
same model name
```

significa:

```text
same behavior
```

---

# 140. Model Pinning

Para workloads críticos, considerar pinning de versões de modelos quando suportado.

---

# 141. AI Configuration Registry

Centralizar:

```text
models
providers
prompts
guardrails
budgets
limits
routing
```

---

# 142. Feature Flags

AI features devem poder ser controladas por feature flags.

Exemplo:

```text
ai_document_summary_enabled
new_model_enabled
agent_tools_enabled
```

---

# 143. Canary Releases

Mudanças importantes podem utilizar:

```text
5% traffic
 ↓
evaluation
 ↓
25%
 ↓
100%
```

---

# 144. AI Rollback

Rollback deve permitir retornar:

```text
prompt version
model
provider
configuration
guardrails
```

---

# 145. AI Cost Optimization

O sistema deve considerar:

```text
model selection
prompt size
context size
caching
batching
embedding reuse
semantic caching
```

quando apropriado.

---

# 146. Semantic Cache

Quando implementado:

```text
request
 ↓
semantic similarity
 ↓
cached response
```

deve respeitar:

```text
authorization
tenant
data freshness
privacy
```

---

# 147. AI Caching Security

Nunca retornar cache de uma requisição autorizada para outro usuário/tenant sem garantir equivalência de contexto e autorização.

---

# 148. Batch AI

Quando suportado, utilizar batch processing para workloads não interativos.

Exemplo:

```text
10000 documents
 ↓
batch
 ↓
async processing
```

---

# 149. AI Queue

Workloads pesados devem utilizar jobs/queues.

```text
API
 ↓
Queue
 ↓
AI Worker
 ↓
Provider
```

---

# 150. AI Worker

Workers devem possuir:

```text
timeout
retry
dead letter
concurrency
rate limit
budget control
```

---

# 151. AI Dead Letter Queue

Falhas persistentes devem poder ser encaminhadas para DLQ.

---

# 152. AI Job Idempotency

Jobs de IA devem possuir identificadores idempotentes quando operações puderem ser repetidas.

---

# 153. AI Concurrency

Limitar concorrência para evitar:

```text
provider overload
budget explosion
database overload
```

---

# 154. AI Backpressure

Quando necessário:

```text
Queue
 ↓
Concurrency limit
 ↓
Provider
```

---

# 155. AI Provider Rate Limits

O Gateway deve conhecer ou controlar limites do provider.

---

# 156. AI Error Normalization

Normalizar erros de providers.

Exemplo:

```text
ProviderError
 ├── RATE_LIMITED
 ├── TIMEOUT
 ├── UNAVAILABLE
 ├── INVALID_REQUEST
 ├── CONTENT_BLOCKED
 └── UNKNOWN
```

---

# 157. Provider-Specific Errors

Detalhes específicos podem ser armazenados internamente, mas não devem vazar automaticamente para a API pública.

---

# 158. AI API Error Contract

Exemplo:

```json
{
  "error": {
    "code": "AI_PROVIDER_UNAVAILABLE",
    "message": "AI service temporarily unavailable",
    "request_id": "req_123"
  }
}
```

---

# 159. AI Security Boundary

A arquitetura deve assumir:

```text
LLM = untrusted reasoning engine
```

Não:

```text
LLM = trusted application authority
```

---

# 160. AI Never Owns Authorization

Autorização deve permanecer no backend determinístico.

---

# 161. AI Never Owns Financial Calculation

Valores financeiros críticos devem ser calculados por código determinístico.

---

# 162. AI Never Owns Irreversible State

Estados irreversíveis devem possuir validação e autorização fora do LLM.

---

# 163. AI Agent Governance

Agents devem possuir:

```text
identity
owner
permissions
tools
limits
budget
risk level
audit
```

---

# 164. AI Service Identity

Cada agent pode possuir identidade própria.

Exemplo:

```text
agent_id
agent_role
agent_permissions
```

---

# 165. Agent Audit

Registrar:

```text
agent
user
tenant
tool
action
result
timestamp
```

---

# 166. Tool Audit

Operações realizadas por tools devem possuir audit trail.

---

# 167. AI Explainability

Quando necessário, retornar:

```text
sources
confidence
reason codes
decision metadata
```

sem expor chain-of-thought privado.

---

# 168. Chain of Thought

Não armazenar ou expor raciocínio interno detalhado do modelo como requisito de explicabilidade.

Preferir:

```text
decision summary
evidence
sources
structured reasoning metadata
```

---

# 169. Confidence

Confidence só deve ser exposta quando houver método tecnicamente válido para calculá-la.

Não inventar:

```text
confidence = 0.97
```

sem base.

---

# 170. AI Safety Boundary

AI pode:

```text
analyze
summarize
classify
recommend
extract
generate
retrieve
```

mas ações críticas devem passar por:

```text
authorization
validation
policy
audit
```

---

# 171. AI API Contract

Endpoints AI devem seguir o Volume IV.

Exemplo:

```yaml
endpoint:
  name: GenerateSummary
  method: POST
  path: /api/v1/documents/{id}/summary

ai:
  capability: summarization
  model_alias: default_reasoning
  structured_output: true
  guardrails: standard
  evaluation_suite: document_summary_v1
  budget: standard_ai
```

---

# 172. AI Component Contract

Componentes AI reutilizáveis devem possuir:

```text
input
output
dependencies
permissions
risk
cost
latency
failure modes
observability
```

---

# 173. AI Service Interface

Exemplo:

```python
class AIService(Protocol):

    async def generate(
        self,
        use_case: str,
        request: AIRequest,
    ) -> AIResponse:
        ...
```

---

# 174. AI Gateway Interface

Exemplo:

```python
class LLMGateway(Protocol):

    async def complete(
        self,
        request: LLMRequest,
    ) -> LLMResponse:
        ...
```

---

# 175. Embedding Service

Exemplo:

```python
class EmbeddingService(Protocol):

    async def embed(
        self,
        texts: list[str],
    ) -> list[list[float]]:
        ...
```

---

# 176. Retrieval Service

Exemplo:

```python
class RetrievalService(Protocol):

    async def search(
        self,
        query: str,
        filters: dict,
        top_k: int,
    ) -> list[RetrievedDocument]:
        ...
```

---

# 177. Agent Service

Exemplo:

```python
class AgentService(Protocol):

    async def run(
        self,
        agent_id: str,
        request: AgentRequest,
    ) -> AgentResponse:
        ...
```

---

# 178. Tool Registry

Exemplo:

```python
class ToolRegistry:

    def register(self, tool: ToolDefinition):
        ...

    def get(self, name: str) -> ToolDefinition:
        ...

    def list_allowed(self, context: SecurityContext):
        ...
```

---

# 179. AI Dependency Injection

AI providers devem ser injetados.

Não criar clients diretamente nos services.

---

# 180. AI Configuration via Dependency Injection

Permitir:

```text
mock provider
test provider
production provider
```

sem alterar regra de negócio.

---

# 181. Testing AI Components

Testes devem incluir:

```text
unit
integration
contract
evaluation
security
```

---

# 182. Mock LLM

Testes determinísticos devem utilizar mock/fake LLM quando não for necessário chamar provider real.

---

# 183. AI Integration Tests

Poucos testes devem chamar providers reais.

Devem ser:

```text
controlled
expensive-aware
isolated
```

---

# 184. AI Contract Tests

Validar:

```text
request
response
schema
provider adapter
error normalization
```

---

# 185. AI Security Tests

Testar:

```text
prompt injection
tool abuse
tenant leakage
PII leakage
unauthorized tool
budget bypass
rate limit bypass
```

---

# 186. RAG Security Tests

Testar explicitamente:

```text
tenant isolation
document permissions
metadata filters
cross-user retrieval
deleted documents
```

---

# 187. Agent Security Tests

Testar:

```text
unauthorized tool
tool escalation
prompt injection
loop
budget exhaustion
permission bypass
```

---

# 188. AI Load Testing

Workloads críticos devem avaliar:

```text
concurrency
provider rate limits
queue behavior
latency
cost
failure recovery
```

---

# 189. AI Chaos Testing

Quando necessário, simular:

```text
provider unavailable
slow provider
invalid output
rate limit
network failure
partial failure
```

---

# 190. AI Operational Dashboard

Quando relevante, dashboard deve mostrar:

```text
requests
success rate
latency
tokens
cost
provider
model
fallbacks
errors
guardrail blocks
quality metrics
```

---

# 191. AI Cost Dashboard

Mostrar:

```text
total cost
cost by tenant
cost by user
cost by feature
cost by model
cost by provider
```

---

# 192. AI Quality Dashboard

Mostrar:

```text
evaluation score
feedback
hallucination indicators
retrieval quality
output validation failures
```

---

# 193. AI Model Registry

Registry deve permitir:

```text
model
provider
capabilities
limits
pricing
status
approved
deprecated
```

---

# 194. Approved Model Policy

Somente modelos aprovados devem ser utilizados em produção.

---

# 195. Experimental Models

Modelos experimentais devem ser explicitamente marcados:

```text
experimental: true
```

---

# 196. AI Environment Policy

Development:

```text
mock / cheap models
```

Staging:

```text
controlled provider access
```

Production:

```text
approved models only
```

---

# 197. AI Production Gate

Antes de produção:

```text
[ ] Provider approved
[ ] Model approved
[ ] Prompt version approved
[ ] Evaluation passed
[ ] Security review
[ ] Cost reviewed
[ ] Rate limits
[ ] Guardrails
[ ] Observability
[ ] Audit
[ ] Rollback strategy
```

---

# 198. AI Change Management

Alterações em:

```text
model
provider
prompt
RAG
embedding
retriever
agent
tool
guardrail
```

devem ser tratadas como mudanças de software potencialmente impactantes.

---

# 199. AI Change Record

Registrar:

```text
what changed
why
who
previous version
new version
evaluation result
risk
rollback
```

---

# 200. AI-BAS Endpoint Template

Toda funcionalidade AI exposta via API deve utilizar:

```yaml
ai_endpoint:
  name:

  capability:

  risk_level:

  authentication:

  authorization:

  tenant_policy:

  input_schema:

  output_schema:

  model_alias:

  provider_policy:

  prompt:
    name:
    version:

  structured_output:

  guardrails:

  rag:
    enabled:
    retrieval_policy:

  tools:
    enabled:
    allowed:

  agent:
    enabled:
    max_steps:
    max_cost:

  rate_limit:

  budget:

  timeout:

  retry_policy:

  fallback:

  audit:

  observability:

  evaluation_suite:

  failure_modes:

  human_approval:

  rollback_strategy:
```

---

# 201. AI Definition of Done

Uma funcionalidade AI só está pronta quando:

```text
[ ] Use case defined
[ ] Risk classified
[ ] Model strategy defined
[ ] Provider abstraction implemented
[ ] Prompt versioned
[ ] Structured output defined where applicable
[ ] Input validation
[ ] Output validation
[ ] Guardrails
[ ] Authorization
[ ] Tenant isolation
[ ] Rate limit
[ ] Budget
[ ] Cost tracking
[ ] Token tracking
[ ] Observability
[ ] Audit
[ ] Evaluation dataset
[ ] Evaluation baseline
[ ] Security tests
[ ] Failure strategy
[ ] Rollback strategy
[ ] API contract
[ ] Documentation
```

---

# 202. AI Architecture Golden Rules

## Rule 1

Nunca acoplar domínio diretamente ao provider.

## Rule 2

Nunca confiar no LLM para autorização.

## Rule 3

Nunca utilizar LLM para regras determinísticas desnecessariamente.

## Rule 4

Sempre validar structured output.

## Rule 5

Sempre controlar custo.

## Rule 6

Sempre controlar timeout.

## Rule 7

Sempre considerar prompt injection.

## Rule 8

Sempre respeitar tenant isolation.

## Rule 9

Agents devem possuir permissões explícitas.

## Rule 10

Tools devem possuir schemas.

## Rule 11

Operações críticas exigem validação determinística.

## Rule 12

AI output não deve ser automaticamente considerado verdade.

## Rule 13

Prompts devem possuir versionamento.

## Rule 14

Model changes devem poder ser avaliados.

## Rule 15

Toda AI importante deve ser observável.

---

# 203. AI First Development Flow

```text
Requirement
    ↓
AI Use Case
    ↓
Risk Classification
    ↓
AI Contract
    ↓
Input / Output Schemas
    ↓
Prompt
    ↓
Model Strategy
    ↓
Provider Strategy
    ↓
Guardrails
    ↓
Authorization
    ↓
Implementation
    ↓
Evaluation
    ↓
Security Testing
    ↓
Observability
    ↓
Production
```

---

# 204. AI Agent Development Flow

```text
Agent Definition
    ↓
Risk Classification
    ↓
Identity
    ↓
Permissions
    ↓
Tools
    ↓
Tool Schemas
    ↓
Guardrails
    ↓
Memory
    ↓
Budget
    ↓
Max Steps
    ↓
Human Approval
    ↓
Evaluation
    ↓
Security Testing
    ↓
Production
```

---

# 205. RAG Development Flow

```text
Source
    ↓
Ingestion
    ↓
Validation
    ↓
Extraction
    ↓
Chunking
    ↓
Metadata
    ↓
Embedding
    ↓
Vector Store
    ↓
Retrieval
    ↓
Reranking
    ↓
Context
    ↓
LLM
    ↓
Grounded Response
    ↓
Evaluation
```

---

# 206. AI Production Architecture

```text
                         ┌───────────────────────┐
                         │       FastAPI         │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │      AI Service       │
                         └───────────┬───────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
             ┌────────────┐  ┌──────────────┐  ┌──────────────┐
             │ LLM Gateway│  │ RAG Service  │  │ Agent Service│
             └──────┬─────┘  └──────┬───────┘  └──────┬───────┘
                    │               │                 │
          ┌─────────┼───────┐       │          ┌──────┴──────┐
          ▼         ▼       ▼       ▼          ▼             ▼
       OpenAI   Anthropic Google  Vector DB   Tools        Memory
          │         │       │
          └─────────┼───────┘
                    │
                    ▼
             AI Observability
                    │
        ┌───────────┼────────────┐
        ▼           ▼            ▼
      Metrics      Traces       Cost
        │           │            │
        └───────────┼────────────┘
                    ▼
              AI Dashboard
```

---

# 207. AI Platform Layers

A implementação deve separar:

```text
Layer 1 — API
Layer 2 — AI Application Services
Layer 3 — AI Gateway
Layer 4 — Provider Adapters
Layer 5 — RAG / Embeddings
Layer 6 — Agents / Tools
Layer 7 — Evaluation
Layer 8 — Observability
Layer 9 — Governance
```

---

# 208. AI Backend Standard

O backend deve evoluir de:

```text
Application
    ↓
LLM API
```

para:

```text
Application
    ↓
AI Platform
    ├── Gateway
    ├── Models
    ├── Providers
    ├── Prompts
    ├── RAG
    ├── Agents
    ├── Tools
    ├── Guardrails
    ├── Evaluation
    ├── Observability
    └── Governance
```

---

# 209. Final Principle

O objetivo do AI-BAS não é apenas permitir que o backend "use IA".

O objetivo é criar uma **AI Platform interna, governada, observável, segura, testável e provider-agnostic**, capaz de evoluir de simples chamadas de LLM para sistemas complexos de RAG, agents e automações sem criar dívida arquitetural.

A regra final é:

```text
AI is a platform capability,
not a collection of provider API calls.
```

E:

```text
LLM
 ≠
Business Logic

LLM
 ≠
Authorization

LLM
 ≠
Source of Truth

LLM
 =
Probabilistic Intelligence Layer
```

A aplicação continua responsável por:

```text
Security
Authorization
Business Rules
Data Integrity
Transactions
Audit
Governance
```

Enquanto a camada AI é responsável por:

```text
Reasoning
Generation
Extraction
Classification
Retrieval
Recommendation
Agentic Workflows
```

A combinação dessas duas camadas deve produzir um backend **API First + AI First**, sem sacrificar determinismo, segurança, observabilidade ou governança.