# Gestão de Incidentes

> Language: pt-BR | [English](../en/incident-management.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar o ciclo de vida do incidente da detecção ao aprendizado.

Projetos podem usar processo leve ou formal. Documente o que você realmente faz. Se não houver processo de incidente, declare **Not Defined** em vez de copiar um framework grande.

## Ciclo de vida

```text
Detection → Triage → Response → Mitigation → Resolution → Communication → Post-Incident Review
```

| Stage | Meaning |
| --- | --- |
| **Detection** | Algo está errado (alert, health, user report, synthetic) |
| **Triage** | Severity, escopo, owner, se é um incidente |
| **Response** | Mobilizar pessoas; iniciar timeline; seguir runbooks |
| **Mitigation** | Reduzir impacto no usuário (degrade, failover, feature off, scale) |
| **Resolution** | Problema subjacente corrigido ou workaround estável aceito |
| **Communication** | Status para stakeholders conforme o projeto define |
| **Post-Incident Review** | Aprendizado blameless — [post-incident-review.md](post-incident-review.md) |

Estágios podem se sobrepor (mitigar antes do diagnóstico completo). Registre fatos na [timeline do incidente](incident-timeline.md).

## Roles durante um incidente

Alinhe com [operational-ownership.md](operational-ownership.md):

| Role | Duty (typical) |
| --- | --- |
| Incident lead / commander | Coordena; decide o foco |
| Technical responders | Diagnosticam e corrigem |
| Communicator | Updates externos/internos quando usado |
| Escalation | Desbloqueia ou traz especialistas |

Times pequenos podem combinar roles — diga isso.

## Severity

Classifique com o modelo do projeto — exemplo SEV-1..4 em [incident-severity.md](incident-severity.md). Severity dirige urgência e comunicação, não culpa.

## Inputs e outputs

| Input | Output |
| --- | --- |
| Alerts, health, user reports | Severity, canal, responders |
| Runbooks, arquitetura, contratos | Ações de mitigation / resolution |
| Fatos da timeline | PIR, RCA, corrective actions |

## Integração

| Artifact | Use |
| --- | --- |
| [alerting.md](alerting.md) | Caminho de Detection |
| [runbooks/README.md](runbooks/README.md) | Ações de Response |
| [degradation.md](degradation.md) | Modos intencionais de mitigation |
| [failure-modes.md](failure-modes.md) | Modes conhecidos |
| [root-cause-analysis.md](root-cause-analysis.md) | Após estabilização |
| [corrective-actions.md](corrective-actions.md) | Melhorias |

## Anti-padrões

- Pular mitigation para perseguir root cause enquanto usuários sofrem.
- Sem timeline até dias depois (memória não é registro).
- Review que atribui culpa pessoal ([post-incident-review.md](post-incident-review.md)).

## Documentos relacionados

- [incident-severity.md](incident-severity.md)
- [incident-timeline.md](incident-timeline.md)
- [post-incident-review.md](post-incident-review.md)
- [operations-model.md](operations-model.md)
