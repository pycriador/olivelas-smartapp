# Authority Levels

> Language: EN | [Português (pt-BR)](../pt-BR/authority-levels.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Authority describes how much weight a document or source should carry when answering or changing documentation. Authority is **not** lifecycle status and **not** claim classification.

## Levels

| Level | Meaning | Typical sources |
| --- | --- | --- |
| **Authoritative** | Canonical for its scope; conflicts must be resolved against it or by changing it deliberately | Accepted contracts, accepted ADRs (for decisions), primary SoT docs, production schemas |
| **Verified** | Checked against Authoritative sources or runtime evidence; trustworthy synthesis | Reviewed architecture overview backed by code citations |
| **Informational** | Useful context; may be incomplete; not sufficient alone for Confirmed operational/security claims | Onboarding guides, diagrams without evidence links |
| **Reference** | Pointers, glossaries, indexes, external specs adopted by name | Glossary, manifest, standards index |
| **Historical** | True for a past state; not current SoT | Archived incident, superseded ADR kept for history |
| **Draft** | Work in progress; may change; do not treat as current production truth | `status: DRAFT` documents |
| **Unknown** | Authority not established | Orphan doc, missing owner, unclear provenance |

## Mapping to Lifecycle Status

| Lifecycle `status` | Default authority (unless overridden) |
| --- | --- |
| `DRAFT` | Draft |
| `REVIEW` | Informational (or Verified if evidence-complete pending acceptance) |
| `ACCEPTED` | Authoritative or Verified depending on SoT role |
| `DEPRECATED` | Historical (unless still Authoritative until replacement is accepted — then document the dual state explicitly) |
| `ARCHIVED` | Historical |

## Rules

1. Declare `authority` in metadata when ambiguity would mislead AI or humans.
2. Never treat Draft or Unknown as Authoritative.
3. Historical content may still be Confirmed *for the past* — label the time scope.
4. Authority does not override [ai-context-safety.md](ai-context-safety.md).

## Related Documents

- [source-of-truth.md](source-of-truth.md)
- [status.md](status.md)
- [history-model.md](history-model.md)
