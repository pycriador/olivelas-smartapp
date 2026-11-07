# Padrão de Documentação de Engenharia

> Language: pt-BR | [English](README.md)
>
> **Documentation Standard v1.0**
>
> Status: ACCEPTED

Este repositório é um **framework reutilizável de documentação** para projetos de software e infraestrutura. Ele **não** é a documentação de uma aplicação específica.

Ele responde:

> Se eu iniciar um projeto novo amanhã, qual estrutura e quais padrões devo seguir para garantir que sua documentação seja consistente, útil para engenharia e compreensível por agentes de IA?

Também responde perguntas de ciclo de vida, arquitetura, contratos, operações & confiabilidade e metodologia de segurança:

> Como a documentação nasce, é revisada, se torna confiável, é atualizada, substituída e arquivada?
>
> Como documentar arquitetura com progressive disclosure (Context → System → Components → Interfaces → Implementation)?
>
> Como documentar contratos técnicos (API, Event, Message, File e tipos relacionados) como limites verificáveis?
>
> Como documentar operações e confiabilidade (service profiles, SLIs/SLOs, runbooks, incidentes, modos de falha, recovery) na cadeia Architecture → Contracts → Operations → Recovery?
>
> Como documentar segurança (ativos, ameaças, riscos, requisitos, controles, evidências) na cadeia Architecture → Trust Boundaries → Assets → Threats → Controls → Operations → Response?
>
> Como estruturar documentação como **contexto AI-ready** (metadata, claims, relacionamentos, progressive context) na cadeia Question → Scope → Context → Knowledge → Evidence → Constraints → Answer — sem RAG ou produtos de agentes?


## Adotando este padrão (starters opcionais)

Isto é **orientação e exemplos fictícios**, não mandato:

- [docs/pt-BR/adoption-path.md](docs/pt-BR/adoption-path.md) — Day 0 / 30 / 90
- [docs/pt-BR/flat-docs-migration.md](docs/pt-BR/flat-docs-migration.md) — migrar docs flat
- [examples/adoption-scaffold/](examples/adoption-scaffold/) — árvore vazia do Dia 0
- [examples/suggested-document-platform/](examples/suggested-document-platform/) — stack **ilustrativa** de document-intelligence (**NÃO** é o padrão)
- [examples/adopter-ci-starter/](examples/adopter-ci-starter/) — CI opcional

## Idiomas

Este padrão é bilíngue. Todo documento deve existir em inglês e em português brasileiro.

| Idioma | Ponto de entrada |
| --- | --- |
| English (EN) | [docs/en/README.md](docs/en/README.md) |
| Português (pt-BR) | [docs/pt-BR/README.md](docs/pt-BR/README.md) |
| Política de idioma | [docs/pt-BR/language.md](docs/pt-BR/language.md) |

## Índice de documentos

Use esta seção para achar packs e hubs rapidamente. O inventário completo de categorias está em [docs/pt-BR/README.md](docs/pt-BR/README.md) (pt-BR) / [docs/en/README.md](docs/en/README.md) (EN).

**Quando a árvore de docs mudar** (adicionar, renomear, mover ou remover categoria/pack em `docs/`), atualize este índice **e** os READMEs de idioma no mesmo PR. Veja [CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md).

### Packs as-is Olivelas (mais consultados)

Estes packs descrevem a **prática atual de Olivelas na Olivelas**, com evidência em repositórios reais. São separados do framework genérico de documentação.

| Pack | Resumo | Entrada |
| --- | --- | --- |
| **Infra Olivelas (Olivelas)** | Caminho de publicação hoje: GitHub Actions → ECR → `k8s-apps` (Argo CD) → Kong → Route53 (`infra-live`) + secrets Vault | [docs/pt-BR/loft-infra/README.md](docs/pt-BR/loft-infra/README.md) |
| **Olivelas Apps** | Stacks front/back dos apps Olivelas de referência (monorepo, libs, rotas, segurança) e bot Slack AVA | [docs/pt-BR/aiops-apps/README.md](docs/pt-BR/aiops-apps/README.md) |

#### `loft-infra` — documentos

