# Segurança de Supply Chain

> Language: pt-BR | [English](../en/supply-chain-security.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar a **integrity e trust de como software e artifacts são obtidos, construídos e entregues**.

Supply-chain security é mais amplo que “rodar npm audit.” Cobre sources, integrity de build, distribution e automation privilegiada. Permaneça agnóstico de tecnologia. Não invente attestations, esquemas de signing ou programas de compliance que o projeto não use.

## Escopo (conceitual)

| Area | Question |
| --- | --- |
| **Sources** | De onde vêm código e packages? Quem pode publicar? |
| **Build** | Como artifacts são produzidos? Quem/o quê pode alterar o build? |
| **Artifacts** | Como images/binaries/packages são identificados e protegidos? |
| **Distribution** | Como artifacts chegam aos environments de runtime? |
| **Automation privilege** | O que CI/CD e bots podem fazer? — [privileged-access.md](privileged-access.md) |
| **Dependencies** | Como components de terceiros entram na chain — [dependency-security.md](dependency-security.md) |

Fora do escopo deste doc: inventar certificações regulatórias de supply-chain.

## O que documentar

| Campo | Significado |
| --- | --- |
| **Pipeline / path** | Path nomeado de build ou delivery (sem secret tokens) |
| **Trust controls** | Reviews, approvals, isolation, signing — conforme evidenciado |
| **Integrity mechanism** | Checksums, signatures, provenance — ou **Not Defined** |
| **Privileged identities** | Roles/systems que podem release (por nome, não keys) |
| **Exposure** | Quem pode injetar ou alterar artifacts |
| **Owner** | Quem mantém controls de supply-chain |
| **Evidence** | Links — [security-evidence.md](security-evidence.md) |
| **Classification** | Confirmed / Inferred / Unknown / Proposed |

## Relação com outros docs

| Topic | Link |
| --- | --- |
| Trust boundaries em CI/CD vs runtime | [trust-boundaries.md](trust-boundaries.md), [security-architecture.md](security-architecture.md) |
| Secrets em pipelines | [secrets-management.md](secrets-management.md), [secret-exposure.md](secret-exposure.md) |
| Change e deploy | [change-management.md](change-management.md), [deployment-operations.md](deployment-operations.md) |
| Vulns de dependency | [dependency-security.md](dependency-security.md), [vulnerability-management.md](vulnerability-management.md) |

Documente mecanismos compartilhados uma vez sob [operations-security.md](operations-security.md) quando o mesmo control servir ops e segurança.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Quem pode merge/release; onde secrets de deploy vivem (por referência) |
| Medium | Notas de trust de build/release; stance de intake de dependency |
| Large | Stance explícita de integrity/provenance; inventário de automation privilegiada |

## Anti-Patterns

- Afirmar “signed and attested” sem evidência.
- Documentar passwords de registry ou deploy keys em Markdown.
- Tratar cada package transitivo como case study completo de supply-chain.

## Documentos relacionados

- [dependency-security.md](dependency-security.md)
- [secure-development.md](secure-development.md)
- [privileged-access.md](privileged-access.md)
- [security-controls.md](security-controls.md)
- [attack-surface.md](attack-surface.md)
