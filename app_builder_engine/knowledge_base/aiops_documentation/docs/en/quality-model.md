# Documentation Quality Model

> Language: EN | [Português (pt-BR)](../pt-BR/quality-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

A lightweight model to assess documentation quality without bureaucracy.

Use it for self-checks, reviews, and prioritization of documentation debt — not as a scoring contest.

## Dimensions

| Dimension | Question |
| --- | --- |
| **Accuracy** | Does the content match the system as it exists? |
| **Completeness** | Are the necessary topics present for the document's purpose? |
| **Consistency** | Do terms, statuses, and claims agree across related docs? |
| **Freshness** | Is the content current relative to recent relevant changes? |
| **Traceability** | Can claims be traced to code, config, contracts, ADRs, or explicit classification? |
| **Usability** | Can a reader find and apply the information quickly? |
| **Maintainability** | Can the owning team update this without heroic effort? |
| **AI Readability** | Is structure and wording clear enough for AI agents to use as reliable context? |

Accuracy beats volume. A short Confirmed section is better than a long invented one.

## AI-ready quality dimensions

When assessing documentation as **AI context** (Documentation Standard v1.0), apply the general dimensions above and these AI-ready dimensions:

| Dimension | Question |
| --- | --- |
| **Discoverability** | Can an agent find the entry point, canonical doc, and registry row for the topic quickly? |
| **Comprehensibility** | Are scope, claims, and limits unambiguous at the loaded context level? |
| **Traceability** | Can each material claim be traced to evidence, IDs, or an explicit Unknown? |
| **Consistency** | Do canonical names, statuses, and relationships agree across the context pack? |
| **Freshness** | Is the loaded context current enough relative to code/config and review dates? |
| **Machine Readability** | Are metadata, tables, enums, and IDs structured for reliable parsing? |
| **Context Integrity** | Are systems, eras, and Confirmed vs Proposed boundaries preserved without mixing? |

## Governance quality dimensions

When assessing governed documentation (Documentation Standard v1.0), also ask:

| Dimension | Question |
| --- | --- |
| **Enforceability** | Can objective failures be caught by automation before merge? |
| **Accountability** | Is ownership clear for Authoritative and operational docs? |
| **Exception hygiene** | Are waivers explicit, owned, and not expired? |
| **Gate clarity** | Do ERROR / WARNING / INFO map to known CI behavior? |
| **Auditability** | Can material doc/governance changes be reconstructed? |
| **Security** | Is the context free of secret values and unnecessary sensitive data, with safe references only? |

Use [ai-ready-checklist.md](ai-ready-checklist.md) and [documentation-health.md](documentation-health.md). Entry: [ai-context.md](ai-context.md).

## Contract quality dimensions

When assessing **technical contracts**, apply the general dimensions above and these contract-specific ones:

| Dimension | Question |
| --- | --- |
| **Clarity** | Is it clear what the contract represents and who participates? |
| **Completeness** | Are the necessary rules documented (schema, semantics, errors, retry, … as applicable)? |
| **Consistency** | Are documentation, schema, and implementation aligned (or is Source of Truth explicit)? |
| **Compatibility** | Can change impact on producers and consumers be assessed? |
| **Traceability** | Are contract ↔ producer ↔ consumer (and architecture) links present? |
| **Testability** | Can the contract be verified (producer/consumer/schema/compatibility)? |
| **Discoverability** | Can integrators find the canonical contract quickly? |
| **Maintainability** | Can the owning team update the contract without heroic effort? |

Use [contract-checklist.md](contract-checklist.md) for item-level checks. Drift and debt: [contract-drift.md](contract-drift.md), [contract-debt.md](contract-debt.md).

## Operations quality dimensions

When assessing **operations and reliability documentation**, apply the general dimensions above and these ops-specific ones:

| Dimension | Question |
| --- | --- |
| **Operability** | Can operators run, change, and escalate safely with the documented procedures? |
| **Observability** | Are signals sufficient to detect and diagnose material failures (or explicitly N/A / Not Documented)? |
| **Recoverability** | Are recovery, rollback, restore, and RPO/RTO stances honest and usable? |
| **Resilience** | Are failure modes, degradation, and isolation documented without false comfort? |
| **Actionability** | Do alerts and runbooks drive clear next actions (not noise or theater)? |
| **Accuracy** | Do ops docs match how the system is actually operated (no invented SLOs, commands, or DR)? |

Use [operations-checklist.md](operations-checklist.md) and [operational-readiness-checklist.md](operational-readiness-checklist.md). Drift and debt: [operational-drift.md](operational-drift.md), [reliability-debt.md](reliability-debt.md).

## Security quality dimensions

When assessing **security documentation**, apply the general dimensions above and these security-specific ones:

| Dimension | Question |
| --- | --- |
| **Confidentiality** | Are sensitive data and secrets protected from unauthorized disclosure (or gaps marked honestly)? |
| **Integrity** | Are unauthorized or undetected modifications to data, code, or evidence addressed? |
| **Availability** | Are security-relevant availability risks (e.g. auth dependency failure, ransomware posture) documented without inventing DR? |
| **Authenticity** | Is it clear how principals and artifacts are authenticated / attested when applicable? |
| **Authorization** | Is it clear what principals may do — least privilege vs over-privilege gaps? |
| **Accountability** | Can security-relevant actions be attributed (auditability) without dumping PII/secrets into docs? |
| **Resilience** | Are detection, containment, and recovery for security incidents usable and linked to ops? |
| **Traceability** | Can assets→threats→risks→requirements→controls→evidence be followed (or unknowns marked)? |

Use [security-checklist.md](security-checklist.md) and [security-readiness-checklist.md](security-readiness-checklist.md). Drift and debt: [security-drift.md](security-drift.md), [security-debt.md](security-debt.md). Evidence integrity: [security-evidence.md](security-evidence.md).

## Levels

| Level | Name | Meaning |
| --- | --- | --- |
| **LEVEL 0** | Missing | Needed documentation does not exist |
| **LEVEL 1** | Basic | Minimal notes exist; gaps and unknowns are large |
| **LEVEL 2** | Documented | Canonical docs cover the topic with usable structure |
| **LEVEL 3** | Reviewed | Content has passed meaningful review against evidence |
| **LEVEL 4** | Governed | Lifecycle, ownership, metadata, and change/review practices are applied |

### LEVEL 0 — Missing

No canonical document for a required topic. Register debt and create a draft.

### LEVEL 1 — Basic

Something exists (README fragment, outdated wiki copy, partial draft). Not safe as sole operational guidance.

### LEVEL 2 — Documented

Structure follows templates/standards; scope is clear; unknowns are marked. May still be `DRAFT` or early `REVIEW`.

### LEVEL 3 — Reviewed

Review complete for current scope; status typically `ACCEPTED`; claims are evidenced or classified.

### LEVEL 4 — Governed

Level 3 plus active ownership, honest lifecycle status, metadata (`owner`, `updated`, …), and updates tied to relevant changes ([change-policy.md](change-policy.md), [lifecycle.md](lifecycle.md)).

## Practical Use

- Target Level 3 for production-critical runbooks, contracts, and security docs (threat models, incident paths, secret handling).
- Target Level 4 for long-lived substantive docs in adopting projects.
- Use dimensions to explain *why* a doc is weak (for example "freshness fail" vs "missing entirely").
- Do not invent alternate status tokens to encode quality levels — levels are assessment labels, not `status` metadata.

## Related Documents

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
