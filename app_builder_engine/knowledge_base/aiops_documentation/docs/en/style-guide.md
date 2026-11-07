# Style Guide

> Language: EN | [Português (pt-BR)](../pt-BR/style-guide.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0

How to write documentation under this standard.

## Goals

Documentation must be:

- objective;
- technical;
- clear;
- consistent;
- verifiable;
- free of unnecessary marketing language.

## Writing Rules

### Be direct

State the fact, then provide evidence or reference.

Prefer:

> The worker processes `order.created` events and writes acknowledgements to the `order-ack` stream.

Avoid:

> This amazing component seamlessly empowers our event-driven journey.

### Prefer structure over narrative

Prefer:

- tables;
- lists;
- diagrams;
- examples;
- references;
- predictable section layouts.

Use short paragraphs when explanation is necessary. Avoid long blocks of prose.

### One idea per section

Each section should answer one question. If a section mixes purpose, operation, and history, split it.

### Use precise language

| Avoid | Prefer |
| --- | --- |
| "fast", "scalable", "robust" without metrics | measurable statements or explicit trade-offs |
| "usually", "sometimes" without conditions | conditions and known cases |
| "etc." that hides important items | complete lists or "not identified" |
| "legacy" without definition | what is constrained and why |

### Keep terminology consistent

- Reuse the same component and contract names across documents.
- Do not invent synonyms for the same concept.
- Preserve existing project nomenclature; do not rename in docs only.

### Canonical names

Every component, service, contract, and other named engineering artifact must have **one canonical name** used in titles, registries, manifests, and cross-references.

| Rule | Guidance |
| --- | --- |
| One canonical form | Prefer the registry / SoT spelling (`checkout-api`, not “Checkout API svc”) |
| Stable IDs | Pair the name with a stable ID when substantive (`CMP-001`, `CONTRACT-001`) — [document-identity.md](document-identity.md) |
| Display variants | UI labels or informal nicknames may appear once, mapped to the canonical name |
| Renames | Update registries and links; do not leave competing “current” names |

### Abbreviations

| Rule | Guidance |
| --- | --- |
| Expand on first use | `Service Level Objective (SLO)` on first mention in a doc, then `SLO` |
| Prefer project glossary | Record recurring abbreviations in the project glossary ([glossary.md](glossary.md)) |
| Do not invent acronyms | Do not create new abbreviations solely for documentation brevity |
| Machine tokens stay English | Lifecycle and classification tokens (`ACCEPTED`, `Confirmed`) are not abbreviated further |

### AI must use canonical names

AI agents that read or write documentation **must**:

1. Prefer names and IDs from registries, manifests, and Authoritative docs.
2. Not invent alternate spellings, codenames, or “friendlier” synonyms.
3. When an informal name appears in a question, resolve it to the canonical name before answering or editing.
4. Mark **Unknown** when the canonical name cannot be established — do not guess.

See [ai-context.md](ai-context.md) and [ai-answering-rules.md](ai-answering-rules.md).

### Separate fact from interpretation

- Current behavior → Confirmed or Inferred
- Missing information → Unknown
- Future ideas → Proposed

See classification rules in [standards.md](standards.md).

## What to Avoid

- Vague sentences
- Exaggeration
- Unnecessary duplication
- Unverified claims
- Excessively long paragraphs
- Presenting proposals as current state
- Secret values or sensitive data
- Technology assumptions framed as universal requirements

## What to Prefer

| Pattern | Why |
| --- | --- |
| Tables for inventories | Scannable and comparable |
| Ordered steps for runbooks | Executable |
| Explicit Unknown markers | Prevents invention |
| Links to canonical sources | Single source of truth |
| Dual-surface links (GitHub + Confluence) | Published packs stay navigable on both — [publishing-surfaces.md](publishing-surfaces.md) |
| Mermaid or text diagrams | Versionable and reviewable |
| Short examples | Clarify contracts and flows |

## Tone

- Engineering tone: calm, precise, neutral.
- No sales language.
- No blame language in incident or limitation docs.
- Imperative mood for procedures ("Check", "Restart", "Validate").

## Document Skeleton Expectations

Unless a template defines otherwise, place near the top:

1. Title
2. Status (and optional owner / last reviewed)
3. Purpose or overview
4. Scope
5. Body sections
6. Related documentation

## Cross-Document Consistency

Before finishing a document:

1. Check names against existing docs.
2. Link instead of copying contracts and decisions.
3. Update references when renaming files.
4. Ensure diagrams match the written current state.

## Related Documents

- [principles.md](principles.md)
- [standards.md](standards.md)
- [document-identity.md](document-identity.md)
- [glossary.md](glossary.md)
- [documentation-checklist.md](documentation-checklist.md)
- [ai-context.md](ai-context.md)
- [ai-documentation.md](ai-documentation.md)
- [language.md](language.md)
- [lifecycle.md](lifecycle.md)
- [quality-model.md](quality-model.md)
