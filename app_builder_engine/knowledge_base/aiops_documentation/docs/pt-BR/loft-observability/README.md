# Observabilidade Loft — Datadog (as-is)

> Language: pt-BR | [English (EN)](../../en/loft-observability/README.md)
>
> Status: DRAFT
>
> Authority: Verified
>
> Documentation Standard v1.0

Documentação **as-is** do **Datadog** como plataforma de observabilidade na Loft em **EKS** (chart Helm `web-server`, agent no node, instrumentação na aplicação).

Caminho de deploy (Actions, k8s-apps, Kong, Vault): pack irmão [../loft-infra/README.md](../loft-infra/README.md).

Stacks de aplicação (Python/Flask, FastAPI, React): [../aiops-apps/README.md](../aiops-apps/README.md).

Este pack é **convenção org Loft**, não requisito de vendor do [observability-model.md](../observability-model.md) genérico. Ver [observability-platform-notes.md](../observability-platform-notes.md).

## Repositórios de evidência

| Papel | Repositório |
| --- | --- |
| Chart Helm (`web-server`) | [loft-br/k8s-apps](https://github.com/loft-br/k8s-apps) |
| Apps de referência (AIOps) | [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge), [loft-br/aiops-deep-insight](https://github.com/loft-br/aiops-deep-insight), [loft-br/qualidade-loft](https://github.com/loft-br/qualidade-loft), [loft-br/aiops-loft-carteira](https://github.com/loft-br/aiops-loft-carteira) |
| IaC Datadog (times, monitors) | [loft-br/infra-live](https://github.com/loft-br/infra-live) (`live/datadog/`) |
| Action de deploy (tag da imagem → `DD_VERSION`) | [loft-br/actions](https://github.com/loft-br/actions) |

## Documentos neste pack

| Documento | Conteúdo |
| --- | --- |
| [overview.md](overview.md) | Papel da plataforma, agent no EKS, chart vs app |
| [documentation-prerequisites.md](documentation-prerequisites.md) | **Logs no Datadog** como gate documental Loft |
| [k8s-datadog-enablement.md](k8s-datadog-enablement.md) | Bloco `datadog` no `values.yaml`, injeção de env, tolerations |
| [application-instrumentation.md](application-instrumentation.md) | Receitas Kotlin, TypeScript/Node, Python |
| [structured-logging.md](structured-logging.md) | Logs JSON, correlação trace↔log, retenção, sem secrets/PII |
| [datadog-usage-guide.md](datadog-usage-guide.md) | Guia do operador: APM, Logs, dashboards, monitors |
| [verification-checklist.md](verification-checklist.md) | Verificação pós-deploy |

## Escopo

- Serviços na **EKS** Loft com chart **`web-server`** do `k8s-apps`.
- **Logs** são o sinal mínimo de observabilidade para readiness documental operacional Loft.
- Não substitui runbooks de squad nem onboarding org-wide do Datadog (`[pending: URL oficial do runbook de onboarding Datadog]`).

## Gaps as-is conhecidos (apps AIOps de referência)

| Gap | Evidência |
| --- | --- |
| Chart habilita env Datadog em **production** por padrão mesmo sem bloco `datadog:` explícito | [`_helpers.tpl` do web-server](https://github.com/loft-br/k8s-apps/blob/main/helm-charts/web-server/templates/_helpers.tpl) (`web-server.datadogEnabled`) |
| Values de referência omitem bloco `datadog:` | [values.yaml aiops-dataforge-api](https://github.com/loft-br/k8s-apps/blob/main/clusters/cross-prod/deployments/aiops-dataforge/aiops-dataforge-api/values.yaml) |
| APM na app (ex.: `ddtrace-run`) não observado no entrypoint DataForge | [backend/entrypoint.sh](https://github.com/loft-br/aiops-dataforge/blob/main/backend/entrypoint.sh) usa `gunicorn` sem `ddtrace-run` |
| Dashboards/monitors baseline por serviço | `[pending: padrão de dashboard Datadog por squad]` |

Documente gaps com honestidade; não marque **Implemented** sem evidência.
