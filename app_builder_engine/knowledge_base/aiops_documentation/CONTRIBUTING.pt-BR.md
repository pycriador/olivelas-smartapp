# Contribuindo

> Language: pt-BR | [English](CONTRIBUTING.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Obrigado por contribuir com o Padrão de Documentação de Engenharia.

Este repositório define um **framework reutilizável de documentação** com **ciclo de vida documental explícito**. Contribuições devem melhorar o padrão em si — não documentar uma aplicação real aqui.

## Princípios para contribuições

- Manter o padrão agnóstico de tecnologia.
- Preferir clareza e reutilização a detalhes específicos de projeto.
- Não incorporar secrets, credenciais ou dados de projetos reais.
- Tratar mudanças de documentação como artefatos de engenharia: revisadas, versionadas e baseadas em evidências.
- Seguir políticas de ciclo de vida, ownership e revisão.
- Entregar **EN e pt-BR** juntos sempre que um documento mudar.

Referências principais:

- [docs/pt-BR/principles.md](docs/pt-BR/principles.md)
- [docs/pt-BR/lifecycle.md](docs/pt-BR/lifecycle.md)
- [docs/pt-BR/standards.md](docs/pt-BR/standards.md)
- [docs/pt-BR/style-guide.md](docs/pt-BR/style-guide.md)
- [docs/pt-BR/language.md](docs/pt-BR/language.md)
- [docs/pt-BR/change-policy.md](docs/pt-BR/change-policy.md)

## Formas de contribuir

| Tipo de contribuição | O que alterar | Notas |
| --- | --- | --- |
| Novo documento do padrão | `docs/en/` **e** `docs/pt-BR/` | Mesmo caminho relativo nas duas árvores |
| Lifecycle / governança | lifecycle, status, ownership, review, change, debt, stale, deprecation, archive, changelog, quality | Manter simples e pouco burocrático |
| Metodologia de arquitetura | architecture-model, boundaries, diagrams, mermaid, drift, debt, review, checklist | Baseada em evidência; sem estilos inventados |
| Metodologia de contratos | contract-model, types, schema/semantics, retry/idempotency/delivery, versioning, lifecycle, breaking-changes, guias por tipo, checklist | Agnóstica de tecnologia; sem protocolos ou sistemas inventados |
| Metodologia de operações e confiabilidade | operations-model, reliability-model, service levels, failure modes, runbooks, incidentes, recovery, readiness, sinais de observabilidade | Agnóstica de tecnologia; sem inventar SLOs, alertas, DR ou comandos |
| Metodologia de segurança | security-model, threat modeling, assets/risks/requirements/controls, exceptions, vulnerabilities, incidentes de segurança, readiness, checklists | Agnóstica de tecnologia; sem inventar certificações, valores secretos ou PoCs de exploit |
| Governança e automação | governance, validation rules/config, quality gates, exceptions, drift/health, automation security, CI, `scripts/docs_lint.py` | Apenas no repositório; sem SaaS/portal/RAG; validador local = CI |
| Metodologia AI-ready | ai-context, ai-ready-model, metadata/identity/types, evidence/claims, relationships/registries, progressive context, regras de navegação/resposta/mudança, gaps/contradições, manifest, checklist | Apenas padrões de documentação; sem RAG, embeddings, vector DB, agents, MCP ou chatbots |
| Mudança de template | `docs/en/templates/` e `docs/pt-BR/templates/` | Manter templates genéricos; preservar frontmatter |
| Novo template | Ambas as árvores + atualizar índices | Incluir convenções de metadata |
| Pack as-is (`loft-infra`, `aiops-apps`, …) | Ambas as árvores + índice do README raiz | Resumo breve por doc; manter o mapa do `README.md` do pack |
| Atualização de estilo / padrões | Ambas as árvores | Declarar impacto breaking vs non-breaking |
| Orientação de IA | `docs/*/ai-context.md`, `ai-documentation.md`, `ai-agent-entry.md` e políticas AI-ready | Regras acionáveis; agentes começam em `AGENTS.md` / `ai-context.md` |
| Checklist | `docs/*/documentation-checklist.md` | Itens verificáveis |
| Exemplos | `examples/<name>/en/` e `pt-BR/` | Apenas projetos fictícios |
| Versionamento | `docs/*/versioning.md` | Alinhar às regras semânticas |

## Criando novos documentos

1. Identifique a categoria.
2. Crie o documento nas **duas** árvores de idioma com o mesmo caminho relativo.
3. Adicione YAML frontmatter (`title`, `status`, `owner`, `updated` no mínimo para docs substantivos).
4. Adicione o link entre línguas.
5. Prefira um template existente quando aplicável.
6. Defina `status: DRAFT` inicialmente.
7. Linke documentos relacionados; evite duplicação desnecessária.
8. Marque unknowns explicitamente.
9. Mantenha tokens de máquina em inglês.
10. Abra um pull request para revisão.

## Git e Pull Requests para documentação

### Commits

- Prefira commits focados.
- Use prefixos convencionais quando útil:

```text
docs:
docs(architecture):
docs(security):
docs(operations):
docs(lifecycle):
docs(contracts):
docs(templates):
docs(ai-ready):
docs(governance):
```

Exemplos:

```text
docs(lifecycle): define transition matrix
docs(contracts): add contract checklist
docs(operations): add operational readiness checklist
docs(templates): add review-record template
docs(ai-ready):
docs(governance): add claim and relationship examples
docs: fix broken links in standards
```

### Pull requests

PRs que alteram documentação devem:

1. Atualizar metadata (`updated`, `status`, `owner` quando relevante).
2. Atualizar referências e índices — incluindo o **Índice de documentos** em [README.pt-BR.md](README.pt-BR.md) / [README.md](README.md), [docs/pt-BR/README.md](docs/pt-BR/README.md) / [docs/en/README.md](docs/en/README.md), e o mapa do `README.md` do pack sempre que adicionar, renomear, mover ou remover categorias ou packs em `docs/`.
3. Atualizar diagramas quando afetados.
4. Atualizar EN e pt-BR ao mudar este padrão.
5. Usar [docs/pt-BR/templates/documentation-pr-checklist.md](docs/pt-BR/templates/documentation-pr-checklist.md).

### A descrição do PR deve incluir

- **Summary** — o que mudou e por quê
- **Impact** — patch / minor / major para o padrão
- **Languages** — EN e pt-BR atualizados (ou `Translation status: pending`)
- **Lifecycle** — impacto em status/metadata
- **Adoption notes** — o que projetos consumidores devem fazer
- **Checklist** — confirmação dos critérios de revisão

### Nomenclatura sugerida de branch

```text
docs/<short-description>
feat/<short-description>
fix/<short-description>
```

## Processo de revisão

Todas as contribuições exigem revisão.

Revisores devem verificar:

- [ ] Propósito e escopo claros
- [ ] Conteúdo agnóstico de tecnologia, salvo exemplo opcional
- [ ] Sem secrets ou dados de projetos reais
- [ ] Links e referências funcionando
- [ ] Terminologia alinhada ao style guide
- [ ] Versões EN e pt-BR existem e estão linkadas
- [ ] Status/metadata seguem [lifecycle.md](docs/pt-BR/lifecycle.md) / [status.md](docs/pt-BR/status.md)
- [ ] Impacto de versionamento declarado
- [ ] Checklist ainda faz sentido após a mudança

Use [docs/pt-BR/templates/review-record.md](docs/pt-BR/templates/review-record.md) quando um registro formal de revisão for útil.

## Alterando templates

Ao alterar um template:

- Atualize os templates EN e pt-BR juntos.
- Preserve nomes de seções compatíveis quando possível.
- Mantenha o YAML frontmatter consistente.
- Documente seções removidas/renomeadas na descrição do PR.
- Atualize exemplos nas duas línguas se dependerem do template.
- Classifique a mudança como patch, minor ou major conforme [docs/pt-BR/versioning.md](docs/pt-BR/versioning.md).

## Validação

Antes do merge, confirme:

1. A estrutura permanece coerente nas duas árvores de idioma.
2. Templates continuam utilizáveis sem premissas específicas de projeto.
3. Políticas de lifecycle permanecem consistentes (sem status conflitantes).
4. Exemplos ainda demonstram a adoção corretamente em EN e pt-BR.
5. A orientação de bump de versão está correta para o tipo de mudança.

## Segurança

Nunca faça commit de senhas, API keys, tokens, chaves privadas, credenciais ou secrets.

Ao documentar conceitos de configuração sensível, registre apenas:

```text
Configuration name
Purpose
Source
Required: yes/no
```

Nunca registre o valor do segredo.

## Dúvidas

Se a orientação estiver pouco clara, abra uma issue propondo esclarecimento ao padrão em vez de inventar uma convenção isolada em um projeto consumidor sem devolvê-la ao padrão.
