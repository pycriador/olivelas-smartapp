# Requirements de Segurança

> Language: pt-BR | [English](../en/security-requirements.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção declaram **obrigações de segurança** que o sistema ou processo deve atender.

Requirements descrevem *o que deve ser verdade*. Controls descrevem *como* — veja [security-controls.md](security-controls.md). Mantenha requirements agnósticos de tecnologia a menos que um mecanismo específico seja uma constraint aceita do projeto (documente como tal).

Não invente requirements regulatórios ou de certificação. Prefira **Not Applicable** ou **Not Defined** quando nenhum existir.

## Propósito

Rastrear de risks e assets a expectativas enforceáveis:

```text
Assets / Threats / Risks → Requirements → Controls → Evidence
```

## Áreas de requirement (não exaustivas)

| Area | Question | Related docs |
| --- | --- | --- |
| **Authentication** | Como a identity é estabelecida em cada entry material? | [authentication.md](authentication.md), [identity.md](identity.md) |
| **Authorization** | O que cada identity pode fazer? | [authorization.md](authorization.md), [least-privilege.md](least-privilege.md) |
| **Confidentiality** | Quem pode ler ou obter dados sensíveis? | [data-security.md](data-security.md), [encryption.md](encryption.md) |
| **Integrity** | Como a modificação não autorizada é prevenida ou detectada? | [security-controls.md](security-controls.md), [auditability.md](auditability.md) |
| **Availability** | Quais obrigações de availability relevantes de segurança existem? | [service-levels.md](service-levels.md), [criticality.md](criticality.md) |
| **Privacy** | Quais expectativas de privacy se aplicam (sem assumir legislação)? | [privacy.md](privacy.md) |
| **Auditability** | Quais ações relevantes de segurança devem ser atribuíveis? | [auditability.md](auditability.md), [secure-logging.md](secure-logging.md) |
| **Secrets** | Como credentials e keys devem ser tratados? | [secrets-management.md](secrets-management.md) |
| **Privileged access** | Como a elevation é governada? | [privileged-access.md](privileged-access.md) |

Projetos podem adicionar áreas (ex.: non-repudiation, secure deletion) quando forem obrigações reais.

## Registro sugerido de requirement

| Campo | Significado |
| --- | --- |
| **ID** | Id curto e estável |
| **Statement** | Obrigação testável (“must / must not”) |
| **Area** | Authn, authz, … |
| **Rationale** | Link a asset, threat ou risk |
| **Applies to** | Components, interfaces, environments |
| **Controls** | Controls que implementam (links) |
| **Evidence** | Como o fulfillment é mostrado |
| **Status** | required / deferred / Not Applicable / Not Defined |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Inventário sugerido

| ID | Statement | Area | Applies to | Controls | Evidence | Status | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

## Links de contrato e arquitetura

- Authn/authz no nível de interface e campos sensíveis pertencem a ou linkam de [contracts](contract-model.md).
- A colocação estrutural das obrigações deve alinhar-se a [architecture-model.md](architecture-model.md) e [trust-boundaries.md](trust-boundaries.md).
- Detection operacional de falha de requirement linka a [monitoring.md](monitoring.md) e [alerting.md](alerting.md).

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Authn/authz + secrets + confidentiality de dados para o caminho principal |
| Medium | Inventário cobrindo privilege, audit e interfaces Critical |
| Large | Rastreabilidade de risks → requirements → controls → evidence |

## Anti-Patterns

- Requirements que só nomeiam um produto (“must use Vendor X”) sem statement de obrigação.
- Slogans não verificáveis (“be secure”).
- Copiar IDs de control de frameworks externos como se fossem requirements do projeto sem adoção.
- Misturar requirement e detalhe de implementação até que nenhum fique claro.

## Documentos relacionados

- [security-model.md](security-model.md)
- [security-controls.md](security-controls.md)
- [security-risk-model.md](security-risk-model.md)
- [identity.md](identity.md)
- [data-security.md](data-security.md)
