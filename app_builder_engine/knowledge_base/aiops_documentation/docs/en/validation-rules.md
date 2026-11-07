---
title: "Validation Rules Registry"
status: "REVIEW"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-17"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Validation Rules Registry

> Language: EN | [Português (pt-BR)](../pt-BR/validation-rules.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0

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
| DOC-LINK-003 | No bare `../../…/*.md` paths in prose (2+ `../`) | ERROR | Yes | Yes |
| DOC-REL-001 | Relationship source/target resolves | ERROR | Yes | Yes |
| DOC-FRESH-001 | Authoritative doc may be stale | WARNING | Yes | Yes |
| DOC-EXC-001 | Exception past expiration still open | ERROR | Yes | No |
| DOC-AI-001 | AI context entry exists | ERROR | Yes | No |
| DOC-SEC-001 | Possible secret material | ERROR | Yes | No* |
| DOC-CLAIM-001 | Claim status token valid | ERROR | Yes | Yes |

\* Secret findings require remediation or redaction; do not “except away” real credentials — rotate first.

Use [templates/validation-rule.md](templates/validation-rule.md) to add rules.

Severity model: **ERROR** blocks CI; **WARNING** passes with attention; **INFO** advisory.
