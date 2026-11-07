# Architecture Model

> Language: EN | [Português (pt-BR)](../pt-BR/architecture-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

How this standard structures architecture documentation — as progressive disclosure, not as a mandatory architecture style.

Architecture must not be documented as a single image. Readers start with a simple view and go deeper only when they need to.

## Central Idea

```text
Context
   ↓
System
   ↓
Containers / Deployable Units
   ↓
Components
   ↓
Interfaces
   ↓
Implementation
```

These are **documentation levels**. They are not requirements that every system must implement as separate runtime tiers.

A small project may use only Context + System + a few Components. A complex system may use all levels. Do not force a simple application to produce dozens of architecture documents.

## Documentation Levels (Structural)

| Level | What it answers | Typical content |
| --- | --- | --- |
| **Context** | Where does this system sit in the ecosystem? | Users, consumers, external systems, major inputs/outputs |
| **System** | What is the system as a whole? | Purpose, goals, non-goals, system boundary |
| **Containers / Deployable Units** | What are the main deployable or runtime units? | Services, apps, jobs, packages, runtimes — technology-agnostic |
| **Components** | What are the meaningful architectural parts inside units? | Responsibilities, non-responsibilities, dependencies |
| **Interfaces** | How do parts connect? | Contracts, APIs, events, messages, files, commands |
| **Implementation** | How is it built in code/config? | Modules, packages, IaC — link out; do not dump class lists into architecture overviews |

### Context

Describe the system relative to its environment: actors, adjacent systems, and the relationships that matter for understanding placement — not every integration that exists.

### System

Describe purpose, goals, non-goals, and the [system boundary](system-boundaries.md). Make explicit what the system owns and what it does not control.

### Containers / Deployable Units

Use this level when the system has more than one deployable or independently runnable unit (process, service, job, package, edge app, etc.). Name units by architectural role, not by marketing or vendor product names unless those names are the project's stable identifiers.

Skip this level when a single deployable unit is enough; fold it into System + Components.

### Components

Components are architectural units of responsibility — not every file, class, or function. Prefer coarse, stable names that survive refactors.

See [component-relationships.md](component-relationships.md) and templates under `templates/` (component / architecture templates when adopted).

### Interfaces

Document how components and external actors exchange information: request/response, events, streams, files, CLI I/O, and other contracts. Prefer links to canonical [contracts](contracts/README.md) over copying schemas into architecture prose.

### Implementation

Architecture docs may point to modules, repositories, or config paths as evidence. Detailed code structure belongs in application or developer docs — see [architecture-vs-implementation.md](architecture-vs-implementation.md).

## Architecture Documentation Levels (Audience Depth)

Independent of the structural model above, choose how deep a given document or section goes:

| Depth | Audience | Focus |
| --- | --- | --- |
| **Level 1 — Executive** | Leadership, adjacent teams, quick orientation | One-paragraph purpose, one diagram max, major risks/trade-offs |
| **Level 2 — System** | Engineers new to the system | Context, boundary, main components, main dependencies |
| **Level 3 — Technical** | Owning team, integrators | Components, flows, relationships, failure/trust boundaries, contracts |
| **Level 4 — Implementation** | Engineers changing the system | Module maps, config, detailed sequences — still not every class |

Guidance:

- Most projects need Level 2 as the architecture overview default.
- Add Level 3 where complexity or risk justifies it.
- Keep Level 4 out of the main architecture overview; link to component or developer docs.
- Level 1 is optional; useful when stakeholders need a short entry point.

## Progressive Disclosure

1. Start with purpose and system boundary.
2. Add context and main components.
3. Add relationships, data flows, and critical dependencies when questions arise.
4. Add failure domains, trust boundaries, and quality attributes when resilience or security matters.
5. Link ADRs for *why*; keep architecture docs focused on *what exists*.

Do not require every section of every template for every project. Empty sections that do not apply should be omitted or marked Not Applicable — not filled with invented content.

## Technology-Agnostic Stance

Do not treat any of the following as universal requirements of this model:

- cloud provider, language, framework, database;
- containers, Kubernetes, serverless;
- monolith, microservices, event-driven, hexagonal, DDD, CQRS, or other styles.

Name styles only when evidence or an explicit project declaration supports them. Otherwise: architectural pattern not identified. Classification rules: [standards.md](standards.md).

## Related Documents

- [system-boundaries.md](system-boundaries.md)
- [component-relationships.md](component-relationships.md)
- [architecture-diagrams.md](architecture-diagrams.md)
- [architecture-vs-implementation.md](architecture-vs-implementation.md)
- [architecture-by-project-type.md](architecture-by-project-type.md)
- [architecture-traceability.md](architecture-traceability.md)
- [architecture/README.md](architecture/README.md)
- [principles.md](principles.md)
