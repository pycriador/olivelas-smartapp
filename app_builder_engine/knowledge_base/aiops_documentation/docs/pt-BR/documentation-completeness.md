# Completude da Documentação

> Language: pt-BR | [English (EN)](../en/documentation-completeness.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Completude mede se um **documento** inclui as seções e campos exigidos para o seu tipo — sem inventar fatos ausentes.

## Princípios

1. Seções obrigatórias vazias devem dizer `Not applicable` ou `Unknown`, não desaparecer silenciosamente.
2. Completude nunca exige fabricar conteúdo Confirmed.
3. Um doc Confirmed curto supera um longo inventado ([quality-model.md](quality-model.md)).

## Expectativas por Tipo (Resumo)

| Tipo | Mínimo completo quando |
| --- | --- |
| Context | Propósito, escopo, atores, links para docs mais profundos |
| Arquitetura | Limites, componentes, relacionamentos, fluxos-chave ou Unknown |
| Contract | Participantes, schema/semântica, erros, versão |
| Operation | Ownership, sinais de criticidade/estado, links de falha/ops conforme aplicável |
| Segurança | Escopo, assets/threats/controls no escopo — ou Unknown explícito |
| Runbook | Trigger, passos, evidência de tooling, notas de rollback/segurança |
| Incident | ID, timeline, modelo de severidade usado, Unknowns abertos permitidos |
| Decision | Status, contexto, decisão, consequências |
| Evidence | Links de claims, referências, data de coleta |
| Reference | Escopo claro; não um depósito para Arquitetura ausente |

Use checklists existentes para profundidade:

- [architecture-checklist.md](architecture-checklist.md)
- [contract-checklist.md](contract-checklist.md)
- [operations-checklist.md](operations-checklist.md)
- [security-checklist.md](security-checklist.md)
- [documentation-checklist.md](documentation-checklist.md)
- [ai-ready-checklist.md](ai-ready-checklist.md)

## Documentos Relacionados

- [documentation-coverage.md](documentation-coverage.md)
- [knowledge-gaps.md](knowledge-gaps.md)
