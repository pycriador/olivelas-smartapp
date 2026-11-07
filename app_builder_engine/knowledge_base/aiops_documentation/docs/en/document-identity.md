# Document Identity

> Language: EN | [Português (pt-BR)](../pt-BR/document-identity.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Stable identifiers for documents and related engineering artifacts. Preserve existing conventions from [standards.md](standards.md) and domain debt registers; extend them for AI-ready inventories.

## Principles

1. **Stable** — IDs do not change when titles or paths change.
2. **Typed prefix** — prefix encodes the artifact kind.
3. **Unique within the project** — no reuse after deprecation without an explicit supersession record.
4. **English machine tokens** — IDs are not translated ([language.md](language.md)).
5. **Linkable** — every ID should resolve to a document, register row, or declared Unknown.

## Document ID Schemes

| Prefix | Artifact | Example | Notes |
| --- | --- | --- | --- |
| `ARCH-XXX` | Architecture document or architecture debt item | `ARCH-001` | Debt register uses same family ([architecture-debt.md](architecture-debt.md)) |
| `CONTRACT-XXX` | Contract document (human doc id) | `CONTRACT-001` | Distinct from runtime contract key `name@version` |
| `OPS-XXX` | Operations / reliability document | `OPS-001` | |
| `SEC-XXX` | Security document | `SEC-001` | Drift may use `SEC-DRIFT-XXX` |
| `DEC-XXX` / `ADR-XXX` | Decision record | `ADR-012` | Prefer `ADR-XXX` when using ADRs |
| `REQ-XXX` | Requirement | `REQ-001` | Security: `REQ-SEC-XXX` allowed |
| `RB-XXX` / `rb-*` | Runbook | `rb-checkout-timeout` | Prefer existing `rb-<short-name>` |
| `INC-YYYYMMDD-NN` | Incident | `INC-20260807-01` | |
| `EVD-XXX` | Evidence record / evidence doc | `EVD-authn-review-20260807` | |
| `REF-XXX` | Reference / glossary / index | `REF-001` | |
| `CTX-XXX` | Context / overview / AI context | `CTX-001` | |
| `DOC-XXX` | Documentation debt or meta-doc when needed | `DOC-012` | ([documentation-debt.md](documentation-debt.md)) |
| `GOV-XXX` | Governance / policy document | `GOV-001` | ([governance.md](governance.md)) |
| `VAL-XXX` / `DOC-*-*` | Validation rule ids | `DOC-META-001` | ([validation-rules.md](validation-rules.md)) |
| `EXC-DOC-XXX` | Documentation exception | `EXC-DOC-001` | ([exceptions.md](exceptions.md)) |
| `CONTRA-XXX` | Contradiction record | `CONTRA-001` | ([contradictions/](contradictions/)) |

Zero-pad numeric suffixes to three digits unless the project already uses another width consistently.

## Existing Conventions to Preserve

From [standards.md](standards.md):

| Identifier | Format | Example |
| --- | --- | --- |
| ADR | `ADR-XXX` | `ADR-012` |
| Runbook | `rb-<short-name>` | `rb-checkout-timeout` |
| Incident | `INC-YYYYMMDD-NN` | `INC-20260807-01` |
| Alert | short kebab or monitoring id | `alert-checkout-error-rate` |
| Failure mode | short kebab | `fm-payment-timeout` |
| Contract (runtime) | `name@version` | `order-created@v1` |
| Component | project-local stable name or `CMP-XXX` | `checkout-api`, `CMP-001` |
| Service | project-local stable name or `SVC-XXX` | `checkout-api`, `SVC-001` |
| Threat | `THR-XXX` or kebab | `THR-012` |
| Security risk | `RISK-XXX` | `RISK-007` |
| Security control | `CTRL-XXX` | `CTRL-015` |
| Vulnerability | `VULN-XXX` | `VULN-042` |
| Security exception | `EXC-XXX` | `EXC-004` |
| Security asset | `AST-XXX` | `AST-011` |
| Security test | `SECTEST-XXX` | `SECTEST-002` |

## Document ID vs Runtime Contract ID

| Kind | Example | Use for |
| --- | --- | --- |
| Document id | `CONTRACT-001` | Metadata `id`, cross-doc links, manifest |
| Runtime contract key | `order-created@v1` | Compatibility, versioning, producer/consumer binding |

Never collapse the two without an explicit mapping table.

## Component vs Service IDs

- Components: architectural units ([component-registry.md](component-registry.md)) — `CMP-XXX` or stable name.
- Services: operable/deployable units ([service-registry.md](service-registry.md)) — `SVC-XXX` or stable name.
- A service may *implement* one or more components; IDs remain distinct even when names coincide.

## Assignment Rules

1. Assign `id` when the document becomes substantive (not throwaway notes).
2. Record the ID in YAML frontmatter and optionally in the title (`ARCH-001 — Checkout Overview`).
3. On supersession, keep the old ID; point `replaced_by` to the new ID.
4. Do not recycle IDs.

## Related Documents

- [document-metadata.md](document-metadata.md)
- [document-types.md](document-types.md)
- [standards.md](standards.md)
- [manifest-rules.md](manifest-rules.md)
