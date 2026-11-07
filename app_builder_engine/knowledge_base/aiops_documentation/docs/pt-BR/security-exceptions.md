# Exceptions de Segurança

> Language: pt-BR | [English](../en/security-exceptions.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar **desvios com prazo ou explícitos** de um security requirement ou control.

Uma exception não é “esquecemos.” É uma decisão registrada: *conhecemos a lacuna, por que existe, quem owns, o que compensa e quando termina ou é re-reviewed.*

## Campos obrigatórios

Toda security exception deve registrar:

| Campo | Significado |
| --- | --- |
| **Requirement** | Qual security requirement ou control não é plenamente atendido (ID + link) |
| **Reason** | Por que a exception é necessária |
| **Risk** | Qual residual risk permanece (linke [security-risk-model.md](security-risk-model.md) quando útil) |
| **Compensating control** | O que reduz risk enquanto a exception está ativa — ou **None** / **Not Defined** |
| **Owner** | Team/role accountable pela exception e seu closure |
| **Approval** | Quem aprovou (role/person/process) — ou **Not Defined** se nenhum processo de approval existir |
| **Expiration** | Data de fim ou de review — obrigatório para exceptions temporárias |

Use [templates/security-exception.md](templates/security-exception.md).

## Lifecycle

```text
Request → Assess risk → Approve / Reject → Active → Review → Extend / Close
```

| Stage | Meaning |
| --- | --- |
| **Request** | Exception proposta com requirement e reason |
| **Assess** | Risk e compensating controls avaliados |
| **Approve / Reject** | Decisão explícita |
| **Active** | Exception em vigor; monitoring pode se aplicar |
| **Review** | Antes da expiration ou em mudança material |
| **Extend** | Nova expiration + re-approval conforme o projeto exigir |
| **Close** | Requirement atendido, risk aceito permanentemente (debt), ou scope removido |

“Exceptions” permanentes sem review são geralmente [security debt](security-debt.md) ou accepted risk — rotule-as com honestidade.

## Vocabulário de status (exemplo)

| Status | Significado |
| --- | --- |
| `Requested` | Submetida |
| `Approved` | Ativa com approval |
| `Rejected` | Não concedida |
| `Expired` | Além da expiration; deve re-aprovar ou fechar |
| `Closed` | Não mais aplicável |
| `Superseded` | Substituída por outra exception ou control |

## Regras

- Nunca use uma exception para esconder postura de segurança unknown — marque **Unknown** em vez disso.
- Compensating controls devem ser reais e documentados; não os invente para “passar” readiness.
- Expiration sem follow-up do owner vira [security drift](security-drift.md) / debt.
- Não invente waivers regulatórios ou exceptions de certificação que o projeto não tem.

## Relação com outros artefatos

| Related | How |
| --- | --- |
| Vulnerability | Pode dirigir uma exception temporária enquanto remedia — [vulnerability-management.md](vulnerability-management.md) |
| Segurança debt | Lacuna aceita de longa duração |
| Segurança readiness | Conditionally ready pode exigir exceptions rastreadas — [security-readiness.md](security-readiness.md) |
| Operações | Emergency change pode criar security exceptions temporárias — [change-management.md](change-management.md) |

## Documentos relacionados

- [security-requirements.md](security-requirements.md)
- [security-controls.md](security-controls.md)
- [security-risk-model.md](security-risk-model.md)
- [security-ownership.md](security-ownership.md)
- [security-debt.md](security-debt.md)
- [standards.md](standards.md)
