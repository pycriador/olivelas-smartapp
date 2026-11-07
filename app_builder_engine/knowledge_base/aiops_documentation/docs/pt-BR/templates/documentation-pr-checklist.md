# Checklist de PR de Documentação

> Language: pt-BR | [English](../../en/templates/documentation-pr-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Copie para a descrição de um pull request ou use como checklist de revisão quando a documentação mudar (sozinha ou com código).

Nem todo item se aplica a todo PR. Marque N/A explicitamente.

## Escopo

- [ ] Docs relevantes atualizados para esta mudança ([change-policy.md](../change-policy.md))
- [ ] Documentos canônicos editados (sem duplicatas conflitantes)
- [ ] Índice do README raiz + READMEs de idioma atualizados quando a estrutura/packs de docs mudar (ou N/A)
- [ ] Diagramas atualizados ou rotulados Proposed quando não forem estado atual
- [ ] ADRs adicionados/atualizados quando uma decisão material foi tomada

## Ciclo de vida e metadados

- [ ] `status` é um de `DRAFT` | `REVIEW` | `ACCEPTED` | `DEPRECATED` | `ARCHIVED`
- [ ] Sem status inventados (`FINAL`, `DONE`, `UPDATED` como token, etc.)
- [ ] Docs `ACCEPTED` com edições relevantes passaram por `REVIEW` quando exigido
- [ ] Frontmatter YAML presente para docs substantivos (`title`, `status`, `owner`, `updated`)
- [ ] `updated` definido para hoje (`YYYY-MM-DD`) quando o conteúdo mudou
- [ ] Owner definido ou ainda correto ([ownership.md](../ownership.md))
- [ ] Docs deprecated incluem Replaced by, Deprecated on, Reason

## Qualidade

- [ ] Sem fatos inventados; unknowns marcados Unknown / Inferred / Proposed conforme necessário
- [ ] Sem segredos, credenciais ou valores secretos
- [ ] Links e identificadores resolvem
- [ ] Terminologia consistente com docs relacionados
- [ ] Impactos de segurança / ops / contrato cobertos quando aplicável

## Bilíngue (quando [language.md](../language.md) se aplica)

- [ ] Caminhos EN e pt-BR atualizados juntos quando possível
- [ ] Link entre línguas presente no topo de cada documento
- [ ] Tokens de máquina permanecem em inglês (Status, Classification, IDs)
- [ ] Tradução atrasada marcada `Translation status: pending` se necessário

## Revisão

- [ ] Tipo de revisão apropriado concluído (Technical / Operational / Mandatory para segurança)
- [ ] Review record criado quando material ([review-record.md](review-record.md))
- [ ] Dívida de documentação aberta para follow-ups adiados ([documentation-debt.md](../documentation-debt.md))

## Sign-off

| Campo | Valor |
| --- | --- |
| Author | |
| Reviewers | |
| Date | YYYY-MM-DD |
| Result | Pass / Pass with follow-ups / Fail |
| Debt IDs | |

## Documentos relacionados

- [../change-policy.md](../change-policy.md)
- [../review-policy.md](../review-policy.md)
- [../lifecycle.md](../lifecycle.md)
- [../documentation-checklist.md](../documentation-checklist.md)
