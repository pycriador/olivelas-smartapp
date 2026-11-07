# Modelo de Qualidade da Documentação

> Language: pt-BR | [English (EN)](../en/quality-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Um modelo leve para avaliar a qualidade da documentação sem burocracia.

Use-o para autoavaliação, revisões e priorização de dívida documental — não como competição de nota.

## Dimensões

| Dimensão | Pergunta |
| --- | --- |
| **Accuracy** (precisão) | O conteúdo corresponde ao sistema como ele existe? |
| **Completeness** (completude) | Os tópicos necessários ao propósito do documento estão presentes? |
| **Consistência** (consistência) | Termos, status e claims batem entre docs relacionados? |
| **Frescor** (frescor) | O conteúdo está atual em relação a mudanças relevantes recentes? |
| **Rastreabilidade** (rastreabilidade) | Claims podem ser rastreados a código, config, contratos, ADRs ou classificação explícita? |
| **Usability** (usabilidade) | O leitor encontra e aplica a informação rapidamente? |
| **Maintainability** (manutenibilidade) | O time dono consegue atualizar sem esforço heróico? |
| **AI Readability** | A estrutura e a redação são claras o bastante para agentes de IA usarem como contexto confiável? |

Precisão supera volume. Uma seção Confirmed curta é melhor que uma longa inventada.

## Dimensões de qualidade AI-ready

Ao avaliar documentação como **contexto de IA** (Documentation Standard v1.0), aplique as dimensões gerais acima e estas dimensões AI-ready:

| Dimensão | Pergunta |
| --- | --- |
| **Discoverability** | Um agente encontra rapidamente o ponto de entrada, o doc canônico e a linha do registro para o tópico? |
| **Comprehensibility** | Escopo, claims e limites são inequívocos no nível de contexto carregado? |
| **Rastreabilidade** | Cada claim material remete a evidência, IDs ou a um Unknown explícito? |
| **Consistência** | Nomes canônicos, status e relacionamentos batem no pacote de contexto? |
| **Frescor** | O contexto carregado está atual o bastante em relação a código/config e datas de review? |
| **Machine Readability** | Metadata, tabelas, enums e IDs estão estruturados para parsing confiável? |
| **Context Integrity** | Sistemas, eras e limites Confirmed vs Proposed são preservados sem misturar? |

## Dimensões de qualidade de governança

Ao avaliar documentação governada (Documentation Standard v1.0), pergunte também:

| Dimensão | Pergunta |
| --- | --- |
| **Enforceability** | Falhas objetivas podem ser capturadas pela automação antes do merge? |
| **Accountability** | O ownership está claro para docs Authoritative e operacionais? |
| **Exception hygiene** | Waivers são explícitos, têm owner e não estão expirados? |
| **Gate clarity** | ERROR / WARNING / INFO mapeiam para comportamento conhecido de CI? |
| **Auditability** | Mudanças materiais de doc/governança podem ser reconstruídas? |
| **Segurança** | O contexto está livre de valores de segredo e dados sensíveis desnecessários, só com referências seguras? |

Use [ai-ready-checklist.md](ai-ready-checklist.md) e [documentation-health.md](documentation-health.md). Entrada: [ai-context.md](ai-context.md).

## Dimensões de qualidade de contratos

Ao avaliar **contratos técnicos**, aplique as dimensões gerais e estas específicas de contrato:

| Dimensão | Pergunta |
| --- | --- |
| **Clarity** | Está claro o que o contrato representa e quem participa? |
| **Completeness** | As regras necessárias estão documentadas (schema, semântica, erros, retry, … conforme aplicável)? |
| **Consistência** | Documentação, schema e implementação estão alinhados (ou a Source of Truth está explícita)? |
| **Compatibility** | O impacto da mudança em producers e consumers pode ser avaliado? |
| **Rastreabilidade** | Há links contrato ↔ producer ↔ consumer (e arquitetura)? |
| **Testability** | O contrato pode ser verificado (producer/consumer/schema/compatibilidade)? |
| **Discoverability** | Integradores encontram o contrato canônico rapidamente? |
| **Maintainability** | O time dono consegue atualizar o contrato sem esforço heróico? |

Use [contract-checklist.md](contract-checklist.md) para checagens item a item. Drift e dívida: [contract-drift.md](contract-drift.md), [contract-debt.md](contract-debt.md).

## Dimensões de qualidade de operações

Ao avaliar **documentação de operações e confiabilidade**, aplique as dimensões gerais e estas específicas de ops:

| Dimensão | Pergunta |
| --- | --- |
| **Operability** | Operadores conseguem executar, mudar e escalar com segurança com os procedimentos documentados? |
| **Observability** | Os sinais bastam para detectar e diagnosticar falhas materiais (ou estão explicitamente N/A / Not Documented)? |
| **Recoverability** | Recovery, rollback, restore e postura de RPO/RTO são honestos e usáveis? |
| **Resilience** | Modos de falha, degradação e isolamento estão documentados sem falso conforto? |
| **Actionability** | Alertas e runbooks conduzem a próximas ações claras (não ruído ou teatro)? |
| **Accuracy** | Os docs de ops batem com a forma real de operar o sistema (sem SLOs, comandos ou DR inventados)? |

Use [operations-checklist.md](operations-checklist.md) e [operational-readiness-checklist.md](operational-readiness-checklist.md). Drift e dívida: [operational-drift.md](operational-drift.md), [reliability-debt.md](reliability-debt.md).

## Dimensões de qualidade de segurança

Ao avaliar **documentação de segurança**, aplique as dimensões gerais e estas específicas de segurança:

| Dimensão | Pergunta |
| --- | --- |
| **Confidentiality** | Dados sensíveis e segredos estão protegidos de divulgação não autorizada (ou gaps marcados com honestidade)? |
| **Integrity** | Modificações não autorizadas ou não detectadas a dados, código ou evidência estão endereçadas? |
| **Availability** | Riscos de disponibilidade relevantes à segurança (ex.: falha de dependência de auth, postura ransomware) estão documentados sem inventar DR? |
| **Authenticity** | Está claro como principals e artefatos são autenticados / atestados quando aplicável? |
| **Authorization** | Está claro o que principals podem fazer — least privilege vs gaps de over-privilege? |
| **Accountability** | Ações relevantes à segurança podem ser atribuídas (auditabilidade) sem despejar PII/segredos nos docs? |
| **Resilience** | Detecção, contenção e recovery de incidentes de segurança são usáveis e ligados a ops? |
| **Rastreabilidade** | Dá para seguir assets→threats→risks→requirements→controls→evidence (ou marcar unknowns)? |

Use [security-checklist.md](security-checklist.md) e [security-readiness-checklist.md](security-readiness-checklist.md). Drift e dívida: [security-drift.md](security-drift.md), [security-debt.md](security-debt.md). Integridade de evidência: [security-evidence.md](security-evidence.md).

## Níveis

| Nível | Nome | Significado |
| --- | --- | --- |
| **LEVEL 0** | Missing | A documentação necessária não existe |
| **LEVEL 1** | Basic | Notas mínimas existem; gaps e unknowns são grandes |
| **LEVEL 2** | Documented | Docs canônicos cobrem o tópico com estrutura usável |
| **LEVEL 3** | Reviewed | Conteúdo passou por review significativo contra evidência |
| **LEVEL 4** | Governed | Ciclo de vida, ownership, metadata e práticas de mudança/review estão aplicados |

### LEVEL 0 — Missing

Não há documento canônico para um tópico necessário. Registre dívida e crie um draft.

### LEVEL 1 — Basic

Algo existe (fragmento de README, cópia desatualizada de wiki, draft parcial). Não é seguro como única orientação operacional.

### LEVEL 2 — Documented

A estrutura segue templates/standards; o escopo está claro; unknowns estão marcados. Ainda pode ser `DRAFT` ou `REVIEW` inicial.

### LEVEL 3 — Reviewed

Review completo para o escopo atual; status tipicamente `ACCEPTED`; claims estão evidenciados ou classificados.

### LEVEL 4 — Governed

Nível 3 mais ownership ativo, status de ciclo de vida honesto, metadata (`owner`, `updated`, …) e atualizações amarradas a mudanças relevantes ([change-policy.md](change-policy.md), [lifecycle.md](lifecycle.md)).

## Uso prático

- Almeje Level 3 para runbooks, contratos e docs de segurança críticos de produção (threat models, caminhos de incidente, tratamento de segredos).
- Almeje Level 4 para docs substantivos de longa duração em projetos adotantes.
- Use as dimensões para explicar *por que* um doc é fraco (por exemplo "falha de frescor" vs "ausente por completo").
- Não invente tokens de status alternativos para codificar níveis de qualidade — níveis são rótulos de avaliação, não metadata de `status`.

## Documentos relacionados

- [lifecycle.md](lifecycle.md)
- [review-policy.md](review-policy.md)
- [documentation-debt.md](documentation-debt.md)
- [stale-documentation.md](stale-documentation.md)
- [standards.md](standards.md)
- [documentation-checklist.md](documentation-checklist.md)
- [contract-checklist.md](contract-checklist.md)
- [contract-model.md](contract-model.md)
- [contracts/README.md](contracts/README.md)
- [operations-checklist.md](operations-checklist.md)
- [operations-model.md](operations-model.md)
- [operations/README.md](operations/README.md)
- [security-checklist.md](security-checklist.md)
- [security-model.md](security-model.md)
- [security/README.md](security/README.md)
- [ai-context.md](ai-context.md)
- [ai-ready-model.md](ai-ready-model.md)
- [ai-ready-checklist.md](ai-ready-checklist.md)
- [documentation-health.md](documentation-health.md)
- [machine-readable.md](machine-readable.md)