| Documento | Resumo |
| --- | --- |
| [overview.md](docs/pt-BR/loft-infra/overview.md) | Fluxo ponta a ponta e papel de cada repositório |
| [github-actions-deploy.md](docs/pt-BR/loft-infra/github-actions-deploy.md) | Workflows de prod e inputs da action `deploy` |
| [k8s-apps.md](docs/pt-BR/loft-infra/k8s-apps.md) | Layout `cross-prod`, Application Argo CD, values |
| [kong-gateway.md](docs/pt-BR/loft-infra/kong-gateway.md) | Routes/services corp (front) e external (API) |
| [infra-live-route53.md](docs/pt-BR/loft-infra/infra-live-route53.md) | Records Route53 `loft-corp.com.br` (CNAME → Kong) |
| [vault-secrets.md](docs/pt-BR/loft-infra/vault-secrets.md) | Vault KV + `application.vaultSecrets` |
| [dockerfiles.md](docs/pt-BR/loft-infra/dockerfiles.md) | Padrões e exemplos de Dockerfile |
| [checklist-novo-servico.md](docs/pt-BR/loft-infra/checklist-novo-servico.md) | Checklist para publicar um serviço novo |

EN: [docs/en/loft-infra/](docs/en/loft-infra/)

#### `aiops-apps` — documentos

| Documento | Resumo |
| --- | --- |
| [overview.md](docs/pt-BR/aiops-apps/overview.md) | Organização do monorepo e papéis front/back |
| [frontend-stack.md](docs/pt-BR/aiops-apps/frontend-stack.md) | Stack UI, libs e exemplos por app |
| [backend-stack.md](docs/pt-BR/aiops-apps/backend-stack.md) | Stack API / bots, libs e exemplos por app |
| [routes.md](docs/pt-BR/aiops-apps/routes.md) | Rotas comuns (API + front + Slack) |
| [security.md](docs/pt-BR/aiops-apps/security.md) | AuthN/Z, CORS, headers, tokens |
| [ava-prod.md](docs/pt-BR/aiops-apps/ava-prod.md) | AVA — bot Slack (`ava-prod`), sem front web |

EN: [docs/en/aiops-apps/](docs/en/aiops-apps/)

### Hubs da metodologia do padrão

| Hub | Resumo |
| --- | --- |
| [docs/pt-BR/README.md](docs/pt-BR/README.md) | Índice completo da documentação (todas as categorias) |
| [architecture-model.md](docs/pt-BR/architecture-model.md) | Arquitetura com progressive disclosure |
| [contract-model.md](docs/pt-BR/contract-model.md) | Metodologia de contratos técnicos |
| [operations-model.md](docs/pt-BR/operations-model.md) | Metodologia de operações e confiabilidade |
| [security-model.md](docs/pt-BR/security-model.md) | Metodologia de segurança |
| [ai-context.md](docs/pt-BR/ai-context.md) | Entrada primária AI-ready |
| [governance.md](docs/pt-BR/governance.md) | Validação e quality gates no repositório |
| [adoption-path.md](docs/pt-BR/adoption-path.md) | Caminho de adoção Day 0 / 30 / 90 |

## Propósito

Estabelecer e disseminar boas práticas de documentação de engenharia aplicáveis a diferentes tipos de projeto, tecnologias, arquiteturas e ambientes.

## Problema que resolve

A documentação de engenharia frequentemente se torna:

- opcional ou secundária à entrega;
- inconsistente entre times;
- duplicada ou desatualizada;
- excessivamente narrativa e difícil de verificar;
- pouco confiável como contexto para humanos e agentes de IA.

Este padrão trata a documentação como parte do produto de engenharia: versionada, revisada, estruturada e baseada em evidências.

## Para quem é

| Público | Como usa este repositório |
| --- | --- |
| Engenheiros de software | Adotam templates e convenções ao criar ou atualizar docs |
| Platform / SRE / infraestrutura | Documentam sistemas com estrutura agnóstica de tecnologia |
| Arquitetos | Registram arquitetura, contratos e ADRs de forma consistente |
| Engineering managers | Definem critérios mínimos de qualidade documental |
| Agentes de IA | Seguem regras explícitas para gerar e atualizar documentação |

