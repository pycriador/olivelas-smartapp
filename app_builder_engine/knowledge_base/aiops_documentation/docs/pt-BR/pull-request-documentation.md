---
title: "Checagens de Documentação em Pull Request"
status: "ACCEPTED"
owner: "documentation-standard"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-08-07"
version: "1.0"
standard: "Documentation Standard v1.0"
---

# Checagens de Documentação em Pull Request

> Language: pt-BR | [English (EN)](../en/pull-request-documentation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Quando um PR deve atualizar documentação — complementa [change-policy.md](change-policy.md).

| Mudança | Documentação esperada |
| --- | --- |
| Mudança de arquitetura | Docs de arquitetura / ADRs |
| Mudança de API / contrato | Docs de contrato |
| Mudança operacional | Ops / runbooks / alerts |
| Mudança de segurança | Docs de segurança |
| Mudança de comportamento para integradores | Contratos relevantes + overview |
| Mudança de validação/governança | Docs de governança + revisão de config |

## Checklist de PR (humano)

Não duplique checagens automatizadas de CI. Humanos confirmam:

- [ ] Impacto na documentação avaliado
- [ ] Documentação relevante atualizada
- [ ] Manifest atualizado ao listar novos docs autoritativos
- [ ] Relationships atualizados quando a estrutura mudou
- [ ] Evidência atualizada para claims Confirmed
- [ ] Impacto de segurança avaliado
- [ ] Impacto operacional avaliado

GitHub: [../../.github/pull_request_template.md](../../.github/pull_request_template.md)
