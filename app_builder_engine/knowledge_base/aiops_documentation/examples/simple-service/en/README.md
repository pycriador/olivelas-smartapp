# Example: Simple Service (Fictional)

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

A small request/response service (architecture methodology) with:

- project overview;
- architecture overview (context, system, components, dependencies);
- optional system-context diagram;
- one component;
- one HTTP-style contract (illustrative only; HTTP is not required by the standard);
- one runbook;
- one ADR.

## How to Read

Start at [docs/project-overview.md](docs/project-overview.md).

## Structure

```text
simple-service/
├── README.md
└── docs/
    ├── project-overview.md
    ├── architecture/
    │   ├── overview.md
    │   └── system-context.md
    ├── application/
    │   └── notification-api.md
    ├── contracts/
    │   └── send-notification.md
    ├── operations/
    │   └── rb-high-error-rate.md
    └── decisions/
        └── adr-001-sync-request-response.md
```
