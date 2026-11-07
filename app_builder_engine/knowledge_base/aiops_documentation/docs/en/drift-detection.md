---
title: "Documentation Drift Detection"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Documentation Drift Detection

> Language: EN | [Português (pt-BR)](../pt-BR/drift-detection.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Drift means documented state ≠ repository/system state.

```text
Documentation ≠ Repository State
```

Distinct from [security-drift.md](security-drift.md) and domain drifts ([architecture-drift.md](architecture-drift.md), [documentation-drift.md](documentation-drift.md)).

## Automatable Signals

| Signal | Detection |
| --- | --- |
| Referenced file missing | Link / manifest checks |
| Manifest stale path | DOC-MAN-004 |
| Broken relative path | DOC-LINK-001 |
| Expired exception still open | DOC-EXC-001 |
| Stale review date | DOC-FRESH-001 (WARNING) |

## Human Signals

| Signal | Handling |
| --- | --- |
| Component removed but still described | Contradiction / debt |
| Endpoint behavior changed | Contract review |
| Owner team renamed | Ownership update |
| Runbook steps wrong | Ops review after incident |

Automation reminds; humans decide updates.
