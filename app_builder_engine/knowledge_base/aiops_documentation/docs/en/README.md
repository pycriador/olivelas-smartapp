# Documentation Index

> Language: EN | [Português (pt-BR)](../pt-BR/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Central index for the Engineering Documentation Standard.

This repository defines **how** projects should document software and infrastructure — including structure, templates, **documentation lifecycle governance**, **architecture methodology** with progressive disclosure (Context → System → Components → Interfaces → Implementation), **technical contracts methodology**, **operations & reliability methodology**, **security methodology**, **AI-ready documentation methodology**, and **automation & governance** (validation, quality gates, exceptions).

Progressive chains: **Architecture → Contracts → Operations → Recovery** · **Architecture → Trust Boundaries → Assets → Threats → Controls → Operations → Response** · **Question → Scope → Context → Knowledge → Evidence → Constraints → Answer** · **Change → Validate → Gate → Review → Merge**.

## Start Here

| Document | Purpose |
| --- | --- |
| [principles.md](principles.md) | Foundational documentation principles |
| [lifecycle.md](lifecycle.md) | Official documentation lifecycle |
| [architecture-model.md](architecture-model.md) | Architecture documentation levels and progressive disclosure |
| [contract-model.md](contract-model.md) | Technical contracts as boundaries between participants |
| [operations-model.md](operations-model.md) | Operate → Observe → Detect → Diagnose → Respond → Recover → Learn → Improve |
| [reliability-model.md](reliability-model.md) | Dependencies, failure modes, degradation, recovery, limits |
| [standards.md](standards.md) | Formatting, metadata, status, classification, references |
| [publishing-surfaces.md](publishing-surfaces.md) | Dual-surface links: GitHub/local SoT + Confluence publish |
| [style-guide.md](style-guide.md) | How to write documentation |
| [ai-context.md](ai-context.md) | **Primary AI entry** — progressive context and navigation |
| [ai-agent-entry.md](ai-agent-entry.md) | Optional Cursor / Claude Code packaging (`AGENTS.md`, skills) |
| [ai-ready-checklist.md](ai-ready-checklist.md) | Minimum AI-ready documentation checklist |
| [ai-documentation.md](ai-documentation.md) | Domain AI writing rules (architecture, contracts, ops, security) |
| [governance.md](governance.md) | Documentation governance model |
| [automation.md](automation.md) | In-repo validation architecture |
| [documentation-checklist.md](documentation-checklist.md) | Minimum quality checklist |
| [adoption-path.md](adoption-path.md) | Day 0 / 30 / 90 path (do not require everything at once) |
| [flat-docs-migration.md](flat-docs-migration.md) | Migrate flat docs → standard tree |
| [observability-platform-notes.md](observability-platform-notes.md) | Org platform (e.g. Datadog) ≠ framework requirement |
| [quality-model.md](quality-model.md) | Quality dimensions and maturity levels |
| [versioning.md](versioning.md) | Standard and document versioning |
| [language.md](language.md) | Language policy (EN and pt-BR) |

## Lifecycle and Governance

| Document | Category | Status | Owner | Updated |
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

Adopting projects may maintain a similar inventory table for their own documents (status, owner, updated, version). Automation is optional.

## Architecture methodology

Architecture docs use progressive disclosure: Context → System → Components → Interfaces → Implementation. Levels are documentation depth, not mandatory runtime tiers. Start with [architecture-model.md](architecture-model.md).

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [architecture-model.md](architecture-model.md) | Architecture | ACCEPTED | documentation-standard | 2026-08-07 |
| [system-boundaries.md](system-boundaries.md) | Architecture | ACCEPTED | documentation-standard | 2026-08-07 |
| [component-relationships.md](component-relationships.md) | Architecture | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-diagrams.md](architecture-diagrams.md) | Architecture | ACCEPTED | documentation-standard | 2026-08-07 |
| [diagram-selection.md](diagram-selection.md) | Architecture | ACCEPTED | documentation-standard | 2026-08-07 |
| [mermaid-standards.md](mermaid-standards.md) | Architecture | ACCEPTED | documentation-standard | 2026-08-07 |
| [failure-domains.md](failure-domains.md) | Architecture | ACCEPTED | documentation-standard | 2026-08-07 |
| [trust-boundaries.md](trust-boundaries.md) | Architecture | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-traceability.md](architecture-traceability.md) | Architecture | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-vs-implementation.md](architecture-vs-implementation.md) | Architecture | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-by-project-type.md](architecture-by-project-type.md) | Architecture | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-checklist.md](architecture-checklist.md) | Architecture | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-review.md](architecture-review.md) | Architecture | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-drift.md](architecture-drift.md) | Architecture | ACCEPTED | documentation-standard | 2026-08-07 |
| [architecture-debt.md](architecture-debt.md) | Architecture | ACCEPTED | documentation-standard | 2026-08-07 |

