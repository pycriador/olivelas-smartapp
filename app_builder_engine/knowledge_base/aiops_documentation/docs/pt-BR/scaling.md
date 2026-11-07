# Escalabilidade

> Language: pt-BR | [English](../en/scaling.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar estratégias de scaling para demanda, crescimento de dados e carga operacional.

Scaling **não é só adicionar máquinas**. Prefira documentar as estratégias que o projeto realmente usa (ou explicitamente não usa).

## Tipos de estratégia (exemplos)

| Strategy | Meaning |
| --- | --- |
| **Horizontal scale-out** | Mais workers / instances |
| **Vertical scale-up** | Instâncias maiores / mais recursos por unidade |
| **Partitioning / sharding** | Dividir trabalho ou dados por chave |
| **Queueing / buffering** | Absorver picos; suavizar processamento |
| **Caching** | Reduzir carga em caminhos caros |
| **Throttling / admission control** | Cortar ou atrasar demanda excedente |
| **Async offload** | Mover trabalho para fora do caminho síncrono |
| **Read replicas / CQRS-style split** | Escalar leitura vs escrita de forma diferente quando usado |
| **Backpressure** | Desacelerar producers quando consumers saturam |
| **Do not scale (finite capacity)** | Limite rígido com rejeição explícita — válido quando documentado |

Marque estratégias não usadas como **Not Applicable**. Marque intenção desconhecida como **Not Defined**.

## O que documentar por estratégia

| Field | Question |
| --- | --- |
| Trigger | Decisão manual, threshold de métrica, schedule? |
| Mechanism | O que muda (count, size, partition map, limit)? |
| Limits | Teto, custo, constraints de acoplamento |
| Risks | Hot keys, consistency, reconnects em estouro |
| Verification | Como sabemos que o scaling ajudou |
| Rollback | Como fazemos scale back |
| Owner | Quem pode executar |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Coordenação com capacity e reliability

```text
Demand → Capacity signals → Scaling (or throttle) → Observe result
```

- Limits: [capacity.md](capacity.md)
- Falha sob carga: [failure-modes.md](failure-modes.md)
- Degradação sob carga: [degradation.md](degradation.md)
- Expectativas de contrato sob carga: retries/timeouts não devem amplificar overload — [retry-policy.md](retry-policy.md)

## Anti-padrões

- “Escalamos horizontalmente” com um datastore single-writer que não escala.
- Runbooks de scaling sem verification ou rollback.
- Ignorar limites de hot-key / skew que tornam scale-out ineficaz.

## Documentos relacionados

- [capacity.md](capacity.md)
- [reliability-model.md](reliability-model.md)
- [runbooks/README.md](runbooks/README.md)
- [operations-model.md](operations-model.md)
