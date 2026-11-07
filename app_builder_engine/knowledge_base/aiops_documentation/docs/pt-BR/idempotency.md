# Idempotency

> Language: pt-BR | [English](../en/idempotency.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar se repetir uma operação sob um contrato é seguro e o que "seguro" significa para esta fronteira.

**Não** assuma que toda operação é idempotente. **Não** invente uma idempotency key quando nenhuma existir.

## Perguntas que o contrato deve responder

| Question | Why it matters |
| --- | --- |
| Is the operation idempotent? | yes / no / partial / Unknown |
| What identifier guarantees idempotency? | Key, natural key, request hash, none |
| For how long? | Janela de retenção do registro de idempotency |
| What happens on duplicates? | Mesmo resultado de sucesso, conflict, ignored, Unknown |
| How should the consumer handle reprocessing? | Passos seguros de retry, expectativas de dedupe |

## Forma de documentação

| Topic | Value | Classification |
| --- | --- | --- |
| Idempotent | yes / no / partial / Unknown | |
| Idempotency key / strategy | … | |
| Retention window | … | |
| Duplicate behavior | … | |
| Consumer guidance | … | |

## Quando as garantias são desconhecidas

Se o time não puder confirmar idempotency a partir de evidência (código, testes, comportamento da plataforma), documente:

> **Idempotency not guaranteed.**

Não implique segurança com redação vaga ("should be fine to retry"). Emparelhe com [retry-policy.md](retry-policy.md): se idempotency não for garantida, retries podem criar side effects duplicados — diga isso.

## Idempotency parcial

Algumas operações são idempotentes para um subconjunto de resultados (por exemplo create-or-return em chave única, mas não para efeitos de "append"). Documente o caso parcial explicitamente em vez de um "yes" genérico.

## Documentos relacionados

- [retry-policy.md](retry-policy.md)
- [delivery-semantics.md](delivery-semantics.md)
- [contract-validation.md](contract-validation.md)
- [message-contracts.md](message-contracts.md)
