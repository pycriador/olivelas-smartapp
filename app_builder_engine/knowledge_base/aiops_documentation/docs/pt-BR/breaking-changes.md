# Breaking Changes

> Language: pt-BR | [English](../en/breaking-changes.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como caracterizar, identificar, comunicar, versionar, migrar e depreciar breaking changes de contrato.

Este padrão **não manda uma única estratégia de migração**. Define as expectativas de processo.

## O que caracteriza uma breaking change

Uma mudança é breaking quando pode fazer um participante previamente conforme falhar, se comportar mal ou interpretar mal o contrato sob comportamento documentado (ou razoavelmente assumido).

Casos comuns:

| Change | Why breaking |
| --- | --- |
| Remove field / operation | Consumers podem exigí-lo |
| Rename without alias | Nomes hard-coded falham |
| Change type | Parsing/validação falha |
| Change semantics | Mesmos bytes, significado errado |
| Make optional → required | Producers/clients despreparados |
| Tighten validation | Payloads previamente válidos rejeitados |
| Change error meaning | Retry/automação reage de forma errada |
| Change auth requirements | Callers falham fechados |

Identidade estrutural com mudança semântica ainda é breaking ([semantic-contracts.md](semantic-contracts.md)).

## Como identificar

1. Diff de schema e comportamento documentado (Added / Removed / Changed / Deprecated).
2. Mapeie cada delta para producers e consumers conhecidos.
3. Pergunte: um participante conforme construído contra a versão anterior ainda estaria correto?
4. Se o impacto for pouco claro, rotule **Unknown Impact** — não auto-classifique como seguro.
5. Use os nove pontos de [contract-change-management.md](contract-change-management.md).

## Como comunicar

- Notifique contract, producer e consumer owners ([contract-ownership.md](contract-ownership.md)).
- Declare o que quebra, quem é afetado, timeline e caminho de migração.
- Atualize o documento do contrato e links relacionados de arquitetura/integração.
- Prefira aviso explícito de depreciação antes da remoção quando participantes precisarem de tempo.

## Como versionar

- Publique uma nova identidade de versão de contrato para acordos incompatíveis ([contract-versioning.md](contract-versioning.md)).
- Não sobrescreva silenciosamente `@v1` com comportamento incompatível.
- Mantenha a versão anterior disponível até deprecated/archived.

## Como migrar

Escolha uma estratégia que caiba no projeto (exemplos — não obrigatórios):

| Strategy | Idea |
| --- | --- |
| Dual publish | Producer emite antigo e novo por uma janela |
| Expand/contract | Expand additive, migre consumers, depois remova |
| Flagged cutover | Troca coordenada com feature flag |
| Big-bang | Cutover único quando o conjunto de participantes for pequeno e controlado |

Documente a estratégia escolhida, owners e critérios de sucesso. Registre Unknowns.

## Como depreciar a versão anterior

1. Marque a versão anterior `DEPRECATED` com `replaced_by`, datas e motivo ([deprecation.md](deprecation.md)).
2. Declare a janela de suporte e o que acontece depois (reject, ignore, archive).
3. Arquive quando não restar uso operacional ([archive-policy.md](archive-policy.md)).
4. Remova apenas após evidência de migração ou risco aceito.

## Documentos relacionados

- [contract-compatibility.md](contract-compatibility.md)
- [contract-versioning.md](contract-versioning.md)
- [contract-change-management.md](contract-change-management.md)
- [contract-lifecycle.md](contract-lifecycle.md)
- [deprecation.md](deprecation.md)
