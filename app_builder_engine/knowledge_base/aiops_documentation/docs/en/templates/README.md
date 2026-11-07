---
title: "Templates"
status: "ACCEPTED"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
---

# Templates

> Language: EN | [Português (pt-BR)](../../pt-BR/templates/README.md)
>
> Status: ACCEPTED

Reusable document templates for adopting projects.

Copy a template into the appropriate category of your project, replace placeholders, and set document lifecycle status in YAML frontmatter.

## Frontmatter Requirement

Every content document must start with YAML frontmatter. Required fields:

| Field | Required | Notes |
| --- | --- | --- |
| `title` | Yes | Document title |
| `status` | Yes | Lifecycle: `DRAFT`, `ACCEPTED`, `DEPRECATED`, etc. |
| `owner` | Yes | Team or role |
| `updated` | Yes | Last content update (`YYYY-MM-DD`) |
| `created` | No | First publish date |
| `review_date` | No | Next or last review target |
| `version` | No | Document version string |

Optional deprecation fields (see commented keys in [project-overview.md](project-overview.md) and [architecture.md](architecture.md)): `deprecated_on`, `superseded_by`, `deprecation_reason`.

Keep the language switcher blockquote after the H1. Do not put lifecycle metadata in the blockquote.

For ADRs: frontmatter `status` is document lifecycle; the `## Status` section is decision status (`Proposed` / `Accepted` / …). They are independent.

## Available Templates

| Template | File | Use for |
| --- | --- | --- |
| Project Overview | [project-overview.md](project-overview.md) | System purpose, scope, and map |
| Architecture | [architecture.md](architecture.md) | Consolidated architecture document |
| Architecture Overview | [architecture-overview.md](architecture-overview.md) | Lightweight architecture summary |
| System Context | [system-context.md](system-context.md) | System in its ecosystem |
| Component | [component.md](component.md) | Single component operational/detail view |
| Component Architecture | [component-architecture.md](component-architecture.md) | Architectural component view |
| Data Flow | [data-flow.md](data-flow.md) | One meaningful data path |
| Sequence | [sequence.md](sequence.md) | Ordered interactions for a scenario |
| Dependency Map | [dependency-map.md](dependency-map.md) | Internal, external, infra, data, operational deps |
| Architecture Constraints | [architecture-constraints.md](architecture-constraints.md) | Constraints conditioning architecture |
| Quality Attributes | [quality-attributes.md](quality-attributes.md) | Quality attribute requirements and evidence |
| Architecture Trade-off | [architecture-tradeoff.md](architecture-tradeoff.md) | Architectural choice with benefit/cost |
| Integration | [integration.md](integration.md) | Integration between systems/components |
| Contract | [contract.md](contract.md) | APIs, events, messages, files, commands, and other interfaces |
| Error Contract | [error-contract.md](error-contract.md) | Error catalog for a contract (no HTTP assumption) |
| Service Profile | [service-profile.md](service-profile.md) | Service operational identity card (owner/on-call required or `Unknown`) |
| Deployment | [deployment.md](deployment.md) | Lightweight deploy view (environments, units, pipeline) |
| Feature flags | [feature-flags.md](feature-flags.md) | Runtime toggles / configuration surface (no secret values) |
| Data model | [data-model.md](data-model.md) | Schemas, core entities, data ownership |
| Worker | [worker.md](worker.md) | Long-running worker / sidecar process |
| BFF | [bff.md](bff.md) | Browser edge / BFF / optional SSR layer |
| Runbook | [runbook.md](runbook.md) | Operational procedure |
| Security | [security.md](security.md) | Security posture overview (links methodology) |
| Security Asset | [security-asset.md](security-asset.md) | Single security asset |
| Threat | [threat.md](threat.md) | Single threat |
| Security Risk | [security-risk.md](security-risk.md) | Single security risk |
| Security Requirement | [security-requirement.md](security-requirement.md) | Single security requirement |
| Security Control | [security-control.md](security-control.md) | Single security control |
| Security Alert | [security-alert.md](security-alert.md) | Security-purpose alert |
| Vulnerability | [vulnerability.md](vulnerability.md) | Vulnerability record |
| Security Exception | [security-exception.md](security-exception.md) | Security exception |
| Security Incident | [security-incident.md](security-incident.md) | Security incident record |
| Security Test | [security-test.md](security-test.md) | Security test strategy/record |
| Observability | [observability.md](observability.md) | Signals, alerts, health |
| SLI | [sli.md](sli.md) | Service level indicator |
| SLO | [slo.md](slo.md) | Service level objective (includes Error Budget) |
| Failure Mode | [failure-mode.md](failure-mode.md) | Single failure mode |
| Capacity Limit | [capacity-limit.md](capacity-limit.md) | Capacity / saturation limit |
| Alert | [alert.md](alert.md) | Single alert definition |
| Incident | [incident.md](incident.md) | Incident record |
| Recovery Procedure | [recovery-procedure.md](recovery-procedure.md) | Restore / recovery procedure |
| ADR | [adr.md](adr.md) | Architecture decision record |
| Troubleshooting | [troubleshooting.md](troubleshooting.md) | Diagnostic guide |
| Diagram | [diagram.md](diagram.md) | Diagram conventions and examples |
| Claim | [claim.md](claim.md) | Single evidence-bound technical claim |
| Document Relationship | [document-relationship.md](document-relationship.md) | Typed link between documents |
| Documentation Change | [documentation-change.md](documentation-change.md) | Planned or completed doc change + impact |
| Contradiction | [contradiction.md](contradiction.md) | Conflicting statements across docs/evidence |
| Knowledge Gap | [knowledge-gap.md](knowledge-gap.md) | Known / Unknown / Assumed / Needs Verification |
| AI Task Context | [ai-task-context.md](ai-task-context.md) | Context pack for an AI task |
| AI Documentation Health | [ai-documentation-health.md](ai-documentation-health.md) | Documentation health snapshot for AI |
| AI Change Record | [ai-change-record.md](ai-change-record.md) | Audit trail for AI-assisted doc changes |
| AGENTS.md entry | [agents-entry.md](agents-entry.md) | Root `AGENTS.md` pointer (stack, commands, boundaries) |
| CLAUDE.md entry | [claude-entry.md](claude-entry.md) | Root `CLAUDE.md` pointer for Claude Code |
| Validation Rule | [validation-rule.md](validation-rule.md) | Single documentation validation rule |
| Documentation Exception | [exception.md](exception.md) | Time-bounded waiver of a validation rule |
| Governance Report | [governance-report.md](governance-report.md) | Periodic governance / health summary |

