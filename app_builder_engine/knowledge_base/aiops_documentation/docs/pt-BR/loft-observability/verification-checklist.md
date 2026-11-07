# Checklist de verificação — Datadog (Loft)

> Language: pt-BR | [English (EN)](../../en/loft-observability/verification-checklist.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Informational

Execute após deploy ou mudança de observabilidade em serviço Loft na EKS. Complementa [../loft-infra/checklist-novo-servico.md](../loft-infra/checklist-novo-servico.md).

## Kubernetes / chart

- [ ] `application.environment` correto (`production`, `homologation`, …)
- [ ] Enablement Datadog entendido: `datadog.enabled` explícito ou default de produção — [k8s-datadog-enablement.md](k8s-datadog-enablement.md)
- [ ] Pod com `DD_SERVICE`, `DD_ENV`, `DD_VERSION`, `DD_LOGS_INJECTION`, `DD_AGENT_HOST`
- [ ] Sem `DD_*` duplicado/conflitante em `environmentVariables`
- [ ] Toleration Datadog presente quando habilitado
- [ ] Application Argo CD Healthy

## Aplicação — logs (obrigatório)

- [ ] Logs em **JSON** (um objeto por linha) em stdout/stderr
- [ ] Logs visíveis no **Datadog Logs** para filtros `service:` + `env:`
- [ ] Sem secrets ou PII desnecessário nos payloads
- [ ] Ruído de health check aceitável (excluído ou baixo volume)
- [ ] Logging em [templates/observability.md](../templates/observability.md) = `Implemented` ou `Partial` com gaps listados

## Aplicação — traces (recomendado)

- [ ] Lib APM configurada ([application-instrumentation.md](application-instrumentation.md))
- [ ] Serviço visível em **APM → Services**
- [ ] Resources HTTP com templates de rota, não URLs ilimitadas
- [ ] Correlação trace ↔ log funciona em request de amostra

## Métricas e operações (recomendado)

- [ ] Métricas de runtime visíveis com `DD_RUNTIME_METRICS_ENABLED=true`
- [ ] Dashboard baseline existe ou debt registrada `[pending: …]`
- [ ] Monitors críticos com link de runbook ou debt registrada
- [ ] On-call conhece nome do serviço e env no Datadog

## Gate documental (Loft)

- [ ] [documentation-prerequisites.md](documentation-prerequisites.md) atendido para produção
- [ ] Links de evidência (URLs blob GitHub) na doc de observabilidade do projeto
- [ ] Gaps registrados em documentation/reliability debt se não Implemented

## Sign-off

| Campo | Valor |
| --- | --- |
| Serviço | |
| `DD_SERVICE` / `DD_ENV` | |
| Verificado por | |
| Data | YYYY-MM-DD |
| Resultado | Pass / Pass with debt / Fail |

## Documentos relacionados

- [datadog-usage-guide.md](datadog-usage-guide.md)
- [../operational-readiness-checklist.md](../operational-readiness-checklist.md)
