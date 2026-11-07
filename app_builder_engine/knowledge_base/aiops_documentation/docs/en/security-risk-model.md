# Security Risk Model

> Language: EN | [Português (pt-BR)](../pt-BR/security-risk-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects record **security risk** in a consistent, technology-agnostic way.

A numeric Likelihood × Impact matrix is **optional**. Projects may use qualitative scales, criticality-linked severity, or a lightweight narrative. Declare the model the project actually uses; mark scoring rules **Not Defined** when none exist.

Do not invent residual risk scores or acceptance decisions that nobody made.

## Purpose

Connect threats and vulnerabilities to decisions:

```text
Threat (+ Vulnerability) → Risk → Accept / Mitigate / Transfer / Avoid → Residual risk
```

## Core Dimensions

| Dimension | Meaning |
| --- | --- |
| **Likelihood** | How plausible the scenario is under stated assumptions |
| **Impact** | Harm if the scenario occurs (confidentiality, integrity, availability, privacy, trust, cost — as applicable) |
| **Severity** | Overall seriousness used for prioritization (may combine likelihood and impact, or follow a project rubric) |
| **Confidence** | How sure we are of the assessment (align with Confirmed / Inferred / Unknown / Proposed) |
| **Residual risk** | Risk remaining after current controls |

Optional: inherent risk (before controls) vs residual (after). Only use if the project finds the distinction useful.

## Optional Likelihood × Impact

Example qualitative scales (adapt or replace):

| Likelihood | Example meaning |
| --- | --- |
| Low | Plausible only with uncommon conditions |
| Medium | Plausible under normal operating assumptions |
| High | Expected without additional controls |

| Impact | Example meaning |
| --- | --- |
| Low | Limited, recoverable harm |
| Medium | Material harm to users, data, or operations |
| High | Severe harm; major incident or trust failure |

If the project multiplies or maps to a severity grid, document that grid once. If not, use narrative severity.

## Suggested Risk Record

| Field | Meaning |
| --- | --- |
| **ID** | Stable short id |
| **Risk statement** | Concise “if X then Y” |
| **Related threat / asset** | Links |
| **Likelihood** | Per project scale or Not Defined |
| **Impact** | Per project scale or Not Defined |
| **Severity** | Per project rubric |
| **Confidence** | Confirmed / Inferred / Unknown / Proposed |
| **Controls** | Current controls (links) |
| **Residual risk** | After controls |
| **Decision** | accept / mitigate / transfer / avoid / Not Defined |
| **Owner** | Who owns the decision or mitigation |

## Suggested Inventory

| ID | Risk | Likelihood | Impact | Severity | Confidence | Residual | Decision | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | |

## Integration with Operations and Architecture

| Concern | Link |
| --- | --- |
| Service criticality | [criticality.md](criticality.md) |
| Failure impact | [failure-modes.md](failure-modes.md), [incident-severity.md](incident-severity.md) |
| Error budget / reliability trade-offs | [error-budget.md](error-budget.md) — do not equate reliability burn with security acceptance |
| Architecture debt / security debt | Call out when risk is accepted due to known gaps |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Narrative top risks with owners and residual notes |
| Medium | Inventory with severity and decisions |
| Large | Explicit scales, confidence, exception linkage |

## Anti-Patterns

- Precise scores with no defined scale.
- “Accepted” risks with no owner.
- Treating Unknown likelihood as Low.
- Claiming transfer (e.g. “vendor handles it”) without a boundary and residual note.

## Related Documents

- [security-model.md](security-model.md)
- [threat-modeling.md](threat-modeling.md)
- [security-requirements.md](security-requirements.md)
- [security-controls.md](security-controls.md)
- [security-ownership.md](security-ownership.md)