## Contracts methodology

Technical contracts document verifiable boundaries (API, Event, Message, File, and related types). Start with [contract-model.md](contract-model.md); validate with [contract-checklist.md](contract-checklist.md). Category hub: [contracts/README.md](contracts/README.md).

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [contract-model.md](contract-model.md) | Contracts | ACCEPTED | documentation-standard | 2026-08-07 |
| [contract-types.md](contract-types.md) | Contracts | ACCEPTED | documentation-standard | 2026-08-07 |
| [schema-documentation.md](schema-documentation.md) | Contracts | ACCEPTED | documentation-standard | 2026-08-07 |
| [semantic-contracts.md](semantic-contracts.md) | Contracts | ACCEPTED | documentation-standard | 2026-08-07 |
| [retry-policy.md](retry-policy.md) | Contracts | ACCEPTED | documentation-standard | 2026-08-07 |
| [idempotency.md](idempotency.md) | Contracts | ACCEPTED | documentation-standard | 2026-08-07 |
| [delivery-semantics.md](delivery-semantics.md) | Contracts | ACCEPTED | documentation-standard | 2026-08-07 |
| [contract-versioning.md](contract-versioning.md) | Contracts | ACCEPTED | documentation-standard | 2026-08-07 |
| [contract-compatibility.md](contract-compatibility.md) | Contracts | ACCEPTED | documentation-standard | 2026-08-07 |
| [contract-lifecycle.md](contract-lifecycle.md) | Contracts | ACCEPTED | documentation-standard | 2026-08-07 |
| [breaking-changes.md](breaking-changes.md) | Contracts | ACCEPTED | documentation-standard | 2026-08-07 |
| [api-contracts.md](api-contracts.md) / [event-contracts.md](event-contracts.md) / [message-contracts.md](message-contracts.md) / [file-contracts.md](file-contracts.md) | Contracts (type-specific) | ACCEPTED | documentation-standard | 2026-08-07 |
| [contract-checklist.md](contract-checklist.md) | Contracts | ACCEPTED | documentation-standard | 2026-08-07 |
| [contract-drift.md](contract-drift.md) / [contract-debt.md](contract-debt.md) / [contract-testing.md](contract-testing.md) | Contracts (quality) | ACCEPTED | documentation-standard | 2026-08-07 |

Fictional filled samples: [../../examples/contracts/](../../examples/contracts/).

## Operations & Reliability methodology

Operations docs cover how to run, observe, detect, diagnose, respond, recover, learn, and improve. Reliability docs describe dependencies, failure modes, degradation, and limits. Start with [operations-model.md](operations-model.md) and [reliability-model.md](reliability-model.md); validate with [operations-checklist.md](operations-checklist.md) and [operational-readiness-checklist.md](operational-readiness-checklist.md). Category hub: [operations/README.md](operations/README.md).

