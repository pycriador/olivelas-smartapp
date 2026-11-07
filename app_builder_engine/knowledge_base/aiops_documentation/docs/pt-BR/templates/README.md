---
title: "Templates"
status: "ACCEPTED"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
---

# Templates

> Language: pt-BR | [English](../../en/templates/README.md)
>
> Status: ACCEPTED

Templates de documentos reutilizáveis para projetos em adoção.

Copie um template para a categoria apropriada do seu projeto, substitua os placeholders e defina o status de ciclo de vida do documento no frontmatter YAML.

## Exigência de frontmatter

Todo documento de conteúdo deve começar com frontmatter YAML. Campos obrigatórios:

| Campo | Obrigatório | Notas |
| --- | --- | --- |
| `title` | Yes | Título do documento |
| `status` | Yes | Ciclo de vida: `DRAFT`, `ACCEPTED`, `DEPRECATED`, etc. |
| `owner` | Yes | Time ou papel |
| `updated` | Yes | Última atualização de conteúdo (`YYYY-MM-DD`) |
| `created` | No | Data da primeira publicação |
| `review_date` | No | Próximo ou último alvo de revisão |
| `version` | No | String de versão do documento |

Campos opcionais de depreciação (veja as chaves comentadas em [project-overview.md](project-overview.md) e [architecture.md](architecture.md)): `deprecated_on`, `superseded_by`, `deprecation_reason`.

Mantenha o blockquote do seletor de idioma depois do H1. Não coloque metadados de ciclo de vida no blockquote.

Para ADRs: o `status` do frontmatter é o ciclo de vida do documento; a seção `## Status` é o status da decisão (`Proposed` / `Accepted` / …). São independentes.

## Templates disponíveis

