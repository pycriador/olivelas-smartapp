# Pré-requisitos documentais — logs no Datadog (Loft)

> Language: pt-BR | [English (EN)](../../en/loft-observability/documentation-prerequisites.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Informational

Gate **Loft-specific** para **readiness de documentação operacional**. **Não** altera o [observability-model.md](../observability-model.md) vendor-agnostic nem [observability-platform-notes.md](../observability-platform-notes.md).

## Quando se aplica

| Contexto | Regra |
| --- | --- |
| Serviço na **EKS Loft** com chart `web-server` | Aplica |
| Biblioteca, CLI ou workload fora de Kubernetes | Documente observabilidade com honestidade; Datadog pode ser N/A com evidência |
| Adoção só do framework (sem infra Loft) | Use apenas o template genérico |

## Pré-requisito: logging

Antes de considerar a documentação operacional **completa** para um serviço Loft em produção:

1. Preencha [templates/observability.md](../templates/observability.md) (ou equivalente em `operations/observability.md`).
2. Defina **Logging → Status** como:
   - **`Implemented`** — logs estruturados ingeridos no Datadog; evidência linkada (nome do serviço, env, query ou caminho de screenshot).
   - **`Partial`** — logs chegam ao Datadog mas há gaps (correlação, formato, ruído de health); gaps listados.
   - **Not Applicable** — só com justificativa escrita (ex.: job batch sem logs de runtime).
3. **Não** deixe Logging como **`Not Documented`** ou omitido quando o serviço está em produção na EKS.

Se a org espera Datadog e o serviço **ainda não** ingere logs:

- Registre **[documentation debt](../documentation-debt.md)** ou `knowledge-gaps.md` do projeto com owner, prioridade e data alvo.
- Não marque service profile ou checklist de readiness operacional como totalmente aprovado.

## O que é obrigatório vs o que pode ficar para depois

| Sinal | Gate documental Loft | Notas |
| --- | --- | --- |
| **Logs** (estruturados, Datadog) | **Obrigatório** para readiness | Mínimo para triagem de incidente |
| **Traces / APM** | Recomendado; pode ser `Partial` + debt | Ver [application-instrumentation.md](application-instrumentation.md) |
| **Métricas / dashboards** | Recomendado; pode ser `Partial` + debt | Não invente URLs de dashboard |
| **Monitors / alertas** | Recomendado antes de alta criticidade | Linke runbook ou debt |

## Evidência a anexar na doc do projeto

| Campo | Exemplo |
| --- | --- |
| Nome do serviço Datadog | Igual a `DD_SERVICE` / `application.name` |
| Environment | `production`, `homologation`, `development` (`DD_ENV`) |
| Query de logs | `service:my-api env:production` |
| Correlação trace | Confirmar aba Logs no span APM |
| Classe de retenção | De `datadog.ttl` quando definido — [k8s-datadog-enablement.md](k8s-datadog-enablement.md) |

Use links blob GitHub para evidência de código/config — [publishing-surfaces.md](../publishing-surfaces.md).

## Checklist do autor da doc

- [ ] Status de Logging explícito (`Implemented` / `Partial` / N/A), não omitido
- [ ] Serviço + env Datadog documentados ou Unknown com debt
- [ ] Sem secrets ou PII em linhas de log de exemplo
- [ ] Cross-link para este pack na doc de observabilidade do projeto
- [ ] Espelhos EN/pt-BR atualizados se o projeto for bilíngue

## Documentos relacionados

- [verification-checklist.md](verification-checklist.md)
- [structured-logging.md](structured-logging.md)
- [../operational-readiness-checklist.md](../operational-readiness-checklist.md)
- [../templates/observability.md](../templates/observability.md)
