# Secret Exposure

> Language: EN | [Português (pt-BR)](../pt-BR/secret-exposure.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How adopting projects document **response when a secret may have been exposed**.

This is a security-specialized response path that integrates with [incident-management.md](incident-management.md) and [operations-model.md](operations-model.md). Do not invent a team or tooling that does not exist.

**Never write the exposed secret value into documentation, tickets mirrored into docs, or post-incident write-ups.** Refer by secret name and incident id.

## Purpose

Provide a clear chain from discovery to learning:

```text
Detection → Triage → Containment → Rotation / Revocation → Impact Assessment → Eradication → Recovery → Communication → Root Cause → Corrective Actions → Review
```

Stages may collapse for small projects; name the stages you actually perform.

## Stage Guidance

| Stage | Question | Notes |
| --- | --- | --- |
| **Detection** | How do we learn of exposure? | Scanners, human report, provider notice, log redaction alerts — link [monitoring.md](monitoring.md) when applicable |
| **Triage** | Is it real, which secret, which environments? | Classify confidence; assign [security-ownership.md](security-ownership.md) / incident owner |
| **Containment** | How do we stop further use? | Disable endpoints, block keys at provider, restrict network — per real capabilities |
| **Rotation / Revocation** | How do we invalidate the secret? | Rotate name/version; update consumers via secure channels — [secrets-management.md](secrets-management.md) |
| **Impact assessment** | What could have been accessed? | Assets, time window, actors — Unknown is allowed |
| **Eradication** | Are copies removed from stores that we control? | Repos, CI logs, images — follow project process; history rewrite is a last resort and needs explicit human decision |
| **Recovery** | When is service safely back? | Confirm new secret in use; remove emergency blocks when safe |
| **Communication** | Who must be informed? | Owners, affected consumers — no secret values in channels that become durable docs |
| **Root cause** | Why was it exposed? | Link [root-cause-analysis.md](root-cause-analysis.md) patterns; avoid blame theater |
| **Corrective actions** | What prevents recurrence? | [corrective-actions.md](corrective-actions.md) |
| **Review** | What did we learn? | [post-incident-review.md](post-incident-review.md) when the project uses PIR |

## Suggested Incident Fields

| Field | Meaning |
| --- | --- |
| **Incident id** | Per project scheme |
| **Secret name(s)** | Names only |
| **Detection time / method** | Facts |
| **Environments** | Affected |
| **Containment / rotation actions** | Facts — no values |
| **Impact** | Confirmed / Inferred / Unknown |
| **Root cause summary** | When known |
| **Corrective actions** | Links |
| **Owner** | Incident / security owner |

## Integration with Operations

| Situation | Guidance |
| --- | --- |
| Exposure causes outage | Dual operational + security incident — follow ops severity |
| Exposure without user impact | Still triage; may be security-primary |
| Unclear if secret was real | Keep Unknown; prefer rotation when risk warrants |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Who to contact, rotate steps by secret name, where not to paste values |
| Medium | Stage checklist + linkage to incident process |
| Large | Evidence handling, consumer notification, PIR expectation |

## Anti-Patterns

- Pasting the secret into the incident doc “for tracking.”
- Rotating without identifying consumers (causes silent breakage).
- Closing as “done” with no root cause when cause is knowable.
- Claiming git history is clean when the secret remains in old commits — treat history as compromised until rotated.

## Related Documents

- [secrets-management.md](secrets-management.md)
- [incident-management.md](incident-management.md)
- [root-cause-analysis.md](root-cause-analysis.md)
- [corrective-actions.md](corrective-actions.md)
- [post-incident-review.md](post-incident-review.md)
- [secure-logging.md](secure-logging.md)
