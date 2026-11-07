# Versioning the Documentation Standard

> Language: EN | [Português (pt-BR)](../pt-BR/versioning.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

This document defines how **this documentation standard** is versioned, and how adopting projects may version **individual document content**.

It does not define how adopting projects version their own software.

## Current Version

```text
Documentation Standard v1.0
```

Declare the version in the root README and in major standard documents when the version changes.

## Version Format

```text
vMAJOR.MINOR[.PATCH]
```

| Part | Meaning |
| --- | --- |
| MAJOR | Breaking changes to structure or mandatory conventions |
| MINOR | Backward-compatible additions |
| PATCH | Clarifications, typo fixes, non-breaking wording improvements |

## When to Bump

### Patch

Increase PATCH when the change:

- clarifies existing rules without changing meaning;
- fixes typos or broken links;
- improves examples without changing required structure;
- makes non-breaking template wording improvements.

Examples:

- Fix a broken relative link.
- Clarify the meaning of `Unknown` without changing allowed values.

### Minor

Increase MINOR when the change:

- adds an optional template;
- adds an optional category or guidance document;
- extends a template with optional sections;
- adds recommended (not mandatory) conventions;
- expands bilingual coverage without breaking existing paths;
- adds lifecycle governance docs without changing the five status tokens incompatibly;
- adds architecture methodology guidance (model, diagrams, drift, debt) without making all architecture docs mandatory;
- adds technical contracts methodology without making every contract section mandatory for every project;
- adds operations and reliability methodology without making every ops section mandatory for every project;
- adds security methodology without making every security section mandatory for every project;
- adds AI-ready documentation methodology (context, claims, relationships, navigation) without requiring RAG, embeddings, or agent runtimes;
- adds governance and in-repo automation (validation, quality gates, exceptions) without requiring external SaaS or platforms.

Examples:

- Add a new optional `disaster-recovery` template.
- Add guidance for changelog documentation.
- Add optional ownership, review, debt, or archive policy docs.
- Add architecture, contracts, operations, security, AI-ready, or governance methodology without making every section mandatory.

### Included in v1.0

This first official release already includes:

- lifecycle governance (status, ownership, review, change, debt, archive);
- architecture methodology with progressive disclosure;
- technical contracts methodology;
- operations and reliability methodology;
- security methodology;
- AI-ready documentation methodology;
- in-repo automation and governance (validation, quality gates, exceptions).

### Major

Increase MAJOR when the change:

- renames or removes mandatory sections in a way that breaks existing adopters;
- changes status values or classification vocabulary incompatibly;
- redefines the required repository structure;
- changes adoption rules so existing compliant docs become non-compliant.

Examples:

- Replace status `REVIEW` with `IN_REVIEW` without aliasing.
- Make a previously optional category mandatory for all projects.

## Compatibility Expectations

| Change type | Adopter expectation |
| --- | --- |
| Patch | No action required |
| Minor | Optional adoption of new capabilities |
| Major | Migration notes required; adopters should plan updates |

## Document Content Versioning

Separate from versioning **this standard**: adopting projects may version the content of individual documents.

Use semantic-style bumps on a per-document `version` field when it helps consumers:

| Bump | Use when the document change… |
| --- | --- |
| **PATCH** | Clarifies wording, fixes typos/links, no semantic change to guidance or contracts |
| **MINOR** | Adds backward-compatible sections, optional guidance, or non-breaking detail |
| **MAJOR** | Breaks prior understanding: incompatible contract/ops guidance, removed mandatory behavior, replaced architecture story |

Rules:

- Document content versioning is optional; `updated` (date) remains the minimum freshness signal.
- Do not confuse document `version` with `Documentation Standard vX.Y`.
- Do not use version bumps as a substitute for lifecycle status (`DRAFT` / `REVIEW` / `ACCEPTED` / `DEPRECATED` / `ARCHIVED`).
- Contract identifiers (for example `order-created@v2`) remain the contract's own versioning scheme.

Example metadata:

```yaml
---
title: Send Notification Contract
status: ACCEPTED
owner: notifications-squad
updated: 2026-08-07
version: "2.1.0"
---
```

For human-oriented change summaries, see [changelog-policy.md](changelog-policy.md).

## Release Practices

1. Update `Documentation Standard vX.Y` references in root `README.md` and in `docs/en/README.md` / `docs/pt-BR/README.md`.
2. Summarize changes in the pull request (and a changelog entry when useful — [changelog-policy.md](changelog-policy.md)).
3. For MAJOR changes, include migration guidance:
 - what broke;
 - what to rename/move;
 - what remains valid.

## Out of Scope

This policy does not version:

- fictional examples as independently versioned products;
- external tools used to render Markdown.

Examples in `examples/` should track the standard version conceptually, but do not require independent semantic versions.

## Related Documents

- [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
- [../../README.md](../../README.md)
- [standards.md](standards.md)
- [language.md](language.md)
- [changelog-policy.md](changelog-policy.md)
- [lifecycle.md](lifecycle.md)
- [architecture-model.md](architecture-model.md)
- [contract-model.md](contract-model.md)
- [contracts/README.md](contracts/README.md)
- [operations-model.md](operations-model.md)
- [operations/README.md](operations/README.md)
- [security-model.md](security-model.md)
- [security/README.md](security/README.md)
- [ai-ready-model.md](ai-ready-model.md)
- [ai-context.md](ai-context.md)
- [governance.md](governance.md)
- [automation.md](automation.md)
- [migration-policy.md](migration-policy.md)
