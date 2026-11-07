# Drift Operacional

> Language: pt-BR | [English](../en/operational-drift.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

**Operational drift** é o gap entre a realidade operacional documentada e como o sistema é realmente operado, observado e recuperado.

```text
Documented Operations
        ≠
Actual Operations
```

Conceitos relacionados: [architecture-drift.md](architecture-drift.md), [contract-drift.md](contract-drift.md), [stale-documentation.md](stale-documentation.md).

## Sinais

| Signal | Example |
| --- | --- |
| Stale runbook | Passos referenciam jobs, dashboards ou hosts removidos |
| Alert without action | Page dispara; on-call improvisa toda vez |
| Undocumented recovery | Time usa um caminho tribal de restore |
| Phantom SLO | Docs reivindicam 99,9%; nenhuma medição existe |
| Ownership drift | Lista de escalation nomeia um time dissolvido |
| Deploy drift | Pipeline mudou; docs de deploy ainda descrevem o caminho antigo |
| State language drift | Status page usa estados que os docs nunca definiram |

## Como registrar drift

1. **Classifique o impacto** — cosmético vs bloqueia response a incidente / engana AI ou novo on-call.
2. **Registre** — item leve com evidência:

| Campo | Significado |
| --- | --- |
| **ID** | Opcional (`OP-DRIFT-003`) |
| **Documented** | O que os docs afirmam |
| **Actual** | O que operadores fazem (com evidência) |
| **Impact** | Risco se não for corrigido |
| **Owner** | Quem reconcilia |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

3. **Trate** — atualize docs, corrija processo/tooling ou aceite o risco explicitamente. Não invente um “modelo de ops desejado” como estado atual.

## Relação com debt

| Finding | Often becomes |
| --- | --- |
| Docs errados, prática correta | Dívida de documentação |
| Prática insegura / frágil | [reliability-debt.md](reliability-debt.md) |
| Ambos divergiram | Ambos, com owners claros |

## O que este padrão não faz

Nenhum bot obrigatório de verificação contínua nesta versão. A detecção permanece humana e dirigida por mudanças/incidentes.

## Documentos relacionados

- [reliability-debt.md](reliability-debt.md)
- [operations-checklist.md](operations-checklist.md)
- [runbooks/README.md](runbooks/README.md)
- [operational-readiness.md](operational-readiness.md)
- [stale-documentation.md](stale-documentation.md)
