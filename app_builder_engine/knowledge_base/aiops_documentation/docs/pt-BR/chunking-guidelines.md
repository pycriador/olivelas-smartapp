# Diretrizes de chunking

> Language: pt-BR | [English](../en/chunking-guidelines.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Orientação para dividir documentação em unidades lógicas adequadas à leitura e a indexação *futura*. Nenhuma implementação de RAG é especificada.

## Prefira chunks nativos do documento

| Unit | Use when |
| --- | --- |
| Whole document | Páginas curtas Reference/Context |
| `##` section | Docs médios com tópicos distintos |
| Table row / claim | Inventários e mapas de evidência |
| Runbook procedure step group | Procedimentos operacionais |

## Limites de contexto

Respeite boundaries — não mescle através deles às cegas:

1. **Lifecycle** — DRAFT vs ACCEPTED vs DEPRECATED
2. **Time** — Historical vs Current ([history-model.md](history-model.md))
3. **Classification** — Confirmed vs Inferred vs Proposed
4. **Authority** — Authoritative vs Informational
5. **Safety** — Referências de secrets vs config pública
6. **Domain** — Arquitetura vs Contract vs Ops vs Segurança a menos que a seção seja explicitamente cross-cutting

## Regras

- Não divida no meio de uma tabela sem repetir o header em outro lugar.
- Mantenha claim + referência de evidência no mesmo chunk quando possível.
- Preserve o `id` do documento e o heading da seção em qualquer metadado de excerpt derivado.
- Conteúdo Proposed deve permanecer rotulado se chunkado separadamente.

## Documentos relacionados

- [search-readiness.md](search-readiness.md)
- [ai-prompt-context.md](ai-prompt-context.md)
- [progressive-context.md](progressive-context.md)

