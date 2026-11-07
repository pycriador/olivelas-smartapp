# Documentação de Schema

> Language: pt-BR | [English](../en/schema-documentation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar a estrutura de dados que atravessa a fronteira de um contrato.

Um schema está incompleto se apenas lista nomes de campos. **O significado semântico faz parte do contrato** — veja [semantic-contracts.md](semantic-contracts.md).

## O que um schema deve possibilitar

Um leitor (ou agente) deve entender, para cada campo relevante:

| Concern | Meaning |
| --- | --- |
| Field | Nome estável |
| Type | Tipo de dados usado por este contrato |
| Required | Se o campo deve estar presente |
| Description | O que o campo significa (semântica) |
| Format / constraints | Valores permitidos, faixas, padrões, defaults |
| Example | Valor representativo sem segredos |

## Modelo de tabela de campos

Use esta tabela (ou equivalente que cubra as mesmas colunas) como forma legível padrão do schema:

| Field | Type | Required | Description | Constraints | Example |
| --- | --- | --- | --- | --- | --- |
| `order_id` | string | yes | Identificador estável do pedido | UUID preferido; imutável após create | `a1b2c3d4-...` |
| `amount` | integer | yes | Valor em unidades menores da moeda (ex.: centavos) | `>= 0` | `1599` |
| `currency` | string | yes | Código de moeda ISO 4217 | enum dos códigos suportados | `BRL` |

Regras:

- **Description** é obrigatória para campos que consumers devem interpretar.
- Não deixe Description em branco nem copie o nome do campo.
- Coloque format, range, length, enum, pattern e default em **Constraints**.
- Marque classificação quando a certeza importar (`Confirmed` / `Inferred` / `Unknown`).

## Notas adicionais de schema

Documente quando aplicável:

| Topic | Guidance |
| --- | --- |
| Nested structures | Achate com paths pontilhados ou subseções aninhadas; seja consistente |
| Collections | Declare o tipo do elemento e regras de emptiness |
| Defaults | Default explícito vs "ausente significa null/unknown" |
| Deprecated fields | Marque deprecated; não remova silenciosamente da doc enquanto ainda forem emitidos |
| Sensitive fields | Identifique sensibilidade; nunca coloque valores secretos em exemplos |
| External schema | Linke para o artefato de schema autoritativo; mantenha a tabela alinhada ou declare que o schema linkado é Source of Truth |

## Input e Output

Aplique o mesmo modelo a request/input e response/output (ou event payload, message body, file record). Nem todo contrato tem response — eventos, arquivos e mensagens fire-and-forget podem ter outras formas de resultado. Documente o que realmente atravessa a fronteira.

Para cada campo de input quando útil: origem, validação, default, limites. Para cada output: condições sob as quais aparece, códigos/metadados se houver, e comportamento em falha parcial.

## Source of Truth

Prefira uma única representação autoritativa de schema. Se a documentação embute uma tabela **e** existe um schema de máquina, declare qual é autoritativo — [contract-source-of-truth.md](contract-source-of-truth.md).

## Documentos relacionados

- [semantic-contracts.md](semantic-contracts.md)
- [contract-validation.md](contract-validation.md)
- [contract-source-of-truth.md](contract-source-of-truth.md)
- [templates/contract.md](templates/contract.md)
