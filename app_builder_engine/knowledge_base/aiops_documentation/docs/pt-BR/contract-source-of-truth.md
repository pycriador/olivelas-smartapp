# Source of Truth de Contrato

> Language: pt-BR | [English](../en/contract-source-of-truth.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Um contrato pode existir em várias representações. Uma delas deve ser declarada como **Source of Truth** para cada preocupação, ou os times divergirão silenciosamente.

## Representações

| Representation | Role |
| --- | --- |
| **Documentation** | Documento de contrato orientado a humanos (Markdown, etc.) |
| **Schema** | Definição estrutural legível por máquina |
| **Specification** | Artefato formal ou semi-formal de spec de API/evento |
| **Code** | Tipos, validators, handlers na implementação |
| **Generated artifact** | Saída derivada de uma fonte (docs, clients, stubs, schemas exportados) |

## Evite triple drift

Estado perigoso:

```text
Documentation ≠ Schema ≠ Implementation
```

Previna-o ao:

1. Declarar qual artefato é autoritativo para estrutura, para semantics e para comportamento de runtime (podem diferir por preocupação).
2. Linkar cópias não autoritativas de volta à fonte.
3. Atualizar a fonte primeiro, depois regenerar ou revisar dependentes.
4. Tratar divergência sem explicação como [contract drift](contract-drift.md).

## Como declarar Source of Truth

No documento do contrato (ou metadados), declare explicitamente:

| Concern | Authoritative source | Path / id |
| --- | --- | --- |
| Structure | Schema / Spec / Doc / Code | … |
| Semantics | Documentation (geralmente) | … |
| Runtime behavior | Code + tests (com resumo na doc) | … |

Exemplo de declaração:

> Schema file `schemas/order-accepted.schema.*` is authoritative for structure. This Markdown document is authoritative for semantics, retry, and ownership. Implementation must conform; divergence is drift.

## Contratos gerados

Quando contratos ou derivados são gerados:

| Element | Document |
| --- | --- |
| **Source** | Input que humanos/agentes editam (IDL, schema, código anotado, etc.) |
| **Generated artifact** | Saída não editada à mão |
| **Generation process** | Como/quando a geração roda (comando, nome do pipeline — sem ferramenta obrigatória) |

Regras:

- Não trate um arquivo "generated" editado à mão como primário sem justificativa.
- Não edite artefatos gerados como fluxo principal; mude a fonte e regenere.
- Se a documentação for gerada a partir do schema, diga isso — e ainda assim garanta que semantics (significado, retry, ownership) não se percam.

## Documentos relacionados

- [contract-drift.md](contract-drift.md)
- [schema-documentation.md](schema-documentation.md)
- [contract-testing.md](contract-testing.md)
- [architecture-vs-implementation.md](architecture-vs-implementation.md)
