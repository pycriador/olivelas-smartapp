# AIOps Documentation Standard

> Language: EN | [Português (pt-BR)](README.pt-BR.md)
>
> **Documentation Standard v1.0**
>
> Status: ACCEPTED

This repository is a **reusable documentation framework** for software and infrastructure projects. It is **not** the documentation of a specific application.

It answers:

> If I start a new project tomorrow, which structure and standards should I follow so that documentation is consistent, useful for engineering, and reliable for AI agents?

It also answers lifecycle, architecture, contracts, operations & reliability, and security methodology questions:

> How is documentation created, reviewed, trusted, updated, replaced, and archived?
>
> How should architecture be documented with progressive disclosure (Context → System → Components → Interfaces → Implementation)?
>
> How should technical contracts (API, Event, Message, File, and related types) be documented as verifiable boundaries?
>
> How should operations and reliability be documented (service profiles, SLIs/SLOs, runbooks, incidents, failure modes, recovery) along the chain Architecture → Contracts → Operations → Recovery?
>
> How should security be documented (assets, threats, risks, requirements, controls, evidence) along the chain Architecture → Trust Boundaries → Assets → Threats → Controls → Operations → Response?
>
> How should documentation be structured as **AI-ready context** (metadata, claims, relationships, progressive context) along Question → Scope → Context → Knowledge → Evidence → Constraints → Answer — without RAG or agent products?
>
> How should documentation be **governed and validated** in-repo (ownership, quality gates, lint, exceptions, health reports) without an external documentation platform?


## Adopting this standard (optional starters)

These are **guidance and fictional examples**, not mandates:

- [docs/en/adoption-path.md](docs/en/adoption-path.md) — Day 0 / 30 / 90
- [docs/en/flat-docs-migration.md](docs/en/flat-docs-migration.md) — migrate flat docs
- [examples/adoption-scaffold/](examples/adoption-scaffold/) — empty Day 0 tree
- [examples/suggested-document-platform/](examples/suggested-document-platform/) — **illustrative** document-intelligence stack (**NOT** the standard)
- [examples/adopter-ci-starter/](examples/adopter-ci-starter/) — optional CI

## Languages

This standard is bilingual. Every document must exist in English and Brazilian Portuguese.

| Language | Entry point |
| --- | --- |
| English (EN) | [docs/en/README.md](docs/en/README.md) |
| Português (pt-BR) | [docs/pt-BR/README.md](docs/pt-BR/README.md) |
| Language policy | [docs/en/language.md](docs/en/language.md) |

## Document index

Use this section to find packs and hubs quickly. The full category inventory is in [docs/en/README.md](docs/en/README.md) (EN) / [docs/pt-BR/README.md](docs/pt-BR/README.md) (pt-BR).

**When the docs tree changes** (add, rename, move, or remove a category/pack under `docs/`), update this index **and** the language READMEs in the same PR. See [CONTRIBUTING.md](CONTRIBUTING.md).

### As-is Loft packs (most consulted)

These packs describe **current Loft AIOps practice**, grounded in real repositories. They are separate from the generic documentation framework.

| Pack | Summary | Entry |
| --- | --- | --- |
| **Loft infra (AIOps)** | Publish path today: GitHub Actions → ECR → `k8s-apps` (Argo CD) → Kong → Route53 (`infra-live`) + Vault secrets | [docs/en/loft-infra/README.md](docs/en/loft-infra/README.md) |
| **AIOps Apps** | Frontend/backend stacks of reference AIOps apps (monorepo layout, libs, routes, security) plus AVA Slack bot | [docs/en/aiops-apps/README.md](docs/en/aiops-apps/README.md) |

#### `loft-infra` — documents

| Document | Summary |
| --- | --- |
| [overview.md](docs/en/loft-infra/overview.md) | End-to-end publish flow and role of each repo |
| [github-actions-deploy.md](docs/en/loft-infra/github-actions-deploy.md) | Prod workflows and `deploy` action inputs |
| [k8s-apps.md](docs/en/loft-infra/k8s-apps.md) | `cross-prod` layout, Argo CD Application, values |
| [kong-gateway.md](docs/en/loft-infra/kong-gateway.md) | Corp front and external API routes/services |
| [infra-live-route53.md](docs/en/loft-infra/infra-live-route53.md) | Route53 `loft-corp.com.br` records (CNAME → Kong) |
| [vault-secrets.md](docs/en/loft-infra/vault-secrets.md) | Vault KV + `application.vaultSecrets` |
| [dockerfiles.md](docs/en/loft-infra/dockerfiles.md) | Dockerfile patterns and examples |
| [checklist-novo-servico.md](docs/en/loft-infra/checklist-novo-servico.md) | New-service publish checklist |

