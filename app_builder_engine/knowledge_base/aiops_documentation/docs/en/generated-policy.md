---
title: "Generated Documentation Policy"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Generated Documentation Policy

> Language: EN | [Português (pt-BR)](../pt-BR/generated-policy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

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
