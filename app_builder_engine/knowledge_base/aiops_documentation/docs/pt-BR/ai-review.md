# Revisão com IA

> Language: pt-BR | [English](../en/ai-review.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Como humanos (e assistentes de IA que apoiam a revisão) avaliam documentação produzida por IA.

## Objetivos da revisão

- Precisão contra SoT
- Classificações corretas
- Tratamento seguro de secrets
- Integridade de graph/links
- Status e ownership apropriados
- Sem invenção de escopo

## Checklist de revisão

| Check | Fail if |
| --- | --- |
| Evidence | Confirmed sem citação |
| Classification | Inferred mostrado como fato |
| Status | IA definiu ACCEPTED |
| Secrets | Valores ou dumps sensíveis presentes |
| Drift | Mismatches conhecidos ignorados |
| Links | Referências quebradas ou vagas |
| Completeness | Seções obrigatórias removidas para esconder gaps |
| Language | Machine tokens traduzidos |
| Impact | Docs dependentes não listados |

## Resultados

| Outcome | Action |
| --- | --- |
| Approve | Humano move o status conforme o ciclo de vida |
| Request changes | Retornar a DRAFT com comentários |
| Reject | Não fazer merge; manter notas de debt/gap |
| Escalate | Owners de security/ops/contract |

## Documentos relacionados

- [review-policy.md](review-policy.md)
- [ai-documentation-validation.md](ai-documentation-validation.md)
- [quality-model.md](quality-model.md)

