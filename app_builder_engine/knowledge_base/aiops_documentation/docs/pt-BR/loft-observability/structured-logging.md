# Logging estruturado para Datadog

> Language: pt-BR | [English (EN)](../../en/loft-observability/structured-logging.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

**Logs estruturados** são o sinal mínimo de observabilidade para documentação operacional Olivelas — [documentation-prerequisites.md](documentation-prerequisites.md).

## Requisitos

| Regra | Detalhe |
| --- | --- |
| Formato | **Um objeto JSON por linha** em stdout/stderr |
| Destino | stdout do container → agent Datadog → Datadog Logs |
| Correlação | Com `DD_LOGS_INJECTION=true`, traces ligam a logs; opcionalmente `trace_id` / `span_id` no JSON |
| Idioma | **Mensagens** de log para operadores podem ser em inglês; copy de UI para usuário permanece pt-BR |
| Secrets | **Nunca** logar credenciais, tokens, CPF/CNPJ completo, dados bancários — só placeholders |
| PII | Mascarar ou omitir; default deny em exemplos de documentação |

## Campos recomendados

| Campo | Propósito |
| --- | --- |
| `timestamp` | ISO 8601 |
| `level` | `info`, `warn`, `error`, … |
| `message` | Resumo legível |
| `service` | Opcional no payload — também via `DD_SERVICE` |
| `env` | Opcional — também via `DD_ENV` |
| `trace_id`, `span_id` | Correlação manual (Python) |
| `request_id` / id de correlação | Debug cross-service |
| `http.method`, `http.route` | Preferir template de rota, não URL crua com ids |

Evite labels de alta cardinalidade em atributos de log (URLs cruas, user ids como tags de métrica).

## Suporte do chart

Com Datadog habilitado, o chart define `DD_LOGS_INJECTION=true` ([`_helpers.tpl`](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/templates/_helpers.tpl)).

Algumas stacks também recebem `LOG_FORMAT=ndjson` e `LOG_LEVEL=info` por default — confirme no mesmo bloco do template.

## Retenção

Opt-in temporário fora de prod usa `datadog.ttl` (ex.: `7d`, default `eod` do chart para annotations).

Retenção em produção segue políticas da conta Datadog org (`[pending: link da política de retenção de logs Olivelas]`).

## Health checks e ruído

Tráfego de probe não deve dominar logs. Opções:

- Logar health checks só em `debug`, ou
- Usar padrões de exclusão do chart quando configurados ([k8s-datadog-enablement.md](k8s-datadog-enablement.md)).

## Exemplo de query (Datadog Logs)

```text
service:aiops-dataforge-api env:production status:error
```

Substitua service/env pelo seu `DD_SERVICE` / `DD_ENV`.

## Documentação no projeto

Na seção **Logging** de [templates/observability.md](../templates/observability.md), registre:

| Campo | Valor |
| --- | --- |
| Status | `Implemented` / `Partial` / … |
| O que é logado | Erros de request, eventos de negócio, audit trail, … |
| O que não logar | Secrets, política de PII |
| Identificadores de correlação | `request_id`, trace injection |
| Evidência | Query Datadog ou link `[pending: …]` |

## Documentos relacionados

- [application-instrumentation.md](application-instrumentation.md)
- [datadog-usage-guide.md](datadog-usage-guide.md)
- [verification-checklist.md](verification-checklist.md)
