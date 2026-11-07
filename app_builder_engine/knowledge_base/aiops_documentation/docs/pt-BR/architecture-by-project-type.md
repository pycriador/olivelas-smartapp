# Arquitetura por Tipo de Projeto

> Language: pt-BR | [English](../en/architecture-by-project-type.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Orientação para aplicar o modelo de arquitetura a formas comuns de projeto.

Estas são **orientações, não requisitos**. Um projeto pode combinar tipos. Não force um rótulo de tipo sem evidência — se incerto: architectural pattern not identified ([architecture-model.md](architecture-model.md)).

A linguagem permanece agnóstica de tecnologia: descreva papéis e fronteiras, não vendors ou frameworks obrigatórios.

## Monolith

Documente quando útil:

- módulos / áreas delimitadas de responsabilidade;
- fronteiras internas (o que não deve chamar o quê);
- dependências (internas e externas);
- ownership de dados;
- integrações na edge.

Prefira componentes no nível de módulo a listas de classes ([architecture-vs-implementation.md](architecture-vs-implementation.md)).

Exemplo ilustrativo (stack **não** normativa): [fullstack-monolith](../../examples/fullstack-monolith/). Combine com a seção Frontend quando UI e API convivem no mesmo repositório. Caminho de adoção: [adoption-path.md](adoption-path.md).

## Microservices

Documente quando útil:

- serviços como unidades implantáveis;
- ownership por serviço;
- estilos de comunicação (sync/async/other);
- contratos entre serviços;
- dependências e criticidade;
- [domínios de falha](failure-domains.md) através das fronteiras de serviço.

Não assuma que toda divisão de repositório é um microservice. Confirme com implantabilidade, ownership e independência de runtime.

## Event-driven

Documente quando útil:

- producers e consumers;
- eventos e schemas (linke contratos);
- pressupostos de ordenação e entrega;
- retries / tratamento de poison no nível arquitetural;
- ownership de tópicos/streams e consumer groups (ou equivalentes).

Marque Unknown onde garantias do broker não foram verificadas.

## Serverless

Documente quando útil:

- functions ou unidades efêmeras equivalentes;
- triggers (HTTP, schedule, queue, eventos de storage, …);
- dependências e restrições de cold-start / concorrência conforme conhecidas;
- eventos e modelo de execução (request-scoped, queue-scoped, …);
- que estado existe fora da function.

Não exija um produto específico de cloud function.

## Frontend

Documente quando útil:

- fronteiras de aplicação (apps, shells, micro-frontends se realmente usados);
- componentes de UI/arquiteturais que importam no nível de sistema;
- ownership de estado (cliente vs servidor);
- fronteiras de APIs e BFF;
- navegação / roteamento em alto nível;
- dependências externas (auth, analytics, CDNs) como arestas de arquitetura.

Prefira estrutura relevante ao sistema a catálogos de component-library.

## CLI

Documente quando útil:

- comandos e pontos de entrada;
- entradas e saídas;
- dependências (ferramentas locais, APIs, arquivos);
- fluxo de execução dos comandos primários;
- comportamento de exit / erro do qual integradores dependem.

## Library

Documente quando útil:

- superfície de API pública;
- interfaces e pontos de extensão;
- dependências e requisitos peer;
- expectativas de compatibilidade / versionamento;
- o que é in-process vs o que faz call out.

Arquitetura de uma library costuma ser enxuta: fronteira pública + política de dependência + compatibilidade.

## Infrastructure

Documente quando útil:

- recursos e módulos como unidades arquiteturais;
- dependências entre stacks/módulos;
- ambientes;
- estado (remote state, fronteiras de import) em alto nível;
- fronteiras de deploy e blast radius.

Mantenha detalhe específico de provedor em docs de infra; a arquitetura nomeia papéis (`network edge`, `compute`, `datastore`) quando isso esclarecer.

## Dados / Pipeline

Documente quando útil:

- fontes;
- transformações;
- destinos;
- schedules ou triggers;
- dependências (frescor upstream, warehouses compartilhados);
- expectativas de qualidade de dados no nível arquitetural;
- domínios de falha e replay.

## Como usar este guia

1. Identifique o(s) tipo(s) mais próximo(s) a partir de evidência, não de aspiração.
2. Escolha níveis de documentação em [architecture-model.md](architecture-model.md) que batam com risco e tamanho.
3. Use [diagram-selection.md](diagram-selection.md) para diagramas que respondam perguntas reais.
4. Pule seções que não se aplicam — não invente conteúdo para "completar" um checklist de tipo.

## Documentos relacionados

- [architecture-model.md](architecture-model.md)
- [system-boundaries.md](system-boundaries.md)
- [architecture-checklist.md](architecture-checklist.md)
- [architecture-vs-implementation.md](architecture-vs-implementation.md)
- [diagram-selection.md](diagram-selection.md)
