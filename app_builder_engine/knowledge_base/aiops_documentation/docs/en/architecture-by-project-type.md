# Architecture by Project Type

> Language: EN | [Português (pt-BR)](../pt-BR/architecture-by-project-type.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Guidance for applying the architecture model to common project shapes.

These are **orientations, not requirements**. A project may combine types. Do not force a type label without evidence — if unsure: architectural pattern not identified ([architecture-model.md](architecture-model.md)).

Language stays technology-agnostic: describe roles and boundaries, not mandatory vendors or frameworks.

## Monolith

Document when useful:

- modules / bounded areas of responsibility;
- internal boundaries (what must not call what);
- dependencies (internal and external);
- data ownership;
- integrations at the edge.

Prefer module-level components over class lists ([architecture-vs-implementation.md](architecture-vs-implementation.md)).

Illustrative example (**non**-normative stack): [fullstack-monolith](../../examples/fullstack-monolith/). Combine with the Frontend section when UI and API share a repository. Adoption path: [adoption-path.md](adoption-path.md).

## Microservices

Document when useful:

- services as deployable units;
- ownership per service;
- communication styles (sync/async/other);
- contracts between services;
- dependencies and criticality;
- [failure domains](failure-domains.md) across service boundaries.

Do not assume every repository split is a microservice. Confirm with deployability, ownership, and runtime independence.

## Event-driven

Document when useful:

- producers and consumers;
- events and schemas (link contracts);
- ordering and delivery assumptions;
- retries / poison handling at architectural level;
- ownership of topics/streams and consumer groups (or equivalents).

Mark Unknown where broker guarantees are not verified.

## Serverless

Document when useful:

- functions or equivalent ephemeral units;
- triggers (HTTP, schedule, queue, storage events, …);
- dependencies and cold-start / concurrency constraints as known;
- events and execution model (request-scoped, queue-scoped, …);
- what state exists outside the function.

Do not require a specific cloud function product.

## Frontend

Document when useful:

- application boundaries (apps, shells, micro-frontends if actually used);
- UI/architectural components that matter at system level;
- state ownership (client vs server);
- APIs and BFF boundaries;
- navigation / routing at a high level;
- external dependencies (auth, analytics, CDNs) as architecture edges.

Prefer system-relevant structure over component-library catalogs.

## CLI

Document when useful:

- commands and entry points;
- inputs and outputs;
- dependencies (local tools, APIs, files);
- execution flow for primary commands;
- exit / error behavior that integrators rely on.

## Library

Document when useful:

- public API surface;
- interfaces and extension points;
- dependencies and peer requirements;
- compatibility / versioning expectations;
- what is in-process vs what calls out.

Architecture for a library is often thin: public boundary + dependency policy + compatibility.

## Infrastructure

Document when useful:

- resources and modules as architectural units;
- dependencies between stacks/modules;
- environments;
- state (remote state, import boundaries) at a high level;
- deployment boundaries and blast radius.

Keep provider-specific detail in infra docs; architecture names roles (`network edge`, `compute`, `datastore`) when that clarifies.

## Data / Pipeline

Document when useful:

- sources;
- transformations;
- destinations;
- schedules or triggers;
- dependencies (upstream freshness, shared warehouses);
- data quality expectations at architectural level;
- failure and replay domains.

## How to Use This Guide

1. Identify the closest type(s) from evidence, not aspiration.
2. Pick documentation levels from [architecture-model.md](architecture-model.md) that match risk and size.
3. Use [diagram-selection.md](diagram-selection.md) for diagrams that answer real questions.
4. Skip sections that do not apply — do not invent content to "complete" a type checklist.

## Related Documents

- [architecture-model.md](architecture-model.md)
- [system-boundaries.md](system-boundaries.md)
- [architecture-checklist.md](architecture-checklist.md)
- [architecture-vs-implementation.md](architecture-vs-implementation.md)
- [diagram-selection.md](diagram-selection.md)
