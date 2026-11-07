# Documentation Principles

> Language: EN | [Português (pt-BR)](../pt-BR/principles.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

## Central Principle

Documentation is part of the engineering product.

It is not a secondary or optional artifact.

Adequate documentation must allow someone who has never worked on the project to understand:

- why the project exists;
- which problem it solves;
- how it works;
- which components it has;
- how components relate;
- which dependencies it has;
- how to use it;
- how to operate it;
- how to modify it;
- which risks exist;
- which architectural decisions were made.

Documentation must also be structured enough for **AI agents to use it as reliable context**.

---

## 1. Documentation as Code

Documentation must:

- live with the code;
- be versioned;
- go through review;
- retain history;
- follow standards;
- be updated together with relevant changes.

Treat documentation pull requests with the same rigor applied to code changes that affect understanding, operation, or integration.

---

## 2. Single Source of Truth

Avoid unnecessary duplication.

When information has an official source, other documents must reference it instead of copying it.

Example:

```text
API Contract
     ↑
     │
Architecture
     │
Runbook
```

Do not replicate the same contract across multiple documents. Link to the canonical contract and describe only the perspective needed by the current document.

---

## 3. Current State First

Documentation must clearly distinguish:

| Kind | Meaning |
| --- | --- |
| Current state | What exists and behaves today |
| Inferred behavior | Deduced from evidence, not yet confirmed as design intent |
| Decisions | Choices recorded (usually via ADRs) |
| Limitations | Known constraints of the current system |
| Future proposals | Desired or planned state |

A desired architecture must never be presented as an existing architecture.

---

## 4. Evidence-Based Documentation

Whenever possible, technical statements must have evidence.

Examples of evidence:

- file;
- module;
- configuration;
- code;
- infrastructure definition;
- test;
- contract;
- ADR.

Avoid unsupported claims. If evidence is missing, mark the information as Unknown or Inferred.

---

## 5. Technology-Agnostic Structure

The documentation structure is independent of technology.

Do not assume as universal requirements:

- cloud provider;
- language;
- framework;
- database;
- container runtime;
- Kubernetes;
- serverless;
- a specific architecture style.

The structure must adapt to the project. Technology appears in project content, not as a mandatory shape of the standard.

---

## 6. Documentation for Humans and AI

Documentation must be:

- readable by humans;
- structured for machines;
- consistent;
- semantically clear;
- predictable;
- modular.

Prefer tables, lists, and explicit structures over long narrative text when narrative reduces scannability or verifiability.

---

## 7. Documentation Near the Source

When information depends directly on a specific component, keep it close to that component's documentation.

Avoid a single giant document that attempts to describe the entire system in one place.

Use an overview document for navigation and component-level documents for detail.

---

## 8. Explicit Unknowns

When information is unavailable, do not invent it.

Use an explicit marker, for example:

> Not identified.

or:

> Information not yet documented.

For structured classification, use Unknown (see [standards.md](standards.md)).

---

## 9. Documentation Lifecycle

Documentation has an explicit lifecycle. Durable status tokens are:

```text
DRAFT → REVIEW → ACCEPTED → DEPRECATED → ARCHIVED
```

Material updates to an `ACCEPTED` document follow the update cycle `ACCEPTED → REVIEW → ACCEPTED` (sometimes called "UPDATED" in conversation — not a stored status token).

| Status | Meaning |
| --- | --- |
| `DRAFT` | Work in progress; may be incomplete |
| `REVIEW` | Ready for or under review |
| `ACCEPTED` | Approved as current guidance or description |
| `DEPRECATED` | Still visible, but superseded or no longer primary |
| `ARCHIVED` | Retained for history; not active guidance |

Document status and ownership must be visible near the top of each substantive document (YAML frontmatter preferred). See [lifecycle.md](lifecycle.md), [status.md](status.md), and [standards.md](standards.md).

---

## AI-Ready Principles

These ten principles extend the foundation above for Documentation Standard v1.0. They govern how documentation must behave as **AI context** — not how to build RAG, embeddings, or agents.

### AR-1. Documentation Is Context

Documentation is the primary structured context for AI consumers. Write so an agent can locate scope, facts, and limits without tribal knowledge.

### AR-2. Stable Identity and Canonical Names

Every substantive document, component, and service has a stable ID and one canonical name. Synonyms and nicknames must map back to the canonical form ([style-guide.md](style-guide.md), [document-identity.md](document-identity.md)).

### AR-3. Structure Over Ambiguous Narrative

Prefer tables, inventories, typed fields, and explicit enums over long prose that buries facts. Narrative explains; structure carries truth ([machine-readable.md](machine-readable.md)).

### AR-4. Evidence-Bound Claims

Material technical statements are claims with classification and evidence. Never treat Inferred as Confirmed; never present Proposed as current ([claims.md](claims.md), [evidence-model.md](evidence-model.md)).

### AR-5. Explicit Relationships

Connections between documents and components use a controlled relationship vocabulary. Do not rely on implied “related somehow” prose alone ([document-relationships.md](document-relationships.md)).

### AR-6. Progressive Context

Load context by question and depth. Start at [ai-context.md](ai-context.md) and escalate levels only as needed ([progressive-context.md](progressive-context.md)).

### AR-7. Honest Uncertainty

Unknowns, assumptions, gaps, and contradictions are recorded explicitly. Incomplete accurate documentation beats complete invented documentation ([knowledge-gaps.md](knowledge-gaps.md), [contradiction-model.md](contradiction-model.md)).

### AR-8. AI Without Authority

AI may perform Discovery, Analysis, Validation, Generation, and Maintenance of drafts. AI does **not** own acceptance, ownership reassignment, or silent supersession of Authoritative sources ([lifecycle.md](lifecycle.md), [ai-task-boundaries.md](ai-task-boundaries.md)).

### AR-9. Context Integrity

Do not mix systems, environments, or eras in one undifferentiated answer. Keep Confirmed distinct from Proposed; keep Historical labeled; preserve source-of-truth boundaries ([source-of-truth.md](source-of-truth.md)).

### AR-10. Safe Context

Never embed secret values or unnecessary sensitive data in documentation or AI outputs. Reference secrets by name and source only; redact with `[REDACTED]` when needed ([ai-context-safety.md](ai-context-safety.md)).

---

## Governance Principles

These ten principles extend the foundation for Documentation Standard v1.0. They govern how documentation quality is **enforced** — not how to build SaaS portals or external platforms.

### GV-1. Explicit Ownership

Documentation ownership must be explicit for Authoritative and operationally critical documents ([documentation-ownership.md](documentation-ownership.md)).

### GV-2. Authoritative Accountability

Authoritative documentation requires a named accountable owner and change control ([source-of-truth.md](source-of-truth.md), [governance.md](governance.md)).

### GV-3. Automatable Objective Rules

Automated validation should enforce objective rules (metadata, IDs, links, manifest) ([automation.md](automation.md)).

### GV-4. Human Semantic Decisions

Human review should handle semantic decisions: architecture truth, security adequacy, evidence strength, contradiction resolution.

### GV-5. Explicit Exceptions

Exceptions must be explicit, owned, and time-bounded when temporary ([exceptions.md](exceptions.md)).

### GV-6. Traceable Changes

Changes must be traceable via Git, PR checks, and change records when material ([governance-auditability.md](governance-auditability.md)).

### GV-7. Distinguish Deprecated

Deprecated documentation must remain distinguishable from current guidance ([history-model.md](history-model.md)).

### GV-8. No Silent Authoritative Edits

Automation must not silently change Authoritative knowledge. AI proposals require human acceptance ([ai-task-boundaries.md](ai-task-boundaries.md)).

### GV-9. Documented Governance

Governance rules must themselves be documented and versioned ([governance-versioning.md](governance-versioning.md)).

### GV-10. Quality Gates

Quality gates should prevent known documentation failures from merging when ERROR severity applies ([quality-gates.md](quality-gates.md)).

---

## Related Documents

- [standards.md](standards.md)
- [lifecycle.md](lifecycle.md)
- [status.md](status.md)
- [ownership.md](ownership.md)
- [style-guide.md](style-guide.md)
- [ai-context.md](ai-context.md)
- [ai-ready-model.md](ai-ready-model.md)
- [ai-documentation.md](ai-documentation.md)
- [governance.md](governance.md)
- [automation.md](automation.md)
- [documentation-checklist.md](documentation-checklist.md)
- [language.md](language.md)
- [quality-model.md](quality-model.md)
