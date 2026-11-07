# Dívida de Documentação

> Language: pt-BR | [English](../en/documentation-debt.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0

Dívida de documentação é dívida técnica: lacunas ou imprecisões conhecidas que reduzem confiança, atrasam entrega ou aumentam risco operacional.

Trate-a com a mesma seriedade da dívida de código — visível, com owner, priorizada e corrigida ou explicitamente aceita como risco.

## Tipos de dívida

| Tipo | Descrição |
| --- | --- |
| Missing document | Tópico obrigatório sem doc canônico |
| Incomplete document | Estrutura existe, mas seções críticas estão vazias ou Unknown sem plano |
| Stale document | Conteúdo não corresponde mais ao comportamento do sistema |
| Incorrect document | Conteúdo está errado ou enganoso |
| Orphan document | Sem owner; não está claro quem mantém |
| Duplicate / conflicting | Múltiplas fontes discordam sem link canônico |
| Missing contract | Interface existe, mas não está documentada |
| Missing runbook | Procedimento operacional necessário, mas ausente |
| Weak classification | Afirmações apresentadas como fato sem evidência ou marcas Confirmed/Inferred/Unknown/Proposed |
| Translation lag | Projetos bilíngues em que um idioma está atrasado (quando a política de idioma se aplica) |

## Campos do registro

Mantenha um registro simples (issue tracker, tabela Markdown ou backlog do projeto). Cada item deve incluir:

| Campo | Significado |
| --- | --- |
| **ID** | Identificador estável (por exemplo `DOC-012`) |
| **Description** | O que está errado ou ausente |
| **Impact** | Quem/o que falha se não resolvido (resposta a incidente, onboarding, integradores, segurança) |
| **Owner** | Time, squad ou papel responsável |
| **Priority** | `High` / `Medium` / `Low` |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

Exemplo de linha:

| ID | Description | Impact | Owner | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| DOC-014 | Checkout runbook missing rollback steps | On-call delay during failed deploy | checkout-squad | High | Open |

## Prioridade

| Priority | Orientação |
| --- | --- |
| **High** | Precisão de segurança, operação de produção ou contrato externo em risco |
| **Medium** | Lacuna material de entendimento; workarounds existem |
| **Low** | Completude nice-to-have; baixo raio de explosão operacional |

## Status da dívida

| Status | Significado |
| --- | --- |
| `Open` | Reconhecida, não iniciada |
| `In Progress` | Em correção ativa |
| `Resolved` | Corrigida e verificada (docs atualizados / revisados conforme necessário) |
| `Accepted Risk` | Explicitamente adiada; impacto entendido pelo owner |

`Accepted Risk` é uma decisão, não negligência. Registre quem aceitou e por quê.

## Relação com ciclo de vida e revisão

- Descobrir dívida não inventa um novo token de status de documento.
- Corrigir dívida material em um doc `ACCEPTED` usa `ACCEPTED → REVIEW → ACCEPTED`.
- Sinais de staleness frequentemente viram itens de dívida — veja [stale-documentation.md](stale-documentation.md).
- Trabalho orientado a mudança que não consegue terminar docs no mesmo PR deve abrir dívida conforme [change-policy.md](change-policy.md).

## Práticas

- Prefira poucos itens de dívida precisos a um cemitério de tickets vagos.
- Vincule IDs de dívida a review records e descrições de PR.
- Feche ou re-priorize durante revisões periódicas quando usadas.
- Não esconda lacunas Known como conteúdo Confirmed.

## Registro deste repositório

Registro de instância **deste repo do Documentation Standard** (não é exemplo para adotantes). A linha `DOC-014` acima permanece ilustração fictícia.

| ID | Description | Impact | Owner | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| DOC-015 | Agents, hooks e slash commands do Cursor não estão empacotados (credai-api / lead-qualify também os omitem). Só adicionar quando existir um workflow concreto (por exemplo um comando `/docs-validate`). | Adotantes que quiserem commands do Cursor precisam inventá-los localmente | documentation-standard | Low | Open |

## Documentos relacionados

- [change-policy.md](change-policy.md)
- [stale-documentation.md](stale-documentation.md)
- [review-policy.md](review-policy.md)
- [quality-model.md](quality-model.md)
- [lifecycle.md](lifecycle.md)
