# Lacunas de conhecimento

> Language: pt-BR | [English](../en/knowledge-gaps.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Como rotular conhecimento ausente ou incerto sem preenchê-lo com ficção.

## Categorias de gap

| Category | Meaning | AI behavior |
| --- | --- | --- |
| **Known** | Fato estabelecido e documentado | Use livremente com citações |
| **Unknown** | Não identificado; sem evidência adequada | Declare Unknown; não invente |
| **Assumed** | Tomado como verdadeiro para progredir sem prova | Rotule Assumed; busque verificação |
| **Needs Verification** | Fato candidato com evidência fraca/envelhecida | Trate como não verificado; planeje checagem |

## Relação com classification

| Gap label | Typical claim classification |
| --- | --- |
| Known | Confirmed (when evidenced) |
| Unknown | Unknown |
| Assumed | Inferred or Proposed depending on intent |
| Needs Verification | Inferred (or Unknown if too weak) |

Assumed ≠ Confirmed. Needs Verification ≠ Confirmed.

## Registrando gaps

Mantenha uma lista simples (seção de doc, item de debt ou tabela):

| ID | Gap | Category | Owner | Next action |
| --- | --- | --- | --- | --- |
| GAP-003 | Multi-region failover | Unknown | platform-team | Confirm with ops |

## Documentos relacionados

- [evidence-model.md](evidence-model.md)
- [documentation-debt.md](documentation-debt.md)
- [documentation-coverage.md](documentation-coverage.md)