### Operations templates

| Template | Role | When to prefer |
| --- | --- | --- |
| [service-profile.md](service-profile.md) | Operational identity: ownership, criticality, deps, SLIs, recovery stance | Entry point for operating a service; links architecture/contracts |
| [feature-flags.md](feature-flags.md) | Flag inventory + emergency rollback | When runtime toggles change product behavior |
| [deployment.md](deployment.md) | Environments, deployable units, pipeline | Lightweight deploy view (optional) |
| [runbook.md](runbook.md) | Executable diagnosis/resolution with safety notes | Recurring or high-impact operational procedures |
| [troubleshooting.md](troubleshooting.md) | Symptom index linking lightly to runbooks/incidents | Broad diagnostic guide across multiple issues |
| [observability.md](observability.md) | Inventory of signals, alerts, SLOs, health | Project observability posture |
| [sli.md](sli.md) / [slo.md](slo.md) | Single indicator / objective (+ error budget on SLO) | When service levels are Defined |
| [failure-mode.md](failure-mode.md) | One failure mode with detection and recovery | Catalog entries for material modes |
| [capacity-limit.md](capacity-limit.md) | One limit and behavior at saturation | Known quotas / cliffs |
| [alert.md](alert.md) | One actionable alert | Non-trivial alerts needing Condition→Action clarity |
| [incident.md](incident.md) | Incident record (root cause may be Unknown while open) | Active or historical incidents |
| [recovery-procedure.md](recovery-procedure.md) | Restore/recovery path with RPO/RTO context | Backup restore, failover, rebuild |

Operations category and AI rules:

