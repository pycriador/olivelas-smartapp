# Relacionamentos entre documentos

> Language: pt-BR | [English](../en/document-relationships.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Vocabulário controlado para relacionamentos entre documentos e entre documentos e unidades arquiteturais.

Complementa (não substitui) os verbos de relacionamento de component em runtime em [component-relationships.md](component-relationships.md).

## Vocabulário (Documentos)

| Predicate | Meaning | Inverse (typical) |
| --- | --- | --- |
| `describes` | A narra ou especifica B | `described_by` |
| `summarizes` | A é uma visão mais curta de B | `detailed_by` |
| `depends_on` | Entender/manter A requer B | `required_by` |
| `references` | A cita B sem depender para correção | `referenced_by` |
| `supersedes` | A substitui B como atual | `superseded_by` |
| `constrains` | A (geralmente ADR/policy) limita B | `constrained_by` |
| `implements` | A realiza a decisão/requirement B | `implemented_by` |
| `evidences` / `evidenced_by` | A sustenta claims em B | — |
| `operates` | Doc de ops/runbook A aplica-se à unidade B | `operated_by` |
| `secures` | Doc de security A cobre asset/unidade B | `secured_by` |
| `related_to` | Link fraco; prefira um predicado mais forte | `related_to` |

## Vocabulário (Doc ↔ Component/Service/Contract)

| Predicate | Meaning |
| --- | --- |
| `includes` | Doc de arquitetura lista o component |
| `exposes` | Component/service oferece o contract |
| `consumes` | Component/service usa o contract |
| `owns` | Doc/time owner possui a unidade |
| `monitors` | Doc de ops define sinais para a unidade |
| `maps_to` | Doc id mapeia para a chave de contrato runtime |

## Regras

1. Prefira o predicado mais forte e preciso a `related_to`.
2. Mantenha um subset permitido pelo projeto se necessário; não invente sinônimos contraditórios (`depends` vs `depends_on`).
3. Documente arestas em tabelas ou listas de metadados para machine readability.
4. Relacionamento ≠ classificação de evidência.

## Tabela de exemplo

| From | Predicate | To |
| --- | --- | --- |
| `ARCH-001` | `includes` | `CMP-001` |
| `CONTRACT-001` | `maps_to` | `order-created@v1` |
| `ADR-012` | `constrains` | `ARCH-001` |
| `RB-014` | `operates` | `SVC-001` |

## Documentos relacionados

- [documentation-graph.md](documentation-graph.md)
- [component-relationships.md](component-relationships.md)
- [documentation-dependencies.md](documentation-dependencies.md)

