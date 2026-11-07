# Segurança de Dependências

> Language: pt-BR | [English](../en/dependency-security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar a **postura de segurança de dependências** sobre as quais o sistema constrói ou às quais chama — libraries, services, images, plugins e similares.

Companheiro de [dependency-reliability.md](dependency-reliability.md) (failure/impact) e [operational-dependencies.md](operational-dependencies.md) (tipos de dependency). Não invente tools de SBOM ou SLAs de CVE que o projeto não use.

## O que documentar

Para dependências materiais com relevância de segurança:

| Campo | Significado |
| --- | --- |
| **Dependency** | Nome estável; link arquitetura / contract |
| **Kind** | Library / service / image / plugin / other |
| **Trust posture** | Por que confiamos nela (vendor, internal, signed, Unknown) |
| **Data / privilege shared** | Quais dados sensíveis ou permissions ela recebe |
| **Known vulnerability process** | Como findings são triaged — [vulnerability-management.md](vulnerability-management.md) |
| **Update / patch stance** | Como updates são aplicados, ou **Not Defined** |
| **Owner** | Quem acompanha segurança desta dependency |
| **Classification** | Confirmed / Inferred / Unknown / Proposed |

## Forma sugerida de inventário

| Dependency | Kind | Trust posture | Data / privilege | Vuln process | Update stance | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

Marque fields Unknown explicitamente. Pule ruído transitivo trivial a menos que seja material.

## Relação com Reliability e Supply Chain

| Concern | Document in |
| --- | --- |
| Dependency falha / times out | [dependency-reliability.md](dependency-reliability.md) |
| Dependency é malicious, tampered ou fracamente attested | [supply-chain-security.md](supply-chain-security.md) |
| Fraqueza conhecida em um component | [vulnerability-management.md](vulnerability-management.md) |
| Coupling de arquitetura | [component-relationships.md](component-relationships.md), dependency maps |

## Regras

- Prefira links a lockfiles, image digests ou sistemas de inventário por **referência** — não cole credentials secretas de registry.
- Não declare automaticamente “no vulnerable dependencies” sem evidência.
- Dependências Critical com privilege amplo e sem owner são candidatas a [security debt](security-debt.md).

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Deps de identity / data-store / payment-like destacadas |
| Medium | Inventário para runtime deps que processam dados sensíveis ou detêm privilege |
| Large | Inventário mais amplo + stance de update/vuln + links de supply-chain |

## Documentos relacionados

- [supply-chain-security.md](supply-chain-security.md)
- [dependency-reliability.md](dependency-reliability.md)
- [security-architecture.md](security-architecture.md)
- [vulnerability-management.md](vulnerability-management.md)
- [security-risk-model.md](security-risk-model.md)
