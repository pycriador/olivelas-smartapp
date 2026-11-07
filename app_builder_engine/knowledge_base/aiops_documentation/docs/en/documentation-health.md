# Documentation Health

> Language: EN | [Português (pt-BR)](../pt-BR/documentation-health.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


A lightweight health view across coverage, completeness, freshness, drift, and validation.

## Health Dimensions

| Dimension | Healthy when |
| --- | --- |
| Coverage | In-scope units mapped to docs |
| Completeness | Required sections present or Unknown |
| Freshness | Critical docs reviewed within policy |
| Drift | Known mismatches registered and owned |
| Evidence | Confirmed claims cite SoT |
| Safety | No secret leakage |
| Graph | Key relationships explicit |
| Validation | No open ERROR findings |

## Status Rollup (Optional)

| Rollup | Meaning |
| --- | --- |
| Healthy | No ERROR; warnings owned |
| Degraded | Open WARNINGs on critical paths |
| Unhealthy | Open ERRORs or unowned critical drift |
| Unknown | Insufficient inventory/manifest to assess |

Do not confuse with operational service health ([operational-state.md](operational-state.md)).

## Related Documents

- [documentation-coverage.md](documentation-coverage.md)
- [documentation-freshness.md](documentation-freshness.md)
- [documentation-drift.md](documentation-drift.md)
- [ai-documentation-validation.md](ai-documentation-validation.md)
