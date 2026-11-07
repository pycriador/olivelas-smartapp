# Incident Severity

> Language: EN | [Português (pt-BR)](../pt-BR/incident-severity.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How to document incident severity (urgency and impact during response).

The SEV-1..4 scale below is an **example**. Projects may use P0–P3, Red/Amber/Green, or another model. Document the chosen scale once and use it consistently. If no severity model exists: **Not Defined**.

## Example Scale (SEV-1..4)

| Severity | Example meaning |
| --- | --- |
| **SEV-1** | Critical user-facing or safety/revenue outage; all-hands style response |
| **SEV-2** | Major degradation or outage of an important capability; urgent response |
| **SEV-3** | Limited impact or workaround available; timely response |
| **SEV-4** | Minor impact; can be handled in normal working patterns |

Adjust definitions to the product. Do not copy this table into a project without editing meanings.

## Factors (Guidance — Not Auto-Score)

| Factor | Question |
| --- | --- |
| User impact | How many / which journeys? |
| Business impact | Revenue, legal, trust? |
| Scope | Partial vs total; one region vs all |
| Data risk | Loss, corruption, exposure? |
| Workarounds | Safe alternative path? |
| Time sensitivity | Getting worse? Deadline? |

Severity may change as impact is better understood — record changes in the [timeline](incident-timeline.md).

## Severity vs Criticality vs Alert Priority

| Concept | About |
| --- | --- |
| [criticality.md](criticality.md) | Importance of a *component/capability* in steady state |
| Incident severity | Urgency of *this event* |
| Alert priority | How loudly monitoring notifies — should map to severity when possible |

A Critical service can have a SEV-4 cosmetic glitch. A Medium service can cause SEV-2 if blast radius is large.

## What to Document in the Project

1. Severity levels and definitions.
2. Who can set/change severity.
3. Expected response time / communication by severity (**or Not Defined**).
4. Mapping from alerts to initial severity when used.

## Related Documents

- [incident-management.md](incident-management.md)
- [criticality.md](criticality.md)
- [alerting.md](alerting.md)
- [post-incident-review.md](post-incident-review.md)
