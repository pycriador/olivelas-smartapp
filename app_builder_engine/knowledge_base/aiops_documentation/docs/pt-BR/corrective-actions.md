# Ações Corretivas

> Language: pt-BR | [English](../en/corrective-actions.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar follow-ups de incidentes, reviews e gaps de reliability para que realmente mudem resultados.

Uma ação sem owner, type e success criteria é um desejo.

## Tipos de ação

| Type | Meaning | Example |
| --- | --- | --- |
| **Preventive** | Reduzir probabilidade de recorrência | Corrigir bug; adicionar guardrail; remover SPOF |
| **Detective** | Notar mais rápido ou com mais precisão da próxima vez | Novo alert; SLI melhor; synthetic check |
| **Mitigative** | Reduzir impacto enquanto a falha acontece | Graceful degrade; bulkhead; fallback de cache |
| **Recovery** | Restaurar mais rápido ou com mais segurança | Runbook; rollback mais seguro; failover automatizado |
| **Documentation** | Fechar gaps de conhecimento | Atualizar arquitetura, contrato, runbook, ownership |

Um único work item pode atravessar types; escolha o type primário ou liste ambos.

## O que registrar

| Campo | Significado |
| --- | --- |
| ID | Referência estável |
| Description | Resultado concreto |
| Type | Preventive / Detective / Mitigative / Recovery / Documentation |
| Owner | Team/role — [operational-ownership.md](operational-ownership.md) |
| Priority | Ligado a severity/criticality quando útil |
| Due / target | Data ou milestone — ou Not Defined |
| Status | Open / In progress / Done / Won’t do (com motivo) |
| Success criteria | Como sabemos que funcionou |
| Related incident / PIR | Link |
| Classification of underlying issue | Confirmed / Inferred / … |

## Tabela sugerida

| ID | Action | Type | Owner | Due | Status | Success criteria |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## Dicas de priorização

| Prefer first when… | Action type often |
| --- | --- |
| Ainda cegos à falha | Detective |
| Usuários sofreram tempo demais | Mitigative / Recovery |
| A mesma classe de incidente vai se repetir | Preventive |
| Só existe conhecimento tribal | Documentation |

Exaustão de error budget pode elevar trabalho preventive/detective — [error-budget.md](error-budget.md).

## Ações de documentação importam

Se a falha expôs conteúdo errado de arquitetura, contrato ou runbook, entregue ações Documentation com a mesma seriedade do código. Veja [change-policy.md](change-policy.md) e docs de drift de arquitetura/contrato quando relevante.

## Anti-padrões

- “Ter mais cuidado” como ação.
- Listas só Preventive que ignoram gaps de detection e recovery.
- Fechar PIR enquanto todas as ações permanecem Open sem owner.

## Documentos relacionados

- [post-incident-review.md](post-incident-review.md)
- [root-cause-analysis.md](root-cause-analysis.md)
- [incident-management.md](incident-management.md)
- [operations-model.md](operations-model.md)
- [runbooks/README.md](runbooks/README.md)
