# Ownership da Documentação

> Language: pt-BR | [English](../en/ownership.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Ownership torna a documentação mantível. Sem um owner claro, docs apodrecem em silêncio.

## Papéis

| Papel | Obrigatório? | Significado |
| --- | --- | --- |
| **Owner** | Recomendado para docs `ACCEPTED`; fortemente recomendado para docs substantivos | Time, squad ou papel estável responsável por manter o documento preciso |
| **Contributor** | Opcional | Pessoas que escrevem ou atualizam conteúdo sem ser owners do documento inteiro |
| **Reviewer** | Opcional | Pessoas que revisam precisão técnica ou operacional |
| **Approver** | Opcional | Pessoa ou papel que confirma a aceitação quando o time usa um passo formal de aprovação |

Owner é um **time, squad ou papel**, não um nome pessoal que some quando alguém sai. Nomes pessoais podem aparecer em registros de revisão, mas os metadados devem preferir identificadores duráveis.

Exemplos de bons owners:

- `platform-team`
- `payments-squad`
- `sre-oncall`
- `security-engineering`

Evite:

- apenas o primeiro nome de uma pessoa, sem time;
- owner vazio em docs `ACCEPTED` de longa duração.

## Quando o owner é esperado

| Tipo de documento | Expectativa de owner |
| --- | --- |
| Arquitetura, contratos, runbooks, segurança, observabilidade | Owner recomendado antes ou em `ACCEPTED` |
| ADRs | Owner ou grupo de decisão recomendado |
| Notas curtas / docs rascunho | Owner opcional |
| `DEPRECATED` / `ARCHIVED` | Manter o último owner conhecido quando útil para histórico |

## Como atribuir

1. Escolha o time ou papel que sentirá a dor se o doc estiver errado.
2. Registre `owner` no frontmatter YAML (preferido) ou nos metadados do cabeçalho do documento.
3. Opcionalmente liste `reviewers` e `approver`.
4. Para inventários entre muitos docs, use [templates/ownership-matrix.md](templates/ownership-matrix.md).

Exemplo:

```yaml
---
title: Order API Contract
status: ACCEPTED
owner: checkout-squad
reviewers:
  - platform-team
approver: checkout-em
updated: 2026-08-07
---
```

## Como transferir

1. Acordo sobre o novo owner (time/squad/papel).
2. Atualize `owner` nos metadados na mesma mudança que transfere a responsabilidade.
3. Notifique o novo owner pelo canal normal do projeto (review de PR basta quando ele aprova).
4. Se o documento estiver em mudança ativa, mantenha o status honesto (`REVIEW` se edições materiais estiverem em andamento).

Não deixe ownership em branco após uma reorganização. Prefira um owner de time interino a "ninguém".

## Registrando ownership

| Campo | Onde | Notas |
| --- | --- | --- |
| `owner` | Frontmatter YAML | Preferido |
| `reviewers` | YAML opcional | Lista de times/papéis ou handles conforme convenção do projeto |
| `approver` | YAML opcional | Papel ou pessoa única quando usado |
| Matriz de ownership | Doc opcional do projeto | Visão cruzada; não substitui o `owner` por documento |

Forma em blockquote para docs curtos:

```markdown
> Status: ACCEPTED
> Owner: platform-team
```

## Instantâneo de responsabilidades

| Papel | Deveres típicos |
| --- | --- |
| Owner | Garantir atualizações após mudanças relevantes; disparar revisão; aceitar ou rejeitar conteúdo stale |
| Contributor | Propor atualizações precisas; marcar unknowns; não inventar fatos |
| Reviewer | Verificar afirmações contra evidência; pedir classificação quando a certeza for pouco clara |
| Approver | Confirmar prontidão para `ACCEPTED` quando o time usa esse passo |

## Documentos relacionados

- [lifecycle.md](lifecycle.md)
- [status.md](status.md)
- [review-policy.md](review-policy.md)
- [standards.md](standards.md)
- [templates/ownership-matrix.md](templates/ownership-matrix.md)
