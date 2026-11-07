# Manifest Rules

> Language: EN | [Português (pt-BR)](../pt-BR/manifest-rules.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Rules for `manifest.yaml` (or equivalent) inventories of documentation.

## Purpose

Provide a machine-readable list of key documents for navigation, coverage, and future indexing — not a search engine.

## Location

Default for this repository: [`docs/en/manifest.yaml`](manifest.yaml). Adopting projects may keep a project-level manifest.

## Required Entry Fields

| Field | Meaning |
| --- | --- |
| `id` | Document id |
| `path` | Path relative to `docs/en/` (or declared root) |
| `title` | Title |
| `type` | Document type |
| `status` | Lifecycle status |

## Recommended Entry Fields

| Field | Meaning |
| --- | --- |
| `owner` | Owner |
| `updated` | ISO date |
| `authority` | Authority level |
| `tags` | Short tags |
| `related` | Other ids |

## Rules

1. Paths must resolve.
2. `status` must match the document (blockquote/YAML).
3. Do not list secret-bearing files.
4. Prefer listing hubs and SoT docs; full corpus listing is optional.
5. Keep English tokens.

## Sample Shape

```yaml
standard: "Documentation Standard v1.0"
root: "."
documents:
  - id: CTX-AI-001
    path: ai-context.md
    title: AI Context
    type: Context
    status: ACCEPTED
    owner: documentation-standard
    updated: 2026-08-07
    authority: Authoritative
```

## Related Documents

- [manifest.yaml](manifest.yaml)
- [machine-readable.md](machine-readable.md)
- [document-metadata.md](document-metadata.md)