## Como usar este padrão

1. Leia a [política de idioma](docs/pt-BR/language.md) e o [ciclo de vida](docs/pt-BR/lifecycle.md).
2. Copie ou adapte a estrutura de categorias de `docs/pt-BR/` (e `docs/en/` se adotar documentação bilíngue).
3. Comece por `docs/pt-BR/templates/project-overview.md` (ou o equivalente em EN).
4. Preencha arquitetura usando [architecture-model.md](docs/pt-BR/architecture-model.md), depois componentes, contratos ([contract-model.md](docs/pt-BR/contract-model.md)), operações e confiabilidade ([operations-model.md](docs/pt-BR/operations-model.md)), segurança ([security-model.md](docs/pt-BR/security-model.md)) e observabilidade conforme aplicável.
5. Para consumidores de IA, comece por [docs/pt-BR/ai-context.md](docs/pt-BR/ai-context.md) (ou [docs/en/ai-context.md](docs/en/ai-context.md)); aplique metadata AI-ready, claims e relacionamentos ([ai-ready-model.md](docs/pt-BR/ai-ready-model.md)).
6. Registre decisões com o template de ADR.
7. Defina metadata YAML (`status`, `owner`, `updated`) e classificação da informação (`Confirmed` / `Inferred` / `Unknown` / `Proposed`).
8. Valide com [docs/pt-BR/documentation-checklist.md](docs/pt-BR/documentation-checklist.md) antes do merge.

**Não** trate todas as categorias como obrigatórias em todo projeto. Use o que agrega valor; marque o restante como não aplicável ou não documentado.

Uma mudança técnica relevante não está completa enquanto a documentação necessária não estiver atualizada. Veja [docs/pt-BR/change-policy.md](docs/pt-BR/change-policy.md).

## Cursor e sincronização de documentação

Se você usa **Cursor** ou **Claude Code**:

1. **Arquivos de entrada** [AGENTS.md](AGENTS.md) e [CLAUDE.md](CLAUDE.md) — ponteiros curtos para [docs/pt-BR/ai-context.md](docs/pt-BR/ai-context.md). Empacotamento: [docs/pt-BR/ai-agent-entry.md](docs/pt-BR/ai-agent-entry.md).
2. **Rules do projeto** em [`.cursor/rules/`](.cursor/rules/) — guardrails do agente (docs-first, linguagem clara, conhecimento em Markdown, reuso de templates, mapa de áreas, quality checks).
3. **Skills** [`.cursor/skills/document-after-change`](.cursor/skills/document-after-change/SKILL.md) (Claude: [`.claude/skills/document-after-change`](.claude/skills/document-after-change/SKILL.md)) — após mudanças relevantes, manter o **Markdown local** alinhado. Opcional: `grill-me` para estressar um plano.
4. **Pack para copiar** [examples/adopter-agent-starter/](examples/adopter-agent-starter/).

Publicar essa documentação local no **Confluence** é **opcional**. Quando precisar, use o CLI [`docs-sync/`](docs-sync/) (somente ida: checkout GitHub/local → Confluence). Veja [docs-sync/README.md](docs-sync/README.md). Neste repositório, a árvore em português usa `docs-sync/config.pt-BR.yaml` e `make docs-sync-pt-br`.

## Estrutura do repositório

