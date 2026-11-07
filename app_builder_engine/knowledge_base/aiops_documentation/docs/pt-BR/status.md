# Política de Status do Documento

> Language: pt-BR | [English](../en/status.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

O status informa ao leitor o quanto pode confiar em um documento como orientação atual.

## Tokens de status permitidos

Apenas estes tokens de máquina em inglês são válidos:

| Status | Significado |
| --- | --- |
| `DRAFT` | Trabalho em andamento; pode estar incompleto ou incorreto |
| `REVIEW` | Pronto para revisão ou em revisão |
| `ACCEPTED` | Aprovado como documentação atual |
| `DEPRECATED` | Substituído ou não mais a fonte primária |
| `ARCHIVED` | Apenas histórico; não é orientação ativa |

**Não** invente nem armazene status como `FINAL`, `DONE`, `OK`, `GOOD`, `OLD`, `TEMP` ou `UPDATED`.

`UPDATED` descreve um ciclo de atualização (`ACCEPTED → REVIEW → ACCEPTED`), não um token armazenado. Veja [lifecycle.md](lifecycle.md).

## Quando usar cada status

### DRAFT

Use quando:

- o conteúdo ainda está sendo escrito;
- a estrutura existe, mas a evidência está incompleta;
- o documento não está pronto para revisão formal.

Não use `DRAFT` para documentos que os times já tratam como orientação autoritativa de produção.

### REVIEW

Use quando:

- o autor acredita que o documento está pronto para avaliação;
- uma mudança relevante moveu um doc `ACCEPTED` de volta para revisão;
- revisores estão verificando ativamente precisão e completude.

Não deixe `REVIEW` indefinidamente. Feche para `ACCEPTED` ou retorne a `DRAFT`.

### ACCEPTED

Use quando:

- a revisão está completa para o escopo atual;
- o documento é a descrição ou orientação atual aprovada;
- unknowns e limitações estão explícitos, não ocultos.

Owner é recomendado para docs `ACCEPTED`. Veja [ownership.md](ownership.md).

### DEPRECATED

Use quando:

- um documento ou design mais novo substituiu este;
- o tópico não é mais primário, mas leitores ainda podem encontrar o arquivo;
- você precisa de um aviso visível antes do arquivamento.

Marcadores obrigatórios: veja [deprecation.md](deprecation.md).

### ARCHIVED

Use quando:

- o documento não tem uso operacional;
- é mantido apenas para histórico ou contexto de auditoria.

Veja [archive-policy.md](archive-policy.md).

## Relação com metadados YAML

Prefira frontmatter YAML para docs substantivos:

```yaml
---
title: Checkout Architecture
status: ACCEPTED
owner: platform-team
updated: 2026-08-07
---
```

O campo `status` deve usar um dos cinco tokens permitidos acima.

Para docs curtos, a forma em blockquote permanece aceitável:

```markdown
> Status: ACCEPTED
```

Quando ambos existirem, o `status` YAML é autoritativo. Mantenha-os consistentes.

Regras completas de metadados: [standards.md](standards.md) — Metadados do documento.

## Transições permitidas

Siga a matriz de transições em [lifecycle.md](lifecycle.md). Resumo:

| De | Para |
| --- | --- |
| `DRAFT` | `REVIEW`, `ARCHIVED` |
| `REVIEW` | `ACCEPTED`, `DRAFT` |
| `ACCEPTED` | `REVIEW`, `DEPRECATED` |
| `DEPRECATED` | `ARCHIVED` |

Qualquer outra transição exige uma exceção explícita registrada nas notas de revisão.

## Responsabilidades

| Papel | Responsabilidade |
| --- | --- |
| Author / Contributor | Definir `DRAFT` ou mover para `REVIEW` quando pronto; manter o status honesto |
| Reviewer | Questionar precisão; pedir `DRAFT` se não estiver pronto; não aceitar fatos inventados |
| Approver / Owner | Confirmar `ACCEPTED` (ou processo equivalente do time); garantir que o owner esteja registrado |
| Qualquer pessoa que descubra staleness | Abrir revisão ou registrar dívida de documentação — não inventar um status "stale" |

## Callouts de depreciação e arquivamento

Quando o status for `DEPRECATED`:

- defina `Status: DEPRECATED` (YAML ou blockquote);
- registre **Replaced by**, **Deprecated on** e **Reason**;
- mantenha o documento legível até o arquivamento.

Quando o status for `ARCHIVED`:

- mova ou marque conforme [archive-policy.md](archive-policy.md);
- não apresente conteúdo arquivado como orientação atual;
- preserve contexto suficiente para o histórico.

## Práticas proibidas

- Usar strings de status livres em metadados.
- Pular `REVIEW` em docs substantivos de projeto que reclamam `ACCEPTED`.
- Tratar `DEPRECATED` como soft delete sem marcadores.
- Codificar frescor como status (`UPDATED`, `STALE`, `OLD`).

## Documentos relacionados

- [lifecycle.md](lifecycle.md)
- [ownership.md](ownership.md)
- [review-policy.md](review-policy.md)
- [deprecation.md](deprecation.md)
- [archive-policy.md](archive-policy.md)
- [standards.md](standards.md)
