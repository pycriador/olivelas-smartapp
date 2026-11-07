# Security Testing

> Language: EN | [Português (pt-BR)](../pt-BR/security-testing.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Conceptual strategies for **security testing** — not a mandate for any scanner, platform, or vendor.

Document what the project actually practices. Mark **Not Applicable** or **Not Defined** when a strategy is unused. Do not invent tool names or pass/fail gates that do not exist.

## Why Strategies (Not Recipes)

Security testing answers: *Do our controls and assumptions hold against relevant threats?* Documentation should capture **intent and coverage**, not universal attack scripts or exploit PoCs.

## Strategy Catalog (Examples — Not Exhaustive)

| Strategy | Intent | Typical evidence |
| --- | --- | --- |
| **SAST** | Find weaknesses in source/bytecode without running the full system | Pipeline result summary, finding IDs |
| **DAST** | Find weaknesses via running interfaces | Test notes, scoped findings |
| **Dependency / SCA** | Known issues in third-party components | Inventory + finding triage — [dependency-security.md](dependency-security.md) |
| **Secret detection** | Find leaked credentials in repos/artifacts | Finding + rotation record refs — no secret values |
| **IaC / config review** | Misconfiguration in infrastructure-as-code or policies | Review notes, control links |
| **Threat-driven tests** | Verify mitigations for specific threats | Linked threat IDs + test outcome |
| **Authn / authz tests** | Verify identity and permission behavior | Contract/security test records |
| **Abuse / rate-limit tests** | Verify abuse controls at boundaries | Contract + test notes — [contract-security.md](contract-security.md) |
| **Manual review** | Human analysis of sensitive paths | Review date, scope, owner |
| **Penetration test** | Time-boxed adversarial assessment (when used) | Report reference, scope, date — no exploit dumps in docs |

Projects may use other names. Map local terms once. **No specific tool is required** by this standard.

## What to Document per Strategy Used

| Field | Content |
| --- | --- |
| Strategy | Name (SAST, DAST, …) |
| Scope | What is covered / excluded |
| Frequency | Continuous / periodic / ad hoc / never |
| Owner | Who designs and interprets results |
| Linked threats / controls / requirements | IDs and links |
| Last executed | Date or Unknown |
| How findings enter vuln process | [vulnerability-management.md](vulnerability-management.md) |
| Classification | Confirmed / Inferred / Unknown / Proposed |

Use [templates/security-test.md](templates/security-test.md).

## Rules

- Conceptual only — **no universal scanner commands** in this standard.
- Do not claim “secure” solely because a tool ran.
- Findings are inputs to triage — not automatic severity truth.
- Never paste secret values, full exploit PoCs, or unnecessary PII into documentation.
- Align tests with [threat-modeling.md](threat-modeling.md) and [secure-development.md](secure-development.md).

## Related Documents

- [vulnerability-management.md](vulnerability-management.md)
- [secure-development.md](secure-development.md)
- [dependency-security.md](dependency-security.md)
- [supply-chain-security.md](supply-chain-security.md)
- [security-evidence.md](security-evidence.md)
- [security-readiness.md](security-readiness.md)
- [reliability-testing.md](reliability-testing.md)
