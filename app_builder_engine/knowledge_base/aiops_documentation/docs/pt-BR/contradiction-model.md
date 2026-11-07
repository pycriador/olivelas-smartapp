# Modelo de contradição

> Language: pt-BR | [English](../en/contradiction-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Como detectar, registrar e resolver claims contraditórias na documentação.

## O que conta como contradição

Duas ou mais claims no escopo que não podem ser todas verdadeiras para o mesmo timeframe/ambiente, incluindo:

- Doc A vs Doc B
- Doc vs código/config/contrato
- ADR vs doc de arquitetura atual
- Runbook vs tooling real

## Formato do registro

| Campo | Significado |
| --- | --- |
| ID | Optional `CONTRA-XXX` |
| Claim A | Statement + source |
| Claim B | Statement + source |
| Scope | Env / version / time |
| Detection date | `YYYY-MM-DD` |
| Status | Open / Investigating / Resolved / Accepted divergence |
| Resolution | SoT chosen, docs updated, or justified dual-state |

## Ordem de resolução

Siga [source-of-truth.md](source-of-truth.md). Se não resolvido, mantenha **Open** e reduza a confidence; não invente uma síntese que negue o conflito.

## Regras da IA

- Superficialize contradições explicitamente nas respostas.
- Não delete um lado sem resolução baseada em evidência.
- Linke docs de drift de domínio quando a contradição for drift.

## Documentos relacionados

- [documentation-drift.md](documentation-drift.md)
- [knowledge-gaps.md](knowledge-gaps.md)
- [claims.md](claims.md)

