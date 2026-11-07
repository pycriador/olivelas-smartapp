# Health Checks

> Language: pt-BR | [English](../en/health-checks.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar health checks e probes semelhantes usados para routing, orquestração e status do operador.

Nem todo projeto tem todos os tipos de check. Marque tipos não usados como **Not Applicable**.

## Tipos de check

| Type | Meaning |
| --- | --- |
| **Liveness** | Processo/componente deve ser reiniciado ou marcado morto se falhar |
| **Readiness** | Componente ainda não deve (ou não deve mais) receber trabalho novo |
| **Dependency health** | Reachability de dependência crítica ou check raso de capacidade |
| **Business health** | Sinal de domínio de que a capacidade de negócio central funciona (além de “processo up”) |

Liveness ≠ readiness. Um processo pode estar vivo mas não ready; uma dependência pode estar down enquanto o processo está live.

## O que documentar

| Field | Question |
| --- | --- |
| Name / endpoint / job | Como o check é invocado (descrição agnóstica de tecnologia) |
| Type | Liveness / Readiness / Dependency / Business / other |
| Success criteria | O que significa “healthy” |
| Failure criteria | O que falha o check |
| Dependencies touched | Checks rasos vs profundos — checks profundos podem amplificar outages |
| Side effects | Deve ser seguro (sem writes perigosos) |
| Frequency / timeout | Conforme configurado, ou Not Defined |
| Action on failure | Restart, remover do pool, alert, ignore |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Tabela sugerida

| Check | Type | Expected | On failure | Depth | Classification |
| --- | --- | --- | --- | --- | --- |
| | liveness / readiness / dependency / business | | | shallow / deep / Unknown | |

## Orientação

- Prefira checks rasos de dependência para readiness quando checks profundos criam falhas em cascata.
- Business health deve refletir capacidade significativa para o usuário quando caminhos Critical precisam; caso contrário Not Applicable.
- Health verde + dor do usuário frequentemente significa business health ausente ou SLI errado — veja [degradation.md](degradation.md).

## Documentos relacionados

- [observability-model.md](observability-model.md)
- [monitoring.md](monitoring.md)
- [alerting.md](alerting.md)
- [templates/observability.md](templates/observability.md)
- [reliability-model.md](reliability-model.md)
