# Operations Examples / Exemplos de Operações

> **Fictional examples** / **Exemplos ficcionais** for the Operations & Reliability methodology (Documentation Standard v1.0).
>
> None of these documents describe a real project. / Nenhum destes documentos descreve um projeto real.

Standalone samples using the shared operations templates.  
Amostras autônomas usando os templates de operações compartilhados.

Choose a language / Escolha um idioma — each type has `en/` and `pt-BR/`:

| Type / Tipo | What it demonstrates / O que demonstra | EN | pt-BR |
| --- | --- | --- | --- |
| [service-profile/](service-profile/) | Operational identity card for a fictional catalog lookup service / Cartão de identidade operacional de um serviço fictício de consulta de catálogo | [en/service-profile.md](service-profile/en/service-profile.md) | [pt-BR/service-profile.md](service-profile/pt-BR/service-profile.md) |
| [runbook/](runbook/) | High error-rate mitigation (tool-agnostic steps) / Mitigação de alta taxa de erro (passos agnósticos de ferramenta) | [en/runbook.md](runbook/en/runbook.md) | [pt-BR/runbook.md](runbook/pt-BR/runbook.md) |
| [incident/](incident/) | Resolved SEV-2 latency incident record / Registro de incidente SEV-2 de latência resolvido | [en/incident.md](incident/en/incident.md) | [pt-BR/incident.md](incident/pt-BR/incident.md) |
| [failure-mode/](failure-mode/) | Dependency timeout failure mode / Modo de falha por timeout de dependência | [en/failure-mode.md](failure-mode/en/failure-mode.md) | [pt-BR/failure-mode.md](failure-mode/pt-BR/failure-mode.md) |
| [sli/](sli/) | Availability SLI for catalog lookups / SLI de disponibilidade para consultas de catálogo | [en/sli.md](sli/en/sli.md) | [pt-BR/sli.md](sli/pt-BR/sli.md) |
| [slo/](slo/) | Availability SLO + error budget / SLO de disponibilidade + error budget | [en/slo.md](slo/en/slo.md) | [pt-BR/slo.md](slo/pt-BR/slo.md) |
| [recovery-procedure/](recovery-procedure/) | Restore catalog cache from backup / Restaurar cache de catálogo a partir de backup | [en/recovery-procedure.md](recovery-procedure/en/recovery-procedure.md) | [pt-BR/recovery-procedure.md](recovery-procedure/pt-BR/recovery-procedure.md) |

Methodology / Metodologia:

| EN | pt-BR |
| --- | --- |
| [docs/en/operations-model.md](../../docs/en/operations-model.md) | [docs/pt-BR/operations-model.md](../../docs/pt-BR/operations-model.md) |
| [docs/en/reliability-model.md](../../docs/en/reliability-model.md) | [docs/pt-BR/reliability-model.md](../../docs/pt-BR/reliability-model.md) |
| [docs/en/operations/README.md](../../docs/en/operations/README.md) | [docs/pt-BR/operations/README.md](../../docs/pt-BR/operations/README.md) |

Progressive chain / Cadeia progressiva: **Architecture → Contracts → Operations → Recovery**.

Use them to see how service profiles, SLIs/SLOs, failure modes, runbooks, incidents, and recovery procedures look when filled — not as production copy-paste.  
Use-os para ver como ficam profiles, SLIs/SLOs, modos de falha, runbooks, incidentes e procedimentos de recuperação preenchidos — não como documentação de produção para copiar e colar.
