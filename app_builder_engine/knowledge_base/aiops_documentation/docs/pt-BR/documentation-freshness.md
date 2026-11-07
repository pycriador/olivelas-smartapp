# Frescor da documentação

> Language: pt-BR | [English](../en/documentation-freshness.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Frescor descreve se a documentação ainda reflete o sistema **atual** dentro de uma janela de revisão aceitável.

Idade é um **sinal**, não prova de staleness ([stale-documentation.md](stale-documentation.md)).

## Sinais

| Signal | Interpretation |
| --- | --- |
| Old `updated` / `review_date` | Maior risco; verificar claims críticas |
| Recent edit on wrong sections | Ainda pode estar stale |
| Evidence `collected_on` far in past | Re-verificar claims Confirmed |
| Code changed with no doc PR | Risco de freshness / possível drift |
| Incident: “docs were wrong” | Staleness Confirmed |

## Estados de freshness (descritivos)

| State | Meaning |
| --- | --- |
| **Fresh** | Revisado contra evidência dentro da janela de política |
| **Aging** | Aproximando-se da revisão; sem contradição conhecida |
| **Stale-suspect** | Sinais presentes; ainda não comprovado como errado |
| **Stale** | Mismatch comprovado → tratar via drift/debt/lifecycle |

**Não** adicione tokens de ciclo de vida como `STALE`. Use `REVIEW`, debt, deprecação ou arquivo.

## Regras da IA

- Prefira documentos com evidência verificada mais nova quando houver conflitos.
- Não afirme Fresh sem checar SoT.
- Cite datas `updated` / de evidência quando a confidence depender delas.

## Documentos relacionados

- [stale-documentation.md](stale-documentation.md)
- [review-policy.md](review-policy.md)
- [documentation-drift.md](documentation-drift.md)

