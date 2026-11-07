# Guia de uso do Datadog (operadores)

> Language: pt-BR | [English (EN)](../../en/loft-observability/datadog-usage-guide.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Informational

Guia prático para engenheiros e operadores triando serviços Olivelas na EKS. URL org: `[pending: URL da organização Datadog Olivelas]`.

## Antes de começar

Do `values.yaml` no `k8s-apps` ou da documentação, saiba:

| Token | Onde |
| --- | --- |
| `DD_SERVICE` | `application.name` ou `datadog.service` |
| `DD_ENV` | `application.environment` |
| `DD_VERSION` | Tag da imagem (action de deploy) |

Ver [k8s-datadog-enablement.md](k8s-datadog-enablement.md).

## 1. Encontrar o serviço (APM)

1. Abra **APM → Services**.
2. Filtre por `env:production` (ou seu environment).
3. Selecione o serviço que corresponde a `DD_SERVICE`.

Confirme:

- Volume de requests e taxa de erro visíveis.
- Nomes de resource usam **templates de rota** (ex.: `GET /api/health`), não paths ilimitados.

## 2. Inspecionar traces

1. Abra um trace lento ou com falha.
2. Verifique spans: HTTP server, banco, HTTP outbound.
3. Use a aba **Logs** no span — deve mostrar linhas JSON correlacionadas quando [logging estruturado](structured-logging.md) e instrumentação estão corretos.

Se a aba Logs estiver vazia: verifique logs JSON na app, `ddtrace` / Java agent e `DD_LOGS_INJECTION`.

## 3. Buscar logs (Logs Explorer)

Queries comuns:

```text
service:<DD_SERVICE> env:<DD_ENV>
service:<DD_SERVICE> env:<DD_ENV> status:error
service:<DD_SERVICE> env:<DD_ENV> @http.status_code:>=500
```

Dicas:

- Reduza a janela de tempo ao redor do incidente.
- Adicione `@request_id:` ou campos custom que a app emite.
- Não compartilhe queries com secrets ou PII em tickets.

## 4. Dashboards (baseline RED)

Para cada serviço em produção, espere (ou planeje) dashboard com:

| Sinal | Exemplos |
| --- | --- |
| **Rate** | Requests por segundo |
| **Errors** | Taxa de erro, contagem 5xx |
| **Duration** | Latência p50/p95/p99 |

Saturação (CPU/memória) pode vir de métricas de infra.

`[pending: ID do template de dashboard padrão Olivelas por serviço]`

## 5. Monitors e alertas

Monitors devem:

- Disparar em condições **acionáveis** (quebra de SLO, pico de erro, crash loop).
- Linkar **runbook** na doc do projeto.
- Rotear para canal/on-call do squad dono.

Não documente IDs de monitor inexistentes — registre debt se faltar.

## 6. Durante um incidente

Ordem sugerida:

1. **APM** — regressão de erro/latência em `DD_SERVICE`.
2. **Logs** — `status:error` no início do incidente; siga `trace_id`.
3. **Dependências** — spans downstream (DB, clientes HTTP).
4. **Correlação de deploy** — compare `DD_VERSION` / tag com horário do deploy.
5. **Runbook** — `runbooks/` do projeto conforme [operations-model.md](../operations-model.md).

## 7. O que documentar após triagem

Atualize a doc de observabilidade do projeto com:

- Queries que funcionaram.
- Gaps (campos faltando, sem correlação).
- Debt de monitor/dashboard com owner.

## Documentos relacionados

- [verification-checklist.md](verification-checklist.md)
- [documentation-prerequisites.md](documentation-prerequisites.md)
- [../monitoring.md](../monitoring.md)
- [../alerting.md](../alerting.md)