```text
/
├── README.md                 # Entrada em inglês
├── README.pt-BR.md           # Entrada em português
├── AGENTS.md                 # Entrada genérica de agente de código
├── CLAUDE.md                 # Entrada Claude Code
├── CONTRIBUTING.md
├── CONTRIBUTING.pt-BR.md
├── LICENSE
├── Makefile
├── scripts/
│   └── docs_lint.py
├── .cursor/
│   ├── rules/                    # Rules Cursor: guardrails do Documentation Standard
│   └── skills/                   # document-after-change, grill-me
├── .claude/
│   └── skills/                   # Espelho Claude Code das mesmas skills
├── docs-sync/                # Opcional: Markdown local → Confluence
├── .github/
├── docs/
│   ├── README.md             # Seletor de idioma
│   ├── manifest.yaml         # Seletor de idioma dos manifests
│   ├── en/                   # Padrão em inglês + packs as-is
│   │   ├── loft-infra/       # As-is: caminho de publicação (Actions, k8s-apps, Kong, …)
│   │   ├── aiops-apps/       # As-is: stacks front/back Olivelas
│   │   └── …                 # metodologia, templates, categorias
│   └── pt-BR/                # Espelho em português (mesmo layout)
└── examples/
    ├── simple-service/
    │   ├── en/
    │   └── pt-BR/
    ├── fullstack-monolith/
    │   ├── en/
    │   └── pt-BR/
    ├── event-driven-service/
    │   ├── en/
    │   └── pt-BR/
    ├── distributed-system/
    │   ├── en/
    │   └── pt-BR/
    ├── adopter-ci-starter/
    ├── contracts/
    │   ├── api-contract/
    │   ├── event-contract/
    │   ├── message-contract/
    │   └── file-contract/
    ├── operations/
    │   ├── service-profile/
    │   ├── runbook/
    │   ├── incident/
    │   ├── failure-mode/
    │   ├── sli/
    │   ├── slo/
    │   └── recovery-procedure/
    ├── security/
    │   ├── asset/
    │   ├── threat/
    │   ├── risk/
    │   ├── requirement/
    │   ├── control/
    │   ├── vulnerability/
    │   ├── exception/
    │   ├── incident/
    │   ├── security-test/
    │   └── security-review/
    └── ai-ready/
        ├── document-metadata/
        ├── claim/
        ├── relationship/
        ├── component/
        ├── knowledge-gap/
        ├── contradiction/
        ├── ai-task-context/
        ├── documentation-change/
        └── ai-change-record/
```

## Criando documentação

| Passo | Ação | Referência |
| --- | --- | --- |
| 1 | Ler princípios | [docs/pt-BR/principles.md](docs/pt-BR/principles.md) |
| 2 | Seguir padrões de escrita | [docs/pt-BR/standards.md](docs/pt-BR/standards.md), [docs/pt-BR/style-guide.md](docs/pt-BR/style-guide.md) |
| 3 | Seguir política de idioma | [docs/pt-BR/language.md](docs/pt-BR/language.md) |
| 4 | Escolher um template | [docs/pt-BR/templates/](docs/pt-BR/templates/) |
| 5 | Classificar informação | Confirmed / Inferred / Unknown / Proposed |
| 6 | Definir status | DRAFT → REVIEW → ACCEPTED |
| 7 | Linkar evidências | Arquivos, configs, ADRs, contratos |
| 8 | Para consumidores de IA, começar em ai-context | [docs/pt-BR/ai-context.md](docs/pt-BR/ai-context.md) |
| 9 | Rodar o checklist | [docs/pt-BR/documentation-checklist.md](docs/pt-BR/documentation-checklist.md) |

## Validando documentação

Use [docs/pt-BR/documentation-checklist.md](docs/pt-BR/documentation-checklist.md) como gate mínimo de qualidade, e rode o linter do repositório quando aplicável:

```bash
make docs-validate
# equivalente: python3 scripts/docs_lint.py validate
```

