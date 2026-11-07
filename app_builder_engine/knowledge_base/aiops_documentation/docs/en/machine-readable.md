# Machine-Readable Documentation

> Language: EN | [Português (pt-BR)](../pt-BR/machine-readable.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Rules that make documentation parseable and consistent for tools and AI agents — without requiring a specific search or RAG implementation.

## Goals

- Stable identifiers and metadata
- Predictable headings and tables
- Explicit enums (status, classification, confidence, authority)
- Resolvable relative links
- Declarative inventories (manifest, registries)

## Requirements

| Requirement | Rule |
| --- | --- |
| **Identifiers** | Use schemes from [document-identity.md](document-identity.md) |
| **Metadata** | YAML frontmatter per [document-metadata.md](document-metadata.md) |
| **Status** | English tokens only: `DRAFT` \| `REVIEW` \| `ACCEPTED` \| `DEPRECATED` \| `ARCHIVED` |
| **Classification** | `Confirmed` \| `Inferred` \| `Unknown` \| `Proposed` \| `Deprecated` for claims |
| **Dates** | ISO 8601 `YYYY-MM-DD` |
| **Links** | Relative Markdown links that resolve from the doc path |
| **Tables** | Header row required; one concept per column |
| **Code fences** | Language tag when applicable; never secret values |
| **Manifest** | Optional project inventory in [manifest-rules.md](manifest-rules.md) |

## Preferred Structures

Use tables or YAML lists for:

- component / service inventories;
- dependency matrices;
- claim ↔ evidence maps;
- relationship lists with typed predicates.

Prefer:

```markdown
| ID | Name | Type | Owner | Status |
| --- | --- | --- | --- | --- |
| CMP-001 | checkout-api | Component | platform-team | ACCEPTED |
```

Over unstructured paragraphs that bury the same facts.

## Encoding Rules

- Filenames: `kebab-case.md`
- Enumerations: English machine tokens (not translated)
- Boolean-like fields: `true` / `false` in YAML; avoid “yes/no” ambiguity in metadata
- Null / missing: omit optional fields, or use explicit `Unknown` in prose/tables — do not invent placeholders that look like real data

## What Machine-Readable Is Not

- Not a requirement to emit JSON-LD, RDF, or OpenAPI for every page
- Not a mandate for embeddings or chunk indexes
- Not permission to strip human-readable narrative when narrative aids understanding

## Related Documents

- [document-metadata.md](document-metadata.md)
- [manifest-rules.md](manifest-rules.md)
- [search-readiness.md](search-readiness.md)
- [chunking-guidelines.md](chunking-guidelines.md)
- [standards.md](standards.md)
