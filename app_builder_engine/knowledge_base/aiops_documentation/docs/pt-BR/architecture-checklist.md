# Checklist de Documentação de Arquitetura

> Language: pt-BR | [English](../en/architecture-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Checklist prático para qualidade da documentação de arquitetura. Use o que se aplicar — projetos pequenos não são esperados a marcar todo item.

Classifique afirmações incertas (Confirmed / Inferred / Unknown / Proposed). Prefira estado atual a design aspiracional.

## Contexto

- [ ] O propósito está claro?
- [ ] O contexto está documentado?
- [ ] A fronteira do sistema está clara?
- [ ] Atores relevantes estão identificados?

## Estrutura

- [ ] Os componentes principais estão identificados?
- [ ] As responsabilidades estão claras?
- [ ] As dependências estão documentadas?
- [ ] A direção das dependências está clara (relacionamentos rotulados)?

## Comportamento

- [ ] Fluxos importantes estão documentados?
- [ ] Interações relevantes estão documentadas?
- [ ] Estados importantes estão documentados (quando o sistema tem ciclos de vida significativos)?

## Resiliência

- [ ] Domínios de falha foram considerados?
- [ ] Dependências críticas foram identificadas?

## Segurança

- [ ] Fronteiras de confiança foram identificadas quando aplicável?

## Decisões

- [ ] Trade-offs relevantes foram documentados?
- [ ] ADRs relacionados estão referenciados?

## Qualidade

- [ ] Atributos de qualidade arquiteturais relevantes foram identificados?
- [ ] Restrições estão documentadas?

## Manutenibilidade

- [ ] Diagramas estão atualizados?
- [ ] Referências funcionam?
- [ ] O documento tem um owner?
- [ ] O status está correto (`DRAFT` / `REVIEW` / `ACCEPTED` / `DEPRECATED` / `ARCHIVED`)?

## Como usar

| Situação | Use |
| --- | --- |
| Novo overview de arquitetura | Percorra a lista completa; pule seções N/A de forma consciente |
| Mudança pequena | Verifique itens de Structure / Behavior / Maintainability tocados pela mudança |
| Review de arquitetura | Use como espinha dorsal da review ([architecture-review.md](architecture-review.md)) |
| PR de mudança estrutural | Pareie com [templates/documentation-pr-checklist.md](templates/documentation-pr-checklist.md) |

Itens desmarcados que importam devem virar documentação ou [architecture debt](architecture-debt.md) — não lacunas silenciosas apresentadas como Confirmed.

## Documentos relacionados

- [architecture-model.md](architecture-model.md)
- [architecture-review.md](architecture-review.md)
- [architecture-drift.md](architecture-drift.md)
- [architecture-debt.md](architecture-debt.md)
- [documentation-checklist.md](documentation-checklist.md)
- [quality-model.md](quality-model.md)
