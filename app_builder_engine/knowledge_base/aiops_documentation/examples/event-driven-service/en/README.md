# Example: Event-Driven Service (Fictional)

> Language: EN | [Português (pt-BR)](../pt-BR/README.md)
>
> **This is a fictional example** for demonstrating the documentation standard.
>
> It does not describe a real project, service, or environment.
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

## What This Example Demonstrates

An event-driven service (architecture methodology) with:

- project overview;
- architecture with producers, consumers, events, and async boundaries;
- sequence diagram for inventory adjust;
- state diagram for projection apply;
- a worker component;
- an event contract (not HTTP);
- an integration document;
- a troubleshooting guide;
- one ADR.

## How to Read

Start at [docs/project-overview.md](docs/project-overview.md).

## Structure

```text
event-driven-service/
├── README.md
└── docs/
    ├── project-overview.md
    ├── architecture/
    │   ├── overview.md
    │   ├── sequence-inventory-adjust.md
    │   └── state-projection.md
    ├── application/
    │   ├── inventory-projector.md
    │   └── integration-inventory-adjusted.md
    ├── contracts/
    │   └── inventory-adjusted.md
    ├── operations/
    │   └── troubleshooting.md
    └── decisions/
        └── adr-001-async-projection.md
```
