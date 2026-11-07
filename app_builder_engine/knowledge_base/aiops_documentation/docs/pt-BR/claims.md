# Claims

> Language: pt-BR | [English](../en/claims.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Uma **claim** é uma afirmação atômica sobre o sistema que pode ser classificada, evidenciada e contestada.

## Anatomia de uma claim

| Element | Meaning |
| --- | --- |
| **Statement** | Asserção única e testável |
| **Classification** | Confirmed / Inferred / Proposed / Unknown / Deprecated |
| **Evidence** | Referência(s) que sustentam a afirmação |
| **Confidence** | High / Medium / Low / Unknown ([confidence-model.md](confidence-model.md)) |
| **Scope** | Ambiente, versão, janela de tempo quando relevante |
| **Owner** | Quem pode confirmar ou refutar |

## Claims boas vs ruins

| Prefer | Avoid |
| --- | --- |
| `checkout-api` exposes `POST /payments` (Confirmed, OpenAPI path) | “The API works fine” |
| Retry limit is 3 (Confirmed, config key) | “We usually retry” |
| Failover strategy: Unknown | Invented multi-region story |
| Event sourcing is Proposed | Presenting roadmap as current |

## Ciclo de vida da claim

```text
Asserted → Evidenced → Classified → Reviewed → (Deprecated | Superseded | Retained)
```

Mudanças materiais de claim em docs `ACCEPTED` seguem [change-policy.md](change-policy.md) e podem mover o documento para `REVIEW`.

## Claims contraditórias

Quando duas claims conflitam, siga [contradiction-model.md](contradiction-model.md). Não descarte um lado silenciosamente.

## Obrigações da IA

- Extraia claims em vez de parafrasear páginas inteiras em prosa sem fundação.
- Recuse subir classificação sem nova evidência.
- Superficialize claims Unknown em vez de preencher gaps.

## Documentos relacionados

- [evidence-model.md](evidence-model.md)
- [evidence-references.md](evidence-references.md)
- [confidence-model.md](confidence-model.md)
- [contradiction-model.md](contradiction-model.md)

