# Gestão de Secrets

> Language: pt-BR | [English](../en/secrets-management.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam o handling de **secrets** — credentials, API keys, private keys, tokens, passwords e material similar.

## Regra rígida

**Nunca armazene valores secretos na documentação.** Nem em Markdown, diagramas, exemplos, tickets colados em docs ou screenshots.

Documente no máximo:

- **name** do secret ou configuration key;
- **purpose**;
- **source** (ex.: environment variable, referência de secret manager, *name* do vault path);
- **rotation owner** e cadência se conhecidos;
- se é **required**.

Prefira placeholders como `<API_KEY>` ou `$API_KEY` em exemplos. Veja [standards.md](standards.md).

## O que conta como secret (exemplos)

| Kind | Notes |
| --- | --- |
| Passwords, API keys, tokens | Sempre secrets |
| Private keys, client secrets | Sempre secrets |
| Connection strings com credentials embutidas | Secrets — prefira referências de credential separadas |
| Webhook signing secrets | Secrets |
| Encryption keys / key material | Secrets — veja [key-management.md](key-management.md) |

Public identifiers, flags de config não sensíveis e public keys geralmente não são secrets; classifique com cuidado.

## Inventário sugerido

| Name | Purpose | Source | Required | Rotation | Owner | Certainty |
| --- | --- | --- | --- | --- | --- | --- |
| | | | yes / no | Not Defined se desconhecido | | |

<!-- Never record secret values. -->

## Orientação de lifecycle

| Stage | Document |
| --- | --- |
| **Creation** | Quem pode criar; onde é armazenado (nome do system) |
| **Distribution** | Como runtimes obtêm o secret (padrão de referência) |
| **Use** | Quais components podem lê-lo — [least-privilege.md](least-privilege.md) |
| **Rotation** | Cadência ou triggers event-driven — ou Not Defined |
| **Revocation** | Como compromise é tratado — link [secret-exposure.md](secret-exposure.md) |
| **Retirement** | Quando um name é removido de uso |

## Integração

| Area | Link |
| --- | --- |
| Mecanismos de authn que apresentam secrets | [authentication.md](authentication.md) |
| Response a exposure | [secret-exposure.md](secret-exposure.md) |
| Logging | [secure-logging.md](secure-logging.md) — secrets não devem aparecer em logs |
| Contratos | Referencie auth schemes sem embutir credentials — [contract-model.md](contract-model.md) |
| Config de operations | Nomeie env vars / mounts; nunca valores |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Inventário de *names* de secrets required + regra “never commit secrets” |
| Medium | Sources, owners, notas de rotation |
| Large | Privileged access a secret stores; linkage a run de exposure |

## Anti-Patterns

- Valores de “exemplo” que são reais.
- Commitar conteúdos de `.env` em docs.
- Documentar vault paths que incluem tokens embutidos.
- Assumir que um secret manager existe quando o projeto ainda usa arquivos locais — documente a realidade.

## Documentos relacionados

- [secret-exposure.md](secret-exposure.md)
- [key-management.md](key-management.md)
- [secure-logging.md](secure-logging.md)
- [privileged-access.md](privileged-access.md)
- [security-requirements.md](security-requirements.md)
- [standards.md](standards.md)
