# Política de Retry

> Language: pt-BR | [English](../en/retry-policy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar o comportamento de retry de um contrato. Este padrão **não** prescreve uma única estratégia de retry. O contrato deve registrar a estratégia **realmente adotada** (ou marcar Unknown / Not Applicable).

## O que documentar

| Topic | Question |
| --- | --- |
| Allowed | Retry é permitido para esta interação? |
| When to retry | Quais falhas são retryable? |
| When not to retry | Quais falhas não devem ser retentadas? |
| Count | Máximo de tentativas (incluindo ou excluindo a primeira — declare qual) |
| Backoff | Fixed, linear, exponential, jitter — conforme realmente usado |
| Limit | Orçamento de tempo, max delay, circuit breakers se houver |
| After failure | O que acontece quando os retries se esgotam? |

## Quando retry é apropriado

Tipicamente para falhas **transitórias**: indisponibilidade temporária, timeouts conhecidos como seguros para repetir, dependências sobrecarregadas que se recuperam.

Faça retry apenas quando:

- a falha estiver classificada como retryable no contrato; e
- a história de [idempotency](idempotency.md) da operação for compreendida (ou o risco de side effects duplicados for aceito e documentado).

## Quando não fazer retry

Não faça retry (ou documente "must not retry") para:

- erros permanentes de validação / input malformed;
- falhas de autorização que não mudarão sem nova credencial ou grant;
- rejeições de regra de negócio que não são transitórias;
- erros desconhecidos quando side effects duplicados são prejudiciais e idempotency não é garantida.

Se houver dúvida, escreva **Unknown** e evite afirmar uma política de retry segura.

## Tabela sugerida de documentação

| Topic | Value | Classification |
| --- | --- | --- |
| Retry allowed | yes / no / conditional | |
| Retryable conditions | … | |
| Non-retryable conditions | … | |
| Max attempts | … | |
| Backoff | … | |
| Exhaustion behavior | fail / dead-letter / alert / … | |
| Not Applicable | reason if N/A | |

## Coordenação com outros aspectos do contrato

- **Idempotency** — retries amplificam duplicatas; documente ambos juntos.
- **Timeouts** — [timing-contract.md](timing-contract.md); retries interagem com orçamentos de tempo de client e server.
- **Delivery semantics** — sistemas at-least-once frequentemente implicam retry ou redelivery no lado do consumer.
- **Errors** — cada erro deve declarar retryability quando consumers precisarem disso.

## Documentos relacionados

- [idempotency.md](idempotency.md)
- [timing-contract.md](timing-contract.md)
- [delivery-semantics.md](delivery-semantics.md)
- [contract-model.md](contract-model.md)
