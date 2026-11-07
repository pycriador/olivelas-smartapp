# Auditabilidade

> Language: pt-BR | [English](../en/auditability.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam a capacidade de **reconstruir quem fez o quê, a qual asset e quando** — para ações relevantes de segurança.

Auditability é uma área de requirement ([security-requirements.md](security-requirements.md)) sustentada por controls e [secure-logging.md](secure-logging.md). Não é o mesmo que debug logging verboso.

## Propósito

Responder:

> Quais ações devem ser atribuíveis, qual evidence é produzida, quem pode acessá-la e por quanto tempo é mantida?

## Events tipicamente auditáveis (exemplos)

| Event class | Why it matters |
| --- | --- |
| Authentication success/failure (material) | Account abuse, sinais de credential stuffing |
| Authorization denials em actions Critical | Probing e misconfiguration |
| Privileged access e elevation | Detection de misuse — [privileged-access.md](privileged-access.md) |
| Mudanças em security controls ou policies | Integrity do control plane |
| Acesso a dados Restricted | Investigações de confidentiality |
| Operações de admin de secret/key | Custody — só names em docs |
| Deployments que mudam produção | Link [deployment-operations.md](deployment-operations.md), [change-management.md](change-management.md) |

Selecione events que importam para o projeto. Marque os demais Not Applicable.

## Registro sugerido

| Campo | Significado |
| --- | --- |
| **Event** | Action a registrar |
| **Logged?** | yes / no / Unknown |
| **Where** | Nome do system/store |
| **Attribution fields** | Actor id, action, target, time — sem secrets/PII além do necessário |
| **Integrity notes** | Append-only / admin controlado — ou Not Defined |
| **Retention** | Ou Not Defined |
| **Access** | Quem pode ler audit data |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Inventário sugerido

| Event | Logged? | Where | Attribution | Retention | Access | Certainty |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## Qualidade da evidence

| Quality concern | Guidance |
| --- | --- |
| Completeness | Lacunas são Unknown, não silenciosas |
| Integrity | Note se administrators podem alterar history sem rastreio |
| Confidentiality of audit stores | Audit logs frequentemente tornam-se Confidential |
| Correlation | Prefira ids estáveis a dados pessoais |

Nunca armazene valores secretos em exemplos de documentação de audit.

## Integração

| Area | Link |
| --- | --- |
| Constraints de secure logging | [secure-logging.md](secure-logging.md) |
| Evidence de incident | [incident-timeline.md](incident-timeline.md), [incident-management.md](incident-management.md) |
| Contratos | Outcomes de error e auth que peers observam vs audit events internos |
| Observability de operations | [observability-model.md](observability-model.md) — metrics ≠ audit trail |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Actions privilegiadas e auth-critical: logged ou explicitamente Unknown |
| Medium | Inventário com retention e access |
| Large | Notas de integrity, mudanças no control-plane, acesso a dados Restricted |

## Anti-Patterns

- Afirmar “full audit trail” sem lista de events.
- Debug logs usados como único mecanismo de audit sem attribution fields.
- Audit stores writable pelos mesmos roles amplos que deveriam monitorar, sem documentar.
- Inventar requirements de compliance audit.

## Documentos relacionados

- [secure-logging.md](secure-logging.md)
- [security-requirements.md](security-requirements.md)
- [privileged-access.md](privileged-access.md)
- [security-controls.md](security-controls.md)
- [incident-management.md](incident-management.md)
