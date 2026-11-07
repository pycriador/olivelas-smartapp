# Architecture Diagram Standards

> Language: EN | [Português (pt-BR)](../pt-BR/architecture-diagrams.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Standards for architecture diagrams: when to draw them, how to label them, and which types this standard recognizes.

Projects are **not** required to produce every diagram type. Create a diagram only when it answers a real question — see [diagram-selection.md](diagram-selection.md).

## Diagram Requirements

Every architecture diagram should have:

| Element | Rule |
| --- | --- |
| **Title** | Specific and scannable (for example `Checkout request flow`) |
| **Purpose** | One sentence: what question the diagram answers |
| **Consistent naming** | Same names as architecture prose and component docs |
| **Relevant scope** | Only nodes needed for the purpose; no kitchen-sink maps |
| **Legend** | When shapes, colors, or line styles carry meaning |
| **Flow direction** | Clear when order or initiation matters; label edges ([component-relationships.md](component-relationships.md)) |
| **Links** | Pointers to complementary docs (contracts, ADRs, runbooks) |

Prefer text-versionable formats. Mermaid is recommended when appropriate — [mermaid-standards.md](mermaid-standards.md).

Default diagrams represent **current state**. Label Proposed explicitly.

Never put secrets, credentials, or unnecessary sensitive data in labels.

## Diagram Types

All types below are optional per project.

### Context Diagram

Shows:

- the system as one box (or a small set of systems in scope);
- users / consumers;
- external systems;
- main relationships at the boundary.

Purpose: *Where does this system fit?*

### Container / Deployable Unit Diagram

Shows:

- deployable or independently runnable units;
- primary responsibilities;
- major connections between units.

Purpose: *What are the main runtime/deployable pieces?*

Technology-agnostic: "deployable unit" may be a service, app, job, function group, package, or other unit — do not require containers or Kubernetes.

### Component Diagram

Shows:

- architectural components inside one or more units;
- dependencies and interfaces;
- labeled relationships.

Purpose: *How do internal parts relate?*

### Sequence Diagram

Shows:

- temporal interaction;
- calls, events, responses;
- timeouts, errors, retries when relevant.

Purpose: *How does an operation unfold over time?*

### Data Flow Diagram

Shows:

- origin, transformation, transport, destination;
- persistence only when it exists.

Purpose: *How does data move and change?*

### State Diagram

Shows:

- states, transitions, and conditions for a process or entity that has meaningful lifecycle.

Purpose: *How does this process change state?*

### Infrastructure Diagram

Shows infrastructure organization when that view is relevant: environments, compute/storage/network boundaries, deployment topology — without assuming a specific provider.

Purpose: *How is runtime infrastructure organized for this system?*

## Anti-Patterns

| Avoid | Prefer |
| --- | --- |
| One mega-diagram for everything | Split by level ([architecture-model.md](architecture-model.md)) |
| Unlabeled arrows | Labeled relationship types |
| Mixing current and Proposed without labels | Separate diagrams or clear markers |
| Vendor logos as architecture | Stable architectural names |
| Class/function graphs as "architecture" | Keep implementation detail in Level 4 / code docs |

## Placement

- Embed diagrams near the prose they support.
- Reuse the same source diagram across docs via inclusion or links when the tool allows; otherwise keep one canonical copy and link to it.
- Update diagrams in the same change as structural code/config changes when feasible ([architecture-review.md](architecture-review.md)).

## Related Documents

- [diagram-selection.md](diagram-selection.md)
- [mermaid-standards.md](mermaid-standards.md)
- [component-relationships.md](component-relationships.md)
- [architecture-model.md](architecture-model.md)
- [templates/diagram.md](templates/diagram.md)
