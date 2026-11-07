# Example: Distributed System (Fictional)

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

A multi-service order fulfillment style system (architecture methodology) with:

- project overview across service boundaries;
- architecture overview (system boundary, services, trust/failure domains);
- data-flow documentation;
- two brief application components;
- one async event contract;
- one ADR for async fulfillment.

## How to Read

Start at [docs/project-overview.md](docs/project-overview.md).

## Structure

```text
distributed-system/
├── README.md
└── docs/
    ├── project-overview.md
    ├── architecture/
    │   ├── overview.md
    │   └── data-flow.md
    ├── application/
    │   ├── order-api.md
    │   └── fulfillment-worker.md
    ├── contracts/
    │   └── order-accepted.md
    └── decisions/
        └── adr-001-async-fulfillment.md
```
