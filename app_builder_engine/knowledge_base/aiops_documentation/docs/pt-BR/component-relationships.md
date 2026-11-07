# Relacionamentos entre Componentes

> Language: pt-BR | [English](../en/component-relationships.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar relacionamentos entre componentes arquiteturais — com semântica explícita, não setas sem rótulo.

## Propósito

Relacionamentos respondem:

> Como essas partes se conectam e o que cada conexão significa?

Componentes são unidades arquiteturais de responsabilidade. Não promova automaticamente todo arquivo ou classe a componente.

## Tipos de relacionamento

Projetos podem usar qualquer tipo de relacionamento que seja preciso. Tipos comuns incluem (não é uma lista fechada):

| Tipo | Significado típico |
| --- | --- |
| **depends on** | A precisa de B para cumprir sua responsabilidade (compile-time, runtime ou operacional) |
| **calls** | A invoca B de forma síncrona ou com resposta esperada |
| **publishes** | A emite eventos/mensagens para outros |
| **consumes** | A processa eventos/mensagens produzidos em outro lugar |
| **stores** | A persiste dados em B |
| **reads** | A lê dados de B |
| **writes** | A escreve dados em B |
| **triggers** | A causa o início de B (schedule, webhook, evento, passo de pipeline) |
| **authenticates** | A estabelece identidade para acesso envolvendo B |
| **authorizes** | A decide ou aplica permissão envolvendo B |

Adicione verbos específicos do projeto quando necessário (`mirrors`, `indexes`, `schedules`, `proxies`, …). Prefira um vocabulário pequeno usado de forma consistente a um conjunto livre grande.

## Semântica da direção de dependência

Setas devem ser rotuladas. Uma seta sem rótulo é documentação de arquitetura inválida.

```text
A → B
```

significa o que o **rótulo** diz. A direção da seta sozinha não basta.

Diferencie pelo menos:

| Frase | Prefira quando |
| --- | --- |
| **depends on** | Necessidade estrutural ou operacional (A não cumpre seu papel sem B) |
| **calls** | Caminho de invocação / request |
| **publishes to** | A escreve em um canal, tópico, stream ou outbox consumido por outros |
| **consumes from** | A lê de um canal ownership ou alimentado por outros |
| **reads from** | A recupera dados sem implicar ownership do store |
| **writes to** | A muta dados em um store ou sink |

Exemplos de rótulos claros:

```text
checkout-api —calls→ payment-gateway
checkout-api —publishes to→ order-events
inventory-projector —consumes from→ order-events
reporting —reads from→ analytics-store
order-service —writes to→ order-store
```

Forma ambígua a evitar:

```text
A → B
```

(sem rótulo — o leitor não distingue call vs publish vs depends on)

## Depends on vs calls

| | **depends on** | **calls** |
| --- | --- | --- |
| Escopo | Mais amplo: bibliotecas, plataformas, dados, tooling de ops | Mais estreito: relacionamento de invocação |
| Pode incluir | Serviços de runtime que A nunca "chama" diretamente, mas exige | Caminho explícito de request/command |
| Dica de diagrama | Use para mapas de criticidade | Use para sequência e colaboração de runtime |

A pode **depends on** B sem **calls** B (schema de banco compartilhado ownership de outro, capacidade de plataforma exigida, biblioteca de build-time). Prefira ambos os rótulos quando ambos forem verdadeiros e importarem.

## Tabelas vs diagramas

Use uma tabela quando o inventário importar:

| From | Relationship | To | Contract / notes | Criticality |
| --- | --- | --- | --- | --- |
| | calls / publishes to / … | | | High / Medium / Low |

Use um diagrama quando a topologia importar — ainda com rótulos nas arestas. Veja [architecture-diagrams.md](architecture-diagrams.md) e [mermaid-standards.md](mermaid-standards.md).

## Criticidade e falha

Para relacionamentos materiais, documente:

- **Criticality** — quão gravemente A falha se o relacionamento quebrar;
- **Failure impact** — efeito visível ao usuário ou ao integrador;
- link para [failure-domains.md](failure-domains.md) quando o blast radius não for óbvio.

## Regras de consistência

1. Nomes em docs de relacionamento devem bater com nomes de componentes e diagramas.
2. A direção deve corresponder à realidade de runtime (quem inicia, quem possui o canal).
3. Relacionamentos Proposed devem ser rotulados Proposed — nunca misturados sem marcação com o estado atual.
4. Prefira linkar contratos para relacionamentos que carregam interface.

## Progressive disclosure

| Tamanho do projeto | Mínimo |
| --- | --- |
| Small | Lista curta de dependências com tipos |
| Medium | Tabela de relacionamentos + um diagrama de componentes |
| Large | Divida por subsystem; mantenha um mapa-resumo no topo |

## Documentos relacionados

- [architecture-model.md](architecture-model.md)
- [architecture-diagrams.md](architecture-diagrams.md)
- [mermaid-standards.md](mermaid-standards.md)
- [failure-domains.md](failure-domains.md)
- [architecture-traceability.md](architecture-traceability.md)
