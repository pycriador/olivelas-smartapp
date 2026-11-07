# Padrões de Diagramas de Arquitetura

> Language: pt-BR | [English](../en/architecture-diagrams.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Padrões para diagramas de arquitetura: quando desenhá-los, como rotulá-los e quais tipos este padrão reconhece.

Projetos **não** são obrigados a produzir todo tipo de diagrama. Crie um diagrama apenas quando ele responder a uma pergunta real — veja [diagram-selection.md](diagram-selection.md).

## Requisitos de diagrama

Todo diagrama de arquitetura deve ter:

| Elemento | Regra |
| --- | --- |
| **Title** | Específico e escaneável (por exemplo `Checkout request flow`) |
| **Purpose** | Uma frase: qual pergunta o diagrama responde |
| **Consistent naming** | Mesmos nomes da prosa de arquitetura e docs de componente |
| **Relevant scope** | Apenas nós necessários ao propósito; sem mapas kitchen-sink |
| **Legend** | Quando formas, cores ou estilos de linha carregam significado |
| **Flow direction** | Clara quando ordem ou iniciação importam; rotule arestas ([component-relationships.md](component-relationships.md)) |
| **Links** | Ponteiros para docs complementares (contratos, ADRs, runbooks) |

Prefira formatos versionáveis como texto. Mermaid é recomendado quando apropriado — [mermaid-standards.md](mermaid-standards.md).

Diagramas padrão representam o **estado atual**. Rotule Proposed explicitamente.

Nunca coloque segredos, credenciais ou dados sensíveis desnecessários em rótulos.

## Tipos de diagrama

Todos os tipos abaixo são opcionais por projeto.

### Diagrama de contexto

Mostra:

- o sistema como uma caixa (ou um pequeno conjunto de sistemas no escopo);
- usuários / consumidores;
- sistemas externos;
- relacionamentos principais na fronteira.

Propósito: *Onde este sistema se encaixa?*

### Diagrama de container / unidade implantável

Mostra:

- unidades implantáveis ou independentemente executáveis;
- responsabilidades primárias;
- conexões principais entre unidades.

Propósito: *Quais são as principais peças de runtime/implantáveis?*

Agnóstico de tecnologia: "unidade implantável" pode ser um serviço, app, job, grupo de funções, pacote ou outra unidade — não exija containers ou Kubernetes.

### Diagrama de componentes

Mostra:

- componentes arquiteturais dentro de uma ou mais unidades;
- dependências e interfaces;
- relacionamentos rotulados.

Propósito: *Como as partes internas se relacionam?*

### Diagrama de sequência

Mostra:

- interação temporal;
- calls, eventos, respostas;
- timeouts, erros, retries quando relevantes.

Propósito: *Como uma operação se desenrola no tempo?*

### Diagrama de fluxo de dados

Mostra:

- origem, transformação, transporte, destino;
- persistência apenas quando existir.

Propósito: *Como os dados se movem e mudam?*

### Diagrama de estados

Mostra:

- estados, transições e condições de um processo ou entidade com ciclo de vida significativo.

Propósito: *Como este processo muda de estado?*

### Diagrama de infraestrutura

Mostra a organização da infraestrutura quando essa visão for relevante: ambientes, fronteiras de compute/storage/network, topologia de deploy — sem assumir um provedor específico.

Propósito: *Como a infraestrutura de runtime está organizada para este sistema?*

## Anti-padrões

| Evite | Prefira |
| --- | --- |
| Um mega-diagrama para tudo | Divida por nível ([architecture-model.md](architecture-model.md)) |
| Setas sem rótulo | Tipos de relacionamento rotulados |
| Misturar current e Proposed sem rótulos | Diagramas separados ou marcadores claros |
| Logos de vendor como arquitetura | Nomes arquiteturais estáveis |
| Grafos de classe/função como "arquitetura" | Mantenha detalhe de implementação no Level 4 / docs de código |

## Colocação

- Embuta diagramas perto da prosa que eles suportam.
- Reutilize a mesma fonte de diagrama entre docs via inclusão ou links quando a ferramenta permitir; caso contrário, mantenha uma cópia canônica e linke para ela.
- Atualize diagramas na mesma mudança que alterações estruturais de código/config quando viável ([architecture-review.md](architecture-review.md)).

## Documentos relacionados

- [diagram-selection.md](diagram-selection.md)
- [mermaid-standards.md](mermaid-standards.md)
- [component-relationships.md](component-relationships.md)
- [architecture-model.md](architecture-model.md)
- [templates/diagram.md](templates/diagram.md)
