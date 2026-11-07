# Modelo de evidência

> Language: pt-BR | [English](../en/evidence-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Como claims são classificadas pela força da evidência. Alinha-se à Information Classification em [standards.md](standards.md) e a estende com **Deprecated** para claims que um dia foram tratadas como atuais, mas não se sustentam mais.

## Classificações

| Classification | Meaning | AI treatment |
| --- | --- | --- |
| **Confirmed** | Verificado contra uma fonte autoritativa | Pode afirmar como fato atual; cite evidência |
| **Inferred** | Deduzido de evidência, não declarado explicitamente | Afirme como inferência; **nunca** trate como Confirmed |
| **Proposed** | Sugestão ou estado futuro / desejado | Nunca apresente como comportamento atual |
| **Unknown** | Não identificado; evidência ausente | Não invente; liste como gap |
| **Deprecated** | Claim previamente documentada mas retirada ou supersedida | Não use como SoT atual; aponte a substituição |

Mapeamento de tokens para ferramentas externas que usam enums em maiúsculas:

| External token | This standard |
| --- | --- |
| `CONFIRMED` | Confirmed |
| `INFERRED` | Inferred |
| `UNKNOWN` | Unknown |
| `PROPOSED` | Proposed |
| `DEPRECATED` | Deprecated |

## Regras rígidas

1. **Nunca trate Inferred como Confirmed.**
2. Conteúdo novo incerto padrão para **Unknown**, não Confirmed.
3. Nunca apresente **Proposed** como estado atual.
4. Prefira **Confirmed** para claims operacionais e de segurança antes do documento `ACCEPTED`.
5. Claims **Deprecated** permanecem no histórico com ponteiros; não delete silenciosamente sem orientação de [history-model.md](history-model.md).
6. Classification ≠ lifecycle status ≠ confidence ([confidence-model.md](confidence-model.md)).

## Formas inline

```markdown
- Retry limit is 3. <!-- Classification: Confirmed -->
- Ordering appears FIFO per partition. <!-- Classification: Inferred -->
- Multi-region failover: Unknown.
- Move to event sourcing. <!-- Classification: Proposed -->
- Legacy sync webhook path. <!-- Classification: Deprecated -->
```

No nível de seção:

```markdown
## Failure Handling

Classification: Inferred
```

## Relação com evidência de Segurança / Ops

Práticas de evidência de domínio permanecem válidas:

- [security-evidence.md](security-evidence.md)
- Tags de timeline de incidente em [incident-timeline.md](incident-timeline.md)

## Documentos relacionados

- [claims.md](claims.md)
- [evidence-references.md](evidence-references.md)
- [ai-answering-rules.md](ai-answering-rules.md)
- [standards.md](standards.md)

