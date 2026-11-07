# Modelo de confidence

> Language: pt-BR | [English](../en/confidence-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Confidence expressa o quanto um agente ou autor confia em uma **claim ou resumo**. É independente do **status** de ciclo de vida e da **classification** de evidência.

## Níveis

| Confidence | Meaning |
| --- | --- |
| **High** | Múltiplas fontes Authoritative/Verified concordam; evidência é atual e específica |
| **Medium** | Evidência credível com gaps menores, idade ou dependência de fonte única |
| **Low** | Evidência fraca, indireta ou parcialmente conflitante |
| **Unknown** | Confidence não pode ser avaliada |

## O que confidence não é

| Concept | Role |
| --- | --- |
| Lifecycle `status` | Governança do documento (`DRAFT` … `ARCHIVED`) |
| Classification | Relação com evidência (`Confirmed` … `Deprecated`) |
| Authority | Peso do documento-fonte ([authority-levels.md](authority-levels.md)) |
| **Confidence** | Confiança nesta resposta ou claim dada a evidência disponível |

Uma claim pode ser **Confirmed** com confidence **Medium** se a evidência for autoritativa mas envelhecida. Uma claim pode ser **Inferred** com confidence **High** se muitos sinais consistentes concordarem — ainda assim **não** é Confirmed.

## Regras

1. Não use confidence para esconder classificação Unknown.
2. Não mapeie status `ACCEPTED` para High confidence automaticamente.
3. Ações de segurança e operação que exigem evidência Confirmed ainda exigem Confirmed — High confidence Inferred é insuficiente.
4. Quando a confidence for Low ou Unknown, diga isso na resposta ([ai-answering-rules.md](ai-answering-rules.md)).

## Documentos relacionados

- [evidence-model.md](evidence-model.md)
- [claims.md](claims.md)
- [authority-levels.md](authority-levels.md)

