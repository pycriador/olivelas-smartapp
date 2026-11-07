#!/usr/bin/env python3
"""Historical one-shot generator for governance EN documentation bodies. Safe to re-run."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EN = ROOT / "docs" / "en"
PT = ROOT / "docs" / "pt-BR"
DATE = "2026-08-07"
VER = "1.0"


def hdr(title: str, pt_name: str, status: str = "ACCEPTED") -> str:
    return f"""---
title: "{title}"
status: "{status}"
owner: "documentation-standard"
created: "{DATE}"
updated: "{DATE}"
review_date: "{DATE}"
version: "{VER}"
standard: "Documentation Standard v{VER}"
---

# {title}

> Language: EN | [Português (pt-BR)](../pt-BR/{pt_name})
>
> Status: {status}
>
> Documentation Standard v{VER}

"""


DOCS: dict[str, str] = {}


def add(name: str, title: str, body: str) -> None:
    DOCS[name] = hdr(title, name) + body.strip() + "\n"


add(
    "governance.md",
    "Documentation Governance",
    """
Governance makes documentation quality **enforceable**, not merely recommended.

```text
Standards → Ownership → Lifecycle → Validation → Quality Gates → Exceptions → Audit → Health
```

## Questions Governance Answers

| Question | Where |
| --- | --- |
| Who may change documentation? | [documentation-ownership.md](documentation-ownership.md), [governance-roles.md](governance-roles.md) |
| Who may approve? | [documentation-change-policy.md](documentation-change-policy.md), [review-policy.md](review-policy.md) |
| Which documents require review? | [document-classification.md](document-classification.md), [change-classification.md](change-classification.md) |
| Which documents are authoritative? | [source-of-truth.md](source-of-truth.md), [authority-levels.md](authority-levels.md) |
| Which changes require validation? | [quality-gates.md](quality-gates.md), [automation.md](automation.md) |
| What may be automated? | [automation.md](automation.md), [validation-rules.md](validation-rules.md) |
| What requires human approval? | Matrix in this doc + [documentation-change-policy.md](documentation-change-policy.md) |
| How are exceptions recorded? | [exceptions.md](exceptions.md) |
| How are deprecated docs handled? | [deprecation-policy.md](deprecation-policy.md), [history-model.md](history-model.md) |
| How are conflicts handled? | [contradiction-model.md](contradiction-model.md), [contradictions/](contradictions/) |

## Machine Validation vs Human Review

| Kind | Responsibility |
| --- | --- |
| **Machine validation** | Objective rules: metadata, IDs, links, manifest sync, expired exceptions, structural claim tokens |
| **Human review** | Semantic correctness: architecture truth, security adequacy, operational safety, evidence strength, contradiction resolution |

Automation must not silently change Authoritative knowledge.

## Official Workflow

```text
Change → Classify → Identify Impact → Update Documentation → Run Automation
→ Resolve Errors → Review → Approve → Merge → Generate Reports
```

## Automated vs Human Responsibility

| Activity | Automation | Human |
| --- | --- | --- |
| Metadata validation | Yes | Optional |
| Link validation | Yes | No |
| Duplicate IDs | Yes | No |
| Manifest validation | Yes | Optional |
| Semantic consistency | Partial | Yes |
| Architecture correctness | No | Yes |
| Security correctness | Partial | Yes |
| Ownership assignment | Partial | Yes |
| Evidence validity | Partial | Yes |
| Documentation freshness | Partial | Yes |
| Contradiction resolution | No | Yes |
| Exception approval | No | Yes |
| AI-generated content acceptance | Partial | Yes |

## Governance Boundaries

Automation must **not**:

- auto-approve Critical changes;
- invent evidence;
- silently modify Authoritative documents;
- remove history;
- hide errors;
- delete exceptions without record;
- ignore security findings;
- replace human ownership.

## Related Documents

