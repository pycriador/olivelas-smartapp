# Checklist AI-Ready

> Language: pt-BR | [English](../en/ai-ready-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Checklist mínimo para documentação AI-ready (Documentation Standard v1.0).

## Entrada e navegação

- [ ] [ai-context.md](ai-context.md) existe e é a entrada declarada
- [ ] Regras de navegação conhecidas ([ai-navigation.md](ai-navigation.md))
- [ ] Manifest lista docs-chave ([manifest.yaml](manifest.yaml))
- [ ] Opcional: `AGENTS.md` / `CLAUDE.md` apontam para `ai-context.md` ([ai-agent-entry.md](ai-agent-entry.md))

## Metadados e identidade

- [ ] Docs substantivos têm campos de metadados obrigatórios
- [ ] Ids estáveis seguem [document-identity.md](document-identity.md)
- [ ] Types usam [document-types.md](document-types.md)

## Evidência e claims

- [ ] Claims classificadas (Confirmed/Inferred/Unknown/Proposed/Deprecated)
- [ ] Claims Confirmed citam evidência
- [ ] Inferred nunca tratado como Confirmed
- [ ] Confidence não confundida com status

## Graph e registries

- [ ] Registries de component e service distintos
- [ ] Relacionamentos-chave usam vocabulário controlado
- [ ] Dependências de documentação declaradas para hubs

## Segurança e boundaries

- [ ] Sem secrets em docs ou exemplos
- [ ] Task boundaries compreendidos
- [ ] Drift linkado a docs de stale/architecture/contract/operational/security drift quando relevante

## Validação

- [ ] Sem validações ERROR abertas em docs governados
- [ ] WARNINGs com owner ou rastreados como debt
- [ ] Revisão humana para mudanças materiais ACCEPTED

## Documentos relacionados

- [documentation-checklist.md](documentation-checklist.md)
- [ai-documentation-validation.md](ai-documentation-validation.md)
- [ai-documentation-anti-patterns.md](ai-documentation-anti-patterns.md)

