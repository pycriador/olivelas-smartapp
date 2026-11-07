# Encryption

> Language: pt-BR | [English](../en/encryption.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam proteções de **encryption** de forma agnóstica de tecnologia.

Foque em *o que é protegido*, *em qual estado* e *de onde vêm as keys* (por referência). Não cole key material, partes privadas de certificates ou passphrases. Detalhes de algoritmo são opcionais e só quando Confirmed.

## Estados de proteção

| State | Meaning | Document |
| --- | --- | --- |
| **In transit** | Dados em movimento entre parties | Channels, trust boundaries, se encryption é obrigatória |
| **At rest** | Dados em stores duráveis | Quais stores encrypt, quem gerencia keys |
| **Application-level** | Encryption enforced pela aplicação além dos defaults da plataforma | Quais fields/payloads; quem pode decrypt |

Defaults da plataforma podem satisfazer requirements de transit/rest; diga isso quando Confirmed. Marque **Unknown** quando não verificado. Marque **Not Applicable** quando um estado não se aplicar.

## Registro sugerido

| Campo | Significado |
| --- | --- |
| **Data / channel** | O que é protegido |
| **State** | Transit / rest / application-level |
| **Mechanism summary** | Conceitual (ex.: “TLS on external edge”) — evite claims de cipher não verificados |
| **Key reference** | Link [key-management.md](key-management.md) por *name/purpose* da key |
| **Who can decrypt** | Identities / roles |
| **Certainty** | Confirmed / Inferred / Unknown / Not Applicable |

## Inventário sugerido

| Data / channel | Transit | Rest | Application-level | Key reference | Certainty |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Integração

| Area | Link |
| --- | --- |
| Trust boundary crossings | [trust-boundaries.md](trust-boundaries.md) |
| Data lifecycle | [data-security.md](data-security.md) |
| Key custody | [key-management.md](key-management.md) |
| Contratos | Note se o payload é encrypted no application level vs só no transport |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Transit para edges Exposed; rest para o store primário (ou Unknown) |
| Medium | Inventário para dados Confidential/Restricted |
| Large | Field encryption application-level e autoridade de decrypt |

## Anti-Patterns

- Afirmar “tudo é encrypted” sem listar stores/channels.
- Publicar private keys ou JWTs de exemplo que contenham secrets.
- Especificar algoritmos de páginas de marketing sem evidência Confirmed.
- Tratar encryption como substituto de authorization.

## Documentos relacionados

- [key-management.md](key-management.md)
- [data-security.md](data-security.md)
- [secrets-management.md](secrets-management.md)
- [security-controls.md](security-controls.md)
- [trust-boundaries.md](trust-boundaries.md)
