# Contratos Semânticos

> Language: pt-BR | [English](../en/semantic-contracts.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Um contrato pode ser **estruturalmente válido** e ainda assim **semanticamente errado**. Estrutura sozinha não basta.

## Estrutural vs semântico

### Structural Contract

Define a forma: nomes, tipos, presença, formatos.

```text
name: string
age: integer
```

### Semantic Contract

Define o significado: como os participantes devem interpretar os valores.

```text
age = completed years of age (not months, not "apparent age")
```

| Aspect | Structural | Semantic |
| --- | --- | --- |
| Question | Quais campos existem e em que forma? | O que os valores significam e implicam? |
| Failure mode | Erro de parse/tipo | Uso silencioso incorreto, resultado de negócio errado |
| Example defect | Campo ausente ou tipo errado | `amount` tratado como unidades maiores quando é unidades menores |

## Como documentar significado

Para cada campo ou conceito importante, documente:

| Element | Guidance |
| --- | --- |
| Plain-language meaning | Uma frase clara |
| Units | Unidades menores de moeda, segundos, metros, etc. |
| Time semantics | Timezone, fonte de relógio, event time vs processing time |
| Identity | O que o ID identifica; unicidade e estabilidade |
| Lifecycle | Quando o valor é definido, atualizado ou invalidado |
| Null / absent | Diferença entre missing, null, empty e zero |
| Allowed interpretations | O que consumers podem e não devem assumir |
| Related business rule | Link ou declaração curta quando o significado depende de processo |

Coloque a semântica na coluna **Description** do campo ([schema-documentation.md](schema-documentation.md)), em uma seção dedicada **Semantics**, ou em ambas. Prefira a coluna Description para significado no nível do campo; use uma seção Semantics para conceitos cross-field ou de domínio.

## Semântica cross-field

Documente quando o significado depende de outros campos (por exemplo: `status` + `closed_at` devem ser consistentes). Regras cross-field pertencem a [contract-validation.md](contract-validation.md) e ainda assim devem declarar o significado pretendido, não apenas a checagem.

## Classificação

Afirmações semânticas precisam de evidência como qualquer outra:

- **Confirmed** — código, comentários de schema, testes ou definição de domínio aceita
- **Inferred** — deduzido; rotule claramente
- **Unknown** — não invente unidades ou significado de negócio
- **Proposed** — reinterpretação futura; não é o contrato atual

## Documentos relacionados

- [schema-documentation.md](schema-documentation.md)
- [contract-validation.md](contract-validation.md)
- [contract-model.md](contract-model.md)
- [breaking-changes.md](breaking-changes.md)