pt-BR: [docs/pt-BR/loft-infra/](docs/pt-BR/loft-infra/)

#### `aiops-apps` — documents

| Document | Summary |
| --- | --- |
| [overview.md](docs/en/aiops-apps/overview.md) | Monorepo organization and front/back roles |
| [frontend-stack.md](docs/en/aiops-apps/frontend-stack.md) | UI stacks, libs, and per-app examples |
| [backend-stack.md](docs/en/aiops-apps/backend-stack.md) | API / bot stacks, libs, and per-app examples |
| [routes.md](docs/en/aiops-apps/routes.md) | Common API, front, and Slack routes |
| [security.md](docs/en/aiops-apps/security.md) | AuthN/Z, CORS, headers, tokens |
| [ava-prod.md](docs/en/aiops-apps/ava-prod.md) | AVA — Slack bot (`ava-prod`), no web front |

pt-BR: [docs/pt-BR/aiops-apps/](docs/pt-BR/aiops-apps/)

### Standard methodology hubs

| Hub | Summary |
| --- | --- |
| [docs/en/README.md](docs/en/README.md) | Full documentation index (all categories) |
| [architecture-model.md](docs/en/architecture-model.md) | Architecture with progressive disclosure |
| [contract-model.md](docs/en/contract-model.md) | Technical contracts methodology |
| [operations-model.md](docs/en/operations-model.md) | Operations & reliability methodology |
| [security-model.md](docs/en/security-model.md) | Security methodology |
| [ai-context.md](docs/en/ai-context.md) | Primary AI-ready entry |
| [governance.md](docs/en/governance.md) | In-repo validation and quality gates |
| [adoption-path.md](docs/en/adoption-path.md) | Day 0 / 30 / 90 adoption path |

## Purpose

Establish and disseminate good practices for engineering documentation that can be applied across different project types, technologies, architectures, and environments.

## Problem It Solves

Engineering documentation often becomes:

- optional or secondary to delivery;
- inconsistent across teams;
- duplicated or outdated;
- narrative-heavy and hard to verify;
- unreliable as context for humans and AI agents.

This standard treats documentation as part of the engineering product: versioned, reviewed, structured, and evidence-based.

## Who It Is For

| Audience | How they use this repository |
| --- | --- |
| Software engineers | Adopt templates and conventions when creating or updating project docs |
| Platform / SRE / infrastructure engineers | Document systems with technology-agnostic structure |
| Architects | Capture architecture, contracts, and ADRs consistently |
| Engineering managers | Define minimum quality criteria for documentation |
| AI agents | Follow explicit rules for generating and updating documentation |

## How to Use This Standard

1. Read the [language policy](docs/en/language.md) and [lifecycle](docs/en/lifecycle.md).
2. Copy or adapt the category structure from `docs/en/` (and `docs/pt-BR/` if adopting bilingual docs).
3. Start with `docs/en/templates/project-overview.md` (or the pt-BR equivalent).
4. Fill architecture using [architecture-model.md](docs/en/architecture-model.md), then components, contracts ([contract-model.md](docs/en/contract-model.md)), operations & reliability ([operations-model.md](docs/en/operations-model.md)), security ([security-model.md](docs/en/security-model.md)), and observability as applicable.
5. For AI consumers, start with [docs/en/ai-context.md](docs/en/ai-context.md) (or [docs/pt-BR/ai-context.md](docs/pt-BR/ai-context.md)); apply AI-ready metadata, claims, and relationships ([ai-ready-model.md](docs/en/ai-ready-model.md)).
6. Record decisions with the ADR template.
7. Set YAML metadata (`status`, `owner`, `updated`) and information classification (`Confirmed` / `Inferred` / `Unknown` / `Proposed`).
8. Validate with [docs/en/documentation-checklist.md](docs/en/documentation-checklist.md) and run `make docs-validate` (or `python3 scripts/docs_lint.py validate`) before merging. See [docs/en/governance.md](docs/en/governance.md).

