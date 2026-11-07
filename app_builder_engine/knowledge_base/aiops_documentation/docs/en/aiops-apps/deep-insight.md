---
id: REF-OLIVELAS-APPS-009
title: "Deep Insight — knowledge and AI studio"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Deep Insight

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-apps/deep-insight.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

**As-is** documentation for [loft-br/aiops-deep-insight](https://github.com/loft-br/aiops-deep-insight) — Olivelas catalog **level 2**.

## Goal

Web app for **knowledge base**, **prompts**, **AI** flows, and Slack bridge — PDF/insights studio (front package `gemini-pdf-studio`).

## Context

Monorepo with Vite CSR front + **Node SSR** (`server/` Express) and Flask API. `knowledge/` folder in repo; OCR/LibreOffice in API image. Evidence: [overview.md](overview.md#deep-insight-aiops-deep-insight).

## Users / areas

| User / area | Need |
| --- | --- |
| Internal squads | Knowledge, prompts, AI integration |
| Slack integrations | API bridge — **Confirmed** in overview |

## Impact

Outage affects corp knowledge/AI flows. SLOs: **Unknown**.

## Architecture overview

Repo: [loft-br/aiops-deep-insight](https://github.com/loft-br/aiops-deep-insight).

```text
Browser → aiops-deep-insight.loft-corp.com.br
       → Vite + Express SSR (server/)
       → Flask API — /api, /external blueprints
       → PostgreSQL + knowledge/ + AI services (google-genai, OCR)
```

| Layer | Detail |
| --- | --- |
| Front | `react-router-dom`, Express SSR |
| API | Flask `create_app()`, knowledge, prompts, AI, Slack bridge |
| Extra | `knowledge/`, PyMuPDF, Tesseract |

## Main integrations

| Integration | Role |
| --- | --- |
| PostgreSQL | Persistence |
| Google GenAI | AI models — `google-genai` evidence |
| Slack SDK | API bridge |
| Kong / Vault / Datadog | Olivelas standard |

## Stack (summary)

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, react-router-dom, Express SSR |
| Backend | Python 3.12, Flask, Gunicorn |
| Security | PyJWT; CORS **forbids** `*` in production |

Matrices: [frontend-stack.md](frontend-stack.md) · [backend-stack.md](backend-stack.md) · [security.md](security.md).

## Level 3 — technical documentation

Repo: [loft-br/aiops-deep-insight](https://github.com/loft-br/aiops-deep-insight).

| Topic | Link |
| --- | --- |
| README | [README](https://github.com/loft-br/aiops-deep-insight/blob/main/README.md) |
| Knowledge | [knowledge/](https://github.com/loft-br/aiops-deep-insight/tree/main/knowledge) |
| Backend | [backend/](https://github.com/loft-br/aiops-deep-insight/tree/main/backend) |
| SSR server | [server/](https://github.com/loft-br/aiops-deep-insight/tree/main/server) |

## Deploy

| Field | Value |
| --- | --- |
| k8s namespace | `aiops-deep-insight` |
| Corp URL | `aiops-deep-insight.loft-corp.com.br` |
| `product` | `ai-ops` |

## Security (summary)

PyJWT + hooks; HSTS headers in `security.py`. Detail: [security.md](security.md).

## Related

- [../aiops-team/applications.md](../aiops-team/applications.md)
- [overview.md](overview.md)
