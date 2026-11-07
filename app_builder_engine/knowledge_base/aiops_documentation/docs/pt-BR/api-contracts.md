# Contratos de API

> Language: pt-BR | [English](../en/api-contracts.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Orientação para documentar contratos em forma de **API**. APIs são um tipo de contrato entre muitos ([contract-types.md](contract-types.md)). Este documento **não** torna HTTP (nem nenhum protocolo) o centro do modelo.

Um contrato de API documenta uma interface de capacidade: como um client invoca um provider e o que volta (quando algo volta).

## Documente quando aplicável

| Topic | Guidance |
| --- | --- |
| Interface | Capacidade nomeada ou superfície que o client chama |
| Endpoint / channel / method | Endereço e identidade da operação **como usados pelo projeto** — não necessariamente URL + verbo HTTP |
| Parameters | Inputs da operação (path/query/body/args — termos do projeto) |
| Headers / metadata | Metadados de transporte ou da chamada se fizerem parte do acordo |
| Request / input | Schema + semantics ([schema-documentation.md](schema-documentation.md)) |
| Response / output | Sucesso e resultados alternativos; omita se não aplicável |
| Authentication | Nomes dos mecanismos e de onde vêm as credenciais — nunca valores de segredo |
| Authorization | Quem pode chamar; scopes/roles exigidos se houver |
| Errors | Condição, identidade, retryability, ação do consumer |
| Pagination | Como conjuntos grandes de resultado são fatiados |
| Filtering / sorting | Critérios suportados e defaults |
| Rate limits | Expectativas de throttling e orientação ao client |
| Versioning | Como versões de API são selecionadas e aposentadas |

Use as seções de [templates/contract.md](templates/contract.md) que se aplicarem; pule o restante.

## Neutralidade de protocolo

Realizações válidas de API incluem (apenas exemplos): HTTP APIs, RPC, GraphQL, interfaces locais semelhantes a biblioteca e outros protocolos específicos do projeto. Registre o `protocol` real nos metadados. Não exija modelagem de recursos REST.

## Relação com outros tipos

- Upload/download de arquivo como parte de uma API → documente regras de arquivo ou linke um [contrato de arquivo](file-contracts.md).
- Completion async após accept de API → documente delivery, callback ou polling em [timing-contract.md](timing-contract.md) / [delivery-semantics.md](delivery-semantics.md).
- Comandos expostos como operações de API → esclareça semântica de Command vs mera query.

## Documentos relacionados

- [contract-types.md](contract-types.md)
- [contract-model.md](contract-model.md)
- [contract-validation.md](contract-validation.md)
- [retry-policy.md](retry-policy.md)
- [idempotency.md](idempotency.md)
- [timing-contract.md](timing-contract.md)
