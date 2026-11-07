# Modelo de Arquitetura

> Language: pt-BR | [English](../en/architecture-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como este padrão estrutura a documentação de arquitetura — como progressive disclosure, não como um estilo de arquitetura obrigatório.

Arquitetura não deve ser documentada como uma única imagem. Leitores começam com uma visão simples e aprofundam apenas quando precisam.

## Ideia central

```text
Context
   ↓
System
   ↓
Containers / Deployable Units
   ↓
Components
   ↓
Interfaces
   ↓
Implementation
```

Estes são **níveis de documentação**. Não são requisitos de que todo sistema implemente tiers de runtime separados.

Um projeto pequeno pode usar apenas Context + System + alguns Components. Um sistema complexo pode usar todos os níveis. Não force uma aplicação simples a produzir dezenas de documentos de arquitetura.

## Níveis de documentação (estruturais)

| Nível | O que responde | Conteúdo típico |
| --- | --- | --- |
| **Context** | Onde este sistema se situa no ecossistema? | Usuários, consumidores, sistemas externos, principais entradas/saídas |
| **System** | O que é o sistema como um todo? | Propósito, objetivos, não-objetivos, fronteira do sistema |
| **Containers / Deployable Units** | Quais são as principais unidades implantáveis ou de runtime? | Serviços, apps, jobs, pacotes, runtimes — agnóstico de tecnologia |
| **Components** | Quais são as partes arquiteturais significativas dentro das unidades? | Responsabilidades, não-responsabilidades, dependências |
| **Interfaces** | Como as partes se conectam? | Contratos, APIs, eventos, mensagens, arquivos, comandos |
| **Implementation** | Como é construído em código/config? | Módulos, pacotes, IaC — linke para fora; não despeje listas de classes em overviews de arquitetura |

### Context

Descreva o sistema em relação ao seu ambiente: atores, sistemas adjacentes e os relacionamentos que importam para entender o posicionamento — não toda integração que existe.

### System

Descreva propósito, objetivos, não-objetivos e a [fronteira do sistema](system-boundaries.md). Deixe explícito o que o sistema possui e o que ele não controla.

### Containers / Deployable Units

Use este nível quando o sistema tiver mais de uma unidade implantável ou independentemente executável (processo, serviço, job, pacote, app de edge, etc.). Nomeie unidades pelo papel arquitetural, não por nomes de marketing ou de produto de vendor, salvo se esses nomes forem os identificadores estáveis do projeto.

Pule este nível quando uma única unidade implantável for suficiente; incorpore-o em System + Components.

### Components

Componentes são unidades arquiteturais de responsabilidade — não todo arquivo, classe ou função. Prefira nomes grosseiros e estáveis que sobrevivam a refactors.

Veja [component-relationships.md](component-relationships.md) e templates em `templates/` (templates de component / architecture quando adotados).

### Interfaces

Documente como componentes e atores externos trocam informação: request/response, eventos, streams, arquivos, I/O de CLI e outros contratos. Prefira links para [contratos](contracts/README.md) canônicos em vez de copiar schemas na prosa de arquitetura.

### Implementation

Docs de arquitetura podem apontar para módulos, repositórios ou caminhos de config como evidência. Estrutura detalhada de código pertence a docs de aplicação ou de desenvolvedor — veja [architecture-vs-implementation.md](architecture-vs-implementation.md).

## Níveis de documentação de arquitetura (profundidade de audiência)

Independente do modelo estrutural acima, escolha quão profundo um dado documento ou seção vai:

| Profundidade | Audiência | Foco |
| --- | --- | --- |
| **Level 1 — Executive** | Liderança, times adjacentes, orientação rápida | Propósito em um parágrafo, no máximo um diagrama, principais riscos/trade-offs |
| **Level 2 — System** | Engenheiros novos no sistema | Contexto, fronteira, componentes principais, dependências principais |
| **Level 3 — Technical** | Time dono, integradores | Componentes, fluxos, relacionamentos, fronteiras de falha/confiança, contratos |
| **Level 4 — Implementation** | Engenheiros que alteram o sistema | Mapas de módulos, config, sequências detalhadas — ainda não toda classe |

Orientação:

- A maioria dos projetos precisa do Level 2 como padrão do overview de arquitetura.
- Adicione Level 3 onde complexidade ou risco justificar.
- Mantenha Level 4 fora do overview principal de arquitetura; linke para docs de componente ou de desenvolvedor.
- Level 1 é opcional; útil quando stakeholders precisam de um ponto de entrada curto.

## Progressive disclosure

1. Comece com propósito e fronteira do sistema.
2. Adicione contexto e componentes principais.
3. Adicione relacionamentos, fluxos de dados e dependências críticas quando surgirem perguntas.
4. Adicione domínios de falha, fronteiras de confiança e atributos de qualidade quando resiliência ou segurança importarem.
5. Linke ADRs para o *porquê*; mantenha docs de arquitetura focados no *que existe*.

Não exija toda seção de todo template para todo projeto. Seções vazias que não se aplicam devem ser omitidas ou marcadas Not Applicable — não preenchidas com conteúdo inventado.

## Postura agnóstica de tecnologia

Não trate nenhum dos itens abaixo como requisitos universais deste modelo:

- provedor de cloud, linguagem, framework, banco de dados;
- containers, Kubernetes, serverless;
- monolito, microservices, event-driven, hexagonal, DDD, CQRS ou outros estilos.

Nomeie estilos apenas quando evidência ou declaração explícita do projeto os suportarem. Caso contrário: architectural pattern not identified. Regras de classificação: [standards.md](standards.md).

## Documentos relacionados

- [system-boundaries.md](system-boundaries.md)
- [component-relationships.md](component-relationships.md)
- [architecture-diagrams.md](architecture-diagrams.md)
- [architecture-vs-implementation.md](architecture-vs-implementation.md)
- [architecture-by-project-type.md](architecture-by-project-type.md)
- [architecture-traceability.md](architecture-traceability.md)
- [architecture/README.md](architecture/README.md)
- [principles.md](principles.md)