```text
Architecture → Contracts → Operations → Recovery
```

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [operations-model.md](operations-model.md) | Operations | ACCEPTED | documentation-standard | 2026-08-07 |
| [reliability-model.md](reliability-model.md) | Operations | ACCEPTED | documentation-standard | 2026-08-07 |
| [operational-ownership.md](operational-ownership.md) | Operations | ACCEPTED | documentation-standard | 2026-08-07 |
| [criticality.md](criticality.md) | Operations | ACCEPTED | documentation-standard | 2026-08-07 |
| [service-levels.md](service-levels.md) / [error-budget.md](error-budget.md) | Operations | ACCEPTED | documentation-standard | 2026-08-07 |
| [failure-modes.md](failure-modes.md) / [failure-propagation.md](failure-propagation.md) / [degradation.md](degradation.md) | Operations | ACCEPTED | documentation-standard | 2026-08-07 |
| [dependency-reliability.md](dependency-reliability.md) / [operational-dependencies.md](operational-dependencies.md) | Operations | ACCEPTED | documentation-standard | 2026-08-07 |
| [observability-model.md](observability-model.md) / [health-checks.md](health-checks.md) / [monitoring.md](monitoring.md) / [alerting.md](alerting.md) | Observability | ACCEPTED | documentation-standard | 2026-08-07 |
| [runbooks/README.md](runbooks/README.md) / [incident-management.md](incident-management.md) / [incident-severity.md](incident-severity.md) | Operations | ACCEPTED | documentation-standard | 2026-08-07 |
| [post-incident-review.md](post-incident-review.md) / [corrective-actions.md](corrective-actions.md) / [root-cause-analysis.md](root-cause-analysis.md) | Operations | ACCEPTED | documentation-standard | 2026-08-07 |
| [deployment-operations.md](deployment-operations.md) / [rollback.md](rollback.md) / [backup-restore.md](backup-restore.md) / [disaster-recovery.md](disaster-recovery.md) | Operations | ACCEPTED | documentation-standard | 2026-08-07 |
| [operational-readiness.md](operational-readiness.md) / [operational-readiness-checklist.md](operational-readiness-checklist.md) | Operations | ACCEPTED | documentation-standard | 2026-08-07 |
| [operations-checklist.md](operations-checklist.md) / [reliability-debt.md](reliability-debt.md) / [operational-drift.md](operational-drift.md) | Operations | ACCEPTED | documentation-standard | 2026-08-07 |

Fictional filled samples: [../../examples/operations/](../../examples/operations/).

## Security methodology

Security docs describe what must be protected, from what, how, and with what evidence — without inventing controls, certifications, or vulnerabilities. Start with [security-model.md](security-model.md); validate with [security-checklist.md](security-checklist.md) and [security-readiness-checklist.md](security-readiness-checklist.md). Category hub: [security/README.md](security/README.md).

```text
Architecture → Trust Boundaries → Assets → Threats → Controls → Operations → Response
```

### Model and ownership

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [security-model.md](security-model.md) | Security | ACCEPTED | documentation-standard | 2026-08-07 |
| [security-scope.md](security-scope.md) / [security-ownership.md](security-ownership.md) | Security | ACCEPTED | documentation-standard | 2026-08-07 |

### Assets and threats

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [security-classification.md](security-classification.md) / [security-assets.md](security-assets.md) | Security | ACCEPTED | documentation-standard | 2026-08-07 |
| [threat-modeling.md](threat-modeling.md) / [threat-actors.md](threat-actors.md) / [attack-surface.md](attack-surface.md) | Security | ACCEPTED | documentation-standard | 2026-08-07 |
| [trust-boundaries.md](trust-boundaries.md) / [security-architecture.md](security-architecture.md) | Security / Architecture | ACCEPTED | documentation-standard | 2026-08-07 |

