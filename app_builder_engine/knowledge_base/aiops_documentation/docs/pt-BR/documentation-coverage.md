# Cobertura da documentação

> Language: pt-BR | [English](../en/documentation-coverage.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Cobertura mede se sistemas, components, services e contracts **no escopo** têm nós de documentação correspondentes.

Cobertura ≠ completeness de cada página ([documentation-completeness.md](documentation-completeness.md)) e ≠ freshness ([documentation-freshness.md](documentation-freshness.md)).

## Dimensões de coverage

| Dimensão | Pergunta |
| --- | --- |
| **Component coverage** | Cada component registrado tem menção de arquitetura? |
| **Service coverage** | Cada service tem ownership + entry points de ops? |
| **Contract coverage** | Cada boundary público tem um contract doc? |
| **Runbook coverage** | Alertas/falhas críticos linkam a runbooks? |
| **Segurança coverage** | Assets/controls no escopo estão documentados ou explicitamente Unknown? |
| **Decision coverage** | Decisões dignas de ADR estão registradas? |

## Orientação de scoring (opcional)

Projetos podem rastrear razões simples:

```text
coverage = documented_in_scope / in_scope_total
```

Marque denominadores com honestidade. Não inflacione coverage inventando components.

## Gaps

Itens no escopo sem cobertura → [knowledge-gaps.md](knowledge-gaps.md) ou [documentation-debt.md](documentation-debt.md).

## Documentos relacionados

- [documentation-completeness.md](documentation-completeness.md)
- [component-registry.md](component-registry.md)
- [service-registry.md](service-registry.md)

