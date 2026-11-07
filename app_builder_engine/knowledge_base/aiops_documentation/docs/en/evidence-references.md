# Evidence References

> Language: EN | [Português (pt-BR)](../pt-BR/evidence-references.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0


How to point from a claim to the artifact that supports it.

## Preferred Reference Forms

| Evidence kind | Preferred form | Example |
| --- | --- | --- |
| Source file | Repository-relative path **and** GitHub `blob` URL (+ symbol / `#Lstart-Lend` when stable) | `src/checkout/service.ts` · [blob](https://github.com/org/repo/blob/main/src/checkout/service.ts#L40-L55) |
| Config | Path + key name (never secret value) + blob link when citing | `deploy/values.yaml` → `replicaCount` |
| Contract | Contract doc link + runtime key | [order-created](contracts/) · `order-created@v1` |
| Test | Test path + blob link when citing | `tests/contract/order_created_test.go` |
| ADR | `ADR-XXX` + link | `ADR-012` |
| IaC / manifest | Path or named resource id + blob link when citing | `infra/checkout/main.tf` |
| Ticket | Stable id or URL | `JIRA-1234` |
| Incident | Incident id + link | `INC-20260807-01` |
| Metric / dashboard | Stable name + link if available | `checkout.error_rate` |
| External spec | Name + version + URL | OpenAPI 3.1 (project copy path preferred) |
| External GitHub repo | Short `org/repo` once, then path + blob — [publishing-surfaces.md](publishing-surfaces.md) | [loft-br/k8s-apps](https://github.com/loft-br/k8s-apps) |

## Evidence Record Shape

When logging evidence explicitly (tables or Evidence-type docs):

| Field | Required | Meaning |
| --- | --- | --- |
| `evidence_id` | Recommended | e.g. `EVD-...` |
| `claim_id` / claim text | Yes | What is supported |
| `reference` | Yes | Path, id, or link (for code: path **and** GitHub blob URL) |
| `collected_on` | Recommended | `YYYY-MM-DD` |
| `classification` | Yes | Confirmed / Inferred / … |
| `notes` | Optional | Limits of the evidence |

## Rules

1. Vague references (“configured somewhere”) are invalid for Confirmed claims.
2. Stale evidence dates are a freshness signal ([documentation-freshness.md](documentation-freshness.md)).
3. Do not paste secret values, credentials, or unnecessary PII into evidence fields ([ai-context-safety.md](ai-context-safety.md)).
4. If evidence cannot be cited, the claim is at best Inferred — usually Unknown.
5. When citing code or config from GitHub, include location (path / lines) and a blob URL — [publishing-surfaces.md](publishing-surfaces.md).

## Related Documents

- [evidence-model.md](evidence-model.md)
- [claims.md](claims.md)
- [security-evidence.md](security-evidence.md)
- [standards.md](standards.md)
- [publishing-surfaces.md](publishing-surfaces.md)
