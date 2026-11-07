# Progressive Context

> Language: EN | [Português (pt-BR)](../pt-BR/progressive-context.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Load documentation in expanding depth: **Question → Scope → Context → Knowledge → Evidence → Constraints → Answer**.

Aligns with architecture progressive disclosure (Context → System → Components → Interfaces → Implementation) without replacing it.

## Flow

```text
Question
  → Scope (system, env, timeframe)
  → Context (Level 0–1)
  → Knowledge (typed docs, registries)
  → Relationships (deps, links)
  → Evidence (classify claims)
  → Constraints (SoT, safety, authority)
  → Answer (with gaps & confidence)
```

## Domain Examples

### Architecture

| Step | Example |
| --- | --- |
| Question | What calls the payment provider? |
| Scope | `checkout` production path |
| Context | System overview |
| Knowledge | Component registry + sequence docs |
| Evidence | Code client + config endpoint (Confirmed) |
| Answer | Named component + citation; Unknown if not found |

### Contracts

| Step | Example |
| --- | --- |
| Question | Is removing `customer_tax_id` breaking? |
| Knowledge | `order-created@v1` contract + consumers |
| Evidence | Schema + consumer tests |
| Constraints | [breaking-changes.md](breaking-changes.md) vocabulary |
| Answer | Potential Breaking Change / Unknown Impact — not automatic “breaking” without evidence |

### Operations

| Step | Example |
| --- | --- |
| Question | How do we page on elevated error rate? |
| Knowledge | Alert → runbook link |
| Evidence | Alert definition + runbook ACCEPTED |
| Answer | Steps from runbook; mark Unknown commands rather than inventing |

### Security

| Step | Example |
| --- | --- |
| Question | Where is the DB password configured? |
| Constraints | [ai-context-safety.md](ai-context-safety.md) |
| Answer | Secret **name**/reference and store only; value `[REDACTED]` / never invented |

## Rules

1. Stop expanding depth when the question is answered with adequate evidence.
2. Prefer Unknown over speculative Level 5–6 detail.
3. Record assumptions under [knowledge-gaps.md](knowledge-gaps.md).

## Related Documents

- [ai-context.md](ai-context.md)
- [architecture-model.md](architecture-model.md)
- [chunking-guidelines.md](chunking-guidelines.md)
