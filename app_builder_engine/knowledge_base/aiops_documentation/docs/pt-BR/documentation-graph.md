# Grafo de documentação

> Language: pt-BR | [English](../en/documentation-graph.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


O documentation graph é o conjunto de documentos (nós) e relacionamentos tipados (arestas) que conectam conhecimento para navegação e análise de impacto.

Isto é uma **estrutura de documentação**, não um produto de grafo de banco de dados e não um índice vetorial.

## Nós

Cada nó é um documento (ou linha de register) com:

- `id` ([document-identity.md](document-identity.md))
- `type` ([document-types.md](document-types.md))
- `status`, `owner`, `updated`
- opcionalmente `authority`, links para components/services

## Arestas

Arestas usam o vocabulário controlado em [document-relationships.md](document-relationships.md).

Exemplo:

```text
CTX-001 —describes→ ARCH-001
ARCH-001 —includes→ CMP-001
CMP-001 —exposes→ CONTRACT-001
CONTRACT-001 —consumed_by→ SVC-002
OPS-001 —operates→ SVC-001
RB-014 —responds_to→ alert-checkout-error-rate
ARCH-001 —evidenced_by→ EVD-20260807-01
ADR-012 —constrains→ ARCH-001
```

## Regras de construção

1. Prefira links explícitos em metadados (`related`) e seções do corpo a adjacência implícita.
2. Toda aresta deve ser significativa se invertida (conheça o inverso quando definido).
3. Não crie arestas para documentos que não existem; use Unknown ou remova a claim.
4. Entradas do manifest ajudam a enumerar nós ([manifest-rules.md](manifest-rules.md)).

## Usos

| Use | How the graph helps |
| --- | --- |
| Navigation | [ai-navigation.md](ai-navigation.md) |
| Change impact | [change-impact.md](change-impact.md) |
| Cobertura | [documentation-coverage.md](documentation-coverage.md) |
| Drift detection (manual) | Missing edges after code change |

## Não objetivos

- Sem exigência de armazenar o graph em Neo4j ou similar
- Sem embedding de nós para busca semântica neste padrão

## Documentos relacionados

- [document-relationships.md](document-relationships.md)
- [documentation-dependencies.md](documentation-dependencies.md)
- [component-registry.md](component-registry.md)

