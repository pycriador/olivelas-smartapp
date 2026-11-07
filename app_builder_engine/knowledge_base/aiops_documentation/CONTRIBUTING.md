# Contributing

> Language: EN | [Português (pt-BR)](CONTRIBUTING.pt-BR.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Thank you for contributing to the Engineering Documentation Standard.

This repository defines a **reusable documentation framework** with an explicit **documentation lifecycle**. Contributions should improve the standard itself — not document a real application here.

## Principles for Contributions

- Keep the standard technology-agnostic.
- Prefer clarity and reusability over project-specific detail.
- Do not embed secrets, credentials, or real project data.
- Treat documentation changes as engineering artifacts: reviewed, versioned, and evidence-based.
- Follow lifecycle, ownership, and review policies.
- Deliver **EN and pt-BR** together whenever a document changes.

Core references:

- [docs/en/principles.md](docs/en/principles.md)
- [docs/en/lifecycle.md](docs/en/lifecycle.md)
- [docs/en/standards.md](docs/en/standards.md)
- [docs/en/style-guide.md](docs/en/style-guide.md)
- [docs/en/language.md](docs/en/language.md)
- [docs/en/change-policy.md](docs/en/change-policy.md)

## Ways to Contribute

| Contribution type | What to change | Notes |
| --- | --- | --- |
| New standard document | `docs/en/` **and** `docs/pt-BR/` | Same relative path in both trees |
| Lifecycle / governance | lifecycle, status, ownership, review, change, debt, stale, deprecation, archive, changelog, quality | Keep simple and non-bureaucratic |
| Architecture methodology | architecture-model, boundaries, diagrams, mermaid, drift, debt, review, checklist | Evidence-based; no invented styles |
| Contracts methodology | contract-model, types, schema/semantics, retry/idempotency/delivery, versioning, lifecycle, breaking-changes, type-specific guides, checklist | Technology-agnostic; no invented protocols or systems |
| Operations & reliability methodology | operations-model, reliability-model, service levels, failure modes, runbooks, incidents, recovery, readiness, observability signals | Technology-agnostic; no invented SLOs, alerts, DR, or commands |
| Security methodology | security-model, threat modeling, assets/risks/requirements/controls, exceptions, vulnerabilities, security incidents, readiness, checklists | Technology-agnostic; no invented certifications, secret values, or exploit PoCs |
| AI-ready methodology | ai-context, ai-ready-model, metadata/identity/types, evidence/claims, relationships/registries, progressive context, navigation/answering/change rules, gaps/contradictions, manifest, checklist | Documentation standards only; no RAG, embeddings, vector DB, agents, MCP, or chatbots |
| Governance & automation | governance, validation rules/config, quality gates, exceptions, drift/health, automation security, CI workflow, `scripts/docs_lint.py` | In-repo only; no SaaS/portal/RAG; keep local and CI validators identical |
| Template change | `docs/en/templates/` and `docs/pt-BR/templates/` | Keep templates generic; preserve frontmatter |
| New template | Both language trees + update indexes | Include metadata conventions |
| As-is pack (`loft-infra`, `aiops-apps`, …) | Both language trees + root README index | Brief summary per doc; keep pack `README.md` map in sync |
| Style / standards update | Both language trees | Call out breaking vs non-breaking impact |
| AI guidance | `docs/*/ai-context.md`, `ai-documentation.md`, `ai-agent-entry.md`, and AI-ready policies | Keep rules actionable; start agents at `AGENTS.md` / `ai-context.md` |
| Checklist update | `docs/*/documentation-checklist.md` | Keep items verifiable |
| Examples | `examples/<name>/en/` and `pt-BR/` | Fictional projects only |
| Versioning policy | `docs/*/versioning.md` | Align with semantic rules |

## Creating New Documents

1. Identify the category.
2. Create the document in **both** language trees with the same relative path.
3. Add YAML frontmatter (`title`, `status`, `owner`, `updated` at minimum for substantive docs).
4. Add the cross-language link.
5. Prefer an existing template when applicable.
6. Set `status: DRAFT` initially.
7. Link related documents; avoid unnecessary duplication.
8. Mark unknowns explicitly.
9. Keep machine tokens in English.
10. Open a pull request for review.

## Git and Pull Requests for Documentation

### Commits

- Prefer focused commits.
- Use conventional prefixes when helpful:

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

Examples:

```text
docs(lifecycle): define transition matrix
docs(contracts): add contract checklist
docs(operations): add operational readiness checklist
docs(templates): add review-record template
docs(ai-ready): add claim and relationship examples
docs: fix broken links in standards
```

### Pull requests

PRs that change documentation should:

1. Update metadata (`updated`, `status`, `owner` when relevant).
2. Update references and indexes — including root [README.md](README.md) / [README.pt-BR.md](README.pt-BR.md) **Document index**, [docs/en/README.md](docs/en/README.md) / [docs/pt-BR/README.md](docs/pt-BR/README.md), and the pack’s own `README.md` map whenever you add, rename, move, or remove categories or packs under `docs/`.
3. Update diagrams when they are affected.
4. Update both EN and pt-BR when changing this standard.
5. Use [docs/en/templates/documentation-pr-checklist.md](docs/en/templates/documentation-pr-checklist.md).

### PR description should include

- **Summary** — what changed and why
- **Impact** — patch / minor / major for the standard
- **Languages** — EN and pt-BR updated (or `Translation status: pending`)
- **Lifecycle** — status/metadata impact
- **Adoption notes** — what consuming projects should do
- **Checklist** — confirmation that review criteria were considered

### Suggested branch naming

```text
docs/<short-description>
feat/<short-description>
fix/<short-description>
```

## Review Process

All contributions require review.

Reviewers should verify:

- [ ] Purpose and scope are clear
- [ ] Content is technology-agnostic unless illustrating an optional example
- [ ] No secrets or real project data
- [ ] Links and references work
- [ ] Terminology matches the style guide
- [ ] EN and pt-BR versions exist and are linked
- [ ] Status/metadata follow [lifecycle.md](docs/en/lifecycle.md) / [status.md](docs/en/status.md)
- [ ] Versioning impact is stated
- [ ] Checklist still makes sense after the change

Use [docs/en/templates/review-record.md](docs/en/templates/review-record.md) when a formal review record is useful.

## Changing Templates

When changing a template:

- Update EN and pt-BR templates together.
- Preserve backward-compatible section names when possible.
- Keep YAML frontmatter consistent.
- Document removed/renamed sections in the PR description.
- Update examples in both languages if they depend on the changed template.
- Classify the change as patch, minor, or major per [docs/en/versioning.md](docs/en/versioning.md).

## Validation

Before merge, confirm:

1. Structure remains coherent in both language trees.
2. Templates remain usable without project-specific assumptions.
3. Lifecycle policies remain consistent (no conflicting statuses).
4. Examples still demonstrate adoption correctly in EN and pt-BR.
5. Version bump guidance is correct for the change type.

## Security

Never commit passwords, API keys, tokens, private keys, credentials, or secrets.

When documenting sensitive configuration concepts, record only:

```text
Configuration name
Purpose
Source
Required: yes/no
```

Never record the secret value.

## Questions

If guidance is unclear, open an issue proposing a clarification to the standard rather than inventing a one-off convention in a consuming project without sharing it back.
