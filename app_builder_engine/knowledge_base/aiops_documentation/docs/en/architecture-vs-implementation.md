# Architecture vs Implementation

> Language: EN | [Português (pt-BR)](../pt-BR/architecture-vs-implementation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Clear separation between architecture, design, and implementation documentation — so architecture docs stay useful and do not become class-level inventories.

## Definitions

### Architecture

Structural decisions and relationships that matter for understanding the system as a whole:

- system boundary and context;
- major components and deployable units;
- communication styles and critical dependencies;
- trust and failure domains at a meaningful grain;
- quality attributes and constraints that shape structure;
- trade-offs that explain the current shape.

Architecture documentation describes **what exists** (current state) and points to **why** via ADRs.

### Design

How a solution is organized within an architectural frame:

- module layout inside a component;
- local patterns for a feature;
- detailed interaction design for a use case;
- UI information architecture for a frontend app.

Design may be documented in component docs, RFCs, or feature specs. It is finer than architecture and coarser than line-by-line implementation.

### Implementation

How code and configuration realize the design:

- classes, functions, files;
- frameworks and libraries;
- exact algorithms;
- IaC resource arguments;
- tests as executable evidence.

Implementation detail belongs primarily in code, code comments where appropriate, and developer-oriented docs — not as the bulk of an architecture overview.

## Comparison

| Concern | Architecture | Design | Implementation |
| --- | --- | --- | --- |
| Grain | System / component | Module / feature | Code / config |
| Stability | Changes infrequently | Changes with features | Changes often |
| Primary question | What are the parts and relationships? | How is this solution shaped? | How is it coded/configured? |
| Typical doc | Architecture overview, context, ADR | Component doc, RFC | Source tree, READMEs near code |

## What Not to Put in Architecture Docs

Avoid turning architecture documentation into:

- a list of every class or function;
- a mirror of the package tree without architectural meaning;
- framework tutorial content;
- Proposed refactors presented as current architecture;
- auto-generated graphs that nobody maintains.

If a diagram only makes sense to someone who already knows every type name, it is probably implementation detail — move it down or drop it.

## When Implementation Appears in Architecture Docs

Implementation references are welcome as **evidence**:

- path to a module that realizes a component;
- config key name (never secret values);
- test or contract that Confirms a claim.

Keep references short. Do not paste large code blocks into architecture overviews.

## Mapping to Documentation Levels

| [Audience depth](architecture-model.md) | Prefer |
| --- | --- |
| Level 1–2 | Architecture |
| Level 3 | Architecture + selective design |
| Level 4 | Design + implementation pointers |

## Related Documents

- [architecture-model.md](architecture-model.md)
- [architecture-traceability.md](architecture-traceability.md)
- [architecture-by-project-type.md](architecture-by-project-type.md)
- [principles.md](principles.md)
- [decisions/README.md](decisions/README.md)
