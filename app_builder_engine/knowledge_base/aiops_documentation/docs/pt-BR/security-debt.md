# Dívida de Segurança

> Language: pt-BR | [English](../en/security-debt.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como distinguir e registrar **security debt** versus outros tipos de dívida.

## Tipos de dívida (mantenha-os distintos)

| Kind | Meaning | Typical example |
| --- | --- | --- |
| **Technical debt** | Qualidade de implementação / atalhos em código ou config | Testes ausentes, módulo frágil |
| **Arquitetura debt** | Custo estrutural/de decisão — [architecture-debt.md](architecture-debt.md) | Acoplamento via DB compartilhado writable |
| **Contract debt** | Regras de interface ausentes/erradas — [contract-debt.md](contract-debt.md) | Authz não documentada em uma API |
| **Documentation debt** | Docs ausentes/errados/stale — [documentation-debt.md](documentation-debt.md) | Sem write-up de threat model |
| **Reliability debt** | Risk de operabilidade/reliability — [reliability-debt.md](reliability-debt.md) | Sem alert no critical path |
| **Segurança debt** | **Segurança risk** aceito ou não notado em assets, controls, identity, data ou detection/response | Service account over-privileged; exception sem tracking; sem path de secret rotation |

Frequentemente coexistem. Registre cada um no tipo certo para que a remediação mirar o artefato certo.

## Quando algo é security debt

Trate como security debt quando a issue for principalmente sobre:

- controls ausentes ou fracos para threats materiais;
- over-privilege ou expectativas quebradas de least-privilege;
- lacunas de handling de secrets/dados;
- security exceptions sem tracking ou expiradas;
- vulnerabilities conhecidas sem remediation/acceptance;
- lacunas de security monitoring/response para risks materiais;
- lacunas de trust de supply-chain ou dependency que são security-primary.

Não rotule todo bug ou unit test ausente como security debt. Não rotule lacunas puras de availability como security debt quando confidentiality/integrity/auth não forem afetados — isso pode ser reliability debt.

## Como registrar

| Campo | Significado |
| --- | --- |
| **ID** | Id estável (ex.: `SECDEBT-014`) |
| **Description** | Qual lacuna de segurança existe |
| **Impact** | Asset, threat, blast radius, residual risk se conhecido |
| **Owner** | Team/role accountable |
| **Priority** | `High` / `Medium` / `Low` |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

Opcional: vulnerability, exception, threat, control, incident, IDs de architecture/contract debt linkados.

## Orientação de priority

| Priority | Guidance |
| --- | --- |
| **High** | Exposure material ou caminho de privilege abuse; security incidents repetidos; asset crítico desprotegido |
| **Medium** | Lacuna significativa de control/detection; workarounds ou compensating controls parciais existem |
| **Low** | Preferência de hardening; blast radius baixo |

`Accepted Risk` exige acknowledgment explícito do owner — não neglect. Acceptance temporária deve preferir uma [security exception](security-exceptions.md) rastreada com expiration quando um requirement ainda for formalmente devido.

## Documentos relacionados

- [security-drift.md](security-drift.md)
- [security-exceptions.md](security-exceptions.md)
- [vulnerability-management.md](vulnerability-management.md)
- [security-risk-model.md](security-risk-model.md)
- [security-readiness.md](security-readiness.md)
- [reliability-debt.md](reliability-debt.md)
