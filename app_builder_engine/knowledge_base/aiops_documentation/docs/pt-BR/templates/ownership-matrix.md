# Matriz de Ownership

> Language: pt-BR | [English](../../en/templates/ownership-matrix.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Inventário opcional de ownership de documentação em um projeto.

O `owner` por documento nos metadados YAML permanece a fonte da verdade. Esta matriz é uma visão de conveniência para times e planejamento de revisão periódica.

Copie para o projeto em adoção (por exemplo `docs/ownership-matrix.md`) e preencha as linhas.

## Matriz

| Document | Owner | Reviewer | Approver | Review Cycle |
| --- | --- | --- | --- | --- |
| | | | | |
| | | | | |
| | | | | |

### Orientação dos campos

| Coluna | Orientação |
| --- | --- |
| Document | Caminho ou título estável |
| Owner | Time, squad ou papel (obrigatório para docs regidos) |
| Reviewer | Opcional; quem costuma revisar |
| Approver | Opcional; usado apenas se o time tiver um passo formal de aprovação |
| Review Cycle | Opcional; orientado a mudança por padrão. Registre um ciclo periódico só quando útil (sem frequência universal) |

## Notas

- Prefira nomes duráveis de time/papel a indivíduos em **Owner**.
- Deixe **Review Cycle** em branco quando a revisão for puramente orientada a mudança.
- Atualize esta matriz quando o ownership for transferido ([ownership.md](../ownership.md)).

## Documentos relacionados

- [../ownership.md](../ownership.md)
- [../review-policy.md](../review-policy.md)
- [../lifecycle.md](../lifecycle.md)
