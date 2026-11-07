# Metadados do Documento

> Language: pt-BR | [English (EN)](../en/document-metadata.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Campos canônicos de metadados YAML para documentação de projeto substantiva e AI-ready.

Alinha-se e estende Document Metadata de [standards.md](standards.md). Quando YAML e o blockquote de cabeçalho declararem `status`, o YAML é authoritative; mantenha-os consistentes.

## Campos Obrigatórios

| Campo | Tipo | Significado |
| --- | --- | --- |
| `id` | string | Identidade estável do documento (veja [document-identity.md](document-identity.md)) |
| `title` | string | Título do documento |
| `type` | string | Token de tipo de documento de [document-types.md](document-types.md) |
| `status` | enum | `DRAFT` \| `REVIEW` \| `ACCEPTED` \| `DEPRECATED` \| `ARCHIVED` |
| `owner` | string | Time, squad ou papel durável |
| `created` | date | Data de criação (`YYYY-MM-DD`) |
| `updated` | date | Última atualização significativa de conteúdo (`YYYY-MM-DD`) |

## Campos Recomendados

| Campo | Tipo | Significado |
| --- | --- | --- |
| `source` | string / list | Origem(ns) Authoritative: caminho de código, id de contrato, ADR, config, URL de ticket |
| `classification` | string | Classificação padrão de claim para conteúdo incerto quando útil (`Confirmed` / `Inferred` / `Unknown` / `Proposed`) |
| `review` | object / fields | Rastreamento de review — prefira `review_date`, opcionais `reviewers`, `approver`, `next_review` |

Formato recomendado de review:

```yaml
review_date: 2026-08-07
reviewers:
  - platform-team
approver: engineering-manager
next_review: 2026-11-07
```

## Campos Opcionais

| Campo | Tipo | Significado |
| --- | --- | --- |
| `version` | string | Versão do conteúdo do documento ([versioning.md](versioning.md)) |
| `authority` | string | Nível de autoridade ([authority-levels.md](authority-levels.md)) |
| `confidence` | string | Confiança padrão para resumos sintetizados — **não** é status de ciclo de vida ([confidence-model.md](confidence-model.md)) |
| `replaces` | string / list | Id(s) ou caminho(s) de documento anterior |
| `replaced_by` | string | Sucessor quando deprecated |
| `deprecated_on` | date | Data de depreciação |
| `deprecation_reason` | string | Por que foi deprecated |
| `tags` | list | Tags livres do projeto (mantenha poucas) |
| `related` | list | Ids ou caminhos relativos de documentos relacionados |
| `components` | list | Ids de componentes cobertos por este doc |
| `services` | list | Ids de services cobertos por este doc |
| `language` | string | `en` ou `pt-BR` quando útil para tooling |
| `standard` | string | ex. `Documentation Standard v1.0` |

## Exemplo

```yaml
---
id: ARCH-001
title: Checkout Architecture Overview
type: Architecture
status: ACCEPTED
owner: platform-team
created: 2026-01-10
updated: 2026-08-07
source:
  - src/checkout/
  - ADR-012
classification: Confirmed
review_date: 2026-08-07
reviewers:
  - platform-team
approver: engineering-manager
version: "1.2.0"
authority: Authoritative
related:
  - CONTRACT-001
  - OPS-001
---
```


## Enforcement

Nem todo documento de um corpus precisa carregar todo campo Required no primeiro dia. Para documentos **Authoritative** listados no manifesto, a automação aplica `owner` (e consistência de path/id). Veja [validation-rules.md](validation-rules.md) e [../validation-config.yaml](../validation-config.yaml).

Projetos adotantes podem endurecer campos Required gradualmente via exceções de governança — nunca silenciando ERROR sem registro.

## Regras

1. Não invente owners; use o processo de ownership Unknown de [ownership.md](ownership.md).
2. Não defina `status: ACCEPTED` apenas via IA ([ai-documentation.md](ai-documentation.md)).
3. `classification` nos metadados é um **padrão**, não uma afirmação blanket de que cada frase é Confirmed.
4. Mantenha pares bilíngues consistentes quando ambos os idiomas existirem ([language.md](language.md)).

## Documentos Relacionados

- [standards.md](standards.md)
- [document-identity.md](document-identity.md)
- [document-types.md](document-types.md)
- [lifecycle.md](lifecycle.md)
- [status.md](status.md)