- [principles.md](principles.md) (GV-* principles)
- [ownership.md](ownership.md)
- [change-policy.md](change-policy.md)
- [automation.md](automation.md)
- [quality-gates.md](quality-gates.md)
- [governance-auditability.md](governance-auditability.md)
""",
)

add(
    "documentation-ownership.md",
    "Documentation Ownership Model",
    """
Extends [ownership.md](ownership.md) with governance roles for who may propose, maintain, and approve documentation.

## Roles

| Role | Responsibility |
| --- | --- |
| **Owner** | Accountable for content accuracy and currency |
| **Reviewer** | Reviews for technical / operational / security accuracy |
| **Maintainer** | Accountable for documentation structure, standards, and tooling |
| **Contributor** | Proposes changes (human or AI agent under human direction) |

Roles may be held by the same team. Prefer durable team/role ids over personal names in metadata.

## Expectations

| Document class | Owner | Reviewer |
| --- | --- | --- |
| Authoritative | Required | Required for material change |
| Operational | Required | Operational review |
| Security-Sensitive | Required | Security review |
| Informational | Recommended | Optional |
| Historical / Deprecated | Last known owner retained | Optional |

## Unknown Ownership

Do not invent owners. Record Unknown and open a knowledge gap or ownership debt item.

## Related Documents

- [ownership.md](ownership.md)
- [ownership-matrix.md](ownership-matrix.md)
- [governance-roles.md](governance-roles.md)
""",
)

add(
    "ownership-matrix.md",
    "Documentation Ownership Matrix",
    """
Fill this matrix in adopting projects. Values below are placeholders for **this standard repository**.

| Documentation Domain | Owner | Reviewer |
| --- | --- | --- |
| Architecture | documentation-standard | documentation-standard |
| Contracts | documentation-standard | documentation-standard |
| Operations | documentation-standard | documentation-standard |
| Security | documentation-standard | documentation-standard |
| AI Documentation | documentation-standard | documentation-standard |
| Governance & Automation | documentation-standard | documentation-standard |

Use the template [templates/ownership-matrix.md](templates/ownership-matrix.md) for project-specific matrices.

## Related Documents

- [documentation-ownership.md](documentation-ownership.md)
- [governance-roles.md](governance-roles.md)
""",
)

add(
    "governance-roles.md",
    "Governance Roles",
    """
Minimum governance roles. One person/team may accumulate several.

| Role | Focus |
| --- | --- |
| **Documentation Owner** | Domain content accuracy |
| **Architecture Owner** | Architecture SoT and related ADRs |
| **Security Owner** | Security docs, exceptions, classifications |
| **Operations Owner** | Runbooks, SLOs, incident/recovery docs |
| **Repository Maintainer** | Standard structure, validation config, CI gates |

## Authority

Owners propose and maintain. Approvers (when used) accept. Maintainers control validation rules and generated artifacts policy.

AI contributors are never implicit owners ([ai-task-boundaries.md](ai-task-boundaries.md)).

## Related Documents

- [documentation-ownership.md](documentation-ownership.md)
- [governance.md](governance.md)
""",
)

add(
    "document-classification.md",
    "Document Classification (Control)",
    """
Control classification determines how strictly a document is governed. Distinct from claim classification (`Confirmed` / `Inferred` / …) and from security data classification.

| Class | Meaning | Control level |
| --- | --- | --- |
| **Informational** | Helpful context; not SoT | Low |
| **Operational** | Used to operate or recover | High |
| **Authoritative** | Source of truth for a domain | Highest |
| **Security-Sensitive** | Security-relevant content (still no secrets) | Highest |
| **Historical** | Past state; not current | Medium (label clearly) |
| **Deprecated** | Superseded; do not use as primary | Medium |

## Rules

1. Authoritative and Security-Sensitive changes require review per [documentation-change-policy.md](documentation-change-policy.md).
2. Historical/Deprecated must remain distinguishable ([history-model.md](history-model.md)).
3. Classification may appear in metadata `tags` or prose; authority uses `authority` field.

## Related Documents

- [authority-levels.md](authority-levels.md)
- [source-of-truth.md](source-of-truth.md)
""",
)

add(
    "change-classification.md",
    "Change Classification",
    """
