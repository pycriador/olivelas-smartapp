# Validação de Contrato

> Language: pt-BR | [English](../en/contract-validation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Regras de validação definem o que torna um input, output ou mensagem **aceitável** sob o contrato. Documente as regras das quais producers e consumers dependem — não uma lista de desejos aspiracionais.

## Categorias de validação

| Category | Meaning | Example |
| --- | --- | --- |
| **required** | Campo deve estar presente | `order_id` sempre presente |
| **type** | Valor deve corresponder ao tipo declarado | integer, string, boolean, object |
| **format** | Restrição de representação | date-time, UUID, string em forma de email |
| **range** | Limites numéricos ou comparáveis | `0 <= score <= 100` |
| **length** | Tamanho de string ou collection | `1..64` characters |
| **enum** | Conjunto fechado de valores permitidos | `pending` \| `paid` \| `cancelled` |
| **pattern** | Expressão regular ou padrão estrutural | `^[A-Z]{3}$` |
| **cross-field** | Restrição que abrange vários campos | `end_at >= start_at` |
| **business constraint** | Regra de domínio além da forma estrutural | não é possível cancelar um pedido já fulfilled |

Liste apenas as categorias que se aplicam. Adicione categorias específicas do projeto se necessário, com nomes claros.

## Validação estrutural vs de negócio

### Structural Validation

Verifica formato e forma: type, required, length, pattern, membership de enum como forma de dados.

Falha geralmente significa "malformed" — a mensagem/request não está bem formada sob o schema.

### Business Validation

Verifica regras de domínio que podem exigir estado, contexto ou políticas além da forma do payload.

Falha geralmente significa "well-formed but not allowed" — o consumer/provider rejeita a operação por razões de negócio.

| | Structural | Business |
| --- | --- | --- |
| Typical signal | Schema / type error | Domain / policy error |
| Can succeed structurally? | Não se structural falhar | Sim, e então falhar na regra de negócio |
| Document | Schema + validation table | Validation + error contract |

Não colapse ambos em um único "invalid" vago sem declarar qual tipo se aplica quando consumers precisam de tratamentos diferentes (retry, corrigir payload, escalar).

## Como documentar regras

Tabela sugerida:

| Rule ID | Category | Target | Rule | Kind | Error / outcome |
| --- | --- | --- | --- | --- | --- |
| V-01 | required | `order_id` | Must be present | Structural | Reject |
| V-02 | range | `amount` | `>= 0` | Structural | Reject |
| V-03 | business | order | Cannot cancel fulfilled order | Business | Domain error |

Inclua exemplos válidos e inválidos quando esclarecerem edge cases. Nunca coloque secrets em exemplos.

## Documentos relacionados

- [schema-documentation.md](schema-documentation.md)
- [semantic-contracts.md](semantic-contracts.md)
- [breaking-changes.md](breaking-changes.md)
- [templates/contract.md](templates/contract.md)
