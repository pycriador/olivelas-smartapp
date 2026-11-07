# Criticality

> Language: EN | [Português (pt-BR)](../pt-BR/criticality.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document how important a capability, dependency, or failure mode is to the business and to operators.

This standard **does not auto-classify**. Humans (or an explicit project policy) assign criticality. Do not invent Critical labels from naming conventions alone.

## Example Scale

Projects **may** use Critical / High / Medium / Low. They **may** use another scale (P0–P3, Tier 1–3, Gold/Silver/Bronze). Document the scale once and use it consistently.

| Level (example) | Meaning (example) |
| --- | --- |
| **Critical** | Outage or severe degradation is unacceptable for core business outcomes; immediate response expected |
| **High** | Significant user or revenue impact; fast response expected |
| **Medium** | Limited or workaround-available impact; planned response acceptable |
| **Low** | Minor or internal-only impact; best-effort |

If the project has no criticality model, write **Not Defined** and avoid implying a tier system in other docs.

## Factors to Consider (Guidance)

Use as a checklist of *inputs* — not an automatic scoring formula:

| Factor | Question |
| --- | --- |
| User impact | How many users / which journeys break? |
| Business impact | Revenue, legal, safety, brand? |
| Data impact | Loss, corruption, privacy exposure? |
| Blast radius | One tenant, one region, whole platform? |
| Recoverability | How hard / how long to restore? |
| Detectability | Would we notice quickly? |
| Workarounds | Is there a safe manual or alternate path? |
| Dependency fan-out | How many systems fail if this fails? |

Record the **rationale** briefly when the level is not obvious.

## What to Classify

Apply criticality (when useful) to:

- services / capabilities;
- dependencies ([dependency-reliability.md](dependency-reliability.md));
- failure modes ([failure-modes.md](failure-modes.md));
- alerts and incidents (often via [incident-severity.md](incident-severity.md) — related but not identical).

Criticality of a *component* and severity of an *incident* may differ (a Critical service can have a Low-severity partial glitch).

## Documentation Shape

| Item | Criticality | Rationale | Classification |
| --- | --- | --- | --- |
| | Critical / High / Medium / Low / other / Not Defined | | Confirmed / Inferred / Unknown / Proposed |

## Anti-Patterns

- Auto-labeling everything Critical “to be safe”.
- Using vendor default tiers without project meaning.
- Changing criticality silently without updating ownership, monitoring, or runbooks.

## Related Documents

- [operational-ownership.md](operational-ownership.md)
- [service-levels.md](service-levels.md)
- [incident-severity.md](incident-severity.md)
- [dependency-reliability.md](dependency-reliability.md)
- [failure-domains.md](failure-domains.md)
