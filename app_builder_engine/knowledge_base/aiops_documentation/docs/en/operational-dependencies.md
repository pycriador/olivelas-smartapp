# Operational Dependencies

> Language: EN | [Português (pt-BR)](../pt-BR/operational-dependencies.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Kinds of dependencies that matter for operating a system — beyond “service A calls service B”.

Architecture docs often emphasize runtime edges. Operators also need build, deployment, and operational dependencies. Mark kinds **Not Applicable** when they do not exist for the project.

## Dependency Kinds

| Kind | Meaning | Examples (agnostic) |
| --- | --- | --- |
| **Runtime** | Required while serving or processing | Datastores, brokers, identity, peer APIs |
| **Build** | Required to produce artifacts | CI system, artifact registry, compilers, private modules |
| **Deployment** | Required to release or configure | Deploy pipeline, environment APIs, config/secret delivery |
| **Operational** | Required to observe, diagnose, or recover | Logging/metrics backends, paging, runbook store, backup tooling |

A single external system can appear in more than one kind (e.g. identity used at runtime and in deploy).

## What to Document

| Dependency | Kind | Criticality | Owner | Failure Impact | Notes |
| --- | --- | --- | --- | --- | --- |
| | Runtime / Build / Deployment / Operational | | | | |

For deep reliability treatment of runtime (and other material) deps, use [dependency-reliability.md](dependency-reliability.md).

## Why Separate Kinds

| Kind | Typical failure symptom | Who feels it first |
| --- | --- | --- |
| Runtime | User-facing errors, lag | On-call / users |
| Build | Cannot produce a release | Developers |
| Deployment | Cannot ship or roll back | Release owner |
| Operational | Blind while system may still run | On-call (dangerous) |

An operational dependency outage (no metrics) can coexist with green runtime — document detection of “we are blind”.

## Integration

| View | Relationship |
| --- | --- |
| Architecture dependencies | Primarily runtime / data — [component-relationships.md](component-relationships.md) |
| Contracts | Runtime interaction rules — [contract-model.md](contract-model.md) |
| Ownership | [operational-ownership.md](operational-ownership.md) |
| Observability backends | Operational deps — [observability-model.md](observability-model.md) |

## Anti-Patterns

- Documenting only cloud vendor logos without kind or impact.
- Ignoring operational dependencies so incidents start with “dashboards are empty”.
- Treating build-only tools as runtime SPOFs (or vice versa) without clarification.

## Related Documents

- [dependency-reliability.md](dependency-reliability.md)
- [reliability-model.md](reliability-model.md)
- [operational-ownership.md](operational-ownership.md)
- [operations-model.md](operations-model.md)