### Risks, requirements, and controls

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [security-risk-model.md](security-risk-model.md) / [security-debt.md](security-debt.md) / [security-drift.md](security-drift.md) | Security | ACCEPTED | documentation-standard | 2026-08-07 |
| [security-requirements.md](security-requirements.md) / [security-exceptions.md](security-exceptions.md) | Security | ACCEPTED | documentation-standard | 2026-08-07 |
| [security-controls.md](security-controls.md) / [security-evidence.md](security-evidence.md) / [least-privilege.md](least-privilege.md) / [privileged-access.md](privileged-access.md) | Security | ACCEPTED | documentation-standard | 2026-08-07 |
| [identity.md](identity.md) / [authentication.md](authentication.md) / [authorization.md](authorization.md) | Security | ACCEPTED | documentation-standard | 2026-08-07 |
| [encryption.md](encryption.md) / [key-management.md](key-management.md) / [secrets-management.md](secrets-management.md) / [secret-exposure.md](secret-exposure.md) | Security | ACCEPTED | documentation-standard | 2026-08-07 |

### Data, vulnerabilities, and operations

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [data-security.md](data-security.md) / [privacy.md](privacy.md) / [data-retention.md](data-retention.md) / [secure-logging.md](secure-logging.md) / [auditability.md](auditability.md) | Security | ACCEPTED | documentation-standard | 2026-08-07 |
| [vulnerability-management.md](vulnerability-management.md) / [dependency-security.md](dependency-security.md) / [supply-chain-security.md](supply-chain-security.md) | Security | ACCEPTED | documentation-standard | 2026-08-07 |
| [security-incidents.md](security-incidents.md) / [security-monitoring.md](security-monitoring.md) / [operations-security.md](operations-security.md) | Security | ACCEPTED | documentation-standard | 2026-08-07 |
| [security-testing.md](security-testing.md) / [secure-development.md](secure-development.md) / [contract-security.md](contract-security.md) | Security | ACCEPTED | documentation-standard | 2026-08-07 |

### Readiness and quality

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [security-readiness.md](security-readiness.md) / [security-readiness-checklist.md](security-readiness-checklist.md) | Security | ACCEPTED | documentation-standard | 2026-08-07 |
| [security-checklist.md](security-checklist.md) | Security | ACCEPTED | documentation-standard | 2026-08-07 |

Fictional filled samples: [../../examples/security/](../../examples/security/).

## AI-Ready Documentation

Documentation structured as reliable **AI context** — without requiring RAG, embeddings, vector databases, MCP, search engines, or agent runtimes. Start with [ai-context.md](ai-context.md) (primary AI entry). Validate with [ai-ready-checklist.md](ai-ready-checklist.md).

```text
Question → Scope → Context → Knowledge → Evidence → Constraints → Answer
```

Model chain: **Context → Knowledge → Relationships → Evidence → Constraints → Actions** ([ai-ready-model.md](ai-ready-model.md)).

