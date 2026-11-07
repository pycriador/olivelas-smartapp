---
title: "Automation Commands"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Automation Commands

> Language: EN | [Português (pt-BR)](../pt-BR/automation-commands.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

All commands share [../validation-config.yaml](../validation-config.yaml) and [../../scripts/docs_lint.py](../../scripts/docs_lint.py).

Exit codes: `0` PASS, `1` VALIDATION FAILURE, `2` TOOL ERROR.

| Command | Purpose | Side effects | CI |
| --- | --- | --- | --- |
| `docs:lint` / `docs:validate` | Full validation | None | Yes |
| `docs:check-links` | Link checks only | None | Optional |
| `docs:check-manifest` | Manifest checks only | None | Optional |
| `docs:health` | Validation + write health report | Writes reports | Optional |
| `docs:report` | Health + manifest index | Writes generated/ | Optional |
| `docs:index` | Manifest index only | Writes generated/ | Optional |

### Shell

```bash
python3 scripts/docs_lint.py lint
python3 scripts/docs_lint.py validate
python3 scripts/docs_lint.py check-links
python3 scripts/docs_lint.py check-manifest
python3 scripts/docs_lint.py health
python3 scripts/docs_lint.py report
```

Make aliases (optional): see repository `Makefile`.

### Contract Fields

Each command:

- **Input**: repo tree + config
- **Output**: findings on stdout; reports for health/report
- **Exit code**: as above
- **Side effects**: only `health`, `report`, `index` write files under `docs/*/reports` and `docs/*/generated`
