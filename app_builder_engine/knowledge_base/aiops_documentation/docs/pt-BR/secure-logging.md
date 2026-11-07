# Logging Seguro

> Language: pt-BR | [English](../en/secure-logging.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam **logging e output de diagnóstico** para que observability não se torne vazamento de secret ou privacy.

Integra-se com [observability-model.md](observability-model.md) e [monitoring.md](monitoring.md). Docs de segurança declaram constraints; docs de ops descrevem signals e tooling.

## Regras rígidas

1. **Não logue valores secretos** (passwords, tokens, API keys, private keys, session secrets brutos).
2. **Não logue PII ou dados pessoais sensíveis desnecessários.** Prefira identifiers já públicos ao operador autorizado, redaction, hashing ou omissão.
3. **Não cole linhas de log de produção que contenham secrets ou PII na documentação.**

Na dúvida, omita. Marque comportamento de redaction **Unknown** se não verificado.

## O que documentar

| Topic | Guidance |
| --- | --- |
| **Allowed fields** | Fields operacionais seguros para diagnóstico |
| **Forbidden / redacted fields** | Secrets, payment data, credentials, attributes sensíveis |
| **Correlation ids** | Prefira request/trace ids estáveis a personal keys |
| **Access to logs** | Quem pode ler — [authorization.md](authorization.md), [least-privilege.md](least-privilege.md) |
| **Retention** | Retention de logs — ou **Not Defined** — [data-retention.md](data-retention.md) |
| **Segurança-relevant events** | O que deve ser logado para [auditability.md](auditability.md) |

## Inventário sugerido

| Event / log class | Purpose | Allowed fields | Redacted / forbidden | Retention | Access | Certainty |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## Relação com Auth e Incidents

| Concern | Link |
| --- | --- |
| Falhas de authn / uso de privilege | [authentication.md](authentication.md), [privileged-access.md](privileged-access.md) |
| Secret exposure via logs | [secret-exposure.md](secret-exposure.md) |
| Evidence de incident | [incident-timeline.md](incident-timeline.md) — ainda sem secrets/PII em docs duráveis |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Regra explícita “no secrets/PII in logs” + notas principais de redaction |
| Medium | Inventário para events de auth e data-access |
| Large | Retention, access control a log stores, regras de correlation cross-system |

## Anti-Patterns

- Logar request bodies completos “para debugging” em APIs Confidential.
- Trace attributes que carregam tokens.
- Documentar sample log lines de produção com emails reais, CPF/CNPJ ou credentials.
- Equacionar “temos logs” com auditability sem events atribuíveis.

## Documentos relacionados

- [auditability.md](auditability.md)
- [observability-model.md](observability-model.md)
- [privacy.md](privacy.md)
- [secrets-management.md](secrets-management.md)
- [data-retention.md](data-retention.md)
- [standards.md](standards.md)
