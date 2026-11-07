# Regras do manifest

> Language: pt-BR | [English](../en/manifest-rules.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Regras para inventários `manifest.yaml` (ou equivalente) de documentação.

## Propósito

Fornecer uma lista machine-readable de documentos-chave para navegação, coverage e indexação futura — não um motor de busca.

## Localização

Default neste repositório: [`docs/pt-BR/manifest.yaml`](manifest.yaml) (espelho de [`docs/en/manifest.yaml`](../en/manifest.yaml)). Projetos em adoção podem manter um manifest no nível do projeto.

## Campos obrigatórios da entrada

| Campo | Significado |
| --- | --- |
| `id` | Document id |
| `path` | Path relative to `docs/pt-BR/` (or declared root) |
| `title` | Title |
| `type` | Document type |
| `status` | Lifecycle status |

## Campos recomendados da entrada

| Campo | Significado |
| --- | --- |
| `owner` | Owner |
| `updated` | ISO date |
| `authority` | Authority level |
| `tags` | Short tags |
| `related` | Other ids |

## Regras

1. Paths devem resolver.
2. `status` deve corresponder ao documento (blockquote/YAML).
3. Não liste arquivos que contenham secrets.
4. Prefira listar hubs e docs SoT; listagem do corpus completo é opcional.
5. Mantenha tokens em inglês.

## Formato de amostra

```yaml
standard: "Documentation Standard v1.0"
root: "."
documents:
  - id: CTX-AI-001
    path: ai-context.md
    title: AI Context
    type: Context
    status: ACCEPTED
    owner: documentation-standard
    updated: 2026-08-07
    authority: Authoritative
```

## Documentos relacionados

- [manifest.yaml](manifest.yaml)
- [machine-readable.md](machine-readable.md)
- [document-metadata.md](document-metadata.md)