Do **not** treat every category as mandatory for every project. Use what adds value; mark the rest as not applicable or not documented.

A relevant technical change is not complete until required documentation is updated. See [docs/en/change-policy.md](docs/en/change-policy.md).

## Cursor and documentation sync

If you use **Cursor** or **Claude Code**:

1. **Entry files** [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md) — short pointers to [docs/en/ai-context.md](docs/en/ai-context.md). Packaging: [docs/en/ai-agent-entry.md](docs/en/ai-agent-entry.md).
2. **Project rules** under [`.cursor/rules/`](.cursor/rules/) — agent guardrails (docs-first, clear language, knowledge in Markdown, reuse templates, area map, quality checks).
3. **Skills** [`.cursor/skills/document-after-change`](.cursor/skills/document-after-change/SKILL.md) (Claude: [`.claude/skills/document-after-change`](.claude/skills/document-after-change/SKILL.md)) — after relevant changes, keep **local Markdown** in sync. Optional: `grill-me` to stress-test a plan.
4. **Adopter copy pack** [examples/adopter-agent-starter/](examples/adopter-agent-starter/).

Publishing that local documentation to **Confluence** is **optional**. When you need it, use the [`docs-sync/`](docs-sync/) CLI (one-way: GitHub/local checkout → Confluence). See [docs-sync/README.md](docs-sync/README.md). For this repo’s Portuguese tree, `docs-sync/config.pt-BR.yaml` and `make docs-sync-pt-br` are available.

## Repository Structure

```text
/
├── README.md                 # English entry
├── README.pt-BR.md           # Portuguese entry
├── AGENTS.md                 # Generic coding-agent entry
├── CLAUDE.md                 # Claude Code entry
├── CONTRIBUTING.md
├── CONTRIBUTING.pt-BR.md
├── LICENSE
├── Makefile                  # docs-validate / docs-report helpers
├── scripts/
│   └── docs_lint.py          # Documentation linter (stdlib)
├── .cursor/
│   ├── rules/                    # Cursor rules: Documentation Standard guardrails
│   └── skills/                   # document-after-change, grill-me
├── .claude/
│   └── skills/                   # Claude Code mirror of the same skills
├── docs-sync/                # Optional: local Markdown → Confluence publisher
├── .github/
│   ├── workflows/docs-validation.yml
│   └── pull_request_template.md
├── docs/
│   ├── README.md             # Language chooser
│   ├── manifest.yaml         # Manifest language chooser
│   ├── validation-config.yaml
│   ├── en/                   # English standard + as-is packs
│   │   ├── loft-infra/       # As-is: publish path (Actions, k8s-apps, Kong, …)
│   │   ├── aiops-apps/       # As-is: AIOps front/back stacks
│   │   └── …                 # methodology, templates, categories
│   └── pt-BR/                # Portuguese mirror (same layout)
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
        ├── ai-change-record/
        └── governance/       # exceptions, contradictions, gates samples
```

## Creating Documentation

| Step | Action | Reference |
| --- | --- | --- |
| 1 | Read principles | [docs/en/principles.md](docs/en/principles.md) |
| 2 | Follow writing standards | [docs/en/standards.md](docs/en/standards.md), [docs/en/style-guide.md](docs/en/style-guide.md) |
| 3 | Follow language policy | [docs/en/language.md](docs/en/language.md) |
| 4 | Choose a template | [docs/en/templates/](docs/en/templates/) |
| 5 | Classify information | Confirmed / Inferred / Unknown / Proposed |
| 6 | Set document status | DRAFT → REVIEW → ACCEPTED |
| 7 | Link evidence | Files, configs, ADRs, contracts |
| 8 | For AI consumers, start at ai-context | [docs/en/ai-context.md](docs/en/ai-context.md) |
| 9 | Run the checklist | [docs/en/documentation-checklist.md](docs/en/documentation-checklist.md) |

## Validating Documentation

Use [docs/en/documentation-checklist.md](docs/en/documentation-checklist.md) as the minimum human quality gate, and run the in-repo linter:

```bash
make docs-validate
# equivalent: python3 scripts/docs_lint.py validate
make docs-report   # writes docs/en/reports/documentation-health.md
```

