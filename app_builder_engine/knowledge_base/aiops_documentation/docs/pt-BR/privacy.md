# Privacy

> Language: pt-BR | [English](../en/privacy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam **handling relevante de privacy de dados pessoais ou sensíveis** sem assumir uma lei, regulação ou certificação específica.

Este padrão **não** declara GDPR, LGPD, CCPA ou qualquer outro regime como aplicável. Se o projeto tem obrigações vinculantes de privacy, documente-as a partir de uma fonte interna autoritativa e linke essa fonte — não invente análise legal aqui.

## Propósito

Responder, em termos de engineering:

> Quais dados pessoais ou sensíveis tratamos, para qual purpose, quem pode acessá-los e quais controls relacionados a privacy existem?

## O que documentar

| Topic | Guidance |
| --- | --- |
| **Data categories** | Tipos de dados pessoais/sensíveis — link [security-classification.md](security-classification.md), [security-assets.md](security-assets.md) |
| **Purposes** | Por que o sistema os processa (purpose de produto/engineering, não legal basis a menos que fornecida) |
| **Access** | Quem/o quê pode acessar — [authorization.md](authorization.md), [least-privilege.md](least-privilege.md) |
| **Sharing** | Systems e processors downstream na boundary |
| **Retention / deletion** | [data-retention.md](data-retention.md) — **Not Defined** quando desconhecido |
| **Transparency to users** | Só se o projeto owns notices user-facing — senão Not Applicable |
| **Privacy contacts** | Role/team se definido — senão Not Defined |

## Inventário sugerido

| Data category | Purpose | Access | Sharing | Retention | Controls | Certainty |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## Relação com Segurança e Contratos

| Concern | Link |
| --- | --- |
| Proteção no lifecycle | [data-security.md](data-security.md) |
| Exposure no nível de field em interfaces | [contract-model.md](contract-model.md) |
| Logs e traces | [secure-logging.md](secure-logging.md) |
| Encryption | [encryption.md](encryption.md) |

Privacy e security se sobrepõem mas não são idênticos: um sistema pode encrypt dados e ainda processá-los para purposes inesperados. Documente purpose e proteção.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Liste categorias de dados pessoais (ou “none identified”) + resumo de access |
| Medium | Ponteiros de sharing e retention |
| Large | Inventário de purpose + links de control; tópicos legais explicitamente Not Defined |

## Anti-Patterns

- Colar artigos legais como se fossem requirements do projeto.
- Afirmar certificação ou compliance não estabelecida pelo projeto.
- Embutir dados pessoais reais em exemplos.
- Pipelines de analytics silenciosos que copiam dados pessoais sem aparecer no inventário.

## Documentos relacionados

- [data-security.md](data-security.md)
- [data-retention.md](data-retention.md)
- [security-classification.md](security-classification.md)
- [secure-logging.md](secure-logging.md)
- [security-ownership.md](security-ownership.md)
