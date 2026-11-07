# Gestão de Mudanças Operacionais

> Language: pt-BR | [English](../en/change-management.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar change management **operacional**: mudanças Planned vs Emergency que afetam sistemas em execução.

Isto complementa [change-policy.md](change-policy.md) (documentação deve acompanhar mudanças técnicas relevantes). Aqui o foco é **como ambientes de produção (ou compartilhados) são alterados com segurança**.

## Classes de mudança

| Class | Meaning | Typical traits |
| --- | --- | --- |
| **Planned** | Agendada, revisada, reversível quando possível | Lead time, peer review, caminho padrão de deploy, janela anunciada quando necessário |
| **Emergency** | Redução urgente de risco (incidente, segurança, perda de dados) | Aprovação encurtada, comunicação intensificada, follow-up review obrigatório |

Projetos podem adicionar subclasses (standard / normal / major). Documente o modelo **do projeto**; não invente burocracia que o time não usa.

## O que documentar por mudança (quando material)

| Topic | Question |
| --- | --- |
| Intent | O que muda e por quê |
| Risk | Blast radius, irreversibility, impacto em dados |
| Plan | Passos, owner, janela |
| Validation | Como o sucesso é julgado |
| Rollback | Caminho ou “not rollback-safe” explícito |
| Communication | Quem é informado |
| Follow-up | PIR, corrective actions, updates de docs |

## Mudanças Planned

Documente ou vincule:

1. Como mudanças são propostas e aprovadas.
2. Caminho padrão de deploy/validate ([deployment-operations.md](deployment-operations.md)).
3. Quando janelas de maintenance se aplicam ([maintenance.md](maintenance.md)).
4. Quando políticas de error-budget ou freeze desaceleram mudanças ([error-budget.md](error-budget.md)).

## Mudanças Emergency

Documente ou vincule:

1. Quem pode autorizar uma mudança de emergência.
2. Validation mínima ainda exigida.
3. Como a mudança é registrada durante o incidente ([incident-timeline.md](incident-timeline.md)).
4. Review pós-mudança obrigatória ([post-incident-review.md](post-incident-review.md) quando ligada a um incidente).

Velocidade de emergência **não** desculpa inventar passos ou pular ownership.

## Anti-padrões

- Tratar todo hotfix como “sem processo”.
- Documentar um processo pesado de CAB que o time não segue.
- Mudanças silenciosas em produção sem entrada na timeline ou registro de deploy.

## Documentos relacionados

- [deployment-operations.md](deployment-operations.md)
- [rollback.md](rollback.md)
- [maintenance.md](maintenance.md)
- [incident-management.md](incident-management.md)
- [change-policy.md](change-policy.md)
- [operational-ownership.md](operational-ownership.md)
