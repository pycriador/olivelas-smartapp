# AI-Ready Checklist

> Language: EN | [Português (pt-BR)](../pt-BR/ai-ready-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Minimum checklist for AI-ready documentation (Documentation Standard v1.0).

## Entry and Navigation

- [ ] [ai-context.md](ai-context.md) exists and is the declared entry
- [ ] Navigation rules known ([ai-navigation.md](ai-navigation.md))
- [ ] Manifest lists key docs ([manifest.yaml](manifest.yaml))
- [ ] Optional: `AGENTS.md` / `CLAUDE.md` point at `ai-context.md` ([ai-agent-entry.md](ai-agent-entry.md))

## Metadata and Identity

- [ ] Substantive docs have required metadata fields
- [ ] Stable ids follow [document-identity.md](document-identity.md)
- [ ] Types use [document-types.md](document-types.md)

## Evidence and Claims

- [ ] Claims classified (Confirmed/Inferred/Unknown/Proposed/Deprecated)
- [ ] Confirmed claims cite evidence
- [ ] Inferred never treated as Confirmed
- [ ] Confidence not confused with status

## Graph and Registries

- [ ] Component and service registries distinct
- [ ] Key relationships use controlled vocabulary
- [ ] Documentation dependencies declared for hubs

## Safety and Boundaries

- [ ] No secrets in docs or examples
- [ ] Task boundaries understood
- [ ] Drift linked to stale/architecture/contract/operational/security drift docs when relevant

## Validation

- [ ] No open ERROR validations on governed docs
- [ ] WARNINGs owned or tracked as debt
- [ ] Human review for ACCEPTED material changes

## Related Documents

- [documentation-checklist.md](documentation-checklist.md)
- [ai-documentation-validation.md](ai-documentation-validation.md)
- [ai-documentation-anti-patterns.md](ai-documentation-anti-patterns.md)
