# Documentation Standards

> Language: EN | [Português (pt-BR)](../pt-BR/standards.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0

Conventions for structure, formatting, naming, status, classification, metadata, document IDs, references, diagrams, contracts, operations, security, and AI-ready documentation.

## Heading Hierarchy

Use a consistent hierarchy. Do not skip levels arbitrarily.

```text
# Document

## Section

### Subsection

#### Detail
```

Rules:

- One `#` title per document.
- Sections start at `##`.
- Use `###` and `####` only for nested detail.
- Prefer shallow structure; split into another document when depth grows.

## Titles

- Titles must be specific and scannable.
- Prefer noun phrases: `Payment Authorization Flow`, not `How we do payments`.
- Template-based documents may keep the template title pattern (for example `ADR-001 — Prefer Asynchronous Boundaries`).

## Tables

Use tables for structured comparisons, inventories, and matrices.

| Prefer tables for | Prefer lists for |
| --- | --- |
| Inventories | Sequences of steps |
| Status matrices | Short unordered facts |
| Comparisons | Nested hierarchies |

Every table should have a header row.

## Lists

- Use ordered lists for procedures and sequences.
- Use unordered lists for unordered sets.
- Keep list items parallel in grammar.
- Avoid deeply nested lists; restructure instead.

## Code

- Use fenced code blocks with a language tag when applicable.
- Keep examples minimal and relevant.
- Never include secret values in examples.
- Prefer placeholders such as `<API_KEY>` or `$API_KEY`.

## Diagrams

- Prefer text-versionable formats.
- Use Mermaid when appropriate.
- Create a diagram only when it improves understanding.
- Keep diagrams aligned with current state unless labeled Proposed.

See [templates/diagram.md](templates/diagram.md).

## References and Links

References must help the reader find the origin of information.

| Reference type | Preferred form |
| --- | --- |
| Another doc (same tree) | Relative Markdown link: `[Architecture](architecture/README.md)` — sync rewrites to Confluence page URLs |
| Another GitHub repository | Short `org/repo` link once, then path + `blob` URLs for files — [publishing-surfaces.md](publishing-surfaces.md) |
| Source / config file (cite) | Repository-relative path **and** GitHub `blob` URL (optional `#Lstart-Lend`) |
| Module | Module path or package name used by the project |
| Configuration | Path + key name (never the secret value) + blob link when citing |
| Infrastructure | Path to IaC/manifest or named resource identifier + blob link when citing |
| Ticket | Full tracker URL or stable ticket ID |
| ADR | `ADR-XXX` plus link to the ADR file |
| Contract | Link to the canonical contract document |

Documents published to Confluence must remain navigable on **both** surfaces: Confluence page links (via `docs-sync --relink`) and GitHub source / code links (`repository_url` footer + explicit blob citations). Full rules: [publishing-surfaces.md](publishing-surfaces.md).

Avoid vague references such as:

> This is configured somewhere else.

Prefer:

> Retry policy is defined in `docs/contracts/order-created.md` under **Retry Behavior**.

## Naming Conventions

| Artifact | Convention | Example |
| --- | --- | --- |
| Directories | `kebab-case` | `event-driven-service` |
| Markdown files | `kebab-case.md` | `project-overview.md` |
| ADRs | `adr-XXX-short-title.md` | `adr-001-use-async-boundary.md` |
| Templates | descriptive `kebab-case` | `runbook.md` |
| Diagram titles | descriptive, current-state oriented | `Checkout request flow` |

Avoid spaces in file names.

## Dates

- Use ISO 8601: `YYYY-MM-DD`.
- Example: `2026-08-07`.

## Versions

- Document the standard version as `Documentation Standard vMAJOR.MINOR` (and `.PATCH` when needed).
- Project docs may include content versioning and `updated` / `review_date` fields.
- Contract and API versioning belong in contract documents, not only in prose.

See [versioning.md](versioning.md).

## Document IDs

Substantive documents should carry a stable `id` in YAML frontmatter (for example `ARCH-001`, `CONTRACT-001`, `OPS-001`, `SEC-001`).

| Rule | Guidance |
| --- | --- |
| Stability | IDs do not change when titles or paths change |
| Uniqueness | Unique within the project; do not recycle after deprecation |
| Schemes | Follow [document-identity.md](document-identity.md); preserve existing ADR/runbook/incident conventions |
| Canonical names | Pair IDs with canonical names ([style-guide.md](style-guide.md)) |

Component and service IDs (`CMP-XXX`, `SVC-XXX`, or stable project names) belong in registries as well as component docs.

## Document Metadata

Substantive project docs should declare metadata in YAML frontmatter.

**Canonical field catalog (Required / Recommended / Optional), including `id`, `type`, `source`, `classification`, and review fields:** see [document-metadata.md](document-metadata.md).

Minimum required for substantive docs (overview, architecture, contracts, runbooks, security, observability, and ADRs when applicable):

| Field | Type | Meaning |
| --- | --- | --- |
| `title` | string | Document title |
| `status` | enum | `DRAFT` \| `REVIEW` \| `ACCEPTED` \| `DEPRECATED` \| `ARCHIVED` |
| `owner` | string | Stable team, squad, or role |
| `updated` | date | Last meaningful content update (`YYYY-MM-DD`) |

Strongly recommended for AI-ready / inventoriable docs:

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Stable document identity ([document-identity.md](document-identity.md)) |
| `type` | string | Document type token ([document-types.md](document-types.md)) |
| `created` | date | Creation date |

Optional (see full list in [document-metadata.md](document-metadata.md)):

| Field | Type | Meaning |
| --- | --- | --- |
| `review_date` | date | Last review date when tracked |
| `version` | string | Document content version (see [versioning.md](versioning.md)) |
| `source` | string / list | Authoritative origin(s) |
| `classification` | string | Default claim classification when useful |
| `authority` | string | Authority level ([authority-levels.md](authority-levels.md)) |
| `replaced_by` | string | Successor path or link when deprecated |
| `deprecated_on` | date | Deprecation date |
| `deprecation_reason` | string | Why the document was deprecated |
| `reviewers` | list/string | Usual reviewers |
| `approver` | string | Approver role/person when used |
| `classification_default` | string | Alias/legacy name for default classification when useful |

Example:

```yaml
---
id: ARCH-001
title: Checkout Architecture
type: Architecture
status: ACCEPTED
owner: platform-team
updated: 2026-08-07
created: 2026-01-10
review_date: 2026-08-07
version: "1.2.0"
---
```

### Language cross-link and Status blockquote

Place the Language cross-link blockquote **after** frontmatter (or use both patterns carefully):

```markdown
---
id: ARCH-001
title: Checkout Architecture
status: ACCEPTED
owner: platform-team
updated: 2026-08-07
---

# Checkout Architecture

> Language: EN | [Português (pt-BR)](../pt-BR/architecture/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
```

Rules:

- Prefer YAML `status` for templates and substantive docs.
- Blockquote `> Status:` remains allowed for short docs and for human-scannable headers.
- When both exist, YAML `status` is authoritative; keep them consistent.
- Do not invent status tokens. Lifecycle details: [lifecycle.md](lifecycle.md), [status.md](status.md).

## Document Status

Allowed values (English machine tokens only):

| Status | Meaning |
| --- | --- |
| `DRAFT` | Work in progress |
| `REVIEW` | Ready for or under review |
| `ACCEPTED` | Approved current documentation |
| `DEPRECATED` | Superseded or no longer recommended |
| `ARCHIVED` | Historical only |

`UPDATED` is not a stored status. Relevant changes use `ACCEPTED → REVIEW → ACCEPTED`.

Full lifecycle, transitions, ownership, and deprecation/archive rules:

- [lifecycle.md](lifecycle.md)
- [status.md](status.md)
- [ownership.md](ownership.md)
- [deprecation.md](deprecation.md)
- [archive-policy.md](archive-policy.md)
- [contract-lifecycle.md](contract-lifecycle.md) — contracts use the same tokens; no parallel lifecycle

## Information Classification

Classify statements when certainty matters — especially for AI-generated content.

| Classification | Meaning | When to use |
| --- | --- | --- |
| **Confirmed** | Verified against an authoritative source | Code, config, contract, test, or accepted ADR supports the claim |
| **Inferred** | Deduced from evidence, not explicitly stated | Reasonable conclusion from multiple signals |
| **Unknown** | Not identified | Missing evidence; do not invent |
| **Proposed** | Suggestion or future state | Roadmap, candidate design, not current behavior |

Recommended inline form:

```markdown
- Retry limit is 3. <!-- Classification: Confirmed -->
- Message ordering appears FIFO per partition. <!-- Classification: Inferred -->
- Multi-region failover strategy: Unknown.
- Move to event sourcing. <!-- Classification: Proposed -->
```

Alternative section-level form:

```markdown
## Failure Handling

Classification: Inferred

...
```

Rules:

- Default new uncertain content to Unknown, not Confirmed.
- Never present Proposed as current state.
- Prefer Confirmed for operational and security claims before ACCEPTED status.

## Identifiers

| Identifier | Format | Example |
| --- | --- | --- |
| ADR | `ADR-XXX` | `ADR-012` |
| Runbook | short kebab or ticket-aligned ID | `rb-checkout-timeout` |
| Incident | project scheme; recommend dated id | `INC-20260807-01` |
| Alert | short kebab or monitoring-system id | `alert-checkout-error-rate` |
| Failure mode | short kebab id | `fm-payment-timeout` |
| Contract | stable name + version | `order-created@v1` |
| Component | project-local stable name | `checkout-api` |
| Service | project-local stable name | `checkout-api` |
| Threat | `THR-XXX` or short kebab | `THR-012`, `threat-token-theft` |
| Security risk | `RISK-XXX` | `RISK-007` |
| Security control | `CTRL-XXX` | `CTRL-015` |
| Security requirement | `REQ-SEC-XXX` or project scheme | `REQ-SEC-003` |
| Vulnerability | `VULN-XXX` | `VULN-042` |
| Security exception | `EXC-XXX` | `EXC-004` |
| Security asset | `AST-XXX` | `AST-011` |
| Security evidence | `EVD-<topic>-<YYYYMMDD>` | `EVD-authn-review-20260807` |
| Security test | `SECTEST-XXX` | `SECTEST-002` |

Use stable identifiers in links and cross-references.

## Operations Conventions

Operations and reliability docs follow [operations-model.md](operations-model.md) and [operations/README.md](operations/README.md). Conventions below are defaults — projects may adapt when they already have a clearer local scheme.

### Runbook IDs

| Concern | Convention |
| --- | --- |
| ID | `rb-<short-name>` in frontmatter (`runbook_id`) and filename when useful |
| Severity | Optional frontmatter `severity` using the project model (e.g. `SEV-1` … `SEV-4`) — [incident-severity.md](incident-severity.md) |
| Safety | Destructive/irreversible steps called out before execution; no invented commands |

### Incident IDs

| Concern | Convention |
| --- | --- |
| ID | Stable unique id (example: `INC-YYYYMMDD-NN`) |
| Severity | Declare the project model; do not auto-classify without context |
| Timestamps | ISO-8601 with timezone or explicit UTC (`2026-08-07T15:04:05Z`) |
| Timeline entries | Tag `FACT` / `HYPOTHESIS` / `CONFIRMED` / `UNKNOWN` — [incident-timeline.md](incident-timeline.md) |
| Root cause | May remain **Unknown** while the incident is open |

### Criticality

Use the project criticality vocabulary ([criticality.md](criticality.md)). Example levels: `Critical` / `High` / `Medium` / `Low`. Do not invent criticality for a service without evidence or owner agreement.

### Operational state

Prefer: `Healthy` / `Degraded` / `Unavailable` / `Recovering` / `Maintenance` / `Unknown` — [operational-state.md](operational-state.md).

### Metrics naming

| Concern | Convention |
| --- | --- |
| Stability | Prefer stable, scannable names already used by the project’s telemetry |
| Definition | Document formula/event set when the metric is an SLI or decision driver |
| Ambiguity | For MTTR/MTTD/MTBF, document clock start/end — [reliability-metrics.md](reliability-metrics.md) |
| Secrets / PII | Never document secret values; avoid unnecessary PII in metric label examples |

### Ops references

| Reference | Preferred form |
| --- | --- |
| Runbook | Runbook ID + relative link |
| Alert | Alert name/ID + link to runbook |
| Incident | Incident ID + link |
| SLO / SLI | Stable name + link to definition |
| Architecture / contract | Link — do not duplicate component or schema prose |

## Security Conventions

Security docs follow [security-model.md](security-model.md) and [security/README.md](security/README.md). Conventions below are defaults — projects may adapt when they already have a clearer local scheme.

### Security entity IDs

| Entity | Convention | Example |
| --- | --- | --- |
| Threat | `THR-XXX` | `THR-012` |
| Risk | `RISK-XXX` | `RISK-007` |
| Control | `CTRL-XXX` | `CTRL-015` |
| Vulnerability | `VULN-XXX` | `VULN-042` |
| Exception | `EXC-XXX` | `EXC-004` |
| Asset | `AST-XXX` | `AST-011` |
| Evidence | `EVD-<topic>-<YYYYMMDD>` | `EVD-authn-review-20260807` |
| Security incident | Prefer project incident id; optional `SEC-` prefix or Type field | `INC-20260807-01` (Type: Security) |
| Security debt | `SECDEBT-XXX` | `SECDEBT-014` |
| Security drift | `SEC-DRIFT-XXX` | `SEC-DRIFT-003` |

### Severity

Use the project severity model for vulnerabilities and security incidents. Do **not** auto-assign severity from a tool score alone without asset exposure and compensating-control context. When unknown: **Not Defined**.

Operational SEV examples remain in [incident-severity.md](incident-severity.md). Security incidents may reuse that model with Type = Security / Both — [security-incidents.md](security-incidents.md).

### Status (security entities)

Prefer explicit status vocabularies documented in the entity's methodology (vulnerability, exception, risk). Common tokens: `Open` / `In Progress` / `Resolved` / `Accepted Risk` / `Closed`. Do not invent document lifecycle tokens beyond the five standard statuses.

### Ownership

Every substantive security artifact (asset, risk, control, vulnerability, exception, incident) should name an **owner** (team/squad/role). See [security-ownership.md](security-ownership.md) and [ownership.md](ownership.md).

### Evidence naming

| Concern | Convention |
| --- | --- |
| ID | `EVD-<short-topic>-<YYYYMMDD>` when useful |
| Location | Path, system name, or ticket — never secret values |
| Integrity | Note authenticity/integrity expectations or **Not Defined** — [security-evidence.md](security-evidence.md) |
| Linkage | Evidence must reference the control/requirement/risk/incident it supports |

### Security references

| Reference | Preferred form |
| --- | --- |
| Threat / risk / control | ID + relative link |
| Vulnerability | `VULN-XXX` + link |
| Exception | `EXC-XXX` + link (include expiration in the record) |
| Evidence | `EVD-…` or location + linked entity |
| Architecture / contract | Link — do not duplicate diagrams or schemas |
| Ops runbook / alert | Link shared mechanism once — [operations-security.md](operations-security.md) |

## Contract Conventions

Technical contracts follow [contract-model.md](contract-model.md) and the methodology under [contracts/README.md](contracts/README.md). Naming and metadata below are conventions — projects may adapt when they already have a clearer local scheme.

### Contract naming

Prefer predictable, scannable file and contract names in `kebab-case`.

Example pattern (not mandatory):

```text
<domain>-<capability>-<contract-type>
```

Examples: `orders-create-api`, `inventory-adjusted-event`, `billing-export-file`.

Do **not** force this pattern when the project already has a stable, discoverable convention. Keep names stable once published.

### Contract IDs and versions

| Concern | Convention |
| --- | --- |
| Contract ID | Stable name + version: `order-created@v1` |
| File name | Often matches the stable name: `order-created.md` (version in metadata and/or path) |
| Version bump | Follow [contract-versioning.md](contract-versioning.md); distinct from Documentation Standard version |

### Contract references

| Reference | Preferred form |
| --- | --- |
| From architecture / component | Link to canonical contract doc |
| From other contracts | Relative Markdown link + contract ID |
| From code comments / ADRs | Contract ID (`order-created@v1`) plus link when possible |

Avoid pasting full schemas into architecture docs; link instead.

### Schemas

- Document fields with meaning ([schema-documentation.md](schema-documentation.md)).
- Declare Source of Truth when both Markdown and machine schemas exist ([contract-source-of-truth.md](contract-source-of-truth.md)).
- Do not assume a schema language (JSON Schema, Protobuf, Avro, etc.).

### Contract status and ownership

- Status tokens are the same five: `DRAFT` \| `REVIEW` \| `ACCEPTED` \| `DEPRECATED` \| `ARCHIVED`.
- `owner` is the **contract owner** (required for substantive contracts).
- Producer and consumer owners may differ — [contract-ownership.md](contract-ownership.md).

### Contract metadata fields

In addition to standard document metadata, contracts may declare:

| Field | Required? | Meaning |
| --- | --- | --- |
| `title` | Required | Contract title |
| `status` | Required | Lifecycle status |
| `owner` | Required | Contract owner (team/squad/role) |
| `updated` | Required | Last meaningful update |
| `version` | Recommended | Contract or document version string |
| `contract_type` | Recommended | `API` \| `Event` \| `Message` \| `File` \| `Command` \| `Callback` \| `Library` \| `Data` \| `Integration` (or project list; multiple allowed) |
| `protocol` | Optional | Actual interaction protocol/transport — **not** assumed to be HTTP |
| `producer` | Recommended when known | Producing system/component |
| `consumer` | Optional | Primary consumer, list, or "multiple / see Participants"; mark Unknown if not identified |
| `created` | Optional | Creation date |
| `contract_id` | Optional | Explicit id when distinct from title/filename (for example `order-created@v1`) |

Example:

```yaml
---
title: Order Accepted Event
status: ACCEPTED
owner: orders-squad
updated: 2026-08-07
version: "1.0"
contract_type: Event
protocol: "async-message"   # project-specific; not a standard requirement
producer: order-service
consumer: fulfillment-worker
contract_id: "order-accepted@v1"
---
```

Rules:

- `protocol` records what the project uses; absence is fine when Not Applicable.
- Do not invent producers/consumers; use Unknown.
- Multiple `contract_type` values may be listed when types overlap ([contract-types.md](contract-types.md)).

## Document Security

Documentation must **not** store:

- passwords;
- API keys;
- access tokens;
- private keys;
- credentials;
- secrets;
- unnecessary sensitive data.

When a sensitive configuration must be documented, record only:

```text
Configuration name
Purpose
Source
Required: yes/no
```

Never record the secret value.

Also avoid copying production hostnames, account IDs, or personal data unless required and approved by project policy.

## Language

This standard is bilingual (EN and pt-BR). See [language.md](language.md).

Rules summary:

- mirrored paths under `docs/en/` and `docs/pt-BR/`;
- mandatory cross-language link at the top of each document;
- Status, Classification, and technical identifiers stay in English;
- narrative content is translated.

## Related Documents

- [principles.md](principles.md)
- [style-guide.md](style-guide.md)
- [publishing-surfaces.md](publishing-surfaces.md)
- [document-metadata.md](document-metadata.md)
- [document-identity.md](document-identity.md)
- [document-types.md](document-types.md)
- [ai-context.md](ai-context.md)
- [ai-documentation.md](ai-documentation.md)
- [language.md](language.md)
- [lifecycle.md](lifecycle.md)
- [status.md](status.md)
- [ownership.md](ownership.md)
- [review-policy.md](review-policy.md)
- [change-policy.md](change-policy.md)
- [documentation-debt.md](documentation-debt.md)
- [stale-documentation.md](stale-documentation.md)
- [deprecation.md](deprecation.md)
- [archive-policy.md](archive-policy.md)
- [changelog-policy.md](changelog-policy.md)
- [quality-model.md](quality-model.md)
- [versioning.md](versioning.md)
- [contract-model.md](contract-model.md)
- [contracts/README.md](contracts/README.md)
- [templates/diagram.md](templates/diagram.md)
- [templates/contract.md](templates/contract.md)
- [operations-model.md](operations-model.md)
- [operations/README.md](operations/README.md)
- [templates/runbook.md](templates/runbook.md)
- [security-model.md](security-model.md)
- [security/README.md](security/README.md)
- [templates/security.md](templates/security.md)
