# Segurança em Operações

> Language: pt-BR | [English](../en/operations-security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar **concerns de segurança em operations** — acesso privilegiado em runtime, handling seguro durante incidents e mecanismos de control compartilhados — sem duplicar a metodologia completa de operations.

Operações owns runbooks, deploy, recover e monitoring operacional ([operations-model.md](operations-model.md)). Segurança owns threats, controls e evidence. **Mecanismos compartilhados são documentados uma vez** e linkados de ambos os lados.

## Documente mecanismos compartilhados uma vez

| Mechanism | Document once in… | Link from… |
| --- | --- | --- |
| Health / latency monitors | [monitoring.md](monitoring.md) | [security-monitoring.md](security-monitoring.md) quando também relevantes de segurança |
| Actionable alerts | [alerting.md](alerting.md), [templates/alert.md](templates/alert.md) | [templates/security-alert.md](templates/security-alert.md) quando security-specific |
| Incident lifecycle | [incident-management.md](incident-management.md) | [security-incidents.md](security-incidents.md) para type Segurança/Both |
| Deploy / rollback | [deployment-operations.md](deployment-operations.md), [rollback.md](rollback.md) | Notas de segurança de supply-chain e change |
| Secrets para runtime | [secrets-management.md](secrets-management.md) | Runbooks (só name/purpose/source) |
| Privileged break-glass | [privileged-access.md](privileged-access.md) | Runbooks de ops que o usam |
| Audit logs | [auditability.md](auditability.md), [secure-logging.md](secure-logging.md) | Evidence e investigações |

Não mantenha duas cópias conflitantes do mesmo procedimento.

## Tópicos de Operational Segurança

| Topic | What to capture |
| --- | --- |
| **Privileged operations** | Quem pode executar ops destrutivas ou de high-privilege; approval se houver |
| **Secure runbooks** | Sem secrets nos steps; só placeholders — [runbooks/README.md](runbooks/README.md) |
| **Incident containment** | Como actions de ops sustentam containment de segurança quando type é Segurança/Both |
| **Change risk** | Impacto de segurança de Planned vs Emergency change — [change-management.md](change-management.md) |
| **Access to prod telemetry** | Quem pode ver logs/metrics que podem conter dados sensíveis |
| **Recovery vs integrity** | Paths de restore que poderiam voltar a um estado compromised — note verification |

## Integração com artefatos de operations

| Ops artifact | Segurança overlay |
| --- | --- |
| Service profile | Link security owner / data classes críticas quando relevante |
| Runbook | Safety notes para privilege e handling de secrets |
| Alert | Purpose de segurança e routing quando aplicável |
| Incident record | Type Operational / Segurança / Both |
| PIR / corrective actions | Alimente controls, vulns, exceptions, debt |

## Regras

- Prefira **Not Defined** a processos inventados de break-glass ou SIEM.
- Nunca embuta credentials, private keys ou PII desnecessário em docs de ops ou segurança.
- IA não deve inventar IAM roles, permissions ou paths de cluster — [ai-documentation.md](ai-documentation.md).

## Documentos relacionados

- [operations-model.md](operations-model.md)
- [operational-ownership.md](operational-ownership.md)
- [security-ownership.md](security-ownership.md)
- [security-monitoring.md](security-monitoring.md)
- [security-incidents.md](security-incidents.md)
- [privileged-access.md](privileged-access.md)
- [secrets-management.md](secrets-management.md)
