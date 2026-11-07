# Examples / Exemplos

> Status: ACCEPTED
>
> Documentation Standard v1.0

Fictional adoption examples for the Engineering Documentation Standard (architecture methodology + technical contracts + operations & reliability + security + AI-ready).  
Exemplos ficcionais de adoção do Padrão de Documentação de Engenharia (metodologia de arquitetura + contratos técnicos + operações e confiabilidade + segurança + AI-ready).

**None of these examples describe real projects. / Nenhum destes exemplos descreve projetos reais.**

## Project examples / Exemplos de projeto

| Example / Exemplo | What it demonstrates / O que demonstra | EN | pt-BR |
| --- | --- | --- | --- |
| [simple-service/](simple-service/) | Simple request/response app: context, system, components, dependencies (+ system-context) / App request/response simples: contexto, sistema, componentes, dependências (+ system-context) | [en/](simple-service/en/) | [pt-BR/](simple-service/pt-BR/) |
| [adoption-scaffold/](adoption-scaffold/) | **Optional** empty Day 0 docs tree to copy / Árvore vazia **opcional** do Dia 0 para copiar | [en/](adoption-scaffold/en/) | [pt-BR/](adoption-scaffold/pt-BR/) |
| [fullstack-monolith/](fullstack-monolith/) | **Illustrative** FE+API+DB monolith (fictional SheetLedger). Suggested stack is **not** the standard. / Monólito FE+API+DB **ilustrativo** (SheetLedger ficcional). Stack sugerida **não** é o padrão. | [en/](fullstack-monolith/en/) | [pt-BR/](fullstack-monolith/pt-BR/) |
| [suggested-document-platform/](suggested-document-platform/) | **Illustrative only** document intelligence / RAG / SSR BFF / Flask / Slack / scheduler (fictional Northstar) — **NOT** the standard / **Apenas ilustrativo** inteligência documental / RAG / SSR BFF / Flask / Slack / scheduler (Northstar ficcional) — **NÃO** é o padrão | [en/](suggested-document-platform/en/) | [pt-BR/](suggested-document-platform/pt-BR/) |
| [distributed-system/](distributed-system/) | Multi-service order fulfillment: services, contracts, data flow, trust/failure domains / Fulfillment multi-serviço: serviços, contratos, fluxo de dados, domínios de confiança/falha | [en/](distributed-system/en/) | [pt-BR/](distributed-system/pt-BR/) |
| [event-driven-service/](event-driven-service/) | Event-driven inventory projector: producers, consumers, events, sequence, projection state / Projector de inventário event-driven: producers, consumers, eventos, sequência, estado da projeção | [en/](event-driven-service/en/) | [pt-BR/](event-driven-service/pt-BR/) |

## Contract examples / Exemplos de contratos

Standalone filled contracts (API, Event, Message, File) using the shared template.  
Contratos preenchidos autônomos (API, Event, Message, File) usando o template compartilhado.

| Entry / Entrada | Types / Tipos |
| --- | --- |
| [contracts/](contracts/) | [api-contract/](contracts/api-contract/), [event-contract/](contracts/event-contract/), [message-contract/](contracts/message-contract/), [file-contract/](contracts/file-contract/) |

See [contracts/README.md](contracts/README.md) for the bilingual chooser.  
Veja [contracts/README.md](contracts/README.md) para o seletor bilíngue.

## Operations examples / Exemplos de operações

Standalone filled operations & reliability samples (service profile, runbook, incident, failure mode, SLI, SLO, recovery).  
Amostras preenchidas de operações e confiabilidade (service profile, runbook, incidente, modo de falha, SLI, SLO, recovery).

| Entry / Entrada | Types / Tipos |
| --- | --- |
| [operations/](operations/) | [service-profile/](operations/service-profile/), [runbook/](operations/runbook/), [incident/](operations/incident/), [failure-mode/](operations/failure-mode/), [sli/](operations/sli/), [slo/](operations/slo/), [recovery-procedure/](operations/recovery-procedure/) |

See [operations/README.md](operations/README.md) for the bilingual chooser.  
Veja [operations/README.md](operations/README.md) para o seletor bilíngue.

## Adopter tooling / Ferramentas para adotantes

| Entry / Entrada | Purpose / Propósito |
| --- | --- |
| [adopter-ci-starter/](adopter-ci-starter/) | Optional CI checks (path parity, frontmatter, basic links) / Checagens CI opcionais (paridade, frontmatter, links básicos) |
| [adopter-agent-starter/](adopter-agent-starter/) | Optional `AGENTS.md` / `CLAUDE.md`, Cursor rules, and skills / `AGENTS.md` / `CLAUDE.md`, rules Cursor e skills opcionais |

## Security examples / Exemplos de segurança

Standalone filled security samples (asset, threat, risk, requirement, control, vulnerability, exception, incident, security-test, security-review).  
Amostras preenchidas de segurança (asset, threat, risk, requirement, control, vulnerability, exception, incident, security-test, security-review).

| Entry / Entrada | Types / Tipos |
| --- | --- |
| [security/](security/) | [asset/](security/asset/), [threat/](security/threat/), [risk/](security/risk/), [requirement/](security/requirement/), [control/](security/control/), [vulnerability/](security/vulnerability/), [exception/](security/exception/), [incident/](security/incident/), [security-test/](security/security-test/), [security-review/](security/security-review/) |

See [security/README.md](security/README.md) for the bilingual chooser.  
Veja [security/README.md](security/README.md) para o seletor bilíngue.

## AI-ready examples / Exemplos AI-ready

Standalone filled AI-ready samples (document metadata, claim, relationship, component, knowledge-gap, contradiction, ai-task-context, documentation-change, ai-change-record).  
Amostras preenchidas AI-ready (document metadata, claim, relationship, component, knowledge-gap, contradiction, ai-task-context, documentation-change, ai-change-record).

| Entry / Entrada | Types / Tipos |
| --- | --- |
| [ai-ready/](ai-ready/) | [document-metadata/](ai-ready/document-metadata/), [claim/](ai-ready/claim/), [relationship/](ai-ready/relationship/), [component/](ai-ready/component/), [knowledge-gap/](ai-ready/knowledge-gap/), [contradiction/](ai-ready/contradiction/), [ai-task-context/](ai-ready/ai-task-context/), [documentation-change/](ai-ready/documentation-change/), [ai-change-record/](ai-ready/ai-change-record/) |

See [ai-ready/README.md](ai-ready/README.md) for the bilingual chooser.  
Veja [ai-ready/README.md](ai-ready/README.md) para o seletor bilíngue.

Each project example has mirrored trees:

| Language | Path pattern |
| --- | --- |
| English | `examples/<name>/en/` |
| Português (pt-BR) | `examples/<name>/pt-BR/` |

Use them to understand how templates compose — not as copy-paste production documentation.  
Use-os para entender como templates se compõem — não como documentação de produção para copiar e colar.
