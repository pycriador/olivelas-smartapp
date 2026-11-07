---
title: "Dependency Map"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
---

# Mapa de Dependências

> Language: pt-BR | [English](../../en/templates/dependency-map.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

<!-- Inventário de dependências que moldam o comportamento de runtime ou operacional. Apenas estado atual, salvo se rotulado Proposed. Não invente dependências. -->

## Propósito

<!-- Por que este mapa existe e qual sistema ou escopo ele cobre. -->

## Semântica de direção

Setas e linhas de tabela devem ter significado explícito. Prefira:

```text
A → B
```

com uma relação tipada, por exemplo:

| Notação | Significado |
| --- | --- |
| `A → B` (depends on) | A não cumpre sua responsabilidade sem B |
| `A → B` (calls) | A invoca B |
| `A → B` (publishes to) | A emite para B |
| `A → B` (consumes from) | A lê ou assina a partir de B |
| `A → B` (reads from) | A lê dados ownership ou expostos por B |
| `A → B` (writes to) | A escreve dados em B |

Não desenhe setas sem rótulo. Se a direção for desconhecida, marque **Unknown** em vez de chutar.

## Dependências internas

| Componente | Dependência | Tipo | Criticidade | Impacto da falha |
| --- | --- | --- | --- | --- |
| | | internal | critical / high / medium / low / unknown | |

## Dependências externas

| Componente | Dependência | Tipo | Criticidade | Impacto da falha |
| --- | --- | --- | --- | --- |
| | | external | critical / high / medium / low / unknown | |

## Dependências de infraestrutura

| Componente | Dependência | Tipo | Criticidade | Impacto da falha |
| --- | --- | --- | --- | --- |
| | | infrastructure | critical / high / medium / low / unknown | |

## Dependências de dados

| Componente | Dependência | Tipo | Criticidade | Impacto da falha |
| --- | --- | --- | --- | --- |
| | | data | critical / high / medium / low / unknown | |

## Dependências operacionais

| Componente | Dependência | Tipo | Criticidade | Impacto da falha |
| --- | --- | --- | --- | --- |
| | | operational | critical / high / medium / low / unknown | |

## Mapa consolidado

| Componente | Dependência | Tipo | Criticidade | Impacto da falha |
| --- | --- | --- | --- | --- |
| | | internal / external / infrastructure / data / operational / other | critical / high / medium / low / unknown | |

## Diagrama de dependências

```mermaid
flowchart LR
  component[Componente] -->|depends on| dependency[Dependência]
```

<!-- Rotule arestas com semântica de relação. Mantenha diagramas escopados; divida quando lotados. -->

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Arquitetura | |
| Failure domains | |
| Contratos | |
| ADRs | |
