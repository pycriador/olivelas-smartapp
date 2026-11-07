# Operações de Deployment

> Language: pt-BR | [English](../en/deployment-operations.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar deploy, validate e rollback sob uma perspectiva **operacional**.

Este padrão **não** prescreve uma tool ou conjunto de comandos universal de deploy. Documente o pipeline real do projeto e os passos de verificação.

## Ciclo central

```text
Deploy → Validate → (Rollback if needed)
```

| Stage | Question |
| --- | --- |
| **Deploy** | Como uma mudança é liberada no ambiente-alvo? |
| **Validate** | Como operadores sabem que o release está healthy? |
| **Rollback** | Como um release ruim é desfeito — quando rollback é possível? |

## O que documentar

| Topic | Guidance |
| --- | --- |
| Environments | Quais ambientes existem e para que cada um serve |
| Change entry | Como um release é iniciado (pipeline, gate manual, etc.) — conforme usado |
| Artifacts | O que é deployed (image digest, package, config bundle — termos do projeto) |
| Preconditions | Estado necessário antes do deploy |
| Steps | Sequência de alto nível; link para docs canônicos de CI/CD — **sem comandos inventados** |
| Validation checks | Health, smoke, metrics, synthetic checks realmente usados |
| Success criteria | Quando o deploy é considerado completo |
| Failure criteria | Quando parar / fazer roll back / escalar |
| Rollback | Link [rollback.md](rollback.md); note mudanças irreversíveis |
| Owners | Quem pode aprovar/executar — [operational-ownership.md](operational-ownership.md) |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Comandos e caminhos

- Documente comandos, nomes de job ou passos de console **específicos do projeto** somente quando evidenciados.
- Prefira placeholders (`<environment>`, `<release-id>`) a nomes de cluster inventados.
- Nunca embuta secrets. Nunca invente comandos destrutivos “por completude”.

## Deploys planned vs emergency

Distinga releases normais de mudanças de emergência ([change-management.md](change-management.md)). Caminhos de emergência ainda precisam de validation e ownership claro.

## Documentos relacionados

- [change-management.md](change-management.md)
- [rollback.md](rollback.md)
- [operational-state.md](operational-state.md)
- [maintenance.md](maintenance.md)
- [runbooks/README.md](runbooks/README.md)
- [change-policy.md](change-policy.md) — completude de mudança de documentação