Classify documentation (and docs-impacting) changes by impact.

| Level | Meaning | Examples |
| --- | --- | --- |
| **Low** | Editorial / non-semantic | Typos, formatting, link text |
| **Medium** | Documented behavior change | Clarify retry semantics, update SLO target text |
| **High** | Architectural, contractual, or operational change | New component boundary, contract field, runbook steps |
| **Critical** | Material security, availability, or integrity impact | Authn/authz change, secret handling, recovery path |

## Mapping to Gates

| Level | Validation | Human review |
| --- | --- | --- |
| Low | Lint | Optional |
| Medium | Lint + targeted review | Recommended |
| High | Lint + domain review | Required |
| Critical | Lint + security/ops as applicable | Required |

See [change-impact-matrix.md](change-impact-matrix.md).
""",
)

add(
    "change-impact-matrix.md",
    "Change Impact Matrix",
    """
| Change type | Required validation | Required review | Also evaluate |
| --- | --- | --- | --- |
| Architecture change | Structural lint; architecture checklist | Architecture | Contracts, Operations, Security, ADRs |
| API / contract change | Lint; contract checklist | Technical / contract owner | Consumers, Security, Ops, Tests |
| Operational change | Lint; ops readiness | Operational | Runbooks, Alerts, Recovery |
| Security change | Lint; security checklist | Security | Threats, Controls, Contracts, Ops |
| AI-context / manifest change | Lint; AI readiness rules | Maintainer + domain as needed | Navigation, evidence, relationships |
| Editorial only | Lint | Optional | — |

Integrate with [change-policy.md](change-policy.md) and [change-impact.md](change-impact.md).
""",
)

add(
    "documentation-change-policy.md",
    "Documentation Change Policy (Governance)",
    """
Extends [change-policy.md](change-policy.md) with validation, approval, evidence, and ADR triggers for governed documentation.

## When Validation Is Required

Run `docs:validate` (see [automation-commands.md](automation-commands.md)) for any change that touches:

- `docs/**`
- `examples/**` (when adopting projects use them as SoT samples)
- `docs/validation-config.yaml`
- `scripts/docs_lint.py`
- manifests

## When Review / Approval Is Required

| Trigger | Review |
| --- | --- |
| Authoritative content change | Domain owner / reviewer |
| Security-Sensitive change | Security review |
| Operational procedure change | Operations review |
| Validation rule / gate change | Repository maintainer (+ impact note) |
| Exception create/approve | Exception approver |
| AI-proposed Authoritative edit | Human acceptance required |

## When Evidence Is Required

Material claims that move to Confirmed need evidence references ([claims.md](claims.md)).

## When Changelog / ADR Is Required

| Trigger | Artifact |
| --- | --- |
| Standard version bump | [versioning.md](versioning.md) + root README |
| Architecture decision | ADR |
| Breaking documentation standard change | Migration notes ([migration-policy.md](migration-policy.md)) |

## Related Documents

- [change-policy.md](change-policy.md)
- [change-classification.md](change-classification.md)
- [quality-gates.md](quality-gates.md)
- [templates/documentation-change.md](templates/documentation-change.md)
- [templates/ai-change-record.md](templates/ai-change-record.md)
""",
)

add(
    "automation.md",
    "Documentation Automation",
    """
Conceptual automation architecture for in-repo documentation validation.

```text
Documentation → Parser → Rules → Validation → Report → Quality Gate
```

## Principles

1. Prefer objective, automatable rules.
2. Local and CI use the **same** tool and config.
3. Do not call external services by default.
4. Never execute arbitrary content from documents.
5. Generated outputs are clearly marked ([generated-policy.md](generated-policy.md)).

## Validation Categories

