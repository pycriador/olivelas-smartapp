---
id: REF-OLIVELAS-APPS-009
title: "Deep Insight — knowledge e AI studio"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-24"
review_date: "2026-11-24"
---

# Deep Insight

> Language: pt-BR | [English (EN)](../../en/aiops-apps/deep-insight.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

Documentação **as-is** de [loft-br/aiops-deep-insight](https://github.com/loft-br/aiops-deep-insight) — **nível 2** do catálogo Olivelas.

## Objetivo

App web para **knowledge base**, **prompts**, fluxos de **AI** e ponte Slack — estúdio PDF/insights (package front `gemini-pdf-studio`).

## Contexto

Monorepo com front Vite CSR + **Node SSR** (`server/` Express) e API Flask. Pasta `knowledge/` no repo; OCR/LibreOffice na imagem API. Evidência: [overview.md](overview.md#deep-insight-aiops-deep-insight).

## Usuários / áreas

| Usuário / área | Necessidade |
| --- | --- |
| Squads internas | Knowledge, prompts, integração AI |
| Integrações Slack | Bridge documentada na API — **Confirmed** em overview |

## Impacto

Indisponibilidade afeta fluxos de knowledge/AI no corp. SLOs: **Unknown**.

## Visão geral da arquitetura

Repo: [loft-br/aiops-deep-insight](https://github.com/loft-br/aiops-deep-insight).

```text
Browser → aiops-deep-insight.loft-corp.com.br
       → Vite + Express SSR (server/)
       → API Flask — /api, /external blueprints
       → PostgreSQL + knowledge/ + serviços AI (google-genai, OCR)
```

| Camada | Detalhe |
| --- | --- |
| Front | `react-router-dom`, Express SSR |
| API | Flask `create_app()`, knowledge, prompts, AI, Slack bridge |
| Extra | `knowledge/`, PyMuPDF, Tesseract |

## Principais integrações

| Integração | Papel |
| --- | --- |
| PostgreSQL | Persistência |
| Google GenAI | Modelos AI — evidência `google-genai` |
| Slack SDK | Bridge API |
| Kong / Vault / Datadog | Padrão Olivelas |

## Stack (resumo)

| Camada | Tecnologia |
| --- | --- |
| Frontend | React, Vite, react-router-dom, Express SSR |
| Backend | Python 3.12, Flask, Gunicorn |
| Segurança | PyJWT; CORS **proíbe** `*` em produção |

Matrizes: [frontend-stack.md](frontend-stack.md) · [backend-stack.md](backend-stack.md) · [security.md](security.md).

## Nível 3 — documentação técnica

Repo: [loft-br/aiops-deep-insight](https://github.com/loft-br/aiops-deep-insight).

| Tópico | Link |
| --- | --- |
| README | [README](https://github.com/loft-br/aiops-deep-insight/blob/main/README.md) |
| Knowledge | [knowledge/](https://github.com/loft-br/aiops-deep-insight/tree/main/knowledge) |
| Backend | [backend/](https://github.com/loft-br/aiops-deep-insight/tree/main/backend) |
| Server SSR | [server/](https://github.com/loft-br/aiops-deep-insight/tree/main/server) |

## Deploy

| Campo | Valor |
| --- | --- |
| Namespace k8s | `aiops-deep-insight` |
| URL corp | `aiops-deep-insight.loft-corp.com.br` |
| `product` | `ai-ops` |

## Segurança (resumo)

PyJWT + hooks; headers HSTS/`security.py`. Detalhe: [security.md](security.md).

## Relacionados

- [../aiops-team/applications.md](../aiops-team/applications.md)
- [overview.md](overview.md)
