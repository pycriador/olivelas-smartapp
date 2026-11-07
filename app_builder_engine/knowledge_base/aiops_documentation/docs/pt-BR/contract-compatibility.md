# Compatibilidade de Contrato

> Language: pt-BR | [English](../en/contract-compatibility.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Compatibility descreve se os participantes podem continuar trabalhando corretamente quando um contrato evolui. **Não** é uma propriedade só do producer. Analise **producer e consumer** juntos.

## Definições

### Backward Compatibility

Consumers existentes continuam a funcionar com um novo producer (ou nova versão de contrato) sob premissas documentadas.

Pergunta típica: *Os consumers de hoje ainda processam a saída do producer de amanhã?*

### Forward Compatibility

Consumers conseguem lidar com versões de contrato mais novas do que aquelas para as quais foram construídos (por exemplo ignorando campos desconhecidos), dentro de limites declarados.

Pergunta típica: *O consumer de hoje tolera mudanças additive de amanhã?*

### Breaking Change

Uma mudança que pode invalidar expectativas de participantes existentes — consumers, producers ou ambos. Veja [breaking-changes.md](breaking-changes.md).

## Análise producer + consumer

| Change | Producer impact | Consumer impact | Notes |
| --- | --- | --- | --- |
| Add optional field (producer emits) | Low | Depende da tolerância a unknown fields | Parsers estritos podem quebrar |
| Remove field | Pode parar de emitir | Quebra se o campo for exigido pelo consumer | Geralmente breaking |
| Change semantics of existing field | Deve emitir novo significado | Interpreta mal se não souber | Breaking mesmo se tipos coincidirem |
| New required input | Callers devem fornecer | Clients quebram até atualizar | Breaking para clients |
| Loosen validation | Aceita mais | Pode enviar valores recém-permitidos | Verifique outros consumers |

Sempre pergunte:

1. Quem produz sob este contrato hoje?
2. Quem consome?
3. Quais premissas cada lado codifica (campos obrigatórios, enums, códigos de erro, ordem)?
4. A mudança viola essas premissas?

## Documentando compatibility

| Change type | Compatible? | Conditions | Notes |
| --- | --- | --- | --- |
| Additive optional field | conditional | consumers ignore unknowns | |
| Field removal | no | — | requer nova versão |
| Semantic change | no | — | requer nova versão / migration |

Declare premissas explicitamente (por exemplo: "Consumers must ignore unknown fields").

## Documentos relacionados

- [contract-versioning.md](contract-versioning.md)
- [breaking-changes.md](breaking-changes.md)
- [contract-change-management.md](contract-change-management.md)
- [semantic-contracts.md](semantic-contracts.md)
