# Documentação gerada por IA

> Language: pt-BR | [English](../en/ai-documentation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Regras para agentes de IA que criam ou atualizam documentação de engenharia.

A IA deve tratar a documentação como artefato de engenharia, não como texto livre.

## Entrada de contexto de IA (comece aqui)

**Ponto de entrada primário:** [ai-context.md](ai-context.md)

Antes de aplicar as regras de domínio abaixo, os agentes devem:

1. Abrir [ai-context.md](ai-context.md) e identificar escopo e nível de contexto.
2. Navegar com [ai-navigation.md](ai-navigation.md).
3. Responder com [ai-answering-rules.md](ai-answering-rules.md) (incluindo AI Evidence Rules).
4. Seguir o modelo de estágios em [ai-ready-model.md](ai-ready-model.md): Context → Knowledge → Relationships → Evidence → Constraints → Actions.

Este arquivo mantém **regras de IA de domínio** para arquitetura, contratos, operações, segurança, reliability e runbooks. Navegação AI-ready, claims e integridade de contexto vivem nos docs AI-ready linkados acima.

## Fluxo obrigatório do agente

1. **Consultar a documentação existente primeiro**
   - Ler docs relacionados, índices, ADRs, contratos e status de ciclo de vida antes de escrever.
2. **Analisar o projeto / código quando necessário**
   - Inspecionar estrutura do repositório, entry points, configs, testes e fontes de evidência.
3. **Preservar o estado documental**
   - Não alterar `status`, `owner` ou versão sem motivo.
   - Conteúdo novo ou editado por IA permanece `DRAFT` até o processo humano avançar.
4. **Identificar evidências**
   - Preferir fontes autoritativas: código, config, contratos, IaC, testes, ADRs.
5. **Separar fatos de inferências**
   - Marcar Confirmed, Inferred, Unknown e Proposed explicitamente.
6. **Evitar duplicação**
   - Linkar documentos canônicos; não copiar contratos ou decisões.
7. **Atualizar documentos relacionados**
   - Quando a mudança afetar vários docs, atualizar referências e dependentes.
8. **Sinalizar unknowns**
   - Preferir docs incompletos e corretos a docs completos inventados.
9. **Nunca inventar dados**
   - Não fabricar componentes, endpoints, SLOs, owners ou arquiteturas.
10. **Nunca expor secrets**
    - Documentar apenas referências a secrets (nome, finalidade, origem, obrigatoriedade).
11. **Respeitar ownership**
    - Não reatribuir `owner` casualmente; seguir [ownership.md](ownership.md).
12. **Sugerir revisão humana quando necessário**
    - Mudanças materiais de arquitetura, segurança, contrato ou operação exigem revisão humana.
    - A IA **nunca** deve marcar um documento como `ACCEPTED` por conta própria.

Também aplicar regras bilíngues neste repositório: atualizar EN e pt-BR juntos ([language.md](language.md)).

## Análise de arquitetura por IA

Antes de documentar arquitetura, um agente deve:

1. Analisar a estrutura do projeto.
2. Identificar componentes (unidades arquiteturais — não cada arquivo/classe).
3. Identificar dependências e sua direção.
4. Identificar interfaces e contratos.
5. Identificar fluxos importantes (sync, async, batch, dados).
6. Identificar infraestrutura relevante apenas quando houver evidência.
7. Identificar limites de sistema e trust boundaries quando houver evidência.
8. Verificar configuração e entry points.
9. Consultar documentação existente e ADRs.
10. Comparar documentação com a implementação (detectar possível drift).

Classificar toda afirmação arquitetural:

| Classification | Meaning |
| --- | --- |
| `Confirmed` | Sustentada por evidência autoritativa |
| `Inferred` | Dedução razoável a partir de evidência; não é intenção de design explícita |
| `Unknown` | Não identificado — não inventar |
| `Proposed` | Estado futuro ou desejado — nunca apresentar como atual |

Seguir [architecture-model.md](architecture-model.md), [architecture-vs-implementation.md](architecture-vs-implementation.md), [architecture-drift.md](architecture-drift.md) e [architecture-checklist.md](architecture-checklist.md).

### Não inventar estilos de arquitetura

**Não** afirme que o projeto usa microservices, event-driven architecture, CQRS, hexagonal, clean architecture, DDD, layered architecture, serverless ou qualquer outro estilo **apenas porque** conceitos relacionados aparecem no código.

Declare um estilo arquitetural somente quando:

1. Houver evidência suficiente; **e**
2. A estrutura justificar a classificação; **ou**
3. O projeto declarar o estilo explicitamente.

Quando houver dúvida:

> Architectural style not identified.

Nunca apresente uma arquitetura desejada como a arquitetura atual.

## Análise de contrato por IA

Antes de documentar contratos, um agente deve buscar evidência em:

1. Código (handlers, clients, serializers, validators)
2. Schemas (OpenAPI, AsyncAPI, JSON Schema, Avro, Protobuf, SQL ou equivalente do projeto)
3. Configs (routes, topics, queues, feature flags, gateway config)
4. Testes (contract tests, integration tests, fixtures)
5. Specs (specs de parceiros externos, RFCs adotados pelo projeto)
6. Documentação existente (categoria contracts, integrations, ADRs)
7. Consumers (call sites, subscribers, importers)
8. Producers (publishers, exporters, implementações de API)

Classificar toda afirmação de contrato:

| Classification | Meaning |
| --- | --- |
| `Confirmed` | Sustentada por evidência autoritativa |
| `Inferred` | Dedução razoável a partir de evidência; não é intenção de design explícita |
| `Unknown` | Não identificado — não inventar |
| `Proposed` | Contrato futuro ou desejado — nunca apresentar como atual |

**Nunca invente** o seguinte sem evidência:

- Endpoints, channels, topics, queues ou localizadores de interface
- Events, commands ou message types
- Fields, types, requiredness ou default values
- Error codes, error categories ou consumer guidance
- Delivery guarantees, ordering ou acknowledgement models
- Timeouts, retry policies ou idempotency keys
- Versioning schemes, compatibility rules ou deprecation policies
- Rate limits, size limits ou security mechanisms

Use [templates/contract.md](templates/contract.md) e [templates/error-contract.md](templates/error-contract.md). Prefira um documento canônico de contrato; linke a partir de arquitetura e integrations em vez de copiar schemas. Siga [contracts/README.md](contracts/README.md).

Marque seções **Not Applicable** quando o tipo de contrato não as precisar. Não assuma HTTP nem qualquer stack tecnológico específico.

## Análise de operações por IA

Antes de documentar operações, um agente deve:

1. Consultar docs de ops existentes, runbooks, ownership e histórico de incidentes (se presente).
2. Identificar como o sistema é deployed e validado — só a partir de evidência.
3. Identificar health signals, monitoring e alerts realmente configurados ou documentados.
4. Identificar operational owners / on-call / escalation quando evidenciados.
5. Identificar dependências críticas e failure modes a partir de arquitetura + evidência de runtime.
6. Identificar caminhos de recovery (rollback, restore, failover) só quando evidenciados.
7. Comparar docs com pipelines, dashboards e configs de alert reais quando disponíveis (detectar operational drift).
8. Vincular failure domains de arquitetura e timeout/retry/idempotency de contrato às notas de reliability — não reescreva descrições de componente.

Classifique toda claim operacional:

| Classification | Meaning |
| --- | --- |
| `Confirmed` | Sustentada por evidência autoritativa |
| `Inferred` | Dedução razoável a partir de evidência; não é intenção explícita de ops |
| `Unknown` | Não identificado — não inventar |
| `Proposed` | Prática futura ou desejada de ops — nunca apresentar como atual |

**Nunca invente** sem evidência:

- SLOs, SLIs, SLAs ou error budgets
- Alerts, thresholds, dashboards ou rotações de on-call
- Estratégias de RPO / RTO / DR
- Comandos de deploy, rollback ou restore
- Nomes de infraestrutura, caminhos, permissions ou topologia de cluster
- Passos de runbook que não estejam evidenciados

Quando DR formal estiver ausente, escreva: `Formal Disaster Recovery not defined.` Quando RPO/RTO forem desconhecidos: `Not Defined`.

Siga [operations-model.md](operations-model.md), [operations/README.md](operations/README.md), [operational-drift.md](operational-drift.md) e [operations-checklist.md](operations-checklist.md).

## Análise de segurança por IA

Antes de documentar segurança, um agente deve:

1. Consultar docs de segurança existentes, threat models, ownership, exceptions e histórico de incidents (se presentes).
2. Identificar assets e data classes apenas a partir de evidência ([security-assets.md](security-assets.md), [security-classification.md](security-classification.md)).
3. Identificar trust boundaries e attack surface a partir de arquitetura + evidência de runtime.
4. Identificar mecanismos de authn/authz e **referências** a secrets (name/purpose/source) — nunca valores.
5. Identificar controls e requirements apenas quando evidenciados.
6. Linkar contracts para authn/authz/sensitive fields na boundary — não inventar permissions.
7. Linkar operations para monitoring e incident response — não inventar SIEM/rules.
8. Comparar docs com configs e reviews reais quando disponíveis (detectar security drift).

Classifique toda claim de segurança:

| Classification | Meaning |
| --- | --- |
| `Confirmed` | Sustentada por evidência autoritativa |
| `Inferred` | Dedução razoável a partir de evidência; não intent explícito de segurança |
| `Unknown` | Não identificado — não invente |
| `Proposed` | Control de segurança futuro ou desejado — nunca apresente como current |

**Nunca invente** sem evidência:

- Controls, effectiveness de control ou compensating controls
- Permissions, roles, policies ou IAM bindings
- Certificações de compliance, mapeamentos regulatórios ou attestations de audit
- Vulnerabilities, CVEs ou claims de exploitability
- Algoritmos de encryption, custódia de keys ou períodos de retention
- Scanners de segurança, gates ou resultados pass/fail
- Exceptions, approvals ou datas de expiration

Quando um control estiver ausente: marque **Unknown** ou **Not Defined** — não fabrique um para completar um template.

Siga [security-model.md](security-model.md), [security/README.md](security/README.md), [security-drift.md](security-drift.md) e [security-checklist.md](security-checklist.md).

## Detecção de threats por IA

Quando um agente notar um possível issue de segurança ao analisar código ou docs, rotule-o:

| Label | Meaning |
| --- | --- |
| `Potential Finding` | Preocupação plausível de segurança a partir de evidência incompleta — precisa de triage humana |
| `Confirmed` finding | Só quando evidência autoritativa sustenta uma frailty real in scope |
| `Unknown` | Não é possível avaliar |
| `False Positive` candidate | Só sugira; humanos decidem |

Regras:

1. Prefira **Potential Finding** a claims absolutas de vulnerability quando a evidência for incompleta.
2. Não auto-atribuir severity sem contexto de exposure do asset e owner ([vulnerability-management.md](vulnerability-management.md)).
3. Não invente CVE IDs ou narrativas de exploit.
4. Encaminhe findings ao processo de vulnerability do projeto como candidatos — não “corrija” silenciosamente inventando mitigations.
5. Nunca embuta valores secretos descobertos na análise na documentação; reporte exposure por referência ([secret-exposure.md](secret-exposure.md)).

## Review de segurança por IA

Ao produzir um security review de documentação ou postura, estruture cada item material como:

| Campo | Significado |
| --- | --- |
| **Finding** | O que foi observado (fato) |
| **Evidence** | Paths, configs, testes ou **Unknown** |
| **Risk** | Impacto potencial — prefira linguagem Potential Finding quando incompleto |
| **Confidence** | High / Medium / Low / Unknown |
| **Recommendation** | Melhoria Proposed — nunca auto-aplique como estado Confirmed current |

Regras:

1. Mantenha Finding distinto de Recommendation.
2. Não marque o documento revisado como `ACCEPTED`.
3. Não invente outcomes pass/fail de compliance.
4. Registre lacunas materiais como candidatos a [security debt](security-debt.md) ou [security exception](security-exceptions.md) para humanos.
5. Alinhe aos princípios de Evidence Integrity — [security-evidence.md](security-evidence.md).

## Análise de reliability por IA

Ao analisar a postura de reliability, identifique riscos como:

| Label | Meaning |
| --- | --- |
| `Confirmed` risk | SPOF evidenciado, detection ausente ou caminho de recovery quebrado |
| `Potential Risk` | Preocupação plausível de reliability a partir de evidência incompleta — precisa de review humana |
| `Unknown` | Não é possível avaliar |
| `Accepted Risk` | Só quando o projeto registrou aceitação explicitamente |

Regras:

1. Prefira **Potential Risk** a claims absolutas quando a evidência for incompleta.
2. Não auto-atribua criticality ou severity sem owner/contexto ([criticality.md](criticality.md), [incident-severity.md](incident-severity.md)).
3. Gaps de timeout/retry/idempotency de contrato são frequentemente riscos de reliability — vincule contratos; não invente políticas.
4. Failure domains de arquitetura informam blast radius — vincule; não duplique catálogos de componente.
5. Registre gaps materiais como candidatos a [reliability debt](reliability-debt.md) para humanos — não “corrija” silenciosamente inventando mitigation.

## Geração de runbook por IA

Ao criar ou atualizar runbooks:

1. Use a estrutura de [templates/runbook.md](templates/runbook.md) (purpose, scope, severity, symptoms, impact, preconditions, safety notes, diagnosis, mitigation, resolution, validation, rollback, escalation, communication).
2. **Nunca invente** comandos, scripts, infraestrutura, hostnames, caminhos, roles IAM ou permissions.
3. Prefira placeholders (`<environment>`, `<release-id>`) quando a invocação exata for Unknown.
4. Destaque passos destrutivos ou irreversíveis explicitamente; note quando rollback for inseguro.
5. Vincule alerts, failure modes, arquitetura e contratos em vez de copiá-los.
6. Mantenha `status: DRAFT` até review humana; nunca auto-`ACCEPTED`.
7. Se o procedimento for desconhecido, escreva que o runbook não pode ser completado e liste Unknowns — não fabrique um procedimento confortante.

## Comparação de contrato por IA

Ao comparar versões de contrato (ou proposed vs current), identifique cada diferença como uma de:

| Change class | Meaning |
| --- | --- |
| `Added` | Novo field, operation, event, error ou guarantee |
| `Removed` | Elemento anteriormente presente que não está mais presente |
| `Changed` | Mesmo elemento com tipo, semantics ou behavior diferente |
| `Deprecated` | Ainda presente, mas marcado para remoção |
| `Potential Breaking Change` | Pode quebrar consumers — precisa de review humana/contexto |
| `Unknown Impact` | Diferença observada; impacto no consumer não estabelecido |

Regras:

1. **Não** auto-classifique uma mudança como breaking sem contexto de consumer, deployment e compatibility.
2. Prefira `Potential Breaking Change` ou `Unknown Impact` a um "breaking" absoluto quando a evidência for incompleta.
3. Campos opcionais additive frequentemente são compatíveis — ainda assim verifique contra a política de compatibility do projeto.
4. Mudanças semânticas (mesma forma, significado diferente) são alto risco mesmo quando schemas parecem compatíveis.
5. Nunca invente uma versão "before" ou "after" que não esteja evidenciadas em código, schema ou docs.

Registre os resultados da comparação nas seções Versioning / Compatibility do contrato, em um ADR quando a mudança for arquitetural, ou em uma nota de review para aceitação humana.

## Regras de ciclo de vida para IA

| Ação | Comportamento permitido | Não permitido |
| --- | --- | --- |
| Criar doc | Criar como `DRAFT` | Criar como `ACCEPTED` |
| Atualizar doc `ACCEPTED` | Propor mudanças; definir/recomendar `REVIEW` | Marcar `ACCEPTED` sem processo humano |
| Depreciar | Sugerir campos de depreciação | Apagar docs primários sem política |
| Arquivar | Sugerir arquivo conforme política | Destruir contexto histórico silenciosamente |
| Tokens de status | Usar apenas status definidos | Inventar `FINAL`, `DONE`, `UPDATED` como status armazenado |
| Estilo de arquitetura | Declarar apenas com evidência | Inferir estilo só por buzzwords |

Seguir [lifecycle.md](lifecycle.md), [status.md](status.md), [review-policy.md](review-policy.md), [change-policy.md](change-policy.md) e [architecture-review.md](architecture-review.md).

## Regras de qualidade da saída

| Regra | Requisito |
| --- | --- |
| Structure | Siga os templates em `docs/pt-BR/templates/` (e o espelho em `docs/en/templates/`) |
| Metadata | Prefira YAML frontmatter (`title`, `status`, `owner`, `updated`) |
| Status | Defina `DRAFT` até revisão humana |
| Classification | Marque afirmações incertas |
| Evidence | Cite caminhos ou ADRs para claims técnicas |
| Style | Siga [style-guide.md](style-guide.md) |
| Technology | Não assuma stack sem evidência no projeto |
| Current state | Não documente estado desejado como existente |
| Lifecycle | Respeite transições e ownership |
| Arquitetura depth | Use apenas níveis de documentação que agreguem valor ([architecture-model.md](architecture-model.md)) |

## Permitido vs não permitido

### Permitido

- Criar ou atualizar Markdown a partir de evidências do repositório
- Adicionar diagramas que reflitam estrutura ou fluxos observados
- Propor melhorias rotuladas como Proposed
- Abrir gaps como Unknown para follow-up humano
- Abrir itens de documentation debt ou architecture debt quando gaps forem materiais
- Sinalizar possível architecture drift para revisão humana

### Não permitido

- Inventar APIs, eventos, infraestruturas ou ownership
- Inventar endpoints, fields, error codes, delivery guarantees, timeouts, retries ou versioning de contrato
- Inventar estilos ou topologias de arquitetura
- Inventar SLOs, alerts, RPO/RTO, DR, comandos de runbook, caminhos ou permissions
- Inventar security controls, permissions, compliance, vulnerabilities ou valores secretos
- Auto-rotular diffs de contrato como breaking sem contexto
- Auto-atribuir incident severity ou criticality sem contexto
- Embutir secrets ou valores sensíveis
- Reescrever histórico para esconder incerteza
- Misturar dados reais de projetos nos exemplos deste padrão
- Alterar configuração de produção em tarefa só de docs
- Aceitar documentação automaticamente (`ACCEPTED`) sem aprovação humana/processo
- Apresentar arquitetura Proposed, contratos Proposed, práticas de ops Proposed ou security controls Proposed como estado atual Confirmed

## Padrão recomendado de front matter

```yaml
---
title: "Document Title"
status: "ACCEPTED"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "0.1"
---
```

```markdown
> Language: pt-BR | [English](../en/example.md)
> Generated-by: AI

## Evidence Summary

| Claim area | Source | Classification |
| --- | --- | --- |
| Entry points | `path/to/file` | Confirmed |
| Failure mode | not found | Unknown |
| Architectural style | not identified | Unknown |
```

`Generated-by: AI` é metadado opcional para auxiliar a revisão. Não substitui a aceitação humana.

## Expectativas de revisão da saída de IA

Revisores humanos devem verificar:

- [ ] Nenhum conteúdo inventado
- [ ] Classificações honestas
- [ ] Segredos ausentes
- [ ] Links e caminhos resolvem
- [ ] Estado atual vs proposto está claro
- [ ] Claims de arquitetura baseadas em evidência (sem estilos inventados)
- [ ] Claims de contrato baseadas em evidência (sem endpoints, fields, errors ou guarantees inventados)
- [ ] Comparações de contrato usam Added/Removed/Changed/Deprecated/Potential Breaking Change/Unknown Impact — não "breaking" automático
- [ ] Claims de operações baseadas em evidência (sem SLOs, alerts, DR ou comandos inventados)
- [ ] Riscos de reliability usam Potential Risk / Unknown quando a evidência for incompleta
- [ ] Claims de segurança baseadas em evidência (sem controls, permissions, compliance ou vulns inventados)
- [ ] Issues de segurança usam Potential Finding / Unknown quando a evidência for incompleta
- [ ] Reviews de segurança incluem Finding / Evidence / Risk / Confidence / Recommendation
- [ ] Runbooks não inventam comandos, infra, caminhos ou permissions
- [ ] Seções do template preenchidas ou marcadas como não aplicáveis
- [ ] Metadata/status/owner corretos
- [ ] Documentos relacionados atualizados quando necessário

Promova para `REVIEW` / `ACCEPTED` apenas após revisão humana (ou processo formal do time).

## Documentos relacionados

- [ai-context.md](ai-context.md) — **entrada primária de IA**
- [ai-navigation.md](ai-navigation.md)
- [ai-answering-rules.md](ai-answering-rules.md)
- [ai-ready-model.md](ai-ready-model.md)
- [ai-task-boundaries.md](ai-task-boundaries.md)
- [ai-change-rules.md](ai-change-rules.md)
- [principles.md](principles.md)
- [lifecycle.md](lifecycle.md)
- [status.md](status.md)
- [ownership.md](ownership.md)
- [standards.md](standards.md)
- [style-guide.md](style-guide.md)
- [documentation-checklist.md](documentation-checklist.md)
- [quality-model.md](quality-model.md)
- [language.md](language.md)
- [change-policy.md](change-policy.md)
- [architecture-model.md](architecture-model.md)
- [architecture-review.md](architecture-review.md)
- [architecture-drift.md](architecture-drift.md)
- [architecture-debt.md](architecture-debt.md)
- [contracts/README.md](contracts/README.md)
- [templates/contract.md](templates/contract.md)
- [templates/error-contract.md](templates/error-contract.md)
- [operations/README.md](operations/README.md)
- [operations-model.md](operations-model.md)
- [templates/runbook.md](templates/runbook.md)
- [operational-drift.md](operational-drift.md)
- [reliability-debt.md](reliability-debt.md)
- [security/README.md](security/README.md)
- [security-model.md](security-model.md)
- [templates/security.md](templates/security.md)
- [security-drift.md](security-drift.md)
- [security-debt.md](security-debt.md)
- [security-evidence.md](security-evidence.md)
