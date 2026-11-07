# Impacto de mudança

> Language: pt-BR | [English](../en/change-impact.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Como raciocinar sobre qual documentação (e artefatos relacionados) deve ser revisada quando algo muda.

## Passos da análise de impacto

1. Identifique o artefato alterado (código, schema, config, ADR, runbook).
2. Localize nós do graph que `describes`, `includes`, `exposes`, `operates` ou `secures` ele.
3. Siga arestas `depends_on` de documentação ([documentation-dependencies.md](documentation-dependencies.md)).
4. Liste contratos, consumers e docs de ops/segurança no blast radius.
5. Classifique cada ação de doc: update / review / mark Unknown / open debt / no-op.
6. Registre evidência para claims comportamentais após a mudança.

## Matriz de impacto (exemplos)

| Change | Likely docs to review |
| --- | --- |
| New HTTP field | Contract, schema, consumer notes, examples |
| New deployable | Arquitetura, component/service registries, ops ownership |
| Alert threshold | Alerting doc, runbook, SLO/error budget if linked |
| Authn mechanism | Segurança architecture, identity, contract security, runbooks |
| ADR acceptance | Arquitetura constraints, related overviews |

## Regras da IA

- A IA deve listar docs impactados antes de edições grandes ([ai-change-rules.md](ai-change-rules.md)).
- A IA não deve afirmar “no impact” quando for Unknown — diga impact Unknown.
- Prefira linguagem Potential Breaking Change / Unknown Impact para contratos ([breaking-changes.md](breaking-changes.md)).

## Documentos relacionados

- [documentation-dependencies.md](documentation-dependencies.md)
- [change-policy.md](change-policy.md)
- [documentation-graph.md](documentation-graph.md)

