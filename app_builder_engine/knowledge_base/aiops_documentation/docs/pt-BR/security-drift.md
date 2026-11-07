# Drift de Segurança

> Language: pt-BR | [English](../en/security-drift.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

**Segurança drift** é o gap entre a postura de segurança documentada e como o sistema é realmente protegido, acessado, monitorado e evidenciado.

```text
Documented Security
        ≠
Actual Security
```

Conceitos relacionados: [architecture-drift.md](architecture-drift.md), [contract-drift.md](contract-drift.md), [operational-drift.md](operational-drift.md), [stale-documentation.md](stale-documentation.md).

## Sinais

| Signal | Example |
| --- | --- |
| Stale trust boundary | Docs omitem um novo edge público |
| Phantom control | Docs afirmam MFA / network policy; nenhum configurado |
| Privilege drift | Service account ganhou roles; docs ainda dizem least privilege |
| Secret source drift | Runtime puxa de um store novo; docs nomeiam o antigo |
| Expired exception | Exception além da expiration ainda é usada |
| Monitoring drift | Segurança alert removido; docs ainda afirmam detection |
| Evidence drift | Control “provado” por um review anos stale |
| Contract security drift | Auth da API mudou; seção Segurança do contract não atualizada |

## Como registrar drift

1. **Classifique o impact** — cosmético vs habilita falsa confiança / bloqueia incident response / engana IA.
2. **Registre** — item leve com evidência:

| Campo | Significado |
| --- | --- |
| **ID** | Opcional (`SEC-DRIFT-003`) |
| **Documented** | O que os docs afirmam |
| **Actual** | O que existe (com evidência) |
| **Impact** | Risk se não for corrigido |
| **Owner** | Quem reconcilia |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

3. **Trate** — atualize docs, corrija controls/process, abra vulns/exceptions, ou aceite risk explicitamente. Não invente um “desired security model” como estado atual.

## Relação com debt

| Finding | Often becomes |
| --- | --- |
| Docs errados, practice correta | Documentation debt |
| Practice insegura / control ausente | [security-debt.md](security-debt.md) |
| Ambos divergiram | Ambos, com owners claros |
| Regras de segurança de interface erradas | [contract-debt.md](contract-debt.md) e/ou security debt |

## O que este padrão não faz

Nenhum bot obrigatório de continuous verification nesta versão. A detecção permanece humana e dirigida por change/incident/review.

## Documentos relacionados

- [security-debt.md](security-debt.md)
- [security-checklist.md](security-checklist.md)
- [security-evidence.md](security-evidence.md)
- [security-readiness.md](security-readiness.md)
- [security-exceptions.md](security-exceptions.md)
- [stale-documentation.md](stale-documentation.md)
