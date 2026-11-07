# Checklist de Contrato

> Language: pt-BR | [English](../en/contract-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Checklist prático para qualidade da documentação de contratos técnicos. Use o que se aplicar — nem todo contrato precisa de todo item.

Classifique afirmações incertas (`Confirmed` / `Inferred` / `Unknown` / `Proposed`). Prefira estado atual a design aspiracional.

## Geral

- [ ] Purpose defined
- [ ] Participants defined
- [ ] Owner defined
- [ ] Contract type defined
- [ ] Protocol defined when applicable

## Dados

- [ ] Schema documented
- [ ] Semantics documented
- [ ] Required fields defined
- [ ] Validations documented

## Behavior

- [ ] Errors documented
- [ ] Retry documented
- [ ] Timeout documented
- [ ] Idempotency documented
- [ ] Ordering documented when applicable
- [ ] Delivery semantics documented when applicable

## Evolution

- [ ] Versioning defined
- [ ] Compatibility assessed
- [ ] Breaking changes identified
- [ ] Deprecation defined when needed

## Segurança

- [ ] Authentication documented when applicable
- [ ] Authorization documented when applicable
- [ ] Sensitive data identified

## Operações

- [ ] Observability defined
- [ ] Failure scenarios documented

## Como usar

| Situation | Use |
| --- | --- |
| New contract | Percorra a lista completa; marque N/A conscientemente |
| Small change | Verifique itens de Data / Behavior / Evolution tocados pela mudança |
| Contract review | Use como espinha dorsal da review com [contract-lifecycle.md](contract-lifecycle.md) |
| Drift found | Reverifique itens que contradizem o runtime |

Itens desmarcados que importam devem virar [contract debt](contract-debt.md) ou [documentation debt](documentation-debt.md) — não lacunas silenciosas apresentadas como Confirmed.

## Documentos relacionados

- [contract-model.md](contract-model.md)
- [contract-lifecycle.md](contract-lifecycle.md)
- [contract-debt.md](contract-debt.md)
- [quality-model.md](quality-model.md)
- [documentation-checklist.md](documentation-checklist.md)
- [templates/contract.md](templates/contract.md)
