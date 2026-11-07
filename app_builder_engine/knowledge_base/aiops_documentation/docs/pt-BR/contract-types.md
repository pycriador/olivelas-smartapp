# Tipos de Contrato

> Language: pt-BR | [English](../en/contract-types.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Tipos de contrato classificam **que tipo de fronteira** está sendo documentada. Um único documento de contrato pode declarar mais de um tipo quando os tipos se sobrepõem de fato (por exemplo Event + Data, ou API + Integration).

Tipos são rótulos para clareza documental — não uma taxonomia obrigatória que todo projeto deve esgotar.

## Tipos

### API Contract

Uma interface de serviço ou capacidade: request/response, query, mutation ou similar. Pode ser realizada com HTTP, RPC, GraphQL, chamadas locais de processo ou outros protocolos. A escolha de protocolo pertence aos metadados do contrato, não à definição do tipo.

Orientação: [api-contracts.md](api-contracts.md).

### Event Contract

Algo que **aconteceu**. O producer emite um fato; consumers reagem. Eventos descrevem mudanças de estado passadas; não instruem um consumer específico a agir como um comando faria.

Orientação: [event-contracts.md](event-contracts.md).

### Message Contract

Uma mensagem trocada entre sender e receiver (fila, stream, inbox ou outro canal). Delivery, acknowledgement e tratamento de falha variam por sistema — documente o que esta fronteira realmente faz.

Orientação: [message-contracts.md](message-contracts.md).

### File Contract

Integração por arquivos ou artefatos semelhantes a arquivo: batch drops, exports, imports, objetos em object storage. Não assuma CSV nem um único formato.

Orientação: [file-contracts.md](file-contracts.md).

### Command Contract

Um pedido de que algo **deve acontecer**. Distinto de um evento (que relata que algo já aconteceu). Comandos frequentemente implicam um handler pretendido e um resultado esperado.

### Callback Contract

Uma chamada reversa ou secundária: o provider depois invoca uma interface, canal ou endpoint fornecido pelo client. Documente timing do callback, auth, payload e tratamento de falha.

### Library Contract

API pública de uma biblioteca ou pacote: funções, tipos, side effects, versioning e compatibility para callers. Trate a superfície publicada como a fronteira do contrato.

### Dados Contract

Estrutura e significado de dados compartilhados através de uma fronteira (records, projections, tables, documents). Frequentemente combinado com tipos API, Event, Message ou File.

### Integration Contract

Acordo entre sistemas ou plataformas que abrange múltiplos mecanismos. Use quando a fronteira é o relacionamento de integração em si, não uma única interface estreita.

## Sobreposição

| Situation | Guidance |
| --- | --- |
| Event with rich payload schema | Event + Data |
| API that accepts file uploads | API + File (ou documente regras de arquivo sob o contrato de API) |
| Command delivered as a message | Command + Message — declare ambos; esclareça qual é primário |
| External partner integration | Integration + o(s) tipo(s) concreto(s) usado(s) |

Escolha o tipo **primário** para nomenclatura e descoberta; liste tipos secundários nos metadados quando útil.

## O que tipos não são

- Não são exigência de criar um documento por tipo para todo sistema.
- Não são exigência de protocolo (um "API Contract" não precisa ser HTTP).
- Não são rótulos mutuamente exclusivos.

## Documentos relacionados

- [contract-model.md](contract-model.md)
- [api-contracts.md](api-contracts.md)
- [event-contracts.md](event-contracts.md)
- [message-contracts.md](message-contracts.md)
- [file-contracts.md](file-contracts.md)
- [standards.md](standards.md)
