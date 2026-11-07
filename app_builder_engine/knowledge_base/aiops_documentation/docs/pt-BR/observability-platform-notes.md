---
title: "Notas de plataforma de observabilidade"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-10"
updated: "2026-08-19"
review_date: "2026-11-10"
version: "1.0"
---

# Notas de plataforma de observabilidade

> Language: pt-BR | [English](../en/observability-platform-notes.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0

## O que o padrão exige

O padrão exige **honestidade de sinais** (metrics / logs / traces / health / alerts) com status:

`Implemented` | `Partial` | `Not Applicable` | `Not Documented`

Metodologia: [observability-model.md](observability-model.md), template [templates/observability.md](templates/observability.md).

O padrão **não** exige vendor, agente ou backend de telemetria específico.

## Convenções organizacionais (opcional)

Algumas organizações (ex.: Olivelas) adotam **Datadog** como plataforma padrão de métricas, logs e traces.

| Afirmação | Classification |
| --- | --- |
| “Datadog é exigido pelo Engineering Documentation Standard” | **Falso** — não é requisito do framework |
| “Datadog é a plataforma esperada na org X” | Pode ser Confirmed **na org**, documentado no projeto como convenção |
| “Projeto sem Datadog está fora do padrão documental” | **Falso** — documente Partial/Unknown/N/A com evidência |

## Como documentar em projetos Olivelas (sugestão, não mandato do framework)

1. Preencha o template de observabilidade com o que o código realmente emite.
2. Se a org espera Datadog e o código não instrumenta: registre **gap** em `knowledge-gaps.md` (Confirmed gap vs convenção org).
3. Não invente dashboards, monitors ou SLOs.
4. Health checks locais e audit logs contam como evidência Partial — diga isso explicitamente.

## Pack de implementação Olivelas (as-is)

Para **como habilitar Datadog no EKS Olivelas** (chart `web-server`, logs estruturados, APM, uso operacional), use o pack as-is — não esta página genérica:

- [loft-observability/README.md](loft-observability/README.md)
- [loft-observability/documentation-prerequisites.md](loft-observability/documentation-prerequisites.md) — **logs no Datadog** como gate documental Olivelas

O framework continua sem mandatar Datadog; o pack documenta **convenção org e implementação** para serviços Kubernetes Olivelas.

## Relação com o exemplo fullstack-monolith

O exemplo ilustra um monólito com health + audit + ring buffers e marca Datadog como gap opcional vs convenção org. A stack e a escolha de vendor ali são **ilustrativas**.

## Relacionados

- [templates/observability.md](templates/observability.md)
- [loft-observability/README.md](loft-observability/README.md)
- [adoption-path.md](adoption-path.md)
- [examples/fullstack-monolith/](../../examples/fullstack-monolith/)
