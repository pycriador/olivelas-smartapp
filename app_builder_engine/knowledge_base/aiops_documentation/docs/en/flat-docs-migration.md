---
title: "Flat documentation migration"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
---

# Flat documentation migration → standard tree

> Language: EN | [Português (pt-BR)](../pt-BR/flat-docs-migration.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Playbook to reorganize loose Markdown (`docs/FOO.md`) into the standard progressive tree (`architecture/`, `contracts/`, `operations/`, …), with EN + pt-BR when the project is bilingual.

## When to use

- Dozens of flat docs without audience/depth indexing.
- A long “reverse engineering” monolith mixing product, architecture, and ops.
- Root README links that churn whenever files are renamed.

## Principles

1. **Do not invent** facts while migrating — keep Classification / mark Unknown.
2. **Merge** instead of duplicating (e.g. API standards → `contracts/rest-api.md`).
3. **Park** roadmap/strategy under `product/` (do not mix with as-is).
4. **Absorb** long reverse-engineering docs into architecture/application nodes — do not republish the monolith.
5. Update machine loaders (OpenAPI path, scripts) in the same change.

## Typical map (illustrative)

| Legacy flat (example names) | Suggested destination |
| --- | --- |
| `PRD.md` | `product/prd.md` |
| `ENTERPRISE_EVOLUTION.md` / roadmap | `product/` with Proposed Classification |
| `TECHNICAL_REVERSE_ENGINEERING.md` | Absorb into `architecture/*` + `application/*` |
| `RBAC.md` | `security/rbac.md` |
| `APAM.md` / tokens | `contracts/` (API auth) |
| `SERVICE_ACCOUNTS.md` | `contracts/` |
| `STORAGE.md` | `application/storage-*.md` + integration `contracts/` |
| `DATAOPS.md` | `application/data-ops.md` |
| `OUTPUT_EXPORT.md` | Section in pipeline + REST contract |
| `CANONICAL_*.md` | Merge into `contracts/canonical-*.md` |
| `DEPENDENCY_SECURITY.md` | `security/dependency-security.md` |
| `CHANGELOG.md` | `changelog.md` per language |
| `openapi.yaml` | `contracts/openapi.yaml` |
| `ENTERPRISE_API_STANDARDS.md` | Merge into `contracts/rest-api.md` + `security/overview.md` |

Exact names vary. The map is **guidance**, not a rigid schema.

## Recommended sequence

1. Inventory flat files: as-is / product / historical.
2. Scaffold `docs/pt-BR` (+ `docs/en` if bilingual) and a language-chooser `docs/README.md`.
3. Migrate architecture → application → contracts/security → operations.
4. Write `knowledge-gaps.md` for code present but previously undocumented.
5. Update repo README + hardcoded paths (OpenAPI loader, CI).
6. Remove legacy flat files in the same PR (or keep redirect stubs for one cycle).
7. Validate EN/pt-BR path parity and internal links.


## Illustrative map — document intelligence shape (NOT normative)

Inspired by an **isolated reference project** pattern (SSR BFF + API + workers + knowledge schema). Names below are **examples only**.

| Legacy flat (example) | Suggested destination |
| --- | --- |
| `ARCHITECTURE.md` | `architecture/overview.md` + `system-context.md` |
| `DATABASE.md` | `architecture/data-model.md` |
| `ROUTES.md` / `api-reference.md` | `contracts/http-api.md` (+ external contract) |
| `SSR.md` | `application/ssr-bff.md` (or `templates/bff.md`) |
| `SLACK-*-ARCHITECTURE.md` | `application/slack-bridge.md` + `templates/worker.md` |
| `INTERNAL-SCHEDULER.md` | `application/scheduler.md` |
| `HYBRID-SEARCH.md` / pgvector runbooks | `operations/` runbooks + `feature-flags.md` |
| Phase stubs / reverse-engineering reports | `archive/` with `DEPRECATED` + `superseded_by` |

Filled illustrative tree: [suggested-document-platform](../../examples/suggested-document-platform/) — **suggested stack ≠ standard**.

## Illustrative example

[fullstack-monolith](../../examples/fullstack-monolith/) shows a target-shaped tree. Its stack is **suggested/illustrative**, not normative.

## Pitfalls

| Pitfall | Mitigation |
| --- | --- |
| Copying the entire framework into the product repo | Adopt only needed templates |
| Promoting `ACCEPTED` via AI | Keep `DRAFT` until human review |
| Incomplete EN translation unmarked | Use `Translation status: pending` |
| Breaking OpenAPI by moving the file | Update code path in the same change |

## Related

- [adoption-path.md](adoption-path.md)
- [language.md](language.md)
- [change-policy.md](change-policy.md)
- [documentation-checklist.md](documentation-checklist.md)
