---
title: "Componente"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
id: "CMP-XXX"
# component_id: "stable-name"
type: "Architecture"
---

# Componente

> Language: pt-BR | [English (EN)](../../en/templates/component.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Visão operacional e orientada à implementação de um único componente. Prefira [component-architecture.md](component-architecture.md) para a visão de unidade arquitetural quando estrutura e trade-offs importam mais do que detalhe operacional.

## ID

| Campo | Valor |
| --- | --- |
| Component ID | CMP-XXX / stable-name |
| Nome canônico | <!-- must match registries and other docs --> |
| Service ID (se distinto) | SVC-XXX / Not Applicable |
| Owner | |

## Propósito

<!-- Por que este componente existe. -->

## Tipo

| Campo | Valor |
| --- | --- |
| Kind | library / service / worker / gateway / batch / UI / data / infra / other |
| Implantável | yes / no / Unknown |
| Criticidade | <!-- link ops criticality if defined; else Unknown --> |

## Responsabilidades

| Responsabilidade | Notas |
| --- | --- |
| | |

## Não-responsabilidades

| Não-responsabilidade | Owner / em outro lugar |
| --- | --- |
| | |

## Tecnologia

<!-- Registre tecnologias realmente usadas. Não invente. Marque Unknown se não identificado. -->

| Preocupação | Escolha | Classificação |
| --- | --- | --- |
| Linguagem / runtime | | Confirmed / Inferred / Unknown |
| Framework | | Confirmed / Inferred / Unknown |
| Datastore | | Confirmed / Inferred / Unknown / Not Applicable |
| Outro | | |

## Entradas

| Entrada | Fonte | Formato / contrato |
| --- | --- | --- |
| | | |

## Saídas

| Saída | Destino | Formato / contrato |
| --- | --- | --- |
| | | |

## Dependências

| Dependência | ID | Propósito | Obrigatória | Direção | Classificação |
| --- | --- | --- | --- | --- | --- |
| | CMP/SVC/external | | yes / no | inbound / outbound | Confirmed / Inferred / Unknown |

<!-- Prefer registry IDs. Link [dependency-map.md](dependency-map.md) when the graph is large. -->

## Interfaces

| Interface | Tipo | Contract ID / documento | Notas de Authn / Authz |
| --- | --- | --- | --- |
| | API / event / message / file / command / other | | |

## Dados

| Preocupação | Resumo | Classificação |
| --- | --- | --- |
| Dados de propriedade | | Confirmed / Inferred / Unknown / Not Applicable |
| Dados lidos | | Confirmed / Inferred / Unknown / Not Applicable |
| Dados escritos | | Confirmed / Inferred / Unknown / Not Applicable |
| Retenção / ciclo de vida | | Confirmed / Inferred / Unknown / Not Applicable |
| Classificação / sensibilidade | | Confirmed / Inferred / Unknown / Not Applicable |

<!-- Do not assume persistence exists. Never document secret values. -->

## Configuração

| Nome | Propósito | Fonte | Obrigatório | Secret |
| --- | --- | --- | --- | --- |
| | | env / file / vault / other | yes / no | yes / no |

<!-- Never document secret values. -->

## Segurança

| Tópico | Resumo |
| --- | --- |
| Envolvimento em fronteira de confiança | |
| Autenticação | |
| Autorização | |
| Tratamento de dados sensíveis | |
| Secrets (somente referências) | |
| Riscos | |
| Docs de segurança vinculados | |

## Observabilidade

| Sinal | Status | Notas |
| --- | --- | --- |
| Logging | Implemented / Partial / Not Applicable / Not Documented | |
| Metrics | Implemented / Partial / Not Applicable / Not Documented | |
| Tracing | Implemented / Partial / Not Applicable / Not Documented | |

## Tratamento de falhas

| Falha | Detecção | Resposta | Classificação |
| --- | --- | --- | --- |
| | | | Confirmed / Inferred / Unknown |

## Operações

| Tópico | Notas |
| --- | --- |
| Deployment | |
| Scaling | |
| Health checks | |
| Migration / rollback | |
| Runbooks | |
| On-call / escalation | |
| SLIs / SLOs | link or Unknown / Not Applicable |

## Documentos relacionados

| Relação | Document ID | Path |
| --- | --- | --- |
| architecture | | |
| contracts | | |
| runbooks | | |
| security | | |
| ADRs | | |
| registry entry | | |
