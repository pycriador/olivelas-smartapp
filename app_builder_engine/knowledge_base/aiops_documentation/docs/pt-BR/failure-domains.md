# Domínios de Falha

> Language: pt-BR | [English](../en/failure-domains.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar domínios de falha: o que falha, o que é afetado, como a falha se propaga e como o sistema isola ou se recupera.

## Propósito

Um domínio de falha responde:

> Se este componente falhar, qual parte do sistema é afetada?

Domínios de falha são arquiteturais. Eles **não** precisam mapear 1:1 para infraestrutura física (racks, AZs, clusters). O mesmo conceito se aplica a componentes de software, serviços, jobs, bibliotecas in-process e infraestrutura.

## O que documentar

Para cada domínio de falha material, capture:

| Campo | Significado |
| --- | --- |
| **Component / domain** | A unidade cuja falha você está analisando |
| **Dependencies** | Do que ela precisa; quais relacionamentos são críticos |
| **Impact** | Efeito visível ao usuário, ao integrador ou interno |
| **Propagation** | Como a falha se espalha (cadeia de call sync, store compartilhado, eventos poison, thread pool compartilhado, etc.) |
| **Isolation** | O que limita o blast radius (fronteiras, bulkheads, deployables separados, backpressure, circuit breaking — como realmente usados) |
| **Recovery** | Como o sistema volta à saúde (retry, replay, failover, runbook manual, modo degradado) |

Marque certeza com Confirmed / Inferred / Unknown / Proposed ([standards.md](standards.md)).

## Forma de exemplo (adapte)

| Domain | Includes | Failure effect | Isolation | Recovery |
| --- | --- | --- | --- | --- |
| `notification-api` | Processo da API | Clientes não conseguem submeter envios | Separado do worker | Restart; clientes fazem retry |
| `notification-worker` | Processador async | Backlog cresce; entrega atrasada | Fila faz buffer da API | Scale/replay; runbook |

Não invente mecanismos de isolamento que não existem. Prefira Unknown a ficção.

## Software vs infraestrutura

| Escopo | Exemplo de domínio de falha |
| --- | --- |
| Módulo in-process | Cache mutável compartilhado que derruba o processo inteiro |
| Unidade implantável | Uma instância de serviço ou tipo de job |
| Dependência compartilhada | Datastore ou broker usado por muitos componentes |
| Platform | Outage do identity provider afetando todos os caminhos autenticados |
| Environment | Ambiente inteiro indisponível |

Documente o nível que importa para operações e design — frequentemente a unidade implantável e dependências críticas compartilhadas.

## Relação com outras visões

| Visão | Relação |
| --- | --- |
| [Fronteiras do sistema](system-boundaries.md) | Sistemas externos podem definir domínios que você não controla |
| [Relacionamentos entre componentes](component-relationships.md) | Arestas críticas `calls` / `depends on` são caminhos de propagação |
| [Fronteiras de confiança](trust-boundaries.md) | Controles de segurança ≠ isolamento de falha, mas podem coincidir |
| Operações / runbooks | Passos de recovery ficam em docs de ops; a arquitetura resume |

## Progressive disclosure

| Tamanho do projeto | Mínimo |
| --- | --- |
| Small | Anote dependências críticas e "o que quebra se X estiver down" no overview de arquitetura |
| Medium | Tabela de domínios de falha para os componentes principais |
| Large / distributed | Domínios por subsystem + domínios de dependências compartilhadas |

## Anti-padrões

- Equacionar "usamos múltiplas instâncias" com isolamento documentado sem declarar o que realmente está isolado.
- Listar toda classe como domínio de falha.
- Copiar diagramas de vendor de cloud como substituto da análise de blast radius do produto.
- Tratar designs de resiliência Proposed como isolamento atual.

## Documentos relacionados

- [architecture-model.md](architecture-model.md)
- [system-boundaries.md](system-boundaries.md)
- [component-relationships.md](component-relationships.md)
- [trust-boundaries.md](trust-boundaries.md)
- [architecture-checklist.md](architecture-checklist.md)
- [architecture/README.md](architecture/README.md)
