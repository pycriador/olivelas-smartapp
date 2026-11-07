# Índice da documentação

> Language: pt-BR | [English (EN)](../en/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Índice central do Padrão de Documentação de Engenharia.

Este repositório define **como** projetos devem documentar software e infraestrutura — incluindo estrutura, templates, **governança do ciclo de vida documental**, **metodologia de arquitetura** com progressive disclosure (Context → System → Components → Interfaces → Implementation), **metodologia de contratos técnicos**, **metodologia de operações e confiabilidade**, **metodologia de segurança**, **metodologia de documentação AI-ready** e **automação e governança** (validação, quality gates, exceções).

Cadeias progressivas: **Arquitetura → Contratos → Operações → Recovery** · **Arquitetura → Trust Boundaries → Assets → Threats → Controls → Operações → Response** · **Question → Scope → Context → Knowledge → Evidence → Constraints → Answer** · **Change → Validate → Gate → Review → Merge**.

## Comece por aqui

| Documento | Propósito |
| --- | --- |
| [principles.md](principles.md) | Princípios fundamentais de documentação |
| [lifecycle.md](lifecycle.md) | Ciclo de vida oficial da documentação |
| [architecture-model.md](architecture-model.md) | Níveis de documentação de arquitetura e progressive disclosure |
| [contract-model.md](contract-model.md) | Contratos técnicos como limites entre participantes |
| [operations-model.md](operations-model.md) | Operate → Observe → Detect → Diagnose → Respond → Recover → Learn → Improve |
| [reliability-model.md](reliability-model.md) | Dependências, modos de falha, degradação, recuperação, limites |
| [standards.md](standards.md) | Formatação, metadata, status, classificação, referências |
| [publishing-surfaces.md](publishing-surfaces.md) | Links em duas superfícies: SoT GitHub/local + publicação Confluence |
| [style-guide.md](style-guide.md) | Como escrever documentação |
| [ai-context.md](ai-context.md) | **Entrada primária de IA** — progressive context e navegação |
| [ai-agent-entry.md](ai-agent-entry.md) | Empacotamento opcional Cursor / Claude Code (`AGENTS.md`, skills) |
| [ai-ready-checklist.md](ai-ready-checklist.md) | Checklist mínimo de documentação AI-ready |
| [ai-documentation.md](ai-documentation.md) | Regras de escrita de IA por domínio (arquitetura, contratos, ops, segurança) |
| [governance.md](governance.md) | Modelo de governança da documentação |
| [automation.md](automation.md) | Arquitetura de validação no repositório |
| [documentation-checklist.md](documentation-checklist.md) | Checklist mínimo de qualidade |
| [adoption-path.md](adoption-path.md) | Caminho Day 0 / 30 / 90 (não exige tudo de uma vez) |
| [flat-docs-migration.md](flat-docs-migration.md) | Migrar docs flat → árvore do padrão |
| [observability-platform-notes.md](observability-platform-notes.md) | Plataforma org (ex. Datadog) ≠ requisito do framework |
| [quality-model.md](quality-model.md) | Dimensões de qualidade e níveis de maturidade |
| [versioning.md](versioning.md) | Versionamento do padrão e dos documentos |
| [language.md](language.md) | Política de idioma (EN e pt-BR) |

## Ciclo de vida e governança

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [lifecycle.md](lifecycle.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [status.md](status.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [ownership.md](ownership.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [review-policy.md](review-policy.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [change-policy.md](change-policy.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [documentation-debt.md](documentation-debt.md) | Governance | REVIEW | documentation-standard | 2026-08-13 |
| [changelog.md](changelog.md) | Governance | DRAFT | documentation-standard | 2026-08-13 |
| [stale-documentation.md](stale-documentation.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [deprecation.md](deprecation.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [archive-policy.md](archive-policy.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [changelog-policy.md](changelog-policy.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [quality-model.md](quality-model.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |

Projetos adotantes podem manter uma tabela de inventário semelhante para os próprios documentos (status, owner, updated, version). Automação é opcional.

## Metodologia de arquitetura

Docs de arquitetura usam progressive disclosure: Context → System → Components → Interfaces → Implementation. Os níveis são profundidade documental, não camadas obrigatórias de runtime. Comece por [architecture-model.md](architecture-model.md).

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [architecture-model.md](architecture-model.md) | Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |
| [system-boundaries.md](system-boundaries.md) | Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |
| [component-relationships.md](component-relationships.md) | Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-diagrams.md](architecture-diagrams.md) | Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |
| [diagram-selection.md](diagram-selection.md) | Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |
| [mermaid-standards.md](mermaid-standards.md) | Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |
| [failure-domains.md](failure-domains.md) | Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |
| [trust-boundaries.md](trust-boundaries.md) | Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-traceability.md](architecture-traceability.md) | Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-vs-implementation.md](architecture-vs-implementation.md) | Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-by-project-type.md](architecture-by-project-type.md) | Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-checklist.md](architecture-checklist.md) | Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-review.md](architecture-review.md) | Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-drift.md](architecture-drift.md) | Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-debt.md](architecture-debt.md) | Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |

## Metodologia de contratos

Contratos técnicos documentam limites verificáveis (API, Event, Message, File e tipos relacionados). Comece por [contract-model.md](contract-model.md); valide com [contract-checklist.md](contract-checklist.md). Hub da categoria: [contracts/README.md](contracts/README.md).

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [contract-model.md](contract-model.md) | Contratos | ACCEPTED | documentation-standard | 2026-08-07 |
| [contract-types.md](contract-types.md) | Contratos | ACCEPTED | documentation-standard | 2026-08-07 |
| [schema-documentation.md](schema-documentation.md) | Contratos | ACCEPTED | documentation-standard | 2026-08-07 |
| [semantic-contracts.md](semantic-contracts.md) | Contratos | ACCEPTED | documentation-standard | 2026-08-07 |
| [retry-policy.md](retry-policy.md) | Contratos | ACCEPTED | documentation-standard | 2026-08-07 |
| [idempotency.md](idempotency.md) | Contratos | ACCEPTED | documentation-standard | 2026-08-07 |
| [delivery-semantics.md](delivery-semantics.md) | Contratos | ACCEPTED | documentation-standard | 2026-08-07 |
| [contract-versioning.md](contract-versioning.md) | Contratos | ACCEPTED | documentation-standard | 2026-08-07 |
| [contract-compatibility.md](contract-compatibility.md) | Contratos | ACCEPTED | documentation-standard | 2026-08-07 |
| [contract-lifecycle.md](contract-lifecycle.md) | Contratos | ACCEPTED | documentation-standard | 2026-08-07 |
| [breaking-changes.md](breaking-changes.md) | Contratos | ACCEPTED | documentation-standard | 2026-08-07 |
| [api-contracts.md](api-contracts.md) / [event-contracts.md](event-contracts.md) / [message-contracts.md](message-contracts.md) / [file-contracts.md](file-contracts.md) | Contratos (por tipo) | ACCEPTED | documentation-standard | 2026-08-07 |
| [contract-checklist.md](contract-checklist.md) | Contratos | ACCEPTED | documentation-standard | 2026-08-07 |
| [contract-drift.md](contract-drift.md) / [contract-debt.md](contract-debt.md) / [contract-testing.md](contract-testing.md) | Contratos (qualidade) | ACCEPTED | documentation-standard | 2026-08-07 |

Amostras ficcionais preenchidas: [../../examples/contracts/](../../examples/contracts/).

## Metodologia de Operações e Confiabilidade

Docs de operações cobrem como operar, observar, detectar, diagnosticar, responder, recuperar, aprender e melhorar. Docs de confiabilidade descrevem dependências, modos de falha, degradação e limites. Comece por [operations-model.md](operations-model.md) e [reliability-model.md](reliability-model.md); valide com [operations-checklist.md](operations-checklist.md) e [operational-readiness-checklist.md](operational-readiness-checklist.md). Hub da categoria: [operations/README.md](operations/README.md).

```text
Architecture → Contracts → Operations → Recovery
```

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [operations-model.md](operations-model.md) | Operações | ACCEPTED | documentation-standard | 2026-08-07 |
| [reliability-model.md](reliability-model.md) | Operações | ACCEPTED | documentation-standard | 2026-08-07 |
| [operational-ownership.md](operational-ownership.md) | Operações | ACCEPTED | documentation-standard | 2026-08-07 |
| [criticality.md](criticality.md) | Operações | ACCEPTED | documentation-standard | 2026-08-07 |
| [service-levels.md](service-levels.md) / [error-budget.md](error-budget.md) | Operações | ACCEPTED | documentation-standard | 2026-08-07 |
| [failure-modes.md](failure-modes.md) / [failure-propagation.md](failure-propagation.md) / [degradation.md](degradation.md) | Operações | ACCEPTED | documentation-standard | 2026-08-07 |
| [dependency-reliability.md](dependency-reliability.md) / [operational-dependencies.md](operational-dependencies.md) | Operações | ACCEPTED | documentation-standard | 2026-08-07 |
| [observability-model.md](observability-model.md) / [health-checks.md](health-checks.md) / [monitoring.md](monitoring.md) / [alerting.md](alerting.md) | Observability | ACCEPTED | documentation-standard | 2026-08-07 |
| [runbooks/README.md](runbooks/README.md) / [incident-management.md](incident-management.md) / [incident-severity.md](incident-severity.md) | Operações | ACCEPTED | documentation-standard | 2026-08-07 |
| [post-incident-review.md](post-incident-review.md) / [corrective-actions.md](corrective-actions.md) / [root-cause-analysis.md](root-cause-analysis.md) | Operações | ACCEPTED | documentation-standard | 2026-08-07 |
| [deployment-operations.md](deployment-operations.md) / [rollback.md](rollback.md) / [backup-restore.md](backup-restore.md) / [disaster-recovery.md](disaster-recovery.md) | Operações | ACCEPTED | documentation-standard | 2026-08-07 |
| [operational-readiness.md](operational-readiness.md) / [operational-readiness-checklist.md](operational-readiness-checklist.md) | Operações | ACCEPTED | documentation-standard | 2026-08-07 |
| [operations-checklist.md](operations-checklist.md) / [reliability-debt.md](reliability-debt.md) / [operational-drift.md](operational-drift.md) | Operações | ACCEPTED | documentation-standard | 2026-08-07 |

Amostras ficcionais preenchidas: [../../examples/operations/](../../examples/operations/).

## Metodologia de Segurança

Docs de segurança descrevem o que deve ser protegido, de quê, como e com qual evidência — sem inventar controles, certificações ou vulnerabilidades. Comece por [security-model.md](security-model.md); valide com [security-checklist.md](security-checklist.md) e [security-readiness-checklist.md](security-readiness-checklist.md). Hub da categoria: [security/README.md](security/README.md).

```text
Architecture → Trust Boundaries → Assets → Threats → Controls → Operations → Response
```

### Modelo e ownership

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [security-model.md](security-model.md) | Segurança | ACCEPTED | documentation-standard | 2026-08-07 |
| [security-scope.md](security-scope.md) / [security-ownership.md](security-ownership.md) | Segurança | ACCEPTED | documentation-standard | 2026-08-07 |

### Ativos e ameaças

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [security-classification.md](security-classification.md) / [security-assets.md](security-assets.md) | Segurança | ACCEPTED | documentation-standard | 2026-08-07 |
| [threat-modeling.md](threat-modeling.md) / [threat-actors.md](threat-actors.md) / [attack-surface.md](attack-surface.md) | Segurança | ACCEPTED | documentation-standard | 2026-08-07 |
| [trust-boundaries.md](trust-boundaries.md) / [security-architecture.md](security-architecture.md) | Segurança / Arquitetura | ACCEPTED | documentation-standard | 2026-08-07 |

### Riscos, requisitos e controles

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [security-risk-model.md](security-risk-model.md) / [security-debt.md](security-debt.md) / [security-drift.md](security-drift.md) | Segurança | ACCEPTED | documentation-standard | 2026-08-07 |
| [security-requirements.md](security-requirements.md) / [security-exceptions.md](security-exceptions.md) | Segurança | ACCEPTED | documentation-standard | 2026-08-07 |
| [security-controls.md](security-controls.md) / [security-evidence.md](security-evidence.md) / [least-privilege.md](least-privilege.md) / [privileged-access.md](privileged-access.md) | Segurança | ACCEPTED | documentation-standard | 2026-08-07 |
| [identity.md](identity.md) / [authentication.md](authentication.md) / [authorization.md](authorization.md) | Segurança | ACCEPTED | documentation-standard | 2026-08-07 |
| [encryption.md](encryption.md) / [key-management.md](key-management.md) / [secrets-management.md](secrets-management.md) / [secret-exposure.md](secret-exposure.md) | Segurança | ACCEPTED | documentation-standard | 2026-08-07 |

### Dados, vulnerabilidades e operações

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [data-security.md](data-security.md) / [privacy.md](privacy.md) / [data-retention.md](data-retention.md) / [secure-logging.md](secure-logging.md) / [auditability.md](auditability.md) | Segurança | ACCEPTED | documentation-standard | 2026-08-07 |
| [vulnerability-management.md](vulnerability-management.md) / [dependency-security.md](dependency-security.md) / [supply-chain-security.md](supply-chain-security.md) | Segurança | ACCEPTED | documentation-standard | 2026-08-07 |
| [security-incidents.md](security-incidents.md) / [security-monitoring.md](security-monitoring.md) / [operations-security.md](operations-security.md) | Segurança | ACCEPTED | documentation-standard | 2026-08-07 |
| [security-testing.md](security-testing.md) / [secure-development.md](secure-development.md) / [contract-security.md](contract-security.md) | Segurança | ACCEPTED | documentation-standard | 2026-08-07 |

### Prontidão e qualidade

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [security-readiness.md](security-readiness.md) / [security-readiness-checklist.md](security-readiness-checklist.md) | Segurança | ACCEPTED | documentation-standard | 2026-08-07 |
| [security-checklist.md](security-checklist.md) | Segurança | ACCEPTED | documentation-standard | 2026-08-07 |

Amostras ficcionais preenchidas: [../../examples/security/](../../examples/security/).

## Documentação AI-Ready

Documentação estruturada como **contexto de IA** confiável — sem exigir RAG, embeddings, bancos vetoriais, MCP, motores de busca ou runtimes de agentes. Comece por [ai-context.md](ai-context.md) (entrada primária de IA). Valide com [ai-ready-checklist.md](ai-ready-checklist.md).

```text
Question → Scope → Context → Knowledge → Evidence → Constraints → Answer
```

Cadeia do modelo: **Context → Knowledge → Relationships → Evidence → Constraints → Actions** ([ai-ready-model.md](ai-ready-model.md)).

### Modelo e entrada

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [ai-context.md](ai-context.md) | AI-Ready (entry) | ACCEPTED | documentation-standard | 2026-08-07 |
| [ai-ready-model.md](ai-ready-model.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [progressive-context.md](progressive-context.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [glossary.md](glossary.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### Metadata, identidade e tipos

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [machine-readable.md](machine-readable.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [document-metadata.md](document-metadata.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [document-identity.md](document-identity.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [document-types.md](document-types.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### Evidência e autoridade

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [source-of-truth.md](source-of-truth.md) / [authority-levels.md](authority-levels.md) | AI-Ready | REVIEW / ACCEPTED | documentation-standard | 2026-08-17 |
| [publishing-surfaces.md](publishing-surfaces.md) | AI-Ready | DRAFT | documentation-standard | 2026-08-17 |
| [evidence-model.md](evidence-model.md) / [evidence-references.md](evidence-references.md) | AI-Ready | ACCEPTED / REVIEW | documentation-standard | 2026-08-17 |
| [claims.md](claims.md) / [confidence-model.md](confidence-model.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### Relacionamentos e registries

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [documentation-graph.md](documentation-graph.md) / [document-relationships.md](document-relationships.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [component-registry.md](component-registry.md) / [service-registry.md](service-registry.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [dependency-model.md](dependency-model.md) / [change-impact.md](change-impact.md) / [documentation-dependencies.md](documentation-dependencies.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### Cobertura, freshness e drift

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [documentation-coverage.md](documentation-coverage.md) / [documentation-completeness.md](documentation-completeness.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [documentation-freshness.md](documentation-freshness.md) / [documentation-drift.md](documentation-drift.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [documentation-health.md](documentation-health.md) / [history-model.md](history-model.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### Navegação e workflows de IA

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [ai-navigation.md](ai-navigation.md) / [ai-answering-rules.md](ai-answering-rules.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [ai-change-rules.md](ai-change-rules.md) / [ai-documentation-workflow.md](ai-documentation-workflow.md) | AI-Ready | ACCEPTED / REVIEW | documentation-standard | 2026-08-13 |
| [ai-prompt-context.md](ai-prompt-context.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [ai-agent-entry.md](ai-agent-entry.md) | AI-Ready | DRAFT | documentation-standard | 2026-08-13 |

### Limites, segurança e auditoria

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [ai-task-boundaries.md](ai-task-boundaries.md) / [ai-context-safety.md](ai-context-safety.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [ai-auditability.md](ai-auditability.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### Geração, revisão, lacunas e contradições

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [ai-generation-guidelines.md](ai-generation-guidelines.md) / [ai-review.md](ai-review.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [contradiction-model.md](contradiction-model.md) / [knowledge-gaps.md](knowledge-gaps.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### Manifest, prontidão de busca e validação

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [manifest-rules.md](manifest-rules.md) / [manifest.yaml](manifest.yaml) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [search-readiness.md](search-readiness.md) / [chunking-guidelines.md](chunking-guidelines.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [ai-documentation-validation.md](ai-documentation-validation.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### Checklist e anti-patterns

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [ai-ready-checklist.md](ai-ready-checklist.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [ai-documentation-anti-patterns.md](ai-documentation-anti-patterns.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

Regras de escrita de IA por domínio  permanecem em [ai-documentation.md](ai-documentation.md).

Amostras ficcionais preenchidas: [../../examples/ai-ready/](../../examples/ai-ready/).

## Automação e Governança

Qualidade documental aplicável: ownership, classificação de mudanças, regras de validação, quality gates, exceções e relatórios de saúde — sem SaaS externo.

```text
Documentation → Parser → Rules → Validation → Report → Quality Gate
```

### Governança

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [governance.md](governance.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [governance-roles.md](governance-roles.md) / [documentation-ownership.md](documentation-ownership.md) / [ownership-matrix.md](ownership-matrix.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [document-classification.md](document-classification.md) / [change-classification.md](change-classification.md) / [change-impact-matrix.md](change-impact-matrix.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [documentation-change-policy.md](documentation-change-policy.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [exceptions.md](exceptions.md) / [false-positives.md](false-positives.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [governance-auditability.md](governance-auditability.md) / [governance-versioning.md](governance-versioning.md) / [governance-review.md](governance-review.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [migration-policy.md](migration-policy.md) / [pull-request-documentation.md](pull-request-documentation.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [policies/](policies/) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |

### Automação e validação

| Documento | Categoria | Status | Owner | Atualizado |
| --- | --- | --- | --- | --- |
| [automation.md](automation.md) / [automation-commands.md](automation-commands.md) / [automation-security.md](automation-security.md) | Automation | ACCEPTED | documentation-standard | 2026-08-07 |
| [validation-rules.md](validation-rules.md) / [../validation-config.yaml](../validation-config.yaml) | Automation | ACCEPTED | documentation-standard | 2026-08-07 |
| [quality-gates.md](quality-gates.md) | Automation | ACCEPTED | documentation-standard | 2026-08-07 |
| [drift-detection.md](drift-detection.md) / [health-score.md](health-score.md) | Automation | ACCEPTED | documentation-standard | 2026-08-07 |
| [generated-policy.md](generated-policy.md) / [reports/](reports/) / [generated/](generated/) | Automation | ACCEPTED | documentation-standard | 2026-08-07 |
| [governance-api.md](governance-api.md) | Automation (conceptual) | ACCEPTED | documentation-standard | 2026-08-07 |

Comandos locais: `make docs-validate` ou `python3 scripts/docs_lint.py validate`. CI: `.github/workflows/docs-validation.yml`.

Exemplos fictícios: [../../examples/governance/](../../examples/governance/).

## Categorias

| Categoria | Caminho | Objetivo |
| --- | --- | --- |
| Arquitetura | [architecture/](architecture/) | Estrutura e comportamento arquitetural |
| Application | [application/](application/) | Componentes da aplicação |
| Olivelas Team | [aiops-team/](aiops-team/) | Hub do time Olivelas — responsabilidades, catálogo, padrões (3 níveis) |
| Olivelas Apps | [aiops-apps/](aiops-apps/) | Stacks front/back dos apps Olivelas (libs, rotas, segurança) |
| Infrastructure | [infrastructure/](infrastructure/) | Infraestrutura e recursos |
| Infra Olivelas (Olivelas) | [loft-infra/](loft-infra/) | Como apps Olivelas são publicados hoje (guia + exemplos + Actions, k8s-apps, Kong, Docker) |
| Observabilidade Olivelas (Datadog) | [loft-observability/](loft-observability/) | Datadog no EKS, logs estruturados, APM, guia operacional (as-is Olivelas) |
| Segurança | [security/](security/) | Segurança e controle de acesso |
| Operações | [operations/](operations/) | Operação, confiabilidade, incidentes, recuperação |
| Observability | [observability/](observability/) | Logs, métricas, tracing, SLIs/SLOs, alertas |
| Contratos | [contracts/](contracts/) | Interfaces e contratos |
| Decisions | [decisions/](decisions/) | Arquitetura Decision Records |
| Templates | [templates/](templates/) | Modelos reutilizáveis |

### Arquitetura

Documente estrutura, limites, comunicação, fluxo de dados, domínios de falha e trade-offs. Prefira estado atual com links explícitos para ADRs. Siga progressive disclosure (Context → System → Components → Interfaces → Implementation) via [architecture-model.md](architecture-model.md); valide com [architecture-checklist.md](architecture-checklist.md).

Template: [templates/architecture.md](templates/architecture.md)

### Application

Documente componentes, responsabilidades, entradas/saídas e considerações operacionais. Mantenha a documentação perto do componente quando o layout do repositório permitir.

Template: [templates/component.md](templates/component.md)

### Olivelas Team

Hub **as-is** do time Olivelas — nível 1 do [modelo em 3 níveis](aiops-team/documentation-model.md): quem somos, responsabilidades, catálogo de apps, stacks, forma de trabalho, padrões, segurança, observabilidade e troubleshooting transversal.

Hub: [aiops-team/README.md](aiops-team/README.md) · [aiops-team/applications.md](aiops-team/applications.md) · [aiops-team/documentation-model.md](aiops-team/documentation-model.md)

### Olivelas Apps

Pacote **as-is** das stacks de frontend e backend dos apps Olivelas de referência (bibliotecas, monorepo, rotas, segurança), com matrizes de evidência no README — **nível 2** do modelo Olivelas.

Hub: [aiops-apps/README.md](aiops-apps/README.md) · [aiops-apps/dataforge.md](aiops-apps/dataforge.md) · [aiops-apps/deep-insight.md](aiops-apps/deep-insight.md) · [aiops-apps/qualidade-loft.md](aiops-apps/qualidade-loft.md) · [aiops-apps/loft-carteiras.md](aiops-apps/loft-carteiras.md) · [aiops-apps/ava-prod.md](aiops-apps/ava-prod.md)

### Infrastructure

Documente ambientes, recursos, provisionamento e restrições operacionais sem assumir um provedor ou runtime específico.

### Infra Olivelas (Olivelas)

Pacote **as-is** da publicação atual de apps Olivelas na Olivelas (GitHub Actions → ECR → `k8s-apps` → Kong), grounded em repositórios reais.

Hub: [loft-infra/README.md](loft-infra/README.md) · [loft-infra/publish-guide.md](loft-infra/publish-guide.md) · [loft-infra/examples/](loft-infra/examples/) · [loft-infra/overview.md](loft-infra/overview.md) · [loft-infra/github-actions-deploy.md](loft-infra/github-actions-deploy.md) · [loft-infra/k8s-apps.md](loft-infra/k8s-apps.md) · [loft-infra/kong-gateway.md](loft-infra/kong-gateway.md) · [loft-infra/infra-live-route53.md](loft-infra/infra-live-route53.md) · [loft-infra/vault-secrets.md](loft-infra/vault-secrets.md) · [loft-infra/dockerfiles.md](loft-infra/dockerfiles.md)

### Observabilidade Olivelas (Datadog)

Pacote **as-is** de Datadog no EKS Olivelas: habilitação no chart, logs JSON estruturados, instrumentação de app, pré-requisitos documentais (gate de logs), guia operacional, checklist de verificação.

Hub: [loft-observability/README.md](loft-observability/README.md) · [loft-observability/documentation-prerequisites.md](loft-observability/documentation-prerequisites.md) · [loft-observability/k8s-datadog-enablement.md](loft-observability/k8s-datadog-enablement.md) · [loft-observability/application-instrumentation.md](loft-observability/application-instrumentation.md) · [loft-observability/structured-logging.md](loft-observability/structured-logging.md) · [loft-observability/datadog-usage-guide.md](loft-observability/datadog-usage-guide.md) · [loft-observability/verification-checklist.md](loft-observability/verification-checklist.md)

### Segurança

Documente trust boundaries, ativos, ameaças, riscos, requisitos, controles, evidências, secrets, criptografia, vulnerabilidades, exceções e incidentes de segurança. Nunca armazene valores secretos na documentação. Siga [security-model.md](security-model.md); valide com [security-checklist.md](security-checklist.md).

Docs-chave: [security/README.md](security/README.md) · [threat-modeling.md](threat-modeling.md) · [security-readiness.md](security-readiness.md)

Templates: [templates/security.md](templates/security.md), [templates/security-asset.md](templates/security-asset.md), [templates/threat.md](templates/threat.md), [templates/security-risk.md](templates/security-risk.md), [templates/security-requirement.md](templates/security-requirement.md), [templates/security-control.md](templates/security-control.md), [templates/vulnerability.md](templates/vulnerability.md), [templates/security-exception.md](templates/security-exception.md), [templates/security-incident.md](templates/security-incident.md), [templates/security-test.md](templates/security-test.md)

Exemplos: [../../examples/security/](../../examples/security/)

### Operações

Documente como o sistema é operado e recuperado: service profiles, runbooks, troubleshooting, incidentes, modos de falha, SLIs/SLOs, deploy/rollback, backup/restore e prontidão operacional. Siga [operations-model.md](operations-model.md) e [reliability-model.md](reliability-model.md); não invente SLOs, alertas, DR ou comandos que não existam.

Docs-chave: [operations/README.md](operations/README.md) · [runbooks/README.md](runbooks/README.md) · [incident-management.md](incident-management.md) · [operational-readiness-checklist.md](operational-readiness-checklist.md)

Templates: [templates/service-profile.md](templates/service-profile.md), [templates/runbook.md](templates/runbook.md), [templates/troubleshooting.md](templates/troubleshooting.md), [templates/incident.md](templates/incident.md), [templates/failure-mode.md](templates/failure-mode.md), [templates/sli.md](templates/sli.md), [templates/slo.md](templates/slo.md), [templates/recovery-procedure.md](templates/recovery-procedure.md)

Exemplos: [../../examples/operations/](../../examples/operations/)

### Observability

Documente logs, métricas, tracing, eventos, dashboards, alertas, health signals e SLIs/SLOs quando aplicável. Marque mecanismos como Implemented, Partial, Not Applicable ou Not Documented. Linke sinais a runbooks.

Metodologia: [observability-model.md](observability-model.md) · [health-checks.md](health-checks.md) · [monitoring.md](monitoring.md) · [alerting.md](alerting.md) · [service-levels.md](service-levels.md) · [observability/README.md](observability/README.md)

Templates: [templates/observability.md](templates/observability.md), [templates/alert.md](templates/alert.md), [templates/sli.md](templates/sli.md), [templates/slo.md](templates/slo.md)

### Contratos

Documente APIs, eventos, mensagens, arquivos, comandos e outras interfaces como contratos de primeira classe. Não assuma HTTP.

Metodologia: [contract-model.md](contract-model.md) · [contract-types.md](contract-types.md) · [contract-checklist.md](contract-checklist.md) · [contracts/README.md](contracts/README.md)

Template: [templates/contract.md](templates/contract.md)

Exemplos: [../../examples/contracts/](../../examples/contracts/)

### Decisions

Registre decisões arquiteturais com ADRs. Decisões explicam *por quê*; docs de arquitetura descrevem *o que existe*.

Template: [templates/adr.md](templates/adr.md)

### Templates

Esqueletos reutilizáveis para documentação de projeto. Copie para um projeto adotante e preencha com conteúdo específico do projeto.

Veja [templates/README.md](templates/README.md).

Templates relacionados ao ciclo de vida:

- [templates/documentation-pr-checklist.md](templates/documentation-pr-checklist.md)
- [templates/ownership-matrix.md](templates/ownership-matrix.md)
- [templates/review-record.md](templates/review-record.md)

## Ordem recomendada de adoção

1. Visão geral do projeto
2. Arquitetura (estado atual)
3. Componentes e integrações
4. Contratos
5. Segurança
6. Operações / confiabilidade / runbooks
7. Observabilidade (sinais que alimentam operações)
8. ADRs para decisões materiais
9. Aplicar metadata de lifecycle, ownership e política de revisão
10. Aplicar metadata AI-ready, claims, relacionamentos e entrada [ai-context.md](ai-context.md) quando docs forem consumidores de IA

## Regra de conclusão

Uma mudança técnica relevante não está completa enquanto a documentação necessária não estiver atualizada. Veja [change-policy.md](change-policy.md).

## Exemplos

Exemplos fictícios de adoção:

- [../../examples/simple-service/](../../examples/simple-service/)
- [../../examples/adoption-scaffold/](../../examples/adoption-scaffold/) — árvore vazia opcional do Dia 0
- [../../examples/fullstack-monolith/](../../examples/fullstack-monolith/) — monólito FE+API+DB **ilustrativo** (stack sugerida ≠ padrão)
- [../../examples/suggested-document-platform/](../../examples/suggested-document-platform/) — document intelligence / BFF / workers **ilustrativo** (stack sugerida ≠ padrão)
- [../../examples/event-driven-service/](../../examples/event-driven-service/)
- [../../examples/distributed-system/](../../examples/distributed-system/)
- [../../examples/adopter-ci-starter/](../../examples/adopter-ci-starter/) — CI opcional para adotantes
- [../../examples/adopter-agent-starter/](../../examples/adopter-agent-starter/) — arquivos de entrada de agente opcionais
- [../../examples/contracts/](../../examples/contracts/) — contratos autônomos API / Event / Message / File
- [../../examples/operations/](../../examples/operations/) — service profile, runbook, incidente, modo de falha, SLI, SLO, recovery
- [../../examples/security/](../../examples/security/) — asset, threat, risk, requirement, control, vulnerability, exception, incident, security-test, security-review

Guias de adoção:

- [adoption-path.md](adoption-path.md) — Day 0 / 30 / 90
- [ai-agent-entry.md](ai-agent-entry.md) — empacotamento opcional de `AGENTS.md` / `CLAUDE.md`
- [flat-docs-migration.md](flat-docs-migration.md) — migrar docs flat
- [language.md](language.md) — política bilíngue + tradução parcial opcional para adotantes
- [observability-platform-notes.md](observability-platform-notes.md) — plataforma org (ex. Datadog) ≠ requisito do framework
- [templates/deployment.md](templates/deployment.md) — visão de deploy leve
- [templates/feature-flags.md](templates/feature-flags.md) · [templates/data-model.md](templates/data-model.md) · [templates/worker.md](templates/worker.md) · [templates/bff.md](templates/bff.md)
