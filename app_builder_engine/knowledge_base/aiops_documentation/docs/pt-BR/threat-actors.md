# Threat Actors

> Language: pt-BR | [English](../en/threat-actors.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção descrevem **quem ou o quê pode agir contra assets**.

As categorias de actor abaixo são **exemplos**, não um roster obrigatório. Documente apenas actors plausíveis para o [security-scope.md](security-scope.md) do projeto. Prefira categorias grosseiras a adversários nomeados especulativos.

## Propósito

Responder:

> Quais capacidades e motivações devemos assumir ao modelar threats?

Actors informam [threat-modeling.md](threat-modeling.md) e [security-risk-model.md](security-risk-model.md). Não são acusações sobre pessoas reais.

## Categorias de exemplo (não exaustivas)

| Category | Example intent / capability | Typical relevance |
| --- | --- | --- |
| **Anonymous external** | Probing não autenticado de surfaces expostas | Edges públicos |
| **Authenticated user (malicious or compromised)** | Abuse de credentials ou sessions legítimas | Sistemas multi-tenant / user-facing |
| **Insider (privileged)** | Misuse de acesso elevado | Planos de admin, data stores |
| **Insider (non-privileged)** | Misuse de acesso interno limitado | Ferramentas internas |
| **Service / automation identity** | Workload ou pipeline identity comprometida | Service-to-service, CI/CD |
| **Dependency / supplier path** | Abuse via trust de terceiro ou library | Supply chain, integrações SaaS |
| **Physical / local access** | Acesso a devices ou media | Só quando in scope |

Adicione, renomeie ou remova categorias para combinar com o projeto. Marque **Not Applicable** quando uma categoria for irrelevante.

## Registro sugerido de actor

| Campo | Significado |
| --- | --- |
| **Category** | Label estável usado em registros de threat |
| **Assumptions** | Acesso, conhecimento e constraints assumidos |
| **No escopo?** | yes / no / Shared |
| **Notes** | Links a surfaces ou trust zones |
| **Certainty** | Confirmed need / Inferred / Unknown / Proposed |

## Inventário sugerido

| Category | Assumptions | No escopo? | Related surfaces | Certainty |
| --- | --- | --- | --- | --- |
| | | | | |

## Orientação

- Amarre actors a [attack-surface.md](attack-surface.md) e [trust-boundaries.md](trust-boundaries.md).
- Não inflacione capability (ex.: nation-state) sem razão grounded em scope e criticality.
- Usuários benignos comprometidos e usuários maliciosos podem compartilhar uma categoria se os controls forem os mesmos; separe quando as mitigations diferirem.
- Documente automation identities explicitamente quando puderem mudar produção ou ler dados Confidential.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | External vs authenticated vs privileged (se privileged existir) |
| Medium | Inclua service identities e caminhos de dependência Critical |
| Large | Inventário com assumptions e flags de scope |

## Documentos relacionados

- [threat-modeling.md](threat-modeling.md)
- [attack-surface.md](attack-surface.md)
- [security-scope.md](security-scope.md)
- [privileged-access.md](privileged-access.md)
- [security-model.md](security-model.md)