Commands and exit codes: [docs/en/automation-commands.md](docs/en/automation-commands.md). Governance: [docs/en/governance.md](docs/en/governance.md). CI runs the same tool via `.github/workflows/docs-validation.yml`.

Confluence publish is optional; see [Cursor and documentation sync](#cursor-and-documentation-sync) above.

Validation must confirm at least:

- purpose and scope are documented;
- claims are verifiable or explicitly marked Unknown / Inferred / Proposed;
- no secrets are present;
- terminology and references are consistent;
- status is set;
- for this repository: EN and pt-BR versions exist and are linked.

## Evolving the Standard

Changes follow [docs/en/versioning.md](docs/en/versioning.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

- Patch: clarifications, typos, non-breaking template improvements
- Minor: new optional templates, categories, or guidance
- Major: breaking structural or convention changes

Update **both languages** in the same pull request whenever possible.

If you change the **docs structure** (new/renamed/removed category or pack under `docs/`), refresh:

1. This [Document index](#document-index) (and the pt-BR twin in [README.pt-BR.md](README.pt-BR.md))
2. [docs/en/README.md](docs/en/README.md) and [docs/pt-BR/README.md](docs/pt-BR/README.md)
3. The pack’s own `README.md` map (e.g. `loft-infra/`, `aiops-apps/`)

## Examples

Fictional examples (not real projects):

- [examples/simple-service/](examples/simple-service/) — request/response service
- [examples/fullstack-monolith/](examples/fullstack-monolith/) — **illustrative** FE+API+DB monolith (suggested stack ≠ framework standard)
- [examples/event-driven-service/](examples/event-driven-service/) — event-driven service
- [examples/distributed-system/](examples/distributed-system/) — multi-component distributed system
- [examples/adopter-ci-starter/](examples/adopter-ci-starter/) — optional CI starter for adopters
- [examples/contracts/](examples/contracts/) — standalone technical contracts (API, Event, Message, File)
- [examples/operations/](examples/operations/) — operations & reliability (service profile, runbook, incident, failure mode, SLI, SLO, recovery)
- [examples/security/](examples/security/) — security methodology (asset, threat, risk, requirement, control, vulnerability, exception, incident, security-test, security-review)
- [examples/ai-ready/](examples/ai-ready/) — AI-ready methodology (metadata, claim, relationship, component, knowledge-gap, contradiction, ai-task-context, documentation-change, ai-change-record)

New adoption guides: [docs/en/adoption-path.md](docs/en/adoption-path.md), [docs/en/flat-docs-migration.md](docs/en/flat-docs-migration.md), [docs/en/observability-platform-notes.md](docs/en/observability-platform-notes.md).

Each project example is available in `en/` and `pt-BR/`. Contract, operations, security, and AI-ready samples follow the same bilingual layout under each type folder.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) / [CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md). Documentation changes require review, like code.

## Related Documents

| Document | Description |
| --- | --- |
| [docs/README.md](docs/README.md) | Language chooser |
| [docs/en/loft-infra/README.md](docs/en/loft-infra/README.md) | As-is Loft AIOps publish path |
| [docs/en/aiops-apps/README.md](docs/en/aiops-apps/README.md) | As-is AIOps application stacks |
| [docs/en/principles.md](docs/en/principles.md) | Documentation principles |
| [docs/en/lifecycle.md](docs/en/lifecycle.md) | Documentation lifecycle |
| [docs/en/architecture-model.md](docs/en/architecture-model.md) | Architecture methodology |
| [docs/en/contract-model.md](docs/en/contract-model.md) | Technical contracts methodology |
| [docs/en/operations-model.md](docs/en/operations-model.md) | Operations & reliability methodology |
| [docs/en/security-model.md](docs/en/security-model.md) | Security methodology |
| [docs/en/ai-context.md](docs/en/ai-context.md) | Primary AI entry (AI-ready methodology) |
| [docs/en/ai-ready-model.md](docs/en/ai-ready-model.md) | AI-ready documentation model |
| [docs/en/language.md](docs/en/language.md) | Bilingual policy |
| [docs/en/ai-documentation.md](docs/en/ai-documentation.md) | Domain AI writing rules |
| [docs/en/quality-model.md](docs/en/quality-model.md) | Quality dimensions and levels |
| [docs/en/versioning.md](docs/en/versioning.md) | Standard versioning policy |
