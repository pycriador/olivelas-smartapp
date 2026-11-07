---
title: "Pull Request Documentation Checks"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Pull Request Documentation Checks

> Language: EN | [Português (pt-BR)](../pt-BR/pull-request-documentation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

When a PR must update documentation — complements [change-policy.md](change-policy.md).

| Change | Documentation expected |
| --- | --- |
| Architecture change | Architecture docs / ADRs |
| API / contract change | Contract docs |
| Operational change | Ops / runbooks / alerts |
| Security change | Security docs |
| Behavior change for integrators | Relevant contracts + overview |
| Validation/governance change | Governance docs + config review |

## PR Checklist (Human)

Do not duplicate automated CI checks. Humans confirm:

- [ ] Documentation impact evaluated
- [ ] Relevant documentation updated
- [ ] Manifest updated when listing new authoritative docs
- [ ] Relationships updated when structure changed
- [ ] Evidence updated for Confirmed claims
- [ ] Security impact evaluated
- [ ] Operations impact evaluated

GitHub: [../../.github/pull_request_template.md](../../.github/pull_request_template.md)
