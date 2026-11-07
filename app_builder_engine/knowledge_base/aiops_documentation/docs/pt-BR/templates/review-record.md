# Registro de Revisão de Documentação

> Language: pt-BR | [English (EN)](../../en/templates/review-record.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Template para registrar uma revisão de documentação (por mudança ou periódica).

Copie para o projeto adotante (por exemplo `docs/reviews/YYYY-MM-DD-<doc-slug>.md`) ou anexe a tabela preenchida a um PR.

## Registro de revisão

| Campo | Valor |
| --- | --- |
| Documento | path/or/title |
| Status do documento antes | DRAFT / REVIEW / ACCEPTED / DEPRECATED / ARCHIVED |
| Status do documento depois | DRAFT / REVIEW / ACCEPTED / DEPRECATED / ARCHIVED |
| Tipo de revisão | Change-driven / Periodic / Security / Operational / Other |
| Gatilho | O que motivou a revisão |
| Data da revisão | YYYY-MM-DD |
| Revisores | teams/roles/people |
| Owner | team/squad/role |
| Resultado | Pass / Pass with follow-ups / Fail |
| Resumo | resultado breve |
| Follow-ups | ações ou `None` |
| Debt IDs | ex. DOC-014 ou `None` |
| Evidência verificada | code, config, contract, ADR, runtime, etc. |

## Checklist (opcional)

- [ ] Claims precisas ou classificadas (Confirmed / Inferred / Unknown / Proposed)
- [ ] Sem secrets ou dados sensíveis desnecessários
- [ ] Metadata atual (`status`, `owner`, `updated`, …)
- [ ] Links e diagramas consistentes
- [ ] Marcadores de substituição/depreciação presentes se aplicável
- [ ] Par bilíngue alinhado se a política de idioma se aplicar

## Notas

<!-- Notas em texto livre. Mantenha factual. -->

## Documentos relacionados

- [../review-policy.md](../review-policy.md)
- [../lifecycle.md](../lifecycle.md)
- [../documentation-debt.md](../documentation-debt.md)
- [documentation-pr-checklist.md](documentation-pr-checklist.md)
