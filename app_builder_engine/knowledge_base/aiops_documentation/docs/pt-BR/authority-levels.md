# Níveis de autoridade

> Language: pt-BR | [English](../en/authority-levels.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Authority descreve o peso que um documento ou fonte deve ter ao responder ou alterar documentação. Authority **não** é status de ciclo de vida e **não** é classificação de claim.

## Níveis

| Level | Meaning | Typical sources |
| --- | --- | --- |
| **Authoritative** | Canônico para o seu escopo; conflitos devem ser resolvidos contra ele ou alterando-o deliberadamente | Contratos aceitos, ADRs aceitos (para decisões), docs SoT primários, schemas de produção |
| **Verified** | Verificado contra fontes Authoritative ou evidência de runtime; síntese confiável | Overview de arquitetura revisado com citações de código |
| **Informational** | Contexto útil; pode estar incompleto; insuficiente sozinho para claims Confirmed de ops/segurança | Guias de onboarding, diagramas sem links de evidência |
| **Reference** | Ponteiros, glossários, índices, specs externas adotadas pelo nome | Glossary, manifest, índice de standards |
| **Historical** | Verdadeiro para um estado passado; não é SoT atual | Incidente arquivado, ADR substituído mantido por histórico |
| **Draft** | Em andamento; pode mudar; não tratar como verdade de produção atual | Documentos `status: DRAFT` |
| **Unknown** | Authority não estabelecida | Doc órfão, owner ausente, proveniência unclear |

## Mapeamento para status de ciclo de vida

| Lifecycle `status` | Default authority (unless overridden) |
| --- | --- |
| `DRAFT` | Draft |
| `REVIEW` | Informational (ou Verified se complete de evidência pendente de aceite) |
| `ACCEPTED` | Authoritative ou Verified conforme o papel de SoT |
| `DEPRECATED` | Historical (a menos que ainda Authoritative até a substituição ser aceita — então documente o dual-state explicitamente) |
| `ARCHIVED` | Historical |

## Regras

1. Declare `authority` nos metadados quando a ambiguidade enganaria IA ou humanos.
2. Nunca trate Draft ou Unknown como Authoritative.
3. Conteúdo Historical ainda pode ser Confirmed *para o passado* — rotule o escopo temporal.
4. Authority não sobrescreve [ai-context-safety.md](ai-context-safety.md).

## Documentos relacionados

- [source-of-truth.md](source-of-truth.md)
- [status.md](status.md)
- [history-model.md](history-model.md)