| Category | Examples |
| --- | --- |
| Structure | Required sections when templates declare them |
| Metadata | status, owner, authority enums |
| Links | Broken relative Markdown targets |
| References | Manifest paths, relationship targets |
| Manifest | Missing/duplicate entries |
| Relationships | Source/target existence |
| Consistency | ID uniqueness per language tree |
| Security | Secret-pattern scan (no value logging) |
| Freshness | Stale dates → WARNING |
| Ownership | Authoritative without owner → ERROR |
| AI Readiness | `ai-context.md` present |

## Implementation in This Repository

| Piece | Location |
| --- | --- |
| Linter | [../../scripts/docs_lint.py](../../scripts/docs_lint.py) |
| Config | [../validation-config.yaml](../validation-config.yaml) |
| Rules registry | [validation-rules.md](validation-rules.md) |
| Commands | [automation-commands.md](automation-commands.md) |
| Security | [automation-security.md](automation-security.md) |

## Related Documents

- [quality-gates.md](quality-gates.md)
- [ai-documentation-validation.md](ai-documentation-validation.md)
""",
)

add(
    "validation-rules.md",
    "Validation Rules Registry",
    """
Each rule has: Rule ID, Name, Description, Severity, Scope, Automatable, Exception Allowed.

| Rule ID | Name | Severity | Automatable | Exception |
| --- | --- | --- | --- | --- |
| DOC-META-001 | Authoritative docs must define owner | ERROR | Yes | Yes |
| DOC-META-002 | Status token must be allowed | ERROR | Yes | No |
| DOC-META-003 | Authority token recognized | WARNING | Yes | Yes |
| DOC-OWN-001 | ACCEPTED frontmatter should have owner | WARNING | Yes | Yes |
| DOC-ID-001 | Manifest entry has id | ERROR | Yes | No |
| DOC-ID-002 | Duplicate IDs in language tree / manifest | ERROR | Yes | No |
| DOC-ID-003 | Frontmatter id matches manifest | WARNING | Yes | Yes |
| DOC-ID-004 | ID matches expected pattern | WARNING | Yes | Yes |
| DOC-MAN-001 | Manifest file exists | ERROR | Yes | No |
| DOC-MAN-003 | Manifest entry has path | ERROR | Yes | No |
| DOC-MAN-004 | Manifest path exists on disk | ERROR | Yes | No |
| DOC-MAN-005 | File not listed in manifest | INFO | Yes | Yes |
| DOC-LINK-001 | Internal Markdown link target exists | ERROR | Yes | Yes |
| DOC-LINK-002 | Link must not escape repo root | ERROR | Yes | No |
| DOC-REL-001 | Relationship source/target resolves | ERROR | Yes | Yes |
| DOC-FRESH-001 | Authoritative doc may be stale | WARNING | Yes | Yes |
| DOC-EXC-001 | Exception past expiration still open | ERROR | Yes | No |
| DOC-AI-001 | AI context entry exists | ERROR | Yes | No |
| DOC-SEC-001 | Possible secret material | ERROR | Yes | No* |
| DOC-CLAIM-001 | Claim status token valid | ERROR | Yes | Yes |

\\* Secret findings require remediation or redaction; do not “except away” real credentials — rotate first.

Use [templates/validation-rule.md](templates/validation-rule.md) to add rules.

Severity model: **ERROR** blocks CI; **WARNING** passes with attention; **INFO** advisory.
""",
)

add(
    "drift-detection.md",
    "Documentation Drift Detection",
    """
Drift means documented state ≠ repository/system state.

```text
Documentation ≠ Repository State
```

Distinct from [security-drift.md](security-drift.md) and domain drifts ([architecture-drift.md](architecture-drift.md), [documentation-drift.md](documentation-drift.md)).

## Automatable Signals

| Signal | Detection |
| --- | --- |
| Referenced file missing | Link / manifest checks |
| Manifest stale path | DOC-MAN-004 |
| Broken relative path | DOC-LINK-001 |
| Expired exception still open | DOC-EXC-001 |
| Stale review date | DOC-FRESH-001 (WARNING) |

## Human Signals

