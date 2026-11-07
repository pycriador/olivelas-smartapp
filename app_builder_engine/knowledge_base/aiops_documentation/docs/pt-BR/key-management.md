# Key Management

> Language: pt-BR | [English](../en/key-management.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Orientação conceitual para documentar **custódia e lifecycle de cryptographic keys**.

## Regra rígida

**Nunca armazene keys reais, key material, passphrases ou certificates privados na documentação.** Refira apenas por key name, purpose ou referência do manager.

## Propósito

Responder:

> Quais keys existem (por nome), o que protegem, quem pode usá-las ou administrá-las, e como são rotacionadas ou aposentadas?

## Lifecycle conceitual

```text
Generation → Storage → Distribution → Use → Rotation → Revocation → Retirement
```

| Stage | Document |
| --- | --- |
| **Generation** | Quem/o quê pode criar keys; environment |
| **Storage** | Key store nomeado ou serviço de plataforma — não o material |
| **Distribution** | Como runtimes obtêm permissão de use |
| **Use** | Propósitos encrypt/decrypt/sign/verify; least privilege |
| **Rotation** | Cadência ou event triggers — ou **Not Defined** |
| **Revocation** | Processo de compromise — link [secret-exposure.md](secret-exposure.md) quando aplicável |
| **Retirement** | Quando um key name é decommissioned |

## Inventário sugerido

| Key name / id | Purpose | Protects | Store (name) | Users | Admins | Rotation | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | Not Defined se desconhecido | |

## Relação com secrets

Muitas keys são secrets. Use [secrets-management.md](secrets-management.md) para handling genérico de credentials; use este documento quando purpose criptográfico e autoridade de decrypt importarem. Public keys podem ser documentadas mais abertamente quando forem intencionalmente públicas.

## Integração

| Area | Link |
| --- | --- |
| Uso de encryption | [encryption.md](encryption.md) |
| Admin privilegiado de keys | [privileged-access.md](privileged-access.md) |
| Authn que depende de keys | [authentication.md](authentication.md) |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Nomeie keys que protegem dados Confidential + quem administra |
| Medium | Notas de lifecycle e status de rotation |
| Large | Separe app keys vs platform keys; caminho de compromise |

## Anti-Patterns

- Colar PEM private keys “para o time.”
- Documentar key ceremony fictícia que não aconteceu.
- Admin compartilhado para todas as keys sem owner.
- Afirmar propriedades de HSM/KMS que são Unknown.

## Documentos relacionados

- [encryption.md](encryption.md)
- [secrets-management.md](secrets-management.md)
- [secret-exposure.md](secret-exposure.md)
- [privileged-access.md](privileged-access.md)
- [security-controls.md](security-controls.md)
