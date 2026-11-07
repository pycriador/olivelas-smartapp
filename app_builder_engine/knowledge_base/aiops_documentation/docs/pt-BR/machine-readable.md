# Documentação machine-readable

> Language: pt-BR | [English](../en/machine-readable.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Regras que tornam a documentação parseável e consistente para ferramentas e agentes de IA — sem exigir uma implementação específica de busca ou RAG.

## Objetivos

- Identificadores e metadados estáveis
- Headings e tabelas previsíveis
- Enums explícitos (status, classification, confidence, authority)
- Links relativos resolvíveis
- Inventários declarativos (manifest, registries)

## Requisitos

| Requirement | Rule |
| --- | --- |
| **Identifiers** | Use schemes from [document-identity.md](document-identity.md) |
| **Metadata** | YAML frontmatter per [document-metadata.md](document-metadata.md) |
| **Status** | English tokens only: `DRAFT` \| `REVIEW` \| `ACCEPTED` \| `DEPRECATED` \| `ARCHIVED` |
| **Classification** | `Confirmed` \| `Inferred` \| `Unknown` \| `Proposed` \| `Deprecated` for claims |
| **Dates** | ISO 8601 `YYYY-MM-DD` |
| **Links** | Relative Markdown links that resolve from the doc path |
| **Tables** | Header row required; one concept per column |
| **Code fences** | Language tag when applicable; never secret values |
| **Manifest** | Optional project inventory in [manifest-rules.md](manifest-rules.md) |

## Estruturas preferidas

Use tabelas ou listas YAML para:

- inventários de component / service;
- matrizes de dependência;
- mapas claim ↔ evidence;
- listas de relacionamento com predicados tipados.

Prefira:

```markdown
| ID | Name | Type | Owner | Status |
| --- | --- | --- | --- | --- |
| CMP-001 | checkout-api | Component | platform-team | ACCEPTED |
```

A parágrafos não estruturados que enterram os mesmos fatos.

## Regras de encoding

- Filenames: `kebab-case.md`
- Enumerations: English machine tokens (not translated)
- Boolean-like fields: `true` / `false` in YAML; avoid “yes/no” ambiguity in metadata
- Null / missing: omit optional fields, or use explicit `Unknown` in prose/tables — do not invent placeholders that look like real data

## O que machine-readable não é

- Não é exigência de emitir JSON-LD, RDF ou OpenAPI para cada página
- Não é mandato de embeddings ou índices de chunks
- Não é permissão para remover narrativa legível por humanos quando a narrativa ajuda a compreensão

## Documentos relacionados

- [document-metadata.md](document-metadata.md)
- [manifest-rules.md](manifest-rules.md)
- [search-readiness.md](search-readiness.md)
- [chunking-guidelines.md](chunking-guidelines.md)
- [standards.md](standards.md)

