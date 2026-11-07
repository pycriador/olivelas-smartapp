# Decisions

> Language: EN | [Português (pt-BR)](../../pt-BR/decisions/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Category for Architecture Decision Records (ADRs) in adopting projects.

## Objective

Record architectural decisions and their consequences — not merely describe architecture.

## Guidance

- Create an ADR when a material choice is made or changed.
- Keep status updated (`Proposed`, `Accepted`, `Deprecated`, `Superseded`, etc., as used by the ADR template).
- Link related ADRs bidirectionally when decisions supersede each other.
- Architecture docs describe current state; ADRs explain why.

## Template

Use [../templates/adr.md](../templates/adr.md).

## Naming

```text
adr-XXX-short-title.md
```

Example: `adr-001-prefer-async-boundary.md`