### Model and entry

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [ai-context.md](ai-context.md) | AI-Ready (entry) | ACCEPTED | documentation-standard | 2026-08-07 |
| [ai-ready-model.md](ai-ready-model.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [progressive-context.md](progressive-context.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [glossary.md](glossary.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### Metadata, identity, and types

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [machine-readable.md](machine-readable.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [document-metadata.md](document-metadata.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [document-identity.md](document-identity.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [document-types.md](document-types.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### Evidence and authority

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [source-of-truth.md](source-of-truth.md) / [authority-levels.md](authority-levels.md) | AI-Ready | REVIEW / ACCEPTED | documentation-standard | 2026-08-17 |
| [publishing-surfaces.md](publishing-surfaces.md) | AI-Ready | DRAFT | documentation-standard | 2026-08-17 |
| [evidence-model.md](evidence-model.md) / [evidence-references.md](evidence-references.md) | AI-Ready | ACCEPTED / REVIEW | documentation-standard | 2026-08-17 |
| [claims.md](claims.md) / [confidence-model.md](confidence-model.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### Relationships and registries

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [documentation-graph.md](documentation-graph.md) / [document-relationships.md](document-relationships.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [component-registry.md](component-registry.md) / [service-registry.md](service-registry.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [dependency-model.md](dependency-model.md) / [change-impact.md](change-impact.md) / [documentation-dependencies.md](documentation-dependencies.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### Coverage, freshness, and drift

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [documentation-coverage.md](documentation-coverage.md) / [documentation-completeness.md](documentation-completeness.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [documentation-freshness.md](documentation-freshness.md) / [documentation-drift.md](documentation-drift.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [documentation-health.md](documentation-health.md) / [history-model.md](history-model.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### AI navigation and workflows

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [ai-navigation.md](ai-navigation.md) / [ai-answering-rules.md](ai-answering-rules.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [ai-change-rules.md](ai-change-rules.md) / [ai-documentation-workflow.md](ai-documentation-workflow.md) | AI-Ready | ACCEPTED / REVIEW | documentation-standard | 2026-08-13 |
| [ai-prompt-context.md](ai-prompt-context.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [ai-agent-entry.md](ai-agent-entry.md) | AI-Ready | DRAFT | documentation-standard | 2026-08-13 |

### Boundaries, safety, and audit

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [ai-task-boundaries.md](ai-task-boundaries.md) / [ai-context-safety.md](ai-context-safety.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [ai-auditability.md](ai-auditability.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### Generation, review, gaps, and contradictions

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [ai-generation-guidelines.md](ai-generation-guidelines.md) / [ai-review.md](ai-review.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [contradiction-model.md](contradiction-model.md) / [knowledge-gaps.md](knowledge-gaps.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### Manifest, search readiness, and validation

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [manifest-rules.md](manifest-rules.md) / [manifest.yaml](manifest.yaml) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [search-readiness.md](search-readiness.md) / [chunking-guidelines.md](chunking-guidelines.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [ai-documentation-validation.md](ai-documentation-validation.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

### Checklist and anti-patterns

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [ai-ready-checklist.md](ai-ready-checklist.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |
| [ai-documentation-anti-patterns.md](ai-documentation-anti-patterns.md) | AI-Ready | ACCEPTED | documentation-standard | 2026-08-07 |

Domain AI writing rules  remain in [ai-documentation.md](ai-documentation.md).

Fictional filled samples: [../../examples/ai-ready/](../../examples/ai-ready/).

## Automation & Governance

Enforceable documentation quality: ownership, change classification, validation rules, quality gates, exceptions, and health reporting — without external SaaS.

```text
Documentation → Parser → Rules → Validation → Report → Quality Gate
```

### Governance

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [governance.md](governance.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [governance-roles.md](governance-roles.md) / [documentation-ownership.md](documentation-ownership.md) / [ownership-matrix.md](ownership-matrix.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [document-classification.md](document-classification.md) / [change-classification.md](change-classification.md) / [change-impact-matrix.md](change-impact-matrix.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [documentation-change-policy.md](documentation-change-policy.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [exceptions.md](exceptions.md) / [false-positives.md](false-positives.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [governance-auditability.md](governance-auditability.md) / [governance-versioning.md](governance-versioning.md) / [governance-review.md](governance-review.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [migration-policy.md](migration-policy.md) / [pull-request-documentation.md](pull-request-documentation.md) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |
| [policies/](policies/) | Governance | ACCEPTED | documentation-standard | 2026-08-07 |

### Automation and validation

| Document | Category | Status | Owner | Updated |
| --- | --- | --- | --- | --- |
| [automation.md](automation.md) / [automation-commands.md](automation-commands.md) / [automation-security.md](automation-security.md) | Automation | ACCEPTED | documentation-standard | 2026-08-07 |
| [validation-rules.md](validation-rules.md) / [../validation-config.yaml](../validation-config.yaml) | Automation | ACCEPTED | documentation-standard | 2026-08-07 |
| [quality-gates.md](quality-gates.md) | Automation | ACCEPTED | documentation-standard | 2026-08-07 |
| [drift-detection.md](drift-detection.md) / [health-score.md](health-score.md) | Automation | ACCEPTED | documentation-standard | 2026-08-07 |
| [generated-policy.md](generated-policy.md) / [reports/](reports/) / [generated/](generated/) | Automation | ACCEPTED | documentation-standard | 2026-08-07 |
| [governance-api.md](governance-api.md) | Automation (conceptual) | ACCEPTED | documentation-standard | 2026-08-07 |

Local commands: `make docs-validate` or `python3 scripts/docs_lint.py validate`. CI: `.github/workflows/docs-validation.yml`.

Fictional samples: [../../examples/governance/](../../examples/governance/).

## Categories

| Category | Path | Objective |
| --- | --- | --- |
| Architecture | [architecture/](architecture/) | Structure and architectural behavior |
| Application | [application/](application/) | Application components |
| AIOps Team | [aiops-team/](aiops-team/) | AIOps team hub — responsibilities, catalog, standards (3 levels) |
| AIOps Apps | [aiops-apps/](aiops-apps/) | AIOps front/back stacks (libs, routes, security) |
| Infrastructure | [infrastructure/](infrastructure/) | Infrastructure and resources |
| Loft infra (AIOps) | [loft-infra/](loft-infra/) | How AIOps apps are published today (guide + examples + Actions, k8s-apps, Kong, Docker) |
| Loft observability (Datadog) | [loft-observability/](loft-observability/) | Datadog on EKS, structured logs, APM, operator usage (Loft as-is) |
| Security | [security/](security/) | Security and access control |
| Operations | [operations/](operations/) | Operation, reliability, incidents, recovery |
| Observability | [observability/](observability/) | Logs, metrics, tracing, SLIs/SLOs, alerts |
| Contracts | [contracts/](contracts/) | Interfaces and contracts |
| Decisions | [decisions/](decisions/) | Architecture Decision Records |
| Templates | [templates/](templates/) | Reusable document models |

### Architecture

Document system structure, boundaries, communication, data flow, failure domains, and trade-offs. Prefer current-state description with explicit links to ADRs for decisions. Follow progressive disclosure (Context → System → Components → Interfaces → Implementation) via [architecture-model.md](architecture-model.md); validate with [architecture-checklist.md](architecture-checklist.md).

Template: [templates/architecture.md](templates/architecture.md)

### Application

Document application components, responsibilities, inputs/outputs, and operational considerations. Keep component docs near the component when the adopting project allows it.

Template: [templates/component.md](templates/component.md)

### AIOps Team

**As-is** hub for the AIOps team — level 1 of the [3-level model](aiops-team/documentation-model.md): who we are, responsibilities, app catalog, stacks, ways of working, standards, security, observability, and cross-cutting troubleshooting.

Hub: [aiops-team/README.md](aiops-team/README.md) · [aiops-team/applications.md](aiops-team/applications.md) · [aiops-team/documentation-model.md](aiops-team/documentation-model.md)

### AIOps Apps

**As-is** pack for frontend/backend stacks of reference AIOps apps (libraries, monorepo, routes, security), with evidence matrices in the README — **level 2** of the AIOps model.

Hub: [aiops-apps/README.md](aiops-apps/README.md) · [aiops-apps/dataforge.md](aiops-apps/dataforge.md) · [aiops-apps/deep-insight.md](aiops-apps/deep-insight.md) · [aiops-apps/qualidade-loft.md](aiops-apps/qualidade-loft.md) · [aiops-apps/loft-carteiras.md](aiops-apps/loft-carteiras.md) · [aiops-apps/ava-prod.md](aiops-apps/ava-prod.md)

### Infrastructure

Document environments, resources, provisioning approach, and operational constraints without assuming a specific cloud provider or runtime.

### Loft infra (AIOps)

**As-is** pack for how AIOps apps are published at Loft today (GitHub Actions → ECR → `k8s-apps` → Kong), grounded in real repositories.

Hub: [loft-infra/README.md](loft-infra/README.md) · [loft-infra/publish-guide.md](loft-infra/publish-guide.md) · [loft-infra/examples/](loft-infra/examples/) · [loft-infra/overview.md](loft-infra/overview.md) · [loft-infra/github-actions-deploy.md](loft-infra/github-actions-deploy.md) · [loft-infra/k8s-apps.md](loft-infra/k8s-apps.md) · [loft-infra/kong-gateway.md](loft-infra/kong-gateway.md) · [loft-infra/infra-live-route53.md](loft-infra/infra-live-route53.md) · [loft-infra/vault-secrets.md](loft-infra/vault-secrets.md) · [loft-infra/dockerfiles.md](loft-infra/dockerfiles.md)

### Loft observability (Datadog)

**As-is** pack for Datadog on Loft EKS: chart enablement, structured JSON logs, application instrumentation, documentation prerequisites (logs gate), operator guide, verification checklist.

Hub: [loft-observability/README.md](loft-observability/README.md) · [loft-observability/documentation-prerequisites.md](loft-observability/documentation-prerequisites.md) · [loft-observability/k8s-datadog-enablement.md](loft-observability/k8s-datadog-enablement.md) · [loft-observability/application-instrumentation.md](loft-observability/application-instrumentation.md) · [loft-observability/structured-logging.md](loft-observability/structured-logging.md) · [loft-observability/datadog-usage-guide.md](loft-observability/datadog-usage-guide.md) · [loft-observability/verification-checklist.md](loft-observability/verification-checklist.md)

### Security

Document trust boundaries, assets, threats, risks, requirements, controls, evidence, secrets handling, encryption, vulnerabilities, exceptions, and security incidents. Never store secret values in documentation. Follow [security-model.md](security-model.md); validate with [security-checklist.md](security-checklist.md).

Key docs: [security/README.md](security/README.md) · [threat-modeling.md](threat-modeling.md) · [security-readiness.md](security-readiness.md)

Templates: [templates/security.md](templates/security.md), [templates/security-asset.md](templates/security-asset.md), [templates/threat.md](templates/threat.md), [templates/security-risk.md](templates/security-risk.md), [templates/security-requirement.md](templates/security-requirement.md), [templates/security-control.md](templates/security-control.md), [templates/vulnerability.md](templates/vulnerability.md), [templates/security-exception.md](templates/security-exception.md), [templates/security-incident.md](templates/security-incident.md), [templates/security-test.md](templates/security-test.md)

Examples: [../../examples/security/](../../examples/security/)

### Operations

Document how the system is operated and recovered: service profiles, runbooks, troubleshooting, incidents, failure modes, SLIs/SLOs, deployment/rollback, backup/restore, and operational readiness. Follow [operations-model.md](operations-model.md) and [reliability-model.md](reliability-model.md); do not invent SLOs, alerts, DR, or commands that do not exist.

Key docs: [operations/README.md](operations/README.md) · [runbooks/README.md](runbooks/README.md) · [incident-management.md](incident-management.md) · [operational-readiness-checklist.md](operational-readiness-checklist.md)

Templates: [templates/service-profile.md](templates/service-profile.md), [templates/runbook.md](templates/runbook.md), [templates/troubleshooting.md](templates/troubleshooting.md), [templates/incident.md](templates/incident.md), [templates/failure-mode.md](templates/failure-mode.md), [templates/sli.md](templates/sli.md), [templates/slo.md](templates/slo.md), [templates/recovery-procedure.md](templates/recovery-procedure.md)

Examples: [../../examples/operations/](../../examples/operations/)

### Observability

Document logging, metrics, tracing, events, dashboards, alerts, health signals, and SLIs/SLOs when applicable. Mark mechanisms as Implemented, Partial, Not Applicable, or Not Documented. Link signals to runbooks.

Methodology: [observability-model.md](observability-model.md) · [health-checks.md](health-checks.md) · [monitoring.md](monitoring.md) · [alerting.md](alerting.md) · [service-levels.md](service-levels.md) · [observability/README.md](observability/README.md)

Template: [templates/observability.md](templates/observability.md), [templates/alert.md](templates/alert.md), [templates/sli.md](templates/sli.md), [templates/slo.md](templates/slo.md)

### Contracts

Document APIs, events, messages, files, commands, and other interfaces as first-class contracts. Do not assume HTTP.

Methodology: [contract-model.md](contract-model.md) · [contract-types.md](contract-types.md) · [contract-checklist.md](contract-checklist.md) · [contracts/README.md](contracts/README.md)

Template: [templates/contract.md](templates/contract.md)

Examples: [../../examples/contracts/](../../examples/contracts/)

### Decisions

Record architectural decisions with ADRs. Decisions explain *why*; architecture docs describe *what exists*.

Template: [templates/adr.md](templates/adr.md)

### Templates

Reusable skeletons for project documentation. Copy into an adopting project and fill with project-specific content.

See [templates/README.md](templates/README.md).

Lifecycle-related templates:

- [templates/documentation-pr-checklist.md](templates/documentation-pr-checklist.md)
- [templates/ownership-matrix.md](templates/ownership-matrix.md)
- [templates/review-record.md](templates/review-record.md)

## Recommended Adoption Order

1. Project overview
2. Architecture (current state)
3. Components and integrations
4. Contracts
5. Security
6. Operations / reliability / runbooks
7. Observability (signals feeding operations)
8. ADRs for material decisions
9. Apply lifecycle metadata, ownership, and review policy
10. Apply AI-ready metadata, claims, relationships, and [ai-context.md](ai-context.md) entry when docs are AI consumers

## Completion Rule

A relevant technical change is not complete until required documentation is updated. See [change-policy.md](change-policy.md).

## Examples

Fictional adoption examples:

- [../../examples/simple-service/](../../examples/simple-service/)
- [../../examples/adoption-scaffold/](../../examples/adoption-scaffold/) — optional empty Day 0 tree
- [../../examples/fullstack-monolith/](../../examples/fullstack-monolith/) — **illustrative** FE+API+DB monolith (suggested stack ≠ standard)
- [../../examples/suggested-document-platform/](../../examples/suggested-document-platform/) — **illustrative** document intelligence / BFF / workers (suggested stack ≠ standard)
- [../../examples/event-driven-service/](../../examples/event-driven-service/)
- [../../examples/distributed-system/](../../examples/distributed-system/)
- [../../examples/adopter-ci-starter/](../../examples/adopter-ci-starter/) — optional CI for adopters
- [../../examples/adopter-agent-starter/](../../examples/adopter-agent-starter/) — optional agent entry files
- [../../examples/contracts/](../../examples/contracts/) — standalone API / Event / Message / File contracts
- [../../examples/operations/](../../examples/operations/) — service profile, runbook, incident, failure mode, SLI, SLO, recovery
- [../../examples/security/](../../examples/security/) — asset, threat, risk, requirement, control, vulnerability, exception, incident, security-test, security-review

Adoption guides:

- [adoption-path.md](adoption-path.md) — Day 0 / 30 / 90
- [ai-agent-entry.md](ai-agent-entry.md) — optional `AGENTS.md` / `CLAUDE.md` packaging
- [flat-docs-migration.md](flat-docs-migration.md) — migrate flat docs
- [language.md](language.md) — bilingual policy + optional partial translation for adopters
- [observability-platform-notes.md](observability-platform-notes.md) — org platform (e.g. Datadog) ≠ framework requirement
- [templates/deployment.md](templates/deployment.md) — lightweight deploy view
- [templates/feature-flags.md](templates/feature-flags.md) · [templates/data-model.md](templates/data-model.md) · [templates/worker.md](templates/worker.md) · [templates/bff.md](templates/bff.md)