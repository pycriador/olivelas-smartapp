# AI-Generated Documentation

> Language: EN | [Português (pt-BR)](../pt-BR/ai-documentation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Rules for AI agents that create or update engineering documentation.

AI must treat documentation as an engineering artifact, not free-form text.

## AI context entry (start here)

**Primary entry point:** [ai-context.md](ai-context.md)

Before applying the domain rules below, agents must:

1. Open [ai-context.md](ai-context.md) and identify scope and context level.
2. Navigate with [ai-navigation.md](ai-navigation.md).
3. Answer with [ai-answering-rules.md](ai-answering-rules.md) (including AI Evidence Rules).
4. Follow the stage model in [ai-ready-model.md](ai-ready-model.md): Context → Knowledge → Relationships → Evidence → Constraints → Actions.

This file keeps **domain AI rules** for architecture, contracts, operations, security, reliability, and runbooks. AI-ready navigation, claims, and context integrity live in the AI-ready docs linked above.

## Mandatory Agent Workflow

1. **Consult existing documentation first**
   - Read related docs, indexes, ADRs, contracts, and lifecycle status before writing.
2. **Analyze the project / code when needed**
   - Inspect repository structure, entry points, configs, tests, and evidence sources.
3. **Preserve documentary state**
   - Do not silently change `status`, `owner`, or version metadata without cause.
   - New or AI-edited content remains `DRAFT` until human process moves it.
4. **Identify evidence**
   - Prefer authoritative sources: code, config, contracts, IaC, tests, ADRs.
5. **Separate facts from inferences**
   - Mark Confirmed, Inferred, Unknown, and Proposed explicitly.
6. **Avoid duplication**
   - Link canonical documents; do not copy contracts or decisions.
7. **Update related documents**
   - When a change affects multiple docs, update references and dependent docs.
8. **Signal unknowns**
   - Prefer incomplete accurate docs over complete invented docs.
9. **Never invent data**
   - Do not fabricate components, endpoints, SLOs, owners, or architectures.
10. **Never expose secrets**
    - Document secret references (name, purpose, source, required) only.
11. **Respect ownership**
    - Do not reassign `owner` casually; follow [ownership.md](ownership.md).
12. **Suggest human review when needed**
    - Material architecture, security, contract, or operational changes require human review.
    - AI must **never** set a document to `ACCEPTED` by itself.

Also apply bilingual rules for this repository: update EN and pt-BR together ([language.md](language.md)).

## AI Architecture Analysis

Before documenting architecture, an agent must:

1. Analyze project structure.
2. Identify components (architectural units — not every file/class).
3. Identify dependencies and their direction.
4. Identify interfaces and contracts.
5. Identify important flows (sync, async, batch, data).
6. Identify relevant infrastructure only when evidenced.
7. Identify system and trust boundaries when evidenced.
8. Check configuration and entry points.
9. Consult existing documentation and ADRs.
10. Compare documentation with implementation (detect possible drift).

Classify every architectural claim:

| Classification | Meaning |
| --- | --- |
| `Confirmed` | Supported by authoritative evidence |
| `Inferred` | Reasonable deduction from evidence; not explicit design intent |
| `Unknown` | Not identified — do not invent |
| `Proposed` | Future or desired state — never present as current |

Follow [architecture-model.md](architecture-model.md), [architecture-vs-implementation.md](architecture-vs-implementation.md), [architecture-drift.md](architecture-drift.md), and [architecture-checklist.md](architecture-checklist.md).

### Do not invent architecture styles

Do **not** claim the project uses microservices, event-driven architecture, CQRS, hexagonal, clean architecture, DDD, layered architecture, serverless, or any other style **only because** related concepts appear in code.

Declare an architectural style only when:

1. There is sufficient evidence; **and**
2. The structure justifies the classification; **or**
3. The project explicitly declares the style.

When unsure:

> Architectural style not identified.

Never present a desired architecture as the current architecture.

## AI Contract Analysis

Before documenting contracts, an agent must search for evidence in:

1. Code (handlers, clients, serializers, validators)
2. Schemas (OpenAPI, AsyncAPI, JSON Schema, Avro, Protobuf, SQL, or project-equivalent)
3. Configs (routes, topics, queues, feature flags, gateway config)
4. Tests (contract tests, integration tests, fixtures)
5. Specs (external partner specs, RFCs adopted by the project)
6. Existing documentation (contracts category, integrations, ADRs)
7. Consumers (call sites, subscribers, importers)
8. Producers (publishers, exporters, API implementations)

Classify every contract claim:

| Classification | Meaning |
| --- | --- |
| `Confirmed` | Supported by authoritative evidence |
| `Inferred` | Reasonable deduction from evidence; not explicit design intent |
| `Unknown` | Not identified — do not invent |
| `Proposed` | Future or desired contract — never present as current |

**Never invent** the following without evidence:

- Endpoints, channels, topics, queues, or interface locators
- Events, commands, or message types
- Fields, types, requiredness, or default values
- Error codes, error categories, or consumer guidance
- Delivery guarantees, ordering, or acknowledgement models
- Timeouts, retry policies, or idempotency keys
- Versioning schemes, compatibility rules, or deprecation policies
- Rate limits, size limits, or security mechanisms

Use [templates/contract.md](templates/contract.md) and [templates/error-contract.md](templates/error-contract.md). Prefer one canonical contract document; link from architecture and integrations instead of copying schemas. Follow [contracts/README.md](contracts/README.md).

Mark sections **Not Applicable** when the contract type does not need them. Do not assume HTTP or any specific technology stack.

## AI Operations Analysis

Before documenting operations, an agent must:

1. Consult existing ops docs, runbooks, ownership, and incident history (if present).
2. Identify how the system is deployed and validated — only from evidence.
3. Identify health signals, monitoring, and alerts actually configured or documented.
4. Identify operational owners / on-call / escalation when evidenced.
5. Identify critical dependencies and failure modes from architecture + runtime evidence.
6. Identify recovery paths (rollback, restore, failover) only when evidenced.
7. Compare docs with actual pipelines, dashboards, and alert configs when available (detect operational drift).
8. Link architecture failure domains and contract timeout/retry/idempotency into reliability notes — do not rewrite component descriptions.

Classify every operational claim:

| Classification | Meaning |
| --- | --- |
| `Confirmed` | Supported by authoritative evidence |
| `Inferred` | Reasonable deduction from evidence; not explicit ops intent |
| `Unknown` | Not identified — do not invent |
| `Proposed` | Future or desired ops practice — never present as current |

**Never invent** without evidence:

- SLOs, SLIs, SLAs, or error budgets
- Alerts, thresholds, dashboards, or on-call rotations
- RPO / RTO / DR strategies
- Deploy, rollback, or restore commands
- Infrastructure names, paths, permissions, or cluster topology
- Runbook steps that are not evidenced

When formal DR is absent, write: `Formal Disaster Recovery not defined.` When RPO/RTO are unknown: `Not Defined`.

Follow [operations-model.md](operations-model.md), [operations/README.md](operations/README.md), [operational-drift.md](operational-drift.md), and [operations-checklist.md](operations-checklist.md).

## AI Security Analysis

Before documenting security, an agent must:

1. Consult existing security docs, threat models, ownership, exceptions, and incident history (if present).
2. Identify assets and data classes only from evidence ([security-assets.md](security-assets.md), [security-classification.md](security-classification.md)).
3. Identify trust boundaries and attack surface from architecture + runtime evidence.
4. Identify authn/authz mechanisms and secret **references** (name/purpose/source) — never values.
5. Identify controls and requirements only when evidenced.
6. Link contracts for boundary authn/authz/sensitive fields — do not invent permissions.
7. Link operations for monitoring and incident response — do not invent SIEM/rules.
8. Compare docs with actual configs and reviews when available (detect security drift).

Classify every security claim:

| Classification | Meaning |
| --- | --- |
| `Confirmed` | Supported by authoritative evidence |
| `Inferred` | Reasonable deduction from evidence; not explicit security intent |
| `Unknown` | Not identified — do not invent |
| `Proposed` | Future or desired security control — never present as current |

**Never invent** without evidence:

- Controls, control effectiveness, or compensating controls
- Permissions, roles, policies, or IAM bindings
- Compliance certifications, regulatory mappings, or audit attestations
- Vulnerabilities, CVEs, or exploitability claims
- Encryption algorithms, key custody, or retention periods
- Security scanners, gates, or pass/fail results
- Exceptions, approvals, or expiration dates

When a control is absent: mark **Unknown** or **Not Defined** — do not fabricate one to complete a template.

Follow [security-model.md](security-model.md), [security/README.md](security/README.md), [security-drift.md](security-drift.md), and [security-checklist.md](security-checklist.md).

## AI Threat Detection

When an agent notices a possible security issue while analyzing code or docs, label it:

| Label | Meaning |
| --- | --- |
| `Potential Finding` | Plausible security concern from incomplete evidence — needs human triage |
| `Confirmed` finding | Only when authoritative evidence supports a real weakness in scope |
| `Unknown` | Cannot assess |
| `False Positive` candidate | Only suggest; humans decide |

Rules:

1. Prefer **Potential Finding** over absolute vulnerability claims when evidence is incomplete.
2. Do not auto-assign severity without asset exposure and owner context ([vulnerability-management.md](vulnerability-management.md)).
3. Do not invent CVE IDs or exploit narratives.
4. Route findings into the project's vulnerability process as candidates — do not silently “fix” by inventing mitigations.
5. Never embed secret values discovered in analysis into documentation; report exposure by reference ([secret-exposure.md](secret-exposure.md)).

## AI Security Review

When producing a security review of documentation or posture, structure each material item as:

| Field | Meaning |
| --- | --- |
| **Finding** | What was observed (fact) |
| **Evidence** | Paths, configs, tests, or **Unknown** |
| **Risk** | Potential impact — prefer Potential Finding language when incomplete |
| **Confidence** | High / Medium / Low / Unknown |
| **Recommendation** | Proposed improvement — never auto-apply as Confirmed current state |

Rules:

1. Keep Finding distinct from Recommendation.
2. Do not mark the reviewed document `ACCEPTED`.
3. Do not invent compliance pass/fail outcomes.
4. Register material gaps as [security debt](security-debt.md) or [security exception](security-exceptions.md) **candidates** for humans.
5. Align with Evidence Integrity principles — [security-evidence.md](security-evidence.md).

## AI Reliability Analysis

When analyzing reliability posture, identify risks as:

| Label | Meaning |
| --- | --- |
| `Confirmed` risk | Evidenced SPOF, missing detection, or broken recovery path |
| `Potential Risk` | Plausible reliability concern from incomplete evidence — needs human review |
| `Unknown` | Cannot assess |
| `Accepted Risk` | Only when the project explicitly recorded acceptance |

Rules:

1. Prefer **Potential Risk** over absolute claims when evidence is incomplete.
2. Do not auto-assign criticality or severity without owner/context ([criticality.md](criticality.md), [incident-severity.md](incident-severity.md)).
3. Contract timeout/retry/idempotency gaps are often reliability risks — link contracts; do not invent policies.
4. Architecture failure domains inform blast radius — link; do not duplicate component catalogs.
5. Register material gaps as [reliability debt](reliability-debt.md) candidates for humans — do not silently “fix” by inventing mitigation.

## AI Runbook Generation

When creating or updating runbooks:

1. Use [templates/runbook.md](templates/runbook.md) structure (purpose, scope, severity, symptoms, impact, preconditions, safety notes, diagnosis, mitigation, resolution, validation, rollback, escalation, communication).
2. **Never invent** commands, scripts, infrastructure, hostnames, paths, IAM roles, or permissions.
3. Prefer placeholders (`<environment>`, `<release-id>`) when the exact invocation is Unknown.
4. Call out destructive or irreversible steps explicitly; note when rollback is unsafe.
5. Link alerts, failure modes, architecture, and contracts instead of copying them.
6. Keep `status: DRAFT` until human review; never auto-`ACCEPTED`.
7. If the procedure is unknown, write that the runbook cannot be completed and list Unknowns — do not fabricate a comforting procedure.

## AI Contract Comparison

When comparing contract versions (or proposed vs current), identify each difference as one of:

| Change class | Meaning |
| --- | --- |
| `Added` | New field, operation, event, error, or guarantee |
| `Removed` | Previously present element no longer present |
| `Changed` | Same element with different type, semantics, or behavior |
| `Deprecated` | Still present but marked for removal |
| `Potential Breaking Change` | May break consumers — needs human/context review |
| `Unknown Impact` | Difference observed; consumer impact not established |

Rules:

1. Do **not** auto-classify a change as breaking without consumer, deployment, and compatibility context.
2. Prefer `Potential Breaking Change` or `Unknown Impact` over absolute "breaking" when evidence is incomplete.
3. Additive optional fields are often compatible — still verify against the project's compatibility policy.
4. Semantic changes (same shape, different meaning) are high risk even when schemas look compatible.
5. Never invent a "before" or "after" version that is not evidenced in code, schema, or docs.

Record comparison outcomes in the contract's Versioning / Compatibility sections, an ADR when the change is architectural, or a review note for human acceptance.

## AI Documentation Lifecycle Rules

| Action | Allowed AI behavior | Not allowed |
| --- | --- | --- |
| Create doc | Create as `DRAFT` | Create as `ACCEPTED` |
| Update ACCEPTED doc | Propose changes; set/recommend `REVIEW` | Mark `ACCEPTED` without human process |
| Deprecate | Suggest deprecation fields | Delete primary docs without policy |
| Archive | Suggest archive per policy | Destroy historical context silently |
| Status tokens | Use only defined statuses | Invent `FINAL`, `DONE`, `UPDATED` as stored status |
| Architecture style | Declare only with evidence | Infer style from buzzwords alone |

Follow [lifecycle.md](lifecycle.md), [status.md](status.md), [review-policy.md](review-policy.md), [change-policy.md](change-policy.md), and [architecture-review.md](architecture-review.md).

## Output Quality Rules

| Rule | Requirement |
| --- | --- |
| Structure | Follow templates in `docs/en/templates/` (and the mirror in `docs/pt-BR/templates/`) |
| Metadata | Prefer YAML frontmatter (`title`, `status`, `owner`, `updated`) |
| Status | Set `DRAFT` until human review |
| Classification | Mark uncertain statements |
| Evidence | Cite paths or ADRs for technical claims |
| Style | Follow [style-guide.md](style-guide.md) |
| Technology | Do not assume a stack not evidenced in the project |
| Current state | Do not document desired state as existing state |
| Lifecycle | Respect transitions and ownership |
| Architecture depth | Use only documentation levels that add value ([architecture-model.md](architecture-model.md)) |

## Allowed vs Disallowed

### Allowed

- Creating or updating Markdown documentation from repository evidence
- Adding diagrams that reflect observed structure or flows
- Proposing documentation improvements labeled Proposed
- Opening gaps as Unknown for human follow-up
- Opening documentation debt or architecture debt items when gaps are material
- Flagging possible architecture drift for human review

### Disallowed

- Inventing APIs, events, infrastructures, or ownership
- Inventing contract endpoints, fields, error codes, delivery guarantees, timeouts, retries, or versioning
- Inventing architecture styles or topologies
- Inventing SLOs, alerts, RPO/RTO, DR, runbook commands, paths, or permissions
- Inventing security controls, permissions, compliance, vulnerabilities, or secret values
- Auto-labeling contract diffs as breaking without context
- Auto-assigning incident severity, criticality, or vulnerability severity without context
- Embedding secrets or sensitive values
- Rewriting history to hide uncertainty
- Mixing multiple projects' real data into examples of this standard
- Changing production configuration as part of a docs-only task
- Auto-accepting documentation (`ACCEPTED`) without human/process approval
- Presenting Proposed architecture, contracts, ops practices, or security controls as Confirmed current state

## Recommended Front Matter Pattern

```yaml
---
title: "Document Title"
status: "ACCEPTED"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "0.1"
---
```

```markdown
> Language: EN | [Português (pt-BR)](../pt-BR/example.md)
> Generated-by: AI

## Evidence Summary

| Claim area | Source | Classification |
| --- | --- | --- |
| Entry points | `path/to/file` | Confirmed |
| Failure mode | not found | Unknown |
| Architectural style | not identified | Unknown |
```

`Generated-by: AI` is optional metadata to aid review. It does not replace human acceptance.

## Review Expectations for AI Output

Human reviewers must verify:

- [ ] No invented content
- [ ] Classifications are honest
- [ ] Secrets are absent
- [ ] Links and paths resolve
- [ ] Current vs proposed state is clear
- [ ] Architecture claims are evidence-based (no invented styles)
- [ ] Contract claims are evidence-based (no invented endpoints, fields, errors, or guarantees)
- [ ] Contract comparisons use Added/Removed/Changed/Deprecated/Potential Breaking Change/Unknown Impact — not automatic "breaking"
- [ ] Operations claims are evidence-based (no invented SLOs, alerts, DR, or commands)
- [ ] Reliability risks use Potential Risk / Unknown when evidence is incomplete
- [ ] Security claims are evidence-based (no invented controls, permissions, compliance, or vulns)
- [ ] Security issues use Potential Finding / Unknown when evidence is incomplete
- [ ] Security reviews include Finding / Evidence / Risk / Confidence / Recommendation
- [ ] Runbooks do not invent commands, infra, paths, or permissions
- [ ] Template sections are appropriately filled or marked not applicable
- [ ] Metadata/status/owner are correct
- [ ] Related documents were updated when needed

Promote to `REVIEW` / `ACCEPTED` only after human review (or the team's formal process).

## Related Documents

- [ai-context.md](ai-context.md) — **primary AI entry**
- [ai-navigation.md](ai-navigation.md)
- [ai-answering-rules.md](ai-answering-rules.md)
- [ai-ready-model.md](ai-ready-model.md)
- [ai-task-boundaries.md](ai-task-boundaries.md)
- [ai-change-rules.md](ai-change-rules.md)
- [principles.md](principles.md)
- [lifecycle.md](lifecycle.md)
- [status.md](status.md)
- [ownership.md](ownership.md)
- [standards.md](standards.md)
- [style-guide.md](style-guide.md)
- [documentation-checklist.md](documentation-checklist.md)
- [quality-model.md](quality-model.md)
- [language.md](language.md)
- [change-policy.md](change-policy.md)
- [architecture-model.md](architecture-model.md)
- [architecture-review.md](architecture-review.md)
- [architecture-drift.md](architecture-drift.md)
- [architecture-debt.md](architecture-debt.md)
- [contracts/README.md](contracts/README.md)
- [templates/contract.md](templates/contract.md)
- [templates/error-contract.md](templates/error-contract.md)
- [operations/README.md](operations/README.md)
- [operations-model.md](operations-model.md)
- [templates/runbook.md](templates/runbook.md)
- [operational-drift.md](operational-drift.md)
- [reliability-debt.md](reliability-debt.md)
- [security/README.md](security/README.md)
- [security-model.md](security-model.md)
- [templates/security.md](templates/security.md)
- [security-drift.md](security-drift.md)
- [security-debt.md](security-debt.md)
- [security-evidence.md](security-evidence.md)
