# Contrato de Timing

> Language: pt-BR | [English](../en/timing-contract.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar expectativas relacionadas a tempo na fronteira de um contrato. Distinga três conceitos diferentes que frequentemente são confundidos.

## Três conceitos distintos

| Concept | Meaning |
| --- | --- |
| **Timeout** | Tempo máximo que uma parte espera por uma resposta ou acknowledgement antes de abortar a espera |
| **Business deadline** | Tempo até o qual um resultado de negócio deve ser alcançado (SLA, regulatório, promessa ao usuário) |
| **Processing duration** | Quanto tempo o trabalho tipicamente ou no máximo leva para executar |

```text
Timeout              ≠   Business Deadline   ≠   Processing Duration
(wait limit)             (outcome due)           (work length)
```

Uma processing duration curta ainda pode perder um business deadline se o trabalho começar tarde. Um timeout pode disparar enquanto o processamento continua de forma assíncrona.

## O que documentar quando aplicável

| Topic | Guidance |
| --- | --- |
| Client / consumer timeout | Quanto tempo o caller espera |
| Provider / producer timeout | Limites de espera no server ou worker |
| Expected latency | Latência típica ou em percentil se conhecida; marque Unknown caso contrário |
| Business deadline | Prazo externo e o que "late" significa |
| Processing duration | Tempo esperado/máximo de processamento |
| Asynchronous completion | Como a conclusão é sinalizada |
| Polling | Intervalo, backoff, condições de parada |
| Callback | Quando e como o callback é esperado; timeout no canal de callback |
| Expiry | Quando tokens, ofertas, reservas ou mensagens expiram |

## Tabela sugerida

| Timing aspect | Value | Classification |
| --- | --- | --- |
| Consumer timeout | … | |
| Provider timeout | … | |
| Expected latency | … | |
| Business deadline | … | |
| Processing duration | … | |
| Polling / callback / expiry | … | |
| Not Applicable | … | |

## Orientação

- Não invente timeouts numéricos sem evidência.
- Relacione timeouts a [retry-policy.md](retry-policy.md) (retry após timeout pode duplicar trabalho).
- Para contratos async, documente como o consumer fica sabendo de sucesso/falha após o accept inicial.

## Documentos relacionados

- [retry-policy.md](retry-policy.md)
- [delivery-semantics.md](delivery-semantics.md)
- [idempotency.md](idempotency.md)
- [api-contracts.md](api-contracts.md)
