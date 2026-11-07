# Documentation Graph

> Language: EN | [Português (pt-BR)](../pt-BR/documentation-graph.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


The documentation graph is the set of documents (nodes) and typed relationships (edges) that connect knowledge for navigation and impact analysis.

This is a **documentation structure**, not a graph database product and not a vector index.

## Nodes

Each node is a document (or register row) with:

- `id` ([document-identity.md](document-identity.md))
- `type` ([document-types.md](document-types.md))
- `status`, `owner`, `updated`
- optional `authority`, links to components/services

## Edges

Edges use the controlled vocabulary in [document-relationships.md](document-relationships.md).

Example:

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

## Construction Rules

1. Prefer explicit links in metadata (`related`) and body sections over implied adjacency.
2. Every edge should be meaningful if reversed (know the inverse when defined).
3. Do not create edges to documents that do not exist; use Unknown or remove the claim.
4. Manifest entries help enumerate nodes ([manifest-rules.md](manifest-rules.md)).

## Uses

| Use | How the graph helps |
| --- | --- |
| Navigation | [ai-navigation.md](ai-navigation.md) |
| Change impact | [change-impact.md](change-impact.md) |
| Coverage | [documentation-coverage.md](documentation-coverage.md) |
| Drift detection (manual) | Missing edges after code change |

## Non-Goals

- No requirement to store the graph in Neo4j or similar
- No embedding of nodes for semantic search in this standard

## Related Documents

- [document-relationships.md](document-relationships.md)
- [documentation-dependencies.md](documentation-dependencies.md)
- [component-registry.md](component-registry.md)
