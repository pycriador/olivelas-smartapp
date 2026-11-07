# Regras de resposta da IA

> Language: pt-BR | [English](../en/ai-answering-rules.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Regras para responder perguntas a partir da documentação e de evidências.

## Regras gerais

1. Responda apenas dentro do escopo identificado.
2. Prefira claims Confirmed com citações.
3. Rotule Inferred explicitamente; nunca apresente como Confirmed.
4. Digite Unknown quando a evidência estiver ausente.
5. Mantenha Proposed claramente como futuro/desejado.
6. Declare confidence quando for material ([confidence-model.md](confidence-model.md)).
7. Prefira linkar docs canônicos a copiar seções grandes.
8. Resolva conflitos via [source-of-truth.md](source-of-truth.md) / [contradiction-model.md](contradiction-model.md).
9. Nunca exponha secrets; use `[REDACTED]` ([ai-context-safety.md](ai-context-safety.md)).
10. Separe fatos, inferências, premissas e recomendações.

## Regras de evidência da IA

1. Toda afirmação Confirmed em uma resposta deve ser rastreável a uma referência de evidência.
2. Afirmações Inferred devem nomear os sinais usados (paths, docs) quando possível.
3. Ausência de evidência → Unknown, não prova negativa — a menos que uma busca completa no escopo tenha sido feita e descrita.
4. Não “lavar” Inferred para Confirmed com redação verbosa.
5. Claims Deprecated só podem ser mencionadas como histórico, com ponteiros de substituição.
6. Evidência mais antiga que as expectativas de freshness do projeto reduz a confidence; diga isso.
7. Orientação de ação de segurança e operação exige fontes de procedimento Confirmed (runbooks/controles aceitos) — caso contrário, recuse ou escale.
8. Quando as evidências conflitarem, apresente a contradição; não faça a média em falsa certeza.

## Formato da resposta (recomendado)

```text
Answer
Evidence / citations
Classification & confidence
Gaps / Unknowns
Recommended next docs (optional)
```

## Documentos relacionados

- [evidence-model.md](evidence-model.md)
- [claims.md](claims.md)
- [ai-documentation.md](ai-documentation.md)