| Template | Arquivo | Usar para |
| --- | --- | --- |
| Project Overview | [project-overview.md](project-overview.md) | Propósito, escopo e mapa do sistema |
| Arquitetura | [architecture.md](architecture.md) | Documento consolidado de arquitetura |
| Arquitetura Overview | [architecture-overview.md](architecture-overview.md) | Resumo leve de arquitetura |
| System Context | [system-context.md](system-context.md) | Sistema no seu ecossistema |
| Component | [component.md](component.md) | Visão operacional/detalhe de um único componente |
| Component Arquitetura | [component-architecture.md](component-architecture.md) | Visão arquitetural de componente |
| Data Flow | [data-flow.md](data-flow.md) | Um caminho de dados significativo |
| Sequence | [sequence.md](sequence.md) | Interações ordenadas para um cenário |
| Dependency Map | [dependency-map.md](dependency-map.md) | Dependências internas, externas, infra, dados e operacionais |
| Arquitetura Constraints | [architecture-constraints.md](architecture-constraints.md) | Restrições que condicionam a arquitetura |
| Quality Attributes | [quality-attributes.md](quality-attributes.md) | Requisitos de atributos de qualidade e evidência |
| Arquitetura Trade-off | [architecture-tradeoff.md](architecture-tradeoff.md) | Escolha arquitetural com benefício/custo |
| Integration | [integration.md](integration.md) | Integração entre sistemas/componentes |
| Contract | [contract.md](contract.md) | APIs, eventos, mensagens, arquivos, comandos e outras interfaces |
| Error Contract | [error-contract.md](error-contract.md) | Catálogo de erros de um contrato (sem assumir HTTP) |
| Service Profile | [service-profile.md](service-profile.md) | Cartão de identidade operacional do serviço (owner/on-call obrigatório ou `Unknown`) |
| Deployment | [deployment.md](deployment.md) | Visão leve de deploy (ambientes, unidades, pipeline) |
| Feature flags | [feature-flags.md](feature-flags.md) | Toggles de runtime / superfície de configuração (sem valores de segredo) |
| Modelo de dados | [data-model.md](data-model.md) | Schemas, entidades centrais, ownership de dados |
| Worker | [worker.md](worker.md) | Processo worker / sidecar de longa duração |
| BFF | [bff.md](bff.md) | Borda do browser / BFF / camada SSR opcional |
| Runbook | [runbook.md](runbook.md) | Procedimento operacional |
| Segurança | [security.md](security.md) | Overview da postura de segurança (linka metodologia) |
| Segurança Asset | [security-asset.md](security-asset.md) | Um security asset |
| Threat | [threat.md](threat.md) | Uma threat |
| Segurança Risk | [security-risk.md](security-risk.md) | Um security risk |
| Segurança Requirement | [security-requirement.md](security-requirement.md) | Um security requirement |
| Segurança Control | [security-control.md](security-control.md) | Um security control |
| Segurança Alert | [security-alert.md](security-alert.md) | Alert com purpose de segurança |
| Vulnerability | [vulnerability.md](vulnerability.md) | Registro de vulnerability |
| Segurança Exception | [security-exception.md](security-exception.md) | Segurança exception |
| Segurança Incident | [security-incident.md](security-incident.md) | Registro de security incident |
| Segurança Test | [security-test.md](security-test.md) | Strategy/record de security test |
| Observability | [observability.md](observability.md) | Sinais, alertas, saúde |
| SLI | [sli.md](sli.md) | Service level indicator |
| SLO | [slo.md](slo.md) | Service level objective (inclui Error Budget) |
| Failure Mode | [failure-mode.md](failure-mode.md) | Um failure mode |
| Capacity Limit | [capacity-limit.md](capacity-limit.md) | Limite de capacity / saturação |
| Alert | [alert.md](alert.md) | Definição de um alert |
| Incident | [incident.md](incident.md) | Registro de incidente |
| Recovery Procedure | [recovery-procedure.md](recovery-procedure.md) | Procedimento de restore / recovery |
| ADR | [adr.md](adr.md) | Registro de decisão de arquitetura |
| Troubleshooting | [troubleshooting.md](troubleshooting.md) | Guia de diagnóstico |
| Diagram | [diagram.md](diagram.md) | Convenções e exemplos de diagramas |
| Claim | [claim.md](claim.md) | Uma claim técnica ligada a evidência |
| Document Relationship | [document-relationship.md](document-relationship.md) | Link tipado entre documentos |
| Documentation Change | [documentation-change.md](documentation-change.md) | Mudança de doc planejada/concluída + impacto |
| Contradiction | [contradiction.md](contradiction.md) | Afirmações conflitantes entre docs/evidência |
| Knowledge Gap | [knowledge-gap.md](knowledge-gap.md) | Known / Unknown / Assumed / Needs Verification |
| AI Task Context | [ai-task-context.md](ai-task-context.md) | Pacote de contexto para tarefa de IA |
| Documentação de IA Health | [ai-documentation-health.md](ai-documentation-health.md) | Snapshot de saúde documental para IA |
| AI Change Record | [ai-change-record.md](ai-change-record.md) | Trilha de auditoria de mudanças assistidas por IA |
| Entrada AGENTS.md | [agents-entry.md](agents-entry.md) | Ponteiro `AGENTS.md` na raiz (stack, comandos, boundaries) |
| Entrada CLAUDE.md | [claude-entry.md](claude-entry.md) | Ponteiro `CLAUDE.md` na raiz para Claude Code |
| Validation Rule | [validation-rule.md](validation-rule.md) | Regra única de validação documental |
| Documentation Exception | [exception.md](exception.md) | Waiver temporal de regra de validação |
| Governance Report | [governance-report.md](governance-report.md) | Resumo periódico de governança / saúde |

### Templates de operations

| Template | Papel | Quando preferir |
| --- | --- | --- |
| [service-profile.md](service-profile.md) | Identidade operacional: ownership, criticality, deps, SLIs, stance de recovery | Ponto de entrada para operar um serviço; linka arquitetura/contratos |
| [runbook.md](runbook.md) | Diagnosis/resolution executável com notas de safety | Procedimentos operacionais recorrentes ou de alto impacto |
| [troubleshooting.md](troubleshooting.md) | Índice de sintomas linkando levemente a runbooks/incidentes | Guia amplo de diagnóstico entre múltiplos issues |
| [observability.md](observability.md) | Inventário de sinais, alerts, SLOs, health | Postura de observability do projeto |
| [sli.md](sli.md) / [slo.md](slo.md) | Um indicator / objective (+ error budget no SLO) | Quando service levels estão Defined |
| [failure-mode.md](failure-mode.md) | Um failure mode com detection e recovery | Entradas de catálogo para modes materiais |
| [capacity-limit.md](capacity-limit.md) | Um limit e comportamento na saturação | Quotas / cliffs conhecidos |
| [alert.md](alert.md) | Um alert actionable | Alerts não triviais que precisam de clareza Condition→Action |
| [incident.md](incident.md) | Registro de incidente (root cause pode ser Unknown enquanto aberto) | Incidentes ativos ou históricos |
| [recovery-procedure.md](recovery-procedure.md) | Caminho de restore/recovery com contexto de RPO/RTO | Restore de backup, failover, rebuild |

Categoria de operations e regras de IA:

