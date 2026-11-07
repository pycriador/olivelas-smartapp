# Guia de Seleção de Diagramas

> Language: pt-BR | [English](../en/diagram-selection.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Escolha diagramas pela pergunta que precisa responder — não por uma cota de tipos de diagrama.

## Matriz de seleção

| Pergunta | Diagrama recomendado |
| --- | --- |
| Onde o sistema se encaixa? | Context |
| Quais são suas unidades principais? | Container / Deployable Unit |
| Como os componentes se relacionam? | Component |
| Como uma operação acontece? | Sequence |
| Como os dados se movem pelo sistema? | Data Flow |
| Como um processo muda de estado? | State |
| Como a infraestrutura está organizada? | Infrastructure |

Definições e padrões: [architecture-diagrams.md](architecture-diagrams.md). Convenções Mermaid: [mermaid-standards.md](mermaid-standards.md).

## Regras de decisão

1. **Comece por uma pergunta.** Se não conseguir enunciá-la em uma frase, provavelmente ainda não precisa de um novo diagrama.
2. **Um propósito por diagrama.** Não misture contexto, sequência e infraestrutura em uma figura.
3. **Prefira menos diagramas precisos.** Um mega-diagrama obsoleto é pior que uma tabela curta.
4. **Reutilize níveis.** Contexto permanece grosso; coloque estrutura interna em visões de container/component.
5. **Pule o que não se aplica.** Uma biblioteca pode precisar de diagramas de component + API pública e nunca de infraestrutura. Uma CLI pode precisar da sequência de execução de comando e nunca de um diagrama de estados.

## Combinando com prosa e tabelas

| Necessidade | Prefira |
| --- | --- |
| Inventário de dependências | Tabela ([component-relationships.md](component-relationships.md)) |
| Topologia / colaboração | Diagrama |
| Ordenação exata de uma operação | Diagrama de sequência ou passos numerados |
| Campos de contrato | Documento de contrato, não um diagrama |

## Progressive disclosure por tamanho do projeto

| Projeto | Diagramas típicos |
| --- | --- |
| Small / simple | Context (opcional) + um component ou sequence se não for óbvio |
| Medium | Context + component ou deployable-unit; adicione sequence para caminhos críticos |
| Large / distributed | Context + deployable units + component/sequence/data-flow seletivos; infraestrutura quando risco de ops justificar |

## Documentos relacionados

- [architecture-diagrams.md](architecture-diagrams.md)
- [mermaid-standards.md](mermaid-standards.md)
- [architecture-model.md](architecture-model.md)
- [architecture-checklist.md](architecture-checklist.md)