| Signal | Handling |
| --- | --- |
| Component removed but still described | Contradiction / debt |
| Endpoint behavior changed | Contract review |
| Owner team renamed | Ownership update |
| Runbook steps wrong | Ops review after incident |

Automation reminds; humans decide updates.
""",
)

add(
    "health-score.md",
    "Documentation Health Score",
    """
Health is reported as **indicators**, not a mandatory single grade.

| Indicator | Meaning |
| --- | --- |
| Coverage | Manifest / checklist scoped coverage |
| Validity | ERROR count == 0 |
| Freshness | Stale WARNINGs on Authoritative docs |
| Traceability | Structural claim/evidence presence where used |
| Ownership | Authoritative owners present |
| Consistency | IDs, links, manifest |
| AI Readiness | AI context + navigation assets present |

If an adopting project aggregates a numeric score, document the formula explicitly. This repository does **not** require a single number.

Reports: [reports/documentation-health.md](reports/documentation-health.md) (generated).
""",
)

add(
    "pull-request-documentation.md",
    "Pull Request Documentation Checks",
    """
When a PR must update documentation — complements [change-policy.md](change-policy.md).

| Change | Documentation expected |
| --- | --- |
| Architecture change | Architecture docs / ADRs |
| API / contract change | Contract docs |
| Operational change | Ops / runbooks / alerts |
| Security change | Security docs |
| Behavior change for integrators | Relevant contracts + overview |
| Validation/governance change | Governance docs + config review |

## PR Checklist (Human)

Do not duplicate automated CI checks. Humans confirm:

- [ ] Documentation impact evaluated
- [ ] Relevant documentation updated
- [ ] Manifest updated when listing new authoritative docs
- [ ] Relationships updated when structure changed
- [ ] Evidence updated for Confirmed claims
- [ ] Security impact evaluated
- [ ] Operations impact evaluated

GitHub: [../../.github/pull_request_template.md](../../.github/pull_request_template.md)
""",
)

add(
    "quality-gates.md",
    "Documentation Quality Gates",
    """
```text
Change → Validation → Quality Gate → Review → Merge
```

## Gate Levels

| Gate | Focus | Primary mode |
| --- | --- | --- |
| **Gate 1 — Structural** | Metadata, IDs, links, manifest | Automated |
| **Gate 2 — Semantic** | Meaning, architecture truth | Human |
| **Gate 3 — Security** | Security docs & secret hygiene | Automated + Human |
| **Gate 4 — Operational** | Runbooks, alerts, recovery | Human (+ lint) |
| **Gate 5 — AI Readiness** | Context, evidence, relationships | Automated + Human |

## CI Failure Policy

| Severity | CI |
| --- | --- |
| ERROR | FAIL |
| WARNING | PASS + warning |
| INFO | PASS |

Documented exceptions may waive specific rules ([exceptions.md](exceptions.md)).
""",
)

add(
    "exceptions.md",
    "Documentation Exceptions",
    """
No rule may be ignored silently. Exceptions are explicit, owned, and time-bounded when temporary.

## Required Fields

| Field | Meaning |
| --- | --- |
| ID | e.g. `EXC-DOC-001` |
| Rule | Validation rule id |
| Reason | Why needed |
| Scope | Paths / docs covered |
| Owner | Accountable team |
| Expiration | `YYYY-MM-DD` for temporary exceptions |
| Approval | Approver role |
| Status | `OPEN` / `APPROVED` / `EXPIRED` / `CLOSED` |

## Expiration

Temporary exceptions become **EXPIRED** after the date. Automation emits **DOC-EXC-001** if still open.

## Storage

Place records under [exceptions/](exceptions/). Use [templates/exception.md](templates/exception.md).

## Related Documents

- [false-positives.md](false-positives.md)
- [validation-rules.md](validation-rules.md)
""",
)

add(
    "governance-auditability.md",
    "Governance Auditability",
    """
Traceability for **documentation governance events**. Distinct from security auditability ([auditability.md](auditability.md)) and AI change audit ([ai-auditability.md](ai-auditability.md)).

## Auditable Events