- [operations/README.md](../operations/README.md) — índice completo da metodologia de ops
- [observability/README.md](../observability/README.md) — categoria Observability
- [ai-documentation.md](../ai-documentation.md) — regras de AI para operations, reliability e runbook
- [operations-model.md](../operations-model.md) — ciclo de operações
- [versioning.md](../versioning.md) — Documentation Standard v1.0

### Templates de security

| Template | Papel | Quando preferir |
| --- | --- | --- |
| [security.md](security.md) | Overview da postura de segurança linkando metodologia | Documento de entrada dos security docs de um sistema |
| [security-asset.md](security-asset.md) | Um asset a proteger | Entradas de catálogo de assets |
| [threat.md](threat.md) | Um cenário de threat | Catálogo de threat model |
| [security-risk.md](security-risk.md) | Um risk com notas de residual | Entradas de risk register |
| [security-requirement.md](security-requirement.md) | Uma obrigação de segurança | Catálogo de requirements |
| [security-control.md](security-control.md) | Um control (preventive/detective/corrective/compensating) | Inventário de controls |
| [security-alert.md](security-alert.md) | Alert com purpose de segurança | Distinto de alerts puros de ops, ou Type=Both |
| [vulnerability.md](vulnerability.md) | Registro do lifecycle de vulnerability | Tracking Identify→Close |
| [security-exception.md](security-exception.md) | Exception com campos obrigatórios | Desvios temporários ou explícitos |
| [security-incident.md](security-incident.md) | Registro de incident Segurança / Both | Quando campos dedicados de segurança ajudam |
| [security-test.md](security-test.md) | Strategy/record de security test | Cobertura conceitual SAST/DAST/etc |

Categoria de security e regras de IA:

- [security/README.md](../security/README.md) — índice completo da metodologia de segurança
- [ai-documentation.md](../ai-documentation.md) — regras de AI para security analysis, threat detection e review
- [security-model.md](../security-model.md) — security loop
- [versioning.md](../versioning.md) — Documentation Standard v1.0

### Templates de contrato

| Template | Papel | Quando preferir |
| --- | --- | --- |
| [contract.md](contract.md) | Contrato canônico de interface (producer/consumer, schema, semantics, reliability, security) | Doc primário para API, event, message, file, command, callback, library ou data contract |
| [error-contract.md](error-contract.md) | Catálogo dedicado de erros com retryability e ações do consumer | Superfícies de erro não triviais; mantenha o contrato primário linkado, não duplicado |

Categoria de contracts e regras de IA:

- [contracts/README.md](../contracts/README.md) — orientação da categoria para projetos em adoção
- [ai-documentation.md](../ai-documentation.md) — regras de AI Contract Analysis e Comparison
- [architecture-model.md](../architecture-model.md) — contratos como camada Interfaces
- [architecture-traceability.md](../architecture-traceability.md) — linkar architecture → component → contract
- [versioning.md](../versioning.md) — versionamento de documento vs identificador de contrato

### Diferenças entre templates de arquitetura

| Template | Papel | Quando preferir |
| --- | --- | --- |
| [architecture.md](architecture.md) | Arquitetura consolidada (contexto → restrições → ADRs/contratos) | Doc primário de arquitetura do sistema; pule seções não usadas em projetos simples |
| [architecture-overview.md](architecture-overview.md) | Resumo focado de alto nível | Ponto de entrada ou quando um doc consolidado completo for desnecessário |
| [component.md](component.md) | Detalhe de componente orientado a ops/implementação | Unidade implantável ou ownership que precisa de inputs, config, notas de ops |
| [component-architecture.md](component-architecture.md) | Componente arquitetural (responsabilidades, estrutura, interfaces) | Unidades arquiteturais significativas — **não** toda classe ou arquivo |

## Templates de ciclo de vida

| Template | Arquivo | Usar para |
| --- | --- | --- |
| Documentation PR Checklist | [documentation-pr-checklist.md](documentation-pr-checklist.md) | Checklist para pull requests de documentação |
| Ownership Matrix | [ownership-matrix.md](ownership-matrix.md) | Ownership de documentos e domínios |
| Review Record | [review-record.md](review-record.md) | Registro de revisões de documentação |

## Regras de uso

1. Mantenha as seções mesmo quando vazias — marque `Not applicable` ou `Unknown` em vez de remover a estrutura arbitrariamente.
2. Não trate toda seção como conteúdo obrigatório para todo projeto.
3. Nunca preencha placeholders com fatos inventados do projeto.
4. Defina no frontmatter `status: "DRAFT"` até a revisão; mova para `ACCEPTED` após a revisão.
5. Não invente métricas, targets, padrões arquiteturais, SLOs, alerts, DR ou comandos de runbook sem evidência.