- [operations/README.md](../operations/README.md) — full ops methodology index
- [observability/README.md](../observability/README.md) — observability category
- [ai-documentation.md](../ai-documentation.md) — AI operations, reliability, and runbook rules
- [operations-model.md](../operations-model.md) — operations loop
- [versioning.md](../versioning.md) — Documentation Standard v1.0

### Security templates

| Template | Role | When to prefer |
| --- | --- | --- |
| [security.md](security.md) | Security posture overview linking methodology | Entry document for a system's security docs |
| [security-asset.md](security-asset.md) | Single asset to protect | Asset catalog entries |
| [threat.md](threat.md) | Single threat scenario | Threat model catalog |
| [security-risk.md](security-risk.md) | Single risk with residual notes | Risk register entries |
| [security-requirement.md](security-requirement.md) | Single security obligation | Requirement catalog |
| [security-control.md](security-control.md) | Single control (preventive/detective/corrective/compensating) | Control inventory |
| [security-alert.md](security-alert.md) | Security-purpose alert | Distinct from pure ops alerts, or Type=Both |
| [vulnerability.md](vulnerability.md) | Vulnerability lifecycle record | Identify→Close tracking |
| [security-exception.md](security-exception.md) | Exception with required fields | Temporary or explicit deviations |
| [security-incident.md](security-incident.md) | Security / Both incident record | When dedicated security fields help |
| [security-test.md](security-test.md) | Security test strategy/record | SAST/DAST/etc conceptual coverage |

Security category and AI rules:

- [security/README.md](../security/README.md) — full security methodology index
- [ai-documentation.md](../ai-documentation.md) — AI security analysis, threat detection, review rules
- [security-model.md](../security-model.md) — security loop
- [versioning.md](../versioning.md) — Documentation Standard v1.0

### Contract templates

| Template | Role | When to prefer |
| --- | --- | --- |
| [contract.md](contract.md) | Canonical interface contract (producer/consumer, schema, semantics, reliability, security) | Primary doc for an API, event, message, file, command, callback, library, or data contract |
| [error-contract.md](error-contract.md) | Dedicated error catalog with retryability and consumer actions | Non-trivial error surfaces; keep the primary contract linked, not duplicated |

Contract category and AI rules:

- [contracts/README.md](../contracts/README.md) — category guidance for adopting projects
- [ai-documentation.md](../ai-documentation.md) — AI contract analysis and comparison rules
- [architecture-model.md](../architecture-model.md) — contracts as the Interfaces layer
- [architecture-traceability.md](../architecture-traceability.md) — linking architecture → component → contract
- [versioning.md](../versioning.md) — document vs contract identifier versioning

### Architecture template differences

| Template | Role | When to prefer |
| --- | --- | --- |
| [architecture.md](architecture.md) | Consolidated architecture (context → constraints → ADRs/contracts) | Primary architecture doc for a system; skip unused sections on simple projects |
| [architecture-overview.md](architecture-overview.md) | Focused high-level summary | Entry point or when a full consolidated doc is unnecessary |
| [component.md](component.md) | Operational/implementation-oriented component detail | Deployable or owned unit needing inputs, config, ops notes |
| [component-architecture.md](component-architecture.md) | Architectural component (responsibilities, structure, interfaces) | Meaningful architectural units — **not** every class or file |

## Lifecycle Templates

| Template | File | Use for |
| --- | --- | --- |
| Documentation PR Checklist | [documentation-pr-checklist.md](documentation-pr-checklist.md) | Checklist for documentation pull requests |
| Ownership Matrix | [ownership-matrix.md](ownership-matrix.md) | Document and domain ownership |
| Review Record | [review-record.md](review-record.md) | Record of documentation reviews |

## Usage Rules

1. Keep sections even when empty — mark `Not applicable` or `Unknown` instead of deleting structure arbitrarily.
2. Do not treat every section as mandatory content for every project.
3. Never fill placeholders with invented project facts.
4. Set frontmatter `status: "DRAFT"` until reviewed; move to `ACCEPTED` after review.
5. Do not invent metrics, targets, architectural patterns, SLOs, alerts, DR, or runbook commands without evidence.