- documentation created / modified / deprecated;
- validation executed / failed;
- exception created / approved / expired;
- authoritative document changed;
- governance policy or validation-config changed;
- generated reports produced.

## Mechanisms

| Event | Mechanism |
| --- | --- |
| Content change | Git history + PR |
| Docs change proposal | [templates/documentation-change.md](templates/documentation-change.md) |
| AI-assisted change | [templates/ai-change-record.md](templates/ai-change-record.md) |
| Exception | [exceptions/](exceptions/) |
| Validation | CI logs + [reports/](reports/) |

Reuse existing change-record templates; do not invent a parallel audit store.
""",
)

add(
    "generated-policy.md",
    "Generated Documentation Policy",
    """
Generated artifacts are derived outputs. They must not silently overwrite Authoritative narrative docs.

## Allowed Generated Examples

- Manifest index
- Health / validation reports
- Dependency / impact reports derived from metadata

## Rules

| Topic | Policy |
| --- | --- |
| Location | [generated/](generated/) and/or [reports/](reports/) |
| Marking | Frontmatter `generated: "true"` and visible banner |
| Source | Documented (manifest, lint results) |
| Generator | `scripts/docs_lint.py` |
| Regeneration | `python3 scripts/docs_lint.py report` |
| Committed? | Optional; this repo commits health reports for visibility |
| Manually editable? | **No** — change the source and regenerate |

## Related Documents

- [automation.md](automation.md)
- [generated/README.md](generated/README.md)
""",
)

add(
    "automation-commands.md",
    "Automation Commands",
    """
All commands share [../validation-config.yaml](../validation-config.yaml) and [../../scripts/docs_lint.py](../../scripts/docs_lint.py).

Exit codes: `0` PASS, `1` VALIDATION FAILURE, `2` TOOL ERROR.

| Command | Purpose | Side effects | CI |
| --- | --- | --- | --- |
| `docs:lint` / `docs:validate` | Full validation | None | Yes |
| `docs:check-links` | Link checks only | None | Optional |
| `docs:check-manifest` | Manifest checks only | None | Optional |
| `docs:health` | Validation + write health report | Writes reports | Optional |
| `docs:report` | Health + manifest index | Writes generated/ | Optional |
| `docs:index` | Manifest index only | Writes generated/ | Optional |

### Shell

```bash
python3 scripts/docs_lint.py lint
python3 scripts/docs_lint.py validate
python3 scripts/docs_lint.py check-links
python3 scripts/docs_lint.py check-manifest
python3 scripts/docs_lint.py health
python3 scripts/docs_lint.py report
```

Make aliases (optional): see repository `Makefile`.

### Contract Fields

Each command:

- **Input**: repo tree + config
- **Output**: findings on stdout; reports for health/report
- **Exit code**: as above
- **Side effects**: only `health`, `report`, `index` write files under `docs/*/reports` and `docs/*/generated`
""",
)

add(
    "automation-security.md",
    "Automation Security",
    """
## Requirements

- Scripts use stdlib only; no arbitrary code execution from Markdown.
- Do not print secret values — only rule id and location.
- Do not upload documentation to external services without authorization.
- CI tokens: least privilege; no secrets in docs or logs.
- Validate paths to prevent traversal outside the repository root.
- Avoid shell interpolation of document content.

## Secret Handling

If DOC-SEC-001 fires: treat as compromised until proven placeholder — rotate real credentials before history cleanup ([secure-handling practices](secrets-management.md)).

## External Integrations

Optional future integrations (issue tracker, chat, AI platform, portal) are **not** required by this standard.
""",
)

add(
    "governance-versioning.md",
    "Governance Versioning",
    """
| Track | Meaning |
| --- | --- |
| **Documentation Standard Version** | Methodology version (now v1.0) |
| **Governance Version** | Optional project label for local gate/policy packs |

Breaking documentation changes include: mandatory metadata changes, ID scheme breaks, relationship semantic changes, SoT/authority model breaks.

