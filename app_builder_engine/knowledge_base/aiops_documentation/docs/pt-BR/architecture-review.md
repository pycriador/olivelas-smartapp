# Review de Arquitetura

> Language: pt-BR | [English](../en/architecture-review.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Quando e como revisar documentação de arquitetura, integrado ao ciclo de vida da documentação ([lifecycle.md](lifecycle.md), [review-policy.md](review-policy.md)).

## Quando revisar

Dispare uma review de documentação de arquitetura quando qualquer um dos seguintes ocorrer:

| Gatilho | Exemplos |
| --- | --- |
| **Structural change** | Nova forma de subsystem, split/merge de unidades principais |
| **New component** | Novo componente arquitetural ou unidade implantável |
| **Removed component** | Descomissionamento ou substituição |
| **Dependency change** | Dependência nova, removida ou materialmente alterada |
| **Contract change** | Schema/semântica/compatibilidade de uma interface publicada ou consumida |
| **Boundary change** | Mudanças de fronteira de sistema, confiança ou ownership |
| **Significant flow change** | Caminho primário de dados ou controle muda de comportamento |
| **New ADR** | Decisão arquitetural que afeta estrutura ou trade-offs |

Gatilhos secundários: sinais de obsolescência ([architecture-drift.md](architecture-drift.md), [stale-documentation.md](stale-documentation.md)), mudança de ownership ou incidente mostrando que docs estavam errados.

Prefira review **orientada a mudança** a rituais de calendário. Não há frequência universal de review para todos os docs de arquitetura.

## Quem revisa

| Papel | Responsabilidade |
| --- | --- |
| **Owner** | Garante que docs sejam atualizados e que a review aconteça ([ownership.md](ownership.md)) |
| **Reviewer** | Engenheiros familiares com o sistema; opcionalmente papel de architect/EM |
| **Consumers** | Times produtores/consumidores quando contratos ou fluxos cross-system mudam |
| **Segurança-aware reviewer** | Quando fronteiras de confiança ou caminhos de auth mudam |
| **Approver** | Opcional; use quando o projeto exigir aceitação formal |

Owner ≠ único reviewer para mudanças de alto impacto — prefira pelo menos um reviewer que não tenha sido autor da última revisão maior.

## O que verificar

Use [architecture-checklist.md](architecture-checklist.md) como espinha dorsal, mais:

- afirmações batem com código, config, contratos ou ADRs aceitos — ou estão classificadas;
- diagramas batem com o estado atual salvo se rotulados Proposed;
- arestas de relacionamento estão rotuladas ([component-relationships.md](component-relationships.md));
- seções de falha e confiança permanecem precisas quando essas visões se aplicam;
- links de ADR e contrato resolvem;
- sem segredos ou dados sensíveis desnecessários;
- status, owner e metadados `updated` estão corretos;
- pares bilíngues permanecem alinhados quando o projeto adota [language.md](language.md).

## Como registrar

Para reviews materiais de arquitetura, crie um registro curto a partir de [templates/review-record.md](templates/review-record.md):

- documento(s) revisado(s);
- data;
- reviewers;
- resultado (`Pass` / `Pass with follow-ups` / `Fail`);
- follow-ups, IDs de documentation debt ou IDs de architecture debt.

Review leve de PR basta para atualizações pequenas e bem escopadas. Prefira um review record quando a mudança for ampla, cross-team, sensível a security ou fechar uma remediação de drift.

## Atualizações de status (ciclo de vida)

Docs de arquitetura usam os mesmos tokens de status do restante do padrão:

```text
DRAFT → REVIEW → ACCEPTED → DEPRECATED → ARCHIVED
```

| Situação | Ação de status |
| --- | --- |
| Novo doc de arquitetura | Comece `DRAFT`, vá para `REVIEW`, depois `ACCEPTED` |
| Mudança relevante em um doc `ACCEPTED` | `ACCEPTED → REVIEW → ACCEPTED` (ciclo de atualização; não há status chamado `UPDATED`) |
| Overview supersedido | `DEPRECATED` com `replaced_by` quando disponível |
| Apenas histórico | `ARCHIVED` conforme [archive-policy.md](archive-policy.md) |

Não invente tokens de status alternativos. Detalhes: [status.md](status.md), [lifecycle.md](lifecycle.md).

## Documentos relacionados

- [architecture-checklist.md](architecture-checklist.md)
- [architecture-drift.md](architecture-drift.md)
- [architecture-debt.md](architecture-debt.md)
- [review-policy.md](review-policy.md)
- [lifecycle.md](lifecycle.md)
- [templates/review-record.md](templates/review-record.md)
- [architecture/README.md](architecture/README.md)
