# Classificação de Segurança

> Language: pt-BR | [English](../en/security-classification.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção rotulam **informação e assets por sensibilidade** para que regras de handling sejam consistentes.

Classification é um **modelo escolhido pelo projeto**. Os labels abaixo são um **exemplo** comum, não uma taxonomia obrigatória. Se o projeto já usa outro modelo (por exemplo menos tiers, labels de domínio ou um esquema company-wide), documente **esse** modelo e mapeie exemplos só quando for útil.

Não invente categorias regulatórias ou certificações. Prefira **Not Defined** quando o projeto não tiver escolhido um esquema.

## Modelo de exemplo (opcional)

| Label | Meaning (example) | Typical handling implications (example) |
| --- | --- | --- |
| **Public** | Destinado a disclosure sem restrição | Pode aparecer em docs públicos e marketing |
| **Internal** | Para pessoas dentro da organização sob acesso normal | Default para a maioria dos docs operacionais; não para colar em público |
| **Confidential** | Audiência limitada; disclosure não autorizado causa harm material | Need-to-know; acesso e logging mais estritos |
| **Restricted** | Maior sensibilidade dentro do modelo do projeto | Acesso mais restrito, controls mais fortes, retention cuidadosa |

Projetos podem renomear, mesclar ou dividir tiers. Declare a lista autoritativa uma vez e reutilize-a em docs de assets e dados.

## O que classificar

| Subject | Guidance |
| --- | --- |
| Data at rest / in use | Uso primário de classification — veja [data-security.md](data-security.md) |
| Interfaces e payloads | Linke fields/classes a contratos — veja [contract-model.md](contract-model.md) |
| A própria documentação | Evite colocar conteúdo Restricted em docs de leitura ampla |
| Logs e traces | Derive da data class — veja [secure-logging.md](secure-logging.md) |
| Secrets e keys | Trate como pelo menos Confidential/Restricted por default; nunca armazene valores |

## Formulário sugerido de registro

| Asset / data set | Classification | Owner | Handling summary | Retention | Certainty |
| --- | --- | --- | --- | --- | --- |
| | | | | Not Defined se desconhecido | Confirmed / Inferred / Unknown |

## Relação com outros conceitos

| Concept | Relationship |
| --- | --- |
| Asset catalog | Classification é um campo em assets — [security-assets.md](security-assets.md) |
| Trust boundaries | Sensibilidade maior frequentemente implica controls de crossing mais fortes — [trust-boundaries.md](trust-boundaries.md) |
| Requirements | Classification dirige requirements de confidentiality/privacy — [security-requirements.md](security-requirements.md) |
| Certainty labels | Confirmed/Inferred/Unknown/Proposed tratam *qualidade da evidência*, não sensibilidade dos dados — [standards.md](standards.md) |

Não confunda **information classification** (sensibilidade) com **statement certainty** (Confirmed/Inferred/…).

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Nomeie o modelo (ou “Not Defined”) e classifique os dados mais sensíveis que o sistema toca |
| Medium | Inventário de data classes com owners |
| Large | Labels consistentes across assets, contracts, logs e docs de retention |

## Anti-Patterns

- Usar quatro tiers de exemplo sem definir o que significam para *este* projeto.
- Marcar tudo Restricted para evitar pensar.
- Colocar valores secretos ou PII bruto em docs “porque o doc é Confidential.”
- Afirmar uma categoria legal sem fonte autoritativa.

## Documentos relacionados

- [security-model.md](security-model.md)
- [security-assets.md](security-assets.md)
- [data-security.md](data-security.md)
- [privacy.md](privacy.md)
- [data-retention.md](data-retention.md)
- [secure-logging.md](secure-logging.md)
- [standards.md](standards.md)
