# Política de Depreciação

> Language: pt-BR | [English](../en/deprecation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Depreciação marca um documento como não mais primário sem destruir imediatamente o histórico.

## Quando deprecar

Deprecie quando:

- um documento mais novo substitui este;
- o design ou interface não é mais recomendado;
- o documento enganaria se tratado como orientação atual;
- você precisa de uma janela de migração antes do arquivamento.

Prefira depreciação a edições silenciosas que apagam o fato de que um contrato ou arquitetura anterior existiu.

## Marcadores obrigatórios

Todo documento deprecated deve incluir:

| Marcador | Significado |
| --- | --- |
| **Status** | `DEPRECATED` (`status` YAML preferido, ou blockquote) |
| **Replaced by** | Link ou caminho para o documento sucessor (ou `None` explícito com motivo) |
| **Deprecated on** | Data ISO `YYYY-MM-DD` |
| **Reason** | Explicação curta de por que está deprecated |

Exemplo YAML:

```yaml
---
title: Legacy Order Events
status: DEPRECATED
owner: checkout-squad
updated: 2026-08-07
replaced_by: docs/contracts/order-updated.md
deprecated_on: 2026-08-07
deprecation_reason: Replaced by order-updated@v2 contract
---
```

Callout visível perto do topo (recomendado mesmo quando o YAML existe):

```markdown
> Status: DEPRECATED
>
> Replaced by: [order-updated.md](../contracts/order-updated.md)
> Deprecated on: 2026-08-07
> Reason: Replaced by order-updated@v2 contract
```

## Como deprecar

1. Garanta que exista um sucessor ou documente explicitamente que não há.
2. Defina status `DEPRECATED` com todos os marcadores obrigatórios.
3. Atualize links de entrada de docs ativos para apontar à substituição.
4. Deixe o arquivo deprecated legível — não esvazie o conteúdo no primeiro dia.
5. Comunique na mudança que introduziu a substituição (resumo do PR; changelog quando útil — [changelog-policy.md](changelog-policy.md)).

## Manter — não apagar imediatamente

Docs deprecated:

- preservam contexto de migração;
- evitam links históricos quebrados;
- ajudam IA e humanos a entender o que mudou.

Exclusão não é o primeiro passo. Arquive depois, quando o uso operacional acabar.

## Quando arquivar

Mova de `DEPRECATED` para `ARCHIVED` quando:

- nenhum procedimento operacional depende do documento;
- consumidores migraram;
- o arquivo é retido apenas para histórico.

Siga [archive-policy.md](archive-policy.md).

## Documentos relacionados

- [lifecycle.md](lifecycle.md)
- [status.md](status.md)
- [archive-policy.md](archive-policy.md)
- [standards.md](standards.md)