Publicação no Confluence é opcional; veja [Cursor e sincronização de documentação](#cursor-e-sincronização-de-documentação) acima.

A validação deve confirmar ao menos:

- objetivo e escopo documentados;
- afirmações verificáveis ou explicitamente marcadas como Unknown / Inferred / Proposed;
- ausência de secrets;
- terminologia e referências consistentes;
- status definido;
- neste repositório: versões EN e pt-BR existem e estão linkadas.

## Evoluindo o padrão

Mudanças seguem [docs/pt-BR/versioning.md](docs/pt-BR/versioning.md) e [CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md).

- Patch: esclarecimentos, typos, melhorias não breaking em templates
- Minor: novos templates opcionais, categorias ou orientações
- Major: mudanças breaking de estrutura ou convenções

Atualize **as duas línguas** no mesmo pull request sempre que possível.

Se alterar a **estrutura de docs** (categoria ou pack novo/renomeado/removido em `docs/`), atualize:

1. Este [Índice de documentos](#índice-de-documentos) (e o par EN em [README.md](README.md))
2. [docs/pt-BR/README.md](docs/pt-BR/README.md) e [docs/en/README.md](docs/en/README.md)
3. O mapa do `README.md` do próprio pack (ex.: `loft-infra/`, `aiops-apps/`)

## Exemplos

Exemplos fictícios (não são projetos reais):

- [examples/simple-service/](examples/simple-service/) — serviço request/response
- [examples/fullstack-monolith/](examples/fullstack-monolith/) — monólito FE+API+DB **ilustrativo** (stack sugerida ≠ padrão do framework)
- [examples/event-driven-service/](examples/event-driven-service/) — serviço event-driven
- [examples/distributed-system/](examples/distributed-system/) — sistema distribuído multi-componente
- [examples/adopter-ci-starter/](examples/adopter-ci-starter/) — starter opcional de CI para adotantes
- [examples/contracts/](examples/contracts/) — contratos técnicos autônomos (API, Event, Message, File)
- [examples/operations/](examples/operations/) — operações e confiabilidade (service profile, runbook, incidente, modo de falha, SLI, SLO, recovery)
- [examples/security/](examples/security/) — metodologia de segurança (asset, threat, risk, requirement, control, vulnerability, exception, incident, security-test, security-review)
- [examples/ai-ready/](examples/ai-ready/) — metodologia AI-ready (metadata, claim, relationship, component, knowledge-gap, contradiction, ai-task-context, documentation-change, ai-change-record)

Guias novos de adoção: [docs/pt-BR/adoption-path.md](docs/pt-BR/adoption-path.md), [docs/pt-BR/flat-docs-migration.md](docs/pt-BR/flat-docs-migration.md), [docs/pt-BR/observability-platform-notes.md](docs/pt-BR/observability-platform-notes.md).

Cada exemplo de projeto está disponível em `en/` e `pt-BR/`. As amostras de contratos, operações, segurança e AI-ready seguem o mesmo layout bilíngue em cada pasta de tipo.

## Contribuindo

Veja [CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md) / [CONTRIBUTING.md](CONTRIBUTING.md). Mudanças de documentação passam por revisão, como código.

## Documentos relacionados

| Documento | Descrição |
| --- | --- |
| [docs/README.md](docs/README.md) | Seletor de idioma |
| [docs/pt-BR/loft-infra/README.md](docs/pt-BR/loft-infra/README.md) | As-is: caminho de publicação Olivelas |
| [docs/pt-BR/aiops-apps/README.md](docs/pt-BR/aiops-apps/README.md) | As-is: stacks de aplicação Olivelas |
| [docs/pt-BR/principles.md](docs/pt-BR/principles.md) | Princípios de documentação |
| [docs/pt-BR/lifecycle.md](docs/pt-BR/lifecycle.md) | Ciclo de vida documental |
| [docs/pt-BR/architecture-model.md](docs/pt-BR/architecture-model.md) | Metodologia de arquitetura |
| [docs/pt-BR/contract-model.md](docs/pt-BR/contract-model.md) | Metodologia de contratos técnicos |
| [docs/pt-BR/operations-model.md](docs/pt-BR/operations-model.md) | Metodologia de operações e confiabilidade |
| [docs/pt-BR/security-model.md](docs/pt-BR/security-model.md) | Metodologia de segurança |
| [docs/pt-BR/ai-context.md](docs/pt-BR/ai-context.md) | Entrada primária de IA (metodologia AI-ready) |
| [docs/pt-BR/ai-ready-model.md](docs/pt-BR/ai-ready-model.md) | Modelo de documentação AI-ready |
| [docs/pt-BR/language.md](docs/pt-BR/language.md) | Política bilíngue |
| [docs/pt-BR/ai-documentation.md](docs/pt-BR/ai-documentation.md) | Regras de escrita de IA por domínio |
| [docs/pt-BR/quality-model.md](docs/pt-BR/quality-model.md) | Dimensões e níveis de qualidade |
| [docs/pt-BR/versioning.md](docs/pt-BR/versioning.md) | Versionamento do padrão |