See [versioning.md](versioning.md) and [migration-policy.md](migration-policy.md).
""",
)

add(
    "migration-policy.md",
    "Documentation Standard Migration Policy",
    """
```text
New Standard → Compatibility Analysis → Migration Plan → Migration → Validation → Review
```

1. Compare versions in [versioning.md](versioning.md).
2. List breaking vs additive changes.
3. Update manifests, metadata, and gates.
4. Run `docs:validate`.
5. Resolve ERROR; track WARNING as debt/exceptions.
6. Human review for Authoritative docs.
""",
)

add(
    "governance-review.md",
    "Governance Review Cycle",
    """
The standard and its gates must be reviewed periodically (event-driven preferred).

Evaluate:

- useless or excessive rules;
- false positives;
- redundant docs;
- broken automations;
- gaps and new needs.

Outcomes: keep, tune severity, disable with exception, or replace rule.
""",
)

add(
    "false-positives.md",
    "False Positive Management",
    """
Automation findings that are not real problems must not be ignored.

For each false positive:

```text
Fix Rule  OR  Document Exception
```

Record in [exceptions/](exceptions/) with rule id, reason, owner, and expiration when temporary.
""",
)

add(
    "automation-metrics.md",
    "Automation Metrics",
    """
Suggested metrics (adopt only if actionable):

| Metric | Purpose |
| --- | --- |
| Validation runs | Ensure gates run |
| Validation failures | Detect quality regressions |
| Warnings | Track debt pressure |
| Open / expired exceptions | Governance hygiene |
| Stale documents | Freshness pressure |
| Broken references | Navigability |
| Missing ownership | Accountability |
| Missing evidence | Claim quality |
| Documentation coverage | Scope honesty |

Do not create vanity metrics.
""",
)

add(
    "governance-metrics.md",
    "Governance Metrics",
    """
| Metric | Purpose |
| --- | --- |
| Review compliance | Were required reviews done? |
| Exception aging | Are waivers stale? |
| Documentation freshness | Event-driven reviews happening? |
| Ownership coverage | Authoritative docs owned? |
| Validation failure rate | Gate effectiveness |
| Unresolved contradictions | Integrity risk |
| Unresolved knowledge gaps | Uncertainty inventory |

Prefer event-driven review over universal SLAs ([documentation-freshness.md](documentation-freshness.md)).
""",
)

# Policies (thin)
add(
    "policies/documentation-policy.md",
    "Policy: Documentation",
    """
Normative references (do not duplicate):

- [../principles.md](../principles.md)
- [../standards.md](../standards.md)
- [../lifecycle.md](../lifecycle.md)
- [../governance.md](../governance.md)
- [../documentation-change-policy.md](../documentation-change-policy.md)
""",
)

add(
    "policies/security-documentation-policy.md",
    "Policy: Security Documentation",
    """
Normative references:

- [../security-model.md](../security-model.md)
- [../security-checklist.md](../security-checklist.md)
- [../exceptions.md](../exceptions.md) (documentation exceptions)
- [../security/](../security/)
""",
)

add(
    "policies/architecture-documentation-policy.md",
    "Policy: Architecture Documentation",
    """
Normative references:

- [../architecture-model.md](../architecture-model.md)
- [../architecture-checklist.md](../architecture-checklist.md)
- [../architecture/](../architecture/)
""",
)

add(
    "policies/ai-documentation-policy.md",
    "Policy: AI Documentation",
    """
Normative references:

- [../ai-context.md](../ai-context.md)
- [../ai-ready-model.md](../ai-ready-model.md)
- [../ai-navigation.md](../ai-navigation.md)
- [../ai-answering-rules.md](../ai-answering-rules.md)
- [../ai-task-boundaries.md](../ai-task-boundaries.md)
- [../ai-documentation-validation.md](../ai-documentation-validation.md)
""",
)


def write_en() -> None:
    for rel, content in DOCS.items():
        path = EN / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        print("wrote", path.relative_to(ROOT))


if __name__ == "__main__":
    write_en()
