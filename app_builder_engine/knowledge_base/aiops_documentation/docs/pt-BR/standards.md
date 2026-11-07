# Padrões de Documentação

> Language: pt-BR | [English](../en/standards.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0

Convenções de estrutura, formatação, nomenclatura, status, classificação, metadados, document IDs, referências, diagramas, contratos, operações, segurança e documentação AI-ready.

## Hierarquia de títulos

Use uma hierarquia consistente. Não pule níveis arbitrariamente.

```text
# Document

## Section

### Subsection

#### Detail
```

Regras:

- Um título `#` por documento.
- Seções começam em `##`.
- Use `###` e `####` apenas para detalhe aninhado.
- Prefira estrutura rasa; divida em outro documento quando a profundidade crescer.

## Títulos

- Títulos devem ser específicos e fáceis de escanear.
- Prefira frases nominais: `Payment Authorization Flow`, não `How we do payments`.
- Documentos baseados em template podem manter o padrão de título do template (por exemplo `ADR-001 — Prefer Asynchronous Boundaries`).

## Tabelas

Use tabelas para comparações estruturadas, inventários e matrizes.

| Prefira tabelas para | Prefira listas para |
| --- | --- |
| Inventários | Sequências de passos |
| Matrizes de status | Fatos curtos sem ordem |
| Comparações | Hierarquias aninhadas |

Toda tabela deve ter uma linha de cabeçalho.

## Listas

- Use listas ordenadas para procedimentos e sequências.
- Use listas não ordenadas para conjuntos sem ordem.
- Mantenha os itens paralelos na gramática.
- Evite listas profundamente aninhadas; reestruture em vez disso.

## Código

- Use blocos de código delimitados com tag de linguagem quando aplicável.
- Mantenha exemplos mínimos e relevantes.
- Nunca inclua valores de segredos nos exemplos.
- Prefira placeholders como `<API_KEY>` ou `$API_KEY`.

## Diagramas

- Prefira formatos versionáveis em texto.
- Use Mermaid quando apropriado.
- Crie um diagrama apenas quando melhorar a compreensão.
- Mantenha diagramas alinhados ao estado atual, a menos que estejam rotulados como Proposed.

Veja [templates/diagram.md](templates/diagram.md).

## Referências e links

Referências devem ajudar o leitor a encontrar a origem da informação.

| Tipo de referência | Forma preferida |
| --- | --- |
| Outro documento (mesma árvore) | Link relativo em Markdown: `[Architecture](architecture/README.md)` — o sync reescreve para URLs de página do Confluence |
| Outro repositório GitHub | Link curto `org/repo` uma vez; depois caminho + URLs `blob` para arquivos — [publishing-surfaces.md](publishing-surfaces.md) |
| Arquivo-fonte / config (citação) | Caminho relativo ao repositório **e** URL `blob` do GitHub (`#Lstart-Lend` opcional) |
| Módulo | Caminho do módulo ou nome do pacote usado pelo projeto |
| Configuração | Caminho + nome da chave (nunca o valor do segredo) + link blob ao citar |
| Infraestrutura | Caminho para IaC/manifesto ou identificador nomeado + link blob ao citar |
| Ticket | URL completa do tracker ou ID estável do ticket |
| ADR | `ADR-XXX` mais link para o arquivo do ADR |
| Contract | Link para o documento canônico do contrato |

Documentos publicados no Confluence devem permanecer navegáveis nas **duas** superfícies: links de páginas do Confluence (via `docs-sync --relink`) e links de origem / código no GitHub (rodapé com `repository_url` + citações blob explícitas). Regras completas: [publishing-surfaces.md](publishing-surfaces.md).

Evite referências vagas como:

> Isso está configurado em outro lugar.

Prefira:

> A política de retry está definida em `docs/contracts/order-created.md` sob **Retry Behavior**.

## Convenções de nomenclatura

| Artefato | Convenção | Exemplo |
| --- | --- | --- |
| Diretórios | `kebab-case` | `event-driven-service` |
| Arquivos Markdown | `kebab-case.md` | `project-overview.md` |
| ADRs | `adr-XXX-short-title.md` | `adr-001-use-async-boundary.md` |
| Templates | `kebab-case` descritivo | `runbook.md` |
| Títulos de diagramas | descritivos, orientados ao estado atual | `Checkout request flow` |

Evite espaços em nomes de arquivo.

## Dadoss

- Use ISO 8601: `YYYY-MM-DD`.
- Exemplo: `2026-08-07`.

## Versões

- Documente a versão do padrão como `Documentation Standard vMAJOR.MINOR` (e `.PATCH` quando necessário).
- Documentos de projeto podem incluir versionamento de conteúdo e campos `updated` / `review_date`.
- Versionamento de contratos e APIs pertence aos documentos de contrato, não apenas à prosa.

Veja [versioning.md](versioning.md).


## Document IDs

Documentos substantivos devem carregar um `id` estável no frontmatter YAML (por exemplo `ARCH-001`, `CONTRACT-001`, `OPS-001`, `SEC-001`).

| Rule | Guidance |
| --- | --- |
| Stability | IDs não mudam quando títulos ou paths mudam |
| Uniqueness | Único no projeto; não recicle após deprecação |
| Schemes | Siga [document-identity.md](document-identity.md); preserve convenções existentes de ADR/runbook/incident |
| Canonical names | Pareie IDs com nomes canônicos ([style-guide.md](style-guide.md)) |

IDs de component e service (`CMP-XXX`, `SVC-XXX`, ou nomes estáveis do projeto) pertencem a registries e também a docs de component.

## Metadados do documento


Docs substantivos de projeto devem declarar metadados em frontmatter YAML.

**Catálogo canônico de campos (Required / Recommended / Optional), incluindo `id`, `type`, `source`, `classification` e campos de review:** veja [document-metadata.md](document-metadata.md).

Mínimo obrigatório para docs substantivos (overview, arquitetura, contratos, runbooks, segurança, observabilidade e ADRs quando aplicável):

| Campo | Tipo | Significado |
| --- | --- | --- |
| `title` | string | Título do documento |
| `status` | enum | `DRAFT` \| `REVIEW` \| `ACCEPTED` \| `DEPRECATED` \| `ARCHIVED` |
| `owner` | string | Time, squad ou papel estável |
| `updated` | date | Última atualização significativa de conteúdo (`YYYY-MM-DD`) |

Fortemente recomendados para docs AI-ready / inventariáveis:

| Campo | Tipo | Significado |
| --- | --- | --- |
| `id` | string | Identidade estável do documento ([document-identity.md](document-identity.md)) |
| `type` | string | Token de tipo de documento ([document-types.md](document-types.md)) |
| `created` | date | Data de criação |

Opcionais (veja a lista completa em [document-metadata.md](document-metadata.md)):

| Campo | Tipo | Significado |
| --- | --- | --- |
| `review_date` | date | Data da última revisão quando rastreada |
| `version` | string | Versão de conteúdo do documento (veja [versioning.md](versioning.md)) |
| `source` | string / list | Origem(ns) autoritativa(s) |
| `classification` | string | Classificação padrão de claim quando útil |
| `authority` | string | Nível de autoridade ([authority-levels.md](authority-levels.md)) |
| `replaced_by` | string | Caminho ou link do sucessor quando deprecated |
| `deprecated_on` | date | Data de depreciação |
| `deprecation_reason` | string | Por que o documento foi deprecated |
| `reviewers` | list/string | Revisores habituais |
| `approver` | string | Papel/pessoa aprovadora quando usado |
| `classification_default` | string | Alias/nome legado para classification padrão quando útil |

Exemplo:

```yaml
---
id: ARCH-001
title: Checkout Architecture
type: Architecture
status: ACCEPTED
owner: platform-team
updated: 2026-08-07
created: 2026-01-10
review_date: 2026-08-07
version: "1.2.0"
---
```

### Link entre línguas e blockquote de Status

Coloque o blockquote do link entre línguas **depois** do frontmatter (ou use ambos os padrões com cuidado):

```markdown
---
id: ARCH-001
title: Checkout Architecture
status: ACCEPTED
owner: platform-team
updated: 2026-08-07
---

# Checkout Architecture

> Language: pt-BR | [English](../en/architecture/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
```

Regras:

- Prefira `status` YAML para templates e docs substantivos.
- O blockquote `> Status:` permanece permitido para docs curtos e cabeçalhos fáceis de escanear.
- Quando ambos existirem, o `status` YAML é autoritativo; mantenha-os consistentes.
- Não invente tokens de status. Detalhes do ciclo de vida: [lifecycle.md](lifecycle.md), [status.md](status.md).

## Status do documento

Valores permitidos (apenas tokens de máquina em inglês):

| Status | Significado |
| --- | --- |
| `DRAFT` | Trabalho em andamento |
| `REVIEW` | Pronto para revisão ou em revisão |
| `ACCEPTED` | Documentação atual aprovada |
| `DEPRECATED` | Substituído ou não mais recomendado |
| `ARCHIVED` | Apenas histórico |

`UPDATED` não é um status armazenado. Mudanças relevantes usam `ACCEPTED → REVIEW → ACCEPTED`.

Ciclo de vida completo, transições, ownership e regras de depreciação/arquivamento:

- [lifecycle.md](lifecycle.md)
- [status.md](status.md)
- [ownership.md](ownership.md)
- [deprecation.md](deprecation.md)
- [archive-policy.md](archive-policy.md)
- [contract-lifecycle.md](contract-lifecycle.md) — contratos usam os mesmos tokens; sem ciclo de vida paralelo

## Classificação da informação

Classifique afirmações quando a certeza importar — especialmente em conteúdo gerado por IA.

| Classification | Significado | Quando usar |
| --- | --- | --- |
| **Confirmed** | Verificado contra uma fonte autoritativa | Código, config, contrato, teste ou ADR aceito sustenta a afirmação |
| **Inferred** | Deduzido de evidências, não declarado explicitamente | Conclusão razoável a partir de múltiplos sinais |
| **Unknown** | Não identificado | Evidência ausente; não invente |
| **Proposed** | Sugestão ou estado futuro | Roadmap, design candidato, não comportamento atual |

Forma inline recomendada:

```markdown
- Retry limit is 3. <!-- Classification: Confirmed -->
- Message ordering appears FIFO per partition. <!-- Classification: Inferred -->
- Multi-region failover strategy: Unknown.
- Move to event sourcing. <!-- Classification: Proposed -->
```

Forma alternativa no nível da seção:

```markdown
## Failure Handling

Classification: Inferred

...
```

Regras:

- Conteúdo novo e incerto deve defaultar para Unknown, não Confirmed.
- Nunca apresente Proposed como estado atual.
- Prefira Confirmed para afirmações operacionais e de segurança antes do status ACCEPTED.

## Identificadores

| Identificador | Formato | Exemplo |
| --- | --- | --- |
| ADR | `ADR-XXX` | `ADR-012` |
| Runbook | kebab curto ou ID alinhado a ticket | `rb-checkout-timeout` |
| Incident | esquema do projeto; recomenda-se id datado | `INC-20260807-01` |
| Alert | kebab curto ou id do sistema de monitoring | `alert-checkout-error-rate` |
| Failure mode | id kebab curto | `fm-payment-timeout` |
| Contract | nome estável + versão | `order-created@v1` |
| Component | nome estável local ao projeto | `checkout-api` |
| Service | nome estável local ao projeto | `checkout-api` |
| Threat | `THR-XXX` ou kebab curto | `THR-012`, `threat-token-theft` |
| Segurança risk | `RISK-XXX` | `RISK-007` |
| Segurança control | `CTRL-XXX` | `CTRL-015` |
| Segurança requirement | `REQ-SEC-XXX` ou esquema do projeto | `REQ-SEC-003` |
| Vulnerability | `VULN-XXX` | `VULN-042` |
| Segurança exception | `EXC-XXX` | `EXC-004` |
| Segurança asset | `AST-XXX` | `AST-011` |
| Segurança evidence | `EVD-<topic>-<YYYYMMDD>` | `EVD-authn-review-20260807` |
| Segurança test | `SECTEST-XXX` | `SECTEST-002` |

Use identificadores estáveis em links e referências cruzadas.

## Convenções de operações

Docs de operações e reliability seguem [operations-model.md](operations-model.md) e [operations/README.md](operations/README.md). As convenções abaixo são defaults — projetos podem adaptar quando já tiverem um esquema local mais claro.

### Runbook IDs

| Concern | Convention |
| --- | --- |
| ID | `rb-<short-name>` no frontmatter (`runbook_id`) e no filename quando útil |
| Severity | Frontmatter opcional `severity` usando o modelo do projeto (ex.: `SEV-1` … `SEV-4`) — [incident-severity.md](incident-severity.md) |
| Safety | Passos destrutivos/irreversíveis destacados antes da execução; sem comandos inventados |

### Incident IDs

| Concern | Convention |
| --- | --- |
| ID | Id único estável (exemplo: `INC-YYYYMMDD-NN`) |
| Severity | Declare o modelo do projeto; não auto-classifique sem contexto |
| Timestamps | ISO-8601 com timezone ou UTC explícito (`2026-08-07T15:04:05Z`) |
| Timeline entries | Marque `FACT` / `HYPOTHESIS` / `CONFIRMED` / `UNKNOWN` — [incident-timeline.md](incident-timeline.md) |
| Root cause | Pode permanecer **Unknown** enquanto o incidente estiver aberto |

### Criticality

Use o vocabulário de criticality do projeto ([criticality.md](criticality.md)). Níveis de exemplo: `Critical` / `High` / `Medium` / `Low`. Não invente criticality para um serviço sem evidência ou acordo do owner.

### Operational state

Prefira: `Healthy` / `Degraded` / `Unavailable` / `Recovering` / `Maintenance` / `Unknown` — [operational-state.md](operational-state.md).

### Metrics naming

| Concern | Convention |
| --- | --- |
| Stability | Prefira nomes estáveis e escaneáveis já usados pela telemetria do projeto |
| Definition | Documente fórmula/conjunto de eventos quando a métrica for SLI ou driver de decisão |
| Ambiguity | Para MTTR/MTTD/MTBF, documente clock start/end — [reliability-metrics.md](reliability-metrics.md) |
| Secrets / PII | Nunca documente valores de secret; evite PII desnecessário em exemplos de label de métrica |

### Ops references

| Reference | Preferred form |
| --- | --- |
| Runbook | Runbook ID + link relativo |
| Alert | Nome/ID do alert + link para runbook |
| Incident | Incident ID + link |
| SLO / SLI | Nome estável + link para definição |
| Arquitetura / contract | Link — não duplique prosa de componente ou schema |

## Convenções de segurança

Docs de segurança seguem [security-model.md](security-model.md) e [security/README.md](security/README.md). As convenções abaixo são defaults — projetos podem adaptar quando já tiverem um esquema local mais claro.

### Segurança entity IDs

| Entity | Convention | Example |
| --- | --- | --- |
| Threat | `THR-XXX` | `THR-012` |
| Risk | `RISK-XXX` | `RISK-007` |
| Control | `CTRL-XXX` | `CTRL-015` |
| Vulnerability | `VULN-XXX` | `VULN-042` |
| Exception | `EXC-XXX` | `EXC-004` |
| Asset | `AST-XXX` | `AST-011` |
| Evidence | `EVD-<topic>-<YYYYMMDD>` | `EVD-authn-review-20260807` |
| Segurança incident | Prefira incident id do projeto; prefixo `SEC-` opcional ou campo Type | `INC-20260807-01` (Type: Segurança) |
| Segurança debt | `SECDEBT-XXX` | `SECDEBT-014` |
| Segurança drift | `SEC-DRIFT-XXX` | `SEC-DRIFT-003` |

### Severity

Use o modelo de severity do projeto para vulnerabilities e security incidents. Não **auto-atribuir** severity só a partir de score de tool sem contexto de exposure do asset e compensating controls. Quando desconhecido: **Not Defined**.

Exemplos de SEV operacional permanecem em [incident-severity.md](incident-severity.md). Segurança incidents podem reutilizar esse modelo com Type = Segurança / Both — [security-incidents.md](security-incidents.md).

### Status (entidades de segurança)

Prefira vocabulários de status explícitos documentados na metodologia da entidade (vulnerability, exception, risk). Tokens comuns: `Open` / `In Progress` / `Resolved` / `Accepted Risk` / `Closed`. Não invente tokens de ciclo de vida de documento além dos cinco status padrão.

### Ownership

Todo artefato substantivo de segurança (asset, risk, control, vulnerability, exception, incident) deve nomear um **owner** (team/squad/role). Veja [security-ownership.md](security-ownership.md) e [ownership.md](ownership.md).

### Evidência naming

| Concern | Convention |
| --- | --- |
| ID | `EVD-<short-topic>-<YYYYMMDD>` quando útil |
| Location | Path, nome do system ou ticket — nunca valores secretos |
| Integrity | Note expectativas de authenticity/integrity ou **Not Defined** — [security-evidence.md](security-evidence.md) |
| Linkage | Evidence deve referenciar o control/requirement/risk/incident que sustenta |

### Segurança references

| Reference | Preferred form |
| --- | --- |
| Threat / risk / control | ID + link relativo |
| Vulnerability | `VULN-XXX` + link |
| Exception | `EXC-XXX` + link (inclua expiration no registro) |
| Evidence | `EVD-…` ou location + entidade linkada |
| Arquitetura / contract | Link — não duplique diagramas ou schemas |
| Ops runbook / alert | Link mecanismo compartilhado uma vez — [operations-security.md](operations-security.md) |

## Convenções de contrato

Contratos técnicos seguem [contract-model.md](contract-model.md) e a metodologia em [contracts/README.md](contracts/README.md). Naming e metadados abaixo são convenções — projetos podem adaptar quando já tiverem um esquema local mais claro.

### Contract naming

Prefira nomes de arquivo e de contrato previsíveis e fáceis de escanear em `kebab-case`.

Padrão de exemplo (não obrigatório):

```text
<domain>-<capability>-<contract-type>
```

Exemplos: `orders-create-api`, `inventory-adjusted-event`, `billing-export-file`.

**Não** force este padrão quando o projeto já tiver uma convenção estável e descoberta. Mantenha nomes estáveis uma vez publicados.

### Contract IDs e versões

| Concern | Convention |
| --- | --- |
| Contract ID | Nome estável + versão: `order-created@v1` |
| File name | Frequentemente corresponde ao nome estável: `order-created.md` (versão em metadados e/ou path) |
| Version bump | Siga [contract-versioning.md](contract-versioning.md); distinto da versão do Documentation Standard |

### Contract references

| Reference | Preferred form |
| --- | --- |
| From architecture / component | Link para o doc canônico do contrato |
| From other contracts | Link relativo em Markdown + contract ID |
| From code comments / ADRs | Contract ID (`order-created@v1`) mais link quando possível |

Evite colar schemas completos em docs de arquitetura; linke em vez disso.

### Schemas

- Documente campos com significado ([schema-documentation.md](schema-documentation.md)).
- Declare Source of Truth quando existirem Markdown e schemas de máquina ([contract-source-of-truth.md](contract-source-of-truth.md)).
- Não assuma uma linguagem de schema (JSON Schema, Protobuf, Avro, etc.).

### Contract status e ownership

- Tokens de status são os mesmos cinco: `DRAFT` \| `REVIEW` \| `ACCEPTED` \| `DEPRECATED` \| `ARCHIVED`.
- `owner` é o **contract owner** (obrigatório para contratos substantivos).
- Owners de producer e consumer podem diferir — [contract-ownership.md](contract-ownership.md).

### Campos de metadados de contrato

Além dos metadados padrão de documento, contratos podem declarar:

| Field | Required? | Meaning |
| --- | --- | --- |
| `title` | Required | Título do contrato |
| `status` | Required | Status de ciclo de vida |
| `owner` | Required | Contract owner (time/squad/papel) |
| `updated` | Required | Última atualização significativa |
| `version` | Recommended | String de versão do contrato ou do documento |
| `contract_type` | Recommended | `API` \| `Event` \| `Message` \| `File` \| `Command` \| `Callback` \| `Library` \| `Data` \| `Integration` (ou lista do projeto; múltiplos permitidos) |
| `protocol` | Optional | Protocolo/transporte real de interação — **não** assumido como HTTP |
| `producer` | Recommended when known | Sistema/componente que produz |
| `consumer` | Optional | Consumer primário, lista ou "multiple / see Participants"; marque Unknown se não identificado |
| `created` | Optional | Data de criação |
| `contract_id` | Optional | Id explícito quando distinto do title/filename (por exemplo `order-created@v1`) |

Exemplo:

```yaml
---
title: Order Accepted Event
status: ACCEPTED
owner: orders-squad
updated: 2026-08-07
version: "1.0"
contract_type: Event
protocol: "async-message"   # project-specific; not a standard requirement
producer: order-service
consumer: fulfillment-worker
contract_id: "order-accepted@v1"
---
```

Regras:

- `protocol` registra o que o projeto usa; ausência é ok quando Not Applicable.
- Não invente producers/consumers; use Unknown.
- Múltiplos valores de `contract_type` podem ser listados quando tipos se sobrepõem ([contract-types.md](contract-types.md)).

## Segurança da documentação

A documentação **não** deve armazenar:

- senhas;
- chaves de API;
- tokens de acesso;
- chaves privadas;
- credenciais;
- segredos;
- dados sensíveis desnecessários.

Quando uma configuração sensível precisar ser documentada, registre apenas:

```text
Configuration name
Purpose
Source
Required: yes/no
```

Nunca registre o valor do segredo.

Evite também copiar hostnames de produção, IDs de conta ou dados pessoais, salvo quando exigido e aprovado pela política do projeto.

## Idioma

Este padrão é bilíngue (EN e pt-BR). Veja [language.md](language.md).

Resumo das regras:

- caminhos espelhados em `docs/en/` e `docs/pt-BR/`;
- link entre línguas obrigatório no topo de cada documento;
- Status, Classification e identificadores técnicos permanecem em inglês;
- conteúdo narrativo é traduzido.

## Documentos relacionados

- [principles.md](principles.md)
- [style-guide.md](style-guide.md)
- [publishing-surfaces.md](publishing-surfaces.md)
- [document-metadata.md](document-metadata.md)
- [document-identity.md](document-identity.md)
- [document-types.md](document-types.md)
- [ai-context.md](ai-context.md)
- [ai-documentation.md](ai-documentation.md)
- [language.md](language.md)
- [lifecycle.md](lifecycle.md)
- [status.md](status.md)
- [ownership.md](ownership.md)
- [review-policy.md](review-policy.md)
- [change-policy.md](change-policy.md)
- [documentation-debt.md](documentation-debt.md)
- [stale-documentation.md](stale-documentation.md)
- [deprecation.md](deprecation.md)
- [archive-policy.md](archive-policy.md)
- [changelog-policy.md](changelog-policy.md)
- [quality-model.md](quality-model.md)
- [versioning.md](versioning.md)
- [contract-model.md](contract-model.md)
- [contracts/README.md](contracts/README.md)
- [operations-model.md](operations-model.md)
- [operations/README.md](operations/README.md)
- [templates/runbook.md](templates/runbook.md)
- [templates/diagram.md](templates/diagram.md)
- [templates/contract.md](templates/contract.md)
- [security-model.md](security-model.md)
- [security/README.md](security/README.md)
- [templates/security.md](templates/security.md)
