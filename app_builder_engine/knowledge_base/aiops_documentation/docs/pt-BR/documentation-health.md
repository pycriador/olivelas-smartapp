# Saúde da documentação

> Language: pt-BR | [English](../en/documentation-health.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Uma visão leve de health atravessando coverage, completeness, freshness, drift e validation.

## Dimensões de health

| Dimension | Healthy when |
| --- | --- |
| Cobertura | Unidades no escopo mapeadas para docs |
| Completeness | Seções obrigatórias presentes ou Unknown |
| Frescor | Docs críticos revisados dentro da política |
| Drift | Mismatches conhecidos registrados e com owner |
| Evidence | Claims Confirmed citam SoT |
| Safety | Sem vazamento de secrets |
| Graph | Relacionamentos-chave explícitos |
| Validation | Sem findings ERROR abertos |

## Rollup de status (opcional)

| Rollup | Meaning |
| --- | --- |
| Healthy | Sem ERROR; warnings com owner |
| Degraded | WARNINGs abertos em caminhos críticos |
| Unhealthy | ERRORs abertos ou drift crítico sem owner |
| Unknown | Inventário/manifest insuficiente para avaliar |

Não confunda com health operacional de serviço ([operational-state.md](operational-state.md)).

## Documentos relacionados

- [documentation-coverage.md](documentation-coverage.md)
- [documentation-freshness.md](documentation-freshness.md)
- [documentation-drift.md](documentation-drift.md)
- [ai-documentation-validation.md](ai-documentation-validation.md)

